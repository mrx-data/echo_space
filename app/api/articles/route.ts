import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "文件写入式编辑器已经停用，请使用 /studio/articles/new" },
    { status: 410 },
  );
}
