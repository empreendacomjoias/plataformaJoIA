import { ExternalLink, Star } from "lucide-react";
import { Recommendation } from "@/types/recommendation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface RecommendationCardProps {
  recommendation: Recommendation;
  onCtaClick: () => void;
}

export function RecommendationCard({ recommendation, onCtaClick }: RecommendationCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in h-full flex flex-col">
      {recommendation.image_url && (
        <div className="aspect-square w-full overflow-hidden bg-secondary/30">
          <img
            src={recommendation.image_url}
            alt={recommendation.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-4 sm:p-5 md:p-6 space-y-3 md:space-y-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-base sm:text-lg line-clamp-2">{recommendation.name}</h3>
          <Badge
            variant="outline"
            style={{
              backgroundColor: `${recommendation.category?.color}20`,
              borderColor: `${recommendation.category?.color}50`,
              color: recommendation.category?.color,
            }}
            className="shrink-0"
          >
            {recommendation.category?.name}
          </Badge>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 flex-1">
          {recommendation.description}
        </p>

        {recommendation.tags && recommendation.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 sm:gap-1.5">
            {recommendation.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-accent">
          <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-accent" />
          <span className="font-semibold">Recomendado pela JoIA</span>
        </div>

        <Button
          onClick={onCtaClick}
          className="w-full gap-2 mt-auto text-sm sm:text-base"
          size="lg"
        >
          {recommendation.cta_text}
          <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
        </Button>
      </div>
    </Card>
  );
}
