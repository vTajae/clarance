"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

export default function ImportPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0];
      if (selected && selected.type === "application/pdf") {
        setFile(selected);
        setError(null);
      } else {
        setError("Please select a PDF file.");
      }
    },
    []
  );

  const handleImport = useCallback(async () => {
    if (!file) return;

    setStatus("uploading");
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/pdf/import", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Import failed");
      }

      const data = await response.json();
      setStatus("success");

      // Create submission and redirect
      const submissionId = uuidv4();

      // TODO: Save extracted fields to IndexedDB under this submissionId
      // For now, store in sessionStorage as a bridge
      sessionStorage.setItem(
        `import:${submissionId}`,
        JSON.stringify(data.fields)
      );

      router.push(`/${submissionId}/identification/personalInfo`);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Import failed");
    }
  }, [file, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">Import from PDF</h1>
        <p className="mt-2 text-sm text-gray-500">
          Upload an existing SF-86 PDF to extract its values into the web form.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="pdfFile"
              className="block text-sm font-medium text-gray-700"
            >
              SF-86 PDF File
            </label>
            <input
              id="pdfFile"
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            onClick={handleImport}
            disabled={!file || status === "uploading"}
            className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {status === "uploading" ? "Importing..." : "Import PDF"}
          </button>

          {status === "success" && (
            <p className="text-sm text-green-600">
              PDF imported successfully. Redirecting...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
