-- Migration: add profiles, student_profiles, instructor_profiles and row level security

-- Create profiles table (add missing columns/constraints when table already exists)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  created_at timestamptz DEFAULT now()
);

-- Ensure `role` column exists with a safe default
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'student';

-- Add CHECK constraint for role values if not present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_role_check'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_role_check CHECK (role IN ('admin','instructor','student'));
  END IF;
END$$;

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);

-- Create student_profiles table
CREATE TABLE IF NOT EXISTS public.student_profiles (
  profile_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  belt_level text,
  program text CHECK (program IN ('kids','teens','adults')),
  location text
);

-- Create instructor_profiles table
CREATE TABLE IF NOT EXISTS public.instructor_profiles (
  profile_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  certifications text[],
  bio text
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instructor_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for `profiles`
CREATE POLICY "Profiles: users can select own" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Profiles: users can update own" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Instructors (or admins) can read student profiles
CREATE POLICY "Profiles: instructors can view students" ON public.profiles
  FOR SELECT USING (
    (role = 'student' AND public.has_role(auth.uid(), 'instructor'))
    OR auth.uid() = user_id
  );

-- Policies for `student_profiles`
CREATE POLICY "Student profiles: users can view their own student profile" ON public.student_profiles
  FOR SELECT USING (
    auth.uid() = (SELECT user_id FROM public.profiles WHERE id = student_profiles.profile_id)
  );

CREATE POLICY "Student profiles: users can update own" ON public.student_profiles
  FOR UPDATE USING (
    auth.uid() = (SELECT user_id FROM public.profiles WHERE id = student_profiles.profile_id)
  );

CREATE POLICY "Student profiles: instructors can view student profiles" ON public.student_profiles
  FOR SELECT USING (
    public.has_role(auth.uid(), 'instructor')
  );

-- Policies for `instructor_profiles`
CREATE POLICY "Instructor profiles: users can view own instructor profile" ON public.instructor_profiles
  FOR SELECT USING (
    auth.uid() = (SELECT user_id FROM public.profiles WHERE id = instructor_profiles.profile_id)
  );

CREATE POLICY "Instructor profiles: users can update own" ON public.instructor_profiles
  FOR UPDATE USING (
    auth.uid() = (SELECT user_id FROM public.profiles WHERE id = instructor_profiles.profile_id)
  );

-- Allow inserts by authenticated users only (with check that profile_id links to their own profile)
CREATE POLICY "Profiles: authenticated insert" ON public.profiles
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Student profiles: authenticated insert" ON public.student_profiles
  FOR INSERT WITH CHECK (
    auth.uid() = (SELECT user_id FROM public.profiles WHERE id = student_profiles.profile_id)
  );

CREATE POLICY "Instructor profiles: authenticated insert" ON public.instructor_profiles
  FOR INSERT WITH CHECK (
    auth.uid() = (SELECT user_id FROM public.profiles WHERE id = instructor_profiles.profile_id)
  );
