ALTER TABLE public.bonuses ADD COLUMN IF NOT EXISTS drive_url text;
ALTER TABLE public.bonuses ALTER COLUMN pdf_url DROP NOT NULL;