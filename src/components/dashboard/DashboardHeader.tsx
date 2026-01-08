import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import useNotifications from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { Bell, Menu, X, LogOut, User, Home } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function DashboardHeader() {
  const { profile, signOut } = useAuth();
  const { notifications, markAsRead } = useNotifications();
  const unreadCount = (notifications || []).filter((n: any) => !n.is_read).length;
  const navigate = useNavigate();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleNotificationClick = async (id: string) => {
    try {
      await markAsRead(id);
    } catch (e) {
      console.error('Failed to mark notification read', e);
    }
  };

  const getBeltColor = (belt: string) => {
    const colors: Record<string, string> = {
      white: 'bg-white border border-border',
      yellow: 'bg-yellow-400',
      orange: 'bg-orange-500',
      green: 'bg-green-500',
      blue: 'bg-blue-500',
      brown: 'bg-amber-700',
      black: 'bg-black'
    };
    return colors[belt.toLowerCase()] || colors.white;
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="font-display text-primary-foreground text-lg">道</span>
            </div>
            <span className="font-display text-xl text-foreground tracking-wider hidden sm:block">
              IRON FIST DOJO
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-muted-foreground hover:text-foreground flex items-center gap-2">
              <Home className="w-4 h-4" />
              Home
            </Link>
            
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-muted-foreground hover:text-foreground"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-lg shadow-xl overflow-hidden"
                  >
                    <div className="p-3 border-b border-border">
                      <h3 className="font-semibold text-foreground">Notifications</h3>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications?.length === 0 ? (
                        <p className="p-4 text-center text-muted-foreground">No notifications</p>
                      ) : (
                        notifications?.slice(0, 5).map(notification => (
                          <button
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification.id)}
                            className={`w-full p-3 text-left hover:bg-secondary/50 border-b border-border last:border-0 ${
                              !notification.is_read ? 'bg-primary/5' : ''
                            }`}
                          >
                            <p className="font-medium text-foreground text-sm">{notification.title}</p>
                            <p className="text-muted-foreground text-xs mt-1 line-clamp-2">{notification.message ?? notification.body}</p>
                            <p className="text-muted-foreground text-xs mt-2">
                              {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                            </p>
                          </button>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile */}
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded ${getBeltColor(profile?.belt_rank || 'white')}`} />
              <span className="text-foreground font-medium">{profile?.full_name}</span>
            </div>

            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 text-foreground"
          >
            {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pb-4 border-t border-border pt-4"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded ${getBeltColor(profile?.belt_rank || 'white')}`} />
                  <span className="text-foreground font-medium">{profile?.full_name}</span>
                </div>
                
                <Link to="/" className="text-muted-foreground hover:text-foreground flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Home
                </Link>
                
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                >
                  <Bell className="w-4 h-4" />
                  Notifications
                  {unreadCount > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <Button variant="outline" size="sm" onClick={handleSignOut} className="w-fit">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
