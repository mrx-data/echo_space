import { NextResponse } from "next/server";
import { getAdminEmail } from "@/lib/auth";
import { supabaseAuthFetch } from "@/lib/supabase";

export async function POST(request: Request) {
  const { email } = (await request.json().catch(() => ({}))) as { email?: string };
  const normalizedEmail = email?.trim().toLowerCase();
  const adminEmail = getAdminEmail();

  if (!adminEmail) {
    return NextResponse.json({ error: "ADMIN_EMAIL 尚未配置" }, { status: 500 });
  }

  if (!normalizedEmail || normalizedEmail !== adminEmail) {
    return NextResponse.json({ error: "这个邮箱没有 Studio 访问权限" }, { status: 403 });
  }

  const origin = new URL(request.url).origin;

  await supabaseAuthFetch("otp", {
    method: "POST",
    body: JSON.stringify({
      email: normalizedEmail,
      should_create_user: false,
      email_redirect_to: `${origin}/studio/auth/callback`,
    }),
  });

  return NextResponse.json({ ok: true });
}
