import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/seo";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b1c30",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 800, letterSpacing: -2 }}>{SITE_NAME}</div>
        <div style={{ fontSize: 32, color: "#bec6e0", marginTop: 24, maxWidth: 900, textAlign: "center" }}>
          Public Accountability &amp; Collective Action
        </div>
      </div>
    ),
    { ...size }
  );
}
