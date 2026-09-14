export const SITE_NAME = "VoiceUp";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const SITE_DESCRIPTION =
  "File public complaints against companies and public services, back cases other citizens share, and track real responses.";

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}
