import { Trophy, Medal } from "lucide-react";
import { Supplier } from "@/types/supplier";
import { Card } from "@/components/ui/card";

interface TopRankingProps {
  suppliers: Supplier[];
}

export function TopRanking({ suppliers }: TopRankingProps) {
  const topSuppliers = [...suppliers]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  const medals = ["🏆", "🥈", "🥉", "4️⃣", "5️⃣"];

  return (
    <Card className="bg-gradient-to-br from-card to-secondary/30 border-primary/30 shadow-lg shadow-primary/10 animate-fade-in">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="w-6 h-6 text-accent animate-glow" />
          <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            TOP 5 Fornecedores
          </h2>
        </div>
        
        <div className="space-y-3">
          {topSuppliers.map((supplier, index) => (
            <div
              key={supplier.id}
              className="flex items-center gap-4 p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
            >
              <span className="text-2xl">{medals[index]}</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{supplier.name}</div>
                <div className="text-sm text-muted-foreground">
                  @{supplier.instagram.replace("@", "")}
                </div>
              </div>
              <div className="flex items-center gap-2 bg-accent/10 px-3 py-1.5 rounded-full">
                <span className="text-accent">⭐</span>
                <span className="font-bold text-accent">{supplier.rating.toFixed(1)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
