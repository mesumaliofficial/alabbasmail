"use client";

import { IoMdMail, IoMdMenu, IoMdClose, IoMdLogOut, IoMdSearch } from "react-icons/io";
import Link from "next/link"

export default function Navbar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) {
    return (
        <>
            {/* Full-screen Navbar */}
            <nav className="fixed bg-blue-50 top-0 left-0 w-full shadow-md py-3 px-6 flex justify-between items-center z-50">
                {/* Logo */}
                <div className="flex items-center space-x-1 text-blue-950">
                    <IoMdMail className="text-2xl text-blue-950" />
                    <h1 className="text-xl font-bold">Mailbox</h1>
                </div>

                {/* Search Bar */}
                <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-md w-1/3">
                    <IoMdSearch className="text-gray-500 text-xl" />
                    <input
                        type="text" placeholder="Search..." className="ml-2 outline-none w-full text-gray-700"/>
                </div>

                {/* Buttons */}
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-white text-xl border border-blue-950 bg-blue-950 p-2 rounded-full shadow-md"
                    >
                        {isOpen ? <IoMdClose /> : <IoMdMenu />}
                    </button>
                    <button className="text-white text-xl bg-blue-950 p-2 rounded-full shadow-md">
                        <IoMdLogOut />
                    </button>
                </div>
            </nav>

            {/* Sidebar */}
            <div className={`fixed top-16 left-0 h-[calc(100%-4rem)] bg-transparent shadow-2xl w-56 p-6 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 z-40`}>
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
