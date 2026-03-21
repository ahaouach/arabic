import type { Invoice } from "@/lib/useSubscription";

// ─── DownloadButton ──────────────────────────────────────────────────────────

function DownloadButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary-700 bg-primary-50 border border-primary-200 rounded-lg hover:bg-primary-100 transition-colors shrink-0"
    >
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
      Download
    </button>
  );
}

// ─── InvoiceItem ─────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<Invoice["status"], string> = {
  paid:    "bg-green-50 text-green-700",
  pending: "bg-amber-50 text-amber-700",
  failed:  "bg-red-50 text-red-600",
};

function formatInvoiceDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
}

interface InvoiceItemProps {
  invoice: Invoice;
  onDownload: (invoice: Invoice) => void;
}

function InvoiceItem({ invoice, onDownload }: InvoiceItemProps) {
  return (
    <li className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
      {/* Document icon */}
      <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-semibold text-gray-900">{invoice.plan} Plan</p>
          <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full capitalize ${STATUS_STYLE[invoice.status]}`}>
            {invoice.status}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-xs text-gray-400">{formatInvoiceDate(invoice.date)}</p>
          <span className="text-xs text-gray-200">·</span>
          <p className="text-xs text-gray-500 font-mono">{invoice.id}</p>
        </div>
      </div>

      {/* Amount + download */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-sm font-bold text-gray-900">
          {invoice.currency}{invoice.amount.toFixed(2)}
        </span>
        <DownloadButton onClick={() => onDownload(invoice)} />
      </div>
    </li>
  );
}

// ─── InvoiceList ─────────────────────────────────────────────────────────────

interface InvoiceListProps {
  invoices: Invoice[];
  onDownload: (invoice: Invoice) => void;
}

export default function InvoiceList({ invoices, onDownload }: InvoiceListProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-base font-bold text-gray-900">Invoice History</h2>
        <span className="text-xs text-gray-400">{invoices.length} invoice{invoices.length !== 1 ? "s" : ""}</span>
      </div>

      {invoices.length === 0 ? (
        <div className="py-12 text-center">
          <svg className="w-10 h-10 text-gray-200 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <p className="text-sm text-gray-400">No invoices yet.</p>
        </div>
      ) : (
        <ul role="list" className="divide-y divide-gray-50">
          {invoices.map((inv) => (
            <InvoiceItem key={inv.id} invoice={inv} onDownload={onDownload} />
          ))}
        </ul>
      )}
    </div>
  );
}
