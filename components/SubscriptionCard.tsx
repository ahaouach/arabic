import type { Plan, PlanId } from "@/lib/useSubscription";

interface SubscriptionCardProps {
  plan: Plan;
  isCurrent: boolean;
  isSelected: boolean;
  onSelect: (id: PlanId) => void;
}

export default function SubscriptionCard({
  plan,
  isCurrent,
  isSelected,
  onSelect,
}: SubscriptionCardProps) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border-2 p-6 transition-all ${
        isSelected
          ? "border-primary-500 bg-primary-50 shadow-md"
          : isCurrent
          ? "border-primary-200 bg-white shadow-sm"
          : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"
      }`}
    >
      {/* Popular badge */}
      {plan.popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-sm">
          Most popular
        </span>
      )}

      {/* Plan name + price */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-gray-900">{plan.name}</h3>
          {isCurrent && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700">
              Current
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-extrabold text-gray-900">
            {plan.currency}{plan.price.toFixed(2)}
          </span>
          <span className="text-sm text-gray-400">/ {plan.period}</span>
        </div>
      </div>

      {/* Features */}
      <ul className="space-y-2 flex-1 mb-6" role="list">
        {plan.features.map((feat) => (
          <li key={feat} className="flex items-start gap-2.5 text-sm text-gray-600">
            <svg
              className="w-4 h-4 text-primary-500 mt-0.5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            {feat}
          </li>
        ))}
      </ul>

      {/* Action button */}
      <button
        type="button"
        onClick={() => onSelect(plan.id)}
        disabled={isCurrent}
        className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all ${
          isSelected
            ? "bg-primary-600 text-white shadow-sm"
            : isCurrent
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white border-2 border-primary-300 text-primary-700 hover:bg-primary-600 hover:text-white hover:border-primary-600"
        }`}
      >
        {isCurrent ? "Current plan" : isSelected ? "Selected ✓" : "Select plan"}
      </button>
    </div>
  );
}
