import { NextResponse } from "next/server";
import { PhysicalTestLog, CreatePhysicalTestLogSchema } from "@/lib/types/material-testing";
import { v4 as uuidv4 } from "uuid";

// Mock data
let mockTestingLogs: PhysicalTestLog[] = [
  {
    id: "test-001",
    materialId: "mat-123",
    testCategory: "shrinkage",
    resultValue: "-2% warp, -1% weft",
    isPass: true,
    testedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    notes: "Within acceptable 3% tolerance",
  },
  {
    id: "test-002",
    materialId: "mat-123",
    testCategory: "colorfastness",
    resultValue: "Grade 3",
    isPass: false,
    testedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    notes: "Failed wet rubbing test, needs re-dyeing",
  },
  {
    id: "test-003",
    materialId: "mat-456",
    testCategory: "pilling",
    resultValue: "Grade 4",
    isPass: true,
    testedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    notes: "Good resistance after 2000 rubs",
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const materialId = searchParams.get("materialId");

  let filteredLogs = mockTestingLogs;
  if (materialId) {
    filteredLogs = mockTestingLogs.filter((log) => log.materialId === materialId);
  }

  // Sort by newest first
  filteredLogs.sort((a, b) => new Date(b.testedAt).getTime() - new Date(a.testedAt).getTime());

  return NextResponse.json({ testingLogs: filteredLogs });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = CreatePhysicalTestLogSchema.parse(body);
    
    const newTestLog: PhysicalTestLog = {
      id: `test-${uuidv4().substring(0, 8)}`,
      materialId: validatedData.materialId,
      testCategory: validatedData.testCategory,
      resultValue: validatedData.resultValue,
      isPass: validatedData.isPass,
      testedAt: new Date().toISOString(),
      ...(validatedData.notes ? { notes: validatedData.notes } : {}),
    };
    
    // Add to mock data
    mockTestingLogs.push(newTestLog);
    
    return NextResponse.json({ testingLog: newTestLog }, { status: 201 });
  } catch (error) {
    console.error("Error creating testing log:", error);
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 }
    );
  }
}
