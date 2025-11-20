import { Supplier } from "@/types/supplier";
import { SupplierRow } from "./SupplierRow";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface SupplierTableProps {
  suppliers: Supplier[];
  onToggleFavorite: (id: string) => void;
  onRate: (id: string, rating: number) => void;
}

export function SupplierTable({ suppliers, onToggleFavorite, onRate }: SupplierTableProps) {
  const { isAdmin } = useAuth();
  const [hideAll, setHideAll] = useState(false);
  return (
    <Card className="overflow-hidden border-border/50 shadow-lg animate-fade-in">
      {isAdmin && (
        <div className="p-4 border-b border-border/50 flex items-center justify-between bg-secondary/30">
          <span className="text-sm font-medium text-muted-foreground">
            Controles de Privacidade
          </span>
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
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary/50 backdrop-blur-sm border-b border-border">
            <tr>
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
              />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
