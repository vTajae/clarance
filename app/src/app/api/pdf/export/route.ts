import { NextRequest, NextResponse } from "next/server";

const PDF_SERVICE_URL = process.env.PDF_SERVICE_URL || "http://localhost:8001";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fieldValues, templatePath, overflowData } = body;

    if (!fieldValues || typeof fieldValues !== "object") {
      return NextResponse.json(
        { error: "fieldValues object is required" },
        { status: 400 }
      );
    }

    const endpoint = overflowData
      ? "/fill-pdf-with-continuation"
      : "/fill-pdf";

    const response = await fetch(`${PDF_SERVICE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        template_path: templatePath || "templates/sf86.pdf",
        field_values: fieldValues,
        overflow_data: overflowData,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `PDF service error: ${errorText}` },
        { status: 502 }
      );
    }

    const pdfBuffer = await response.arrayBuffer();

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="sf86-filled.pdf"',
      },
    });
  } catch (error) {
    console.error("PDF export error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
