import { Heart, Factory, ShoppingBag, ExternalLink, MoreVertical } from "lucide-react";
import { Supplier, SupplierCategory } from "@/types/supplier";
import { StarRating } from "./StarRating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SupplierRowProps {
  supplier: Supplier;
  onToggleFavorite: (id: string) => void;
  onRate: (id: string, rating: number) => void;
}

const categoryColors: Record<SupplierCategory, string> = {
  "Personalizado": "bg-purple-500/20 text-purple-300 border-purple-500/30",
  "Masculino": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "Pedras Naturais": "bg-green-500/20 text-green-300 border-green-500/30",
  "Pandora": "bg-pink-500/20 text-pink-300 border-pink-500/30",
  "Tiffany": "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  "Vivara": "bg-amber-500/20 text-amber-300 border-amber-500/30",
};

export function SupplierRow({ supplier, onToggleFavorite, onRate }: SupplierRowProps) {
  return (
    <tr className="border-b border-border/50 hover:bg-secondary/30 transition-colors group">
      {/* Favorite */}
      <td className="p-4">
        <button
          onClick={() => onToggleFavorite(supplier.id)}
          className="transition-transform hover:scale-125"
        >
          <Heart
            className={cn(
              "w-5 h-5 transition-all",
              supplier.isFavorite
                ? "fill-red-500 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]"
                : "text-muted-foreground hover:text-red-500"
            )}
          />
        </button>
      </td>

      {/* Name */}
      <td className="p-4">
        <div className="font-semibold">{supplier.name}</div>
      </td>

      {/* Type */}
      <td className="p-4">
        <div className="flex items-center gap-2">
          {supplier.type === "Fabricante" ? (
            <Factory className="w-4 h-4 text-accent" />
          ) : (
            <ShoppingBag className="w-4 h-4 text-accent" />
          )}
          <span className="text-sm">{supplier.type}</span>
        </div>
      </td>

      {/* Categories */}
      <td className="p-4">
        <div className="flex flex-wrap gap-1.5">
          {supplier.categories.map((category) => (
            <Badge
              key={category}
              variant="outline"
              className={cn("text-xs border", categoryColors[category])}
            >
              {category}
            </Badge>
          ))}
        </div>
      </td>

      {/* Region */}
      <td className="p-4">
        <Badge variant="secondary" className="font-mono">
          {supplier.region}
        </Badge>
      </td>

      {/* Min Order */}
      <td className="p-4">
        <span className="text-sm font-medium">
          R$ {supplier.minOrder.toLocaleString("pt-BR")}
        </span>
      </td>

      {/* Instagram */}
      <td className="p-4">
        <a
          href={`https://instagram.com/${supplier.instagram.replace("@", "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
        >
          <span className="text-sm">{supplier.instagram}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </td>

      {/* Rating */}
      <td className="p-4">
        <StarRating
          rating={supplier.rating}
          ratingCount={supplier.ratingCount}
          onRate={(rating) => onRate(supplier.id, rating)}
        />
      </td>

      {/* Actions */}
      <td className="p-4">
        <Button
          variant="ghost"
          size="icon"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreVertical className="w-4 h-4" />
        </Button>
      </td>
    </tr>
  );
}
