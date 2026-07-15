import { useEffect, useState } from "react";
import { Gift, Download, FileText, Settings, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBonuses, getSignedBonusUrl, type Bonus } from "@/hooks/useBonuses";
import { useAuth } from "@/contexts/AuthContext";
import { usePreview } from "@/contexts/PreviewContext";
import { useNavigate } from "react-router-dom";

function BonusCard({ bonus }: { bonus: Bonus }) {
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    let alive = true;
    if (bonus.cover_url) {
      getSignedBonusUrl(bonus.cover_url, 3600).then((u) => {
        if (alive) setCoverUrl(u);
      });
    }
    return () => {
      alive = false;
    };
  }, [bonus.cover_url]);

  const handleDownload = async () => {
    if (!bonus.pdf_url) return;
    setDownloading(true);
    const url = await getSignedBonusUrl(bonus.pdf_url, 600);
    setDownloading(false);
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleOpenLink = () => {
    if (bonus.drive_url) window.open(bonus.drive_url, "_blank", "noopener,noreferrer");
  };

  return (
    <Card className="overflow-hidden border-border/50 shadow-lg hover:shadow-xl hover:border-primary/40 transition-all duration-200 flex flex-col">
      <div className="aspect-video w-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center overflow-hidden">
        {coverUrl ? (
          <img src={coverUrl} alt={bonus.title} className="w-full h-full object-cover" />
        ) : (
          <FileText className="w-16 h-16 text-primary/50" />
        )}
      </div>
      <CardHeader className="pb-2">
        <h3 className="font-semibold text-lg leading-tight line-clamp-2">{bonus.title}</h3>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-3">
        {bonus.description && (
          <p className="text-sm text-muted-foreground line-clamp-3 flex-1">{bonus.description}</p>
        )}
        <div className="flex flex-col gap-2 mt-auto">
          {bonus.pdf_url && (
            <Button onClick={handleDownload} disabled={downloading} className="w-full gap-2">
              <Download className="w-4 h-4" />
              {downloading ? "Preparando..." : "Baixar PDF"}
            </Button>
          )}
          {bonus.drive_url && (
            <Button
              onClick={handleOpenLink}
              variant={bonus.pdf_url ? "outline" : "default"}
              className="w-full gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Abrir link
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Bonuses() {
  const { data: bonuses, isLoading } = useBonuses({ activeOnly: true });
  const { isAdmin: realIsAdmin } = useAuth();
  const { previewAsUser } = usePreview();
  const isAdmin = realIsAdmin && !previewAsUser;
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center gap-3">
          <Gift className="w-7 h-7 sm:w-8 sm:h-8 text-accent drop-shadow-[0_0_10px_rgba(167,139,250,0.6)]" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Bônus
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Materiais exclusivos em PDF para você baixar
            </p>
          </div>
        </div>
        {isAdmin && (
          <Button variant="outline" size="sm" onClick={() => navigate("/bonus/admin")} className="gap-2">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Gerenciar</span>
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-72 w-full" />
          ))}
        </div>
      ) : !bonuses || bonuses.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <Gift className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Nenhum bônus disponível no momento.</p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bonuses.map((b) => (
            <BonusCard key={b.id} bonus={b} />
          ))}
        </div>
      )}
    </div>
  );
}
