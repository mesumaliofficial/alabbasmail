"use client"
import Navbar from "@/components/Navbar";
import { useState } from "react";
import MailLeads from "./leads";

const Leads = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [activeTab, setActiveTab] = useState("Leads");
    return (
        <>
            <Navbar isOpen={isOpen} setIsOpen={setIsOpen} activeTab={activeTab} setActiveTab={setActiveTab} />

            <main
                className={`p-6 mt-8 transition-all duration-300 bg-gray-50 shadow-xl border border-gray-300 ${isOpen ? "ml-[265px] w-[calc(98%-16rem)]" : "w-full max-w-[95%] mx-auto"}`}>
                <MailLeads />
            </main>
        </>
    );
}

export default Leads