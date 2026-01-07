-- Add color column to categories table
ALTER TABLE public.categories 
ADD COLUMN color text NOT NULL DEFAULT '#8B5CF6';

-- Add UPDATE policy for admins (currently missing)
CREATE POLICY "Only admins can update categories" 
ON public.categories 
FOR UPDATE 
USING (is_admin(auth.uid()));