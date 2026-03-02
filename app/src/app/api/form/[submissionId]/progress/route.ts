import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ submissionId: string }>;
}

// GET /api/form/[submissionId]/progress - Get completion per section
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { submissionId } = await params;

  // TODO: Compute from actual stored data when DB is connected
  // For now, return placeholder structure
  return NextResponse.json({
    submissionId,
    overallCompletion: 0,
    sections: {
      personalInfo: 0,
      namesInfo: 0,
      birthInfo: 0,
      physicalAttributes: 0,
      contactInfo: 0,
      passportInfo: 0,
      citizenshipInfo: 0,
      dualCitizenshipInfo: 0,
      residencyInfo: 0,
      employmentInfo: 0,
      schoolInfo: 0,
      serviceInfo: 0,
      militaryHistoryInfo: 0,
      peopleThatKnow: 0,
      relationshipInfo: 0,
      relativesInfo: 0,
      foreignContacts: 0,
      foreignActivities: 0,
      mentalHealth: 0,
      policeRecord: 0,
      drugActivity: 0,
      alcoholUse: 0,
      investigationsInfo: 0,
      finances: 0,
      technology: 0,
      civil: 0,
      association: 0,
      acknowledgement: 0,
      signature: 0,
    },
  });
}
