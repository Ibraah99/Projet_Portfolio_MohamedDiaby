import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SectionTitle from '../components/SectionTitle';
import { api } from '../services/api';

const channelUrl = 'https://www.youtube.com/channel/UCTZsHa5xNhJwlhEDrpds8ng';

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default function YouTubeCatalogSection() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [limit, setLimit] = useState(3);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    setLoading(true);
    api
      .getLatestYouTubeVideos(limit)
      .then((result) => {
        setVideos(result.videos || []);
        setError('');
      })
      .catch(() => {
        setError('Impossible de charger les dernières vidéos pour le moment.');
      })
      .finally(() => setLoading(false));
  }, [limit]);

  const canLoadMore = videos.length >= limit && limit < 9;

  return (
    <section id="videos" className="section-shell pt-10">
      <SectionTitle
        eyebrow="Vidéos"
        title="Dernières sorties YouTube"
        subtitle="Découvre les dernières vidéos en damier, puis ouvre celle que tu veux en grand lecteur."
      />

      {loading ? <p className="text-sand/70">Chargement des vidéos...</p> : null}
      {error ? <p className="text-red-400">{error}</p> : null}

      {videos.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-3">
          {videos.map((video) => (
            <article key={video.videoId} className="overflow-hidden rounded-2xl border border-gold/25 bg-panel/70">
              <button
                type="button"
                onClick={() => setSelectedVideo(video)}
                className="group relative block w-full"
              >
                <img src={video.thumbnailUrl} alt={video.title} className="aspect-video w-full object-cover" />
                <span className="absolute inset-0 bg-black/30 transition group-hover:bg-black/10" />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold px-3 py-2 text-xs font-bold text-ink">
                  Lire
                </span>
              </button>
              <div className="p-4">
                <p className="text-sm font-semibold text-sand">{video.title}</p>
                <p className="mt-1 text-xs text-sand/60">{formatDate(video.published)}</p>
                <a
                  href={video.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block rounded-full border border-gold px-3 py-1 text-xs font-semibold text-gold transition hover:bg-gold hover:text-ink"
                >
                  Voir sur YouTube
                </a>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-3">
        {canLoadMore ? (
          <button
            type="button"
            onClick={() => setLimit((v) => Math.min(v + 3, 9))}
            className="rounded-full bg-gold px-5 py-2 text-sm font-semibold text-ink transition hover:bg-sand"
          >
            Voir plus
          </button>
        ) : null}
        <a
          href={channelUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-gold px-5 py-2 text-sm font-semibold text-gold transition hover:bg-gold hover:text-ink"
        >
          Ouvrir la chaîne
        </a>
      </div>

      <AnimatePresence>
        {selectedVideo ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <div className="w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
              <div className="mb-3 flex items-center justify-between">
                <p className="pr-3 text-sm font-semibold text-sand">{selectedVideo.title}</p>
                <button
                  type="button"
                  onClick={() => setSelectedVideo(null)}
                  className="rounded-full border border-gold px-3 py-1 text-xs text-gold"
                >
                  Fermer
                </button>
              </div>
              <iframe
                className="aspect-video w-full rounded-xl"
                src={selectedVideo.embedUrl}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
