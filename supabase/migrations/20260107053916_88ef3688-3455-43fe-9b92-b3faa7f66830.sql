
-- Create belt rank order function for comparisons
CREATE OR REPLACE FUNCTION public.get_belt_rank_order(belt_rank text)
RETURNS integer
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  SELECT CASE belt_rank
    WHEN 'white' THEN 1
    WHEN 'yellow' THEN 2
    WHEN 'orange' THEN 3
    WHEN 'green' THEN 4
    WHEN 'blue' THEN 5
    WHEN 'purple' THEN 6
    WHEN 'brown' THEN 7
    WHEN 'black' THEN 8
    ELSE 0
  END
$$;

-- Create videos table
CREATE TABLE public.videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT NOT NULL CHECK (category IN ('kihon', 'kata', 'kumite', 'conditioning', 'competition')),
  minimum_belt_rank TEXT NOT NULL DEFAULT 'white',
  is_public BOOLEAN NOT NULL DEFAULT false,
  duration_seconds INTEGER,
  instructor_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view public videos
CREATE POLICY "Anyone can view public videos"
ON public.videos
FOR SELECT
USING (is_public = true);

-- Policy: Authenticated users can view videos at or below their belt level
CREATE POLICY "Students can view videos at their belt level"
ON public.videos
FOR SELECT
TO authenticated
USING (
  is_public = true
  OR
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = auth.uid()
    AND get_belt_rank_order(profiles.belt_rank) >= get_belt_rank_order(videos.minimum_belt_rank)
  )
);

-- Policy: Instructors/Admins can manage videos
CREATE POLICY "Instructors can manage videos"
ON public.videos
FOR ALL
USING (has_role(auth.uid(), 'instructor') OR has_role(auth.uid(), 'admin'));

-- Add timestamp trigger
CREATE TRIGGER update_videos_updated_at
  BEFORE UPDATE ON public.videos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample videos
INSERT INTO public.videos (title, description, video_url, thumbnail_url, category, minimum_belt_rank, is_public, duration_seconds, instructor_name) VALUES
('Introduction to Karate', 'Learn the fundamentals of karate stance and etiquette', 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 'kihon', 'white', true, 300, 'Sensei Tanaka'),
('Basic Punches - Tsuki', 'Master the fundamental punching techniques', 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 'kihon', 'white', false, 420, 'Sensei Tanaka'),
('Front Kick - Mae Geri', 'Learn proper front kick form and execution', 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 'kihon', 'white', false, 360, 'Sensei Tanaka'),
('Taikyoku Shodan', 'First kata for beginners', 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 'kata', 'white', false, 480, 'Sensei Yamamoto'),
('Heian Nidan', 'Second Heian kata with detailed breakdown', 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 'kata', 'yellow', false, 600, 'Sensei Yamamoto'),
('Heian Sandan', 'Third Heian kata techniques', 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 'kata', 'orange', false, 540, 'Sensei Yamamoto'),
('Basic Sparring Combinations', 'Essential kumite combinations for beginners', 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 'kumite', 'yellow', false, 450, 'Sensei Tanaka'),
('Advanced Footwork Drills', 'Improve your movement and timing', 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 'kumite', 'green', false, 520, 'Sensei Tanaka'),
('Cardio Kickboxing Warmup', 'High-intensity warmup routine', 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 'conditioning', 'white', true, 900, 'Sensei Kimura'),
('Core Strength for Martial Arts', 'Build a strong core for powerful techniques', 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 'conditioning', 'white', false, 720, 'Sensei Kimura'),
('Competition Strategy Basics', 'Learn tournament tactics and scoring', 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 'competition', 'blue', false, 840, 'Sensei Yamamoto'),
('Bassai Dai', 'Advanced kata for brown belt and above', 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 'kata', 'brown', false, 780, 'Sensei Yamamoto');
