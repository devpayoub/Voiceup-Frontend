import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Download the App",
  description: "Get VoiceUp for Android. File and track complaints from your phone. iOS support is coming soon.",
  alternates: { canonical: "/download" },
  openGraph: {
    title: `Download the App | ${SITE_NAME}`,
    description: "Get VoiceUp for Android. File and track complaints from your phone. iOS support is coming soon.",
    url: "/download",
  },
};

export default function DownloadPage() {
  return (
    <div className="page-root" style={{ minHeight: "100vh" }}>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "3rem 1.5rem", textAlign: "center" }}>
        <img src="/logo.svg" alt="VoiceUp logo" width={64} height={64} style={{ margin: "0 auto 1rem" }} />
        <h1 className="text-headline-xl" style={{ color: "var(--color-on-surface)" }}>Get VoiceUp on your phone</h1>
        <p className="text-body-lg" style={{ color: "var(--color-on-surface-variant)", marginTop: "0.75rem" }}>
          File and track complaints on the go. Not on Google Play yet — download the APK directly below.
        </p>

        <div className="card" style={{ padding: "2rem", marginTop: "2rem", display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined" style={{ fontSize: 32, color: "var(--color-secondary)" }}>android</span>
            <div style={{ textAlign: "left" }}>
              <div className="text-title-md" style={{ color: "var(--color-on-surface)" }}>Android</div>
              <div className="text-body-sm" style={{ color: "var(--color-on-surface-variant)" }}>Direct APK download</div>
            </div>
          </div>
          <a href="/downloads/voiceup.apk" download className="btn-primary" style={{ width: "100%", justifyContent: "center", height: "3rem" }}>
            Download APK
          </a>
          <p className="text-label-sm" style={{ color: "var(--color-outline)" }}>
            Your phone may warn about installing from an unknown source — that&apos;s expected outside the Play Store.
          </p>
        </div>

        <div className="card" style={{ padding: "2rem", marginTop: "1rem", display: "flex", alignItems: "center", gap: "1rem", opacity: 0.6 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 32, color: "var(--color-outline)" }}>apple</span>
          <div style={{ textAlign: "left" }}>
            <div className="text-title-md" style={{ color: "var(--color-on-surface)" }}>iOS</div>
            <div className="text-body-sm" style={{ color: "var(--color-on-surface-variant)" }}>Coming soon</div>
          </div>
        </div>

        <Link href="/" style={{ display: "inline-block", marginTop: "2rem", color: "var(--color-secondary)", fontWeight: 600 }}>
          ← Back to the feed
        </Link>
      </div>
    </div>
  );
}
