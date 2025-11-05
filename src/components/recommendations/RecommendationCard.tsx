import { ExternalLink, Star } from "lucide-react";
import { Recommendation } from "@/types/recommendation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface RecommendationCardProps {
  recommendation: Recommendation;
  onCtaClick: () => void;
  hideName?: boolean;
}

export function RecommendationCard({ recommendation, onCtaClick, hideName = false }: RecommendationCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in">
      {recommendation.image_url && (
        <div className="aspect-square w-full overflow-hidden bg-secondary/30">
          <img
            src={recommendation.image_url}
            alt={recommendation.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className={`font-bold text-lg line-clamp-2 ${hideName ? 'blur-sm select-none' : ''}`}>
            {recommendation.name}
          </h3>
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

        <p className="text-sm text-muted-foreground line-clamp-3">
          {recommendation.description}
        </p>

        {recommendation.tags && recommendation.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {recommendation.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-accent">
          <Star className="w-4 h-4 fill-accent" />
          <span className="font-semibold">Recomendado pela JoIA</span>
        </div>

        <Button
          onClick={onCtaClick}
          className="w-full gap-2"
          size="lg"
        >
          {recommendation.cta_text}
          <ExternalLink className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}
