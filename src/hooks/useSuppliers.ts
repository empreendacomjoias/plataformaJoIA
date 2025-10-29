import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Supplier } from "@/types/supplier";
import { toast } from "sonner";

export function useSuppliers() {
  const queryClient = useQueryClient();

  const { data: suppliers = [], isLoading } = useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const { data: suppliersData, error: suppliersError } = await supabase
        .from("suppliers")
        .select(`
          *,
          supplier_categories (
            categories (
              name
            )
          )
        `)
        .order("rating", { ascending: false });

      if (suppliersError) throw suppliersError;

      // Get user favorites
      const { data: { user } } = await supabase.auth.getUser();
      let favorites: string[] = [];

      if (user) {
        const { data: favoritesData } = await supabase
          .from("user_favorites")
          .select("supplier_id")
          .eq("user_id", user.id);

        favorites = favoritesData?.map((f) => f.supplier_id) || [];
      }

      // Transform data to match Supplier type
      const transformedSuppliers: Supplier[] = suppliersData.map((s) => ({
        id: s.id,
        name: s.name,
        type: s.type as "Fabricante" | "Atacadista",
        categories: s.supplier_categories.map((sc: any) => sc.categories.name),
        region: s.region,
        minOrder: Number(s.min_order),
        instagram: s.instagram,
        rating: Number(s.rating) || 0,
        ratingCount: s.rating_count || 0,
        isFavorite: favorites.includes(s.id),
      }));

      return transformedSuppliers;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (supplierId: string) => {
      const { error } = await supabase
        .from("suppliers")
        .delete()
        .eq("id", supplierId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success("Fornecedor removido com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao remover fornecedor");
    },
  });

  return {
    suppliers,
    isLoading,
    deleteSupplier: deleteMutation.mutate,
  };
}
