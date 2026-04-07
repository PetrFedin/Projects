import { NextResponse } from "next/server";
import { SEEDED_LOOKS } from "@/data/looks.seed";

export async function GET() {
  // В MVP возвращаем сид-данные. Реально это будет LooksRepo.list() через БД.
  return NextResponse.json(SEEDED_LOOKS);
}
