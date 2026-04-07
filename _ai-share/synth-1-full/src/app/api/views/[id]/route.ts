import { NextResponse } from "next/server";
import { deleteView, updateView } from "../../../../services/viewsStore";
import { normalizeFilters } from "../../../../lib/serverQuery";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const patch: any = {};

  if (body.name !== undefined) patch.name = String(body.name);
  if (body.scope !== undefined) patch.scope = body.scope === "team" ? "team" : "personal";
  if (body.filters !== undefined) patch.filters = normalizeFilters(body.filters);

  const v = updateView(id, patch);
  if (!v) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ view: v });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ok = deleteView(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}



