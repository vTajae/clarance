'use client';

import { type ReactNode, useCallback, useState } from 'react';
import { SectionSidebar } from './section-sidebar';
import { TopBar } from './top-bar';
import { WizardControls } from './wizard-controls';

interface FormShellProps {
  submissionId: string;
  children: ReactNode;
}

export function FormShell({ submissionId, children }: FormShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);

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

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40">
            <div
              className="absolute inset-0 bg-black/30"
              onClick={toggleSidebar}
              aria-hidden="true"
            />
            <aside className="relative w-72 h-full bg-white overflow-y-auto shadow-xl">
              <SectionSidebar submissionId={submissionId} />
            </aside>
          </div>
        )}

        {/* Center content */}
        <main className="flex-1 overflow-y-auto">
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

              {/* Placeholder for pdf.js canvas */}
              <div className="rounded-md border border-gray-200 bg-gray-100 aspect-[8.5/11] flex items-center justify-center">
                <p className="text-sm text-gray-400">PDF preview will render here</p>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
