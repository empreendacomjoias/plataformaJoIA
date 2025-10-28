import { mockSuppliers } from "@/data/mockSuppliers";
import { Trophy, TrendingUp, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Ranking() {
  const rankedSuppliers = [...mockSuppliers].sort((a, b) => b.rating - a.rating);

  const medals = ["🏆", "🥈", "🥉"];

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="w-8 h-8 text-accent drop-shadow-[0_0_10px_rgba(167,139,250,0.6)]" />
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Ranking Completo
          </h1>
          <p className="text-muted-foreground">
            Todos os fornecedores ordenados por avaliação
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {rankedSuppliers.map((supplier, index) => (
          <Card
            key={supplier.id}
            className="p-6 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 animate-fade-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="flex items-center gap-6">
              {/* Position */}
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent text-2xl font-bold shrink-0">
                {index < 3 ? medals[index] : `#${index + 1}`}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold mb-1">{supplier.name}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{supplier.type}</span>
                  <span>•</span>
                  <span>{supplier.region}</span>
                  <span>•</span>
                  <span>{supplier.instagram}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {supplier.categories.map((category) => (
                    <Badge key={category} variant="outline" className="text-xs">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div className="text-right shrink-0">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-6 h-6 fill-accent text-accent" />
                  <span className="text-3xl font-bold text-accent">
                    {supplier.rating.toFixed(1)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {supplier.ratingCount} avaliações
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
