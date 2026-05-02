import { redirect } from "next/navigation";

export default function EditorRedirectPage() {
  redirect("/studio/articles/new");
}
