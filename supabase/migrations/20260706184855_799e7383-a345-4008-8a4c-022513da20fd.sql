CREATE POLICY "Authenticated can read bonuses files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'bonuses');

CREATE POLICY "Admins can upload bonuses files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'bonuses' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can update bonuses files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'bonuses' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete bonuses files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'bonuses' AND public.is_admin(auth.uid()));