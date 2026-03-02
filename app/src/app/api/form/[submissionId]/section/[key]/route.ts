import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ submissionId: string; key: string }>;
}

// GET /api/form/[submissionId]/section/[key] - Load section data
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { submissionId, key } = await params;

  // TODO: Replace with actual PostgreSQL query when DB is connected
  // For now, return empty data (client uses IndexedDB as primary)
  return NextResponse.json({
    submissionId,
    sectionKey: key,
    data: null,
    version: 0,
  });
}

// PUT /api/form/[submissionId]/section/[key] - Save section data
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { submissionId, key } = await params;

  try {
    const body = await request.json();
    const { data, version } = body;

    if (!data || typeof data !== "object") {
      return NextResponse.json(
        { error: "data object is required" },
        { status: 400 }
      );
    }

    // TODO: Replace with actual PostgreSQL upsert when DB is connected
    // - Encrypt data with pgcrypto before storing
    // - Check version for optimistic concurrency
    // - Write audit log entry

    return NextResponse.json({
      submissionId,
      sectionKey: key,
      version: (version || 0) + 1,
      savedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Section save error:", error);
    return NextResponse.json(
      { error: "Failed to save section" },
      { status: 500 }
    );
  }
}
