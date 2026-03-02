"use client";

import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { useCallback } from "react";

export default function NewFormPage() {
  const router = useRouter();

  const handleCreateForm = useCallback(() => {
    const submissionId = uuidv4();
    router.push(`/${submissionId}/identification/section1`);
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">New SF-86 Form</h1>
        <p className="mt-2 text-sm text-gray-500">
          Start a new SF-86 questionnaire. Your progress will be auto-saved to
          your browser.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="pdfVersion"
              className="block text-sm font-medium text-gray-700"
            >
              PDF Version
            </label>
            <select
              id="pdfVersion"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue="sf861"
            >
              <option value="sf861">SF-86 (Standard)</option>
              <option value="sf862">SF-86 (Revised)</option>
            </select>
          </div>

          <button
            onClick={handleCreateForm}
            className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Create Form
          </button>
        </div>
      </div>
    </div>
  );
}
