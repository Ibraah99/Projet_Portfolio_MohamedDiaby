import { useEffect, useState } from 'react';
import { api } from '../services/api';

const emptyEvent = { date: '', city: '', country: '', venue: '', ticketUrl: '' };
const emptyArtist = { name: '', latestHit: '', bio: '', heroMediaUrl: '' };
const emptyContacts = { whatsappUrl: '', email: '', appleMusicUrl: '' };
const emptyPartner = { name: '', websiteUrl: '' };
const emptyTrack = { title: '' };

export default function AdminPage() {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [password, setPassword] = useState('');
  const [state, setState] = useState({ artist: {}, events: [], gallery: [], partners: [], tracks: [], contacts: {} });

  const [artistForm, setArtistForm] = useState(emptyArtist);
  const [contactsForm, setContactsForm] = useState(emptyContacts);
  const [heroFile, setHeroFile] = useState(null);

  const [eventForm, setEventForm] = useState(emptyEvent);
  const [editingEventId, setEditingEventId] = useState('');

  const [imageCaption, setImageCaption] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [editingImageId, setEditingImageId] = useState('');

  const [partnerForm, setPartnerForm] = useState(emptyPartner);
  const [partnerFile, setPartnerFile] = useState(null);
  const [editingPartnerId, setEditingPartnerId] = useState('');

  const [trackForm, setTrackForm] = useState(emptyTrack);
  const [trackFile, setTrackFile] = useState(null);
  const [editingTrackId, setEditingTrackId] = useState('');

  const [message, setMessage] = useState('');

  const load = async () => {
    try {
      const data = await api.getPublicData();
      setState(data);
      setArtistForm({
        name: data.artist?.name || '',
        latestHit: data.artist?.latestHit || '',
        bio: data.artist?.bio || '',
        heroMediaUrl: data.artist?.heroMediaUrl || ''
      });
      setContactsForm({
        whatsappUrl: data.contacts?.whatsappUrl || '',
        email: data.contacts?.email || '',
        appleMusicUrl: data.contacts?.appleMusicUrl || ''
      });
    } catch {
      setMessage('Impossible de charger les données');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const login = async (e) => {
    e.preventDefault();
    try {
      const result = await api.adminLogin(password);
      localStorage.setItem('adminToken', result.token);
      setToken(result.token);
      setPassword('');
      setMessage('Connexion réussie');
    } catch {
      setMessage('Mot de passe invalide');
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setToken('');
  };

  const saveArtist = async (e) => {
    e.preventDefault();
    try {
      await api.updateArtist(artistForm, token);
      await load();
      setMessage('Profil artiste mis à jour');
    } catch (error) {
      setMessage(error.message);
    }
  };

  const saveContacts = async (e) => {
    e.preventDefault();
    try {
      await api.updateContacts(contactsForm, token);
      await load();
      setMessage('Contacts mis à jour');
    } catch (error) {
      setMessage(error.message);
    }
  };

  const uploadHero = async (e) => {
    e.preventDefault();
    if (!heroFile) {
      setMessage('Veuillez sélectionner une image hero');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', heroFile);
      await api.uploadHeroImage(formData, token);
      setHeroFile(null);
      await load();
      setMessage('Image hero mise à jour');
    } catch (error) {
      setMessage(error.message);
    }
  };

  const addEvent = async (e) => {
    e.preventDefault();
    try {
      await api.createEvent(eventForm, token);
      setEventForm(emptyEvent);
      await load();
      setMessage('Concert ajouté');
    } catch (error) {
      setMessage(error.message);
    }
  };

  const startEditEvent = (event) => {
    setEditingEventId(event.id);
    setEventForm({
      date: event.date,
      city: event.city,
      country: event.country,
      venue: event.venue,
      ticketUrl: event.ticketUrl || ''
    });
  };

  const saveEvent = async (e) => {
    e.preventDefault();
    try {
      await api.updateEvent(editingEventId, eventForm, token);
      setEditingEventId('');
      setEventForm(emptyEvent);
      await load();
      setMessage('Concert mis à jour');
    } catch (error) {
      setMessage(error.message);
    }
  };

  const deleteEvent = async (id) => {
    try {
      await api.deleteEvent(id, token);
      await load();
      setMessage('Concert supprimé');
    } catch (error) {
      setMessage(error.message);
    }
  };

  const startEditImage = (image) => {
    setEditingImageId(image.id);
    setImageCaption(image.caption || '');
    setImageFile(null);
  };

  const resetImageForm = () => {
    setEditingImageId('');
    setImageCaption('');
    setImageFile(null);
  };

  const addImage = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      setMessage('Veuillez sélectionner une image');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('caption', imageCaption);
      await api.createImage(formData, token);
      resetImageForm();
      await load();
      setMessage('Image ajoutée');
    } catch (error) {
      setMessage(error.message);
    }
  };

  const saveImage = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('caption', imageCaption);
      if (imageFile) formData.append('image', imageFile);
      await api.updateImage(editingImageId, formData, token);
      resetImageForm();
      await load();
      setMessage('Image mise à jour');
    } catch (error) {
      setMessage(error.message);
    }
  };

  const deleteImage = async (id) => {
    try {
      await api.deleteImage(id, token);
      await load();
      setMessage('Image supprimée');
    } catch (error) {
      setMessage(error.message);
    }
  };

  const addPartner = async (e) => {
    e.preventDefault();
    if (!partnerFile) {
      setMessage('Veuillez sélectionner un logo partenaire');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', partnerForm.name);
      formData.append('websiteUrl', partnerForm.websiteUrl);
      formData.append('image', partnerFile);
      await api.createPartner(formData, token);
      setPartnerForm(emptyPartner);
      setPartnerFile(null);
      await load();
      setMessage('Partenaire ajouté');
    } catch (error) {
      setMessage(error.message);
    }
  };

  const startEditPartner = (partner) => {
    setEditingPartnerId(partner.id);
    setPartnerForm({ name: partner.name, websiteUrl: partner.websiteUrl || '' });
    setPartnerFile(null);
  };

  const savePartner = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', partnerForm.name);
      formData.append('websiteUrl', partnerForm.websiteUrl);
      if (partnerFile) formData.append('image', partnerFile);
      await api.updatePartner(editingPartnerId, formData, token);
      setEditingPartnerId('');
      setPartnerForm(emptyPartner);
      setPartnerFile(null);
      await load();
      setMessage('Partenaire mis à jour');
    } catch (error) {
      setMessage(error.message);
    }
  };

  const deletePartner = async (id) => {
    try {
      await api.deletePartner(id, token);
      await load();
      setMessage('Partenaire supprimé');
    } catch (error) {
      setMessage(error.message);
    }
  };

  const addTrack = async (e) => {
    e.preventDefault();
    if (!trackFile) {
      setMessage('Veuillez sélectionner un fichier audio');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', trackForm.title);
      formData.append('audio', trackFile);
      await api.createTrack(formData, token);
      setTrackForm(emptyTrack);
      setTrackFile(null);
      await load();
      setMessage('Extrait ajouté');
    } catch (error) {
      setMessage(error.message);
    }
  };

  const startEditTrack = (track) => {
    setEditingTrackId(track.id);
    setTrackForm({ title: track.title });
  };

  const saveTrack = async (e) => {
    e.preventDefault();
    try {
      await api.updateTrack(editingTrackId, { title: trackForm.title }, token);
      setEditingTrackId('');
      setTrackForm(emptyTrack);
      await load();
      setMessage('Extrait mis à jour');
    } catch (error) {
      setMessage(error.message);
    }
  };

  const deleteTrack = async (id) => {
    try {
      await api.deleteTrack(id, token);
      await load();
      setMessage('Extrait supprimé');
    } catch (error) {
      setMessage(error.message);
    }
  };

  if (!token) {
    return (
      <div className="section-shell">
        <h1 className="font-display text-3xl text-gold">Connexion Admin</h1>
        <p className="mt-2 text-sand/60">Mot de passe par défaut: 123</p>
        <form onSubmit={login} className="mt-6 max-w-md space-y-4">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Mot de passe"
            className="w-full rounded-lg border border-gold/25 bg-panel px-4 py-3 text-sand"
          />
          <button className="rounded-full bg-gold px-5 py-2 font-semibold text-ink">Se connecter</button>
        </form>
        {message ? <p className="mt-4 text-sm text-sand/80">{message}</p> : null}
      </div>
    );
  }

  return (
    <div className="section-shell space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-gold">Tableau de bord</h1>
        <button onClick={logout} className="rounded-full border border-gold px-4 py-2 text-gold">Déconnexion</button>
      </div>

      {message ? <p className="text-sm text-sand/75">{message}</p> : null}

      <section className="rounded-xl border border-gold/20 bg-panel/70 p-5">
        <h2 className="font-display text-2xl text-sand">Profil artiste</h2>
        <form onSubmit={saveArtist} className="mt-4 grid gap-3 md:grid-cols-2">
          <input type="text" required placeholder="Nom artiste" value={artistForm.name} onChange={(e) => setArtistForm({ ...artistForm, name: e.target.value })} className="rounded bg-black/40 px-3 py-2" />
          <input type="text" required placeholder="Dernier titre" value={artistForm.latestHit} onChange={(e) => setArtistForm({ ...artistForm, latestHit: e.target.value })} className="rounded bg-black/40 px-3 py-2" />
          <input type="url" required placeholder="URL image hero" value={artistForm.heroMediaUrl} onChange={(e) => setArtistForm({ ...artistForm, heroMediaUrl: e.target.value })} className="rounded bg-black/40 px-3 py-2 md:col-span-2" />
          <textarea rows={5} required placeholder="Biographie" value={artistForm.bio} onChange={(e) => setArtistForm({ ...artistForm, bio: e.target.value })} className="rounded bg-black/40 px-3 py-2 md:col-span-2" />
          <button className="w-fit rounded-full bg-gold px-4 py-2 font-semibold text-ink">Enregistrer le profil</button>
        </form>

        <form onSubmit={uploadHero} className="mt-5 flex flex-wrap items-center gap-3">
          <input type="file" accept="image/*" onChange={(e) => setHeroFile(e.target.files?.[0] || null)} className="rounded bg-black/40 px-3 py-2" />
          <button className="rounded-full border border-gold px-4 py-2 font-semibold text-gold">Uploader image hero</button>
        </form>
      </section>

      <section className="rounded-xl border border-gold/20 bg-panel/70 p-5">
        <h2 className="font-display text-2xl text-sand">Contacts footer</h2>
        <form onSubmit={saveContacts} className="mt-4 grid gap-3 md:grid-cols-2">
          <input type="url" required placeholder="Lien WhatsApp" value={contactsForm.whatsappUrl} onChange={(e) => setContactsForm({ ...contactsForm, whatsappUrl: e.target.value })} className="rounded bg-black/40 px-3 py-2 md:col-span-2" />
          <input type="email" required placeholder="Email booking" value={contactsForm.email} onChange={(e) => setContactsForm({ ...contactsForm, email: e.target.value })} className="rounded bg-black/40 px-3 py-2" />
          <input type="url" required placeholder="Lien Apple Music" value={contactsForm.appleMusicUrl} onChange={(e) => setContactsForm({ ...contactsForm, appleMusicUrl: e.target.value })} className="rounded bg-black/40 px-3 py-2" />
          <button className="w-fit rounded-full bg-gold px-4 py-2 font-semibold text-ink">Enregistrer contacts</button>
        </form>
      </section>

      <section className="rounded-xl border border-gold/20 bg-panel/70 p-5">
        <h2 className="font-display text-2xl text-sand">Partenaires</h2>
        <form onSubmit={editingPartnerId ? savePartner : addPartner} className="mt-4 grid gap-3 md:grid-cols-2">
          <input type="text" required placeholder="Nom partenaire" value={partnerForm.name} onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })} className="rounded bg-black/40 px-3 py-2" />
          <input type="url" placeholder="Site web" value={partnerForm.websiteUrl} onChange={(e) => setPartnerForm({ ...partnerForm, websiteUrl: e.target.value })} className="rounded bg-black/40 px-3 py-2" />
          <input type="file" accept="image/*" onChange={(e) => setPartnerFile(e.target.files?.[0] || null)} className="rounded bg-black/40 px-3 py-2 md:col-span-2" />
          <div className="flex gap-3 md:col-span-2">
            <button className="rounded-full bg-gold px-4 py-2 font-semibold text-ink">{editingPartnerId ? 'Enregistrer partenaire' : 'Ajouter partenaire'}</button>
            {editingPartnerId ? <button type="button" onClick={() => { setEditingPartnerId(''); setPartnerForm(emptyPartner); setPartnerFile(null); }} className="rounded-full border border-gold/40 px-4 py-2 text-gold">Annuler</button> : null}
          </div>
        </form>

        <ul className="mt-5 space-y-2">
          {(state.partners || []).map((partner) => (
            <li key={partner.id} className="flex items-center justify-between rounded border border-gold/10 p-3">
              <span className="truncate pr-4">{partner.name}</span>
              <div className="flex gap-4">
                <button onClick={() => startEditPartner(partner)} className="text-sm text-gold">Modifier</button>
                <button onClick={() => deletePartner(partner.id)} className="text-sm text-red-400">Supprimer</button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-gold/20 bg-panel/70 p-5">
        <h2 className="font-display text-2xl text-sand">Extraits audio hero</h2>
        <form onSubmit={editingTrackId ? saveTrack : addTrack} className="mt-4 grid gap-3 md:grid-cols-2">
          <input type="text" required placeholder="Titre extrait" value={trackForm.title} onChange={(e) => setTrackForm({ ...trackForm, title: e.target.value })} className="rounded bg-black/40 px-3 py-2" />
          {!editingTrackId ? <input type="file" accept="audio/*" onChange={(e) => setTrackFile(e.target.files?.[0] || null)} className="rounded bg-black/40 px-3 py-2" /> : <div className="text-xs text-sand/60">Modification du titre uniquement</div>}
          <div className="flex gap-3 md:col-span-2">
            <button className="rounded-full bg-gold px-4 py-2 font-semibold text-ink">{editingTrackId ? 'Enregistrer extrait' : 'Ajouter extrait'}</button>
            {editingTrackId ? <button type="button" onClick={() => { setEditingTrackId(''); setTrackForm(emptyTrack); }} className="rounded-full border border-gold/40 px-4 py-2 text-gold">Annuler</button> : null}
          </div>
        </form>

        <ul className="mt-5 space-y-2">
          {(state.tracks || []).map((track) => (
            <li key={track.id} className="flex items-center justify-between rounded border border-gold/10 p-3">
              <span className="truncate pr-4">{track.title}</span>
              <div className="flex gap-4">
                <button onClick={() => startEditTrack(track)} className="text-sm text-gold">Modifier</button>
                <button onClick={() => deleteTrack(track.id)} className="text-sm text-red-400">Supprimer</button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-gold/20 bg-panel/70 p-5">
        <h2 className="font-display text-2xl text-sand">Gérer les dates de tournée</h2>
        <form onSubmit={editingEventId ? saveEvent : addEvent} className="mt-4 grid gap-3 md:grid-cols-2">
          <input type="date" required value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} className="rounded bg-black/40 px-3 py-2" />
          <input type="text" required placeholder="Ville" value={eventForm.city} onChange={(e) => setEventForm({ ...eventForm, city: e.target.value })} className="rounded bg-black/40 px-3 py-2" />
          <input type="text" required placeholder="Pays" value={eventForm.country} onChange={(e) => setEventForm({ ...eventForm, country: e.target.value })} className="rounded bg-black/40 px-3 py-2" />
          <input type="text" required placeholder="Salle" value={eventForm.venue} onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })} className="rounded bg-black/40 px-3 py-2" />
          <input type="url" placeholder="Lien billetterie" value={eventForm.ticketUrl} onChange={(e) => setEventForm({ ...eventForm, ticketUrl: e.target.value })} className="rounded bg-black/40 px-3 py-2 md:col-span-2" />
          <div className="flex gap-3">
            <button className="w-fit rounded-full bg-gold px-4 py-2 font-semibold text-ink">{editingEventId ? 'Enregistrer' : 'Ajouter'}</button>
            {editingEventId ? <button type="button" onClick={() => { setEditingEventId(''); setEventForm(emptyEvent); }} className="rounded-full border border-gold/40 px-4 py-2 text-gold">Annuler</button> : null}
          </div>
        </form>
        <ul className="mt-5 space-y-2">
          {state.events.map((event) => (
            <li key={event.id} className="flex items-center justify-between rounded border border-gold/10 p-3">
              <span>{event.date} - {event.venue} ({event.city})</span>
              <div className="flex gap-4">
                <button onClick={() => startEditEvent(event)} className="text-sm text-gold">Modifier</button>
                <button onClick={() => deleteEvent(event.id)} className="text-sm text-red-400">Supprimer</button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-gold/20 bg-panel/70 p-5">
        <h2 className="font-display text-2xl text-sand">Gérer la galerie</h2>
        <form onSubmit={editingImageId ? saveImage : addImage} className="mt-4 grid gap-3 md:grid-cols-2">
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="rounded bg-black/40 px-3 py-2 md:col-span-2" />
          <input type="text" placeholder="Légende" value={imageCaption} onChange={(e) => setImageCaption(e.target.value)} className="rounded bg-black/40 px-3 py-2 md:col-span-2" />
          <div className="flex gap-3">
            <button className="w-fit rounded-full bg-gold px-4 py-2 font-semibold text-ink">{editingImageId ? 'Enregistrer image' : 'Ajouter image'}</button>
            {editingImageId ? <button type="button" onClick={resetImageForm} className="rounded-full border border-gold/40 px-4 py-2 text-gold">Annuler</button> : null}
          </div>
          {editingImageId ? <p className="md:col-span-2 text-xs text-sand/70">Laisser le champ fichier vide pour garder l’image actuelle.</p> : null}
        </form>
        <ul className="mt-5 space-y-2">
          {state.gallery.map((image) => (
            <li key={image.id} className="flex items-center justify-between rounded border border-gold/10 p-3">
              <span className="truncate pr-4">{image.caption || image.url}</span>
              <div className="flex gap-4">
                <button onClick={() => startEditImage(image)} className="text-sm text-gold">Modifier</button>
                <button onClick={() => deleteImage(image.id)} className="text-sm text-red-400">Supprimer</button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
