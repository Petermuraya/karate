import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Film, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useVideos, VideoCategory, Video } from "@/hooks/useVideos";
import VideoCard from "@/components/videos/VideoCard";
import VideoPlayer from "@/components/videos/VideoPlayer";
import CategoryFilter from "@/components/videos/CategoryFilter";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const VideoLibrary = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<VideoCategory | 'all'>('all');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  const { data: videos, isLoading } = useVideos(selectedCategory);

  // Fetch user's belt rank
  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from('profiles')
        .select('belt_rank')
        .eq('user_id', user.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    setIsPlayerOpen(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to={user ? "/dashboard" : "/"}>
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Film className="w-6 h-6 text-primary" />
                <h1 className="text-xl font-bold text-foreground">Training Videos</h1>
              </div>
            </div>

            {!user && (
              <Link to="/auth">
                <Button variant="default" size="sm" className="gap-2">
                  <Lock className="w-4 h-4" />
                  Sign in for full access
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </motion.div>

        {/* Info banner for non-authenticated users */}
        {!user && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 rounded-lg bg-primary/10 border border-primary/20"
          >
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-primary shrink-0" />
              <p className="text-sm text-foreground">
                <strong>Limited access:</strong> Sign in to unlock all videos based on your belt rank. 
                Some videos are only available to registered students.
              </p>
            </div>
          </motion.div>
        )}

        {/* Videos Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-video rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : videos && videos.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {videos.map((video) => (
              <motion.div key={video.id} variants={itemVariants}>
                <VideoCard
                  video={video}
                  userBeltRank={profile?.belt_rank || undefined}
                  onClick={() => handleVideoClick(video)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Film className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No videos found</h3>
            <p className="text-muted-foreground">
              {selectedCategory !== 'all' 
                ? `No videos available in this category yet.`
                : `Check back soon for new training content.`}
            </p>
          </motion.div>
        )}
      </main>

      {/* Video Player Modal */}
      <VideoPlayer
        video={selectedVideo}
        isOpen={isPlayerOpen}
        onClose={() => {
          setIsPlayerOpen(false);
          setSelectedVideo(null);
        }}
      />
    </div>
  );
};

export default VideoLibrary;
