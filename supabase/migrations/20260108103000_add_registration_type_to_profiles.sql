-- Migration: add registration_type to profiles and update handle_new_user trigger

-- Add column if missing with default
ALTER TABLE IF EXISTS public.profiles
  ADD COLUMN IF NOT EXISTS registration_type text DEFAULT 'adult';

-- Add CHECK constraint for allowed values if not present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_registration_type_check'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_registration_type_check CHECK (registration_type IN ('adult','child','trial'));
  END IF;
END$$;

-- Replace the handle_new_user trigger function to populate registration_type from auth metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert profile including registration_type if provided in raw_user_meta_data
  INSERT INTO public.profiles (user_id, full_name, email, registration_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'registration_type', 'adult')
  );

  -- Assign default student role (do nothing if role already exists)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student')
  ON CONFLICT (user_id, role) DO NOTHING;

  -- Create welcome notification
  INSERT INTO public.notifications (user_id, title, message, type)
  VALUES (
    NEW.id,
    'Welcome to Iron Fist Dojo!',
    'Your martial arts journey begins now. Check out your upcoming classes and start training!',
    'welcome'
  );

  RETURN NEW;
END;
$$;
