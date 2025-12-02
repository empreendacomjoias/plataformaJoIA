-- Add column to differentiate minimum order type (pieces vs monetary)
ALTER TABLE public.suppliers 
ADD COLUMN min_order_is_pieces boolean NOT NULL DEFAULT false;