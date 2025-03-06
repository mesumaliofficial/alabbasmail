"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";

type Email = {
    subject: string;
    to: string;
    message: string;
};

const EmailDetails = () => {
    const params = useParams();
    const router = useRouter();
    
    const id = Array.isArray(params?.id) ? params.id[0] : params?.id || "";

    const [email, setEmail] = useState<Email | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmail = async () => {
            try {
                const response = await fetch(`/api/getEmailById?id=${id}`);
                const data: Email = await response.json();
                setEmail(data);
            } catch (error) {
                console.error("Error fetching email:", error);
            }
            setLoading(false);
        };

        if (id) fetchEmail();
    }, [id]);

    if (loading) return <p className="p-6 text-gray-500">Loading email...</p>;
    if (!email) return <p className="p-6 text-gray-500">Email not found.</p>;

    return (
        <div className="p-6 max-w-3xl mx-auto bg-white shadow-lg rounded-xl border border-gray-200">
            <button
                onClick={() => router.push("/sent")}
                className="mb-4 flex items-center space-x-2 text-blue-600 hover:underline"
            >
                <FaArrowLeft className="text-lg" /> <span>Back to Sent</span>
            </button>

            <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                <h2 className="text-2xl font-semibold text-gray-800">{email.subject}</h2>
                <p className="text-gray-500 text-sm mt-1">To: <span className="text-gray-700 font-medium">{email.to}</span></p>
            </div>

            <div className="mt-4 bg-gray-50 p-6 rounded-lg border border-gray-300">
                <p className="text-gray-800 text-lg leading-relaxed">{email.message}</p>
            </div>
        </div>
    );
};

export default EmailDetails;
