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
        minOrderIsPieces: s.min_order_is_pieces || false,
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

  const updateMutation = useMutation({
    mutationFn: async (data: {
      id: string;
      name: string;
      type: "Fabricante" | "Atacadista";
      region: string;
      minOrder: number;
      minOrderIsPieces: boolean;
      instagram: string;
      categories: string[];
    }) => {
      // Update supplier
      const { error: supplierError } = await supabase
        .from("suppliers")
        .update({
          name: data.name,
          type: data.type,
          region: data.region,
          min_order: data.minOrder,
          min_order_is_pieces: data.minOrderIsPieces,
          instagram: data.instagram,
        })
        .eq("id", data.id);

      if (supplierError) throw supplierError;

      // Delete existing category relations
      const { error: deleteError } = await supabase
        .from("supplier_categories")
        .delete()
        .eq("supplier_id", data.id);

      if (deleteError) throw deleteError;

      // Get category IDs
      const { data: categoryData, error: categoryError } = await supabase
        .from("categories")
        .select("id, name")
        .in("name", data.categories);

      if (categoryError) throw categoryError;

      // Insert new supplier-category relations
      const relations = categoryData.map((cat) => ({
        supplier_id: data.id,
        category_id: cat.id,
      }));

      const { error: relationsError } = await supabase
        .from("supplier_categories")
        .insert(relations);

      if (relationsError) throw relationsError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success("Fornecedor atualizado com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao atualizar fornecedor");
    },
  });

  return {
    suppliers,
    isLoading,
    deleteSupplier: deleteMutation.mutateAsync,
    updateSupplier: updateMutation.mutateAsync,
  };
}
