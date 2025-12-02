import { useState } from "react";
import { useSuppliers } from "@/hooks/useSuppliers";
import { useFavorites } from "@/hooks/useFavorites";
import { useRatings } from "@/hooks/useRatings";
import { useAuth } from "@/contexts/AuthContext";
import { SupplierTable } from "@/components/dashboard/SupplierTable";
import { Heart, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Favorites() {
  const { suppliers, isLoading } = useSuppliers();
  const { toggleFavorite } = useFavorites();
  const { rateSupplier } = useRatings();
  const { isAdmin } = useAuth();
  const [hideInfo, setHideInfo] = useState(false);

  const favoriteSuppliers = suppliers.filter((s) => s.isFavorite);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 md:mb-6">
        <div className="flex items-center gap-3">
          <Heart className="w-7 h-7 sm:w-8 sm:h-8 text-red-500 fill-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Meus Favoritos
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              {favoriteSuppliers.length} fornecedor(es) favorito(s)
            </p>
          </div>
        </div>
        
        {isAdmin && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setHideInfo(!hideInfo)}
            className="gap-2"
          >
            {hideInfo ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span className="hidden sm:inline">{hideInfo ? "Mostrar" : "Ocultar"}</span>
          </Button>
        )}
      </div>

      {favoriteSuppliers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 sm:py-20 text-center px-4">
          <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold mb-2">Nenhum favorito ainda</h3>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md">
            Adicione fornecedores aos favoritos clicando no ❤️ na lista principal
          </p>
        </div>
      ) : (
        <SupplierTable
          suppliers={favoriteSuppliers}
          onToggleFavorite={(id) => {
            const supplier = suppliers.find(s => s.id === id);
            if (supplier) {
              toggleFavorite({ supplierId: id, isFavorite: supplier.isFavorite, supplierName: supplier.name });
            }
          }}
          onRate={(id, rating) => rateSupplier({ supplierId: id, rating })}
          hideAdminControls
          hideAll={hideInfo}
        />
      )}
    </div>
  );
}
