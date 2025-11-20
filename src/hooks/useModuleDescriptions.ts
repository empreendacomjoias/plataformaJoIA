import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useModuleDescriptions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: descriptions, isLoading } = useQuery({
    queryKey: ["module-descriptions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("module_descriptions")
        .select("*");

      if (error) throw error;
      return data;
    },
  });

  const updateDescription = useMutation({
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
      toast({
        title: "Descrição atualizada!",
        description: "As alterações foram salvas com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive",
      });
    },
  });

  const getDescriptionByKey = (key: string) => {
    return descriptions?.find((d) => d.module_key === key);
  };

  return {
    descriptions,
    isLoading,
    updateDescription,
    getDescriptionByKey,
  };
};
