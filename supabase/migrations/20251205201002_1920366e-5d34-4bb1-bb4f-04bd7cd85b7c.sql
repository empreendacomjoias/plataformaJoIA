-- Add display_order column to suppliers table for custom ordering
ALTER TABLE public.suppliers 
ADD COLUMN display_order integer DEFAULT 0;

-- Set initial display_order based on current row order
WITH numbered_suppliers AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as rn
  FROM public.suppliers
)
UPDATE public.suppliers s
SET display_order = ns.rn
FROM numbered_suppliers ns
WHERE s.id = ns.id;