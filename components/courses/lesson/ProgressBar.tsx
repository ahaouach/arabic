interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
}

export default function ProgressBar({ value, max, label }: ProgressBarProps) {
  const pct = max === 0 ? 0 : Math.round((Math.min(value, max) / max) * 100);
  return (
    <div>
      {label && (
        <div className="mb-1 flex justify-between text-xs font-medium text-gray-500">
          <span>{label}</span>
          <span>{pct}%</span>
        </div>
      )}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
