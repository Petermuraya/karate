import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";
import heroMainImage from "@/assets/hero-karate.jpg";
import adultTraining from "@/assets/aldulttraining.png";
import teenTraining from "@/assets/teentraining.png";

export const HeroSection = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with subtle zoom */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1 }}
        animate={{ scale: 1.05 }}
        transition={{ duration: 15, ease: "linear" }}
      >
        <img
          src={heroMainImage}
          alt="Karate martial artist in powerful stance"
          className="w-full h-full object-cover opacity-40"
        />
        {/* Enhanced gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5" />
      </motion.div>

      <div className="container-custom relative z-10 px-6 md:px-12 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content Column */}
          <div className="max-w-2xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full mb-8"
            >
              <span className="w-2 h-2 bg-primary animate-pulse rounded-full" />
              <span className="text-sm text-primary font-medium uppercase tracking-wider">
                Now Enrolling • January 2026
              </span>
            </motion.div>

            {/* Headline with staggered animation */}
            <div className="overflow-hidden mb-4">
              <motion.h1
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-5xl sm:text-6xl md:text-7xl leading-[0.95] tracking-wide text-foreground"
              >
                FORGE
              </motion.h1>
            </div>
            <div className="overflow-hidden mb-4">
              <motion.h1
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-5xl sm:text-6xl md:text-7xl leading-[0.95] tracking-wide text-primary"
              >
                DISCIPLINE
              </motion.h1>
            </div>
            <div className="overflow-hidden mb-8">
              <motion.h1
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-5xl sm:text-6xl md:text-7xl leading-[0.95] tracking-wide text-foreground"
              >
                BUILD CHAMPIONS
              </motion.h1>
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed"
            >
              Train with world-class instructors in a supportive community. 
              Our programs blend traditional values with modern techniques 
              to build real skill and lifelong confidence.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <Button
                variant="hero"
                size="xl"
                onClick={() => scrollToSection("programs")}
                className="group"
              >
                Start Your Journey
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="xl"
                className="group"
                onClick={() => scrollToSection("gallery")}
              >
                <Play className="mr-2 w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                See Training in Action
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-border/50"
            >
              <div>
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Students Trained</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">25+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">98%</div>
                <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
              </div>
            </motion.div>
          </div>

          {/* Right Image Collage */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative w-full h-[500px] lg:h-[600px] flex items-center justify-center"
          >
            <div className="relative w-full h-full">
              {/* Main Image */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="absolute inset-0 rounded-2xl overflow-hidden border-4 border-background/30 shadow-2xl"
              >
                <img
                  src={heroMainImage}
                  alt="Master demonstrating technique"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Top-right accent */}
              <motion.div
                initial={{ x: 20, y: -20, opacity: 0 }}
                animate={{ x: 0, y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="absolute -top-4 -right-4 w-48 h-36 rounded-xl overflow-hidden border-2 border-primary/20 shadow-xl z-10"
              >
                <img
                  src={adultTraining}
                  alt="Adult training session"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
              </motion.div>

              {/* Bottom-left accent */}
              <motion.div
                initial={{ x: -20, y: 20, opacity: 0 }}
                animate={{ x: 0, y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="absolute -bottom-6 -left-6 w-56 h-40 rounded-xl overflow-hidden border-2 border-primary/20 shadow-xl z-10"
              >
                <img
                  src={teenTraining}
                  alt="Teen training session"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-xs text-muted-foreground uppercase tracking-[0.3em]">
          Discover More
        </span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="w-px h-16 bg-gradient-to-b from-primary via-primary/50 to-transparent"
        />
      </motion.div>
    </section>
  );
};
