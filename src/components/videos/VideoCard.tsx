import { motion } from "framer-motion";
import { Play, Clock, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Video, getBeltRankInfo, formatDuration } from "@/hooks/useVideos";
import ShareMenu from '@/components/share/ShareMenu';
import { useAuth } from "@/hooks/useAuth";

interface VideoCardProps {
  video: Video;
  userBeltRank?: string;
  onClick: () => void;
}

const VideoCard = ({ video, userBeltRank, onClick }: VideoCardProps) => {
  const { user } = useAuth();
  const beltInfo = getBeltRankInfo(video.minimum_belt_rank);
  
  // Check if user can access this video
  const canAccess = video.is_public || (user && userBeltRank && 
    getBeltRankOrder(userBeltRank) >= getBeltRankOrder(video.minimum_belt_rank));

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={`group cursor-pointer overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 ${!canAccess ? 'opacity-75' : ''}`}
        onClick={canAccess ? onClick : undefined}
      >
        <div className="relative aspect-video bg-muted overflow-hidden">
          {video.thumbnail_url ? (
            <img 
              src={video.thumbnail_url} 
              alt={video.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <span className="text-4xl opacity-50">🥋</span>
            </div>
          )}
          
          {/* Play overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            {canAccess ? (
              <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center">
                <Play className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-muted/90 flex items-center justify-center">
                <Lock className="w-8 h-8 text-muted-foreground" />
              </div>
            )}
            {/* Duration badge */}
            </div>

          {/* Duration badge */}
          {video.duration_seconds && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDuration(video.duration_seconds)}
            </div>
          )}

          {/* Lock indicator for restricted videos */}
          {!canAccess && (
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="bg-black/70 text-white border-0">
                <Lock className="w-3 h-3 mr-1" />
                {beltInfo.label}
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {video.title}
            </h3>
          </div>

          {video.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {video.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <Badge 
              variant="outline" 
              className={`${beltInfo.color} border-0 text-xs`}
            >
              {beltInfo.label}
            </Badge>
            
            {video.instructor_name && (
              <span className="text-xs text-muted-foreground">
                {video.instructor_name}
              </span>
            )}
            <div className="ml-3">
              <ShareMenu title={video.title} description={video.description ?? undefined} url={video.video_url} videoId={video.id} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Helper function to get belt rank order for comparison
function getBeltRankOrder(rank: string): number {
  const order: Record<string, number> = {
    white: 1, yellow: 2, orange: 3, green: 4,
    blue: 5, purple: 6, brown: 7, black: 8
  };
  return order[rank] || 0;
}

export default VideoCard;
