import { NextRequest, NextResponse } from "next/server";
import { summarizeProductReviews } from "@/ai/flows/summarize-product-reviews";

export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get("productId");
  if (!productId) return NextResponse.json({ error: "productId is required" }, { status: 400 });

  // Mock reviews for different products to simulate real feedback
  const mockReviews = [
    { text: "Отличное качество материала, сидит идеально.", rating: 5 },
    { text: "Немного маломерит в плечах, но в остальном супер.", rating: 4 },
    { text: "Цвет чуть темнее, чем на фото, но мне нравится.", rating: 4 },
    { text: "Ткань приятная к телу, после стирки не села.", rating: 5 },
    { text: "Доставка задержалась, но товар того стоит.", rating: 4 },
  ];

  try {
    const summary = await summarizeProductReviews({ reviews: mockReviews });
    return NextResponse.json(summary);
  } catch (e) {
    return NextResponse.json({ error: "Failed to summarize reviews" }, { status: 500 });
  }
}
