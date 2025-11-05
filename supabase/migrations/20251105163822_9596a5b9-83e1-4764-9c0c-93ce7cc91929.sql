-- Create table for support settings
CREATE TABLE IF NOT EXISTS public.support_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  support_email text,
  support_whatsapp text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.support_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view support settings" ON public.support_settings;
DROP POLICY IF EXISTS "Only admins can manage support settings" ON public.support_settings;

-- Anyone can view support settings
CREATE POLICY "Anyone can view support settings"
ON public.support_settings
FOR SELECT
USING (true);

-- Only admins can manage support settings
CREATE POLICY "Only admins can manage support settings"
ON public.support_settings
FOR ALL
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Insert default support settings (single row) if not exists
INSERT INTO public.support_settings (support_email, support_whatsapp)
SELECT 'suporte@joia.com.br', '5511999999999'
WHERE NOT EXISTS (SELECT 1 FROM public.support_settings LIMIT 1);

-- Create trigger for automatic timestamp updates if not exists
DROP TRIGGER IF EXISTS update_support_settings_updated_at ON public.support_settings;
CREATE TRIGGER update_support_settings_updated_at
BEFORE UPDATE ON public.support_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();