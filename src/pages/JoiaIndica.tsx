import { useState } from "react";
import { Search, Sparkles, Settings } from "lucide-react";
import { useRecommendations } from "@/hooks/useRecommendations";
import { useRecommendationCategories } from "@/hooks/useRecommendationCategories";
import { RecommendationCard } from "@/components/recommendations/RecommendationCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function JoiaIndica() {
  const { recommendations, isLoading, trackClick } = useRecommendations();
  const { categories } = useRecommendationCategories();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCtaClick = async (recommendation: any) => {
    try {
      await trackClick(recommendation.id);
      window.open(recommendation.affiliate_link, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Error tracking click:", error);
      window.open(recommendation.affiliate_link, "_blank", "noopener,noreferrer");
    }
  };

  const filteredRecommendations = recommendations
    .filter((rec) => rec.is_active)
    .filter((rec) => {
      const matchesSearch = 
        rec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = !selectedCategory || rec.category_id === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8 text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Sparkles className="w-8 h-8 text-accent animate-glow" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            JoIA Indica
          </h1>
          {isAdmin && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/joia-indica/admin")}
              className="ml-4"
            >
              <Settings className="w-4 h-4 mr-2" />
              Admin
            </Button>
          )}
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Tudo que um(a) empreendedor(a) precisa — em um só lugar.<br />
          Encontre ferramentas, produtos e serviços recomendados pela JoIA e ganhe tempo (e lucro) com soluções que funcionam.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, descrição ou tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            Todas
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              style={{
                backgroundColor: selectedCategory === category.id ? category.color : undefined,
                borderColor: category.color,
              }}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      {!isLoading && (
        <p className="text-sm text-muted-foreground mb-6">
          {filteredRecommendations.length} {filteredRecommendations.length === 1 ? 'indicação encontrada' : 'indicações encontradas'}
        </p>
      )}

      {/* Recommendations Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-96 w-full" />
          ))}
        </div>
      ) : filteredRecommendations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhuma indicação encontrada.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecommendations.map((recommendation) => (
            <RecommendationCard
              key={recommendation.id}
              recommendation={recommendation}
              onCtaClick={() => handleCtaClick(recommendation)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
