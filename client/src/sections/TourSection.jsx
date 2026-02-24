import { motion } from 'framer-motion';
import SectionTitle from '../components/SectionTitle';

export default function TourSection({ events }) {
  return (
    <section id="tour" className="section-shell">
      <SectionTitle
        eyebrow="En Live"
        title="Dates de Tournée"
        subtitle="Découvre les prochains concerts et réserve tes places."
      />

      <div className="space-y-4">
        {events.map((event, i) => (
          <motion.article
            key={event.id}
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.05 }}
            className="grid gap-4 rounded-xl border border-gold/30 bg-panel/70 p-5 shadow-glow md:grid-cols-[180px_1fr_auto] md:items-center"
          >
            <p className="font-display text-lg text-gold">{event.date}</p>
            <div>
              <p className="text-lg font-semibold text-sand">{event.venue}</p>
              <p className="text-sand/70">
                {event.city}, {event.country}
              </p>
            </div>
            {event.ticketUrl ? (
              <a
                href={event.ticketUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-full border border-gold px-4 py-2 text-sm font-semibold text-gold transition hover:bg-gold hover:text-ink"
              >
                Billets
              </a>
            ) : (
              <span className="text-sm text-sand/50">Bientôt disponible</span>
            )}
          </motion.article>
        ))}
      </div>
    </section>
  );
}
