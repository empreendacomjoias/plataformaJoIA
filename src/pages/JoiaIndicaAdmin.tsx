import { useState } from "react";
import { Plus, Edit, Trash2, Eye, EyeOff, BarChart3, FolderPlus, Upload } from "lucide-react";
import { useRecommendations } from "@/hooks/useRecommendations";
import { useRecommendationCategories } from "@/hooks/useRecommendationCategories";
import { useImageUpload } from "@/hooks/useImageUpload";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function JoiaIndicaAdmin() {
  const { recommendations, createRecommendation, updateRecommendation, deleteRecommendation } = useRecommendations();
  const { categories, createCategory, updateCategory, deleteCategory } = useRecommendationCategories();
  const { uploadImage, uploading } = useImageUpload();
  
  const [showRecommendationDialog, setShowRecommendationDialog] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [editingRecommendation, setEditingRecommendation] = useState<any>(null);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    description: "",
    image_url: "",
    cta_text: "Acessar com o link JoIA",
    affiliate_link: "",
    tags: "",
    is_active: true,
  });

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    color: "#8B5CF6",
  });

  const handleSubmitRecommendation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
      };

      if (editingRecommendation) {
        await updateRecommendation({ id: editingRecommendation.id, ...data });
      } else {
        await createRecommendation(data);
      }

      setShowRecommendationDialog(false);
      resetForm();
    } catch (error) {
      console.error("Error saving recommendation:", error);
    }
  };

  const handleSubmitCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategory({ id: editingCategory.id, ...categoryForm });
      } else {
        await createCategory(categoryForm);
      }

      setShowCategoryDialog(false);
      resetCategoryForm();
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleEditRecommendation = (rec: any) => {
    setEditingRecommendation(rec);
    setFormData({
      name: rec.name,
      category_id: rec.category_id,
      description: rec.description,
      image_url: rec.image_url || "",
      cta_text: rec.cta_text,
      affiliate_link: rec.affiliate_link,
      tags: rec.tags?.join(", ") || "",
      is_active: rec.is_active,
    });
    setShowRecommendationDialog(true);
  };

  const handleEditCategory = (cat: any) => {
    setEditingCategory(cat);
    setCategoryForm({
      name: cat.name,
      color: cat.color,
    });
    setShowCategoryDialog(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = await uploadImage(file);
    if (imageUrl) {
      setFormData({ ...formData, image_url: imageUrl });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category_id: "",
      description: "",
      image_url: "",
      cta_text: "Acessar com o link JoIA",
      affiliate_link: "",
      tags: "",
      is_active: true,
    });
    setEditingRecommendation(null);
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      name: "",
      color: "#8B5CF6",
    });
    setEditingCategory(null);
  };

  const toggleActive = async (rec: any) => {
    await updateRecommendation({
      ...rec,
      is_active: !rec.is_active,
    });
  };

  // Calculate analytics
  const totalClicks = recommendations.reduce((sum, rec) => sum + rec.click_count, 0);
  const categoryClicks = categories.map(cat => ({
    name: cat.name,
    color: cat.color,
    clicks: recommendations
      .filter(rec => rec.category_id === cat.id)
      .reduce((sum, rec) => sum + rec.click_count, 0),
  })).sort((a, b) => b.clicks - a.clicks);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gerenciar JoIA Indica</h1>
        <div className="flex gap-2">
          <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={resetCategoryForm}>
                <FolderPlus className="w-4 h-4 mr-2" />
                Gerenciar Categorias
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? "Editar Categoria" : "Nova Categoria"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmitCategory} className="space-y-4">
                <div>
                  <Label htmlFor="cat-name">Nome da Categoria</Label>
                  <Input
                    id="cat-name"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cat-color">Cor</Label>
                  <div className="flex gap-2">
                    <Input
                      id="cat-color"
                      type="color"
                      value={categoryForm.color}
                      onChange={(e) => setCategoryForm({...categoryForm, color: e.target.value})}
                      className="w-20"
                    />
                    <Input
                      value={categoryForm.color}
                      onChange={(e) => setCategoryForm({...categoryForm, color: e.target.value})}
                      placeholder="#8B5CF6"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  {editingCategory ? "Atualizar" : "Criar"} Categoria
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={showRecommendationDialog} onOpenChange={setShowRecommendationDialog}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Nova Indicação
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingRecommendation ? "Editar Indicação" : "Nova Indicação"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmitRecommendation} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Categoria *</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => setFormData({...formData, category_id: value})}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Descrição (máx. 150 caracteres) *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    maxLength={150}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.description.length}/150
                  </p>
                </div>

                <div className="space-y-3">
                  <Label>Imagem/Logo</Label>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Input
                        id="image-file"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("image-file")?.click()}
                        disabled={uploading}
                        className="w-full"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {uploading ? "Enviando..." : "Enviar do Computador"}
                      </Button>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <span className="text-muted-foreground text-sm">ou</span>
                      </div>
                      <Input
                        id="image_url"
                        type="url"
                        value={formData.image_url}
                        onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                        placeholder="Cole uma URL da imagem"
                        className="pl-12"
                      />
                    </div>
                  </div>
                  
                  {formData.image_url && (
                    <div className="mt-2">
                      <img 
                        src={formData.image_url} 
                        alt="Preview" 
                        className="w-32 h-32 object-cover rounded border"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="cta_text">Texto do Botão CTA *</Label>
                  <Input
                    id="cta_text"
                    value={formData.cta_text}
                    onChange={(e) => setFormData({...formData, cta_text: e.target.value})}
                    placeholder="Ex: Acessar com o link JoIA"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="affiliate_link">Link de Afiliado *</Label>
                  <Input
                    id="affiliate_link"
                    type="url"
                    value={formData.affiliate_link}
                    onChange={(e) => setFormData({...formData, affiliate_link: e.target.value})}
                    placeholder="https://..."
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    placeholder="automação, pagamento, branding"
                  />
                </div>

                <Button type="submit" className="w-full">
                  {editingRecommendation ? "Atualizar" : "Criar"} Indicação
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="recommendations" className="space-y-6">
        <TabsList>
          <TabsTrigger value="recommendations">Indicações</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="w-4 h-4 mr-2" />
            Desempenho
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Cliques</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recommendations.map((rec) => (
                  <TableRow key={rec.id}>
                    <TableCell className="font-medium">{rec.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        style={{
                          backgroundColor: `${rec.category?.color}20`,
                          borderColor: `${rec.category?.color}50`,
                          color: rec.category?.color,
                        }}
                      >
                        {rec.category?.name}
                      </Badge>
                    </TableCell>
                    <TableCell>{rec.click_count}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleActive(rec)}
                      >
                        {rec.is_active ? (
                          <><Eye className="w-4 h-4 mr-1" /> Visível</>
                        ) : (
                          <><EyeOff className="w-4 h-4 mr-1" /> Oculto</>
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditRecommendation(rec)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (confirm("Tem certeza que deseja excluir esta indicação?")) {
                              deleteRecommendation(rec.id);
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="p-4 border rounded-lg flex items-center justify-between"
                  style={{ borderColor: cat.color }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="font-medium">{cat.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditCategory(cat)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm("Tem certeza que deseja excluir esta categoria?")) {
                          deleteCategory(cat.id);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Resumo Geral</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-muted-foreground text-sm">Total de Indicações</p>
                  <p className="text-3xl font-bold">{recommendations.length}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Indicações Ativas</p>
                  <p className="text-3xl font-bold">
                    {recommendations.filter(r => r.is_active).length}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Total de Cliques</p>
                  <p className="text-3xl font-bold">{totalClicks}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Cliques por Categoria</h3>
              <div className="space-y-4">
                {categoryClicks.map((cat) => (
                  <div key={cat.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{cat.name}</span>
                      <span className="text-muted-foreground">{cat.clicks} cliques</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${totalClicks > 0 ? (cat.clicks / totalClicks) * 100 : 0}%`,
                          backgroundColor: cat.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Top 10 Indicações Mais Clicadas</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Posição</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-right">Cliques</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recommendations
                    .sort((a, b) => b.click_count - a.click_count)
                    .slice(0, 10)
                    .map((rec, index) => (
                      <TableRow key={rec.id}>
                        <TableCell>{index + 1}º</TableCell>
                        <TableCell className="font-medium">{rec.name}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            style={{
                              backgroundColor: `${rec.category?.color}20`,
                              borderColor: `${rec.category?.color}50`,
                              color: rec.category?.color,
                            }}
                          >
                            {rec.category?.name}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {rec.click_count}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
