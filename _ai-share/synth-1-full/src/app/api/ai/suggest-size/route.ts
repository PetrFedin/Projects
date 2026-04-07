import { NextRequest, NextResponse } from "next/server";
import { suggestSize } from "@/ai/flows/suggest-size";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productName, category, sizeChart, userHeight, userWeight, userChest, userWaist, userHips, userQuestion } = body;
    if (!productName || !category) {
      return NextResponse.json({ error: "productName and category are required" }, { status: 400 });
    }
    const result = await suggestSize({
      productName,
      category,
      sizeChart,
      userHeight: userHeight ? Number(userHeight) : undefined,
      userWeight: userWeight ? Number(userWeight) : undefined,
      userChest: userChest ? Number(userChest) : undefined,
      userWaist: userWaist ? Number(userWaist) : undefined,
      userHips: userHips ? Number(userHips) : undefined,
      userQuestion,
    });
    return NextResponse.json(result);
  } catch (e) {
    console.error("[suggest-size] Failed:", e);
    return NextResponse.json({ error: "Failed to suggest size" }, { status: 500 });
  }
}
