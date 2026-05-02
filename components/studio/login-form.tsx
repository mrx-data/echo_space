"use client";

import { useState } from "react";
import { Loader2, Mail, Send } from "lucide-react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
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

  return (
    <form
      onSubmit={handleSubmit}
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
      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex min-h-14 items-center justify-center gap-2 border-4 border-black bg-neo-secondary px-6 py-3 text-sm font-black uppercase tracking-[0.14em] shadow-[6px_6px_0_0_#000] transition duration-100 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none disabled:opacity-60"
      >
        {status === "loading" ? (
          <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin stroke-[4]" />
        ) : (
          <Send aria-hidden="true" className="h-5 w-5 stroke-[4]" />
        )}
        发送登录链接
      </button>
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
