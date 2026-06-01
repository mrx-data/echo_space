import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/studio/login-form";

export const metadata: Metadata = {
  title: "Studio Login",
  description: "Echo Space 管理员登录。",
};

export default function StudioLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f5f0] px-4 py-12">
      <div className="grid w-full max-w-md gap-8">
        <div className="text-center">
          <Link
            href="/"
            className="font-['Cormorant_Garamond',Georgia,serif] text-3xl font-semibold tracking-tight text-[#596044]"
          >
            Echo Space
          </Link>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
