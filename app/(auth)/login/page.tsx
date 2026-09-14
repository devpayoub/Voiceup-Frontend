"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/lib/api/auth";
import AuthShell from "@/components/layout/AuthShell";
import { Input } from "@/components/ui/Input";
import Button from "@/components/ui/Button";

function IconInput({ icon, ...props }: { icon: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div style={{ position: "relative" }}>
      <span className="material-symbols-outlined" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--color-outline)", fontSize: 20, pointerEvents: "none" }}>
        {icon}
      </span>
      <Input {...props} style={{ paddingLeft: "2.75rem" }} />
    </div>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      router.push("/");
      router.refresh();
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      headline="Welcome back to VoiceUp."
      subhead="Access your filed complaints, back cases from your community, and track responses."
    >
      <div className="card" style={{ padding: "2.5rem" }}>
        <h2 className="text-headline-md" style={{ color: "var(--color-on-surface)" }}>Log in</h2>
        <p className="text-body-md" style={{ color: "var(--color-on-surface-variant)", marginTop: "0.375rem", marginBottom: "1.5rem" }}>
          Sign in to submit complaints, back others, and comment.
        </p>
        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <IconInput icon="mail" type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <IconInput icon="lock" type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p className="text-body-sm" style={{ color: "var(--color-on-error-container)" }}>{error}</p>}
          <Button type="submit" disabled={loading} style={{ height: "3.25rem", width: "100%", gap: "0.5rem" }}>
            <span>{loading ? "Logging in..." : "Log in"}</span>
            {!loading && <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>}
          </Button>
        </form>
        <p className="text-body-sm" style={{ marginTop: "1.5rem", color: "var(--color-on-surface-variant)", textAlign: "center" }}>
          No account?{" "}
          <Link href="/register" style={{ color: "var(--color-secondary)", fontWeight: 600 }}>Sign up</Link>
        </p>
      </div>
    </AuthShell>
  );
}
