import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Mail, Phone, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function SupportSection() {
  const queryClient = useQueryClient();
  const { isAdmin } = useAuth();
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

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
      setWhatsapp(settings.support_whatsapp || "");
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: async ({ email, whatsapp }: { email: string; whatsapp: string }) => {
      if (settings?.id) {
        const { error } = await supabase
          .from("support_settings")
          .update({ support_email: email, support_whatsapp: whatsapp })
          .eq("id", settings.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("support_settings")
          .insert({ support_email: email, support_whatsapp: whatsapp });
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
    updateMutation.mutate({ email, whatsapp });
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
          {isAdmin ? "Configure as informações de contato para suporte" : "Informações de contato para suporte"}
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="support-email" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email de Suporte
          </Label>
          {isAdmin ? (
            <Input
              id="support-email"
              type="email"
              placeholder="suporte@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          ) : (
            <p className="text-sm text-foreground">{email || "Não configurado"}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="support-whatsapp" className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            WhatsApp de Suporte
          </Label>
          {isAdmin ? (
            <Input
              id="support-whatsapp"
              type="tel"
              placeholder="(11) 99999-9999"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
          ) : (
            <p className="text-sm text-foreground">{whatsapp || "Não configurado"}</p>
          )}
        </div>

        {isAdmin && (
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
        )}
      </div>
    </div>
  );
}
