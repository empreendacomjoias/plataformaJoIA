import { useState } from "react";
import { mockSuppliers } from "@/data/mockSuppliers";
import { SupplierTable } from "@/components/dashboard/SupplierTable";
import { Heart } from "lucide-react";
import { toast } from "sonner";

export default function Favorites() {
  const [suppliers, setSuppliers] = useState(mockSuppliers);

  const handleToggleFavorite = (id: string) => {
    setSuppliers((prev) =>
      prev.map((supplier) =>
        supplier.id === id
          ? { ...supplier, isFavorite: !supplier.isFavorite }
          : supplier
      )
    );
    
    const supplier = suppliers.find((s) => s.id === id);
    if (supplier) {
      toast.success(`${supplier.name} removido dos favoritos`);
    }
  };

  const handleRate = (id: string, rating: number) => {
    setSuppliers((prev) =>
      prev.map((supplier) =>
        supplier.id === id
          ? {
              ...supplier,
              rating: (supplier.rating * supplier.ratingCount + rating) / (supplier.ratingCount + 1),
              ratingCount: supplier.ratingCount + 1,
            }
          : supplier
      )
    );
    
    toast.success(`Avaliação de ${rating} estrelas registrada! ⭐`);
  };

  const favoriteSuppliers = suppliers.filter((s) => s.isFavorite);

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Heart className="w-8 h-8 text-accent fill-accent drop-shadow-[0_0_10px_rgba(167,139,250,0.6)]" />
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
          onToggleFavorite={handleToggleFavorite}
          onRate={handleRate}
        />
      )}
    </div>
  );
}
