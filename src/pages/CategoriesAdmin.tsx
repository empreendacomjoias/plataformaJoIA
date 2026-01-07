import { useState } from "react";
import { useCategoriesWithColors } from "@/hooks/useCategoriesWithColors";
import { Category } from "@/types/category";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Palette, Loader2 } from "lucide-react";

const COLOR_PRESETS = [
  "#EF4444", // red
  "#F97316", // orange
  "#F59E0B", // amber
  "#84CC16", // lime
  "#10B981", // emerald
  "#14B8A6", // teal
  "#06B6D4", // cyan
  "#3B82F6", // blue
  "#6366F1", // indigo
  "#8B5CF6", // violet
  "#A855F7", // purple
  "#EC4899", // pink
  "#F43F5E", // rose
];

export default function CategoriesAdmin() {
  const { categories, isLoading, createCategory, updateCategory, deleteCategory, isCreating, isUpdating } = useCategoriesWithColors();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: "", color: "#8B5CF6" });

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData({ name: "", color: "#8B5CF6" });
    setDialogOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, color: category.color });
    setDialogOpen(true);
  };

  const handleOpenDelete = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) return;

    if (editingCategory) {
      await updateCategory({ id: editingCategory.id, ...formData });
    } else {
      await createCategory(formData);
    }
    setDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete.id);
    }
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Palette className="w-7 h-7 text-primary" />
            Gerenciar Categorias
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as categorias e suas cores para os fornecedores
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          Nova Categoria
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((category) => (
          <Card key={category.id} className="group relative overflow-hidden">
            <div 
              className="absolute top-0 left-0 right-0 h-2"
              style={{ backgroundColor: category.color }}
            />
            <CardHeader className="pt-6 pb-2">
              <CardTitle className="flex items-center justify-between">
                <span className="truncate">{category.name}</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleOpenEdit(category)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleOpenDelete(category)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full border-2 border-border"
                  style={{ backgroundColor: category.color }}
                />
                <Badge
                  variant="outline"
                  style={{
                    backgroundColor: `${category.color}20`,
                    borderColor: `${category.color}50`,
                    color: category.color,
                  }}
                >
                  Preview
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {categories.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Nenhuma categoria cadastrada</p>
          <Button onClick={handleOpenCreate} variant="link" className="mt-2">
            Criar primeira categoria
          </Button>
        </Card>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Editar Categoria" : "Nova Categoria"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nome da categoria"
              />
            </div>

            <div className="space-y-2">
              <Label>Cor</Label>
              <div className="flex flex-wrap gap-2">
                {COLOR_PRESETS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      formData.color === color
                        ? "border-foreground scale-110"
                        : "border-transparent hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setFormData({ ...formData, color })}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Label htmlFor="custom-color" className="text-sm text-muted-foreground">
                  Cor personalizada:
                </Label>
                <Input
                  id="custom-color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-12 h-8 p-1 cursor-pointer"
                />
                <Input
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-24 font-mono text-sm"
                  placeholder="#000000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Preview</Label>
              <Badge
                variant="outline"
                style={{
                  backgroundColor: `${formData.color}20`,
                  borderColor: `${formData.color}50`,
                  color: formData.color,
                }}
                className="text-sm"
              >
                {formData.name || "Nome da Categoria"}
              </Badge>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!formData.name.trim() || isCreating || isUpdating}
            >
              {(isCreating || isUpdating) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editingCategory ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Categoria</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a categoria "{categoryToDelete?.name}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
