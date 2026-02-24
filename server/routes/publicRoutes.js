const express = require('express');
const { readData, writeData } = require('../utils/dataStore');

const router = express.Router();
const YOUTUBE_CHANNEL_ID = 'UCTZsHa5xNhJwlhEDrpds8ng';

function toAbsoluteMediaUrl(req, url) {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${req.protocol}://${req.get('host')}${url}`;
}

function decodeXml(value = '') {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function extractTag(block, tagName) {
  const match = block.match(new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`));
  return match?.[1]?.trim() || '';
}

router.get('/youtube/latest', async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 3, 10);

  try {
    const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;
    const response = await fetch(feedUrl);
    if (!response.ok) {
      return res.status(502).json({ error: 'Impossible de récupérer le flux YouTube' });
    }

    const xml = await response.text();
    const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) || [];

    const videos = entries.slice(0, limit).map((entry) => {
      const videoId = extractTag(entry, 'yt:videoId');
      const title = decodeXml(extractTag(entry, 'title'));
      const published = extractTag(entry, 'published');
      const link = (entry.match(/<link[^>]*href="([^"]+)"/) || [])[1] || `https://www.youtube.com/watch?v=${videoId}`;

      return {
        videoId,
        title,
        published,
        url: link,
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
        thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
      };
    });

    res.json({ channelId: YOUTUBE_CHANNEL_ID, videos });
  } catch (error) {
    res.status(500).json({ error: 'Échec de récupération des vidéos YouTube' });
  }
});

router.get('/data', async (req, res) => {
  try {
    const data = await readData();
    res.json({
      artist: {
        ...data.artist,
        heroMediaUrl: toAbsoluteMediaUrl(req, data.artist?.heroMediaUrl)
      },
      contacts: data.contacts || {},
      events: data.events,
      moods: data.moods || [],
      partners: (data.partners || []).map((partner) => ({
        ...partner,
        logoUrl: toAbsoluteMediaUrl(req, partner.logoUrl)
      })),
      tracks: (data.tracks || []).map((track) => ({
        ...track,
        url: toAbsoluteMediaUrl(req, track.url)
      })),
      gallery: (data.gallery || []).map((item) => ({
        ...item,
        url: toAbsoluteMediaUrl(req, item.url)
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Impossible de charger les données publiques' });
  }
});

router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'name, email et message sont obligatoires' });
  }

  try {
    const data = await readData();

    const newMessage = {
      id: `msg_${Date.now()}`,
      name,
      email,
      message,
      createdAt: new Date().toISOString()
    };

    data.messages.push(newMessage);
    await writeData(data);

    res.status(201).json({ message: 'Message envoyé avec succès' });
  } catch (error) {
    res.status(500).json({ error: "Échec de l'envoi du message" });
  }
});

module.exports = router;
