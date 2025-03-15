import type { NextApiRequest, NextApiResponse } from "next";
import { client } from "@/sanity/lib/client"; // ✅ Sanity Client Import

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") return res.status(405).json({ error: "Method Not Allowed" });

    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "Missing email ID" });

    try {
        const query = `*[_type == "sentEmails" && _id == $id][0]`;
        const email = await client.fetch(query, { id });

        if (!email) return res.status(404).json({ error: "Email not found" });

        return res.status(200).json(email);
    } catch (error) {
        console.error("❌ Error fetching email:", error);
        return res.status(500).json({ error: "Failed to fetch email" });
    }
}
