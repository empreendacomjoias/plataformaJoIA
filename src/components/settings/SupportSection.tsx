import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Mail, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function SupportSection() {
  const queryClient = useQueryClient();
  const { isAdmin } = useAuth();
  const [email, setEmail] = useState("");

  const { data: settings, isLoading } = useQuery({
    queryKey: ["support-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("support_settings")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (settings) {
      setEmail(settings.support_email || "");
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      if (settings?.id) {
        const { error } = await supabase
          .from("support_settings")
          .update({ support_email: email })
          .eq("id", settings.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("support_settings")
          .insert({ support_email: email });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-settings"] });
      toast.success("Configurações de suporte atualizadas!");
    },
    onError: () => {
      toast.error("Erro ao atualizar configurações de suporte");
    },
  });

  const handleSave = () => {
    updateMutation.mutate({ email });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Suporte</h3>
        <p className="text-sm text-muted-foreground">
          {isAdmin ? "Configure o email de contato para suporte" : "Entre em contato conosco"}
        </p>
      </div>

      <div className="space-y-4">
        {isAdmin ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="support-email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email de Suporte
              </Label>
              <Input
                id="support-email"
                type="email"
                placeholder="suporte@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleSave} 
              disabled={updateMutation.isPending}
              className="w-full sm:w-auto"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Alterações"
              )}
            </Button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 text-foreground">
              <Mail className="w-4 h-4" />
              <span>{email || "Não configurado"}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Atendimento de segunda a sexta, das 10h às 18h.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
