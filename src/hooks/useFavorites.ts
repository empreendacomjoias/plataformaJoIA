import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useFavorites() {
  const queryClient = useQueryClient();

  const toggleMutation = useMutation({
    mutationFn: async ({ supplierId, isFavorite, supplierName }: { 
      supplierId: string; 
      isFavorite: boolean;
      supplierName: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from("user_favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("supplier_id", supplierId);

        if (error) throw error;
        return { action: "removed", supplierName };
      } else {
        // Add to favorites
        const { error } = await supabase
          .from("user_favorites")
          .insert({
            user_id: user.id,
            supplier_id: supplierId,
          });

        if (error) throw error;
        return { action: "added", supplierName };
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      
      if (data.action === "added") {
        toast.success(`${data.supplierName} adicionado aos favoritos! 💜`);
      } else {
        toast.success(`${data.supplierName} removido dos favoritos`);
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao atualizar favoritos");
    },
  });

  return {
    toggleFavorite: toggleMutation.mutate,
  };
}
