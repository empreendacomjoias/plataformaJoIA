import { useState } from "react";
import { Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { SupplierCategory } from "@/types/supplier";

const allCategories: SupplierCategory[] = [
  "Personalizado",
  "Masculino",
  "Pedras Naturais",
  "Pandora",
  "Tiffany",
  "Vivara",
];

export default function AddSupplier() {
  const [selectedCategories, setSelectedCategories] = useState<SupplierCategory[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    region: "",
    minOrder: "",
    instagram: "",
  });

  const toggleCategory = (category: SupplierCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.type || !formData.region || !formData.minOrder || !formData.instagram) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    if (selectedCategories.length === 0) {
      toast.error("Selecione pelo menos uma categoria");
      return;
    }

    toast.success(`✨ Fornecedor ${formData.name} adicionado com sucesso!`);
    
    // Reset form
    setFormData({
      name: "",
      type: "",
      region: "",
      minOrder: "",
      instagram: "",
    });
    setSelectedCategories([]);
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Plus className="w-8 h-8 text-accent drop-shadow-[0_0_10px_rgba(167,139,250,0.6)]" />
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Adicionar Fornecedor
          </h1>
          <p className="text-muted-foreground">
            Cadastre novos fornecedores manualmente ou importe via planilha
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Manual Form */}
        <Card className="p-6 border-border/50 shadow-lg animate-slide-in">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Cadastro Manual
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nome do Fornecedor *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Cy Pratas"
                className="bg-background/50"
              />
            </div>

            <div>
              <Label htmlFor="type">Tipo *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fabricante">Fabricante 🏭</SelectItem>
                  <SelectItem value="Atacadista">Atacadista 🛍️</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="region">Região (Estado) *</Label>
              <Input
                id="region"
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value.toUpperCase() })}
                placeholder="Ex: SP"
                maxLength={2}
                className="bg-background/50"
              />
            </div>

            <div>
              <Label htmlFor="minOrder">Pedido Mínimo (R$) *</Label>
              <Input
                id="minOrder"
                type="number"
                value={formData.minOrder}
                onChange={(e) => setFormData({ ...formData, minOrder: e.target.value })}
                placeholder="Ex: 500"
                className="bg-background/50"
              />
            </div>

            <div>
              <Label htmlFor="instagram">Instagram *</Label>
              <Input
                id="instagram"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                placeholder="Ex: @pratas_cy"
                className="bg-background/50"
              />
            </div>

            <div>
              <Label>Categorias *</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {allCategories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategories.includes(category) ? "default" : "outline"}
                    className="cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => toggleCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg">
              <Plus className="w-4 h-4 mr-2" />
              Salvar Fornecedor
            </Button>
          </form>
        </Card>

        {/* Import */}
        <Card className="p-6 border-border/50 shadow-lg animate-slide-in">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            Importar Planilha
          </h2>

          <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-border/50 rounded-lg hover:border-primary/50 transition-colors cursor-pointer bg-background/30">
            <Upload className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-center text-muted-foreground mb-2">
              Arraste e solte sua planilha aqui
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              ou clique para selecionar
            </p>
            <Button variant="outline">
              Selecionar Arquivo
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              Formatos aceitos: .xlsx, .csv
            </p>
          </div>

          <div className="mt-6 p-4 bg-accent/10 border border-accent/30 rounded-lg">
            <p className="text-sm font-medium mb-2">📋 Formato da planilha:</p>
            <p className="text-xs text-muted-foreground">
              Nome | Tipo | Região | Pedido Mínimo | Instagram | Categorias
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
