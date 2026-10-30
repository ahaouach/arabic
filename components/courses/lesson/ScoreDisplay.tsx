interface ScoreDisplayProps {
  score: number;
  total: number;
}

export default function ScoreDisplay({ score, total }: ScoreDisplayProps) {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-1.5 text-sm font-semibold text-amber-700 shadow-sm"
      aria-live="polite"
    >
      <span aria-hidden="true" className="text-lg">⭐</span>
      <span>
        {score}
        <span className="text-amber-400"> / {total}</span>
      </span>
    </div>
  );
}
