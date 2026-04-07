import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();
    // MVP: просто подтверждаем. Реально это будет LooksRepo.like(id).
    return NextResponse.json({ success: true, id });
  } catch (e) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
