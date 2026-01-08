-- Migration: role-based RLS policies using profiles.role

-- Ensure RLS enabled on target tables
ALTER TABLE IF EXISTS public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.announcements ENABLE ROW LEVEL SECURITY;

-- Classes: instructor/admin can insert/update/delete; public can read published classes
DROP POLICY IF EXISTS "Classes: instructors can manage" ON public.classes;
CREATE POLICY "Classes: instructors can manage" ON public.classes
  FOR ALL
  USING ((SELECT role FROM public.profiles WHERE user_id = auth.uid()) IN ('instructor','admin'))
  WITH CHECK ((SELECT role FROM public.profiles WHERE user_id = auth.uid()) IN ('instructor','admin'));

DROP POLICY IF EXISTS "Anyone can view published classes" ON public.classes;
CREATE POLICY "Anyone can view published classes" ON public.classes
  FOR SELECT
  USING (coalesce(is_active,false) = true);

-- Videos: instructor/admin can manage; students can read public videos
DROP POLICY IF EXISTS "Videos: instructors can manage" ON public.videos;
CREATE POLICY "Videos: instructors can manage" ON public.videos
  FOR ALL
  USING ((SELECT role FROM public.profiles WHERE user_id = auth.uid()) IN ('instructor','admin'))
  WITH CHECK ((SELECT role FROM public.profiles WHERE user_id = auth.uid()) IN ('instructor','admin'));

DROP POLICY IF EXISTS "Anyone can view public videos" ON public.videos;
CREATE POLICY "Anyone can view public videos" ON public.videos
  FOR SELECT
  USING (coalesce(is_public,false) = true);

-- Announcements: instructor/admin can manage; public can read published and unexpired announcements
DROP POLICY IF EXISTS "Announcements: instructors can manage" ON public.announcements;
CREATE POLICY "Announcements: instructors can manage" ON public.announcements
  FOR ALL
  USING ((SELECT role FROM public.profiles WHERE user_id = auth.uid()) IN ('instructor','admin'))
  WITH CHECK ((SELECT role FROM public.profiles WHERE user_id = auth.uid()) IN ('instructor','admin'));

DROP POLICY IF EXISTS "Anyone can view published announcements" ON public.announcements;
CREATE POLICY "Anyone can view published announcements" ON public.announcements
  FOR SELECT
  USING (coalesce(is_published,false) = true AND (expires_at IS NULL OR expires_at > now()));

-- Notes:
-- These policies evaluate the caller's role from public.profiles (profile linked to auth.users via user_id).
-- If you use the helper function public.has_role(uid, role) prefer it, but these policies strictly follow profiles.role as requested.
