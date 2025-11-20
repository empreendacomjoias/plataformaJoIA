import { List, Heart, Trophy, Plus, Settings, LogOut, Shield, Sparkles, Gem, Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const menuItems = [
  { icon: List, label: "Lista de Fornecedores", path: "/" },
  { icon: Heart, label: "Meus Favoritos", path: "/favoritos" },
  { icon: Trophy, label: "Ranking", path: "/ranking" },
  { icon: Gem, label: "Club JoIA", path: "/club-joia" },
  { icon: Sparkles, label: "JoIA Indica", path: "/joia-indica" },
  { icon: Plus, label: "Adicionar Fornecedor", path: "/adicionar" },
  { icon: Settings, label: "Configurações", path: "/configuracoes" },
];

export function Sidebar() {
  const { isAdmin, signOut, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50 flex items-center px-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
        <div className="flex items-center gap-2 ml-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-xl">💎</span>
          </div>
          <h1 className="font-semibold">Prata 925</h1>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 h-screen bg-card border-r border-border flex flex-col transition-transform duration-300",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
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
        {menuItems.filter(item => item.path !== "/adicionar" || isAdmin).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setIsMobileMenuOpen(false)}
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
      <div className="p-4 border-t border-border space-y-3">
        {isAdmin && (
          <Badge className="w-full justify-center" variant="secondary">
            <Shield className="w-3 h-3 mr-1" />
            Admin
          </Badge>
        )}
        <div className="flex items-center justify-between gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="sm" onClick={signOut} className="flex-1">
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
        <div className="text-xs text-muted-foreground text-center">
          {user?.email}
        </div>
      </div>
    </aside>
    </>
  );
}
