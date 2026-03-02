import { NextRequest, NextResponse } from "next/server";

const PDF_SERVICE_URL = process.env.PDF_SERVICE_URL || "http://localhost:8001";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No PDF file provided" },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "File must be a PDF" },
        { status: 400 }
      );
    }

    // Forward to Python PDF service
    const pdfFormData = new FormData();
    pdfFormData.append("file", file);

    const response = await fetch(`${PDF_SERVICE_URL}/extract-fields`, {
      method: "POST",
      body: pdfFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `PDF service error: ${errorText}` },
        { status: 502 }
      );
    }

    const extractedFields = await response.json();

    return NextResponse.json({
      success: true,
      fieldCount: Object.keys(extractedFields.fields).length,
      fields: extractedFields.fields,
    });
  } catch (error) {
    console.error("PDF import error:", error);
    return NextResponse.json(
      { error: "Failed to process PDF" },
      { status: 500 }
    );
  }
}
