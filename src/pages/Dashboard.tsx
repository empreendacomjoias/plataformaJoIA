import { useState } from "react";
import { TopRanking } from "@/components/dashboard/TopRanking";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { SupplierTable } from "@/components/dashboard/SupplierTable";
import { useSuppliers } from "@/hooks/useSuppliers";
import { useFavorites } from "@/hooks/useFavorites";
import { useRatings } from "@/hooks/useRatings";

export default function Dashboard() {
  const { suppliers, isLoading } = useSuppliers();
  const { toggleFavorite } = useFavorites();
  const { rateSupplier } = useRatings();
  const [searchQuery, setSearchQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  const filteredSuppliers = suppliers.filter((supplier) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      supplier.name.toLowerCase().includes(query) ||
      supplier.instagram.toLowerCase().includes(query) ||
      supplier.region.toLowerCase().includes(query);
    
    const matchesRegion = regionFilter === "all" || supplier.region === regionFilter;
    const matchesType = typeFilter === "all" || supplier.type === typeFilter;
    
    return matchesSearch && matchesRegion && matchesType;
  }).sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <TopRanking suppliers={suppliers} />
      <FilterBar 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery}
        regionFilter={regionFilter}
        onRegionChange={setRegionFilter}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
      <SupplierTable
        suppliers={filteredSuppliers}
        onToggleFavorite={(id) => {
          const supplier = suppliers.find(s => s.id === id);
          if (supplier) {
            toggleFavorite({ supplierId: id, isFavorite: supplier.isFavorite, supplierName: supplier.name });
          }
        }}
        onRate={(id, rating) => rateSupplier({ supplierId: id, rating })}
      />
    </div>
  );
}
