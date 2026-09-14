"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiJson } from "@/lib/api";
import { Category, Company, Complaint } from "@/lib/types";
import { categoryIcon } from "@/lib/format";
import ComplaintCard from "@/components/complaints/ComplaintCard";
import Select from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";

function FeedContent() {
  const urlParams = useSearchParams();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [category, setCategory] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState(urlParams.get("search") ?? "");
  const [sort, setSort] = useState<"newest" | "backed">("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiJson<Category[]>("/api/categories/").then(setCategories).catch(() => {});
    apiJson<Company[]>("/api/companies/").then(setCompanies).catch(() => {});
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (company) params.set("company", company);
    if (status) params.set("status", status);
    if (search) params.set("search", search);

    setLoading(true);
    apiJson<Complaint[]>(`/api/complaints/?${params.toString()}`)
      .then((data) => {
        setComplaints(data);
        setError("");
      })
      .catch(() => setError("Could not load complaints. Is the API running?"))
      .finally(() => setLoading(false));
  }, [category, company, status, search]);

  const companyMap = useMemo(() => new Map(companies.map((c) => [c.id, c.name])), [companies]);
  const categoryMap = useMemo(() => new Map(categories.map((c) => [c.id, c.name])), [categories]);

  const sorted = useMemo(() => {
    const arr = [...complaints];
    if (sort === "backed") arr.sort((a, b) => b.backer_count - a.backer_count);
    return arr;
  }, [complaints, sort]);

  const totalBackers = useMemo(() => complaints.reduce((sum, c) => sum + c.backer_count, 0), [complaints]);
  const categoryCounts = useMemo(() => {
    const counts = new Map<number, number>();
    for (const c of complaints) counts.set(c.category, (counts.get(c.category) ?? 0) + 1);
    return counts;
  }, [complaints]);

  return (
    <div className="page-root" style={{ background: "var(--color-background)", minHeight: "100vh" }}>
      {/* Hero */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "2rem 2rem 1.5rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ maxWidth: 680 }}>
            <div
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.375rem",
                padding: "0.25rem 0.75rem", background: "var(--color-surface-container-high)",
                borderRadius: 9999, marginBottom: "0.75rem",
              }}
            >
              <span className="pulse-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-secondary)", flexShrink: 0 }} />
              <span className="text-label-sm uppercase" style={{ color: "var(--color-secondary)", letterSpacing: "0.04em" }}>
                Independent Citizen &amp; Consumer Registry
              </span>
            </div>
            <h1 className="text-headline-xl" style={{ color: "var(--color-on-surface)", margin: "0 0 0.75rem" }}>
              Public Accountability &amp; Collective Action.
            </h1>
            <p className="text-body-lg" style={{ color: "var(--color-on-surface-variant)", margin: 0 }}>
              Join fellow citizens reporting service problems. Back complaints you share, and help build a public
              record companies and regulators can't ignore.
            </p>
          </div>

          <div
            style={{
              display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem",
              background: "var(--color-surface-container-lowest)", border: "1px solid var(--color-border)",
              borderRadius: "0.75rem", padding: "0.75rem", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", maxWidth: 480,
            }}
          >
            {[
              { label: "Complaints Filed", value: complaints.length, icon: "article" },
              { label: "Citizens Backing", value: totalBackers, icon: "local_fire_department" },
              { label: "Categories Tracked", value: categories.length, icon: "category" },
            ].map(({ label, value, icon }) => (
              <div key={label} className="stat-chip">
                <div className="flex items-center justify-between" style={{ color: "var(--color-outline)" }}>
                  <span className="text-label-sm uppercase" style={{ fontWeight: 700 }}>{label}</span>
                  <span className="material-symbols-outlined" style={{ fontSize: 16, color: "var(--color-secondary)" }}>{icon}</span>
                </div>
                <div className="text-headline-sm" style={{ color: "var(--color-on-surface)", fontWeight: 700, marginTop: 2 }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter deck */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem 1.5rem" }}>
        <div className="filter-bar">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
            <div style={{ position: "relative", flex: "1 1 240px", minWidth: 200 }}>
              <span
                className="material-symbols-outlined"
                style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--color-outline)", fontSize: 18, pointerEvents: "none" }}
              >
                search
              </span>
              <Input style={{ paddingLeft: "2.5rem" }} placeholder="Search title..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={category} onChange={(e) => setCategory(e.target.value)} style={{ flex: "1 1 160px", minWidth: 150 }}>
              <option value="">All categories</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
            <Select value={company} onChange={(e) => setCompany(e.target.value)} style={{ flex: "1 1 160px", minWidth: 150 }}>
              <option value="">All companies</option>
              {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
            <Select value={status} onChange={(e) => setStatus(e.target.value)} style={{ flex: "1 1 160px", minWidth: 150 }}>
              <option value="">All statuses</option>
              <option value="received">Received</option>
              <option value="in_progress">In progress</option>
              <option value="resolved">Resolved</option>
            </Select>
            <Select value={sort} onChange={(e) => setSort(e.target.value as "newest" | "backed")} style={{ flex: "1 1 160px", minWidth: 150 }}>
              <option value="newest">Newest filings</option>
              <option value="backed">Most backed</option>
            </Select>
            <Link href="/complaints/new" className="btn-primary" style={{ flexShrink: 0, height: "3rem", padding: "0 1.25rem" }}>
              + Submit a Complaint
            </Link>
          </div>

          {categories.length > 0 && (
            <div className="flex items-center gap-2" style={{ overflowX: "auto", paddingTop: "0.75rem" }}>
              <span className="text-label-sm uppercase" style={{ color: "var(--color-outline)", fontWeight: 700, flexShrink: 0 }}>Categories:</span>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategory(category === String(c.id) ? "" : String(c.id))}
                  className={`chip ${category === String(c.id) ? "chip-active" : ""}`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 15 }}>{categoryIcon(c.name)}</span>
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Main grid */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem 3rem" }}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="flex items-center justify-between" style={{ padding: "0 0.25rem" }}>
              <div className="flex items-center gap-2">
                <span className="text-headline-sm" style={{ color: "var(--color-on-surface)" }}>Live Citizen Cases</span>
                {!loading && (
                  <span className="text-label-sm" style={{ background: "var(--color-surface-container-high)", color: "var(--color-secondary)", padding: "2px 8px", borderRadius: 4, fontWeight: 700 }}>
                    {complaints.length} open
                  </span>
                )}
              </div>
            </div>

            {error && (
              <div className="text-body-md" style={{ background: "var(--color-error-container)", color: "var(--color-on-error-container)", padding: "0.75rem 1rem", borderRadius: "0.5rem", border: "1px solid #fca5a5" }}>
                {error}
              </div>
            )}

            {loading ? (
              <p style={{ color: "var(--color-outline)" }}>Loading...</p>
            ) : sorted.length === 0 ? (
              <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--color-on-surface-variant)" }}>
                <p className="text-headline-sm" style={{ color: "var(--color-outline)", marginBottom: "0.5rem" }}>No complaints match these filters yet.</p>
                <p className="text-body-md">
                  Be the first to{" "}
                  <Link href="/complaints/new" style={{ color: "var(--color-secondary)", fontWeight: 600 }}>file a complaint</Link>.
                </p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1rem" }}>
                {sorted.map((c) => (
                  <ComplaintCard key={c.id} complaint={c} companyName={companyMap.get(c.company)} categoryName={categoryMap.get(c.category)} />
                ))}
              </div>
            )}
          </div>

          <aside className="lg:col-span-4 flex flex-col gap-4">
            <div className="bg-primary text-on-primary rounded-xl p-6 shadow-md" style={{ position: "relative", overflow: "hidden" }}>
              <div className="relative z-10">
                <div
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded font-label-sm text-label-sm font-semibold uppercase tracking-wider"
                  style={{ background: "var(--color-secondary)", color: "var(--color-on-secondary)", marginBottom: "0.75rem" }}
                >
                  Citizen Power
                </div>
                <h3 className="text-headline-sm" style={{ fontWeight: 700, lineHeight: 1.3 }}>Have you experienced a service failure?</h3>
                <p className="text-body-md" style={{ color: "var(--color-on-primary-container)", marginTop: "0.5rem" }}>
                  File your complaint in under 3 minutes. Others facing the same issue can back it to build collective pressure.
                </p>
                <Link
                  href="/complaints/new"
                  className="text-label-md"
                  style={{
                    marginTop: "1rem", width: "100%", textAlign: "center", padding: "0.75rem 1rem",
                    background: "var(--color-secondary)", color: "var(--color-on-secondary)", borderRadius: "0.5rem",
                    fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.375rem", textDecoration: "none",
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
                  File a Complaint
                </Link>
              </div>
            </div>

            {categories.length > 0 && (
              <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm">
                <h3 className="text-title-md" style={{ color: "var(--color-on-surface)", marginBottom: "0.75rem" }}>Categories</h3>
                <div className="flex flex-col gap-1">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCategory(category === String(c.id) ? "" : String(c.id))}
                      className="flex items-center justify-between"
                      style={{ padding: "0.5rem", borderRadius: "0.5rem", background: category === String(c.id) ? "var(--color-surface-container-low)" : "transparent", border: "none", cursor: "pointer", width: "100%" }}
                    >
                      <span className="flex items-center gap-2 text-body-sm" style={{ color: "var(--color-on-surface)" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18, color: "var(--color-secondary)" }}>{categoryIcon(c.name)}</span>
                        {c.name}
                      </span>
                      <span className="text-label-sm" style={{ color: "var(--color-outline)" }}>{categoryCounts.get(c.id) ?? 0}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>
    </div>
  );
}

export default function FeedPage() {
  return (
    <Suspense fallback={null}>
      <FeedContent />
    </Suspense>
  );
}
