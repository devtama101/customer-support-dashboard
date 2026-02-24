interface SentimentIndicatorProps {
  score: number | null;
}

export function SentimentIndicator({ score }: SentimentIndicatorProps) {
  const color =
    score && score > 0
      ? 'bg-green-500'
      : score && score < 0
        ? 'bg-red-500'
        : 'bg-yellow-500';

  const label = score && score > 0 ? 'Positive' : score && score < 0 ? 'Negative' : 'Neutral';

  return (
    <span
      className={`w-2 h-2 rounded-full inline-block ${color}`}
      title={`${label} sentiment (${score ?? 'N/A'})`}
    />
  );
}
