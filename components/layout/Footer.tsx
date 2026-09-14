"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="VoiceUp logo" width={24} height={24} />
          <span className="font-headline-sm text-headline-sm text-on-surface">VoiceUp</span>
          <span className="text-label-sm" style={{ marginLeft: "0.5rem" }}>Independent Citizen &amp; Consumer Advocacy</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/" className="hover:text-on-surface" style={{ transition: "color 150ms ease" }}>Public Feed</Link>
          <Link href="/complaints/new" className="hover:text-on-surface" style={{ transition: "color 150ms ease" }}>File a Complaint</Link>
        </div>
        <div className="font-label-sm text-label-sm" style={{ color: "var(--color-outline)" }}>
          © {new Date().getFullYear()} VoiceUp
        </div>
      </div>
    </footer>
  );
}
