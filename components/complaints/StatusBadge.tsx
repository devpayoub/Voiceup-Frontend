"use client";

import { useTranslation } from "react-i18next";
import { Status } from "@/lib/types";

const BADGE_CLASS: Record<Status, string> = {
  received:    "badge badge-received",
  in_progress: "badge badge-in_progress",
  resolved:    "badge badge-resolved",
};

const LABEL_KEYS: Record<Status, string> = {
  received:    "status.received",
  in_progress: "status.inProgress",
  resolved:    "status.resolved",
};

const ICONS: Record<Status, string> = {
  received: "visibility",
  in_progress: "pending",
  resolved: "check_circle",
};

export default function StatusBadge({ status }: { status: Status }) {
  const { t } = useTranslation();
  return (
    <span className={BADGE_CLASS[status]}>
      <span className={`material-symbols-outlined ${status === "resolved" ? "filled" : ""}`} style={{ fontSize: 14 }}>
        {ICONS[status]}
      </span>
      {t(LABEL_KEYS[status])}
    </span>
  );
}
