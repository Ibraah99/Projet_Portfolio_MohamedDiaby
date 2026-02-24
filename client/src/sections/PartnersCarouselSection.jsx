import SectionTitle from '../components/SectionTitle';

export default function PartnersCarouselSection({ partners = [] }) {
  if (!partners.length) return null;

  const duplicated = [...partners, ...partners];

  return (
    <section id="partners" className="section-shell pt-8">
      <SectionTitle
        eyebrow="Réseau"
        title="Partenaires"
        subtitle="Un écosystème artistique et professionnel engagé autour de Mohamed Diaby."
      />

      <div className="relative overflow-hidden rounded-2xl border border-gold/25 bg-panel/70 py-5">
        <div className="partner-fade-left" />
        <div className="partner-fade-right" />

        <div className="partner-track flex gap-4 px-4">
          {duplicated.map((partner, idx) => (
            <a
              key={`${partner.id}_${idx}`}
              href={partner.websiteUrl || '#'}
              target={partner.websiteUrl ? '_blank' : undefined}
              rel={partner.websiteUrl ? 'noreferrer' : undefined}
              className="flex min-w-[240px] items-center gap-3 rounded-xl border border-gold/25 bg-black/40 p-4 transition hover:border-gold hover:bg-black/60"
            >
              <img src={partner.logoUrl} alt={partner.name} className="h-12 w-12 rounded-lg object-cover" />
              <div>
                <p className="text-sm font-semibold text-sand">{partner.name}</p>
                <p className="text-xs text-gold/85">Partenaire officiel</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
