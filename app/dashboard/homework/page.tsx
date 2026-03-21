"use client";

import { useState } from "react";
import { useHomework } from "@/lib/useHomework";
import HomeworkCard from "@/components/HomeworkCard";
import HomeworkDetail from "@/components/HomeworkDetail";
import type { Homework } from "@/lib/useHomework";

export default function HomeworkPage() {
  const { homeworks, submitHomework, resubmitHomework } = useHomework();
  const [selected, setSelected] = useState<Homework | null>(homeworks[0] ?? null);
  const [mobileView, setMobileView] = useState<"list" | "detail">("list");

  function selectHomework(hw: Homework) {
    // Keep selected in sync with the latest state from the hook
    setSelected(hw);
    setMobileView("detail");
  }

  // Sync selected with latest hook state (e.g. after submission)
  const liveSelected = selected
    ? (homeworks.find((h) => h.id === selected.id) ?? null)
    : null;

  const pendingCount = homeworks.filter((h) => h.status === "pending").length;

  return (
    <div className="h-full flex flex-col">
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="px-6 py-5 border-b border-gray-100 bg-white shrink-0">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Homework</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {pendingCount > 0
                ? `${pendingCount} assignment${pendingCount > 1 ? "s" : ""} to submit`
                : "All assignments submitted — great work!"}
            </p>
          </div>
        </div>
      </div>

      {/* ── Main content: split-panel ────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden flex">

        {/* ── Left: homework list ──────────────────────────────────────── */}
        <div
          className={`
            w-full lg:w-80 xl:w-96 shrink-0 border-r border-gray-100 overflow-y-auto bg-gray-50
            ${mobileView === "detail" ? "hidden lg:block" : "block"}
          `}
        >
          <div className="p-4 space-y-2">
            {homeworks.map((hw) => (
              <HomeworkCard
                key={hw.id}
                homework={hw}
                selected={liveSelected?.id === hw.id}
                onClick={() => selectHomework(hw)}
              />
            ))}
          </div>
        </div>

        {/* ── Right: detail panel ──────────────────────────────────────── */}
        <div
          className={`
            flex-1 bg-white overflow-hidden
            ${mobileView === "list" ? "hidden lg:block" : "block"}
          `}
        >
          {liveSelected ? (
            <HomeworkDetail
              key={liveSelected.id}
              homework={liveSelected}
              onBack={() => setMobileView("list")}
              onSubmit={(input) => submitHomework(liveSelected.id, input)}
              onResubmit={() => resubmitHomework(liveSelected.id)}
            />
          ) : (
            /* Empty state when nothing is selected */
            <div className="h-full flex flex-col items-center justify-center text-center p-10">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">Select an assignment</p>
              <p className="text-gray-400 text-sm mt-1">
                Choose a homework from the list to view details.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
