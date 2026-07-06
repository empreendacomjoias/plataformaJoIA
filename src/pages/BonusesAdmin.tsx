import { useEffect, useState } from "react";
import { Gift, Plus, Pencil, Trash2, FileText, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { useBonuses, useBonusMutations, uploadBonusFile, getSignedBonusUrl, type Bonus } from "@/hooks/useBonuses";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

function CoverThumb({ path }: { path: string | null }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    if (path) getSignedBonusUrl(path).then((u) => alive && setUrl(u));
    return () => {
      alive = false;
    };
  }, [path]);
  if (!url) {
    return (
      <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center">
        <FileText className="w-6 h-6 text-muted-foreground" />
      </div>
    );
  }
  return <img src={url} alt="" className="w-16 h-16 rounded-md object-cover" />;
}

interface FormState {
  title: string;
  description: string;
  is_active: boolean;
  pdf_url: string;
  cover_url: string;
}

const emptyForm: FormState = { title: "", description: "", is_active: true, pdf_url: "", cover_url: "" };

export default function BonusesAdmin() {
  const { data: bonuses, isLoading } = useBonuses();
  const { createBonus, updateBonus, deleteBonus } = useBonusMutations();
  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Bonus | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Bonus | null>(null);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (b: Bonus) => {
    setEditing(b);
    setForm({
      title: b.title,
      description: b.description ?? "",
      is_active: b.is_active,
      pdf_url: b.pdf_url,
      cover_url: b.cover_url ?? "",
    });
    setDialogOpen(true);
  };

  const handlePdfUpload = async (file: File) => {
    if (file.type !== "application/pdf") {
      toast({ title: "Envie um arquivo PDF válido", variant: "destructive" });
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      toast({ title: "PDF deve ter no máximo 25MB", variant: "destructive" });
      return;
    }
    setUploadingPdf(true);
    try {
      const path = await uploadBonusFile(file, "pdf");
      setForm((f) => ({ ...f, pdf_url: path }));
      toast({ title: "PDF enviado!" });
    } catch (e: any) {
      toast({ title: "Erro no upload", description: e.message, variant: "destructive" });
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleCoverUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({ title: "Envie uma imagem válida", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Imagem deve ter no máximo 5MB", variant: "destructive" });
      return;
    }
    setUploadingCover(true);
    try {
      const path = await uploadBonusFile(file, "cover");
      setForm((f) => ({ ...f, cover_url: path }));
      toast({ title: "Imagem enviada!" });
    } catch (e: any) {
      toast({ title: "Erro no upload", description: e.message, variant: "destructive" });
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      toast({ title: "Informe um título", variant: "destructive" });
      return;
    }
    if (!form.pdf_url) {
      toast({ title: "Envie o arquivo PDF", variant: "destructive" });
      return;
    }
    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      pdf_url: form.pdf_url,
      cover_url: form.cover_url || null,
      is_active: form.is_active,
    };
    if (editing) {
      await updateBonus.mutateAsync({ id: editing.id, ...payload });
    } else {
      await createBonus.mutateAsync(payload);
    }
    setDialogOpen(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteBonus.mutateAsync(deleteTarget);
    setDeleteTarget(null);
  };

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center gap-3">
          <Gift className="w-7 h-7 sm:w-8 sm:h-8 text-accent drop-shadow-[0_0_10px_rgba(167,139,250,0.6)]" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Gerenciar Bônus
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Cadastre e organize os materiais em PDF disponíveis para os usuários
            </p>
          </div>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Novo Bônus</span>
        </Button>
      </div>

      <Card className="p-4 sm:p-6 border-border/50 shadow-lg">
        {isLoading ? (
          <p className="text-muted-foreground text-center py-8">Carregando...</p>
        ) : !bonuses || bonuses.length === 0 ? (
          <div className="text-center py-12">
            <Gift className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhum bônus cadastrado ainda.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {bonuses.map((b) => (
              <div
                key={b.id}
                className="flex items-center gap-4 p-3 rounded-lg border border-border/50 hover:bg-secondary/30 transition-colors"
              >
                <CoverThumb path={b.cover_url} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold truncate">{b.title}</h3>
                    <Badge variant={b.is_active ? "default" : "secondary"}>
                      {b.is_active ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                  {b.description && (
                    <p className="text-sm text-muted-foreground line-clamp-1">{b.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Criado em {format(new Date(b.created_at), "dd/MM/yyyy")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(b)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteTarget(b)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Bônus" : "Novo Bônus"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Título</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Ex: Guia completo de fornecedores"
              />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Breve descrição do material..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Arquivo PDF</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => e.target.files?.[0] && handlePdfUpload(e.target.files[0])}
                  disabled={uploadingPdf}
                />
                {uploadingPdf && <Loader2 className="w-4 h-4 animate-spin" />}
              </div>
              {form.pdf_url && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <FileText className="w-3 h-3" /> PDF pronto
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Imagem de capa (opcional)</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleCoverUpload(e.target.files[0])}
                  disabled={uploadingCover}
                />
                {uploadingCover && <Loader2 className="w-4 h-4 animate-spin" />}
              </div>
              {form.cover_url && <CoverThumb path={form.cover_url} />}
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border/50 p-3">
              <div>
                <Label>Bônus ativo</Label>
                <p className="text-xs text-muted-foreground">Aparece para os usuários quando ativo</p>
              </div>
              <Switch
                checked={form.is_active}
                onCheckedChange={(v) => setForm({ ...form, is_active: v })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={createBonus.isPending || updateBonus.isPending}>
              {editing ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover bônus?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O arquivo PDF também será excluído.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
