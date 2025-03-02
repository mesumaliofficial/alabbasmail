import { createClient } from "@sanity/client";

export const sanityClient = createClient({
    projectId: "2nkjtw4g",
    dataset: "production",
    apiVersion: "2025-03-03",
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
  });
  
