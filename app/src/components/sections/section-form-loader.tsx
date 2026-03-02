"use client";

import { useEffect } from "react";
import type { SF86Section } from "@/lib/field-registry/types";
import { useAppStore } from "@/lib/state/stores/app-store";

interface SectionFormLoaderProps {
  submissionId: string;
  sectionKey: SF86Section;
}

export function SectionFormLoader({
  submissionId,
  sectionKey,
}: SectionFormLoaderProps) {
  const setSubmissionId = useAppStore((s) => s.setSubmissionId);
  const navigateToSection = useAppStore((s) => s.navigateToSection);

  useEffect(() => {
    setSubmissionId(submissionId);
    navigateToSection(sectionKey);
  }, [submissionId, sectionKey, setSubmissionId, navigateToSection]);

  // Placeholder - will be replaced with actual section form components
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <p className="text-sm text-gray-500">
        Section form for <strong>{sectionKey}</strong> will render here.
      </p>
      <p className="mt-2 text-xs text-gray-400">
        This component will dynamically load the appropriate section form based
        on the section key and populate it with fields from the registry.
      </p>
    </div>
  );
}
