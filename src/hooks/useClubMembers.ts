import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ClubMember } from "@/types/clubMember";
import { useToast } from "@/hooks/use-toast";

export function useClubMembers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: members, isLoading } = useQuery({
    queryKey: ["club-members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("club_members")
        .select(`
          *,
          supplier:suppliers(
            id,
            name,
            instagram,
            categories:supplier_categories(
              category:categories(name)
            )
          )
        `)
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;

      return (data as any[]).map((member) => ({
        ...member,
        supplier: {
          ...member.supplier,
          categories: member.supplier?.categories?.map((c: any) => c.category.name) || [],
        },
      })) as ClubMember[];
    },
  });

  const addMemberMutation = useMutation({
    mutationFn: async (memberData: {
      supplier_id: string;
      benefit: string;
      coupon_code: string;
      expiry_date: string | null;
    }) => {
      const { data, error } = await supabase
        .from("club_members")
        .insert([memberData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["club-members"] });
      toast({
        title: "Sucesso!",
        description: "Fornecedor adicionado ao Club JoIA com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao adicionar fornecedor ao Club JoIA",
        variant: "destructive",
      });
    },
  });

  const updateMemberMutation = useMutation({
    mutationFn: async ({
      id,
      ...data
    }: Partial<ClubMember> & { id: string }) => {
      const { error } = await supabase
        .from("club_members")
        .update(data)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["club-members"] });
      toast({
        title: "Sucesso!",
        description: "Membro do Club JoIA atualizado com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar membro",
        variant: "destructive",
      });
    },
  });

  const deleteMemberMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("club_members")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["club-members"] });
      toast({
        title: "Sucesso!",
        description: "Membro removido do Club JoIA com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao remover membro",
        variant: "destructive",
      });
    },
  });

  return {
    members: members || [],
    isLoading,
    addMember: addMemberMutation.mutate,
    updateMember: updateMemberMutation.mutate,
    deleteMember: deleteMemberMutation.mutate,
  };
}
