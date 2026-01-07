import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type VideoCategory = 'kihon' | 'kata' | 'kumite' | 'conditioning' | 'competition';

export interface Video {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  category: VideoCategory;
  minimum_belt_rank: string;
  is_public: boolean;
  duration_seconds: number | null;
  instructor_name: string | null;
  created_at: string;
}

export const BELT_RANKS = [
  { value: 'white', label: 'White Belt', color: 'bg-gray-100 text-gray-800' },
  { value: 'yellow', label: 'Yellow Belt', color: 'bg-yellow-400 text-yellow-900' },
  { value: 'orange', label: 'Orange Belt', color: 'bg-orange-500 text-white' },
  { value: 'green', label: 'Green Belt', color: 'bg-green-600 text-white' },
  { value: 'blue', label: 'Blue Belt', color: 'bg-blue-600 text-white' },
  { value: 'purple', label: 'Purple Belt', color: 'bg-purple-600 text-white' },
  { value: 'brown', label: 'Brown Belt', color: 'bg-amber-800 text-white' },
  { value: 'black', label: 'Black Belt', color: 'bg-black text-white' },
];

export const VIDEO_CATEGORIES = [
  { value: 'all', label: 'All Videos', icon: '🎬' },
  { value: 'kihon', label: 'Basics (Kihon)', icon: '👊' },
  { value: 'kata', label: 'Kata', icon: '🥋' },
  { value: 'kumite', label: 'Kumite', icon: '⚔️' },
  { value: 'conditioning', label: 'Conditioning', icon: '💪' },
  { value: 'competition', label: 'Competition', icon: '🏆' },
];

export const getBeltRankInfo = (rank: string) => {
  return BELT_RANKS.find(b => b.value === rank) || BELT_RANKS[0];
};

export const formatDuration = (seconds: number | null) => {
  if (!seconds) return '';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const useVideos = (category?: VideoCategory | 'all') => {
  return useQuery({
    queryKey: ['videos', category],
    queryFn: async () => {
      let query = supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Video[];
    },
  });
};

export const useVideo = (id: string) => {
  return useQuery({
    queryKey: ['video', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data as Video | null;
    },
    enabled: !!id,
  });
};
