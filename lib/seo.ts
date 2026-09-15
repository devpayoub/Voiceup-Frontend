export const SITE_NAME = "Houni";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://houni-tn.vercel.app";
export const SITE_DESCRIPTION =
  "Déposez des plaintes publiques contre des entreprises et services publics en Tunisie, soutenez les causes d'autres citoyens et suivez les réponses réelles.";

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}
