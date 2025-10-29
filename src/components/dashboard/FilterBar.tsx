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
  regionFilter: string;
  onRegionChange: (value: string) => void;
  typeFilter: string;
  onTypeChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
}

export function FilterBar({ 
  searchQuery, 
  onSearchChange,
  regionFilter,
  onRegionChange,
  typeFilter,
  onTypeChange,
  sortBy,
  onSortChange
}: FilterBarProps) {
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
        <Select value={regionFilter} onValueChange={onRegionChange}>
          <SelectTrigger className="w-[140px] bg-background/50">
            <SelectValue placeholder="Região" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="">Todas</SelectItem>
            <SelectItem value="Sul">Sul</SelectItem>
            <SelectItem value="Sudeste">Sudeste</SelectItem>
            <SelectItem value="Nordeste">Nordeste</SelectItem>
            <SelectItem value="Centro-Oeste">Centro-Oeste</SelectItem>
            <SelectItem value="Norte">Norte</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={onTypeChange}>
          <SelectTrigger className="w-[140px] bg-background/50">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="">Todos</SelectItem>
            <SelectItem value="Fabricante">Fabricante</SelectItem>
            <SelectItem value="Atacadista">Atacadista</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[160px] bg-background/50">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="">Padrão</SelectItem>
            <SelectItem value="rating">Melhor Avaliação</SelectItem>
            <SelectItem value="name">Nome (A-Z)</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          variant="outline" 
          size="icon" 
          className="shrink-0"
          onClick={() => {
            onSearchChange("");
            onRegionChange("");
            onTypeChange("");
            onSortChange("");
          }}
        >
          <Filter className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
