"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { register } from "@/lib/api/auth";
import { apiErrorMessage } from "@/lib/api/client";
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
  const { t } = useTranslation();
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
    } catch (err) {
      setError(apiErrorMessage(err, t("auth.register.errorGeneric")));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell headline={t("auth.register.headline")} subhead={t("auth.register.subhead")}>
      <div className="card" style={{ padding: "2.5rem" }}>
        <h2 className="text-headline-md" style={{ color: "var(--color-on-surface)" }}>{t("auth.register.title")}</h2>
        <p className="text-body-md" style={{ color: "var(--color-on-surface-variant)", marginTop: "0.375rem", marginBottom: "1.5rem" }}>
          {t("auth.register.subtitle")}
        </p>
        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <IconInput icon="person" placeholder={t("auth.register.username")} required value={username} onChange={(e) => setUsername(e.target.value)} />
          <IconInput icon="mail" type="email" placeholder={t("auth.register.email")} required value={email} onChange={(e) => setEmail(e.target.value)} />
          <IconInput icon="lock" type="password" placeholder={t("auth.register.password")} required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
          <IconInput icon="pin_drop" placeholder={t("auth.register.region")} value={region} onChange={(e) => setRegion(e.target.value)} />
          {error && <p className="text-body-sm" style={{ color: "var(--color-on-error-container)" }}>{error}</p>}
          <Button type="submit" disabled={loading} style={{ height: "3.25rem", width: "100%", gap: "0.5rem" }}>
            <span>{loading ? t("auth.register.submitting") : t("auth.register.submit")}</span>
            {!loading && <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>}
          </Button>
        </form>
        <p className="text-body-sm" style={{ marginTop: "1.5rem", color: "var(--color-on-surface-variant)", textAlign: "center" }}>
          {t("auth.register.hasAccount")}{" "}
          <Link href="/login" style={{ color: "var(--color-secondary)", fontWeight: 600 }}>{t("auth.register.loginLink")}</Link>
        </p>
      </div>
    </AuthShell>
  );
}
