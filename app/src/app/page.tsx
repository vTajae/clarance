"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveMetadata } from "@/lib/persistence/indexeddb-client";

export default function Home() {
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <main className="flex max-w-2xl flex-col items-center gap-8 px-8 py-16 text-center">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-xl font-bold text-white">
            86
          </div>
          <h1 className="text-3xl font-bold text-gray-900">SF-86</h1>
        </div>

        <p className="text-lg text-gray-600">
          Questionnaire for National Security Positions
        </p>

        <p className="text-sm text-gray-500">
          Complete your SF-86 form through a guided web interface. Import an
          existing PDF or start from scratch. Your data is encrypted and
          auto-saved locally.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <button
            onClick={handleCreateForm}
            disabled={creating}
            className="rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {creating ? "Creating..." : "Start New Form"}
          </button>
          <Link
            href="/import"
            className="rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Import from PDF
          </Link>
        </div>

        <p className="mt-8 text-xs text-gray-400">
          All data is encrypted at rest. Auto-saved to your browser. No data
          leaves your device until you choose to sync or export.
        </p>
      </main>
    </div>
  );
}
