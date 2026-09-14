"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiJson } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import { avatarColor, initials, memberSince } from "@/lib/format";
import { Category, Company, Complaint, User } from "@/lib/types";
import ComplaintCard from "@/components/complaints/ComplaintCard";
import { Input } from "@/components/ui/Input";
import Select from "@/components/ui/Select";

export default function ProfilePage() {
  const router = useRouter();
  const [me, setMe] = useState<User | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    apiJson<User>("/api/users/me/").then((user) => {
      setMe(user);
      apiJson<Complaint[]>("/api/complaints/").then((all) =>
        setComplaints(all.filter((c) => c.user === user.username))
      );
    });
    apiJson<Category[]>("/api/categories/").then(setCategories).catch(() => {});
    apiJson<Company[]>("/api/companies/").then(setCompanies).catch(() => {});
  }, [router]);

  const companyMap = useMemo(() => new Map(companies.map((c) => [c.id, c.name])), [companies]);
  const categoryMap = useMemo(() => new Map(categories.map((c) => [c.id, c.name])), [categories]);

  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      if (status && c.status !== status) return false;
      if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [complaints, search, status]);

  const metrics = useMemo(() => {
    const backers = complaints.reduce((sum, c) => sum + c.backer_count, 0);
    const resolved = complaints.filter((c) => c.status === "resolved").length;
    const commentsReceived = complaints.reduce((sum, c) => sum + c.comment_count, 0);
    return [
      { label: "Complaints Filed", value: complaints.length, icon: "article" },
      { label: "Backers Rallied", value: backers, icon: "local_fire_department" },
      { label: "Resolved", value: resolved, icon: "task_alt" },
      { label: "Comments Received", value: commentsReceived, icon: "forum" },
    ];
  }, [complaints]);
  const maxMetric = Math.max(1, ...metrics.map((m) => m.value));

  if (!me) {
    return (
      <div className="page-root" style={{ minHeight: "100vh" }}>
        <p className="text-body-md" style={{ color: "var(--color-outline)", padding: "3rem 1.5rem" }}>Loading...</p>
      </div>
    );
  }

  const avatar = avatarColor(me.username);

  return (
    <div className="page-root" style={{ minHeight: "100vh" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "2rem 1.5rem 3rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Header card */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm" style={{ padding: "1.5rem" }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="avatar-circle" style={{ width: 72, height: 72, fontSize: 24, background: avatar.bg, color: avatar.fg }}>
                {initials(me.username)}
              </div>
              <div>
                <h1 className="text-headline-lg" style={{ color: "var(--color-on-surface)" }}>{me.username}</h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-body-sm" style={{ color: "var(--color-on-surface-variant)", marginTop: "0.25rem" }}>
                  {me.region && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined" style={{ fontSize: 16, color: "var(--color-outline)" }}>location_on</span>
                      {me.region}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: "var(--color-outline)" }}>calendar_month</span>
                    Member since {memberSince(me.date_joined)}
                  </span>
                </div>
              </div>
            </div>
            <Link href="/complaints/new" className="btn-primary" style={{ gap: "0.375rem" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add_circle</span>
              File Another Complaint
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3" style={{ marginTop: "1.5rem" }}>
            {metrics.map((m) => (
              <div key={m.label} style={{ background: "var(--color-surface-container-low)", borderRadius: "0.5rem", padding: "1rem" }}>
                <div className="flex items-center justify-between" style={{ color: "var(--color-outline)" }}>
                  <span className="text-label-sm uppercase" style={{ fontWeight: 700 }}>{m.label}</span>
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: "var(--color-secondary)" }}>{m.icon}</span>
                </div>
                <div className="text-headline-lg" style={{ color: "var(--color-on-surface)", fontWeight: 700, marginTop: 4 }}>{m.value}</div>
                <div style={{ width: "100%", background: "var(--color-surface-container)", borderRadius: 9999, height: 4, marginTop: "0.5rem", overflow: "hidden" }}>
                  <div style={{ width: `${(m.value / maxMetric) * 100}%`, background: "var(--color-secondary)", height: "100%", borderRadius: 9999 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter toolbar */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm flex flex-col md:flex-row items-stretch md:items-center gap-3" style={{ padding: "1rem" }}>
          <div style={{ position: "relative", flex: 1, maxWidth: 400 }}>
            <span className="material-symbols-outlined" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--color-outline)", fontSize: 18, pointerEvents: "none" }}>
              search
            </span>
            <Input style={{ paddingLeft: "2.5rem" }} placeholder="Filter by title..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={status} onChange={(e) => setStatus(e.target.value)} style={{ maxWidth: 220 }}>
            <option value="">All statuses ({complaints.length})</option>
            <option value="received">Received</option>
            <option value="in_progress">In progress</option>
            <option value="resolved">Resolved</option>
          </Select>
        </div>

        {/* Complaints */}
        <div>
          <h2 className="text-headline-sm" style={{ color: "var(--color-on-surface)", marginBottom: "1rem" }}>
            My Complaints ({filtered.length})
          </h2>
          {filtered.length === 0 ? (
            <p className="text-body-md" style={{ color: "var(--color-outline)" }}>
              {complaints.length === 0 ? "You haven't submitted any complaints yet." : "No complaints match these filters."}
            </p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1rem" }}>
              {filtered.map((c) => (
                <ComplaintCard key={c.id} complaint={c} companyName={companyMap.get(c.company)} categoryName={categoryMap.get(c.category)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
