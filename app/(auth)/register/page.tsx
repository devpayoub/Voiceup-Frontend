"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "@/lib/api/auth";
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

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [region, setRegion] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await register({ username, email, password, region });
      router.push("/");
      router.refresh();
    } catch {
      setError("Could not create account. Username/email may already be taken.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      headline="Join the public interest coalition."
      subhead="Set up your consumer profile to file complaints, back cases you share, and follow their status."
    >
      <div className="card" style={{ padding: "2.5rem" }}>
        <h2 className="text-headline-md" style={{ color: "var(--color-on-surface)" }}>Sign up</h2>
        <p className="text-body-md" style={{ color: "var(--color-on-surface-variant)", marginTop: "0.375rem", marginBottom: "1.5rem" }}>
          Free, and takes under a minute.
        </p>
        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <IconInput icon="person" placeholder="Username" required value={username} onChange={(e) => setUsername(e.target.value)} />
          <IconInput icon="mail" type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <IconInput icon="lock" type="password" placeholder="Password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
          <IconInput icon="pin_drop" placeholder="Region / city" value={region} onChange={(e) => setRegion(e.target.value)} />
          {error && <p className="text-body-sm" style={{ color: "var(--color-on-error-container)" }}>{error}</p>}
          <Button type="submit" disabled={loading} style={{ height: "3.25rem", width: "100%", gap: "0.5rem" }}>
            <span>{loading ? "Creating account..." : "Join VoiceUp"}</span>
            {!loading && <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>}
          </Button>
        </form>
        <p className="text-body-sm" style={{ marginTop: "1.5rem", color: "var(--color-on-surface-variant)", textAlign: "center" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "var(--color-secondary)", fontWeight: 600 }}>Log in</Link>
        </p>
      </div>
    </AuthShell>
  );
}
