import { useState } from "react";
import { useClubMembers } from "@/hooks/useClubMembers";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Star, Trash2, Edit, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ClubJoiaAdmin() {
  const { members, isLoading, updateMember, deleteMember } = useClubMembers();
  const navigate = useNavigate();

  const activeMembers = members.filter((m) => m.is_active);
  const totalMembers = members.length;

  const isExpired = (date: string | null) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  const toggleFeatured = (id: string, currentValue: boolean) => {
    updateMember({ id, is_featured: !currentValue });
  };

  const toggleActive = (id: string, currentValue: boolean) => {
    updateMember({ id, is_active: !currentValue });
  };

  const handleDelete = (id: string, supplierName: string) => {
    if (confirm(`Tem certeza que deseja remover ${supplierName} do Club JoIA?`)) {
      deleteMember(id);
    }
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/club-joia")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Painel Administrativo - Club JoIA</h1>
              <p className="text-muted-foreground">
                Gerencie os membros e benefícios do Club JoIA
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Membros</p>
                <p className="text-2xl font-bold">{totalMembers}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cupons Ativos</p>
                <p className="text-2xl font-bold">{activeMembers.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cupons Expirados</p>
                <p className="text-2xl font-bold">
                  {members.filter((m) => isExpired(m.expiry_date)).length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Members Table */}
        <Card>
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Membros do Club JoIA</h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Benefício</TableHead>
                  <TableHead>Cupom</TableHead>
                  <TableHead>Validade</TableHead>
                  <TableHead>Destaque</TableHead>
                  <TableHead>Ativo</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{member.supplier?.name}</p>
                        <div className="flex gap-1 mt-1">
                          {member.supplier?.categories.slice(0, 2).map((cat) => (
                            <Badge key={cat} variant="secondary" className="text-xs">
                              {cat}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="text-sm text-muted-foreground truncate">
                        {member.benefit}
                      </p>
                    </TableCell>
                    <TableCell>
                      <code className="px-2 py-1 bg-secondary rounded text-xs font-mono">
                        {member.coupon_code}
                      </code>
                    </TableCell>
                    <TableCell>
                      {member.expiry_date ? (
                        <span
                          className={`text-sm ${
                            isExpired(member.expiry_date)
                              ? "text-destructive"
                              : "text-muted-foreground"
                          }`}
                        >
                          {new Date(member.expiry_date).toLocaleDateString("pt-BR")}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">Sem validade</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={member.is_featured}
                        onCheckedChange={() =>
                          toggleFeatured(member.id, member.is_featured)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={member.is_active}
                        onCheckedChange={() => toggleActive(member.id, member.is_active)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleDelete(member.id, member.supplier?.name || "")
                        }
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}
