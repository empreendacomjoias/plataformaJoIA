import { ExternalLink, Factory, ShoppingBag, Copy, MapPin, DollarSign } from "lucide-react";
import { Supplier } from "@/types/supplier";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StarRating } from "./StarRating";
import { toast } from "sonner";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

interface SupplierDetailsDrawerProps {
  supplier: Supplier | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRate: (rating: number) => void;
  hideInfo?: boolean;
}

const defaultCategoryColors: Record<string, string> = {
  "Personalizado": "bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/50 dark:border-purple-500/30",
  "Masculino": "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/50 dark:border-blue-500/30",
  "Pedras Naturais": "bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/50 dark:border-green-500/30",
  "Pandora": "bg-pink-500/20 text-pink-700 dark:text-pink-300 border-pink-500/50 dark:border-pink-500/30",
  "Tiffany": "bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-500/50 dark:border-cyan-500/30",
  "Vivara": "bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/50 dark:border-amber-500/30",
  "Importador": "bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-500/50 dark:border-indigo-500/30",
  "Inspirações": "bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/50 dark:border-rose-500/30",
};

const categoryColorPalette = [
  "bg-violet-500/20 text-violet-700 dark:text-violet-300 border-violet-500/50 dark:border-violet-500/30",
  "bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-500/50 dark:border-indigo-500/30",
  "bg-sky-500/20 text-sky-700 dark:text-sky-300 border-sky-500/50 dark:border-sky-500/30",
  "bg-teal-500/20 text-teal-700 dark:text-teal-300 border-teal-500/50 dark:border-teal-500/30",
  "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/50 dark:border-emerald-500/30",
  "bg-lime-500/20 text-lime-700 dark:text-lime-300 border-lime-500/50 dark:border-lime-500/30",
  "bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/50 dark:border-orange-500/30",
  "bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/50 dark:border-red-500/30",
  "bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/50 dark:border-rose-500/30",
  "bg-fuchsia-500/20 text-fuchsia-700 dark:text-fuchsia-300 border-fuchsia-500/50 dark:border-fuchsia-500/30",
];

const getCategoryColor = (category: string) => {
  if (defaultCategoryColors[category]) {
    return defaultCategoryColors[category];
  }
  
  const hash = category.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return categoryColorPalette[hash % categoryColorPalette.length];
};

export function SupplierDetailsDrawer({ 
  supplier, 
  open, 
  onOpenChange,
  onRate,
  hideInfo = false
}: SupplierDetailsDrawerProps) {
  if (!supplier) return null;

  const normalizeInstagramUsername = (instagram: string) => {
    return instagram
      .trim()
      .replace("@", "")
      .replace(/^https?:\/\/(www\.)?instagram\.com\//, "")
      .replace(/\/$/, "");
  };

  const instagramUsername = normalizeInstagramUsername(supplier.instagram);
  const instagramUrl = `https://www.instagram.com/${instagramUsername}`;

  const handleCopyInstagram = () => {
    navigator.clipboard.writeText(instagramUrl);
    toast.success("Link do Instagram copiado!");
  };

  const handleInstagramClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(instagramUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="border-b border-border">
          <DrawerTitle className={cn("text-xl font-bold", hideInfo && "blur-sm select-none")}>{supplier.name}</DrawerTitle>
        </DrawerHeader>
        
        <div className="p-4 space-y-6 overflow-y-auto">
          {/* Type */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Tipo</div>
            <div className="flex items-center gap-2">
              {supplier.type === "Fabricante" ? (
                <Factory className="w-5 h-5 text-accent" />
              ) : (
                <ShoppingBag className="w-5 h-5 text-accent" />
              )}
              <span className="text-base font-medium">{supplier.type}</span>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Categorias</div>
            <div className="flex flex-wrap gap-2">
              {supplier.categories.map((category) => (
                <Badge
                  key={category}
                  variant="outline"
                  className={cn("text-sm border", getCategoryColor(category))}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Region */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Região</div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-accent" />
              <Badge variant="secondary" className="font-mono text-sm">
                {supplier.region}
              </Badge>
            </div>
          </div>

          {/* Min Order */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Pedido Mínimo</div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-accent" />
              <span className="text-base font-medium">
                {supplier.minOrderIsPieces 
                  ? `${supplier.minOrder.toLocaleString("pt-BR")} peças`
                  : `R$ ${supplier.minOrder.toLocaleString("pt-BR")}`
                }
              </span>
            </div>
          </div>

          {/* Instagram */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Instagram</div>
            <div className={cn("flex items-center gap-2", hideInfo && "blur-sm select-none pointer-events-none")}>
              <Button
                variant="outline"
                onClick={handleInstagramClick}
                className="flex-1 justify-start"
                disabled={hideInfo}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                @{instagramUsername}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyInstagram}
                disabled={hideInfo}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Avaliação</div>
            <StarRating
              rating={supplier.rating}
              ratingCount={supplier.ratingCount}
              onRate={onRate}
            />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
