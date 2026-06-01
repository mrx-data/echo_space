"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/studio/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      className="inline-flex items-center gap-1.5 rounded-full border border-[#e8e4db] bg-white px-4 py-2 text-sm text-[#64645c] transition hover:border-[#171713] hover:text-[#171713]"
    >
      <LogOut aria-hidden="true" className="h-3.5 w-3.5" />
      退出
    </button>
  );
}
