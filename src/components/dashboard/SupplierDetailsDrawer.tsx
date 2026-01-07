import { ExternalLink, Factory, ShoppingBag, Copy, MapPin, DollarSign } from "lucide-react";
import { Supplier } from "@/types/supplier";
import { Button } from "@/components/ui/button";
import { StarRating } from "./StarRating";
import { CategoryBadge } from "./CategoryBadge";
import { toast } from "sonner";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface SupplierDetailsDrawerProps {
  supplier: Supplier | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRate: (rating: number) => void;
  hideInfo?: boolean;
}

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
                <CategoryBadge key={category} category={category} className="text-sm" />
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
