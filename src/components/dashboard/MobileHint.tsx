import { useState, useEffect } from "react";
import { X, Hand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const HINT_STORAGE_KEY = "supplier-mobile-hint-dismissed";

export function MobileHint() {
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    // Check if hint was already dismissed
    const dismissed = localStorage.getItem(HINT_STORAGE_KEY);
    if (!dismissed) {
      // Small delay to show hint after page loads
      const timer = setTimeout(() => setShowHint(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismissHint = () => {
    setShowHint(false);
    localStorage.setItem(HINT_STORAGE_KEY, "true");
  };

  if (!showHint) return null;

  return (
    <div
      className={cn(
        "md:hidden fixed bottom-20 left-4 right-4 z-50",
        "animate-in slide-in-from-bottom-4 fade-in duration-300"
      )}
    >
      <div className="bg-primary text-primary-foreground rounded-lg shadow-lg p-4 relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
          onClick={dismissHint}
        >
          <X className="w-4 h-4" />
        </Button>
        
        <div className="flex items-start gap-3 pr-6">
          <div className="bg-primary-foreground/20 rounded-full p-2 shrink-0">
            <Hand className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-sm mb-1">Dica</p>
            <p className="text-sm text-primary-foreground/90">
              Toque no nome do fornecedor para ver todas as informações detalhadas.
            </p>
          </div>
        </div>
        
        <Button
          variant="secondary"
          size="sm"
          className="w-full mt-3"
          onClick={dismissHint}
        >
          Entendi!
        </Button>
      </div>
    </div>
  );
}
