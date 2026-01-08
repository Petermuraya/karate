import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { X } from "lucide-react";
import heroImage from "@/assets/hero-karate.jpg";
import instructorImage from "@/assets/instructor.png";

const galleryItems = [
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[200px]">
          {galleryItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className={`relative overflow-hidden cursor-pointer group ${item.span || ""}`}
              onClick={() => setSelectedImage(item.image_url)}
            >
              <img
                src={item.image_url}
                alt={item.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
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
