import { useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Supplier } from "@/types/supplier";
import { SupplierRow } from "./SupplierRow";
import { MobileHint } from "./MobileHint";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, GripVertical, Save } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePreview } from "@/contexts/PreviewContext";
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
  onReorder?: (suppliers: Supplier[]) => void;
  hideAdminControls?: boolean;
  hideAll?: boolean;
}

interface SortableRowProps {
  supplier: Supplier;
  onToggleFavorite: (id: string) => void;
  onRate: (id: string, rating: number) => void;
  hideAll: boolean;
  isSelected: boolean;
  onSelect: (id: string) => void;
  showCheckbox: boolean;
  isDragMode: boolean;
}

function SortableRow({
  supplier,
  onToggleFavorite,
  onRate,
  hideAll,
  isSelected,
  onSelect,
  showCheckbox,
  isDragMode,
}: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: supplier.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 200ms cubic-bezier(0.25, 1, 0.5, 1)',
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 1000 : undefined,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`border-b border-border/50 hover:bg-secondary/30 transition-colors group ${
        isSelected ? "bg-primary/10" : ""
      } ${isDragging ? "bg-secondary/50" : ""}`}
    >
      {isDragMode && (
        <td className="p-2 sm:p-4 w-8">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing touch-none p-1 rounded hover:bg-secondary/50"
          >
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </button>
        </td>
      )}
      <SupplierRow
        supplier={supplier}
        onToggleFavorite={onToggleFavorite}
        onRate={onRate}
        hideAll={hideAll}
        isSelected={isSelected}
        onSelect={onSelect}
        showCheckbox={showCheckbox && !isDragMode}
        asFragment
      />
    </tr>
  );
}

export function SupplierTable({ suppliers, onToggleFavorite, onRate, onReorder, hideAdminControls = false, hideAll = false }: SupplierTableProps) {
  const { isAdmin: realIsAdmin } = useAuth();
  const { previewAsUser } = usePreview();
  const isAdmin = realIsAdmin && !previewAsUser;
  const { deleteSupplier } = useSuppliers();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDragMode, setIsDragMode] = useState(false);
  const [orderedSuppliers, setOrderedSuppliers] = useState<Supplier[]>(suppliers);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Keep orderedSuppliers in sync with suppliers when not in drag mode
  const displayedSuppliers = isDragMode ? orderedSuppliers : suppliers;

  const activeSupplier = activeId ? displayedSuppliers.find(s => s.id === activeId) : null;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setOrderedSuppliers((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    setActiveId(null);
  }, []);

  const handleToggleDragMode = () => {
    if (!isDragMode) {
      // Entering drag mode - sync with current suppliers
      setOrderedSuppliers(suppliers);
    }
    setIsDragMode(!isDragMode);
  };

  const handleSaveOrder = async () => {
    if (onReorder) {
      setIsSaving(true);
      try {
        await onReorder(orderedSuppliers);
        toast.success("Ordem dos fornecedores salva!");
        setIsDragMode(false);
      } catch (error) {
        toast.error("Erro ao salvar ordem");
      } finally {
        setIsSaving(false);
      }
    } else {
      toast.success("Ordem dos fornecedores salva!");
      setIsDragMode(false);
    }
  };

  return (
    <>
      <MobileHint />
      <Card className="overflow-hidden border-border/50 shadow-lg animate-fade-in">
      {isAdmin && !hideAdminControls && (
        <div className="p-4 border-b border-border/50 flex flex-wrap items-center justify-between gap-3 bg-secondary/30">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground">
              Controles de Administrador
            </span>
            {selectedIds.size > 0 && !isDragMode && (
              <span className="text-sm text-primary font-medium">
                {selectedIds.size} selecionado(s)
              </span>
            )}
            {isDragMode && (
              <span className="text-sm text-primary font-medium">
                Arraste para reordenar
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isDragMode ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDragMode(false)}
                  className="gap-2"
                  disabled={isSaving}
                >
                  Cancelar
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSaveOrder}
                  className="gap-2"
                  disabled={isSaving}
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? "Salvando..." : "Salvar Ordem"}
                </Button>
              </>
            ) : (
              <>
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
                  onClick={handleToggleDragMode}
                  className="gap-2"
                >
                  <GripVertical className="w-4 h-4" />
                  Reordenar
                </Button>
              </>
            )}
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <table className="w-full">
            <thead className="bg-secondary/50 backdrop-blur-sm border-b border-border">
              <tr>
                {isDragMode && (
                  <th className="p-2 sm:p-4 text-left w-10">
                    <GripVertical className="w-4 h-4 text-muted-foreground opacity-50" />
                  </th>
                )}
                {isAdmin && !isDragMode && !hideAdminControls && (
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
            <SortableContext
              items={displayedSuppliers.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
              disabled={!isDragMode}
            >
              <tbody>
                {displayedSuppliers.map((supplier) =>
                  isDragMode ? (
                    <SortableRow
                      key={supplier.id}
                      supplier={supplier}
                      onToggleFavorite={onToggleFavorite}
                      onRate={onRate}
                      hideAll={hideAll}
                      isSelected={selectedIds.has(supplier.id)}
                      onSelect={handleSelectOne}
                      showCheckbox={isAdmin && !hideAdminControls}
                      isDragMode={isDragMode}
                    />
                  ) : (
                    <SupplierRow
                      key={supplier.id}
                      supplier={supplier}
                      onToggleFavorite={onToggleFavorite}
                      onRate={onRate}
                      hideAll={hideAll}
                      isSelected={selectedIds.has(supplier.id)}
                      onSelect={handleSelectOne}
                      showCheckbox={isAdmin && !hideAdminControls}
                    />
                  )
                )}
              </tbody>
            </SortableContext>
          </table>
          <DragOverlay>
            {activeSupplier && (
              <div className="bg-card border-2 border-primary rounded-lg shadow-2xl p-4 flex items-center gap-4 min-w-[300px]">
                <GripVertical className="w-5 h-5 text-primary" />
                <div className="flex flex-col">
                  <span className="font-semibold text-foreground">{activeSupplier.name}</span>
                  <span className="text-sm text-muted-foreground">{activeSupplier.region}</span>
                </div>
              </div>
            )}
          </DragOverlay>
        </DndContext>
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
    </>
  );
}
