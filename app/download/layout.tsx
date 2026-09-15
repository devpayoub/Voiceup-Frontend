import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/seo";

const TITLE = "Télécharger l'application";
const DESCRIPTION = "Obtenez Houni pour Android. Déposez et suivez vos plaintes depuis votre téléphone. Le support iOS arrive bientôt.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/download" },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: "/download",
  },
};

export default function DownloadLayout({ children }: { children: React.ReactNode }) {
  return children;
}
