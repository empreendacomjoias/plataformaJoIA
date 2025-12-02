import { useState } from "react";
import { TopRanking } from "@/components/dashboard/TopRanking";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { SupplierTable } from "@/components/dashboard/SupplierTable";
import { useSuppliers } from "@/hooks/useSuppliers";
import { useFavorites } from "@/hooks/useFavorites";
import { useRatings } from "@/hooks/useRatings";
import { NotificationBanner } from "@/components/layout/NotificationBanner";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, List } from "lucide-react";

export default function Dashboard() {
  const { suppliers, isLoading } = useSuppliers();
  const { toggleFavorite } = useFavorites();
  const { rateSupplier } = useRatings();
  const [searchQuery, setSearchQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [hideAll, setHideAll] = useState(false);

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
    if (sortBy === "minOrder-asc") return a.minOrder - b.minOrder;
    if (sortBy === "minOrder-desc") return b.minOrder - a.minOrder;
    return 0;
  });

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6">
      <NotificationBanner />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <List className="w-7 h-7 sm:w-8 sm:h-8 text-primary drop-shadow-[0_0_10px_rgba(167,139,250,0.6)]" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Lista de Fornecedores
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Encontre os melhores fornecedores
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setHideAll(!hideAll)}
          className="gap-2"
        >
          {hideAll ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          {hideAll ? "Mostrar" : "Ocultar"}
        </Button>
      </div>
      
      <TopRanking suppliers={suppliers} hideAll={hideAll} />
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
        hideAll={hideAll}
      />
    </div>
  );
}
