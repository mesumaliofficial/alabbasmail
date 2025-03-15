"use client";
import { useState, useEffect } from "react";
import { FaDownload, FaFileImport, FaUserPlus } from "react-icons/fa";
import * as XLSX from "xlsx";
import { client } from "@/sanity/lib/client";

interface Lead {
    _id: string;
    _type: string;
    name: string;
    email: string;
    phone: string;
    addedAt?: string;
    _createdAt?: string;
}

interface NewLead {
    name: string;
    email: string;
    phone: string;
}

interface ExcelRow {
    name: string;
    email: string;
    phone: string;
}

const MailLeads = () => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [newLead, setNewLead] = useState<NewLead>({ name: "", email: "", phone: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        fetchLeads();
    }, []);

    // Add useEffect to clear success message after 5 seconds
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) {
            return "No date";
        }
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                console.error("Invalid date:", dateString);
                return "Invalid Date";
            }
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (err) {
            console.error("Error formatting date:", err);
            return "Invalid Date";
        }
    };

    const fetchLeads = async () => {
        try {
            setError(null);
            const query = `*[_type == "lead"] | order(_createdAt desc)`;
            const sanityLeads = await client.fetch(query);
            console.log("Fetched leads:", sanityLeads);
            
            // Add addedAt field if it doesn't exist
            const leadsWithDates = sanityLeads.map((lead: Lead) => ({
                ...lead,
                addedAt: lead.addedAt || lead._createdAt || new Date().toISOString()
            }));
            
            setLeads(leadsWithDates);
        } catch (err) {
            console.error("Error fetching leads:", err);
            setError("Failed to fetch leads. Please try again.");
        }
    };

    const addLeadToSanity = async (lead: NewLead) => {
        try {
            setLoading(true);
            setError(null);
            setSuccessMessage(null);
            
            const leadWithTime = {
                ...lead,
                addedAt: new Date().toISOString()
            };
            
            const response = await fetch("/api/addLead", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(leadWithTime),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to add/update lead");
            }

            setSuccessMessage(data.message);
            await fetchLeads();
            return true;
        } catch (error: unknown) {
            console.error("Error adding/updating lead:", error);
            setError(error instanceof Error ? error.message : "Failed to add/update lead. Please try again later.");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleAddLead = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validate required fields
        if (!newLead.name || !newLead.email || !newLead.phone) {
            setError("Please fill all fields!");
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newLead.email)) {
            setError("Please enter a valid email address!");
            return;
        }

        const success = await addLeadToSanity(newLead);
        if (success) {
            setNewLead({ name: "", email: "", phone: "" });
            setError(null);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event: ProgressEvent<FileReader>) => {
            try {
                setLoading(true);
                setError(null);
                setSuccessMessage(null);

                const binaryString = event.target?.result as string;
                const workbook = XLSX.read(binaryString, { type: "binary" });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                
                interface ExcelData {
                    Name?: string;
                    name?: string;
                    Email?: string;
                    email?: string;
                    Phone?: string;
                    phone?: string;
                }
                
                const rawData = XLSX.utils.sheet_to_json<ExcelData>(sheet);

                // Clean and validate the data
                const parsedData: ExcelRow[] = rawData.map(row => ({
                    name: String(row.name || row.Name || "").trim(),
                    email: String(row.email || row.Email || "").trim().toLowerCase(),
                    phone: String(row.phone || row.Phone || "").trim(),
                    addedAt: new Date().toISOString()
                }));

                let successCount = 0;
                let updateCount = 0;
                let errorCount = 0;

                for (const lead of parsedData) {
                    // Skip empty rows
                    if (!lead.name || !lead.email || !lead.phone) {
                        errorCount++;
                        continue;
                    }

                    try {
                        const response = await fetch("/api/addLead", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(lead),
                        });

                        const result = await response.json();
                        if (result.isUpdate) {
                            updateCount++;
                        } else {
                            successCount++;
                        }
                    } catch (err) {
                        console.error("Error adding lead:", err);
                        errorCount++;
                    }
                }

                await fetchLeads();
                
                // Show summary message
                setSuccessMessage(
                    `Import complete: ${successCount} new leads added, ${updateCount} leads updated` +
                    (errorCount > 0 ? `, ${errorCount} failed` : "")
                );
            } catch (err) {
                console.error("Error importing leads:", err);
                setError("Failed to import leads. Please check your Excel file format.");
            } finally {
                setLoading(false);
                // Clear the file input
                e.target.value = "";
            }
        };
        reader.readAsBinaryString(file);
    };

    const handleDownload = () => {
        // Create a clean version of the data for Excel
        const cleanData = leads.map((lead, index) => ({
            ID: index + 1,
            Name: lead.name,
            Email: lead.email,
            Phone: lead.phone,
            "Added At": formatDate(lead.addedAt)
        }));

        // Create the worksheet
        const ws = XLSX.utils.json_to_sheet(cleanData);

        // Add a template row with formulas
        const templateRow = {
            ID: cleanData.length + 1,
            Name: "",
            Email: "",
            Phone: "",
            "Added At": "=NOW()"  // Excel formula for current date/time
        };

        // Add the template row
        XLSX.utils.sheet_add_json(ws, [templateRow], {
            header: ["ID", "Name", "Email", "Phone", "Added At"],
            skipHeader: true,
            origin: -1  // Append at the end
        });

        // Set custom column widths
        const colWidths = [
            { wch: 5 },   // ID
            { wch: 25 },  // Name
            { wch: 30 },  // Email
            { wch: 15 },  // Phone
            { wch: 20 }   // Added At
        ];
        ws['!cols'] = colWidths;

        // Create and save the workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Leads");

        // Add template sheet with instructions
        const templateWs = XLSX.utils.aoa_to_sheet([
            ["Instructions for Adding New Leads:"],
            ["1. Enter lead information in the 'Leads' sheet"],
            ["2. The 'Added At' column will automatically update with current time"],
            ["3. Copy the formula (=NOW()) down for new rows"],
            ["4. Save the file and import it back into the system"],
            [],
            ["Template Format:"],
            ["ID", "Name", "Email", "Phone", "Added At"],
            [1, "John Doe", "john@example.com", "1234567890", "=NOW()"]
        ]);

        // Set column widths for template sheet
        templateWs['!cols'] = [{ wch: 40 }];
        XLSX.utils.book_append_sheet(wb, templateWs, "Instructions");

        // Save the file
        XLSX.writeFile(wb, `leads_template_${formatDateForFile(new Date())}.xlsx`);
    };

    // Helper function to format date for filename
    const formatDateForFile = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                    {error}
                </div>
            )}
            
            {successMessage && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-600 rounded-lg">
                    {successMessage}
                </div>
            )}
            
            <div className="flex justify-between mb-4">
                <label className="bg-blue-950 text-white px-4 py-2 rounded flex items-center gap-2 cursor-pointer hover:bg-blue-900 transition-colors">
                    <FaFileImport /> Import from Excel
                    <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="hidden" />
                </label>
                <button 
                    onClick={handleDownload} 
                    disabled={leads.length === 0}
                    className={`px-4 py-2 rounded flex items-center gap-2 ${
                        leads.length === 0 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-green-600 hover:bg-green-700 cursor-pointer'
                    } text-white transition-colors`}
                >
                    <FaDownload /> Download Leads
                </button>
            </div>

            <table className="w-full border-collapse border border-gray-300 mb-6">
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
                            <tr key={lead._id} className="hover:bg-gray-100">
                                <td className="border border-gray-300 p-2">{lead.name}</td>
                                <td className="border border-gray-300 p-2">{lead.email}</td>
                                <td className="border border-gray-300 p-2">{lead.phone}</td>
                                <td className="border border-gray-300 p-2">
                                    {formatDate(lead.addedAt)}
                                </td>
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

            <form onSubmit={handleAddLead} className="mt-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <FaUserPlus /> Add New Lead
                </h3>
                <div className="grid grid-cols-3 gap-4">
                    <input 
                        type="text" 
                        placeholder="Name" 
                        value={newLead.name} 
                        onChange={(e) => setNewLead({ ...newLead, name: e.target.value })} 
                        className="border p-2 rounded w-full bg-white" 
                        required 
                        key="name-input"
                        disabled={loading}
                    />
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={newLead.email} 
                        onChange={(e) => setNewLead({ ...newLead, email: e.target.value })} 
                        className="border p-2 rounded w-full bg-white !important" 
                        required 
                        key="email-input"
                        suppressHydrationWarning
                        disabled={loading}
                    />
                    <input 
                        type="tel" 
                        placeholder="Phone" 
                        value={newLead.phone} 
                        onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })} 
                        className="border p-2 rounded w-full bg-white" 
                        required 
                        key="phone-input"
                        disabled={loading}
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={loading}
                    className={`mt-4 w-full px-4 py-2 rounded text-white transition-colors ${
                        loading 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                    }`}
                >
                    {loading ? 'Adding Lead...' : 'Add Lead'}
                </button>
            </form>
        </div>
    );
};

export default MailLeads;