"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { apiFetch, apiJson, mediaUrl } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import { avatarColor, initials, relativeTime } from "@/lib/format";
import { Category, Comment, Company, Complaint, Status } from "@/lib/types";
import StatusBadge from "@/components/complaints/StatusBadge";
import Button from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { absoluteUrl } from "@/lib/seo";

const STAGE_ORDER: Record<Status, number> = { received: 0, in_progress: 1, resolved: 2 };

export default function ComplaintDetailPage(props: PageProps<"/complaints/[id]">) {
  const { t } = useTranslation();
  const { id } = use(props.params);
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [commentText, setCommentText] = useState("");
  const [backing, setBacking] = useState(false);
  const [copied, setCopied] = useState(false);

  const STAGES: { status: Status; label: string; icon: string }[] = [
    { status: "received", label: t("complaintDetail.stageFiled"), icon: "flag" },
    { status: "in_progress", label: t("complaintDetail.stageReview"), icon: "trending_up" },
    { status: "resolved", label: t("complaintDetail.stageResolved"), icon: "check" },
  ];

  function load() {
    apiJson<Complaint>(`/api/complaints/${id}/`).then(setComplaint).catch(() => {});
    apiJson<Comment[]>(`/api/complaints/${id}/comments/`).then(setComments).catch(() => {});
    apiJson<Category[]>("/api/categories/").then(setCategories).catch(() => {});
    apiJson<Company[]>("/api/companies/").then(setCompanies).catch(() => {});
  }

  useEffect(load, [id]);

  const categoryName = useMemo(() => categories.find((c) => c.id === complaint?.category)?.name, [categories, complaint]);
  const companyName = useMemo(() => companies.find((c) => c.id === complaint?.company)?.name, [companies, complaint]);

  async function toggleBack() {
    if (!isAuthenticated()) return;
    setBacking(true);
    try {
      const res = await apiFetch(`/api/complaints/${id}/back/`, { method: "POST" });
      const data = await res.json();
      setComplaint((prev) => prev && { ...prev, is_backed_by_me: data.backed, backer_count: data.backer_count });
    } finally {
      setBacking(false);
    }
  }

  async function submitComment() {
    if (!commentText.trim()) return;
    const res = await apiFetch(`/api/complaints/${id}/comments/`, {
      method: "POST",
      body: JSON.stringify({ text: commentText }),
    });
    if (res.ok) {
      setCommentText("");
      apiJson<Comment[]>(`/api/complaints/${id}/comments/`).then(setComments);
    }
  }

  function shareLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!complaint) {
    return (
      <div className="page-root" style={{ minHeight: "100vh" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "2rem 1.5rem 3rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Skeleton style={{ width: 100, height: 20, borderRadius: 999 }} />
            <Skeleton style={{ width: "60%", height: 32 }} />
            <Skeleton style={{ width: "40%", height: 14 }} />
          </div>
          <Skeleton style={{ height: 100 }} />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 flex flex-col gap-4">
              <Skeleton style={{ height: 160 }} />
              <Skeleton style={{ height: 220 }} />
            </div>
            <div className="lg:col-span-4">
              <Skeleton style={{ height: 200 }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const photo = mediaUrl(complaint.photo);
  const currentStage = STAGE_ORDER[complaint.status];
  const tweetText = encodeURIComponent(`${complaint.title} — ${t("complaintDetail.shareCase")} ${t("brand.name")}`);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t("complaintDetail.breadcrumbHome"), item: absoluteUrl("/") },
      ...(categoryName
        ? [{ "@type": "ListItem", position: 2, name: categoryName, item: absoluteUrl(`/?category=${complaint.category}`) }]
        : []),
      { "@type": "ListItem", position: categoryName ? 3 : 2, name: complaint.title, item: absoluteUrl(`/complaints/${complaint.id}`) },
    ],
  };

  return (
    <div className="page-root" style={{ minHeight: "100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "2rem 1.5rem 3rem" }}>
        {/* Breadcrumb */}
        <nav className="flex items-center flex-wrap gap-2 text-label-md" style={{ color: "var(--color-on-surface-variant)", marginBottom: "1rem" }}>
          <Link href="/" style={{ color: "inherit" }}>{t("complaintDetail.breadcrumbHome")}</Link>
          {categoryName && (
            <>
              <span className="material-symbols-outlined" style={{ fontSize: 14, color: "var(--color-outline)" }}>chevron_right</span>
              <span>{categoryName}</span>
            </>
          )}
          {companyName && (
            <>
              <span className="material-symbols-outlined" style={{ fontSize: 14, color: "var(--color-outline)" }}>chevron_right</span>
              <span style={{ fontWeight: 600, color: "var(--color-on-surface)" }}>{companyName}</span>
            </>
          )}
          <span className="material-symbols-outlined" style={{ fontSize: 14, color: "var(--color-outline)" }}>chevron_right</span>
          <span style={{ color: "var(--color-outline)" }}>{t("complaintDetail.casePrefix")} #{complaint.id}</span>
        </nav>

        {/* Title */}
        <div style={{ marginBottom: "1.5rem" }}>
          <StatusBadge status={complaint.status} />
          <h1 className="text-headline-lg" style={{ color: "var(--color-on-surface)", marginTop: "0.75rem", maxWidth: 800 }}>{complaint.title}</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-body-sm" style={{ color: "var(--color-on-surface-variant)", marginTop: "0.5rem" }}>
            <span>{t("complaintDetail.filedBy")} <strong style={{ color: "var(--color-on-surface)" }}>{complaint.user}</strong></span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined" style={{ fontSize: 16, color: "var(--color-outline)" }}>location_on</span>
              {complaint.region}
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined" style={{ fontSize: 16, color: "var(--color-outline)" }}>schedule</span>
              {t("complaintDetail.filed")} {relativeTime(complaint.created_at)}
            </span>
          </div>
        </div>

        {/* Hero callout */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-baseline gap-3">
              <span className="text-headline-xl" style={{ color: "var(--color-secondary)" }}>{complaint.backer_count}</span>
              <span className="text-headline-sm" style={{ color: "var(--color-on-surface)" }}>
                {complaint.backer_count === 1 ? t("complaintDetail.citizenSingular") : t("complaintDetail.citizenPlural")} {t("complaintDetail.byThisIssue")}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant={complaint.is_backed_by_me ? "outline" : "primary"}
                disabled={backing || !isAuthenticated()}
                onClick={toggleBack}
                style={{ height: "3rem", gap: "0.5rem" }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{complaint.is_backed_by_me ? "check" : "how_to_reg"}</span>
                <span>{complaint.is_backed_by_me ? t("complaintDetail.backedCta") : t("complaintDetail.backCta")}</span>
              </Button>
              <button onClick={shareLink} className="btn-outline" style={{ height: "3rem", gap: "0.375rem" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{copied ? "check" : "share"}</span>
                <span>{copied ? t("complaintDetail.linkCopied") : t("complaintDetail.shareCase")}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left column */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="bg-surface-container-lowest rounded-xl shadow-sm" style={{ padding: "1.5rem" }}>
              <div className="flex items-center gap-2 text-headline-sm" style={{ color: "var(--color-on-surface)", marginBottom: "0.75rem" }}>
                <span className="material-symbols-outlined" style={{ color: "var(--color-secondary)" }}>description</span>
                <span>{t("complaintDetail.statementTitle")}</span>
              </div>
              <p className="text-body-lg" style={{ color: "var(--color-on-surface)", whiteSpace: "pre-wrap", lineHeight: 1.7 }}>{complaint.description}</p>
            </div>

            <div className="bg-surface-container-lowest rounded-xl shadow-sm" style={{ padding: "1.5rem" }}>
              <div className="flex items-center gap-2 text-headline-sm" style={{ color: "var(--color-on-surface)", marginBottom: "0.75rem" }}>
                <span className="material-symbols-outlined" style={{ color: "var(--color-secondary)" }}>folder_zip</span>
                <span>{t("complaintDetail.evidenceTitle")}</span>
              </div>
              {photo ? (
                <img src={photo} alt="" style={{ maxHeight: 420, width: "100%", borderRadius: "0.5rem", objectFit: "cover" }} />
              ) : (
                <p className="text-body-sm" style={{ color: "var(--color-outline)" }}>{t("complaintDetail.noEvidence")}</p>
              )}
            </div>

            <div className="bg-surface-container-lowest rounded-xl shadow-sm" style={{ padding: "1.5rem" }}>
              <div className="flex items-center gap-2 text-headline-sm" style={{ color: "var(--color-on-surface)", marginBottom: "1rem" }}>
                <span className="material-symbols-outlined" style={{ color: "var(--color-secondary)" }}>forum</span>
                <span>{t("complaintDetail.discussionTitle")}</span>
                <span className="text-label-sm" style={{ color: "var(--color-outline)", fontWeight: 400 }}>({comments.length})</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {comments.map((c) => {
                  const av = avatarColor(c.user);
                  return (
                    <div key={c.id} className="flex items-start gap-3">
                      <div className="avatar-circle" style={{ width: 32, height: 32, fontSize: 12, background: av.bg, color: av.fg }}>{initials(c.user)}</div>
                      <div className="flex-1" style={{ background: "var(--color-surface-container-low)", borderRadius: "0.5rem", padding: "0.75rem" }}>
                        <div className="flex items-center justify-between">
                          <span className="text-title-md" style={{ color: "var(--color-on-surface)" }}>{c.user}</span>
                          <span className="text-label-sm" style={{ color: "var(--color-outline)" }}>{relativeTime(c.created_at)}</span>
                        </div>
                        <p className="text-body-md" style={{ color: "var(--color-on-surface)", marginTop: 2 }}>{c.text}</p>
                      </div>
                    </div>
                  );
                })}
                {comments.length === 0 && <p className="text-body-sm" style={{ color: "var(--color-outline)" }}>{t("complaintDetail.noComments")}</p>}
              </div>

              {isAuthenticated() && (
                <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <Textarea placeholder={t("complaintDetail.commentPlaceholder")} rows={3} value={commentText} onChange={(e) => setCommentText(e.target.value)} />
                  <Button onClick={submitComment} style={{ height: "2.5rem", alignSelf: "flex-start" }}>{t("complaintDetail.postComment")}</Button>
                </div>
              )}
            </div>
          </div>

          {/* Right sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="bg-surface-container-lowest rounded-xl shadow-sm" style={{ padding: "1.25rem" }}>
              <h2 className="text-headline-sm" style={{ color: "var(--color-on-surface)", marginBottom: "1rem" }}>{t("complaintDetail.resolutionTitle")}</h2>
              <div style={{ position: "relative", paddingLeft: "1.5rem" }}>
                <div style={{ position: "absolute", left: 9, top: 4, bottom: 4, width: 2, background: "var(--color-border)" }} />
                {STAGES.map((stage, i) => {
                  const done = i < currentStage || (i === currentStage && complaint.status === "resolved");
                  const active = i === currentStage && complaint.status !== "resolved";
                  return (
                    <div key={stage.status} className="tracker-step" style={{ marginBottom: i === STAGES.length - 1 ? 0 : "1.25rem" }}>
                      <span
                        className="tracker-dot"
                        style={{
                          position: "absolute", left: -1.5 * 16 + 2,
                          background: done || active ? "var(--color-secondary)" : "var(--color-surface-container-highest)",
                          color: done || active ? "#fff" : "var(--color-outline)",
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 12 }}>{done ? "check" : stage.icon}</span>
                      </span>
                      <span className="text-title-md" style={{ color: active ? "var(--color-secondary)" : "var(--color-on-surface)", fontWeight: active ? 700 : 600 }}>
                        {stage.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl shadow-sm" style={{ padding: "1.25rem" }}>
              <h3 className="text-title-md" style={{ color: "var(--color-on-surface)", marginBottom: "0.5rem" }}>{t("complaintDetail.spreadTitle")}</h3>
              <p className="text-body-sm" style={{ color: "var(--color-on-surface-variant)", marginBottom: "0.75rem" }}>
                {t("complaintDetail.spreadBody")}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={shareLink} className="chip" style={{ justifyContent: "center", padding: "0.5rem" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>link</span>
                  <span>{copied ? t("complaintDetail.linkCopied") : t("complaintDetail.copyLink")}</span>
                </button>
                <a
                  href={`https://twitter.com/intent/tweet?text=${tweetText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="chip"
                  style={{ justifyContent: "center", padding: "0.5rem", textDecoration: "none" }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>public</span>
                  <span>{t("complaintDetail.postOnX")}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
