import { NextRequest, NextResponse } from "next/server";
import { repo } from "@/lib/repo";
import { Granularity, PeriodPreset } from "@/components/geo/geo.types";

function asPeriod(v: string | null): PeriodPreset {
  const allowed: PeriodPreset[] = ["7d","30d","90d","season","year"];
  if (allowed.includes(v as any)) return v as PeriodPreset;
  return "90d";
}

function asGranularity(v: string | null): Granularity {
  const allowed: Granularity[] = ["week","month"];
  if (allowed.includes(v as any)) return v as Granularity;
  return "week";
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const period = asPeriod(searchParams.get("period"));
  const granularity = asGranularity(searchParams.get("granularity"));

  const data = await repo.geo.getGeoAnalytics({ period, granularity });
  return NextResponse.json(data);
}
