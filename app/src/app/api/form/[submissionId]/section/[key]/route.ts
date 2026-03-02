import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import {
  getSubmission,
  loadSectionFromDb,
  saveSectionToDb,
  logAudit,
} from '@/lib/db/queries';

interface RouteParams {
  params: Promise<{ submissionId: string; key: string }>;
}

/** Verify the authenticated user owns the submission. Returns userId or a 401/403 response. */
async function verifyOwnership(
  submissionId: string,
): Promise<{ userId: string } | NextResponse> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 },
    );
  }

  const submission = await getSubmission(submissionId);
  if (!submission || submission.user_id !== userId) {
    return NextResponse.json(
      { error: 'Not found' },
      { status: 404 },
    );
  }

  return { userId };
}

// GET /api/form/[submissionId]/section/[key] - Load section data
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { submissionId, key } = await params;

  const ownership = await verifyOwnership(submissionId);
  if (ownership instanceof NextResponse) return ownership;

  try {
    const row = await loadSectionFromDb(submissionId, key);

    return NextResponse.json({
      submissionId,
      sectionKey: key,
      data: row?.data ?? null,
      version: row?.version ?? 0,
    });
  } catch (error) {
    console.error('Section load error:', error);
    // Fall back to empty data so the client can still function
    return NextResponse.json({
      submissionId,
      sectionKey: key,
      data: null,
      version: 0,
    });
  }
}

// PUT /api/form/[submissionId]/section/[key] - Save section data
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { submissionId, key } = await params;

  const ownership = await verifyOwnership(submissionId);
  if (ownership instanceof NextResponse) return ownership;
  const { userId } = ownership;

  try {
    const body = await request.json();
    const { data, version } = body as {
      data?: Record<string, unknown>;
      version?: number;
    };

    if (!data || typeof data !== 'object') {
      return NextResponse.json(
        { error: 'data object is required' },
        { status: 400 },
      );
    }

    const result = await saveSectionToDb(
      submissionId,
      key,
      data,
      version,
    );

    // Audit log (fire and forget)
    const ip = request.headers.get('x-forwarded-for') ?? null;
    logAudit(userId, submissionId, 'section_save', key, undefined, ip ?? undefined).catch(
      (err) => console.error('Audit log error:', err),
    );

    return NextResponse.json({
      submissionId,
      sectionKey: key,
      version: result.version,
      savedAt: result.updatedAt.toISOString(),
    });
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('Version conflict')) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 },
      );
    }

    console.error('Section save error:', error);
    return NextResponse.json(
      { error: 'Failed to save section' },
      { status: 500 },
    );
  }
}
