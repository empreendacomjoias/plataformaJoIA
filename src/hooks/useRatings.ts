import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useRatings() {
  const queryClient = useQueryClient();

  const rateMutation = useMutation({
    mutationFn: async ({ supplierId, rating }: { supplierId: string; rating: number }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      // Check if user already rated
      const { data: existing } = await supabase
        .from("ratings")
        .select("id")
        .eq("supplier_id", supplierId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        // Update existing rating
        const { error } = await supabase
          .from("ratings")
          .update({ rating })
          .eq("id", existing.id);

        if (error) throw error;
      } else {
        // Insert new rating
        const { error } = await supabase
          .from("ratings")
          .insert({
            supplier_id: supplierId,
            user_id: user.id,
            rating,
          });

        if (error) throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success(`Avaliação de ${variables.rating} estrelas registrada! ⭐`);
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao avaliar fornecedor");
    },
  });

  return {
    rateSupplier: rateMutation.mutate,
  };
}
