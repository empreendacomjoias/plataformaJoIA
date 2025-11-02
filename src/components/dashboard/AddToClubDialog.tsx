import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useClubMembers } from "@/hooks/useClubMembers";
import { Supplier } from "@/types/supplier";

interface AddToClubDialogProps {
  supplier: Supplier;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddToClubDialog({ supplier, open, onOpenChange }: AddToClubDialogProps) {
  const { addMember } = useClubMembers();
  const [formData, setFormData] = useState({
    benefit: "",
    coupon_code: "",
    expiry_date: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.benefit.trim() || !formData.coupon_code.trim()) {
      return;
    }

    setSubmitting(true);
    
    addMember({
      supplier_id: supplier.id,
      benefit: formData.benefit.trim(),
      coupon_code: formData.coupon_code.trim(),
      expiry_date: formData.expiry_date || null,
    });

    setSubmitting(false);
    onOpenChange(false);
    setFormData({ benefit: "", coupon_code: "", expiry_date: "" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar ao Club JoIA</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-sm text-muted-foreground">Fornecedor</Label>
            <p className="font-medium">{supplier.name}</p>
          </div>

          <div>
            <Label htmlFor="benefit">Benefício *</Label>
            <Textarea
              id="benefit"
              placeholder="Ex: 10% de desconto, frete grátis, brinde exclusivo"
              value={formData.benefit}
              onChange={(e) => setFormData({ ...formData, benefit: e.target.value })}
              required
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="coupon_code">Código do Cupom *</Label>
            <Input
              id="coupon_code"
              placeholder="Ex: JOIA10, CLUB15"
              value={formData.coupon_code}
              onChange={(e) => setFormData({ ...formData, coupon_code: e.target.value.toUpperCase() })}
              required
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="expiry_date">Validade do Cupom (opcional)</Label>
            <Input
              id="expiry_date"
              type="date"
              value={formData.expiry_date}
              onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
              className="mt-1.5"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting} className="flex-1">
              {submitting ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
