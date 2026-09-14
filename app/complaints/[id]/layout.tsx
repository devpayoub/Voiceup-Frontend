import type { Metadata } from "next";
import { API_URL } from "@/lib/api/client";
import { SITE_NAME } from "@/lib/seo";
import type { Complaint } from "@/lib/types";

export async function generateMetadata({ params }: LayoutProps<"/complaints/[id]">): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await fetch(`${API_URL}/api/complaints/${id}/`, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error("not found");
    const complaint: Complaint = (await res.json()) as Complaint;
    const description =
      complaint.description.length > 155 ? `${complaint.description.slice(0, 152)}...` : complaint.description;

    return {
      title: complaint.title,
      description,
      alternates: { canonical: `/complaints/${id}` },
      openGraph: {
        title: `${complaint.title} | ${SITE_NAME}`,
        description,
        url: `/complaints/${id}`,
        type: "article",
      },
    };
  } catch {
    return { title: "Complaint", robots: { index: false, follow: true } };
  }
}

export default function ComplaintLayout({ children }: LayoutProps<"/complaints/[id]">) {
  return children;
}
