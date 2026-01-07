import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { VIDEO_CATEGORIES, VideoCategory } from "@/hooks/useVideos";

interface CategoryFilterProps {
  selectedCategory: VideoCategory | 'all';
  onCategoryChange: (category: VideoCategory | 'all') => void;
}

const CategoryFilter = ({ selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {VIDEO_CATEGORIES.map((category) => {
        const isSelected = selectedCategory === category.value;
        return (
          <motion.div
            key={category.value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(category.value as VideoCategory | 'all')}
              className={`gap-2 ${isSelected ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' : 'hover:bg-primary/10 hover:border-primary/50'}`}
            >
              <span>{category.icon}</span>
              <span>{category.label}</span>
            </Button>
          </motion.div>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
