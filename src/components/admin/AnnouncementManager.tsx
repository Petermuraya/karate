import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Megaphone, Clock, Eye, EyeOff } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAllAnnouncements, useCreateAnnouncement, useUpdateAnnouncement, useDeleteAnnouncement } from '@/hooks/useAdminData';

interface AnnouncementFormData {
  title: string;
  content: string;
  priority: string;
  expires_at: string;
  is_published: boolean;
}

const defaultFormData: AnnouncementFormData = {
  title: '',
  content: '',
  priority: 'normal',
  expires_at: '',
  is_published: true
};

const priorityColors: Record<string, string> = {
  low: 'bg-muted text-muted-foreground',
  normal: 'bg-primary/10 text-primary',
  high: 'bg-gold/10 text-gold',
  urgent: 'bg-destructive/10 text-destructive'
};

export function AnnouncementManager() {
  const { data: announcements, isLoading } = useAllAnnouncements();
  const createAnnouncement = useCreateAnnouncement();
  const updateAnnouncement = useUpdateAnnouncement();
  const deleteAnnouncement = useDeleteAnnouncement();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<AnnouncementFormData>(defaultFormData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      expires_at: formData.expires_at || null
    };
    
    try {
      if (editingId) {
        await updateAnnouncement.mutateAsync({ id: editingId, ...payload });
        toast({ title: 'Announcement updated successfully!' });
      } else {
        await createAnnouncement.mutateAsync(payload);
        toast({ title: 'Announcement created successfully!' });
      }
      setIsDialogOpen(false);
      setEditingId(null);
      setFormData(defaultFormData);
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to save announcement',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (announcement: any) => {
    setEditingId(announcement.id);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority || 'normal',
      expires_at: announcement.expires_at?.split('T')[0] || '',
      is_published: announcement.is_published
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    
    try {
      await deleteAnnouncement.mutateAsync(id);
      toast({ title: 'Announcement deleted successfully!' });
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to delete announcement',
        variant: 'destructive'
      });
    }
  };

  const handleTogglePublished = async (id: string, currentStatus: boolean) => {
    try {
      await updateAnnouncement.mutateAsync({ id, is_published: !currentStatus });
      toast({ title: `Announcement ${!currentStatus ? 'published' : 'unpublished'}` });
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to update announcement',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl text-foreground tracking-wide">ANNOUNCEMENTS</h2>
          <p className="text-muted-foreground">Create and manage dojo announcements</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingId(null);
            setFormData(defaultFormData);
          }
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display tracking-wide">
                {editingId ? 'EDIT ANNOUNCEMENT' : 'NEW ANNOUNCEMENT'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Announcement title..."
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Announcement details..."
                  rows={4}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Priority</Label>
                  <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="expires_at">Expires (optional)</Label>
                  <Input
                    id="expires_at"
                    type="date"
                    value={formData.expires_at}
                    onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Switch
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                />
                <Label htmlFor="is_published">Publish immediately</Label>
              </div>
              
              <Button type="submit" className="w-full" disabled={createAnnouncement.isPending || updateAnnouncement.isPending}>
                {editingId ? 'Update Announcement' : 'Create Announcement'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <div className="space-y-4">
          {(announcements || []).map((announcement: any) => (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-card border border-border rounded-xl p-4 ${!announcement.is_published ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Megaphone className="w-4 h-4 text-primary" />
                    <h3 className="font-medium text-foreground">{announcement.title}</h3>
                    <Badge className={priorityColors[announcement.priority || 'normal']}>
                      {announcement.priority || 'normal'}
                    </Badge>
                    {!announcement.is_published && (
                      <Badge variant="outline" className="gap-1">
                        <EyeOff className="w-3 h-3" />
                        Draft
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm mb-2">{announcement.content}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(announcement.created_at), { addSuffix: true })}
                    </span>
                    {announcement.expires_at && (
                      <span>
                        Expires: {format(new Date(announcement.expires_at), 'MMM d, yyyy')}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleTogglePublished(announcement.id, announcement.is_published)}
                  >
                    {announcement.is_published ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(announcement)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(announcement.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
          
          {(announcements || []).length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Megaphone className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No announcements yet.</p>
              <p className="text-sm">Click "New Announcement" to create one.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
