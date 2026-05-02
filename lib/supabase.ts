import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const AUTH_ACCESS_COOKIE = "echo_sb_access_token";
export const AUTH_REFRESH_COOKIE = "echo_sb_refresh_token";

type SupabaseFetchOptions = RequestInit & {
  tags?: string[];
  noStore?: boolean;
  useAnonKey?: boolean;
};

export type SupabaseConfig = {
  url: string;
  anonKey: string;
  serviceRoleKey: string;
};

export function getSupabaseConfig(): SupabaseConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !anonKey || !serviceRoleKey) {
    return null;
  }

  return {
    url: url.replace(/\/$/, ""),
    anonKey,
    serviceRoleKey,
  };
}

export function requireSupabaseConfig(): SupabaseConfig {
  const config = getSupabaseConfig();
  if (!config) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
  return config;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(getSupabaseConfig());
}

export async function supabaseRestFetch<T>(
  path: string,
  options: SupabaseFetchOptions = {},
): Promise<T> {
  const config = requireSupabaseConfig();
  const { tags, noStore, useAnonKey, ...requestOptions } = options;
  const key = useAnonKey ? config.anonKey : config.serviceRoleKey;
  const headers = new Headers(options.headers);

  headers.set("apikey", key);
  headers.set("Authorization", `Bearer ${key}`);
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...requestOptions,
    headers,
    cache: noStore ? "no-store" : requestOptions.cache,
    next: tags ? { tags } : undefined,
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Supabase REST request failed (${response.status}): ${details}`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json() as Promise<T>;
}

export async function supabaseAuthFetch<T>(
  path: string,
  options: RequestInit = {},
  accessToken?: string,
): Promise<T> {
  const config = requireSupabaseConfig();
  const headers = new Headers(options.headers);

  headers.set("apikey", config.anonKey);
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${config.url}/auth/v1/${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Supabase Auth request failed (${response.status}): ${details}`);
  }

  return response.json() as Promise<T>;
}

export function setAuthCookies(response: NextResponse, accessToken: string, refreshToken: string) {
  const secure = process.env.NODE_ENV === "production";

  response.cookies.set(AUTH_ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 60 * 60,
  });
  response.cookies.set(AUTH_REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.delete(AUTH_ACCESS_COOKIE);
  response.cookies.delete(AUTH_REFRESH_COOKIE);
}

export async function readAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_ACCESS_COOKIE)?.value;
}
