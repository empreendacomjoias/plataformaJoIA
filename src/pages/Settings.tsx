import { useState } from "react";
import { Settings as SettingsIcon, Eye, EyeOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ProfileSection } from "@/components/settings/ProfileSection";
import { PreferencesSection } from "@/components/settings/PreferencesSection";
import { SupportSection } from "@/components/settings/SupportSection";
import { useAuth } from "@/contexts/AuthContext";

export default function Settings() {
  const { isAdmin } = useAuth();
  const [previewAsUser, setPreviewAsUser] = useState(false);

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center gap-3">
          <SettingsIcon className="w-7 h-7 sm:w-8 sm:h-8 text-accent drop-shadow-[0_0_10px_rgba(167,139,250,0.6)]" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Configurações
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Personalize sua experiência
            </p>
          </div>
        </div>
        
        {isAdmin && (
          <Button
            variant={previewAsUser ? "default" : "outline"}
            size="sm"
            onClick={() => setPreviewAsUser(!previewAsUser)}
            className="gap-2"
          >
            {previewAsUser ? (
              <>
                <EyeOff className="w-4 h-4" />
                <span className="hidden sm:inline">Sair do Preview</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Ver como Usuário</span>
              </>
            )}
          </Button>
        )}
      </div>

      <Card className="p-4 sm:p-5 md:p-6 border-border/50 shadow-lg space-y-4 md:space-y-6">
        <ProfileSection previewAsUser={previewAsUser} />
        <Separator />
        <PreferencesSection previewAsUser={previewAsUser} />
        <Separator />
        <SupportSection previewAsUser={previewAsUser} />
      </Card>
    </div>
  );
}
