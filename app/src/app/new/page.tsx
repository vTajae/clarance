"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveMetadata } from "@/lib/persistence/indexeddb-client";

export default function NewFormPage() {
  const router = useRouter();
  const [creating, setCreating] = useState(false);

  async function handleCreateForm() {
    setCreating(true);

    try {
      const submissionId = crypto.randomUUID();
      await saveMetadata(submissionId, { pdfVersion: "sf861" });
      router.push(`/${submissionId}/identification/section1`);
    } catch (err) {
      console.error("Failed to create form:", err);
      setCreating(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">New SF-86 Form</h1>
        <p className="mt-2 text-sm text-gray-500">
          Start a new SF-86 questionnaire. Your progress will be auto-saved to
          your browser.
        </p>

        <div className="mt-6">
          <button
            onClick={handleCreateForm}
            disabled={creating}
            className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {creating ? "Creating..." : "Create Form"}
          </button>
        </div>
      </div>
    </div>
  );
}
