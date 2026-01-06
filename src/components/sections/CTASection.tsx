import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Mail, ArrowRight } from "lucide-react";

export const CTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const whatsappNumber = '+254700000000';

  return (
    <section id="contact" className="relative overflow-hidden" ref={ref}>
      {/* Red background CTA */}
      <div className="bg-primary section-padding">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl text-primary-foreground mb-6">
              TRAIN WITH PURPOSE
            </h2>
            
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
              Your first class is free. Experience the Iron Fist difference and begin your martial arts journey today.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <a
                href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="dark" size="xl" className="group w-full sm:w-auto">
                  <MessageCircle className="mr-2 w-5 h-5" />
                  WhatsApp
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </a>
              <a href="mailto:info@ironfistdojo.com">
                <Button 
                  size="xl" 
                  className="bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary w-full sm:w-auto"
                >
                  <Mail className="mr-2 w-5 h-5" />
                  Email Us
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-background border-t border-border p-4">
        <Link to="/auth">
          <Button variant="hero" size="lg" className="w-full">
            Claim Free Trial
            <ArrowRight className="ml-2" />
          </Button>
        </Link>
      </div>
    </section>
  );
};
