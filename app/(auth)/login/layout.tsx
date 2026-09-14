import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In",
  description: "Log in to VoiceUp to file complaints, back cases from your community, and track responses.",
  alternates: { canonical: "/login" },
  robots: { index: false, follow: true },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
