const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, data: unknown) {
    super(extractMessage(data) ?? `Request failed with status ${status}`);
    this.status = status;
    this.data = data;
  }
}

function extractMessage(data: unknown): string | null {
  if (!data) return null;
  if (Array.isArray(data)) return data.join(" ");
  if (typeof data === "string") return data;
  if (typeof data === "object") {
    const values = Object.values(data as Record<string, unknown>);
    const first = values[0];
    if (Array.isArray(first)) return String(first[0]);
    if (typeof first === "string") return first;
  }
  return null;
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  /** Seconds to cache for (ISR). Omit for always-fresh (no-store). */
  revalidate?: number;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, revalidate } = options;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    ...(revalidate !== undefined ? { next: { revalidate } } : { cache: "no-store" }),
  });

  if (res.status === 204) {
    return null as T;
  }

  const contentType = res.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json") ? await res.json() : null;

  if (!res.ok) {
    throw new ApiError(res.status, data);
  }

  return data as T;
}

export const apiGet = <T>(path: string, revalidate?: number) => request<T>(path, { revalidate });

export const apiPost = <T>(path: string, body: unknown) => request<T>(path, { method: "POST", body });
