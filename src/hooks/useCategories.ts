import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useCategories() {
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;
      return data.map((c) => c.name);
    },
  });

  const createMutation = useMutation({
    mutationFn: async (name: string) => {
      const { error } = await supabase
        .from("categories")
        .insert({ name: name.trim() });

      if (error) {
        if (error.code === "23505") {
          throw new Error("Esta categoria já existe");
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Categoria criada com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao criar categoria");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (name: string) => {
      // First get the category ID
      const { data: category, error: selectError } = await supabase
        .from("categories")
        .select("id")
        .eq("name", name)
        .single();

      if (selectError) throw selectError;

      // Delete the category
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", category.id);

      if (error) {
        if (error.code === "23503") {
          throw new Error("Não é possível deletar categoria em uso");
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Categoria removida com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao remover categoria");
    },
  });

  return {
    categories,
    isLoading,
    createCategory: createMutation.mutate,
    isCreating: createMutation.isPending,
    deleteCategory: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
}
