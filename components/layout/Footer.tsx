import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="flex items-center gap-2">
          <div
            style={{
              width: 24, height: 24, borderRadius: 6,
              background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 11, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>R</span>
          </div>
          <span className="font-headline-sm text-headline-sm text-on-surface">Resolv</span>
          <span className="text-label-sm" style={{ marginLeft: "0.5rem" }}>Independent Citizen &amp; Consumer Advocacy</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/" className="hover:text-on-surface" style={{ transition: "color 150ms ease" }}>Public Feed</Link>
          <Link href="/complaints/new" className="hover:text-on-surface" style={{ transition: "color 150ms ease" }}>File a Complaint</Link>
        </div>
        <div className="font-label-sm text-label-sm" style={{ color: "var(--color-outline)" }}>
          © {new Date().getFullYear()} Resolv
        </div>
      </div>
    </footer>
  );
}
