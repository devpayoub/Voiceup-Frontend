import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "File a Complaint",
  description:
    "Document a dispute with a company or public service publicly. Other citizens facing the same issue can back it and add evidence.",
  alternates: { canonical: "/complaints/new" },
  openGraph: {
    title: `File a Complaint | ${SITE_NAME}`,
    description:
      "Document a dispute with a company or public service publicly. Other citizens facing the same issue can back it and add evidence.",
    url: "/complaints/new",
  },
};

export default function NewComplaintLayout({ children }: { children: React.ReactNode }) {
  return children;
}
