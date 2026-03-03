import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import SectionTitle from '../components/SectionTitle';

export default function BioSection({ bio }) {
  const [expanded, setExpanded] = useState(false);
  const normalizedBio = String(bio || '').trim();
  const shortBio = useMemo(() => {
    if (normalizedBio.length <= 420) return normalizedBio;
    return `${normalizedBio.slice(0, 420).trim()}...`;
  }, [normalizedBio]);

  const displayedBio = expanded ? normalizedBio : shortBio;
  const canToggle = normalizedBio.length > 420;

  return (
    <section id="bio" className="section-shell">
      <SectionTitle eyebrow="L'Artiste" title="Biographie" />
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl text-lg leading-relaxed text-sand/80"
      >
        {displayedBio}
      </motion.p>
      {canToggle ? (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-4 rounded-full border border-gold/40 px-4 py-2 text-sm text-gold hover:bg-gold/10"
        >
          {expanded ? 'Lire moins' : 'Lire plus'}
        </button>
      ) : null}
      <div className="gold-line mt-10" />
    </section>
  );
}
