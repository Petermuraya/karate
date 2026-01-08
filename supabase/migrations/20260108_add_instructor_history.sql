-- Migration: add instructor_history table to store instructor photos/history

CREATE TABLE IF NOT EXISTS instructor_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id uuid NOT NULL REFERENCES instructors(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  caption text,
  uploaded_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_instructor_history_instructor ON instructor_history(instructor_id);
