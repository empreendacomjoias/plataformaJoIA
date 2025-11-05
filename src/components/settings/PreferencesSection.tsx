import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function PreferencesSection() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Preferências</h3>
        <p className="text-sm text-muted-foreground">
          Personalize sua experiência no aplicativo
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Tema</Label>
            <p className="text-sm text-muted-foreground">
              Alternar entre modo claro e escuro
            </p>
          </div>
          <ThemeToggle />
        </div>

      </div>
    </div>
  );
}
