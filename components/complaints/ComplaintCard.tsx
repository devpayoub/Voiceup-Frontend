"use client";

import { MouseEvent, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { apiFetch } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import { avatarColor, relativeTime } from "@/lib/format";
import { Complaint } from "@/lib/types";
import StatusBadge from "./StatusBadge";

type Props = {
  complaint: Complaint;
  companyName?: string;
  categoryName?: string;
};

export default function ComplaintCard({ complaint, companyName, categoryName }: Props) {
  const { t } = useTranslation();
  const [backed, setBacked] = useState(complaint.is_backed_by_me);
  const [count, setCount] = useState(complaint.backer_count);
  const [loading, setLoading] = useState(false);
  const name = companyName || "—";
  const avatar = avatarColor(name);

  async function toggleBack(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated() || loading) return;
    setLoading(true);
    try {
      const res = await apiFetch(`/api/complaints/${complaint.id}/back/`, { method: "POST" });
      const data = await res.json();
      setBacked(data.backed);
      setCount(data.backer_count);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Link href={`/complaints/${complaint.id}`} className="card block" style={{ padding: "1.25rem", textDecoration: "none" }}>
      <div className="flex items-start justify-between gap-2" style={{ marginBottom: "0.75rem" }}>
        <div className="flex items-center gap-3">
          <div
            className="avatar-circle"
            style={{ width: 44, height: 44, fontSize: 15, borderRadius: 10, background: avatar.bg, color: avatar.fg }}
          >
            {name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="text-title-md" style={{ color: "var(--color-on-surface)" }}>{name}</div>
            <div className="text-label-sm" style={{ color: "var(--color-outline)" }}>
              {categoryName ? `${categoryName} • ` : ""}{complaint.region}
            </div>
          </div>
        </div>
        <StatusBadge status={complaint.status} />
      </div>

      <h3 className="text-headline-sm" style={{ color: "var(--color-on-surface)" }}>{complaint.title}</h3>
      <p
        className="text-body-md"
        style={{
          color: "var(--color-on-surface-variant)",
          marginTop: 4,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {complaint.description}
      </p>

      <div
        className="flex items-center justify-between"
        style={{ marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px solid var(--color-border)", flexWrap: "wrap", gap: "0.5rem" }}
      >
        <div className="flex items-center gap-2">
          <div
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "rgba(206,17,38,0.08)", padding: "0.375rem 0.75rem", borderRadius: "0.5rem",
            }}
          >
            <span className="material-symbols-outlined filled" style={{ fontSize: 16, color: "var(--color-secondary)" }}>
              local_fire_department
            </span>
            <span className="text-counter-lg" style={{ fontSize: 15, color: "var(--color-on-surface)" }}>{count}</span>
            <span className="text-label-sm" style={{ color: "var(--color-on-surface-variant)" }}>{t("complaintCard.affected")}</span>
          </div>
          <button
            onClick={toggleBack}
            disabled={loading}
            className="chip"
            style={backed ? { background: "var(--color-resolved)", color: "#fff" } : { background: "var(--color-secondary)", color: "#fff" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>{backed ? "check" : "add_circle"}</span>
            <span>{backed ? t("complaintCard.backed") : t("complaintCard.meToo")}</span>
          </button>
        </div>
        <div className="flex items-center gap-3 text-label-sm" style={{ color: "var(--color-outline)" }}>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>schedule</span>
            {relativeTime(complaint.updated_at)}
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>chat_bubble_outline</span>
            {complaint.comment_count}
          </span>
        </div>
      </div>
    </Link>
  );
}
