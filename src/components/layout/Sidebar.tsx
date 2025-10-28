import { List, Heart, Trophy, Plus, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: List, label: "Lista de Fornecedores", path: "/" },
  { icon: Heart, label: "Meus Favoritos", path: "/favoritos" },
  { icon: Trophy, label: "Ranking", path: "/ranking" },
  { icon: Plus, label: "Adicionar Fornecedor", path: "/adicionar" },
  { icon: Settings, label: "Configurações", path: "/configuracoes" },
];

export function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-2xl">💎</span>
          </div>
          <div>
            <h1 className="font-semibold text-lg">Prata 925</h1>
            <p className="text-xs text-muted-foreground">Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                "hover:bg-secondary/50 group",
                isActive && "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon 
                  className={cn(
                    "w-5 h-5 transition-transform group-hover:scale-110",
                    isActive && "drop-shadow-[0_0_8px_rgba(167,139,250,0.8)]"
                  )} 
                />
                <span className="font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">
          v1.0.0 - Premium Edition
        </div>
      </div>
    </aside>
  );
}
