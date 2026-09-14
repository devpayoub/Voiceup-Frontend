import { Status } from "@/lib/types";

const BADGE_CLASS: Record<Status, string> = {
  received:    "badge badge-received",
  in_progress: "badge badge-in_progress",
  resolved:    "badge badge-resolved",
};

const LABELS: Record<Status, string> = {
  received:    "Received",
  in_progress: "In Progress",
  resolved:    "Resolved",
};

const ICONS: Record<Status, string> = {
  received: "visibility",
  in_progress: "pending",
  resolved: "check_circle",
};

export default function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={BADGE_CLASS[status]}>
      <span className={`material-symbols-outlined ${status === "resolved" ? "filled" : ""}`} style={{ fontSize: 14 }}>
        {ICONS[status]}
      </span>
      {LABELS[status]}
    </span>
  );
}
