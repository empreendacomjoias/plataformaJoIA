import { Supplier } from "@/types/supplier";
import { Card } from "@/components/ui/card";

interface TopRankingProps {
  suppliers: Supplier[];
  hideAll?: boolean;
}

export function TopRanking({ suppliers, hideAll = false }: TopRankingProps) {
  const topSuppliers = [...suppliers]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  const medals = ["🏆", "🥈", "🥉"];

  return (
    <Card className="bg-gradient-to-br from-card to-secondary/30 border-primary/30 shadow-lg shadow-primary/10 animate-fade-in">
      <div className="p-4 sm:p-5 md:p-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <span className="text-xl sm:text-2xl">🏆</span>
          <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            TOP 3 Fornecedores
          </h2>
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
