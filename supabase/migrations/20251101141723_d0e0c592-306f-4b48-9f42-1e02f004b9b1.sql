-- Create table for recommendation categories
CREATE TABLE public.recommendation_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL DEFAULT '#8B5CF6',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for recommendations
CREATE TABLE public.recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category_id UUID REFERENCES public.recommendation_categories(id) ON DELETE RESTRICT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  cta_text TEXT NOT NULL DEFAULT 'Acessar com o link JoIA',
  affiliate_link TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  click_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create table for tracking clicks
CREATE TABLE public.recommendation_clicks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recommendation_id UUID REFERENCES public.recommendations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  clicked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.recommendation_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendation_clicks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for recommendation_categories
CREATE POLICY "Anyone can view categories"
  ON public.recommendation_categories
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage categories"
  ON public.recommendation_categories
  FOR ALL
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- RLS Policies for recommendations
CREATE POLICY "Anyone can view active recommendations"
  ON public.recommendations
  FOR SELECT
  USING (is_active = true OR is_admin(auth.uid()));

CREATE POLICY "Only admins can manage recommendations"
  ON public.recommendations
  FOR ALL
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- RLS Policies for recommendation_clicks
CREATE POLICY "Users can create clicks"
  ON public.recommendation_clicks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admins can view all clicks"
  ON public.recommendation_clicks
  FOR SELECT
  USING (is_admin(auth.uid()));

-- Function to increment click count
CREATE OR REPLACE FUNCTION public.increment_recommendation_clicks()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE recommendations
  SET click_count = click_count + 1
  WHERE id = NEW.recommendation_id;
  RETURN NEW;
END;
$$;

-- Trigger to auto-increment clicks
CREATE TRIGGER on_recommendation_click
  AFTER INSERT ON public.recommendation_clicks
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_recommendation_clicks();

-- Insert default categories
INSERT INTO public.recommendation_categories (name, color) VALUES
  ('Ferramentas', '#8B5CF6'),
  ('Produtos', '#EC4899'),
  ('Serviços', '#3B82F6'),
  ('Pagamentos', '#10B981'),
  ('Embalagens', '#F59E0B'),
  ('E-commerce', '#EF4444'),
  ('Marketing', '#06B6D4');