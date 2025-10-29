import { useSuppliers } from "@/hooks/useSuppliers";
import { useFavorites } from "@/hooks/useFavorites";
import { useRatings } from "@/hooks/useRatings";
import { SupplierTable } from "@/components/dashboard/SupplierTable";
import { Heart } from "lucide-react";

export default function Favorites() {
  const { suppliers, isLoading } = useSuppliers();
  const { toggleFavorite } = useFavorites();
  const { rateSupplier } = useRatings();

  const favoriteSuppliers = suppliers.filter((s) => s.isFavorite);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Heart className="w-8 h-8 text-red-500 fill-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]" />
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Meus Favoritos
          </h1>
          <p className="text-muted-foreground">
            {favoriteSuppliers.length} fornecedor(es) favorito(s)
          </p>
        </div>
      </div>

      {favoriteSuppliers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Heart className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Nenhum favorito ainda</h3>
          <p className="text-muted-foreground">
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
        />
      )}
    </div>
  );
}
