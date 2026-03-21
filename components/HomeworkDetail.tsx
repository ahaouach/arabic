"use client";

import { useState } from "react";
import type { Homework, SubmissionInput } from "@/lib/useHomework";
import FileUploader from "./FileUploader";

// ---- Helpers ---------------------------------------------------------------

const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1_048_576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1_048_576).toFixed(1)} MB`;
}

function isOverdue(hw: Homework): boolean {
  return hw.status === "pending" && new Date(hw.dueDate) < new Date();
}

// ---- PDF Viewer ------------------------------------------------------------

function PDFViewer({ url, title }: { url: string; title: string }) {
  const isMock = !url.startsWith("http") && !url.startsWith("blob:");

  if (isMock) {
    return (
      <div className="w-full h-64 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2">
        <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
        <p className="text-sm font-medium text-gray-400">PDF preview</p>
        <p className="text-xs text-gray-300 text-center px-4">
          In production, the teacher&apos;s file will display here.
        </p>
      </div>
    );
  }

  return (
    <iframe
      src={url}
      title={title}
      className="w-full h-96 rounded-xl border border-gray-200"
    />
  );
}

// ---- Submission result panel ------------------------------------------------

function SubmissionResult({
  homework,
  onResubmit,
}: {
  homework: Homework;
  onResubmit: () => void;
}) {
  const sub = homework.submission!;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
          homework.status === "reviewed" ? "bg-green-100" : "bg-blue-100"
        }`}>
          <svg className={`w-4 h-4 ${homework.status === "reviewed" ? "text-green-600" : "text-blue-600"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <div>
          <p className={`text-sm font-semibold ${homework.status === "reviewed" ? "text-green-700" : "text-blue-700"}`}>
            {homework.status === "reviewed" ? "Reviewed by teacher" : "Homework submitted"}
          </p>
          <p className="text-xs text-gray-400">Submitted on {formatDate(sub.submittedAt)}</p>
        </div>
      </div>

      {/* Submitted file */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 flex items-center gap-3">
        <svg className="w-8 h-8 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{sub.fileName}</p>
          <p className="text-xs text-gray-400">{formatBytes(sub.fileSize)}</p>
        </div>
      </div>

      {/* Parent comment */}
      {sub.comment && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-amber-700 mb-1">Your note to teacher</p>
          <p className="text-sm text-amber-900 italic">&ldquo;{sub.comment}&rdquo;</p>
        </div>
      )}

      {/* Re-submit option (only if not yet reviewed) */}
      {homework.status === "submitted" && (
        <button
          type="button"
          onClick={onResubmit}
          className="w-full py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Re-submit a different file
        </button>
      )}
    </div>
  );
}

// ---- Main component --------------------------------------------------------

interface HomeworkDetailProps {
  homework: Homework;
  onBack?: () => void; // provided on mobile
  onSubmit: (input: SubmissionInput) => Promise<void>;
  onResubmit: () => void;
}

export default function HomeworkDetail({
  homework,
  onBack,
  onSubmit,
  onResubmit,
}: HomeworkDetailProps) {
  const [file, setFile] = useState<File | null>(null);
  const [comment, setComment] = useState("");
  const [fileError, setFileError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const canSubmit = homework.status === "pending";
  const overdue = isOverdue(homework);

  function handleFileChange(f: File | null) {
    setFile(f);
    if (!f) return;
    if (!ACCEPTED_TYPES.includes(f.type)) {
      setFileError("Only PDF, JPG, or PNG files are accepted.");
      setFile(null);
      return;
    }
    if (f.size > MAX_SIZE_BYTES) {
      setFileError("File is too large. Maximum size is 5 MB.");
      setFile(null);
      return;
    }
    setFileError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setFileError("Please select a file to upload.");
      return;
    }

    setUploading(true);
    setProgress(0);

    // Simulate upload progress
    const steps = [10, 25, 45, 65, 80, 92, 100];
    for (const pct of steps) {
      await new Promise((r) => setTimeout(r, 200));
      setProgress(pct);
    }

    await onSubmit({ file, comment });

    setUploading(false);
    setProgress(0);
    setFile(null);
    setComment("");
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 max-w-2xl mx-auto space-y-6">

        {/* Back button (mobile only) */}
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 -ml-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back to list
          </button>
        )}

        {/* Header */}
        <div>
          <span className="text-xs font-semibold text-primary-600 uppercase tracking-wide">
            {homework.course}
          </span>
          <h1 className="text-xl font-bold text-gray-900 mt-1 leading-snug">
            {homework.title}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className={`text-sm ${overdue ? "text-red-500 font-medium" : "text-gray-500"}`}>
              Due {formatDate(homework.dueDate)}
              {overdue && " — Overdue"}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Instructions</p>
          <p className="text-sm text-gray-700 leading-relaxed">{homework.description}</p>
        </div>

        {/* Teacher file */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3">Teacher&apos;s file</p>
          <PDFViewer url={homework.pdfUrl} title={homework.title} />

          <a
            href={homework.pdfUrl}
            download
            className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download Homework
          </a>
        </div>

        {/* Divider */}
        <hr className="border-gray-100" />

        {/* Submission section */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-4">Your Submission</p>

          {homework.status !== "pending" ? (
            <SubmissionResult homework={homework} onResubmit={onResubmit} />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* File uploader */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload completed work
                  <span className="text-red-400 ml-0.5">*</span>
                </label>
                <FileUploader
                  file={file}
                  error={fileError}
                  disabled={uploading}
                  onChange={handleFileChange}
                />
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Note to teacher
                  <span className="text-gray-400 font-normal ml-1 text-xs">(optional)</span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  placeholder="e.g. Ahmed found the second exercise difficult..."
                  disabled={uploading}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary-400 disabled:opacity-60"
                />
              </div>

              {/* Progress bar */}
              {uploading && (
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                    <span>Uploading…</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full transition-all duration-200"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={uploading}
                className="w-full py-3 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Uploading…
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Submit Homework
                  </>
                )}
              </button>

              {overdue && (
                <p className="text-xs text-center text-red-500">
                  This homework is overdue — please submit as soon as possible.
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
