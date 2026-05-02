import { NextResponse } from "next/server";
import { getAdminEmail } from "@/lib/auth";
import { setAuthCookies, supabaseAuthFetch } from "@/lib/supabase";

type TokenResponse = {
  access_token: string;
  refresh_token: string;
  user: { id: string; email?: string };
};

export async function POST(request: Request) {
  const { email, password } = (await request.json().catch(() => ({}))) as {
    email?: string;
    password?: string;
  };

  const normalizedEmail = email?.trim().toLowerCase();
  const adminEmail = getAdminEmail();

  if (!adminEmail) {
    return NextResponse.json({ error: "ADMIN_EMAIL 尚未配置" }, { status: 500 });
  }

  if (!normalizedEmail || normalizedEmail !== adminEmail) {
    return NextResponse.json({ error: "这个邮箱没有 Studio 访问权限" }, { status: 403 });
  }

  if (!password) {
    return NextResponse.json({ error: "请输入密码" }, { status: 400 });
  }

  try {
    const data = await supabaseAuthFetch<TokenResponse>(
      "token?grant_type=password",
      {
        method: "POST",
        body: JSON.stringify({ email: normalizedEmail, password }),
      },
    );

    const response = NextResponse.json({ ok: true });
    setAuthCookies(response, data.access_token, data.refresh_token);
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "登录失败";
    if (message.includes("Invalid login credentials")) {
      return NextResponse.json({ error: "邮箱或密码错误" }, { status: 401 });
    }
    return NextResponse.json({ error: `登录失败：${message}` }, { status: 500 });
  }
}
