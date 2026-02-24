import { useState } from 'react';
import SectionTitle from '../components/SectionTitle';
import { api } from '../services/api';

const initialForm = { name: '', email: '', message: '' };

export default function ContactSection() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      await api.sendContactMessage(form);
      setForm(initialForm);
      setStatus('success');
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="section-shell pb-24">
      <SectionTitle
        eyebrow="Réservation"
        title="Contact"
        subtitle="Pour les réservations, collaborations et demandes management."
      />

      <form onSubmit={handleSubmit} className="grid gap-4 rounded-2xl border border-gold/25 bg-panel/80 p-6 md:grid-cols-2">
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          type="text"
          required
          placeholder="Votre nom"
          className="rounded-lg border border-gold/20 bg-black/50 px-4 py-3 text-sand outline-none ring-gold/70 transition focus:ring"
        />
        <input
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          type="email"
          required
          placeholder="Votre email"
          className="rounded-lg border border-gold/20 bg-black/50 px-4 py-3 text-sand outline-none ring-gold/70 transition focus:ring"
        />
        <textarea
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
          rows={5}
          placeholder="Votre message"
          className="md:col-span-2 rounded-lg border border-gold/20 bg-black/50 px-4 py-3 text-sand outline-none ring-gold/70 transition focus:ring"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="md:col-span-2 w-fit rounded-full bg-gold px-6 py-3 font-semibold text-ink transition hover:bg-sand disabled:opacity-60"
        >
          {status === 'loading' ? 'Envoi...' : 'Envoyer le message'}
        </button>
        {status === 'success' ? <p className="md:col-span-2 text-sm text-green-400">Message envoyé.</p> : null}
        {status === 'error' ? <p className="md:col-span-2 text-sm text-red-400">Échec de l'envoi du message.</p> : null}
      </form>
    </section>
  );
}
