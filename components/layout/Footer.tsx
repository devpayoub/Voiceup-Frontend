"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  const pathname = usePathname();
  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt={`${t("brand.name")} logo`} width={24} height={24} />
          <span className="font-headline-sm text-headline-sm text-on-surface">{t("brand.name")}</span>
          <span className="text-label-sm" style={{ marginLeft: "0.5rem" }}>{t("footer.tagline")}</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/" className="hover:text-on-surface" style={{ transition: "color 150ms ease" }}>{t("footer.publicFeed")}</Link>
          <Link href="/complaints/new" className="hover:text-on-surface" style={{ transition: "color 150ms ease" }}>{t("footer.fileComplaint")}</Link>
        </div>
        <div className="font-label-sm text-label-sm" style={{ color: "var(--color-outline)" }}>
          © {new Date().getFullYear()} {t("brand.name")} — {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}
