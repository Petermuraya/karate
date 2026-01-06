import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Award, TrendingUp } from 'lucide-react';

const beltProgression = [
  { name: 'White', color: 'bg-white border border-border', value: 0 },
  { name: 'Yellow', color: 'bg-yellow-400', value: 1 },
  { name: 'Orange', color: 'bg-orange-500', value: 2 },
  { name: 'Green', color: 'bg-green-500', value: 3 },
  { name: 'Blue', color: 'bg-blue-500', value: 4 },
  { name: 'Brown', color: 'bg-amber-700', value: 5 },
  { name: 'Black', color: 'bg-black', value: 6 }
];

export function ProgressCard() {
  const { profile } = useAuth();
  
  const currentBelt = beltProgression.find(
    b => b.name.toLowerCase() === profile?.belt_rank?.toLowerCase()
  ) || beltProgression[0];
  
  const nextBelt = beltProgression[currentBelt.value + 1];
  const progressPercent = ((currentBelt.value + 1) / beltProgression.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-card border border-border rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl text-foreground tracking-wide">YOUR PROGRESS</h2>
        <Award className="w-5 h-5 text-gold" />
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className={`w-12 h-12 rounded-lg ${currentBelt.color} flex items-center justify-center shadow-lg`}>
          {currentBelt.name === 'Black' && (
            <span className="text-white font-display text-sm">黒</span>
          )}
        </div>
        <div>
          <p className="text-foreground font-semibold">{currentBelt.name} Belt</p>
          <p className="text-muted-foreground text-sm capitalize">{profile?.program} Program</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Journey Progress</span>
          <span className="text-foreground font-medium">{Math.round(progressPercent)}%</span>
        </div>
        <div className="h-3 bg-secondary rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-primary to-gold rounded-full"
          />
        </div>
      </div>

      {/* Belt Progression */}
      <div className="flex justify-between mt-6">
        {beltProgression.map((belt, index) => (
          <div key={belt.name} className="flex flex-col items-center">
            <div 
              className={`w-6 h-6 rounded ${belt.color} ${
                index <= currentBelt.value ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : 'opacity-40'
              }`}
            />
            <span className="text-xs text-muted-foreground mt-1 hidden sm:block">
              {belt.name.slice(0, 2)}
            </span>
          </div>
        ))}
      </div>

      {nextBelt && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Next goal:</span>
            <span className="text-foreground font-medium">{nextBelt.name} Belt</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
