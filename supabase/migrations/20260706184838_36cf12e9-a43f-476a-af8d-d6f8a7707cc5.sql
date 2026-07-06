CREATE TABLE public.bonuses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  pdf_url TEXT NOT NULL,
  cover_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.bonuses TO authenticated;
GRANT ALL ON public.bonuses TO service_role;

ALTER TABLE public.bonuses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view active bonuses"
  ON public.bonuses FOR SELECT
  TO authenticated
  USING (is_active = true OR public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert bonuses"
  ON public.bonuses FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update bonuses"
  ON public.bonuses FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete bonuses"
  ON public.bonuses FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE TRIGGER update_bonuses_updated_at
  BEFORE UPDATE ON public.bonuses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();