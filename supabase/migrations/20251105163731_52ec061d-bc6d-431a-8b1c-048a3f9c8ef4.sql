-- Create table for module descriptions
CREATE TABLE public.module_descriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_key text NOT NULL UNIQUE,
  title text NOT NULL,
  description text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.module_descriptions ENABLE ROW LEVEL SECURITY;

-- Anyone can view descriptions
CREATE POLICY "Anyone can view module descriptions"
ON public.module_descriptions
FOR SELECT
USING (true);

-- Only admins can manage descriptions
CREATE POLICY "Only admins can manage module descriptions"
ON public.module_descriptions
FOR ALL
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Insert default descriptions
INSERT INTO public.module_descriptions (module_key, title, description) VALUES
('club_joia', 'Club JoIA', 'Benefícios exclusivos dos nossos parceiros para você economizar no seu negócio!'),
('joia_indica', 'JoIA Indica', 'Ferramentas e serviços recomendados para empreendedores que querem crescer.');

-- Create table for support settings
CREATE TABLE public.support_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  support_email text,
  support_whatsapp text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.support_settings ENABLE ROW LEVEL SECURITY;

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

-- Insert default support settings (single row)
INSERT INTO public.support_settings (support_email, support_whatsapp) VALUES
('suporte@joia.com.br', '5511999999999');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_module_descriptions_updated_at
BEFORE UPDATE ON public.module_descriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_support_settings_updated_at
BEFORE UPDATE ON public.support_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();