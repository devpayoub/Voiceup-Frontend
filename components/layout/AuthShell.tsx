"use client";

import { ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { apiJson } from "@/lib/api";
import { Category, Company, Complaint } from "@/lib/types";

type Props = {
  headline: string;
  subhead: string;
  children: ReactNode;
};

export default function AuthShell({ headline, subhead, children }: Props) {
  const { t } = useTranslation();
  const [stats, setStats] = useState({ complaints: 0, backers: 0, categories: 0, companies: 0 });

  useEffect(() => {
    Promise.all([
      apiJson<Complaint[]>("/api/complaints/").catch(() => []),
      apiJson<Category[]>("/api/categories/").catch(() => []),
      apiJson<Company[]>("/api/companies/").catch(() => []),
    ]).then(([complaints, categories, companies]) => {
      setStats({
        complaints: complaints.length,
        backers: complaints.reduce((sum, c) => sum + c.backer_count, 0),
        categories: categories.length,
        companies: companies.length,
      });
    });
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        paddingTop: "4rem",
        paddingLeft: "2rem",
        paddingRight: "2rem",
        paddingBottom: "2rem",
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" style={{ maxWidth: 1120, margin: "0 auto", width: "100%" }}>
        <div
          className="lg:col-span-5"
          style={{
            background: "var(--color-primary-container)", color: "#fff", borderRadius: "0.75rem",
            padding: "2.5rem", position: "relative", overflow: "hidden", boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          }}
        >
          <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div className="flex items-center gap-3">
              <div style={{ width: 40, height: 40, borderRadius: 8, background: "var(--color-secondary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 22 }}>gavel</span>
              </div>
              <div>
                <div className="text-headline-sm" style={{ color: "#fff" }}>{t("brand.name")}</div>
                <div className="text-label-sm uppercase" style={{ letterSpacing: "0.1em", color: "rgba(255,255,255,0.65)" }}>{t("brand.tagline")}</div>
              </div>
            </div>

            <div>
              <h1 className="text-headline-lg" style={{ color: "#fff", lineHeight: 1.25 }}>{headline}</h1>
              <p className="text-body-lg" style={{ color: "rgba(255,255,255,0.75)", marginTop: "1rem" }}>{subhead}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: t("home.statFiled"), value: stats.complaints },
                { label: t("home.statBacking"), value: stats.backers },
                { label: t("home.statCategories"), value: stats.categories },
                { label: t("home.statCompanies"), value: stats.companies },
              ].map((s) => (
                <div key={s.label} style={{ background: "rgba(255,255,255,0.06)", borderRadius: "0.5rem", padding: "1rem" }}>
                  <div className="text-counter-lg" style={{ color: "#fff" }}>{s.value}</div>
                  <div className="text-body-sm" style={{ color: "rgba(255,255,255,0.7)", marginTop: "0.25rem" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col justify-center">{children}</div>
      </div>
    </div>
  );
}
