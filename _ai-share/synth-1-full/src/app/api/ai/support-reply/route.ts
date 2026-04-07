import { NextRequest, NextResponse } from "next/server";
import { suggestSupportReply } from "@/ai/flows/suggest-support-reply";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerMessage, faq, context } = body;
    if (!customerMessage) return NextResponse.json({ error: "customerMessage is required" }, { status: 400 });
    const result = await suggestSupportReply({ customerMessage, faq, context });
    return NextResponse.json(result);
  } catch (e) {
    console.error("[support-reply] Failed:", e);
    return NextResponse.json({ error: "Failed to suggest reply" }, { status: 500 });
  }
}
