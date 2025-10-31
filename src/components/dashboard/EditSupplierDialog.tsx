import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Supplier } from "@/types/supplier";
import { useCategories } from "@/hooks/useCategories";
import { useSuppliers } from "@/hooks/useSuppliers";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";

interface EditSupplierDialogProps {
  supplier: Supplier | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditSupplierDialog({ supplier, open, onOpenChange }: EditSupplierDialogProps) {
  const { categories } = useCategories();
  const { updateSupplier } = useSuppliers();
  const [submitting, setSubmitting] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    region: "",
    minOrder: "",
    instagram: "",
  });

  // Load supplier data when dialog opens
  useEffect(() => {
    if (supplier && open) {
      setFormData({
        name: supplier.name,
        type: supplier.type,
        region: supplier.region,
        minOrder: supplier.minOrder.toString(),
        instagram: supplier.instagram,
      });
      setSelectedCategories(supplier.categories);
    }
  }, [supplier, open]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!supplier) return;

    if (!formData.name || !formData.type || !formData.region || !formData.minOrder || !formData.instagram) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    if (selectedCategories.length === 0) {
      toast.error("Selecione pelo menos uma categoria");
      return;
    }

    setSubmitting(true);

    try {
      await updateSupplier({
        id: supplier.id,
        name: formData.name,
        type: formData.type as "Fabricante" | "Atacadista",
        region: formData.region,
        minOrder: parseFloat(formData.minOrder),
        instagram: formData.instagram,
        categories: selectedCategories,
      });

      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar fornecedor");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Fornecedor</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div>
            <Label htmlFor="edit-name">Nome do Fornecedor *</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Cy Pratas"
              className="bg-background/50"
            />
          </div>

          <div>
            <Label htmlFor="edit-type">Tipo *</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="Fabricante">Fabricante 🏭</SelectItem>
                <SelectItem value="Atacadista">Atacadista 🛍️</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="edit-region">Região (Estado) *</Label>
            <Input
              id="edit-region"
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value.toUpperCase() })}
              placeholder="Ex: SP"
              maxLength={2}
              className="bg-background/50"
            />
          </div>

          <div>
            <Label htmlFor="edit-minOrder">Pedido Mínimo (R$) *</Label>
            <Input
              id="edit-minOrder"
              type="number"
              value={formData.minOrder}
              onChange={(e) => setFormData({ ...formData, minOrder: e.target.value })}
              placeholder="Ex: 500"
              className="bg-background/50"
            />
          </div>

          <div>
            <Label htmlFor="edit-instagram">Instagram *</Label>
            <Input
              id="edit-instagram"
              value={formData.instagram}
              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              placeholder="Ex: @pratas_cy"
              className="bg-background/50"
            />
          </div>

          <div>
            <Label>Categorias *</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategories.includes(category) ? "default" : "outline"}
                  className="cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => toggleCategory(category)}
                >
                  {category}
                  {selectedCategories.includes(category) && (
                    <X className="w-3 h-3 ml-1" />
                  )}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Clique nas categorias para selecionar/desselecionar
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={submitting}>
              {submitting ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
