import { motion } from 'framer-motion';
import { MessageCircle, Mail, Phone, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function QuickActions() {
  const whatsappNumber = '+254700000000'; // Replace with actual number
  const email = 'info@ironfistdojo.com';
  const phone = '+254 700 000 000';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-card border border-border rounded-xl p-6"
    >
      <h2 className="font-display text-xl text-foreground tracking-wide mb-6">QUICK ACTIONS</h2>

      <div className="grid grid-cols-2 gap-3">
        <a
          href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
            <MessageCircle className="w-5 h-5 text-green-500" />
            <span className="text-xs">WhatsApp</span>
          </Button>
        </a>

        <a href={`mailto:${email}`}>
          <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
            <Mail className="w-5 h-5 text-primary" />
            <span className="text-xs">Email</span>
          </Button>
        </a>

        <a href={`tel:${phone.replace(/\s/g, '')}`}>
          <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
            <Phone className="w-5 h-5 text-gold" />
            <span className="text-xs">Call</span>
          </Button>
        </a>

        <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2" disabled>
          <Video className="w-5 h-5 text-muted-foreground" />
          <span className="text-xs">Training Videos</span>
        </Button>
      </div>

      <div className="mt-4 p-3 bg-primary/10 rounded-lg">
        <p className="text-xs text-muted-foreground text-center">
          Training video library coming soon! 🥋
        </p>
      </div>
    </motion.div>
  );
}
