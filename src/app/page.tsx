"use client";

import { useState } from "react";
import Navbar from "./Components/Navbar";
import Inbox from "./Components/Inbox";

export default function Home() {
    const [isOpen, setIsOpen] = useState(true); // Sidebar State

    return (
        <div className="overflow-x-hidden">
            {/* Navbar & Sidebar */}
            <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />

            {/* Main Content Container */}
            <main
                className={`mt-20 transition-all duration-300 bg-gray-50 shadow-xl 
                ${isOpen ? "ml-[264px] w-[calc(100%-16rem)]" : "w-full max-w-[98%] mx-auto"}`}
            >
                <Inbox />
            </main>
        </div>
    );
}
