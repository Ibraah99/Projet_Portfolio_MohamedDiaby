const API_BASE = 'http://localhost:4000/api';

async function request(path, options = {}) {
  const isFormData = options.body instanceof FormData;
  const { headers: customHeaders = {}, ...restOptions } = options;
  const res = await fetch(`${API_BASE}${path}`, {
    ...restOptions,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...customHeaders
    }
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

export const api = {
  getPublicData: () => request('/public/data'),
  getLatestYouTubeVideos: (limit = 3) => request(`/public/youtube/latest?limit=${limit}`),
  sendContactMessage: (payload) =>
    request('/public/contact', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  adminLogin: (password) =>
    request('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ password })
    }),
  updateArtist: (payload, token) =>
    request('/admin/artist', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    }),
  uploadHeroImage: (payload, token) =>
    request('/admin/artist/hero/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: payload
    }),
  updateContacts: (payload, token) =>
    request('/admin/contacts', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    }),
  authHeaders: (token) => ({ Authorization: `Bearer ${token}` }),
  createEvent: (payload, token) =>
    request('/admin/events', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    }),
  updateEvent: (id, payload, token) =>
    request(`/admin/events/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    }),
  deleteEvent: (id, token) =>
    request(`/admin/events/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    }),
  createImage: (payload, token) =>
    request('/admin/gallery/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: payload
    }),
  updateImage: (id, payload, token) =>
    request(`/admin/gallery/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: payload
    }),
  deleteImage: (id, token) =>
    request(`/admin/gallery/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    }),
  createPartner: (payload, token) =>
    request('/admin/partners/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: payload
    }),
  updatePartner: (id, payload, token) =>
    request(`/admin/partners/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: payload
    }),
  deletePartner: (id, token) =>
    request(`/admin/partners/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    }),
  createTrack: (payload, token) =>
    request('/admin/tracks/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: payload
    }),
  updateTrack: (id, payload, token) =>
    request(`/admin/tracks/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    }),
  deleteTrack: (id, token) =>
    request(`/admin/tracks/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    }),
  getMessages: (token) =>
    request('/admin/messages', {
      headers: { Authorization: `Bearer ${token}` }
    })
};
