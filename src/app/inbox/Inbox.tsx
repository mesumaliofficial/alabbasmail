"use client";
import { useState, useEffect } from "react";
import EmailContentComponent from "../../components/EmailContent";

interface Email {
    id: number;
    sender: string;
    senderFull: string;
    subject: string;
    subjectFull: string;
    preview: string;
    previewFull: string;
    date: string;
    isUnread: boolean;
    body: string;
    isHtml: boolean;
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12 || 12;
    return `${day}/${month}/${year} / ${hours}:${minutes}${ampm}`;
};

const EmailContent: React.FC<{ email: Email }> = ({ email }) => {
    console.log('Rendering email content:', {
        id: email.id,
        isHtml: email.isHtml,
        bodyLength: email.body.length,
        bodyPreview: email.body.substring(0, 100) + '...'
    });

    return (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
            <div className="mb-6 border-b pb-4">
                <h2 className="text-2xl font-semibold mb-2">{email.subject}</h2>
                <div className="text-gray-600">
                    <p><strong>From:</strong> {email.sender}</p>
                    <p><strong>Date:</strong> {formatDate(email.date)}</p>
                </div>
            </div>
            <div 
                className={`email-content overflow-auto max-h-[70vh] ${
                    email.isHtml ? 'html-email' : 'text-email'
                }`}
                dangerouslySetInnerHTML={{ __html: email.body }}
            />
        </div>
    );
};

const MailInbox = () => {
    const [emails, setEmails] = useState<Email[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

    useEffect(() => {
        const fetchEmails = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch("/api/getEmails");
                if (!response.ok) {
                    throw new Error(`API Error: ${response.statusText}`);
                }
                const data = await response.json();
                console.log('Fetched emails:', {
                    count: data.length,
                    sample: data[0] ? {
                        id: data[0].id,
                        subject: data[0].subject,
                        hasHtml: data[0].isHtml
                    } : 'No emails'
                });
                setEmails(data);
            } catch (error: any) {
                console.error("Failed to fetch emails:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEmails();
    }, []);

    // Add styles for HTML emails
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            .html-email img {
                max-width: 100%;
                height: auto;
            }
            .html-email {
                font-family: Arial, sans-serif;
            }
            .html-email a {
                color: #1a73e8;
                text-decoration: none;
            }
            .html-email a:hover {
                text-decoration: underline;
            }
        `;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    const handleEmailClick = (email: Email) => {
        setSelectedEmail(email);
    };

    const handleBack = () => {
        setSelectedEmail(null);
    };

    return (
        <div className="p-6 max-w-[1200px] mx-auto bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                <span className="mr-2">📬</span> 
                <span>Mail Inbox</span>
            </h1>

            {loading ? (
                <div className="text-center p-8 bg-white rounded-lg shadow-sm">
                    <div className="animate-pulse text-gray-500 flex items-center justify-center">
                        <span className="mr-2">📩</span>
                        Loading emails...
                    </div>
                </div>
            ) : error ? (
                <div className="text-center p-8 bg-white rounded-lg shadow-sm">
                    <div className="text-red-500 flex items-center justify-center">
                        <span className="mr-2">❌</span>
                        {error}
                    </div>
                </div>
            ) : emails.length === 0 ? (
                <div className="text-center p-8 bg-white rounded-lg shadow-sm">
                    <div className="text-gray-500">No new emails.</div>
                </div>
            ) : selectedEmail ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6">
                        <button 
                            onClick={handleBack} 
                            className="mb-6 text-[#1a73e8] hover:text-blue-700 flex items-center transition-colors font-medium rounded-full px-4 py-2 hover:bg-blue-50"
                        >
                            <span className="mr-2">←</span> Back to Inbox
                        </button>
                        <div className="email-header mb-6 pb-4 border-b border-gray-200">
                            <h2 className="text-2xl font-normal text-[#202124] mb-4">
                                {selectedEmail.subjectFull}
                            </h2>
                            <div className="flex items-start space-x-4">
                                <div className="flex-1">
                                    <div className="flex items-center mb-1">
                                        <span className="font-medium text-[#202124]">
                                            {selectedEmail.senderFull}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {formatDate(selectedEmail.date)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <EmailContentComponent email={selectedEmail} />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="border border-gray-300 p-2 text-left font-semibold  w-1/4">Sender</th>
                                <th className="border border-gray-300 p-2 text-left font-semibold  w-1/4">Subject</th>
                                <th className="border border-gray-300 p-2 text-left font-semibold ">Preview</th>
                                <th className="border border-gray-300 p-2 text-left font-semibold  w-[150px]">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {emails.map((email) => (
                                <tr
                                    key={email.id}
                                    onClick={() => handleEmailClick(email)}
                                    className={`
                                        cursor-pointer border-b border-gray-100 last:border-b-0
                                        hover:bg-gray-50 transition-colors
                                        ${email.isUnread ? "bg-[#f2f6fc] font-medium" : "bg-white"}
                                    `}
                                >
                                    <td 
                                        className="border border-gray-300 p-2" 
                                        title={email.senderFull}
                                    >
                                        <span className="text-[#1a73e8] hover:underline">
                                            {email.sender}
                                        </span>
                                    </td>
                                    <td 
                                        className="border border-gray-300 p-2" 
                                        title={email.subjectFull}
                                    >
                                        <span className={email.isUnread ? "font-semibold" : ""}>
                                            {email.subject}
                                        </span>
                                    </td>
                                    <td 
                                        className="border border-gray-300 p-2" 
                                        title={email.previewFull}
                                    >
                                        {email.preview}
                                    </td>
                                    <td className="border border-gray-300 p-2 text-sm whitespace-nowrap">
                                        {formatDate(email.date)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MailInbox;
