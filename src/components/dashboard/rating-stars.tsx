import { Star } from "lucide-react";

export function RatingStars({ average, count }: { average: number; count: number }) {
  if (count === 0) {
    return <span className="text-xs text-slate">No reviews yet</span>;
  }

  return (
    <span className="inline-flex items-center gap-1 text-xs text-slate">
      <Star className="h-3.5 w-3.5 fill-passport-sky text-passport-sky" />
      {average.toFixed(1)} ({count})
    </span>
  );
}
