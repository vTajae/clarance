import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { notFound, redirect } from 'next/navigation';
import { SECTION_GROUPS, SECTION_META, sectionToGroup } from '@/lib/field-registry/types';
import type { SF86Section, SF86SectionGroup } from '@/lib/field-registry/types';
import { SectionErrorBoundary } from '@/components/sections/section-error-boundary';

const SectionFormLoader = dynamic(
  () => import('@/components/sections/section-form-loader').then((m) => m.SectionFormLoader),
  {
    loading: () => (
      <div className="flex items-center gap-2 py-12 text-sm text-gray-500">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
        Loading section...
      </div>
    ),
  },
);

interface PageProps {
  params: Promise<{
    submissionId: string;
    sectionGroup: string;
    section: string;
  }>;
}

export default async function SectionPage({ params }: PageProps) {
  const { submissionId, sectionGroup, section } = await params;

  const group = sectionGroup as SF86SectionGroup;
  const sectionKey = section as SF86Section;

  // Validate section group exists
  if (!SECTION_GROUPS[group]) {
    notFound();
  }

  const meta = SECTION_META[sectionKey];
  if (!meta) {
    notFound();
  }

  // If section exists but belongs to a different group, redirect to the correct URL
  if (!SECTION_GROUPS[group].includes(sectionKey)) {
    const correctGroup = sectionToGroup(sectionKey);
    if (correctGroup) {
      redirect(`/${submissionId}/${correctGroup}/${sectionKey}`);
    }
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-6">
        <p className="text-sm font-medium capitalize text-blue-600">{meta.group}</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">{meta.title}</h1>
        <p className="mt-2 text-sm text-gray-500">{meta.description}</p>
      </div>

      <SectionErrorBoundary sectionName={meta.title}>
        <Suspense
          fallback={
            <div className="flex items-center gap-2 py-12 text-sm text-gray-500">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
              Loading form...
            </div>
          }
        >
          <SectionFormLoader
            submissionId={submissionId}
            sectionKey={sectionKey}
          />
        </Suspense>
      </SectionErrorBoundary>
    </div>
  );
}
