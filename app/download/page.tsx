"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function DownloadPage() {
  const { t } = useTranslation();
  return (
    <div className="page-root" style={{ minHeight: "100vh" }}>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "3rem 1.5rem", textAlign: "center" }}>
        <img src="/logo.svg" alt={`${t("brand.name")} logo`} width={64} height={64} style={{ margin: "0 auto 1rem" }} />
        <h1 className="text-headline-xl" style={{ color: "var(--color-on-surface)" }}>{t("download.title")}</h1>
        <p className="text-body-lg" style={{ color: "var(--color-on-surface-variant)", marginTop: "0.75rem" }}>
          {t("download.subtitle")}
        </p>

        <div className="card" style={{ padding: "2rem", marginTop: "2rem", display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined" style={{ fontSize: 32, color: "var(--color-secondary)" }}>android</span>
            <div style={{ textAlign: "left" }}>
              <div className="text-title-md" style={{ color: "var(--color-on-surface)" }}>{t("download.androidTitle")}</div>
              <div className="text-body-sm" style={{ color: "var(--color-on-surface-variant)" }}>{t("download.androidSubtitle")}</div>
            </div>
          </div>
          <a href="/downloads/houni.apk" download className="btn-primary" style={{ width: "100%", justifyContent: "center", height: "3rem" }}>
            {t("download.downloadCta")}
          </a>
          <p className="text-label-sm" style={{ color: "var(--color-outline)" }}>
            {t("download.warning")}
          </p>
        </div>

        <div className="card" style={{ padding: "2rem", marginTop: "1rem", display: "flex", alignItems: "center", gap: "1rem", opacity: 0.6 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 32, color: "var(--color-outline)" }}>apple</span>
          <div style={{ textAlign: "left" }}>
            <div className="text-title-md" style={{ color: "var(--color-on-surface)" }}>{t("download.iosTitle")}</div>
            <div className="text-body-sm" style={{ color: "var(--color-on-surface-variant)" }}>{t("download.iosSubtitle")}</div>
          </div>
        </div>

        <Link href="/" style={{ display: "inline-block", marginTop: "2rem", color: "var(--color-secondary)", fontWeight: 600 }}>
          {t("download.backLink")}
        </Link>
      </div>
    </div>
  );
}
