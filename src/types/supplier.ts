export type SupplierType = "Fabricante" | "Atacadista";

export type SupplierCategory = 
  | "Personalizado"
  | "Masculino"
  | "Pedras Naturais"
  | "Pandora"
  | "Tiffany"
  | "Vivara";

export interface Supplier {
  id: string;
  name: string;
  type: SupplierType;
  categories: SupplierCategory[];
  region: string;
  minOrder: number;
  instagram: string;
  rating: number;
  ratingCount: number;
  isFavorite: boolean;
}
