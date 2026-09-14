export function Skeleton({ style }: { style?: React.CSSProperties }) {
  return <div className="skeleton" style={style} />;
}

export function ComplaintCardSkeleton() {
  return (
    <div className="card" style={{ padding: "1.25rem" }}>
      <div className="flex items-center gap-3" style={{ marginBottom: "0.75rem" }}>
        <Skeleton style={{ width: 44, height: 44, borderRadius: 10 }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
          <Skeleton style={{ width: "50%", height: 14 }} />
          <Skeleton style={{ width: "35%", height: 11 }} />
        </div>
      </div>
      <Skeleton style={{ width: "85%", height: 18, marginBottom: 8 }} />
      <Skeleton style={{ width: "100%", height: 14, marginBottom: 4 }} />
      <Skeleton style={{ width: "70%", height: 14 }} />
      <div style={{ marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px solid var(--color-border)" }}>
        <Skeleton style={{ width: "40%", height: 28 }} />
      </div>
    </div>
  );
}
