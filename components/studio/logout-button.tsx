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
      className="inline-flex min-h-12 items-center gap-2 border-4 border-black bg-white px-4 py-2 text-sm font-black uppercase tracking-[0.14em] shadow-[5px_5px_0_0_#000] transition duration-100 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
    >
      <LogOut aria-hidden="true" className="h-4 w-4 stroke-[4]" />
      退出
    </button>
  );
}
