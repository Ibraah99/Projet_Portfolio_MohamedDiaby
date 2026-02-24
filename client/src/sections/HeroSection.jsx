import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function HeroSection({ artist, tracks = [] }) {
  const [openPlayer, setOpenPlayer] = useState(false);

  return (
    <section className="relative min-h-[85vh] overflow-hidden">
      <img
        src={artist.heroMediaUrl}
        alt={artist.name}
        className="absolute inset-0 h-full w-full object-cover opacity-35"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-ink" />

      <div className="relative section-shell flex min-h-[85vh] items-end pb-16">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-3xl"
        >
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-gold">Site Officiel</p>
          <h1 className="font-display text-5xl leading-tight text-sand md:text-7xl">{artist.name}</h1>
          <p className="mt-5 text-lg text-sand/85 md:text-xl">
            Dernier titre: <span className="font-semibold text-gold">{artist.latestHit}</span>
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#tour" className="rounded-full bg-gold px-5 py-2 text-sm font-semibold text-ink transition hover:bg-sand">
              Voir la tournée
            </a>
            <a href="#gallery" className="rounded-full border border-gold px-5 py-2 text-sm font-semibold text-gold transition hover:bg-gold hover:text-ink">
              Explorer la galerie
            </a>
            <button
              type="button"
              onClick={() => setOpenPlayer(true)}
              className="rounded-full border border-gold px-5 py-2 text-sm font-semibold text-gold transition hover:bg-gold hover:text-ink"
            >
              Écouter des extraits
            </button>
          </div>
          <div className="mt-6 flex items-end gap-1">
            <span className="eq-bar h-3 w-1 rounded bg-gold/90" />
            <span className="eq-bar h-6 w-1 rounded bg-gold/80" />
            <span className="eq-bar h-4 w-1 rounded bg-gold/70" />
            <span className="eq-bar h-8 w-1 rounded bg-gold/80" />
            <span className="eq-bar h-5 w-1 rounded bg-gold/90" />
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {openPlayer ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 p-4"
            onClick={() => setOpenPlayer(false)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0.2 }}
              className="w-full max-w-2xl rounded-2xl border border-gold/35 bg-panel p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-2xl text-gold">Extraits audio</h3>
                <button
                  type="button"
                  onClick={() => setOpenPlayer(false)}
                  className="rounded-full border border-gold px-3 py-1 text-xs text-gold"
                >
                  Fermer
                </button>
              </div>

              {tracks.length === 0 ? (
                <p className="text-sand/70">Aucun extrait disponible pour le moment.</p>
              ) : (
                <div className="space-y-4">
                  {tracks.map((track) => (
                    <div key={track.id} className="rounded-xl border border-gold/20 bg-black/35 p-3">
                      <p className="mb-2 text-sm font-semibold text-sand">{track.title}</p>
                      <audio controls className="w-full" preload="none" src={track.url}>
                        Votre navigateur ne supporte pas l'audio.
                      </audio>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
