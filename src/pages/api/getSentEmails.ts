import { NextApiRequest, NextApiResponse } from "next";
import { client } from "@/sanity/lib/client"; // ✅ Correct import

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        console.log("Fetching Sent Emails..."); // ✅ Debugging log

        const query = `*[_type == "sentEmails"] | order(sentAt desc) {
            _id, to, subject, message, sentAt, isSeen
        }`;

        const sentEmails = await client.fetch(query);

        console.log("Sanity Response:", sentEmails); // ✅ Check API response

        return res.status(200).json(sentEmails);
    } catch (error) {
        console.error("Error fetching sent emails:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
