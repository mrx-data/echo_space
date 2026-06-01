"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Lock, Send, LogIn } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handlePasswordLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();

    if (response.ok) {
      router.replace("/studio/articles");
    } else {
      setStatus("error");
      setMessage(data.error ?? "登录失败");
    }
  }

  async function handleMagicLink() {
    if (!email.trim()) {
      setStatus("error");
      setMessage("请先输入邮箱");
      return;
    }

    setStatus("loading");
    setMessage("");

    const response = await fetch("/api/auth/magic-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();

    if (response.ok) {
      setStatus("sent");
      setMessage("登录链接已经发出，请回到邮箱点击 magic link。");
    } else {
      setStatus("error");
      setMessage(data.error ?? "发送失败");
    }
  }

  const isLoading = status === "loading";

  return (
    <form
      onSubmit={handlePasswordLogin}
      className="editorial-card grid gap-5 p-8"
    >
      <div className="text-center">
        <h1 className="font-['Cormorant_Garamond',Georgia,serif] text-3xl font-semibold text-[#596044]">
          ECHO STUDIO
        </h1>
        <p className="mt-1 text-sm text-[#64645c]">
          管理员登录 · 单人内容工作台
        </p>
      </div>

      <label className="grid gap-1.5">
        <span className="text-xs font-medium uppercase tracking-wide text-[#64645c]">
          管理员邮箱
        </span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
          className="w-full rounded-[10px] border border-[#e8e4db] bg-[#f7f5f0] px-4 py-3 text-base text-[#171713] placeholder:text-[#9a988f] focus:border-[#596044] focus:outline-none focus:ring-2 focus:ring-[#596044]/20"
        />
      </label>

      <label className="grid gap-1.5">
        <span className="text-xs font-medium uppercase tracking-wide text-[#64645c]">
          密码
        </span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••••"
          required
          className="w-full rounded-[10px] border border-[#e8e4db] bg-[#f7f5f0] px-4 py-3 text-base text-[#171713] placeholder:text-[#9a988f] focus:border-[#596044] focus:outline-none focus:ring-2 focus:ring-[#596044]/20"
        />
      </label>

      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#485035] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#596044] disabled:opacity-50"
      >
        {isLoading ? (
          <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
        ) : (
          <LogIn aria-hidden="true" className="h-4 w-4" />
        )}
        登录
      </button>

      <div className="border-t border-[#e8e4db] pt-4">
        <p className="mb-3 text-xs text-[#9a988f]">或者使用 Magic Link：</p>
        <button
          type="button"
          onClick={handleMagicLink}
          disabled={isLoading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#e8e4db] bg-white px-5 py-3 text-sm font-medium text-[#171713] transition hover:border-[#596044] hover:text-[#596044] disabled:opacity-50"
        >
          <Send aria-hidden="true" className="h-3.5 w-3.5" />
          发送登录链接
        </button>
      </div>

      {message ? (
        <p
          className={`rounded-[10px] px-4 py-3 text-sm ${
            status === "error"
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-[#f7f5f0] text-[#596044] border border-[#e8e4db]"
          }`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
