
-- 1) Revoke EXECUTE on SECURITY DEFINER trigger functions from anon/authenticated
REVOKE EXECUTE ON FUNCTION public.increment_recommendation_clicks() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_supplier_rating() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, PUBLIC;
-- is_admin is invoked from RLS policies, keep EXECUTE for anon/authenticated

-- 2) Fix user_roles: users can only view their own row; admins can view all
DROP POLICY IF EXISTS "Anyone can view roles" ON public.user_roles;
CREATE POLICY "Users view own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

-- 3) Public bucket listing: drop broad SELECT policy on recommendation-images
--    (public bucket -> files still accessible via direct public URL)
DROP POLICY IF EXISTS "Anyone can view recommendation images" ON storage.objects;

-- 4) Restrict authenticated read of bonuses files to files referenced by active bonuses
DROP POLICY IF EXISTS "Authenticated can read bonuses files" ON storage.objects;
CREATE POLICY "Authenticated read active bonus files" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'bonuses'
    AND (
      public.is_admin(auth.uid())
      OR EXISTS (
        SELECT 1 FROM public.bonuses b
        WHERE b.is_active = true
          AND (b.pdf_url = storage.objects.name OR b.cover_url = storage.objects.name)
      )
    )
  );
