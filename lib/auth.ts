import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { readAccessToken, supabaseAuthFetch } from "@/lib/supabase";

export type SupabaseUser = {
  id: string;
  email?: string;
};

type UserResponse = {
  id: string;
  email?: string;
};

export function getAdminEmail() {
  return process.env.ADMIN_EMAIL?.trim().toLowerCase();
}

export async function getSessionUser(): Promise<SupabaseUser | null> {
  const accessToken = await readAccessToken();
  if (!accessToken) return null;

  try {
    const user = await supabaseAuthFetch<UserResponse>("user", { method: "GET" }, accessToken);
    return { id: user.id, email: user.email };
  } catch {
    return null;
  }
}

export async function getAdminUser(): Promise<SupabaseUser | null> {
  const adminEmail = getAdminEmail();
  const user = await getSessionUser();

  if (!adminEmail || !user?.email) return null;
  if (user.email.toLowerCase() !== adminEmail) return null;

  return user;
}

export async function requireAdminPage() {
  const user = await getAdminUser();
  if (!user) {
    redirect("/studio/login");
  }
  return user;
}

export async function requireAdminApi(): Promise<
  | { ok: true; user: SupabaseUser }
  | { ok: false; response: NextResponse<{ error: string }> }
> {
  const user = await getAdminUser();
  if (!user) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { ok: true, user };
}
