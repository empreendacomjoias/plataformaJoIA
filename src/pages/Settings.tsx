import { Settings as SettingsIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function Settings() {
  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <SettingsIcon className="w-8 h-8 text-accent drop-shadow-[0_0_10px_rgba(167,139,250,0.6)]" />
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Configurações
          </h1>
          <p className="text-muted-foreground">
            Personalize sua experiência
          </p>
        </div>
      </div>

      <Card className="p-6 border-border/50 shadow-lg">
        <p className="text-muted-foreground text-center py-12">
          Em breve: configurações de perfil, notificações e preferências
        </p>
      </Card>
    </div>
  );
}
