export default function SectionTitle({ eyebrow, title, subtitle }) {
  return (
    <div className="mb-10">
      <p className="text-xs uppercase tracking-[0.35em] text-gold/80">{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl font-semibold text-sand md:text-4xl">{title}</h2>
      {subtitle ? <p className="mt-3 max-w-2xl text-sm text-sand/70 md:text-base">{subtitle}</p> : null}
    </div>
  );
}
