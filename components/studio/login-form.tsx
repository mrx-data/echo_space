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
      className="grid max-w-xl gap-5 border-4 border-black bg-white p-6 shadow-[10px_10px_0_0_#000]"
    >
      <label className="grid gap-2">
        <span className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.14em]">
          <Mail aria-hidden="true" className="h-5 w-5 stroke-[4]" />
          管理员邮箱
        </span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
          className="w-full border-4 border-black bg-neo-bg px-4 py-3 text-base font-bold placeholder:opacity-40 focus:outline-none focus:ring-4 focus:ring-neo-secondary"
        />
      </label>

      <label className="grid gap-2">
        <span className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.14em]">
          <Lock aria-hidden="true" className="h-5 w-5 stroke-[4]" />
          密码
        </span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••••"
          required
          className="w-full border-4 border-black bg-neo-bg px-4 py-3 text-base font-bold placeholder:opacity-40 focus:outline-none focus:ring-4 focus:ring-neo-secondary"
        />
      </label>

      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex min-h-14 items-center justify-center gap-2 border-4 border-black bg-neo-secondary px-6 py-3 text-sm font-black uppercase tracking-[0.14em] shadow-[6px_6px_0_0_#000] transition duration-100 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none disabled:opacity-60"
      >
        {isLoading ? (
          <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin stroke-[4]" />
        ) : (
          <LogIn aria-hidden="true" className="h-5 w-5 stroke-[4]" />
        )}
        登录
      </button>

      <div className="border-t-4 border-black pt-4">
        <p className="mb-3 text-xs font-bold opacity-60">或者使用 Magic Link：</p>
        <button
          type="button"
          onClick={handleMagicLink}
          disabled={isLoading}
          className="inline-flex w-full items-center justify-center gap-2 border-4 border-black bg-neo-muted px-5 py-3 text-sm font-black uppercase tracking-[0.14em] shadow-[4px_4px_0_0_#000] transition duration-100 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-60"
        >
          <Send aria-hidden="true" className="h-4 w-4 stroke-[4]" />
          发送登录链接
        </button>
      </div>

      {message ? (
        <p
          className={`border-4 border-black px-4 py-3 text-sm font-black ${
            status === "error" ? "bg-neo-accent" : "bg-neo-muted"
          }`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
