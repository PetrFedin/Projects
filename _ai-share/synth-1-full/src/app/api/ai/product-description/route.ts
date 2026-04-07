import { NextRequest, NextResponse } from "next/server";
import { generateProductDescription } from "@/ai/flows/generate-product-description";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, brand, category, color, composition, tags, sustainability, existingDescription, includeSeo } = body;

    if (!name || !brand || !category || !color) {
      return NextResponse.json(
        { error: "name, brand, category, color are required" },
        { status: 400 }
      );
    }

    const result = await generateProductDescription(
      {
        name,
        brand,
        category,
        color,
        composition: composition ?? undefined,
        tags: Array.isArray(tags) ? tags : undefined,
        sustainability: Array.isArray(sustainability) ? sustainability : undefined,
        existingDescription: existingDescription ?? undefined,
      },
      { includeSeo: !!includeSeo }
    );

    if (typeof result === "string") {
      return NextResponse.json({ description: result });
    }
    return NextResponse.json(result);
  } catch (e) {
    console.error("[product-description] Failed:", e);
    return NextResponse.json({ error: "Failed to generate description" }, { status: 500 });
  }
}
