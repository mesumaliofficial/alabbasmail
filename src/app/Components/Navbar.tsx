"use client";

import { IoMdMail } from "react-icons/io";
import Link from 'next/link';
import { useState } from "react";
import { IoMdMenu, IoMdClose, IoMdLogOut } from "react-icons/io";

export default function Layout() {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <>
            {/* Full-screen Navbar */}
            <nav className="fixed top-0 left-0 w-full bg-gray-50 shadow py-3 px-6 flex justify-between items-center z-50">
                <h1 className="text-2xl font-bold flex items-center space-x-2">
                    <IoMdMail className="text-blue-950 text-3xl" />
                    <span>Mailbox</span>
                </h1>
                <div className="flex items-center space-x-4">
                    <button onClick={() => setIsOpen(!isOpen)} className="text-2xl bg-gray-200 p-2 rounded-full shadow-lg">
                        {isOpen ? <IoMdClose /> : <IoMdMenu />}
                    </button>
                    <button className="text-2xl bg-gray-200 p-2 rounded-full shadow-lg">
                        <IoMdLogOut />
                    </button>
                </div>
            </nav>

            {/* Sidebar */}
            <div className={`fixed top-16 left-0 h-[calc(100%-4rem)] bg-gray-50 shadow-lg w-64 p-6 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 z-40`}>                
                <ul className="space-y-4 mt-4">
                    <li><Link href="/" className="hover:text-blue-500 border-b-2 border-blue-950 pb-1">Inbox</Link></li>
                    <li><Link href="/about" className="hover:text-blue-500">Campaign</Link></li>
                    <li><Link href="/services" className="hover:text-blue-500">Trash</Link></li>
                    <li><Link href="/contact" className="hover:text-blue-500">Settings</Link></li>
                </ul>
            </div>
        </>
    );
}