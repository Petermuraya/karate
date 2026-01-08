-- Migration: add class_templates for reusable recurring class definitions

CREATE TABLE IF NOT EXISTS class_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id uuid NOT NULL REFERENCES instructors(id) ON DELETE CASCADE,
  title text NOT NULL,
  program text,
  location text,
  weekday integer, -- 0 (Sun) - 6 (Sat) for weekly recurrence
  start_time time without time zone,
  duration_minutes integer DEFAULT 60,
  capacity integer DEFAULT 0,
  is_recurring boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_class_templates_instructor ON class_templates(instructor_id);
