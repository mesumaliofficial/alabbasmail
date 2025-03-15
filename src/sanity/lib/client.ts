import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "2nkjtw4g", // ✅ Tumhara Sanity Project ID
  dataset: "production",
  useCdn: false, // ✅ Ensure Fresh Data
  apiVersion: "2023-03-01",
  token: process.env.SANITY_API_TOKEN, // ✅ Make sure token exists
});
