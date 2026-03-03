import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { createSubmission, logAudit } from '@/lib/db/queries';

// POST /api/form/new - Create a new form submission
export async function POST(request: NextRequest) {
  const session = await auth();
  // TODO: Remove dev bypass once auth is re-enabled
  const userId = session?.user?.id ?? '00000000-0000-0000-0000-000000000000';

  try {
    const body = await request.json().catch(() => ({}));
    const { pdfVersion } = body as { pdfVersion?: string };

    const submission = await createSubmission(
      userId,
      pdfVersion || 'sf861',
    );

    const ip = request.headers.get('x-forwarded-for') ?? null;
    logAudit(
      userId,
      submission.id,
      'submission_create',
      undefined,
      undefined,
      ip ?? undefined,
    ).catch((err) => console.error('Audit log error:', err));

    return NextResponse.json(
      { submissionId: submission.id },
      { status: 201 },
    );
  } catch (error) {
    console.error('Create submission error:', error);
    return NextResponse.json(
      { error: 'Failed to create submission' },
      { status: 500 },
    );
  }
}
