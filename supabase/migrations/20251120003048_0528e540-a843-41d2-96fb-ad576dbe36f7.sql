-- Create storage bucket for recommendation images
INSERT INTO storage.buckets (id, name, public)
VALUES ('recommendation-images', 'recommendation-images', true);

-- Create RLS policies for the recommendation-images bucket
CREATE POLICY "Anyone can view recommendation images"
ON storage.objects FOR SELECT
USING (bucket_id = 'recommendation-images');

CREATE POLICY "Admins can upload recommendation images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'recommendation-images' 
  AND is_admin(auth.uid())
);

CREATE POLICY "Admins can update recommendation images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'recommendation-images' 
  AND is_admin(auth.uid())
);

CREATE POLICY "Admins can delete recommendation images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'recommendation-images' 
  AND is_admin(auth.uid())
);