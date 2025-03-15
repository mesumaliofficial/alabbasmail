"use client"
import Navbar from "@/components/Navbar";
import { useState } from "react";
import SentMails from "./sent";

const Inbox = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [activeTab, setActiveTab] = useState("Sent");
    return (
        <>
            <Navbar isOpen={isOpen} setIsOpen={setIsOpen} activeTab={activeTab} setActiveTab={setActiveTab} />

            <main
                className={`p-6 mt-8 transition-all duration-300 bg-gray-50 shadow-xl border border-gray-300 ${isOpen ? "ml-[265px] w-[calc(98%-16rem)]" : "w-full max-w-[95%] mx-auto"}`}>
                <SentMails />
            </main>
        </>
    );
}

export default Inbox