import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSupportSettings, useUpdateSupportSettings } from "@/hooks/useSupportSettings";
import { Loader2 } from "lucide-react";

export function SupportSection() {
  const { data: settings, isLoading } = useSupportSettings();
  const { mutate: updateSettings, isPending } = useUpdateSupportSettings();
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  useEffect(() => {
    if (settings) {
      setEmail(settings.support_email || "");
      setWhatsapp(settings.support_whatsapp || "");
    }
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    updateSettings({
      id: settings.id,
      support_email: email,
      support_whatsapp: whatsapp,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Suporte</h3>
        <p className="text-sm text-muted-foreground">
          Configure os canais de suporte para seus usuários
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="support-email">E-mail de Suporte</Label>
          <Input
            id="support-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="suporte@exemplo.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="support-whatsapp">WhatsApp de Suporte</Label>
          <Input
            id="support-whatsapp"
            type="tel"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="5511999999999"
          />
          <p className="text-xs text-muted-foreground">
            Digite o número com código do país (ex: 5511999999999)
          </p>
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            "Salvar Alterações"
          )}
        </Button>
      </form>
    </div>
  );
}
