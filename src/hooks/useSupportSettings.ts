import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface SupportSettings {
  id: string;
  support_email: string | null;
  support_whatsapp: string | null;
  created_at: string;
  updated_at: string;
}

export function useSupportSettings() {
  return useQuery({
    queryKey: ["support-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("support_settings")
        .select("*")
        .limit(1)
        .single();

      if (error) throw error;
      return data as SupportSettings;
    },
  });
}

export function useUpdateSupportSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      support_email,
      support_whatsapp,
    }: {
      id: string;
      support_email: string;
      support_whatsapp: string;
    }) => {
      const { error } = await supabase
        .from("support_settings")
        .update({ support_email, support_whatsapp })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-settings"] });
      toast.success("Configurações de suporte atualizadas!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao atualizar configurações: " + error.message);
    },
  });
}
