"use client";

import { useRef } from "react";

const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const ACCEPTED_EXTENSIONS = ".pdf,.jpg,.jpeg,.png";
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1_048_576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1_048_576).toFixed(1)} MB`;
}

function fileIcon(type: string) {
  const isPdf = type === "application/pdf";
  return isPdf ? (
    <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ) : (
    <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  );
}

interface FileUploaderProps {
  file: File | null;
  error?: string;
  disabled?: boolean;
  onChange: (file: File | null) => void;
}

export default function FileUploader({ file, error, disabled, onChange }: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null;
    if (!selected) return;

    if (!ACCEPTED_TYPES.includes(selected.type)) {
      onChange(null);
      // Reset input so the same file can be re-selected after error
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    if (selected.size > MAX_SIZE_BYTES) {
      onChange(null);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    onChange(selected);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    if (disabled) return;
    const dropped = e.dataTransfer.files[0];
    if (dropped) {
      // Trigger same validation as handleChange
      const fakeEvent = { target: { files: [dropped] } } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleChange(fakeEvent);
    }
  }

  return (
    <div>
      {file ? (
        /* ---- Selected file preview ---- */
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
          {fileIcon(file.type)}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{formatBytes(file.size)}</p>
          </div>
          {!disabled && (
            <button
              type="button"
              onClick={() => {
                onChange(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
              aria-label="Remove file"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      ) : (
        /* ---- Drop zone ---- */
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
            error
              ? "border-red-300 bg-red-50"
              : "border-gray-200 bg-gray-50 hover:border-primary-300 hover:bg-primary-50/30"
          } ${disabled ? "opacity-50 pointer-events-none" : "cursor-pointer"}`}
          onClick={() => !disabled && inputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Upload file"
          onKeyDown={(e) => e.key === "Enter" && !disabled && inputRef.current?.click()}
        >
          <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <p className="text-sm font-medium text-gray-700 mb-1">
            Click to upload or drag &amp; drop
          </p>
          <p className="text-xs text-gray-400">PDF, JPG or PNG — max 5 MB</p>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_EXTENSIONS}
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
        aria-hidden="true"
      />

      {error && (
        <p role="alert" className="mt-1.5 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
