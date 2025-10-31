-- Add DELETE policy for categories table
CREATE POLICY "Only admins can delete categories"
ON public.categories
FOR DELETE
USING (is_admin(auth.uid()));