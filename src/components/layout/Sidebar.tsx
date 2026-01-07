import { List, Heart, Trophy, Plus, Settings, LogOut, Shield, Sparkles, Gem, Menu, X, Bell, Palette } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { usePreview } from "@/contexts/PreviewContext";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { NotificationCenter } from "@/components/layout/NotificationCenter";
import { useSuppliers } from "@/hooks/useSuppliers";
import logo from "@/assets/logo.png";

const menuItems = [
  { icon: List, label: "Lista de Fornecedores", path: "/" },
  { icon: Heart, label: "Meus Favoritos", path: "/favoritos" },
  { icon: Trophy, label: "Ranking", path: "/ranking" },
  { icon: Gem, label: "Club JoIA", path: "/club-joia" },
  { icon: Sparkles, label: "JoIA Indica", path: "/joia-indica" },
  { icon: Plus, label: "Adicionar Fornecedor", path: "/adicionar", adminOnly: true },
  { icon: Bell, label: "Notificações", path: "/notificacoes", adminOnly: true },
  { icon: Palette, label: "Categorias", path: "/categorias", adminOnly: true },
  { icon: Settings, label: "Configurações", path: "/configuracoes" },
];

export function Sidebar() {
  const { isAdmin: realIsAdmin, signOut, user } = useAuth();
  const { previewAsUser } = usePreview();
  const isAdmin = realIsAdmin && !previewAsUser;
  const { suppliers } = useSuppliers();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const favoritesCount = suppliers.filter(s => s.isFavorite).length;
  
  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50 flex items-center px-4 justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          <div className="flex items-center gap-2">
            <img src={logo} alt="JoIA Logo" className="w-8 h-8 object-contain" />
            <h1 className="font-semibold">JoIA</h1>
          </div>
        </div>
        <NotificationCenter />
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="JoIA Logo" className="w-10 h-10 object-contain" />
            <div>
              <h1 className="font-semibold text-lg">JoIA</h1>
              <p className="text-xs text-muted-foreground">Sua Plataforma Inteligente</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.filter(item => !item.adminOnly || isAdmin).map((item) => (
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
                <span className="font-medium flex-1">{item.label}</span>
                {item.path === "/favoritos" && favoritesCount > 0 && (
                  <Badge 
                    variant={isActive ? "secondary" : "default"} 
                    className={cn(
                      "min-w-[1.5rem] h-5 flex items-center justify-center text-xs",
                      isActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-red-500/90 text-white"
                    )}
                  >
                    {favoritesCount}
                  </Badge>
                )}
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
      </div>
    </aside>
    </>
  );
}
