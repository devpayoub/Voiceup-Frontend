import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-root" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", maxWidth: 420, padding: "2rem" }}>
        <img src="/logo.svg" alt="VoiceUp logo" width={56} height={56} style={{ margin: "0 auto 1.5rem" }} />
        <div className="text-headline-xl" style={{ color: "var(--color-secondary)" }}>404</div>
        <h1 className="text-headline-lg" style={{ color: "var(--color-on-surface)", marginTop: "0.5rem" }}>
          This page doesn&apos;t exist.
        </h1>
        <p className="text-body-md" style={{ color: "var(--color-on-surface-variant)", marginTop: "0.75rem" }}>
          The complaint or page you&apos;re looking for may have been moved or removed.
        </p>
        <Link href="/" className="btn-primary" style={{ marginTop: "1.5rem", display: "inline-flex" }}>
          Back to the feed
        </Link>
      </div>
    </div>
  );
}
