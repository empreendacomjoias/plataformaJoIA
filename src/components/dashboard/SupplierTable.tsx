import { Supplier } from "@/types/supplier";
import { SupplierRow } from "./SupplierRow";
import { Card } from "@/components/ui/card";

interface SupplierTableProps {
  suppliers: Supplier[];
  onToggleFavorite: (id: string) => void;
  onRate: (id: string, rating: number) => void;
}

export function SupplierTable({ suppliers, onToggleFavorite, onRate }: SupplierTableProps) {
  return (
    <Card className="overflow-hidden border-border/50 shadow-lg animate-fade-in">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary/50 backdrop-blur-sm border-b border-border">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-muted-foreground w-14">
                ❤️
              </th>
              <th className="p-4 text-left text-sm font-semibold text-muted-foreground">
                Nome do Fornecedor
              </th>
              <th className="p-4 text-left text-sm font-semibold text-muted-foreground">
                Tipo
              </th>
              <th className="p-4 text-left text-sm font-semibold text-muted-foreground">
                Categorias
              </th>
              <th className="p-4 text-left text-sm font-semibold text-muted-foreground">
                Região
              </th>
              <th className="p-4 text-left text-sm font-semibold text-muted-foreground">
                Pedido Mínimo
              </th>
              <th className="p-4 text-left text-sm font-semibold text-muted-foreground">
                Instagram
              </th>
              <th className="p-4 text-left text-sm font-semibold text-muted-foreground">
                Avaliação
              </th>
              <th className="p-4 text-left text-sm font-semibold text-muted-foreground w-14">
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
              />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
