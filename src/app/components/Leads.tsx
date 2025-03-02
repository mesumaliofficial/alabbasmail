"use client";
import { useState } from "react";
import { IoMdTrash } from "react-icons/io";
import { FiUser } from "react-icons/fi";

interface Lead {
    id: number;
    name: string;
    email: string;
    company: string;
    status: string;
    addedAt: string;
}

export default function Leads() {
    const [leads, setLeads] = useState<Lead[]>([
        { id: 1, name: "Ali Khan", email: "ali@example.com", company: "Tech Solutions", status: "Interested", addedAt: "March 2, 2025" },
        { id: 2, name: "Sara Ahmed", email: "sara@example.com", company: "Creative Studio", status: "Follow-up", addedAt: "March 1, 2025" },
        { id: 3, name: "Zain Malik", email: "zain@example.com", company: "Marketing Hub", status: "Not Interested", addedAt: "Feb 28, 2025" },
    ]);

    const [selectedLeads, setSelectedLeads] = useState<number[]>([]);

    const toggleLeadSelection = (id: number) => {
        setSelectedLeads((prev) => prev.includes(id) ? prev.filter(leadId => leadId !== id) : [...prev, id]);
    };

    const updateLeadStatus = (id: number, newStatus: string) => {
        setLeads(leads.map((lead) => lead.id === id ? { ...lead, status: newStatus } : lead));
    };

    const deleteLead = (id: number) => {
        setLeads(leads.filter((lead) => lead.id !== id));
        setSelectedLeads(selectedLeads.filter((leadId) => leadId !== id));
    };

    return (
        <div className="p-6 max-w-screen-lg mx-auto">
            <h2 className="text-2xl font-bold text-blue-950 mb-4">Leads Management</h2>
            <p className="text-gray-700">Manage your leads and send bulk emails.</p>

            <div className="mt-6 bg-white shadow-md rounded-lg overflow-hidden">
                {leads.length === 0 ? (
                    <p className="text-center text-gray-500 py-6">No leads available.</p>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {leads.map((lead) => (
                            <li key={lead.id} className="p-4 flex justify-between items-center transition bg-white hover:bg-gray-200">
                                <div className="flex items-center space-x-4">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedLeads.includes(lead.id)} 
                                        onChange={() => toggleLeadSelection(lead.id)}
                                        className="w-5 h-5"
                                    />
                                    <div className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full">
                                        <FiUser className="text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg text-black">{lead.name}</h3>
                                        <p className="text-sm text-gray-600">{lead.email} - {lead.company}</p>
                                        <p className="text-xs text-gray-400">{lead.addedAt} | 
                                            <select 
                                                value={lead.status} 
                                                onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                                                className="ml-2 border px-2 py-1 rounded-md"
                                            >
                                                <option value="Interested">Interested</option>
                                                <option value="Follow-up">Follow-up</option>
                                                <option value="Not Interested">Not Interested</option>
                                            </select>
                                        </p>
                                    </div>
                                </div>
                                <button onClick={() => deleteLead(lead.id)} className="text-red-500 hover:text-red-700">
                                    <IoMdTrash className="text-xl" />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
