import { useState } from "react";
import { Plus, Upload, X, FileSpreadsheet, CheckCircle2, AlertCircle } from "lucide-react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useCategories } from "@/hooks/useCategories";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import * as XLSX from "xlsx";

interface ImportedSupplier {
  name: string;
  type: string;
  region: string;
  minOrder: number;
  instagram: string;
  categories: string[];
  valid: boolean;
  errors: string[];
}

// Mapeamento inteligente de estados brasileiros
const stateMapping: Record<string, string> = {
  // Nomes completos
  "acre": "AC", "alagoas": "AL", "amapa": "AP", "amapá": "AP", "amazonas": "AM",
  "bahia": "BA", "ceara": "CE", "ceará": "CE", "distrito federal": "DF", "brasilia": "DF", "brasília": "DF",
  "espirito santo": "ES", "espírito santo": "ES", "goias": "GO", "goiás": "GO",
  "maranhao": "MA", "maranhão": "MA", "mato grosso": "MT", "mato grosso do sul": "MS",
  "minas gerais": "MG", "minas": "MG", "para": "PA", "pará": "PA", "paraiba": "PB", "paraíba": "PB",
  "parana": "PR", "paraná": "PR", "pernambuco": "PE", "piaui": "PI", "piauí": "PI",
  "rio de janeiro": "RJ", "rio grande do norte": "RN", "rio grande do sul": "RS",
  "rondonia": "RO", "rondônia": "RO", "roraima": "RR", "santa catarina": "SC",
  "sao paulo": "SP", "são paulo": "SP", "sergipe": "SE", "tocantins": "TO",
  // Abreviações comuns
  "ac": "AC", "al": "AL", "ap": "AP", "am": "AM", "ba": "BA", "ce": "CE", "df": "DF",
  "es": "ES", "go": "GO", "ma": "MA", "mt": "MT", "ms": "MS", "mg": "MG", "pa": "PA",
  "pb": "PB", "pr": "PR", "pe": "PE", "pi": "PI", "rj": "RJ", "rn": "RN", "rs": "RS",
  "ro": "RO", "rr": "RR", "sc": "SC", "sp": "SP", "se": "SE", "to": "TO",
  // Variações comuns
  "rio": "RJ", "sampa": "SP", "bh": "MG", "poa": "RS", "ctba": "PR", "curitiba": "PR",
  "belo horizonte": "MG", "porto alegre": "RS", "salvador": "BA", "recife": "PE",
  "fortaleza": "CE", "manaus": "AM", "floripa": "SC", "florianópolis": "SC", "florianopolis": "SC",
};

// Mapeamento inteligente de tipos
const typeMapping: Record<string, string> = {
  "fabricante": "Fabricante", "fab": "Fabricante", "fabrica": "Fabricante", "fábrica": "Fabricante",
  "factory": "Fabricante", "manufacturer": "Fabricante", "industria": "Fabricante", "indústria": "Fabricante",
  "atacadista": "Atacadista", "atac": "Atacadista", "atacado": "Atacadista", "wholesale": "Atacadista",
  "distribuidor": "Atacadista", "distribuidora": "Atacadista", "revenda": "Atacadista", "revendedor": "Atacadista",
};

// Função para normalizar região
const normalizeRegion = (input: string): string => {
  const cleaned = input.toLowerCase().trim();
  
  // Verifica mapeamento direto
  if (stateMapping[cleaned]) {
    return stateMapping[cleaned];
  }
  
  // Tenta encontrar correspondência parcial
  for (const [key, value] of Object.entries(stateMapping)) {
    if (cleaned.includes(key) || key.includes(cleaned)) {
      return value;
    }
  }
  
  // Se já tem 2 caracteres, assume que é a sigla
  if (cleaned.length === 2) {
    return cleaned.toUpperCase();
  }
  
  return input.toUpperCase().substring(0, 2);
};

// Função para normalizar tipo
const normalizeType = (input: string): string => {
  const cleaned = input.toLowerCase().trim();
  
  if (typeMapping[cleaned]) {
    return typeMapping[cleaned];
  }
  
  // Busca parcial
  for (const [key, value] of Object.entries(typeMapping)) {
    if (cleaned.includes(key) || key.includes(cleaned)) {
      return value;
    }
  }
  
  // Heurística: palavras que sugerem fabricante ou atacadista
  if (cleaned.match(/fab|indus|produ|manufat/)) return "Fabricante";
  if (cleaned.match(/atac|dist|revend|wholes/)) return "Atacadista";
  
  return input;
};

// Função para normalizar Instagram
const normalizeInstagram = (input: string): string => {
  let cleaned = input.trim();
  
  // Remove URLs completas do Instagram
  cleaned = cleaned.replace(/^https?:\/\/(www\.)?instagram\.com\//, "");
  cleaned = cleaned.replace(/\/$/, "");
  
  // Remove @ se presente no início
  if (cleaned.startsWith("@")) {
    cleaned = cleaned.substring(1);
  }
  
  // Remove espaços e caracteres inválidos
  cleaned = cleaned.replace(/\s+/g, "").toLowerCase();
  
  // Adiciona @ no início
  return `@${cleaned}`;
};

// Função para extrair número
const extractNumber = (input: any): number => {
  if (typeof input === "number") return input;
  
  const str = String(input);
  // Remove símbolos de moeda, espaços e extrai números
  const cleaned = str.replace(/[R$\s.]/g, "").replace(",", ".");
  const num = parseFloat(cleaned);
  
  return isNaN(num) ? 0 : num;
};

// Função para normalizar categorias
const normalizeCategories = (input: any): string[] => {
  if (!input) return [];
  
  const str = String(input);
  // Separa por vírgula, ponto e vírgula, ou pipe
  return str
    .split(/[,;|]/)
    .map(c => c.trim())
    .filter(Boolean)
    .map(c => c.charAt(0).toUpperCase() + c.slice(1).toLowerCase()); // Capitaliza
};

export default function AddSupplier() {
  const { categories, createCategory, isCreating, deleteCategory, isDeleting } = useCategories();
  const queryClient = useQueryClient();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [importedData, setImportedData] = useState<ImportedSupplier[]>([]);
  const [showImportPreview, setShowImportPreview] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    region: "",
    minOrder: "",
    instagram: "",
  });

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) {
      toast.error("Digite um nome para a categoria");
      return;
    }
    
    createCategory(newCategoryName, {
      onSuccess: () => {
        setNewCategoryName("");
        setShowCategoryDialog(false);
      },
    });
  };

  const handleDeleteCategory = (categoryName: string) => {
    if (confirm(`Tem certeza que deseja remover a categoria "${categoryName}"?`)) {
      deleteCategory(categoryName);
      setSelectedCategories(prev => prev.filter(c => c !== categoryName));
    }
  };

  const validateSupplier = (row: any): ImportedSupplier => {
    const errors: string[] = [];
    
    // Busca flexível de colunas (aceita variações de nome)
    const findValue = (keys: string[]) => {
      for (const key of keys) {
        const found = Object.keys(row).find(k => 
          k.toLowerCase().replace(/[_\s-]/g, "") === key.toLowerCase().replace(/[_\s-]/g, "")
        );
        if (found && row[found]) return row[found];
      }
      return "";
    };
    
    const name = String(findValue(["Nome", "name", "fornecedor", "supplier", "empresa", "company"]) || "").trim();
    
    const typeRaw = String(findValue(["Tipo", "type", "categoria_tipo", "segmento"]) || "").trim();
    const type = normalizeType(typeRaw);
    
    const regionRaw = String(findValue(["Região", "Regiao", "Estado", "region", "state", "uf", "localização", "local"]) || "").trim();
    const region = normalizeRegion(regionRaw);
    
    const minOrderRaw = findValue(["Pedido Mínimo", "Pedido Minimo", "minOrder", "min_order", "minimo", "mínimo", "pedido_min", "valor_minimo"]);
    const minOrder = extractNumber(minOrderRaw);
    
    const instagramRaw = String(findValue(["Instagram", "instagram", "insta", "ig", "rede_social", "social"]) || "").trim();
    const instagram = instagramRaw ? normalizeInstagram(instagramRaw) : "";
    
    const categoriesRaw = findValue(["Categorias", "categories", "categoria", "category", "tags", "produtos", "products"]);
    const categoriesList = normalizeCategories(categoriesRaw);

    // Validação mais flexível com mensagens claras
    if (!name) errors.push("Nome é obrigatório");
    if (!type || (type !== "Fabricante" && type !== "Atacadista")) {
      errors.push(`Tipo "${typeRaw}" não reconhecido`);
    }
    if (!region || region.length !== 2) errors.push(`Região "${regionRaw}" não reconhecida`);
    if (minOrder <= 0) errors.push("Pedido mínimo inválido");
    if (!instagram || instagram === "@") errors.push("Instagram é obrigatório");
    if (categoriesList.length === 0) errors.push("Pelo menos uma categoria é necessária");

    return {
      name,
      type: type || typeRaw,
      region: region || regionRaw.toUpperCase().substring(0, 2),
      minOrder,
      instagram,
      categories: categoriesList,
      valid: errors.length === 0,
      errors,
    };
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ];
    
    if (!validTypes.includes(file.type) && !file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
      toast.error("Formato de arquivo inválido. Use .xlsx ou .csv");
      return;
    }

    setUploading(true);
    toast.info("Processando arquivo...");

    try {
      const data = await file.arrayBuffer();
      console.log("📄 Arquivo lido, processando...");
      
      const workbook = XLSX.read(data, { type: "array" });
      console.log("📊 Planilhas encontradas:", workbook.SheetNames);
      
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      console.log("📋 Linhas encontradas:", jsonData.length);
      
      if (jsonData.length === 0) {
        toast.error("A planilha está vazia ou não foi possível ler os dados");
        setUploading(false);
        return;
      }

      // Log das colunas detectadas para debug
      const firstRow = jsonData[0] as Record<string, any>;
      const columns = Object.keys(firstRow);
      console.log("📝 Colunas detectadas:", columns);
      console.log("📝 Primeira linha:", firstRow);

      const validated = jsonData.map((row, idx) => {
        console.log(`Row ${idx + 1}:`, row);
        return validateSupplier(row);
      });
      
      setImportedData(validated);
      setShowImportPreview(true);
      
      const validCount = validated.filter(s => s.valid).length;
      const invalidCount = validated.filter(s => !s.valid).length;
      
      console.log(`✅ Válidos: ${validCount}, ❌ Inválidos: ${invalidCount}`);
      
      if (invalidCount > 0) {
        toast.warning(`${validCount} válidos, ${invalidCount} com erros`);
      } else {
        toast.success(`${validCount} fornecedores prontos para importar`);
      }
    } catch (error: any) {
      console.error("❌ Erro ao processar arquivo:", error);
      toast.error(`Erro ao processar arquivo: ${error.message || "Verifique o formato"}`);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleImportConfirm = async () => {
    const validSuppliers = importedData.filter(s => s.valid);
    if (validSuppliers.length === 0) {
      toast.error("Nenhum fornecedor válido para importar");
      return;
    }

    setSubmitting(true);
    let successCount = 0;
    let errorCount = 0;

    for (const supplier of validSuppliers) {
      try {
        // Insert supplier
        const { data: supplierData, error: supplierError } = await supabase
          .from("suppliers")
          .insert({
            name: supplier.name,
            type: supplier.type,
            region: supplier.region,
            min_order: supplier.minOrder,
            instagram: supplier.instagram,
          })
          .select()
          .single();

        if (supplierError) throw supplierError;

        // Create categories that don't exist
        for (const catName of supplier.categories) {
          if (!categories.includes(catName)) {
            await supabase.from("categories").insert({ name: catName }).single();
          }
        }

        // Get category IDs
        const { data: categoryData, error: categoryError } = await supabase
          .from("categories")
          .select("id, name")
          .in("name", supplier.categories);

        if (categoryError) throw categoryError;

        // Insert supplier-category relations
        if (categoryData && categoryData.length > 0) {
          const relations = categoryData.map((cat) => ({
            supplier_id: supplierData.id,
            category_id: cat.id,
          }));

          await supabase.from("supplier_categories").insert(relations);
        }

        successCount++;
      } catch (error) {
        console.error(`Error importing ${supplier.name}:`, error);
        errorCount++;
      }
    }

    queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    queryClient.invalidateQueries({ queryKey: ["categories"] });

    if (successCount > 0) {
      toast.success(`✨ ${successCount} fornecedor(es) importado(s) com sucesso!`);
    }
    if (errorCount > 0) {
      toast.error(`${errorCount} fornecedor(es) falharam na importação`);
    }

    setImportedData([]);
    setShowImportPreview(false);
    setSubmitting(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      const { data: supplierData, error: supplierError } = await supabase
        .from("suppliers")
        .insert({
          name: formData.name,
          type: formData.type,
          region: formData.region,
          min_order: parseFloat(formData.minOrder),
          instagram: formData.instagram,
        })
        .select()
        .single();

      if (supplierError) throw supplierError;

      const { data: categoryData, error: categoryError } = await supabase
        .from("categories")
        .select("id, name")
        .in("name", selectedCategories);

      if (categoryError) throw categoryError;

      const relations = categoryData.map((cat) => ({
        supplier_id: supplierData.id,
        category_id: cat.id,
      }));

      const { error: relationsError } = await supabase
        .from("supplier_categories")
        .insert(relations);

      if (relationsError) throw relationsError;

      toast.success(`✨ Fornecedor ${formData.name} adicionado com sucesso!`);
      
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });

      setFormData({
        name: "",
        type: "",
        region: "",
        minOrder: "",
        instagram: "",
      });
      setSelectedCategories([]);
    } catch (error: any) {
      toast.error(error.message || "Erro ao adicionar fornecedor");
    } finally {
      setSubmitting(false);
    }
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
              <div className="flex items-center justify-between mb-2">
                <Label>Categorias *</Label>
                <p className="text-xs text-muted-foreground">Clique para selecionar/remover</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <div key={category} className="relative group">
                    <Badge
                      variant={selectedCategories.includes(category) ? "default" : "outline"}
                      className="cursor-pointer hover:scale-105 transition-transform pr-7"
                      onClick={() => toggleCategory(category)}
                    >
                      {category}
                    </Badge>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCategory(category);
                      }}
                      disabled={isDeleting}
                      className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                      title="Remover categoria"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
                  <DialogTrigger asChild>
                    <Badge
                      variant="outline"
                      className="cursor-pointer hover:scale-105 transition-transform border-dashed"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Nova Categoria
                    </Badge>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-border">
                    <DialogHeader>
                      <DialogTitle>Criar Nova Categoria</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label htmlFor="categoryName">Nome da Categoria</Label>
                        <Input
                          id="categoryName"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="Ex: Folheados"
                          maxLength={50}
                        />
                      </div>
                      <Button 
                        onClick={handleCreateCategory} 
                        disabled={isCreating || !newCategoryName.trim()}
                        className="w-full"
                      >
                        {isCreating ? "Criando..." : "Criar Categoria"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={submitting}>
              <Plus className="w-4 h-4 mr-2" />
              {submitting ? "Salvando..." : "Salvar Fornecedor"}
            </Button>
          </form>
        </Card>

        {/* Import */}
        <Card className="p-6 border-border/50 shadow-lg animate-slide-in">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            Importar Planilha
          </h2>

          {!showImportPreview ? (
            <>
              <input
                type="file"
                id="file-upload"
                accept=".xlsx,.csv"
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading}
              />

              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-border/50 rounded-lg hover:border-primary/50 transition-colors cursor-pointer bg-background/30"
              >
                <Upload className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-center text-muted-foreground mb-2">
                  {uploading ? "Processando..." : "Arraste e solte sua planilha aqui"}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  ou clique para selecionar
                </p>
                <span className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 pointer-events-none">
                  {uploading ? "Carregando..." : "Selecionar Arquivo"}
                </span>
                <p className="text-xs text-muted-foreground mt-4">
                  Formatos aceitos: .xlsx, .csv
                </p>
              </label>

              <div className="mt-6 p-4 bg-accent/10 border border-accent/30 rounded-lg">
                <p className="text-sm font-medium mb-2">📋 Formato da planilha:</p>
                <p className="text-xs text-muted-foreground mb-2">
                  Colunas esperadas (cabeçalho):
                </p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">Nome</Badge>
                  <Badge variant="outline" className="text-xs">Tipo</Badge>
                  <Badge variant="outline" className="text-xs">Região</Badge>
                  <Badge variant="outline" className="text-xs">Pedido Mínimo</Badge>
                  <Badge variant="outline" className="text-xs">Instagram</Badge>
                  <Badge variant="outline" className="text-xs">Categorias</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  💡 Tipo: "Fabricante" ou "Atacadista" | Categorias separadas por vírgula
                </p>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-primary" />
                  <span className="font-medium">{importedData.length} fornecedor(es) encontrado(s)</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setImportedData([]);
                    setShowImportPreview(false);
                  }}
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancelar
                </Button>
              </div>

              <div className="max-h-[300px] overflow-y-auto space-y-2">
                {importedData.map((supplier, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border ${
                      supplier.valid
                        ? "bg-green-500/10 border-green-500/30"
                        : "bg-red-500/10 border-red-500/30"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {supplier.valid ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{supplier.name || "Sem nome"}</p>
                        <p className="text-xs text-muted-foreground">
                          {supplier.type} • {supplier.region} • R$ {supplier.minOrder}
                        </p>
                        {supplier.categories.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {supplier.categories.map((cat) => (
                              <Badge key={cat} variant="outline" className="text-xs py-0">
                                {cat}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {!supplier.valid && (
                          <p className="text-xs text-red-400 mt-1">
                            {supplier.errors.join(", ")}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setImportedData([]);
                    setShowImportPreview(false);
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleImportConfirm}
                  disabled={submitting || importedData.filter(s => s.valid).length === 0}
                >
                  {submitting ? "Importando..." : `Importar ${importedData.filter(s => s.valid).length} válido(s)`}
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
