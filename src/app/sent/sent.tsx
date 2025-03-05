"use client";

import { useEffect, useState } from "react";
import { FaCheck, FaCheckDouble } from "react-icons/fa";

interface Email {
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

    useEffect(() => {
        const fetchEmails = async () => {
            try {
                const res = await fetch("/api/getSentEmails");
                if (!res.ok) throw new Error("Failed to fetch emails");

                const data = await res.json();
                setSentEmails(data);
            } catch (err) {
                setError("Error fetching emails");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEmails();
    }, []);

    // ✅ Function to format date & time properly
    const formatDateTime = (dateString: string): string => {
        return new Intl.DateTimeFormat("en-US", {
            day: "2-digit",
            year: "numeric",
            month: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
        }).format(new Date(dateString));
    };

    // ✅ Fixed Function to truncate text (max 50 words)
    const truncateWords = (text: string, maxWords: number): string => {
        if (!text) return ""; // Handle empty message
        const words = text.trim().split(/\s+/); // Fix for multiple spaces
        console.log(words); // Debugging purpose
        return words.length > maxWords ? words.slice(0, maxWords).join(" ") + "..." : text;
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Sent Mails</h1>

            {loading && <p>Loading emails...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 p-2 text-left">Recipient</th>
                                <th className="border border-gray-300 p-2 text-left">Subject</th>
                                <th className="border border-gray-300 p-2 text-left w-[40%]">Message</th>
                                <th className="border border-gray-300 p-2 text-left">Date</th>
                                <th className="border border-gray-300 p-2 text-left">Seen Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sentEmails.length > 0 ? (
                                sentEmails.map((email, index) => (
                                    <tr key={index} className="hover:bg-gray-100">
                                        <td className="border border-gray-300 p-2 max-w-[200px] truncate">
                                            {truncateWords(email.to, 19)}
                                        </td>
                                        <td className="border border-gray-300 p-2 max-w-[150px] truncate">
                                            {truncateWords(email.subject, 20)}
                                        </td>
                                        <td className="border border-gray-300 p-2 overflow-hidden whitespace-nowrap text-ellipsis truncate">
                                            {truncateWords(email.message, 50)}
                                        </td>
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
                                    <td colSpan={5} className="text-center p-4 text-gray-500">
                                        No sent emails found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default SentMails;
