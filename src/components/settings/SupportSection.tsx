import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Mail, Loader2, Pencil, X, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function SupportSection() {
  const queryClient = useQueryClient();
  const { isAdmin } = useAuth();
  const [email, setEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editEmail, setEditEmail] = useState("");

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
      toast.success("Email de suporte atualizado!");
      setIsEditing(false);
    },
    onError: () => {
      toast.error("Erro ao atualizar email de suporte");
    },
  });

  const handleEdit = () => {
    setEditEmail(email);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditEmail("");
  };

  const handleSave = () => {
    updateMutation.mutate({ email: editEmail });
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
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Suporte</h3>
          <p className="text-sm text-muted-foreground">
            Entre em contato conosco
          </p>
        </div>
        {isAdmin && !isEditing && (
          <Button variant="ghost" size="icon" onClick={handleEdit}>
            <Pencil className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {isEditing ? (
          <div className="space-y-3">
            <Input
              type="email"
              placeholder="suporte@exemplo.com"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
            />
            <div className="flex gap-2">
              <Button 
                size="sm"
                onClick={handleSave} 
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Salvar
                  </>
                )}
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleCancel}
                disabled={updateMutation.isPending}
              >
                <X className="w-4 h-4 mr-1" />
                Cancelar
              </Button>
            </div>
          </div>
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