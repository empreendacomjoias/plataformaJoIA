import { Heart, Factory, ShoppingBag, ExternalLink, MoreVertical, Copy, Trash2, Pencil, Eye, EyeOff, Gem } from "lucide-react";
import { useState } from "react";
import { Supplier } from "@/types/supplier";
import { StarRating } from "./StarRating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useSuppliers } from "@/hooks/useSuppliers";
import { toast } from "sonner";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { EditSupplierDialog } from "./EditSupplierDialog";
import { AddToClubDialog } from "./AddToClubDialog";
import { SupplierDetailsDrawer } from "./SupplierDetailsDrawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SupplierRowProps {
  supplier: Supplier;
  onToggleFavorite: (id: string) => void;
  onRate: (id: string, rating: number) => void;
  hideAll?: boolean;
}

const defaultCategoryColors: Record<string, string> = {
  "Personalizado": "bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/50 dark:border-purple-500/30",
  "Masculino": "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/50 dark:border-blue-500/30",
  "Pedras Naturais": "bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/50 dark:border-green-500/30",
  "Pandora": "bg-pink-500/20 text-pink-700 dark:text-pink-300 border-pink-500/50 dark:border-pink-500/30",
  "Tiffany": "bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-500/50 dark:border-cyan-500/30",
  "Vivara": "bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/50 dark:border-amber-500/30",
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
  
  // Generate consistent color based on category name
  const hash = category.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return categoryColorPalette[hash % categoryColorPalette.length];
};

export function SupplierRow({ supplier, onToggleFavorite, onRate, hideAll = false }: SupplierRowProps) {
  const { isAdmin } = useAuth();
  const { deleteSupplier } = useSuppliers();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddToClubDialog, setShowAddToClubDialog] = useState(false);
  const [showDetailsDrawer, setShowDetailsDrawer] = useState(false);
  const [isInfoHidden, setIsInfoHidden] = useState(false);
  
  const shouldHide = hideAll || isInfoHidden;

  // Normalize Instagram URL - using same logic as copy button
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

  const handleDelete = () => {
    deleteSupplier(supplier.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <tr className="border-b border-border/50 hover:bg-secondary/30 transition-colors group">
      {/* Favorite */}
      <td className="p-2 sm:p-4">
        <button
          onClick={() => onToggleFavorite(supplier.id)}
          className="transition-transform hover:scale-125"
        >
          <Heart
            className={cn(
              "w-4 h-4 sm:w-5 sm:h-5 transition-all",
              supplier.isFavorite
                ? "fill-red-500 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]"
                : "text-muted-foreground hover:text-red-500"
            )}
          />
        </button>
      </td>

      {/* Name */}
      <td className="p-2 sm:p-4">
        <button
          onClick={() => setShowDetailsDrawer(true)}
          className={cn(
            "font-semibold text-sm sm:text-base text-left md:pointer-events-none",
            shouldHide && "blur-sm select-none"
          )}
        >
          {supplier.name}
        </button>
      </td>

      {/* Type */}
      <td className="hidden md:table-cell p-2 sm:p-4">
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
      <td className="hidden lg:table-cell p-2 sm:p-4">
        <div className="flex flex-wrap gap-1.5">
          {supplier.categories.map((category) => (
            <Badge
              key={category}
              variant="outline"
              className={cn("text-xs border", getCategoryColor(category))}
            >
              {category}
            </Badge>
          ))}
        </div>
      </td>

      {/* Region */}
      <td className="hidden sm:table-cell p-2 sm:p-4">
        <Badge variant="secondary" className="font-mono text-xs">
          {supplier.region}
        </Badge>
      </td>

      {/* Min Order */}
      <td className="hidden xl:table-cell p-2 sm:p-4">
        <span className="text-sm font-medium">
          R$ {supplier.minOrder.toLocaleString("pt-BR")}
        </span>
      </td>

      {/* Instagram */}
      <td className="hidden md:table-cell p-2 sm:p-4">
        <a
          href={instagramUrl}
          onClick={handleInstagramClick}
          className={cn(
            "flex items-center gap-2 text-accent hover:text-accent/80 transition-colors cursor-pointer",
            shouldHide && "blur-sm select-none pointer-events-none"
          )}
        >
          <span className="text-sm">@{instagramUsername}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </td>

      {/* Rating */}
      <td className="p-2 sm:p-4">
        <StarRating
          rating={supplier.rating}
          ratingCount={supplier.ratingCount}
          onRate={(rating) => onRate(supplier.id, rating)}
        />
      </td>

      {/* Actions */}
      <td className="p-2 sm:p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 sm:h-10 sm:w-10"
            >
              <MoreVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card border-border">
            <DropdownMenuItem onClick={handleCopyInstagram} className="cursor-pointer">
              <Copy className="w-4 h-4 mr-2" />
              Copiar Instagram
            </DropdownMenuItem>
            {isAdmin && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => setShowAddToClubDialog(true)}
                  className="cursor-pointer"
                >
                  <Gem className="w-4 h-4 mr-2" />
                  Adicionar ao Club JoIA
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setIsInfoHidden(!isInfoHidden)}
                  className="cursor-pointer"
                >
                  {isInfoHidden ? (
                    <><Eye className="w-4 h-4 mr-2" />Mostrar Informações</>
                  ) : (
                    <><EyeOff className="w-4 h-4 mr-2" />Ocultar Informações</>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setShowEditDialog(true)}
                  className="cursor-pointer"
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Editar Fornecedor
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setShowDeleteDialog(true)}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remover Fornecedor
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>

    <ConfirmDeleteDialog
      open={showDeleteDialog}
      onOpenChange={setShowDeleteDialog}
      onConfirm={handleDelete}
      supplierName={supplier.name}
    />

    <EditSupplierDialog
      supplier={supplier}
      open={showEditDialog}
      onOpenChange={setShowEditDialog}
    />

    <AddToClubDialog
      supplier={supplier}
      open={showAddToClubDialog}
      onOpenChange={setShowAddToClubDialog}
    />

    <SupplierDetailsDrawer
      supplier={supplier}
      open={showDetailsDrawer}
      onOpenChange={setShowDetailsDrawer}
      onRate={(rating) => onRate(supplier.id, rating)}
    />
    </>
  );
}
