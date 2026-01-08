-- Update RLS policies for public.classes: students SELECT only, instructors manage their own classes, admins full access
ALTER TABLE IF EXISTS public.classes ENABLE ROW LEVEL SECURITY;

-- Drop existing class policies if present
DROP POLICY IF EXISTS "Anyone can view active classes" ON public.classes;
DROP POLICY IF EXISTS "Instructors can manage classes" ON public.classes;

-- Students: can SELECT active classes
CREATE POLICY "Students can view active classes"
  ON public.classes FOR SELECT
  USING (is_active = true AND public.has_role(auth.uid(), 'student'));

-- Instructors and Admins: can view all classes
CREATE POLICY "Instructors and Admins can view classes"
  ON public.classes FOR SELECT
  USING (public.has_role(auth.uid(), 'instructor') OR public.has_role(auth.uid(), 'admin'));

-- Instructors: can INSERT classes where they are the instructor (admins can bypass)
CREATE POLICY "Instructors can insert classes"
  ON public.classes FOR INSERT
  WITH CHECK (auth.uid() = instructor_id OR public.has_role(auth.uid(), 'admin'));

-- Instructors: can UPDATE their own classes (admins can update any)
CREATE POLICY "Instructors can update their own classes"
  ON public.classes FOR UPDATE
  USING (auth.uid() = instructor_id OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (auth.uid() = instructor_id OR public.has_role(auth.uid(), 'admin'));

-- Instructors: can DELETE their own classes (admins can delete any)
CREATE POLICY "Instructors can delete their own classes"
  ON public.classes FOR DELETE
  USING (auth.uid() = instructor_id OR public.has_role(auth.uid(), 'admin'));
