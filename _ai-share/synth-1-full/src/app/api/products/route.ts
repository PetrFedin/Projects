import { NextResponse } from "next/server";
import { normalizeFilters, buildWhere } from "../../../lib/serverQuery";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const raw = Object.fromEntries(url.searchParams.entries());

  const filters = normalizeFilters(raw as any);
  const where = buildWhere(filters);

  const all = [
    { id: "1", sku: "SKU-001", brand: "A.P.C.", category: "Outerwear", wholesale: 220, retail: 590, stock: 42, sellThrough: 38, gm: 62, status: "active" },
    { id: "2", sku: "SKU-002", brand: "Stone Island", category: "Knitwear", wholesale: 310, retail: 780, stock: 12, sellThrough: 21, gm: 58, status: "active" }
  ];

  const q = (filters.q ?? "").toLowerCase();
  let rows = all.filter((r) => (q ? `${r.sku} ${r.brand} ${r.category}`.toLowerCase().includes(q) : true));

  if (filters.sortBy && filters.sortDir) {
    const dir = filters.sortDir === "desc" ? -1 : 1;
    rows = rows.sort((a: any, b: any) => (a[filters.sortBy] > b[filters.sortBy] ? dir : -dir));
  }

  const total = rows.length;
  const start = (filters.page - 1) * filters.pageSize;
  const paged = rows.slice(start, start + filters.pageSize);

  return NextResponse.json({ rows: paged, total, debug: { where } });
}



