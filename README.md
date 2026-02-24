# Mohamed Diaby Portfolio

Site portfolio full-stack:
- Frontend: React + Vite + Tailwind CSS + Framer Motion
- Backend: Node.js + Express
- Stockage: `server/data/data.json` + fichiers locaux `server/uploads/`

## Installation

```bash
npm install
npm install --prefix server
npm install --prefix client
```

## Lancement local

```bash
npm run dev
```

URLs locales:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`
- Admin: `http://localhost:5173/admin`

## Variables d'environnement

Copier `server/.env.example` vers `server/.env` puis adapter:

```bash
cp server/.env.example server/.env
```

Variables:
- `NODE_ENV`: `production` en prod
- `PORT`: port API
- `ADMIN_PASSWORD`: mot de passe admin
- `JWT_SECRET`: secret JWT fort
- `CORS_ORIGINS`: domaines frontend autorisés (CSV)

## Sécurité ajoutée

- Helmet activé (headers sécurité)
- CORS configurable et restreint en production
- Rate limit sur `POST /api/admin/login`
- JWT admin signé avec secret environnement
- Vérification `timingSafeEqual` pour mot de passe
- Validation upload image/audio + limites de taille

## API principale

Public:
- `GET /api/public/data`
- `GET /api/public/youtube/latest?limit=3`
- `POST /api/public/contact`

Admin:
- `POST /api/admin/login`
- `PUT /api/admin/artist`
- `POST /api/admin/artist/hero/upload`
- `PUT /api/admin/contacts`
- `POST /api/admin/partners/upload`
- `PUT /api/admin/partners/:id`
- `DELETE /api/admin/partners/:id`
- `POST /api/admin/tracks/upload`
- `PUT /api/admin/tracks/:id`
- `DELETE /api/admin/tracks/:id`
- `POST /api/admin/events`
- `PUT /api/admin/events/:id`
- `DELETE /api/admin/events/:id`
- `POST /api/admin/gallery/upload`
- `PUT /api/admin/gallery/:id`
- `DELETE /api/admin/gallery/:id`

## Déploiement (recommandé)

1. Build frontend:
```bash
npm --prefix client run build
```

2. Lancer API en prod:
```bash
npm --prefix server run start
```

3. Servir le frontend (`client/dist`) via Nginx/Netlify/Vercel.

4. Mettre HTTPS + reverse proxy vers l'API.

5. Monter un volume persistant pour:
- `server/data/data.json`
- `server/uploads/`

## Vérifications avant mise en ligne

- Login admin OK
- Upload hero/galerie/partenaires/audio OK
- Modif bio et contacts footer OK
- Carrousel partenaires visible
- Popup extraits audio hero fonctionnel
- Section YouTube charge les vidéos récentes
