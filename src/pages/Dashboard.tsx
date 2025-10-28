import { useState } from "react";
import { Supplier } from "@/types/supplier";
import { mockSuppliers } from "@/data/mockSuppliers";
import { TopRanking } from "@/components/dashboard/TopRanking";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { SupplierTable } from "@/components/dashboard/SupplierTable";
import { toast } from "sonner";

export default function Dashboard() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [searchQuery, setSearchQuery] = useState("");

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
      toast.success(
        supplier.isFavorite
          ? `${supplier.name} removido dos favoritos`
          : `${supplier.name} adicionado aos favoritos! 💜`
      );
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

  const filteredSuppliers = suppliers.filter((supplier) => {
    const query = searchQuery.toLowerCase();
    return (
      supplier.name.toLowerCase().includes(query) ||
      supplier.instagram.toLowerCase().includes(query) ||
      supplier.region.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Top Ranking */}
      <TopRanking suppliers={suppliers} />

      {/* Filter Bar */}
      <FilterBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Supplier Table */}
      <SupplierTable
        suppliers={filteredSuppliers}
        onToggleFavorite={handleToggleFavorite}
        onRate={handleRate}
      />
    </div>
  );
}
