import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Bonus {
  id: string;
  title: string;
  description: string | null;
  pdf_url: string;
  cover_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useBonuses(opts: { activeOnly?: boolean } = {}) {
  return useQuery({
    queryKey: ["bonuses", opts.activeOnly ?? false],
    queryFn: async () => {
      let q = supabase.from("bonuses").select("*").order("created_at", { ascending: false });
      if (opts.activeOnly) q = q.eq("is_active", true);
      const { data, error } = await q;
      if (error) throw error;
      return data as Bonus[];
    },
  });
}

export function useBonusMutations() {
  const qc = useQueryClient();
  const { toast } = useToast();

  const invalidate = () => qc.invalidateQueries({ queryKey: ["bonuses"] });

  const createBonus = useMutation({
    mutationFn: async (payload: Omit<Bonus, "id" | "created_at" | "updated_at">) => {
      const { error } = await supabase.from("bonuses").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast({ title: "Bônus criado com sucesso!" });
    },
    onError: (e: any) => toast({ title: "Erro ao criar bônus", description: e.message, variant: "destructive" }),
  });

  const updateBonus = useMutation({
    mutationFn: async ({ id, ...patch }: Partial<Bonus> & { id: string }) => {
      const { error } = await supabase.from("bonuses").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast({ title: "Bônus atualizado!" });
    },
    onError: (e: any) => toast({ title: "Erro ao atualizar", description: e.message, variant: "destructive" }),
  });

  const deleteBonus = useMutation({
    mutationFn: async (bonus: Bonus) => {
      // best-effort: delete files
      const paths = [bonus.pdf_url, bonus.cover_url].filter(Boolean) as string[];
      if (paths.length) await supabase.storage.from("bonuses").remove(paths);
      const { error } = await supabase.from("bonuses").delete().eq("id", bonus.id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast({ title: "Bônus removido." });
    },
    onError: (e: any) => toast({ title: "Erro ao remover", description: e.message, variant: "destructive" }),
  });

  return { createBonus, updateBonus, deleteBonus };
}

export async function getSignedBonusUrl(path: string, expiresIn = 3600): Promise<string | null> {
  if (!path) return null;
  const { data, error } = await supabase.storage.from("bonuses").createSignedUrl(path, expiresIn);
  if (error) return null;
  return data.signedUrl;
}

export async function uploadBonusFile(file: File, kind: "pdf" | "cover"): Promise<string> {
  const ext = file.name.split(".").pop() || (kind === "pdf" ? "pdf" : "jpg");
  const path = `${kind}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("bonuses").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });
  if (error) throw error;
  return path;
}
