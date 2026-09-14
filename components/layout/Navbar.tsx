"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { KeyboardEvent, useEffect, useState } from "react";
import { apiJson } from "@/lib/api";
import { logout as apiLogout } from "@/lib/api/auth";
import { isAuthenticated } from "@/lib/auth";
import { avatarColor, initials } from "@/lib/format";
import { User } from "@/lib/types";

export default function Navbar() {
  const [authed, setAuthed] = useState(false);
  const [me, setMe] = useState<User | null>(null);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    function refresh() {
      const isAuthed = isAuthenticated();
      setAuthed(isAuthed);
      if (isAuthed) {
        apiJson<User>("/api/users/me/").then(setMe).catch(() => setMe(null));
      } else {
        setMe(null);
      }
    }
    refresh();
    window.addEventListener("auth-change", refresh);
    return () => window.removeEventListener("auth-change", refresh);
  }, []);

  async function logout() {
    await apiLogout();
    router.push("/");
  }

  function onSearchKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && search.trim()) {
      router.push(`/?search=${encodeURIComponent(search.trim())}`);
    }
  }

  const avatar = me ? avatarColor(me.username) : null;

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: "#fff", fontWeight: 800, fontSize: 14, fontFamily: "Plus Jakarta Sans, sans-serif" }}>R</span>
            </div>
            <span className="text-title-md" style={{ color: "var(--color-on-surface)", letterSpacing: "-0.01em" }}>
              Resolv
            </span>
          </Link>

          <nav className="hidden xl:flex items-center gap-1 ml-4">
            {[
              { label: "Feed / Explore", href: "/" },
              { label: "File a Complaint", href: "/complaints/new" },
            ].map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="px-3 py-1.5 rounded-lg text-body-sm font-medium transition-colors"
                style={{ color: "var(--color-on-surface-variant)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "var(--color-surface-container)";
                  (e.currentTarget as HTMLElement).style.color = "var(--color-on-surface)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "";
                  (e.currentTarget as HTMLElement).style.color = "var(--color-on-surface-variant)";
                }}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Search */}
        <div className="flex-1 hidden md:block" style={{ maxWidth: 480 }}>
          <div style={{ position: "relative", display: "flex", alignItems: "center", width: "100%" }}>
            <span
              className="material-symbols-outlined"
              style={{ position: "absolute", left: 12, color: "var(--color-outline)", fontSize: 20, pointerEvents: "none" }}
            >
              search
            </span>
            <input
              className="text-body-sm"
              style={{
                width: "100%", paddingLeft: "2.5rem", paddingRight: "1rem", paddingTop: "0.5rem", paddingBottom: "0.5rem",
                background: "var(--color-surface-container-low)", borderRadius: "0.5rem", border: "none",
                color: "var(--color-on-surface)", outline: "none",
              }}
              placeholder="Search complaints by company, issue, or region..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={onSearchKeyDown}
            />
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/complaints/new" className="btn-primary text-body-sm" style={{ height: "2.25rem", gap: "0.375rem" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
            <span>File Complaint</span>
          </Link>
          {authed ? (
            <>
              <Link
                href="/profile"
                title={me?.username}
                className="avatar-circle"
                style={{
                  width: 32, height: 32, fontSize: 12,
                  background: avatar?.bg ?? "var(--color-surface-container-high)",
                  color: avatar?.fg ?? "var(--color-on-surface)",
                }}
              >
                {me ? initials(me.username) : "…"}
              </Link>
              <button onClick={logout} className="btn-outline text-body-sm" style={{ height: "2.25rem", fontSize: 13 }}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg text-body-sm font-medium transition-colors"
                style={{ color: "var(--color-on-surface-variant)" }}
              >
                Log in
              </Link>
              <Link href="/register" className="btn-primary" style={{ height: "2.25rem" }}>
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
