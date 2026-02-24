const fs = require('fs/promises');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data', 'data.json');
const dataDir = path.dirname(dataPath);

const DEFAULT_DATA = {
  artist: {
    name: 'Mohamed Diaby',
    latestHit: '',
    bio: '',
    heroMediaUrl: ''
  },
  contacts: {
    whatsappUrl: '',
    email: '',
    appleMusicUrl: '',
    spotifyUrl: '',
    youtubeUrl: '',
    facebookUrl: '',
    instagramUrl: '',
    tiktokUrl: ''
  },
  events: [],
  gallery: [],
  partners: [],
  tracks: [],
  moods: [],
  messages: []
};

async function ensureDataFile() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(dataPath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(dataPath, JSON.stringify(DEFAULT_DATA, null, 2), 'utf-8');
      return;
    }
    throw error;
  }
}

async function readData() {
  await ensureDataFile();
  const raw = await fs.readFile(dataPath, 'utf-8');
  try {
    return JSON.parse(raw.replace(/^\uFEFF/, ''));
  } catch (error) {
    throw new Error(`data.json invalide: ${error.message}`);
  }
}

async function writeData(data) {
  await ensureDataFile();
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf-8');
}

module.exports = {
  readData,
  writeData,
  dataPath
};
