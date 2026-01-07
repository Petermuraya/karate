import { motion } from 'framer-motion';
import { MessageCircle, Mail, Phone, Film, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useIsInstructor } from '@/hooks/useUserRole';

export function QuickActions() {
  const { isInstructor } = useIsInstructor();
  const whatsappNumber = '+254700000000';
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
        {isInstructor && (
          <Link to="/instructor" className="col-span-2">
            <Button className="w-full h-auto py-4 flex gap-2 bg-gradient-to-r from-primary to-gold hover:opacity-90">
              <ShieldCheck className="w-5 h-5" />
              <span>Instructor Panel</span>
            </Button>
          </Link>
        )}

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

        <Link to="/videos">
          <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2 hover:border-primary/50 hover:bg-primary/5">
            <Film className="w-5 h-5 text-primary" />
            <span className="text-xs">Training Videos</span>
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
