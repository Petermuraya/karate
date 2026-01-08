-- Initial Phase 1 schema migration
-- Creates core tables: users, students, instructors, classes, videos, announcements, student_progress, attendance, whatsapp_messages

-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- users
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  role text NOT NULL CHECK (role IN ('instructor','student','admin')),
  name text,
  phone text,
  password_hash text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- students
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  belt_level text,
  program text CHECK (program IN ('kids','teens','adults')),
  location text,
  enrollment_date date DEFAULT now()
);

-- instructors
CREATE TABLE IF NOT EXISTS instructors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bio text,
  certifications text[],
  verified boolean DEFAULT false
);

-- classes
CREATE TABLE IF NOT EXISTS classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id uuid REFERENCES instructors(id) ON DELETE SET NULL,
  title text NOT NULL,
  program text,
  location text,
  date_time timestamptz,
  capacity integer DEFAULT 0,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- videos
CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id uuid REFERENCES instructors(id) ON DELETE SET NULL,
  title text NOT NULL,
  youtube_url text,
  category text CHECK (category IN ('basics','kata','kumite','conditioning')),
  belt_level_required text,
  created_at timestamptz DEFAULT now()
);

-- announcements
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id uuid REFERENCES instructors(id) ON DELETE SET NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- student_progress
CREATE TABLE IF NOT EXISTS student_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  class_attended integer DEFAULT 0,
  belt_progression_log jsonb DEFAULT '[]'::jsonb,
  updated_at timestamptz DEFAULT now()
);

-- attendance
CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  status text CHECK (status IN ('present','absent','makeup')),
  date date NOT NULL DEFAULT now()
);

-- whatsapp_messages
CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id uuid REFERENCES users(id) ON DELETE SET NULL,
  message text,
  sent_at timestamptz,
  status text
);

-- instructor_metrics (lightweight cache for analytics)
CREATE TABLE IF NOT EXISTS instructor_metrics (
  instructor_id uuid PRIMARY KEY REFERENCES instructors(id) ON DELETE CASCADE,
  student_count integer DEFAULT 0,
  avg_attendance_rate numeric DEFAULT 0,
  most_popular_video_id uuid,
  churn_risk_students uuid[] DEFAULT '{}'
);

-- Indexes for common lookups (create only if columns exist)
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'classes' AND column_name = 'date_time'
  ) THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_classes_date ON classes(date_time)';
  END IF;
END$$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'videos' AND column_name = 'instructor_id'
  ) THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_videos_instructor ON videos(instructor_id)';
  END IF;
END$$;
