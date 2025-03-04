"use client";
import { useState,  useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaInbox, FaSignOutAlt, FaTimes, FaPaperPlane, FaFileAlt, FaTrash, FaSpa, FaPen } from "react-icons/fa";
import { FaBars, FaBell, FaEnvelope } from "react-icons/fa6";

const Navbar = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (value: boolean) => void }) => {
    const [activeTab, setActiveTab] = useState("Inbox");
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

    return (
        <>
            <nav className="py-3 px-10 bg-white shadow-md flex items-center justify-between">
                {/* Left Side: Logo & Menu Button */}
                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleLogout}
                        className="text-2xl flex items-center space-x-2 font-bold text-blue-950"
                    >
                        <FaInbox size={30} />
                        <span>Mail Box</span>
                    </button>

                    <button
                        className="text-2xl ml-16 font-light focus:outline-none"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>

                {/* Center: Search Bar */}
                <div className="hidden md:flex ml-4 items-center bg-gray-100 border border-gray-300 px-3 py-1 rounded-full">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-transparent outline-none px-2 text-gray-800 w-60"
                    />
                </div>

                {/* Right Side: Fully Right Aligned Icons */}
                <div className="flex items-center space-x-6 ml-auto">
                    {/* Message Icon with Notification */}
                    <div className="relative">
                        <button className="text-2xl text-gray-700 hover:text-blue-700 focus:outline-none">
                            <FaEnvelope />
                        </button>
                        <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">0</span>
                    </div>

                    {/* Notification Bell */}
                    <button className="text-2xl text-gray-700 hover:text-blue-700 focus:outline-none">
                        <FaBell />
                    </button>

                    {/* Logout Button with Icon */}
                    <button
                        onClick={() => {
                            localStorage.removeItem("isLoggedIn");
                            router.push("/");
                        }}
                        className="px-4 py-1 flex items-center space-x-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none"
                    >
                        <FaSignOutAlt />
                        <span>Logout</span>
                    </button>
                </div>
            </nav>

            {/* Sidebar */}
            <aside className={`fixed top-[59px] left-0 h-full w-64 bg-black/80 text-white transition-transform transform ${isOpen ? "translate-x-0" : "-translate-x-64"}`}>
                <ul className="mt-4 space-y-2 p-3">
                    {[
                        { name: "Inbox", route: "/inbox", icon: <FaInbox /> },
                        { name: "Sent", route: "/sent", icon: <FaPaperPlane /> },
                        { name: "Drafts", route: "/drafts", icon: <FaFileAlt /> },
                        { name: "Spam", route: "/spam", icon: <FaSpa /> },
                        { name: "Trash", route: "/trash", icon: <FaTrash /> }
                    ].map((item) => (
                        <li
                            key={item.name}
                            className={`flex items-center p-3 cursor-pointer space-x-3 rounded-lg transition duration-200 
                            ${activeTab === item.name ? "bg-blue-800 border-l-4 border-white" : "hover:bg-blue-800"}`}
                            onClick={() => {
                                setActiveTab(item.name);
                                router.push(item.route);
                            }}
                        >
                            {item.icon} <span>{item.name}</span>
                        </li>
                    ))}
                </ul>
                {/* Compose Button */}
                <button
                    onClick={() => router.push("/compose")}
                    className="absolute bottom-24 left-5 w-52 px-5 py-3 bg-blue-600 text-white rounded-full flex items-center justify-center space-x-2 hover:bg-blue-700 transition"
                >
                    <FaPen />
                    <span>Compose</span>
                </button>
            </aside>
        </>
    );
};

export default Navbar;
