import type { MetadataRoute } from "next";
import { API_URL } from "@/lib/api/client";
import { SITE_URL } from "@/lib/seo";
import type { Complaint } from "@/lib/types";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "hourly", priority: 1 },
    { url: `${SITE_URL}/complaints/new`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/download`, changeFrequency: "monthly", priority: 0.5 },
  ];

  try {
    const res = await fetch(`${API_URL}/api/complaints/`, { next: { revalidate: 300 } });
    if (!res.ok) return staticRoutes;
    const complaints: Complaint[] = (await res.json()) as Complaint[];
    const complaintRoutes: MetadataRoute.Sitemap = complaints.map((c) => ({
      url: `${SITE_URL}/complaints/${c.id}`,
      lastModified: c.updated_at,
      changeFrequency: "weekly",
      priority: 0.6,
    }));
    return [...staticRoutes, ...complaintRoutes];
  } catch {
    return staticRoutes;
  }
}
