import { useState } from "react";
import { useClubMembers } from "@/hooks/useClubMembers";
import { useModuleDescriptions } from "@/hooks/useModuleDescriptions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy, Instagram, Search, Shield, Sparkles, Gem, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { usePreview } from "@/contexts/PreviewContext";
import { useNavigate } from "react-router-dom";
import { EditDescriptionDialog } from "@/components/club/EditDescriptionDialog";

export default function ClubJoia() {
  const { members, isLoading } = useClubMembers();
  const { getDescriptionByKey, updateDescription, isLoading: isLoadingDescription } = useModuleDescriptions();
  const { toast } = useToast();
  const { isAdmin: realIsAdmin } = useAuth();
  const { previewAsUser } = usePreview();
  const isAdmin = realIsAdmin && !previewAsUser;
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [hideAll, setHideAll] = useState(false);

  const moduleDescription = getDescriptionByKey("club_joia");

  const filteredMembers = members.filter((member) =>
    member.is_active &&
    (member.supplier?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.benefit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.coupon_code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const featuredMembers = filteredMembers.filter((m) => m.is_featured);
  const regularMembers = filteredMembers.filter((m) => !m.is_featured);

  const copyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Cupom copiado!",
      description: `Código ${code} copiado para a área de transferência.`,
    });
  };

  const isExpired = (date: string | null) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  const getInstagramUrl = (instagram: string) => {
    const username = instagram
      .trim()
      .replace("@", "")
      .replace(/^https?:\/\/(www\.)?instagram\.com\//, "")
      .replace(/\/$/, ""); // Remove trailing slash
    return `https://www.instagram.com/${username}`;
  };

  if (isLoading || isLoadingDescription) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Gem className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
              <h1 className="text-2xl sm:text-3xl font-bold">{moduleDescription?.title || "Club JoIA"}</h1>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
              {moduleDescription?.description || "Tudo que um(a) empreendedor(a) precisa — em um só lugar. Encontre ferramentas, produtos e serviços recomendados pela JoIA e ganhe tempo (e lucro) com soluções que funcionam."}
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setHideAll(!hideAll)}
              className="gap-2"
            >
              {hideAll ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              {hideAll ? "Mostrar" : "Ocultar"}
            </Button>
            {isAdmin && moduleDescription && (
              <EditDescriptionDialog
                id={moduleDescription.id}
                currentTitle={moduleDescription.title}
                currentDescription={moduleDescription.description}
                onSave={(id, title, description) => updateDescription.mutate({ id, title, description })}
              />
            )}
            {isAdmin && (
              <Button onClick={() => navigate("/club-joia/admin")} variant="outline" className="gap-2 flex-1 sm:flex-initial">
                <Shield className="w-4 h-4" />
                Admin
              </Button>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por fornecedor, benefício ou cupom..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Featured Members */}
        {featuredMembers.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Em Destaque</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredMembers.map((member) => (
                <Card key={member.id} className="p-6 space-y-4 border-primary/50 bg-gradient-to-br from-primary/5 to-accent/5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className={`font-semibold text-lg ${hideAll ? "blur-sm select-none" : ""}`}>
                        {member.supplier?.name}
                      </h3>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {member.supplier?.categories.map((cat) => (
                          <Badge key={cat} variant="secondary" className="text-xs">
                            {cat}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Badge className="gap-1 bg-primary/20 text-primary border-primary/30">
                      <Sparkles className="w-3 h-3" />
                      Destaque
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{member.benefit}</p>
                    <div className="flex items-center gap-2">
                      <code className={`flex-1 px-3 py-2 bg-secondary rounded text-sm font-mono ${hideAll ? "blur-sm select-none" : ""}`}>
                        {member.coupon_code}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyCoupon(member.coupon_code)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    {member.expiry_date && (
                      <p className={`text-xs ${isExpired(member.expiry_date) ? 'text-destructive' : 'text-muted-foreground'}`}>
                        {isExpired(member.expiry_date) ? 'Expirado em' : 'Válido até'}: {new Date(member.expiry_date).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>

                  {member.supplier?.instagram && (
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() => { window.location.href = getInstagramUrl(member.supplier?.instagram || '');}}
                    >
                      <Instagram className="w-4 h-4" />
                      Acessar Fornecedor
                    </Button>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Regular Members */}
        {regularMembers.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Benefícios Disponíveis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {regularMembers.map((member) => (
                <Card key={member.id} className="p-6 space-y-4">
                  <div>
                    <h3 className={`font-semibold text-lg ${hideAll ? "blur-sm select-none" : ""}`}>
                      {member.supplier?.name}
                    </h3>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {member.supplier?.categories.map((cat) => (
                        <Badge key={cat} variant="secondary" className="text-xs">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{member.benefit}</p>
                    <div className="flex items-center gap-2">
                      <code className={`flex-1 px-3 py-2 bg-secondary rounded text-sm font-mono ${hideAll ? "blur-sm select-none" : ""}`}>
                        {member.coupon_code}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyCoupon(member.coupon_code)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    {member.expiry_date && (
                      <p className={`text-xs ${isExpired(member.expiry_date) ? 'text-destructive' : 'text-muted-foreground'}`}>
                        {isExpired(member.expiry_date) ? 'Expirado em' : 'Válido até'}: {new Date(member.expiry_date).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>

                  {member.supplier?.instagram && (
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() => window.open(getInstagramUrl(member.supplier?.instagram || ''), '_blank')}
                    >
                      <Instagram className="w-4 h-4" />
                      Acessar Fornecedor
                    </Button>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {filteredMembers.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">
              {searchTerm ? "Nenhum benefício encontrado para sua busca." : "Nenhum benefício disponível no momento."}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
