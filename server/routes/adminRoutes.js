const express = require('express');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs/promises');
const crypto = require('crypto');
const { readData, writeData } = require('../utils/dataStore');
const { config } = require('../config');

const router = express.Router();
const ADMIN_PASSWORD = config.adminPassword;
const JWT_SECRET = config.jwtSecret;

const uploadsDir = path.join(__dirname, '..', 'uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    cb(null, `img_${Date.now()}${ext || '.jpg'}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype || !file.mimetype.startsWith('image/')) {
      return cb(new Error('Fichier image invalide'));
    }
    cb(null, true);
  }
});

const audioStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    cb(null, `aud_${Date.now()}${ext || '.mp3'}`);
  }
});

const uploadAudio = multer({
  storage: audioStorage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype || !file.mimetype.startsWith('audio/')) {
      return cb(new Error('Fichier audio invalide'));
    }
    cb(null, true);
  }
});

function requireAdmin(req, res, next) {
  const authHeader = req.header('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (!token) {
    return res.status(401).json({ error: 'Non autorisé' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.admin = payload;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
}

function safeCompare(a, b) {
  const abuf = Buffer.from(a || '');
  const bbuf = Buffer.from(b || '');
  if (abuf.length !== bbuf.length) return false;
  return crypto.timingSafeEqual(abuf, bbuf);
}

async function deleteLocalImageIfNeeded(url) {
  if (!url || !url.startsWith('/uploads/')) return;
  const filename = path.basename(url);
  const absolute = path.join(uploadsDir, filename);
  try {
    await fs.unlink(absolute);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
}

router.post('/login', (req, res) => {
  const { password } = req.body;

  if (!safeCompare(password, ADMIN_PASSWORD)) {
    return res.status(401).json({ error: 'Mot de passe invalide' });
  }

  const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '8h' });
  res.json({ success: true, token });
});

router.get('/messages', requireAdmin, async (req, res) => {
  try {
    const data = await readData();
    res.json(data.messages || []);
  } catch (error) {
    res.status(500).json({ error: 'Impossible de charger les messages' });
  }
});

router.put('/artist', requireAdmin, async (req, res) => {
  const { name, latestHit, bio, heroMediaUrl } = req.body;

  if (!name || !latestHit || !bio || !heroMediaUrl) {
    return res.status(400).json({ error: 'name, latestHit, bio et heroMediaUrl sont obligatoires' });
  }

  try {
    const data = await readData();
    data.artist = {
      ...data.artist,
      name: String(name).trim(),
      latestHit: String(latestHit).trim(),
      bio: String(bio).trim(),
      heroMediaUrl: String(heroMediaUrl).trim()
    };
    await writeData(data);
    res.json(data.artist);
  } catch (error) {
    res.status(500).json({ error: "Échec de la mise à jour du profil artiste" });
  }
});

router.post('/artist/hero/upload', requireAdmin, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Image obligatoire' });
  }

  try {
    const data = await readData();
    const nextUrl = `/uploads/${req.file.filename}`;
    const previousUrl = data.artist?.heroMediaUrl;

    data.artist = {
      ...data.artist,
      heroMediaUrl: nextUrl
    };
    await writeData(data);
    await deleteLocalImageIfNeeded(previousUrl);

    res.json({ heroMediaUrl: nextUrl });
  } catch (error) {
    res.status(500).json({ error: "Échec de l'upload de l'image hero" });
  }
});

router.put('/contacts', requireAdmin, async (req, res) => {
  const {
    whatsappUrl,
    email,
    appleMusicUrl,
    spotifyUrl,
    youtubeUrl,
    facebookUrl,
    instagramUrl,
    tiktokUrl
  } = req.body;

  if (!whatsappUrl || !email || !appleMusicUrl) {
    return res.status(400).json({ error: 'whatsappUrl, email et appleMusicUrl sont obligatoires' });
  }

  try {
    const data = await readData();
    data.contacts = {
      whatsappUrl: String(whatsappUrl).trim(),
      email: String(email).trim(),
      appleMusicUrl: String(appleMusicUrl).trim(),
      spotifyUrl: String(spotifyUrl || '').trim(),
      youtubeUrl: String(youtubeUrl || '').trim(),
      facebookUrl: String(facebookUrl || '').trim(),
      instagramUrl: String(instagramUrl || '').trim(),
      tiktokUrl: String(tiktokUrl || '').trim()
    };
    await writeData(data);
    res.json(data.contacts);
  } catch (error) {
    res.status(500).json({ error: 'Échec de mise à jour des contacts' });
  }
});

router.post('/partners/upload', requireAdmin, upload.single('image'), async (req, res) => {
  const { name, websiteUrl } = req.body;

  if (!name || !req.file) {
    return res.status(400).json({ error: 'name et image sont obligatoires' });
  }

  try {
    const data = await readData();
    if (!Array.isArray(data.partners)) data.partners = [];
    const partner = {
      id: `partner_${Date.now()}`,
      name: String(name).trim(),
      websiteUrl: String(websiteUrl || '').trim(),
      logoUrl: `/uploads/${req.file.filename}`
    };
    data.partners.push(partner);
    await writeData(data);
    res.status(201).json(partner);
  } catch (error) {
    res.status(500).json({ error: 'Échec de création partenaire' });
  }
});

router.put('/partners/:id', requireAdmin, upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, websiteUrl } = req.body;

  try {
    const data = await readData();
    if (!Array.isArray(data.partners)) data.partners = [];
    const index = data.partners.findIndex((p) => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Partenaire introuvable' });
    }

    const existing = data.partners[index];
    const updated = {
      ...existing,
      name: name !== undefined ? String(name).trim() : existing.name,
      websiteUrl: websiteUrl !== undefined ? String(websiteUrl).trim() : existing.websiteUrl
    };

    if (req.file) {
      await deleteLocalImageIfNeeded(existing.logoUrl);
      updated.logoUrl = `/uploads/${req.file.filename}`;
    }

    data.partners[index] = updated;
    await writeData(data);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Échec de mise à jour partenaire' });
  }
});

router.delete('/partners/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const data = await readData();
    if (!Array.isArray(data.partners)) data.partners = [];
    const partner = data.partners.find((p) => p.id === id);
    if (!partner) {
      return res.status(404).json({ error: 'Partenaire introuvable' });
    }

    data.partners = data.partners.filter((p) => p.id !== id);
    await writeData(data);
    await deleteLocalImageIfNeeded(partner.logoUrl);
    res.json({ message: 'Partenaire supprimé' });
  } catch (error) {
    res.status(500).json({ error: 'Échec de suppression partenaire' });
  }
});

router.post('/tracks/upload', requireAdmin, uploadAudio.single('audio'), async (req, res) => {
  const { title } = req.body;

  if (!title || !req.file) {
    return res.status(400).json({ error: 'title et audio sont obligatoires' });
  }

  try {
    const data = await readData();
    if (!Array.isArray(data.tracks)) data.tracks = [];
    const track = {
      id: `track_${Date.now()}`,
      title: String(title).trim(),
      url: `/uploads/${req.file.filename}`
    };
    data.tracks.push(track);
    await writeData(data);
    res.status(201).json(track);
  } catch (error) {
    res.status(500).json({ error: 'Échec de création extrait audio' });
  }
});

router.put('/tracks/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  try {
    const data = await readData();
    if (!Array.isArray(data.tracks)) data.tracks = [];
    const index = data.tracks.findIndex((t) => t.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Extrait introuvable' });
    }

    data.tracks[index] = {
      ...data.tracks[index],
      title: title !== undefined ? String(title).trim() : data.tracks[index].title
    };
    await writeData(data);
    res.json(data.tracks[index]);
  } catch (error) {
    res.status(500).json({ error: 'Échec de mise à jour extrait' });
  }
});

router.delete('/tracks/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const data = await readData();
    if (!Array.isArray(data.tracks)) data.tracks = [];
    const track = data.tracks.find((t) => t.id === id);
    if (!track) {
      return res.status(404).json({ error: 'Extrait introuvable' });
    }

    data.tracks = data.tracks.filter((t) => t.id !== id);
    await writeData(data);
    await deleteLocalImageIfNeeded(track.url);
    res.json({ message: 'Extrait supprimé' });
  } catch (error) {
    res.status(500).json({ error: 'Échec de suppression extrait' });
  }
});

router.post('/events', requireAdmin, async (req, res) => {
  const { date, city, country, venue, ticketUrl } = req.body;

  if (!date || !city || !country || !venue) {
    return res.status(400).json({ error: 'date, city, country et venue sont obligatoires' });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(date))) {
    return res.status(400).json({ error: 'Format de date invalide (YYYY-MM-DD attendu)' });
  }

  try {
    const data = await readData();
    const event = {
      id: `ev_${Date.now()}`,
      date: String(date).trim(),
      city: String(city).trim(),
      country: String(country).trim(),
      venue: String(venue).trim(),
      ticketUrl: String(ticketUrl || '').trim()
    };

    data.events.push(event);
    await writeData(data);

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: "Échec de l'ajout du concert" });
  }
});

router.put('/events/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const data = await readData();
    const index = data.events.findIndex((event) => event.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Concert introuvable' });
    }

    data.events[index] = { ...data.events[index], ...req.body, id };
    await writeData(data);

    res.json(data.events[index]);
  } catch (error) {
    res.status(500).json({ error: 'Échec de la mise à jour du concert' });
  }
});

router.delete('/events/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const data = await readData();
    const filteredEvents = data.events.filter((event) => event.id !== id);

    if (filteredEvents.length === data.events.length) {
      return res.status(404).json({ error: 'Concert introuvable' });
    }

    data.events = filteredEvents;
    await writeData(data);

    res.json({ message: 'Concert supprimé' });
  } catch (error) {
    res.status(500).json({ error: 'Échec de la suppression du concert' });
  }
});

router.post('/moods', requireAdmin, async (req, res) => {
  const { label, emoji, text, color, mediaType, mediaUrl } = req.body;

  if (!label || !emoji || !text || !color) {
    return res.status(400).json({ error: 'label, emoji, text et color sont obligatoires' });
  }

  const normalizedMediaType = mediaType || 'none';
  const allowedMediaTypes = ['none', 'audio', 'youtube', 'tiktok'];
  if (!allowedMediaTypes.includes(normalizedMediaType)) {
    return res.status(400).json({ error: 'mediaType invalide' });
  }
  if (normalizedMediaType !== 'none' && !mediaUrl) {
    return res.status(400).json({ error: 'mediaUrl est obligatoire quand mediaType est défini' });
  }

  try {
    const data = await readData();
    if (!Array.isArray(data.moods)) data.moods = [];

    const mood = {
      id: `mood_${Date.now()}`,
      label,
      emoji,
      text,
      color,
      mediaType: normalizedMediaType,
      mediaUrl: mediaUrl || ''
    };

    data.moods.push(mood);
    await writeData(data);

    res.status(201).json(mood);
  } catch (error) {
    res.status(500).json({ error: "Échec de l'ajout de l'ambiance" });
  }
});

router.put('/moods/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const data = await readData();
    if (!Array.isArray(data.moods)) data.moods = [];
    const index = data.moods.findIndex((mood) => mood.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Ambiance introuvable' });
    }

    const nextMood = { ...data.moods[index], ...req.body, id };
    const normalizedMediaType = nextMood.mediaType || 'none';
    const allowedMediaTypes = ['none', 'audio', 'youtube', 'tiktok'];
    if (!allowedMediaTypes.includes(normalizedMediaType)) {
      return res.status(400).json({ error: 'mediaType invalide' });
    }
    if (normalizedMediaType !== 'none' && !nextMood.mediaUrl) {
      return res.status(400).json({ error: 'mediaUrl est obligatoire quand mediaType est défini' });
    }
    if (normalizedMediaType === 'none') {
      nextMood.mediaUrl = '';
    }
    nextMood.mediaType = normalizedMediaType;
    data.moods[index] = nextMood;
    await writeData(data);

    res.json(data.moods[index]);
  } catch (error) {
    res.status(500).json({ error: "Échec de la mise à jour de l'ambiance" });
  }
});

router.delete('/moods/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const data = await readData();
    if (!Array.isArray(data.moods)) data.moods = [];
    const filteredMoods = data.moods.filter((mood) => mood.id !== id);

    if (filteredMoods.length === data.moods.length) {
      return res.status(404).json({ error: 'Ambiance introuvable' });
    }

    data.moods = filteredMoods;
    await writeData(data);

    res.json({ message: 'Ambiance supprimée' });
  } catch (error) {
    res.status(500).json({ error: "Échec de la suppression de l'ambiance" });
  }
});

router.post('/gallery/upload', requireAdmin, upload.single('image'), async (req, res) => {
  const { caption } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: 'Image obligatoire' });
  }

  try {
    const data = await readData();
    const image = {
      id: `img_${Date.now()}`,
      url: `/uploads/${req.file.filename}`,
      caption: caption || ''
    };

    data.gallery.push(image);
    await writeData(data);

    res.status(201).json(image);
  } catch (error) {
    res.status(500).json({ error: "Échec de l'ajout de l'image" });
  }
});

router.put('/gallery/:id', requireAdmin, upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { caption } = req.body;

  try {
    const data = await readData();
    const index = data.gallery.findIndex((image) => image.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Image introuvable' });
    }

    const existing = data.gallery[index];
    const updated = {
      ...existing,
      caption: caption ?? existing.caption
    };

    if (req.file) {
      await deleteLocalImageIfNeeded(existing.url);
      updated.url = `/uploads/${req.file.filename}`;
    }

    data.gallery[index] = updated;
    await writeData(data);

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Échec de la mise à jour de l'image" });
  }
});

router.delete('/gallery/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const data = await readData();
    const image = data.gallery.find((item) => item.id === id);

    if (!image) {
      return res.status(404).json({ error: 'Image introuvable' });
    }

    data.gallery = data.gallery.filter((item) => item.id !== id);
    await writeData(data);
    await deleteLocalImageIfNeeded(image.url);

    res.json({ message: 'Image supprimée' });
  } catch (error) {
    res.status(500).json({ error: "Échec de la suppression de l'image" });
  }
});

module.exports = router;
