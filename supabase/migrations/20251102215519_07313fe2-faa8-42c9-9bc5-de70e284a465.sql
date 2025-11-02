-- Criar tabela club_members para armazenar fornecedores do Club JoIA
CREATE TABLE public.club_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  benefit TEXT NOT NULL,
  coupon_code TEXT NOT NULL,
  expiry_date TIMESTAMP WITH TIME ZONE,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(supplier_id)
);

-- Habilitar RLS
ALTER TABLE public.club_members ENABLE ROW LEVEL SECURITY;

-- Políticas RLS: Qualquer um pode ver membros ativos
CREATE POLICY "Anyone can view active club members"
  ON public.club_members
  FOR SELECT
  USING (is_active = true OR is_admin(auth.uid()));

-- Apenas admins podem gerenciar membros do club
CREATE POLICY "Only admins can manage club members"
  ON public.club_members
  FOR ALL
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));