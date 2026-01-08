-- Additive migration to harden canonical public.classes schema
-- Non-destructive: adds columns only if they do not already exist

ALTER TABLE public.classes
ADD COLUMN IF NOT EXISTS description TEXT;

ALTER TABLE public.classes
ADD COLUMN IF NOT EXISTS level TEXT;

ALTER TABLE public.classes
ADD COLUMN IF NOT EXISTS day_of_week TEXT;

ALTER TABLE public.classes
ADD COLUMN IF NOT EXISTS start_time TIME;

ALTER TABLE public.classes
ADD COLUMN IF NOT EXISTS end_time TIME;

ALTER TABLE public.classes
ADD COLUMN IF NOT EXISTS capacity INTEGER DEFAULT 20;

ALTER TABLE public.classes
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

ALTER TABLE public.classes
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

-- Ensure instructor_id references auth.users (non-breaking if already correct)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'classes_instructor_id_fkey'
  ) THEN
    ALTER TABLE public.classes
    ADD CONSTRAINT classes_instructor_id_fkey
    FOREIGN KEY (instructor_id)
    REFERENCES auth.users(id);
  END IF;
END $$;
