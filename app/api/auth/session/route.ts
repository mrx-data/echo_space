import { NextResponse } from "next/server";
import { getAdminEmail } from "@/lib/auth";
import { setAuthCookies, supabaseAuthFetch } from "@/lib/supabase";

type UserResponse = {
  id: string;
  email?: string;
};

export async function POST(request: Request) {
  const { accessToken, refreshToken } = (await request.json().catch(() => ({}))) as {
    accessToken?: string;
    refreshToken?: string;
  };

  if (!accessToken || !refreshToken) {
    return NextResponse.json({ error: "登录凭证无效" }, { status: 400 });
  }

  const user = await supabaseAuthFetch<UserResponse>("user", { method: "GET" }, accessToken);
  const adminEmail = getAdminEmail();

  if (!adminEmail || user.email?.toLowerCase() !== adminEmail) {
    return NextResponse.json({ error: "这个账号没有 Studio 访问权限" }, { status: 403 });
  }

  const response = NextResponse.json({ ok: true });
  setAuthCookies(response, accessToken, refreshToken);
  return response;
}
