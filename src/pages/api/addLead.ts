import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@sanity/client";

// Create a separate Sanity client for the API route
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "",
  useCdn: false,
  apiVersion: "2024-03-15",
  token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
});

interface LeadRequest {
  name: string;
  email: string;
  phone: string;
  addedAt?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { name, email, phone, addedAt } = req.body as LeadRequest;

    // Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Check if email already exists
    const existingLead = await client.fetch(
      `*[_type == "lead" && email == $email][0]`,
      { email: email.toLowerCase() }
    );

    if (existingLead) {
      // Update existing lead
      const updatedLead = {
        name: name.trim(),
        phone: phone.trim(),
        addedAt: addedAt || new Date().toISOString()
      };

      const result = await client
        .patch(existingLead._id)
        .set(updatedLead)
        .commit();

      console.log("✅ Lead updated in Sanity:", result);

      return res.status(200).json({ 
        success: true, 
        message: `Email ${email} already exists. Lead information has been updated.`,
        lead: result,
        isUpdate: true
      });
    }

    // Create new lead with proper date format
    const newLead = {
      _type: "lead",
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      addedAt: addedAt || new Date().toISOString(),
    };

    const result = await client.create(newLead);
    console.log("✅ Lead saved to Sanity:", result);

    return res.status(200).json({ 
      success: true, 
      message: "New lead added successfully!",
      lead: result,
      isUpdate: false
    });

  } catch (error) {
    console.error("❌ Error in addLead API:", error);
    return res.status(500).json({ 
      error: "Failed to add/update lead",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
} 