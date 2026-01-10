-- Create enrollments table for class registration
CREATE TABLE public.enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'waitlisted', 'cancelled')),
  UNIQUE(user_id, class_id)
);

-- Enable RLS
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- Students can view their own enrollments
CREATE POLICY "Users can view their own enrollments"
ON public.enrollments
FOR SELECT
USING (auth.uid() = user_id);

-- Students can enroll themselves
CREATE POLICY "Users can enroll themselves"
ON public.enrollments
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Students can cancel their own enrollment
CREATE POLICY "Users can cancel their enrollment"
ON public.enrollments
FOR UPDATE
USING (auth.uid() = user_id);

-- Students can delete their own enrollment
CREATE POLICY "Users can delete their enrollment"
ON public.enrollments
FOR DELETE
USING (auth.uid() = user_id);

-- Instructors can view all enrollments
CREATE POLICY "Instructors can view all enrollments"
ON public.enrollments
FOR SELECT
USING (
  has_role(auth.uid(), 'instructor'::app_role) OR 
  has_role(auth.uid(), 'admin'::app_role)
);

-- Instructors can manage enrollments
CREATE POLICY "Instructors can manage enrollments"
ON public.enrollments
FOR ALL
USING (
  has_role(auth.uid(), 'instructor'::app_role) OR 
  has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  has_role(auth.uid(), 'instructor'::app_role) OR 
  has_role(auth.uid(), 'admin'::app_role)
);