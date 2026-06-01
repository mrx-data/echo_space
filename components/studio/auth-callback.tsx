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
    <div className="editorial-card grid max-w-md gap-5 p-8 text-center">
      <div className="inline-flex items-center justify-center gap-3 text-lg text-[#171713]">
        {!failed ? <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin text-[#596044]" /> : null}
        {message}
      </div>
      {failed ? (
        <Link
          href="/studio/login"
          className="inline-flex w-fit items-center justify-center rounded-full bg-[#485035] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#596044] mx-auto"
        >
          重新登录
        </Link>
      ) : null}
    </div>
  );
}
