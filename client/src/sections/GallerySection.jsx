import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SectionTitle from '../components/SectionTitle';

export default function GallerySection({ gallery }) {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const closeModal = () => setSelectedIndex(null);
  const showPrev = () => setSelectedIndex((idx) => (idx === null ? null : (idx - 1 + gallery.length) % gallery.length));
  const showNext = () => setSelectedIndex((idx) => (idx === null ? null : (idx + 1) % gallery.length));

  return (
    <section id="gallery" className="section-shell">
      <SectionTitle eyebrow="Visuel" title="Galerie" subtitle="Clique sur une image pour l'ouvrir en plein écran." />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {gallery.map((item, i) => (
          <motion.figure
            key={item.id}
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.06 }}
            className="cursor-pointer overflow-hidden rounded-xl border border-gold/20 bg-panel"
            onClick={() => setSelectedIndex(i)}
          >
            <img src={item.url} alt={item.caption || 'Image de galerie'} className="h-64 w-full object-cover" />
            {item.caption ? <figcaption className="p-3 text-sm text-sand/75">{item.caption}</figcaption> : null}
          </motion.figure>
        ))}
      </div>

      <AnimatePresence>
        {selectedIndex !== null ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-4"
            onClick={closeModal}
          >
            <button type="button" className="absolute right-5 top-5 rounded-full border border-gold px-3 py-1 text-gold" onClick={closeModal}>
              Fermer
            </button>

            <button
              type="button"
              className="absolute left-4 rounded-full border border-gold/70 px-3 py-2 text-gold"
              onClick={(e) => {
                e.stopPropagation();
                showPrev();
              }}
            >
              ◀
            </button>

            <motion.figure
              key={gallery[selectedIndex].id}
              initial={{ opacity: 0.2, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="max-h-[90vh] w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={gallery[selectedIndex].url}
                alt={gallery[selectedIndex].caption || 'Image'}
                className="max-h-[80vh] w-full rounded-xl object-contain"
              />
              {gallery[selectedIndex].caption ? (
                <figcaption className="mt-3 text-center text-sm text-sand/75">{gallery[selectedIndex].caption}</figcaption>
              ) : null}
            </motion.figure>

            <button
              type="button"
              className="absolute right-4 rounded-full border border-gold/70 px-3 py-2 text-gold"
              onClick={(e) => {
                e.stopPropagation();
                showNext();
              }}
            >
              ▶
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
