import { useState } from "react";
import { Trophy, Star, Eye, EyeOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSuppliers } from "@/hooks/useSuppliers";
import { useAuth } from "@/contexts/AuthContext";

export default function Ranking() {
  const { suppliers, isLoading } = useSuppliers();
  const { isAdmin } = useAuth();
  const [hideAll, setHideAll] = useState(false);

  const rankedSuppliers = [...suppliers].sort((a, b) => b.rating - a.rating);
  const medals = ["🏆", "🥈", "🥉"];

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 md:mb-6">
        <div className="flex items-center gap-3">
          <Trophy className="w-7 h-7 sm:w-8 sm:h-8 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Ranking Completo
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Todos os fornecedores ordenados por avaliação
            </p>
          </div>
        </div>
        {isAdmin && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setHideAll(!hideAll)}
            className="gap-2"
          >
            {hideAll ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {hideAll ? "Mostrar Todos" : "Ocultar Todos"}
          </Button>
        )}
      </div>

      <div className="grid gap-3 md:gap-4">
        {rankedSuppliers.map((supplier, index) => (
          <Card
            key={supplier.id}
            className="p-4 sm:p-5 md:p-6 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 animate-fade-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              {/* Position */}
              <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-primary to-accent text-xl sm:text-2xl font-bold shrink-0">
                {index < 3 ? medals[index] : `#${index + 1}`}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className={`text-lg sm:text-xl font-bold mb-1 ${hideAll ? "blur-sm select-none" : ""}`}>
                  {supplier.name}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <span>{supplier.type}</span>
                  <span>•</span>
                  <span>{supplier.region}</span>
                  <span>•</span>
                  <span className={`truncate ${hideAll ? "blur-sm select-none" : ""}`}>{supplier.instagram}</span>
                </div>
                <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-2">
                  {supplier.categories.map((category) => (
                    <Badge key={category} variant="outline" className="text-xs">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div className="flex sm:flex-col items-center sm:text-right gap-2 sm:gap-0 shrink-0 self-start sm:self-auto">
                <div className="flex items-center gap-2 mb-0 sm:mb-1">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-accent text-accent" />
                  <span className="text-2xl sm:text-3xl font-bold text-accent">
                    {supplier.rating.toFixed(1)}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
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
