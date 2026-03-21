"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";

interface DashboardShellProps {
  children: React.ReactNode;
  userName: string;
  userEmail: string;
}

export default function DashboardShell({ children, userName, userEmail }: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        userName={userName}
        userEmail={userEmail}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 h-16 px-4 bg-white border-b border-gray-100 shrink-0">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Open menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-semibold text-gray-900 text-sm">AQ Academy</span>
        </div>

        {/* Scrollable content */}
        <main id="main-content" className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
