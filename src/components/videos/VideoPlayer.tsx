import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, getBeltRankInfo, formatDuration } from "@/hooks/useVideos";
import ShareMenu from '@/components/share/ShareMenu';

interface VideoPlayerProps {
  video: Video | null;
  isOpen: boolean;
  onClose: () => void;
}

const VideoPlayer = ({ video, isOpen, onClose }: VideoPlayerProps) => {
  if (!video) return null;

  const beltInfo = getBeltRankInfo(video.minimum_belt_rank);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-5xl bg-card rounded-lg overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>

            {/* Video embed */}
            <div className="aspect-video bg-black">
              <iframe
                src={video.video_url}
                title={video.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Video info */}
            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold text-foreground">{video.title}</h2>
                  <div className="hidden sm:block">
                    <ShareMenu title={video.title} description={video.description ?? undefined} url={video.video_url} videoId={video.id} />
                  </div>
                </div>
                <Badge className={`${beltInfo.color} border-0 shrink-0`}>
                  {beltInfo.label}
                </Badge>
              </div>

              {video.description && (
                <p className="text-muted-foreground mb-4">{video.description}</p>
              )}

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {video.instructor_name && (
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{video.instructor_name}</span>
                  </div>
                )}
                {video.duration_seconds && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatDuration(video.duration_seconds)}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VideoPlayer;
