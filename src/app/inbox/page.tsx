"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import MailInbox from "@/app/inbox/Inbox";

export default function Inbox() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
        <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
  
        <main
          className={`p-6 mt-8 transition-all duration-300 bg-gray-50 shadow-xl ${isOpen ? "ml-[265px] w-[calc(98%-16rem)]" : "w-full max-w-[95%] mx-auto"}`}>
          <MailInbox />
        </main>
      </>
    );
  }
  