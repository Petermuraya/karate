import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { X, Trash2, Edit2, Plus } from "lucide-react";
import heroImage from "@/assets/hero-karate.jpg";
import instructorImage from "@/assets/instructor.png";
import useAuth from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase";

const fallbackItems = [
  { id: "1", image_url: heroImage, alt: "Karate training session", span: "col-span-2 row-span-2" },
  { id: "2", image_url: instructorImage, alt: "Sensei demonstration", span: "col-span-1 row-span-1" },
  { id: "3", image_url: heroImage, alt: "Competition moment", span: "col-span-1 row-span-1" },
  { id: "4", image_url: instructorImage, alt: "Belt ceremony", span: "col-span-1 row-span-2" },
  { id: "5", image_url: heroImage, alt: "Kids class", span: "col-span-1 row-span-1" },
  { id: "6", image_url: instructorImage, alt: "Team training", span: "col-span-1 row-span-1" },
];

export const GallerySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { user, profile } = useAuth();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>(fallbackItems);
  const [instructorId, setInstructorId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchGallery = useCallback(async () => {
    if (!user) return;
    try {
      const { data: instr } = await supabase.from("instructors").select("id").eq("user_id", user.id).maybeSingle();
      if (!instr) return;
      setInstructorId(instr.id);
      const { data } = await supabase
        .from("instructor_history")
        .select("id,image_url,caption,created_at")
        .eq("instructor_id", instr.id)
        .order("created_at", { ascending: false });
      if (data && data.length) setItems(data as any[]);
    } catch (err) {
      console.error("fetchGallery", err);
    }
  }, [user]);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  const handleAddClick = () => {
    fileInputRef.current?.click();
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !instructorId || !user) return;
    setUploading(true);
    try {
      const fileName = `${instructorId}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage.from("instructor-history").upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: publicData } = supabase.storage.from("instructor-history").getPublicUrl(fileName);
      const publicUrl = publicData.publicUrl;
      const { data: inserted } = await supabase.from("instructor_history").insert([{ instructor_id: instructorId, image_url: publicUrl, uploaded_by: user.id }]).select().single();
      if (inserted) setItems((s) => [inserted, ...s]);
    } catch (err) {
      console.error("upload error", err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (rowId: string, imageUrl?: string) => {
    if (!confirm("Delete this image?")) return;
    try {
      await supabase.from("instructor_history").delete().eq("id", rowId);
      // attempt to remove storage object if possible
      if (imageUrl && imageUrl.includes("/instructor-history/")) {
        try {
          const idx = imageUrl.indexOf("/instructor-history/");
          const path = decodeURIComponent(imageUrl.substring(idx + "/instructor-history/".length));
          await supabase.storage.from("instructor-history").remove([path]);
        } catch (e) {
          console.warn("failed to remove storage object", e);
        }
      }
      setItems((s) => s.filter((i) => i.id !== rowId));
    } catch (err) {
      console.error("delete", err);
    }
  };

  const handleEditCaption = async (rowId: string, newCaption: string) => {
    try {
      const { data } = await supabase.from("instructor_history").update({ caption: newCaption }).eq("id", rowId).select().single();
      setItems((s) => s.map((it) => (it.id === rowId ? data : it)));
    } catch (err) {
      console.error("edit caption", err);
    }
  };

  return (
    <section id="gallery" className="section-padding bg-background" ref={ref}>
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-widest mb-4 block">Gallery</span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl">
            MOMENTS OF <span className="text-primary">EXCELLENCE</span>
          </h2>
        </motion.div>

        <div className="mb-6 flex justify-end">
          {profile?.role === "instructor" && (
            <>
              <button
                onClick={handleAddClick}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md"
                disabled={uploading}
              >
                <Plus className="w-4 h-4" /> Add Image
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[200px]">
          {items.map((item, index) => (
            <motion.div
              key={item.id ?? index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className={`relative overflow-hidden cursor-pointer group ${item.span || ""}`}
            >
              <img
                src={item.image_url}
                alt={item.alt || item.caption || "Gallery image"}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onClick={() => setSelectedImage(item.image_url)}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {profile?.role === "instructor" && (
                  <>
                    <button
                      title="Edit caption"
                      className="bg-white/80 p-2 rounded-md"
                      onClick={async (e) => {
                        e.stopPropagation();
                        const newCap = prompt("Edit caption", item.caption || "") || "";
                        if (newCap !== null) await handleEditCaption(item.id, newCap);
                      }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      title="Delete"
                      className="bg-white/80 p-2 rounded-md"
                      onClick={async (e) => {
                        e.stopPropagation();
                        await handleDelete(item.id, item.image_url);
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </>
                )}
              </div>
              {item.caption && (
                <div className="absolute bottom-2 left-2 text-white text-sm bg-black/40 px-2 py-1 rounded">{item.caption}</div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white hover:text-primary transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            src={selectedImage}
            alt="Gallery image"
            className="max-w-full max-h-[90vh] object-contain"
          />
        </motion.div>
      )}
    </section>
  );
};