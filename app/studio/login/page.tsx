import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/studio/login-form";

export const metadata: Metadata = {
  title: "Studio Login",
  description: "Echo Space 管理员登录。",
};

export default function StudioLoginPage() {
  return (
    <main className="min-h-screen bg-neo-bg px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-5xl gap-8">
        <Link
          href="/"
          className="w-fit -rotate-1 border-4 border-black bg-neo-accent px-4 py-2 text-xl font-black uppercase tracking-[0] shadow-[5px_5px_0_0_#000]"
        >
          Echo Space
        </Link>
        <div className="grid gap-4">
          <span className="w-fit border-4 border-black bg-neo-secondary px-4 py-2 text-sm font-black uppercase tracking-[0.16em] shadow-[4px_4px_0_0_#000]">
            Admin Only
          </span>
          <h1 className="max-w-4xl text-6xl font-black uppercase leading-none tracking-[0] sm:text-8xl">
            Echo Studio
          </h1>
          <p className="max-w-2xl border-l-8 border-black bg-white px-5 py-4 text-xl font-bold leading-snug shadow-[6px_6px_0_0_#000]">
            用管理员邮箱和密码登录，进入单人内容工作台。也支持 Magic Link 备用登录。
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
