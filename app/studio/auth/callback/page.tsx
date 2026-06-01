import type { Metadata } from "next";
import { AuthCallback } from "@/components/studio/auth-callback";

export const metadata: Metadata = {
  title: "完成登录",
};

export default function StudioAuthCallbackPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f5f0] px-4 py-12">
      <AuthCallback />
    </main>
  );
}
