import { NextRequest, NextResponse } from "next/server";
import { moderateContent } from "@/ai/flows/moderate-content";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, context } = body;
    if (!text) return NextResponse.json({ error: "text is required" }, { status: 400 });
    const result = await moderateContent({ text, context });
    return NextResponse.json(result);
  } catch (e) {
    console.error("[moderate] Failed:", e);
    return NextResponse.json({ error: "Moderation failed" }, { status: 500 });
  }
}
