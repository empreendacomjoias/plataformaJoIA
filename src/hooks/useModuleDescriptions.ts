import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ModuleDescription {
  id: string;
  module_key: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export function useModuleDescriptions() {
  return useQuery({
    queryKey: ["module-descriptions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("module_descriptions")
        .select("*")
        .order("module_key");

      if (error) throw error;
      return data as ModuleDescription[];
    },
  });
}

export function useModuleDescription(moduleKey: string) {
  return useQuery({
    queryKey: ["module-description", moduleKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("module_descriptions")
        .select("*")
        .eq("module_key", moduleKey)
        .single();

      if (error) throw error;
      return data as ModuleDescription;
    },
  });
}

export function useUpdateModuleDescription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      title,
      description,
    }: {
      id: string;
      title: string;
      description: string;
    }) => {
      const { error } = await supabase
        .from("module_descriptions")
        .update({ title, description })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["module-descriptions"] });
      queryClient.invalidateQueries({ queryKey: ["module-description"] });
      toast.success("Descrição atualizada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao atualizar descrição: " + error.message);
    },
  });
}
