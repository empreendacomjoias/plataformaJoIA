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
    <div className="flex flex-col gap-3 sm:gap-4 p-4 sm:p-5 md:p-6 bg-card rounded-lg border border-border/50 shadow-lg animate-slide-in">
      {/* Search and Clear Button */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, @ ou região..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 sm:pl-10 bg-background/50 border-border/50 focus:border-primary transition-colors text-sm sm:text-base"
          />
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          className="shrink-0"
          onClick={() => {
            onSearchChange("");
            onRegionChange("all");
            onTypeChange("all");
            onSortChange("default");
          }}
        >
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Select value={regionFilter} onValueChange={onRegionChange}>
          <SelectTrigger className="w-full sm:w-[140px] bg-background/50 text-sm">
            <SelectValue placeholder="Região" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="Sul">Sul</SelectItem>
            <SelectItem value="Sudeste">Sudeste</SelectItem>
            <SelectItem value="Nordeste">Nordeste</SelectItem>
            <SelectItem value="Centro-Oeste">Centro-Oeste</SelectItem>
            <SelectItem value="Norte">Norte</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={onTypeChange}>
          <SelectTrigger className="w-full sm:w-[140px] bg-background/50 text-sm">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="Fabricante">Fabricante</SelectItem>
            <SelectItem value="Atacadista">Atacadista</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-full sm:w-[160px] bg-background/50 text-sm">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="default">Padrão</SelectItem>
            <SelectItem value="rating">Melhor Avaliação</SelectItem>
            <SelectItem value="name">Nome (A-Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
