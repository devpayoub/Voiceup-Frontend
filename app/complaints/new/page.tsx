"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, apiJson } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import { categoryIcon } from "@/lib/format";
import { Category, Company, Region } from "@/lib/types";
import { Input, Textarea } from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const DESCRIPTION_MAX = 2000;

function SectionCard({ icon, title, required, children }: { icon: string; title: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm" style={{ padding: "1.5rem" }}>
      <div className="flex items-center justify-between" style={{ marginBottom: "1rem" }}>
        <div className="flex items-center gap-2 text-headline-sm" style={{ color: "var(--color-on-surface)" }}>
          <span className="material-symbols-outlined" style={{ color: "var(--color-secondary)", fontSize: 22 }}>{icon}</span>
          <span>{title}</span>
        </div>
        {required && (
          <span className="text-label-sm uppercase" style={{ color: "var(--color-outline)", letterSpacing: "0.04em" }}>Required</span>
        )}
      </div>
      {children}
    </div>
  );
}

export default function NewComplaintPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    apiJson<Category[]>("/api/categories/").then(setCategories).catch(() => {});
    apiJson<Company[]>("/api/companies/").then(setCompanies).catch(() => {});
    apiJson<Region[]>("/api/regions/").then(setRegions).catch(() => {});
  }, [router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const form = new FormData();
      form.set("title", title);
      form.set("description", description);
      form.set("category", category);
      form.set("company_name", companyName);
      form.set("region", region);
      form.set("city", city);
      if (photo) form.set("photo", photo);

      const res = await apiFetch("/api/complaints/", { method: "POST", body: form });
      if (!res.ok) throw new Error(await res.text());
      const created = await res.json();
      router.push(`/complaints/${created.id}`);
    } catch {
      setError("Could not submit complaint. Check the fields and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-root" style={{ minHeight: "100vh" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "2rem 1.5rem 3rem" }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <div className="flex items-center gap-2 text-label-sm uppercase" style={{ color: "var(--color-secondary)", letterSpacing: "0.04em", marginBottom: "0.5rem" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-secondary)", display: "inline-block" }} />
            Verified Citizen Action Protocol
          </div>
          <h1 className="text-headline-xl" style={{ color: "var(--color-on-surface)" }}>File a Public Complaint</h1>
          <p className="text-body-lg" style={{ color: "var(--color-on-surface-variant)", marginTop: "0.5rem", maxWidth: 680 }}>
            Document your dispute publicly. Other citizens facing the same issue can back it and add their own evidence.
          </p>
        </div>

        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 flex flex-col gap-4">
              <SectionCard icon="category" title="Select Category" required>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "0.5rem" }}>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCategory(String(c.id))}
                      className={`category-tile ${category === String(c.id) ? "category-tile-active" : ""}`}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 26, color: category === String(c.id) ? "inherit" : "var(--color-secondary)" }}>
                        {categoryIcon(c.name)}
                      </span>
                      <span className="text-label-md">{c.name}</span>
                    </button>
                  ))}
                </div>
              </SectionCard>

              <SectionCard icon="apartment" title="Disputed Company" required>
                <Input
                  list="company-options"
                  placeholder="Type the company or brand name"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
                <datalist id="company-options">
                  {companies.map((c) => <option key={c.id} value={c.name} />)}
                </datalist>
              </SectionCard>

              <SectionCard icon="description" title="Grievance Details" required>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <label className="text-label-md" style={{ display: "block", marginBottom: "0.375rem", color: "var(--color-on-surface)" }}>
                      Complaint headline
                    </label>
                    <Input placeholder="e.g., Charged $180 unreturned equipment fee despite return receipt" required value={title} onChange={(e) => setTitle(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-label-md" style={{ display: "block", marginBottom: "0.375rem", color: "var(--color-on-surface)" }}>
                        Region
                      </label>
                      <div style={{ position: "relative" }}>
                        <span className="material-symbols-outlined" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--color-outline)", fontSize: 20, pointerEvents: "none" }}>
                          pin_drop
                        </span>
                        <Input
                          list="region-options"
                          style={{ paddingLeft: "2.5rem" }}
                          placeholder="e.g., Tunis"
                          required
                          value={region}
                          onChange={(e) => setRegion(e.target.value)}
                        />
                      </div>
                      <datalist id="region-options">
                        {regions.map((r) => <option key={r.id} value={r.name} />)}
                      </datalist>
                    </div>
                    <div>
                      <label className="text-label-md" style={{ display: "block", marginBottom: "0.375rem", color: "var(--color-on-surface)" }}>
                        City
                      </label>
                      <Input placeholder="e.g., La Marsa" value={city} onChange={(e) => setCity(e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between" style={{ marginBottom: "0.375rem" }}>
                      <label className="text-label-md" style={{ color: "var(--color-on-surface)" }}>Detailed incident description</label>
                      <span className="text-label-sm" style={{ color: "var(--color-outline)" }}>{description.length} / {DESCRIPTION_MAX}</span>
                    </div>
                    <Textarea
                      placeholder="Include dates, reference numbers, and who was affected."
                      required
                      rows={6}
                      maxLength={DESCRIPTION_MAX}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>
              </SectionCard>

              <SectionCard icon="verified_user" title="Evidence (optional)">
                <label
                  className="flex flex-col items-center justify-center"
                  style={{
                    padding: "2rem", borderRadius: "0.75rem", textAlign: "center", cursor: "pointer",
                    background: "var(--color-surface-container-low)",
                  }}
                >
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--color-surface-container)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.75rem" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 26, color: "var(--color-secondary)" }}>cloud_upload</span>
                  </div>
                  <span className="text-title-md" style={{ color: "var(--color-on-surface)" }}>
                    {photo ? photo.name : "Click to attach a photo"}
                  </span>
                  <span className="text-label-sm" style={{ color: "var(--color-outline)", marginTop: "0.25rem" }}>PNG or JPG</span>
                  <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] ?? null)} style={{ display: "none" }} />
                </label>
              </SectionCard>

              {error && <p className="text-body-sm" style={{ color: "var(--color-on-error-container)" }}>{error}</p>}

              <Button type="submit" disabled={loading} style={{ height: "3.25rem", width: "100%" }}>
                {loading ? "Submitting..." : "Submit complaint"}
              </Button>
            </div>

            <aside className="lg:col-span-4 flex flex-col gap-4">
              <div className="bg-surface-container-lowest rounded-xl shadow-sm" style={{ padding: "1.5rem" }}>
                <div className="flex items-center gap-2 text-headline-sm" style={{ color: "var(--color-secondary)", marginBottom: "0.75rem" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 24 }}>campaign</span>
                  <span>Tips for Rallying Backers</span>
                </div>
                {[
                  { title: "Be specific", body: "Cite dates and reference numbers — specificity makes complaints easier to verify." },
                  { title: "Attach evidence", body: "A photo of a bill, receipt, or screenshot goes a long way toward credibility." },
                  { title: "Describe the impact", body: "If this looks like a pattern affecting many people, say so clearly." },
                ].map((tip, i) => (
                  <div key={tip.title} className="flex items-start gap-3" style={{ marginTop: i === 0 ? 0 : "1rem" }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--color-surface-container)", color: "var(--color-secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                      {i + 1}
                    </div>
                    <div>
                      <div className="text-title-md" style={{ color: "var(--color-on-surface)" }}>{tip.title}</div>
                      <div className="text-body-sm" style={{ color: "var(--color-on-surface-variant)", marginTop: "0.125rem" }}>{tip.body}</div>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </form>
      </div>
    </div>
  );
}
