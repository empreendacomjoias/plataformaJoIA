import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Recommendation } from "@/types/recommendation";
import { toast } from "sonner";

export function useRecommendations() {
  const queryClient = useQueryClient();

  const { data: recommendations = [], isLoading } = useQuery({
    queryKey: ["recommendations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recommendations")
        .select(`
          *,
          category:recommendation_categories(*)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Recommendation[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: {
      name: string;
      category_id: string;
      description: string;
      image_url?: string;
      cta_text: string;
      affiliate_link: string;
      tags: string[];
    }) => {
      const { error } = await supabase
        .from("recommendations")
        .insert([data]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recommendations"] });
      toast.success("Indicação criada com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao criar indicação");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: {
      id: string;
      name: string;
      category_id: string;
      description: string;
      image_url?: string;
      cta_text: string;
      affiliate_link: string;
      tags: string[];
      is_active: boolean;
    }) => {
      const { id, ...updateData } = data;
      const { error } = await supabase
        .from("recommendations")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recommendations"] });
      toast.success("Indicação atualizada com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao atualizar indicação");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("recommendations")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recommendations"] });
      toast.success("Indicação removida com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao remover indicação");
    },
  });

  const trackClickMutation = useMutation({
    mutationFn: async (recommendationId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from("recommendation_clicks")
        .insert([{
          recommendation_id: recommendationId,
          user_id: user?.id || null,
        }]);

      if (error) throw error;
    },
  });

  return {
    recommendations,
    isLoading,
    createRecommendation: createMutation.mutateAsync,
    updateRecommendation: updateMutation.mutateAsync,
    deleteRecommendation: deleteMutation.mutate,
    trackClick: trackClickMutation.mutateAsync,
  };
}
