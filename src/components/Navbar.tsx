"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaInbox, FaSignOutAlt, FaTimes, FaPaperPlane, FaFileAlt, FaTrash, FaSpa, FaPen, FaPaperclip, } from "react-icons/fa";
import { FaBars, FaBell, FaUserTie } from "react-icons/fa6";

interface FormData {
    to: string;
    subject: string;
    message: string;
    attachments: File[];
}

const Navbar = ({
    isOpen,
    setIsOpen,
    activeTab,
    setActiveTab,
}: {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
}) => {
    const router = useRouter();

    useEffect(() => {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        if (!isLoggedIn) {
            router.push("/");
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        router.push("/");
    };

    const [isComposeOpen, setIsComposeOpen] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        to: "",
        subject: "",
        message: "",
        attachments: [],
    });

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newFiles = Array.from(files);
        const validTypes = ["image/png", "image/jpeg", "application/pdf", "text/plain"];
        const filteredFiles = newFiles.filter((file) => validTypes.includes(file.type));

        if (filteredFiles.length !== newFiles.length) {
            alert("❌ Some files were removed due to invalid format! (Allowed: PNG, JPEG, PDF, TXT)");
        }

        setFormData((prev) => ({
            ...prev,
            attachments: [...prev.attachments, ...filteredFiles],
        }));
    };

    const removeAttachment = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus("");

        try {
            const response = await fetch("/api/sendEmail", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    to: formData.to,
                    subject: formData.subject,
                    message: formData.message,
                }),
            });

            const result = await response.json();
            if (result.success) {
                setStatus("✅ Email Sent & Saved!");
                setFormData({ to: "", subject: "", message: "", attachments: [] });
            } else {
                setStatus("❌ Error Saving Email!");
            }
        } catch (error) {
            console.error("Error sending email:", error); // Log the error
            setStatus("❌ Failed to Send Email.");
        }

        setLoading(false);
    };

    return (
        <>
            <nav className="sticky top-0 py-3 px-5 bg-white shadow-md flex items-center justify-between z-50">
                <div className="flex items-center space-x-4">
                    <button onClick={handleLogout} className="text-2xl flex items-center space-x-2 font-bold text-blue-950">
                        <FaInbox size={30} />
                        <span>Mail Box</span>
                    </button>
                    <button className="text-2xl ml-16 font-light focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>

                <div className="flex items-center space-x-6 ml-auto">
                    <button className="text-2xl text-gray-700 hover:text-blue-700 focus:outline-none">
                        <FaBell />
                    </button>

                    <button onClick={handleLogout} className="px-4 py-1 flex items-center space-x-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none">
                        <FaSignOutAlt />
                        <span>Logout</span>
                    </button>
                </div>
            </nav>


            <aside className={`fixed top-[56px] left-0 h-full w-64 bg-black/80 text-white transition-transform transform ${isOpen ? "translate-x-0" : "-translate-x-64"}`}>
                <ul className="mt-4 space-y-2 p-3">
                    {[
                        { name: "Inbox", route: "/inbox", icon: <FaInbox /> },
                        { name: "Sent", route: "/sent", icon: <FaPaperPlane /> },
                        { name: "Leads", route: "/leads", icon: <FaUserTie /> },
                        { name: "Drafts", route: "/drafts", icon: <FaFileAlt /> },
                        { name: "Spam", route: "/spam", icon: <FaSpa /> },
                        { name: "Trash", route: "/trash", icon: <FaTrash /> },
                    ].map((item) => (
                        <li
                            key={item.name}
                            className={`flex items-center p-3 cursor-pointer space-x-3 rounded-lg transition duration-200 
                            ${activeTab === item.name ? "bg-gray-600 border-l-4 border-white" : "hover:bg-gray-600"}`}
                            onClick={() => {
                                setActiveTab(item.name);
                                router.push(item.route);
                            }}
                        >
                            {item.icon} <span>{item.name}</span>
                        </li>
                    ))}
                </ul>

                <button onClick={() => setIsComposeOpen(true)} className="absolute bottom-24 left-5 w-52 px-5 py-3 bg-gray-500 text-white rounded-full flex items-center justify-center space-x-2 hover:bg-gray-800 transition">
                    <FaPen />
                    <span>Compose</span>
                </button>
            </aside>

            {isComposeOpen && (
                <div className="fixed right-4 bottom-4 w-[400px] bg-white shadow-2xl border border-gray-300 rounded-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-black to-gray-800 p-4 flex justify-between items-center border-b border-gray-500">
                        <h2 className="text-lg text-white font-semibold">New Email</h2>
                        <button className="text-white hover:text-red-400 transition" onClick={() => setIsComposeOpen(false)}>
                            <FaTimes size={20} />
                        </button>
                    </div>

                    <form className="p-5 space-y-4" onSubmit={handleSubmit}>
                        <input type="email" name="to" value={formData.to} onChange={handleChange} placeholder="Recipient Email" className="w-full p-3 bg-gray-100 rounded-xl border border-gray-300" required />
                        <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject" className="w-full p-3 bg-gray-100 rounded-xl border border-gray-300" required />
                        <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Message" className="w-full p-3 bg-gray-100 rounded-xl border border-gray-300 h-32" required></textarea>

                        <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                            <FaPaperclip size={18} />
                            <span>Attach Files</span>
                            <input type="file" onChange={handleFileChange} className="hidden" multiple />
                        </label>

                        {formData.attachments.map((file, index) => (
                            <div key={index} className="flex justify-between bg-gray-100 px-3 py-2 rounded-md mt-1">
                                <span>{file.name}</span>
                                <button onClick={() => removeAttachment(index)} className="text-red-500"><FaTimes /></button>
                            </div>
                        ))}

                        <button type="submit" disabled={loading} className={`w-full p-3 rounded-xl text-white transition ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-black/90 hover:bg-black"}`}>
                            {loading ? "Sending..." : "Send"}
                        </button>
                    </form>
                    {status && <p className="text-center text-sm font-medium text-gray-700 pb-2">{status}</p>}
                </div>
            )}
        </>
    );
};
export default Navbar;