import { useState } from "react";
import { useClubMembers } from "@/hooks/useClubMembers";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy, Instagram, Search, Shield, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ClubJoia() {
  const { members, isLoading } = useClubMembers();
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-2xl">💎</span>
              </div>
              <h1 className="text-3xl font-bold">Club JoIA</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Tudo que um(a) empreendedor(a) precisa — em um só lugar.
              Encontre ferramentas, produtos e serviços recomendados pela JoIA e ganhe tempo (e lucro) com soluções que funcionam.
            </p>
          </div>
          {isAdmin && (
            <Button onClick={() => navigate("/club-joia/admin")} variant="outline" className="gap-2">
              <Shield className="w-4 h-4" />
              Admin
            </Button>
          )}
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
                      <h3 className="font-semibold text-lg">{member.supplier?.name}</h3>
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
                      <code className="flex-1 px-3 py-2 bg-secondary rounded text-sm font-mono">
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
                      onClick={() => window.open(`https://instagram.com/${member.supplier?.instagram.replace('@', '')}`, '_blank')}
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
                    <h3 className="font-semibold text-lg">{member.supplier?.name}</h3>
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
                      <code className="flex-1 px-3 py-2 bg-secondary rounded text-sm font-mono">
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
                      onClick={() => window.open(`https://instagram.com/${member.supplier?.instagram.replace('@', '')}`, '_blank')}
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
