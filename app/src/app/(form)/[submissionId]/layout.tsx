import { FormShell } from "@/components/shell/form-shell";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ submissionId: string }>;
}

export default async function FormLayout({ children, params }: LayoutProps) {
  const { submissionId } = await params;

  return <FormShell submissionId={submissionId}>{children}</FormShell>;
}
