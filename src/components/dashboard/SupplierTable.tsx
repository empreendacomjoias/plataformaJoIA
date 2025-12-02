import { useState } from "react";
import { Supplier } from "@/types/supplier";
import { SupplierRow } from "./SupplierRow";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSuppliers } from "@/hooks/useSuppliers";
import { toast } from "sonner";
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

interface SupplierTableProps {
  suppliers: Supplier[];
  onToggleFavorite: (id: string) => void;
  onRate: (id: string, rating: number) => void;
}

export function SupplierTable({ suppliers, onToggleFavorite, onRate }: SupplierTableProps) {
  const { isAdmin } = useAuth();
  const { deleteSupplier } = useSuppliers();
  const [hideAll, setHideAll] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const allSelected = suppliers.length > 0 && selectedIds.size === suppliers.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < suppliers.length;

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(suppliers.map(s => s.id)));
    }
  };

  const handleSelectOne = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;
    
    setIsDeleting(true);
    let successCount = 0;
    let errorCount = 0;

    for (const id of selectedIds) {
      try {
        await deleteSupplier(id);
        successCount++;
      } catch (error) {
        errorCount++;
      }
    }

    if (successCount > 0) {
      toast.success(`${successCount} fornecedor(es) removido(s)`);
    }
    if (errorCount > 0) {
      toast.error(`${errorCount} erro(s) ao remover`);
    }

    setSelectedIds(new Set());
    setShowDeleteDialog(false);
    setIsDeleting(false);
  };

  return (
    <Card className="overflow-hidden border-border/50 shadow-lg animate-fade-in">
      {isAdmin && (
        <div className="p-4 border-b border-border/50 flex flex-wrap items-center justify-between gap-3 bg-secondary/30">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground">
              Controles de Administrador
            </span>
            {selectedIds.size > 0 && (
              <span className="text-sm text-primary font-medium">
                {selectedIds.size} selecionado(s)
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {selectedIds.size > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
                className="gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Apagar ({selectedIds.size})
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setHideAll(!hideAll)}
              className="gap-2"
            >
              {hideAll ? (
                <>
                  <Eye className="w-4 h-4" />
                  Mostrar Todos
                </>
              ) : (
                <>
                  <EyeOff className="w-4 h-4" />
                  Ocultar Todos
                </>
              )}
            </Button>
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary/50 backdrop-blur-sm border-b border-border">
            <tr>
              {isAdmin && (
                <th className="p-2 sm:p-4 text-left w-10">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Selecionar todos"
                    className={someSelected ? "data-[state=checked]:bg-primary/50" : ""}
                  />
                </th>
              )}
              <th className="p-2 sm:p-4 text-left text-xs sm:text-sm font-semibold text-muted-foreground w-10 sm:w-14">
                ❤️
              </th>
              <th className="p-2 sm:p-4 text-left text-xs sm:text-sm font-semibold text-muted-foreground">
                Nome do Fornecedor
              </th>
              <th className="hidden md:table-cell p-2 sm:p-4 text-left text-xs sm:text-sm font-semibold text-muted-foreground">
                Tipo
              </th>
              <th className="hidden lg:table-cell p-2 sm:p-4 text-left text-xs sm:text-sm font-semibold text-muted-foreground">
                Categorias
              </th>
              <th className="hidden sm:table-cell p-2 sm:p-4 text-left text-xs sm:text-sm font-semibold text-muted-foreground">
                Região
              </th>
              <th className="hidden xl:table-cell p-2 sm:p-4 text-left text-xs sm:text-sm font-semibold text-muted-foreground">
                Pedido Mínimo
              </th>
              <th className="hidden md:table-cell p-2 sm:p-4 text-left text-xs sm:text-sm font-semibold text-muted-foreground">
                Instagram
              </th>
              <th className="p-2 sm:p-4 text-left text-xs sm:text-sm font-semibold text-muted-foreground">
                Avaliação
              </th>
              <th className="p-2 sm:p-4 text-left text-xs sm:text-sm font-semibold text-muted-foreground w-10 sm:w-14">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <SupplierRow
                key={supplier.id}
                supplier={supplier}
                onToggleFavorite={onToggleFavorite}
                onRate={onRate}
                hideAll={hideAll}
                isSelected={selectedIds.has(supplier.id)}
                onSelect={handleSelectOne}
                showCheckbox={isAdmin}
              />
            ))}
          </tbody>
        </table>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover {selectedIds.size} fornecedor(es)? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSelected}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Removendo..." : `Remover ${selectedIds.size}`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
