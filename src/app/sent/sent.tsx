"use client";

import { useEffect, useState } from "react";
import { FaCheck, FaCheckDouble, FaArrowLeft } from "react-icons/fa";

interface Email {
    _id: string;
    to: string;
    subject: string;
    message: string;
    sentAt: string;
    isSeen: boolean;
}

const SentMails: React.FC = () => {
    const [sentEmails, setSentEmails] = useState<Email[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

    useEffect(() => {
        const fetchEmails = async () => {
            try {
                const res = await fetch("/api/getSentEmails");
                if (!res.ok) throw new Error("Failed to fetch emails");
                
                let data: Email[] = await res.json();
                console.log("📩 Fetched Emails:", data);
                
                data = data.filter(email => email.sentAt && !isNaN(new Date(email.sentAt).getTime()));
                data.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
                
                setSentEmails(data);
            } catch (err) {
                setError("Error fetching emails");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        
        fetchEmails();
        const interval = setInterval(fetchEmails, 5000);
        return () => clearInterval(interval);
    }, []);

    const formatDateTime = (dateString: string | null | undefined): string => {
        if (!dateString) return "No Date";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            console.error("Invalid Date Detected:", dateString);
            return "Invalid Date";
        }
        return new Intl.DateTimeFormat("en-US", {
            day: "2-digit",
            year: "numeric",
            month: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
        }).format(date);
    };

    useEffect(() => {
        if (selectedEmail && !selectedEmail.isSeen) {
            console.log("📝 Updating email status:", selectedEmail._id);
            fetch("/api/updateEmailStatus", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ emailId: selectedEmail._id }),
            })
            .then((res) => {
                if (res.ok) {
                    console.log("✅ Email status updated successfully");
                    setSentEmails((prevEmails) =>
                        prevEmails.map((email) =>
                            email._id === selectedEmail._id ? { ...email, isSeen: true } : email
                        )
                    );
                } else {
                    console.error("❌ Failed to update email status");
                }
            })
            .catch((err) => console.error("❌ Error updating seen status:", err));
        }
    }, [selectedEmail]);

    return (
        <div className="p-4">
            {selectedEmail ? (
                <div className="p-6 max-w-2xl mx-auto bg-white shadow-md rounded-lg">
                    <button 
                        onClick={() => setSelectedEmail(null)}
                        className="mb-4 flex items-center space-x-2 text-blue-600 hover:underline"
                    >
                        <FaArrowLeft /> <span>Back to Sent</span>
                    </button>

                    <h2 className="text-xl font-semibold">{selectedEmail.subject}</h2>
                    <p className="text-gray-500 text-sm">To: {selectedEmail.to}</p>
                    <p className="text-gray-500 text-sm">Sent: {formatDateTime(selectedEmail.sentAt)}</p>
                    <hr className="my-3" />
                    <div className="prose max-w-none">
                        {selectedEmail.message}
                    </div>
                </div>
            ) : (
                <>
                    <h1 className="text-2xl font-bold mb-4">Sent Mails</h1>
                    {loading && (
                        <div className="text-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="mt-2 text-gray-600">Loading emails...</p>
                        </div>
                    )}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Error: </strong>
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                    {!loading && !error && (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border border-gray-300 p-2 text-left">Recipient</th>
                                        <th className="border border-gray-300 p-2 text-left">Subject</th>
                                        <th className="border border-gray-300 p-2 text-left">Date</th>
                                        <th className="border border-gray-300 p-2 text-left">Seen Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sentEmails.length > 0 ? (
                                        sentEmails.map((email) => (
                                            <tr 
                                                key={email._id} 
                                                className="hover:bg-gray-100 cursor-pointer" 
                                                onClick={() => setSelectedEmail(email)}
                                            >
                                                <td className="border border-gray-300 p-2">{email.to}</td>
                                                <td className="border border-gray-300 p-2">{email.subject}</td>
                                                <td className="border border-gray-300 p-2">{formatDateTime(email.sentAt)}</td>
                                                <td className="border border-gray-300 p-2 text-center">
                                                    {email.isSeen ? (
                                                        <FaCheckDouble className="text-blue-500 text-lg" />
                                                    ) : (
                                                        <FaCheck className="text-gray-500 text-lg" />
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="text-center p-4 text-gray-500">
                                                No sent emails found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default SentMails;