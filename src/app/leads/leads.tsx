import { useState, useEffect } from "react";
import { FaDownload, FaFileImport, FaUserPlus } from "react-icons/fa";
import * as XLSX from "xlsx";

const MailLeads = () => {
    const [leads, setLeads] = useState([
        { id: 1, name: "Ali Khan", email: "ali@example.com", phone: "+923001234567", addedAt: "" },
        { id: 2, name: "Ahmed Raza", email: "ahmed@example.com", phone: "+923002345678", addedAt: "" },
        { id: 3, name: "Sara Malik", email: "sara@example.com", phone: "+923003456789", addedAt: "" }
    ]);

    const [newLead, setNewLead] = useState({ name: "", email: "", phone: "" });

    // ✅ Set Dates After Client Mounts (Fix Hydration Issue)
    useEffect(() => {
        setLeads((prevLeads) =>
            prevLeads.map((lead) => ({
                ...lead,
                addedAt: new Date().toLocaleString(),
            }))
        );
    }, []);

    // ✅ Import Leads from Excel
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const binaryString = event.target?.result;
            const workbook = XLSX.read(binaryString, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const parsedData = XLSX.utils.sheet_to_json(sheet);

            const existingEmails = new Set(leads.map(lead => lead.email));

            const importedLeads = parsedData
                .filter((row: any) => row.name && row.email && row.phone && !existingEmails.has(row.email)) // Duplicate email check
                .map((row: any, index: number) => ({
                    id: leads.length + index + 1,
                    name: row.name,
                    email: row.email,
                    phone: row.phone,
                    addedAt: new Date().toLocaleString(), // ✅ Fix for client-side rendering
                }));

            setLeads([...leads, ...importedLeads]);
        };
        reader.readAsBinaryString(file);
    };

    // ✅ Download Leads as Excel
    const handleDownload = () => {
        const ws = XLSX.utils.json_to_sheet(leads);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Leads");
        XLSX.writeFile(wb, "leads.xlsx");
    };

    // ✅ Add Lead Manually
    const handleAddLead = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const emailExists = leads.some(lead => lead.email === newLead.email);
        
        if (emailExists) {
            alert("Error: Email already exists! Please use a different email.");
            return;
        }

        if (newLead.name && newLead.email && newLead.phone) {
            setLeads([...leads, { id: leads.length + 1, ...newLead, addedAt: new Date().toLocaleString() }]);
            setNewLead({ name: "", email: "", phone: "" });
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
            {/* Buttons */}
            <div className="flex justify-between mb-4">
                <label className="bg-blue-950 text-white px-4 py-2 rounded flex items-center gap-2 cursor-pointer">
                    <FaFileImport /> Import from Excel
                    <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="hidden" />
                </label>
                <button onClick={handleDownload} className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 cursor-pointer">
                    <FaDownload /> Download Leads
                </button>
            </div>

            {/* Leads Table */}
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 p-2 text-left">Name</th>
                        <th className="border border-gray-300 p-2 text-left">Email</th>
                        <th className="border border-gray-300 p-2 text-left">Phone</th>
                        <th className="border border-gray-300 p-2 text-left">Added At</th>
                    </tr>
                </thead>
                <tbody>
                    {leads.length > 0 ? (
                        leads.map((lead) => (
                            <tr key={lead.id} className="hover:bg-gray-100">
                                <td className="border border-gray-300 p-2">{lead.name}</td>
                                <td className="border border-gray-300 p-2">{lead.email}</td>
                                <td className="border border-gray-300 p-2">{lead.phone}</td>
                                <td className="border border-gray-300 p-2">{lead.addedAt}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="text-center p-4 text-gray-500">
                                No leads found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Add Lead Form */}
            <form onSubmit={handleAddLead} className="mt-6 p-4 border rounded bg-gray-50">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <FaUserPlus /> Add New Lead
                </h3>
                <div className="grid grid-cols-3 gap-4">
                    <input
                        type="text"
                        placeholder="Name"
                        value={newLead.name}
                        onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                        className="border p-2 rounded w-full"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={newLead.email}
                        onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                        className="border p-2 rounded w-full"
                        required
                    />
                    <input
                        type="tel"
                        placeholder="Phone"
                        value={newLead.phone}
                        onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                        className="border p-2 rounded w-full"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded w-full cursor-pointer"
                >
                    Add Lead
                </button>
            </form>
        </div>
    );
};

export default MailLeads;
