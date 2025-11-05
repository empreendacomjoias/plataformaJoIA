import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useModuleDescriptions, useUpdateModuleDescription } from "@/hooks/useModuleDescriptions";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export function ModuleDescriptionsSection() {
  const { data: descriptions, isLoading } = useModuleDescriptions();
  const { mutate: updateDescription, isPending } = useUpdateModuleDescription();

  const [clubJoiaTitle, setClubJoiaTitle] = useState("");
  const [clubJoiaDesc, setClubJoiaDesc] = useState("");
  const [joiaIndicaTitle, setJoiaIndicaTitle] = useState("");
  const [joiaIndicaDesc, setJoiaIndicaDesc] = useState("");

  useEffect(() => {
    if (descriptions) {
      const clubJoia = descriptions.find((d) => d.module_key === "club_joia");
      const joiaIndica = descriptions.find((d) => d.module_key === "joia_indica");

      if (clubJoia) {
        setClubJoiaTitle(clubJoia.title);
        setClubJoiaDesc(clubJoia.description);
      }
      if (joiaIndica) {
        setJoiaIndicaTitle(joiaIndica.title);
        setJoiaIndicaDesc(joiaIndica.description);
      }
    }
  }, [descriptions]);

  const handleUpdateClubJoia = (e: React.FormEvent) => {
    e.preventDefault();
    const clubJoia = descriptions?.find((d) => d.module_key === "club_joia");
    if (!clubJoia) return;

    updateDescription({
      id: clubJoia.id,
      title: clubJoiaTitle,
      description: clubJoiaDesc,
    });
  };

  const handleUpdateJoiaIndica = (e: React.FormEvent) => {
    e.preventDefault();
    const joiaIndica = descriptions?.find((d) => d.module_key === "joia_indica");
    if (!joiaIndica) return;

    updateDescription({
      id: joiaIndica.id,
      title: joiaIndicaTitle,
      description: joiaIndicaDesc,
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
        <h3 className="text-lg font-semibold">Descrições dos Módulos</h3>
        <p className="text-sm text-muted-foreground">
          Edite os textos que aparecem nos módulos Club JoIA e JoIA Indica
        </p>
      </div>

      <div className="space-y-6">
        <Card className="p-6 border-border/50 space-y-4">
          <h4 className="font-semibold text-accent">Club JoIA</h4>
          <form onSubmit={handleUpdateClubJoia} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="club-joia-title">Título</Label>
              <Input
                id="club-joia-title"
                value={clubJoiaTitle}
                onChange={(e) => setClubJoiaTitle(e.target.value)}
                placeholder="Club JoIA"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="club-joia-desc">Descrição</Label>
              <Textarea
                id="club-joia-desc"
                value={clubJoiaDesc}
                onChange={(e) => setClubJoiaDesc(e.target.value)}
                placeholder="Benefícios exclusivos..."
                rows={3}
              />
            </div>

            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Club JoIA"
              )}
            </Button>
          </form>
        </Card>

        <Card className="p-6 border-border/50 space-y-4">
          <h4 className="font-semibold text-accent">JoIA Indica</h4>
          <form onSubmit={handleUpdateJoiaIndica} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="joia-indica-title">Título</Label>
              <Input
                id="joia-indica-title"
                value={joiaIndicaTitle}
                onChange={(e) => setJoiaIndicaTitle(e.target.value)}
                placeholder="JoIA Indica"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="joia-indica-desc">Descrição</Label>
              <Textarea
                id="joia-indica-desc"
                value={joiaIndicaDesc}
                onChange={(e) => setJoiaIndicaDesc(e.target.value)}
                placeholder="Ferramentas e serviços recomendados..."
                rows={3}
              />
            </div>

            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar JoIA Indica"
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
