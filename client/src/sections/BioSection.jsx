import { motion } from 'framer-motion';
import SectionTitle from '../components/SectionTitle';

export default function BioSection({ bio }) {
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
        {bio}
      </motion.p>
      <div className="gold-line mt-10" />
    </section>
  );
}
