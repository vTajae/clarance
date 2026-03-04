'use client';

import { type ReactNode, useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAtomValue } from 'jotai';
import { SectionSidebar } from './section-sidebar';
import { TopBar } from './top-bar';
import { WizardControls } from './wizard-controls';
import { PdfPreview, type FieldRect } from './pdf-preview';
import { useSsnAutoFill } from '@/lib/state/hooks/use-ssn-autofill';
import { useNameAutoFill } from '@/lib/state/hooks/use-name-autofill';
import { dirtyFieldsAtom } from '@/lib/state/atoms/field-atoms';
import { useAppStore } from '@/lib/state/stores/app-store';

interface FormShellProps {
  submissionId: string;
  children: ReactNode;
}

export function FormShell({ submissionId, children }: FormShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [activeRect] = useState<FieldRect | null>(null);
  const pathname = usePathname();

  // Track whether we're at mobile viewport to avoid rendering duplicate
  // SectionSidebar instances (one desktop panel + one mobile overlay).
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Close mobile sidebar overlay on route change.
  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [pathname, isMobile]);

  // -- SSN auto-fill: section 4 → 137 page header fields ------------------
  useSsnAutoFill(submissionId);

  // -- Name/DOB auto-fill: section 1/2 → section 30 signature fields ------
  useNameAutoFill(submissionId);

  // -- Warn before tab close if there are unsaved changes ------------------
  const dirtyFields = useAtomValue(dirtyFieldsAtom);
  const saveNow = useAppStore((s) => s.saveNow);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirtyFields.size > 0) {
        // Trigger a flush so data is persisted even if the user leaves
        void saveNow();
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirtyFields, saveNow]);

  const toggleSidebar = useCallback(() => setSidebarOpen((o) => !o), []);
  const togglePreview = useCallback(() => setPreviewOpen((o) => !o), []);

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Top navigation bar */}
      <TopBar
        submissionId={submissionId}
        onToggleSidebar={toggleSidebar}
        onTogglePreview={togglePreview}
        previewOpen={previewOpen}
      />

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <aside
          className={`
            ${sidebarOpen ? 'w-72' : 'w-0'}
            shrink-0 overflow-y-auto border-r border-gray-200 bg-white
            transition-all duration-200 hidden md:block
          `}
        >
          {sidebarOpen && <SectionSidebar submissionId={submissionId} />}
        </aside>

        {/* Sidebar collapse toggle (desktop) */}
        <button
          type="button"
          onClick={toggleSidebar}
          className="
            hidden md:flex w-6 shrink-0 items-center justify-center
            border-r border-gray-200 bg-gray-50 text-gray-400
            hover:bg-gray-100 hover:text-gray-600
          "
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarOpen ? '\u2039' : '\u203A'}
        </button>

        {/* Mobile sidebar overlay — z-[55] to sit above TopBar (z-50) */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 z-[55]"
            role="dialog"
            aria-modal="true"
            aria-label="Section navigation"
          >
            <div
              className="absolute inset-0 bg-black/30"
              onClick={toggleSidebar}
              onKeyDown={(e) => { if (e.key === 'Escape') toggleSidebar(); }}
              aria-hidden="true"
            />
            <aside className="relative w-72 h-full bg-white overflow-y-auto shadow-xl">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <span className="text-sm font-semibold text-gray-700">Sections</span>
                <button
                  type="button"
                  onClick={toggleSidebar}
                  className="rounded-md p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Close navigation"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <SectionSidebar submissionId={submissionId} />
            </aside>
          </div>
        )}

        {/* Center content */}
        <main id="main-content" className="flex-1 overflow-y-auto" role="main">
          <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8 pb-24">
            {children}
          </div>

          {/* Wizard controls pinned at bottom */}
          <WizardControls submissionId={submissionId} />
        </main>

        {/* Right PDF preview pane */}
        {previewOpen && (
          <aside
            className="
              w-[400px] shrink-0 border-l border-gray-200 bg-white overflow-y-auto
              hidden lg:block
            "
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-700">PDF Preview</h2>
                <button
                  type="button"
                  onClick={togglePreview}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  aria-label="Close PDF preview"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <PdfPreview
                pageNumber={currentPage}
                activeFieldRect={activeRect}
                onPageChange={setCurrentPage}
              />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
