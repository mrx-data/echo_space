"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export function AuthCallback() {
  const [message, setMessage] = useState("正在完成登录...");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    async function completeLogin() {
      const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");

      if (!accessToken || !refreshToken) {
        throw new Error("登录链接无效或已经过期。");
      }

      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken, refreshToken }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "登录失败");
      }

      window.location.replace("/studio/articles");
    }

    completeLogin().catch((error: Error) => {
      setFailed(true);
      setMessage(error.message);
    });
  }, []);

  return (
    <div className="grid max-w-xl gap-5 border-4 border-black bg-white p-6 shadow-[10px_10px_0_0_#000]">
      <div className="inline-flex items-center gap-3 text-xl font-black">
        {!failed ? <Loader2 aria-hidden="true" className="h-6 w-6 animate-spin stroke-[4]" /> : null}
        {message}
      </div>
      {failed ? (
        <Link
          href="/studio/login"
          className="inline-flex w-fit border-4 border-black bg-neo-secondary px-5 py-3 text-sm font-black uppercase tracking-[0.14em] shadow-[5px_5px_0_0_#000]"
        >
          重新登录
        </Link>
      ) : null}
    </div>
  );
}
