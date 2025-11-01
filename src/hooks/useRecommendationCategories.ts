import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RecommendationCategory } from "@/types/recommendation";
import { toast } from "sonner";

export function useRecommendationCategories() {
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["recommendation-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recommendation_categories")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as RecommendationCategory[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: { name: string; color: string }) => {
      const { error } = await supabase
        .from("recommendation_categories")
        .insert([data]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recommendation-categories"] });
      toast.success("Categoria criada com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao criar categoria");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: { id: string; name: string; color: string }) => {
      const { id, ...updateData } = data;
      const { error } = await supabase
        .from("recommendation_categories")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recommendation-categories"] });
      toast.success("Categoria atualizada com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao atualizar categoria");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("recommendation_categories")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recommendation-categories"] });
      toast.success("Categoria removida com sucesso!");
    },
    onError: (error: any) => {
      if (error.message?.includes("foreign key")) {
        toast.error("Não é possível excluir uma categoria que possui indicações vinculadas");
      } else {
        toast.error(error.message || "Erro ao remover categoria");
      }
    },
  });

  return {
    categories,
    isLoading,
    createCategory: createMutation.mutateAsync,
    updateCategory: updateMutation.mutateAsync,
    deleteCategory: deleteMutation.mutate,
  };
}
