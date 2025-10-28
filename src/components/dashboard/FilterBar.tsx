import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function FilterBar({ searchQuery, onSearchChange }: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-6 bg-card rounded-lg border border-border/50 shadow-lg animate-slide-in">
      {/* Search */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, @ ou região..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-background/50 border-border/50 focus:border-primary transition-colors"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Select>
          <SelectTrigger className="w-[140px] bg-background/50">
            <SelectValue placeholder="Região" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="sp">São Paulo</SelectItem>
            <SelectItem value="rj">Rio de Janeiro</SelectItem>
            <SelectItem value="mg">Minas Gerais</SelectItem>
            <SelectItem value="pr">Paraná</SelectItem>
            <SelectItem value="go">Goiás</SelectItem>
            <SelectItem value="rs">Rio Grande do Sul</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[140px] bg-background/50">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="fabricante">Fabricante</SelectItem>
            <SelectItem value="atacadista">Atacadista</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[160px] bg-background/50">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Melhor Avaliação</SelectItem>
            <SelectItem value="name">Nome (A-Z)</SelectItem>
            <SelectItem value="minorder">Pedido Mínimo</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="icon" className="shrink-0">
          <Filter className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
