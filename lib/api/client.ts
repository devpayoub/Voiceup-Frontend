import { clearTokens, getAccessToken, getRefreshToken, setTokens } from "../auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function refreshAccessToken(): Promise<string | null> {
  const refresh = getRefreshToken();
  if (!refresh) return null;
  const res = await fetch(`${API_URL}/api/auth/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });
  if (!res.ok) {
    clearTokens();
    return null;
  }
  const data = await res.json();
  setTokens(data.access, refresh);
  return data.access;
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const isFormData = options.body instanceof FormData;
  const headers = new Headers(options.headers);
  if (!isFormData && options.body) headers.set("Content-Type", "application/json");

  const access = getAccessToken();
  if (access) headers.set("Authorization", `Bearer ${access}`);

  let res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (res.status === 401 && access) {
    const newAccess = await refreshAccessToken();
    if (newAccess) {
      headers.set("Authorization", `Bearer ${newAccess}`);
      res = await fetch(`${API_URL}${path}`, { ...options, headers });
    }
  }

  return res;
}

export async function apiJson<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await apiFetch(path, options);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${body}`);
  }
  return res.json();
}

export function mediaUrl(path: string | null): string | null {
  if (!path) return null;
  return path.startsWith("http") ? path : `${API_URL}${path}`;
}

// DRF validation errors come back as {"field": ["message"]}; apiJson embeds
// the raw body in its thrown Error, so pull the real reason out of that
// instead of always showing a generic fallback message.
export function apiErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error) {
    const jsonStart = err.message.indexOf("{");
    if (jsonStart !== -1) {
      try {
        const data = JSON.parse(err.message.slice(jsonStart));
        const messages = Object.values(data).flat().filter((v) => typeof v === "string");
        if (messages.length) return messages.join(" ");
      } catch {
        // Not JSON — fall through to fallback.
      }
    }
  }
  return fallback;
}

export { API_URL };
