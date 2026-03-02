import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';
import { getSubmission } from '@/lib/db/queries';
import { FormShell } from '@/components/shell/form-shell';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ submissionId: string }>;
}

export default async function FormLayout({ children, params }: LayoutProps) {
  const { submissionId } = await params;

  // Verify the submission exists and belongs to the authenticated user
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const submission = await getSubmission(submissionId);
  if (!submission || submission.user_id !== session.user.id) {
    redirect('/new');
  }

  return <FormShell submissionId={submissionId}>{children}</FormShell>;
}
