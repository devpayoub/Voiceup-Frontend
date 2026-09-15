"use client";

import { useTranslation } from "react-i18next";
import { setLanguage, SupportedLanguage } from "@/lib/i18n";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="flex items-center" style={{ borderRadius: 8, overflow: "hidden", border: "1px solid var(--color-border)" }}>
      {(["fr", "ar"] as SupportedLanguage[]).map((lang) => (
        <button
          key={lang}
          onClick={() => setLanguage(lang)}
          className="text-label-sm"
          style={{
            padding: "0.375rem 0.625rem",
            background: i18n.language === lang ? "var(--color-secondary)" : "transparent",
            color: i18n.language === lang ? "var(--color-on-secondary)" : "var(--color-on-surface-variant)",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
          }}
        >
          {lang === "fr" ? "FR" : "عربي"}
        </button>
      ))}
    </div>
  );
}
