import { NextResponse } from "next/server";
import { LabDip, UpdateLabDipStatusSchema } from "@/lib/types/material-engineering";

// Mock data
let mockLabDips: LabDip[] = [
  {
    id: "ld-001",
    materialId: "mat-123",
    type: "lab-dip",
    status: "pending",
    submittedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    notes: "First round of color matching for Pantone 19-4052",
    imageUrl: "https://placehold.co/400x300/4B5320/FFFFFF?text=Lab+Dip+1",
  },
  {
    id: "ld-002",
    materialId: "mat-123",
    type: "strike-off",
    status: "approved",
    submittedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    notes: "Floral print scale approved",
    imageUrl: "https://placehold.co/400x300/FFB6C1/000000?text=Strike+Off+1",
  },
  {
    id: "ld-003",
    materialId: "mat-456",
    type: "lab-dip",
    status: "rejected",
    submittedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    notes: "Color is too warm, needs to be cooler",
    imageUrl: "https://placehold.co/400x300/8B0000/FFFFFF?text=Lab+Dip+2",
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const materialId = searchParams.get("materialId");

  let filteredDips = mockLabDips;
  if (materialId) {
    filteredDips = mockLabDips.filter((ld) => ld.materialId === materialId);
  }

  return NextResponse.json({ labDips: filteredDips });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = UpdateLabDipStatusSchema.parse(body);
    
    const index = mockLabDips.findIndex((ld) => ld.id === validatedData.id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: "Lab dip not found" },
        { status: 404 }
      );
    }
    
    // Update the mock data
    mockLabDips[index] = {
      ...mockLabDips[index],
      status: validatedData.status,
      ...(validatedData.notes ? { notes: validatedData.notes } : {}),
    };
    
    return NextResponse.json({ labDip: mockLabDips[index] });
  } catch (error) {
    console.error("Error updating lab dip status:", error);
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 }
    );
  }
}
