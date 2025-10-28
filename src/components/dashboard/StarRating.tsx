import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface StarRatingProps {
  rating: number;
  ratingCount: number;
  onRate?: (rating: number) => void;
  readOnly?: boolean;
}

export function StarRating({ rating, ratingCount, onRate, readOnly = false }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const displayRating = hoverRating || rating;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => !readOnly && onRate?.(star)}
            onMouseEnter={() => !readOnly && setHoverRating(star)}
            onMouseLeave={() => !readOnly && setHoverRating(0)}
            className={cn(
              "transition-all duration-200",
              !readOnly && "hover:scale-125 cursor-pointer"
            )}
            disabled={readOnly}
          >
            <Star
              className={cn(
                "w-5 h-5 transition-colors",
                star <= displayRating
                  ? "fill-accent text-accent drop-shadow-[0_0_6px_rgba(167,139,250,0.6)]"
                  : "text-muted-foreground/30"
              )}
            />
          </button>
        ))}
      </div>
      <span className="text-sm text-muted-foreground">
        {rating.toFixed(1)} ({ratingCount})
      </span>
    </div>
  );
}
