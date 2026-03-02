import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { getSubmission, loadAllSectionsFromDb } from '@/lib/db/queries';
import { ALL_SECTIONS } from '@/lib/field-registry/types';

interface RouteParams {
  params: Promise<{ submissionId: string }>;
}

// GET /api/form/[submissionId]/progress - Get completion per section
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const { submissionId } = await params;

  const submission = await getSubmission(submissionId);
  if (!submission || submission.user_id !== userId) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const savedSections = await loadAllSectionsFromDb(submissionId);
    const savedKeys = new Set(savedSections.map((s) => s.section_key));

    // Build per-section completion: 1 if data exists on server, 0 if not.
    // A more granular % would require decrypting and counting filled fields
    // vs required fields, which is expensive — do that on demand, not here.
    const sections: Record<string, number> = {};
    for (const key of ALL_SECTIONS) {
      sections[key] = savedKeys.has(key) ? 1 : 0;
    }

    const total = ALL_SECTIONS.length;
    const completed = savedSections.length;
    const overallCompletion =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    return NextResponse.json({
      submissionId,
      overallCompletion,
      sections,
    });
  } catch (error) {
    console.error('Progress load error:', error);
    // Fall back to zeros
    const sections: Record<string, number> = {};
    for (const key of ALL_SECTIONS) {
      sections[key] = 0;
    }
    return NextResponse.json({
      submissionId,
      overallCompletion: 0,
      sections,
    });
  }
}
