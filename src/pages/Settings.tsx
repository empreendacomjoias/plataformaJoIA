import { Settings as SettingsIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSection } from "@/components/settings/ProfileSection";
import { PreferencesSection } from "@/components/settings/PreferencesSection";
import { SupportSection } from "@/components/settings/SupportSection";
import { ModuleDescriptionsSection } from "@/components/settings/ModuleDescriptionsSection";
import { useAuth } from "@/contexts/AuthContext";

export default function Settings() {
  const { isAdmin } = useAuth();

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

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="preferences">Preferências</TabsTrigger>
          <TabsTrigger value="support">Suporte</TabsTrigger>
          {isAdmin && <TabsTrigger value="modules">Módulos</TabsTrigger>}
        </TabsList>

        <TabsContent value="profile">
          <Card className="p-6 border-border/50 shadow-lg">
            <ProfileSection />
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card className="p-6 border-border/50 shadow-lg">
            <PreferencesSection />
          </Card>
        </TabsContent>

        <TabsContent value="support">
          <Card className="p-6 border-border/50 shadow-lg">
            <SupportSection />
          </Card>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="modules">
            <Card className="p-6 border-border/50 shadow-lg">
              <ModuleDescriptionsSection />
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
