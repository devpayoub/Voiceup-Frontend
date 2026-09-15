import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/seo";

const TITLE = "Déposer une plainte";
const DESCRIPTION = "Documentez publiquement un litige avec une entreprise ou un service public en Tunisie. Les autres citoyens concernés peuvent le soutenir et ajouter des preuves.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/complaints/new" },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: "/complaints/new",
  },
};

export default function NewComplaintLayout({ children }: { children: React.ReactNode }) {
  return children;
}
