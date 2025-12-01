import { useState } from "react";
import { Supplier } from "@/types/supplier";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface TopRankingProps {
  suppliers: Supplier[];
}

export function TopRanking({ suppliers }: TopRankingProps) {
  const { isAdmin } = useAuth();
  const [hideAll, setHideAll] = useState(false);
  const topSuppliers = [...suppliers]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  const medals = ["🏆", "🥈", "🥉", "4️⃣", "5️⃣"];

  return (
    <Card className="bg-gradient-to-br from-card to-secondary/30 border-primary/30 shadow-lg shadow-primary/10 animate-fade-in">
      <div className="p-4 sm:p-5 md:p-6">
        <div className="flex items-center justify-between gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xl sm:text-2xl">🏆</span>
            <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              TOP 5 Fornecedores
            </h2>
          </div>
          {isAdmin && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setHideAll(!hideAll)}
              className="gap-2"
            >
              {hideAll ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span className="hidden sm:inline">{hideAll ? "Mostrar" : "Ocultar"}</span>
            </Button>
          )}
        </div>
        
        <div className="space-y-2 sm:space-y-3">
          {topSuppliers.map((supplier, index) => (
            <div
              key={supplier.id}
              className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
            >
              <span className="text-xl sm:text-2xl">{medals[index]}</span>
              <div className="flex-1 min-w-0">
                <div className={`font-semibold truncate text-sm sm:text-base ${hideAll ? "blur-sm select-none" : ""}`}>
                  {supplier.name}
                </div>
                <div className={`text-xs sm:text-sm text-muted-foreground truncate ${hideAll ? "blur-sm select-none" : ""}`}>
                  @{supplier.instagram.replace("@", "")}
                </div>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 bg-accent/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                <span className="text-accent text-sm sm:text-base">⭐</span>
                <span className="font-bold text-accent text-sm sm:text-base">{supplier.rating.toFixed(1)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
