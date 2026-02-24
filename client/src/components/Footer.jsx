const fallbackSocialLinks = [
  {
    label: 'Spotify',
    url: 'https://open.spotify.com/intl-fr/artist/1CHqRXInztOmKRYFbpw8Cs/discography/all?edv=1',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
        <path d="M12 1.75a10.25 10.25 0 1 0 0 20.5 10.25 10.25 0 0 0 0-20.5Zm4.63 14.75a.75.75 0 0 1-1.04.24c-2.86-1.75-6.45-2.14-10.67-1.14a.75.75 0 1 1-.34-1.46c4.62-1.07 8.6-.62 11.8 1.35.35.21.46.67.25 1.01Zm1.48-2.73a.94.94 0 0 1-1.3.3c-3.28-2.01-8.28-2.6-12.17-1.43a.94.94 0 1 1-.54-1.8c4.45-1.34 9.95-.68 13.69 1.61.44.27.57.85.31 1.31Zm.13-2.84c-3.93-2.33-10.4-2.55-14.15-1.39a1.13 1.13 0 1 1-.67-2.16c4.31-1.34 11.48-1.08 15.98 1.59a1.13 1.13 0 0 1-1.16 1.96Z" />
      </svg>
    )
  },
  {
    label: 'YouTube',
    url: 'https://www.youtube.com/channel/UCTZsHa5xNhJwlhEDrpds8ng',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
        <path d="M23.5 6.2a3.07 3.07 0 0 0-2.16-2.17C19.46 3.5 12 3.5 12 3.5s-7.46 0-9.34.53A3.07 3.07 0 0 0 .5 6.2 32.3 32.3 0 0 0 0 12a32.3 32.3 0 0 0 .5 5.8 3.07 3.07 0 0 0 2.16 2.17c1.88.53 9.34.53 9.34.53s7.46 0 9.34-.53a3.07 3.07 0 0 0 2.16-2.17A32.3 32.3 0 0 0 24 12a32.3 32.3 0 0 0-.5-5.8ZM9.6 15.69V8.31L15.9 12l-6.3 3.69Z" />
      </svg>
    )
  },
  {
    label: 'Facebook',
    url: 'https://www.facebook.com/mohameddiabyofficiel/?locale=fr_FR',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
        <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.6 1.6-1.6h1.7V4.8c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.5V11H7v3h3v8h3.5Z" />
      </svg>
    )
  },
  {
    label: 'Instagram',
    url: 'https://www.instagram.com/mohamed_diaby_officiel/',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
        <path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6Zm9.1 1.5a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
      </svg>
    )
  },
  {
    label: 'TikTok',
    url: 'https://www.tiktok.com/@mohdiaby223',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
        <path d="M14.2 3h2.3a4.9 4.9 0 0 0 3 2.8v2.4a7 7 0 0 1-3-.9v7.2a5.5 5.5 0 1 1-5.5-5.5c.3 0 .7 0 1 .1V12a3.2 3.2 0 1 0 2.2 3V3Z" />
      </svg>
    )
  }
];

export default function Footer({ contacts = {} }) {
  const dynamicLinks = [
    contacts.whatsappUrl
      ? {
          label: 'WhatsApp',
          url: contacts.whatsappUrl,
          icon: (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
              <path d="M12 2a10 10 0 0 0-8.66 15l-1.2 4.37 4.49-1.18A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.07-1.11l-.29-.17-2.66.7.71-2.59-.19-.3A8 8 0 1 1 12 20Zm4.3-5.82c-.24-.12-1.4-.69-1.62-.77-.22-.08-.38-.12-.54.12-.16.24-.62.77-.76.93-.14.16-.28.18-.52.06a6.58 6.58 0 0 1-1.94-1.2 7.26 7.26 0 0 1-1.35-1.68c-.14-.24-.02-.37.1-.49.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.31.98 2.47c.12.16 1.7 2.6 4.12 3.65.58.25 1.03.4 1.38.52.58.18 1.1.16 1.52.1.46-.07 1.4-.57 1.6-1.12.2-.55.2-1.03.14-1.13-.06-.1-.22-.16-.46-.28Z" />
            </svg>
          )
        }
      : null,
    contacts.email
      ? {
          label: 'Mail',
          url: `mailto:${contacts.email}`,
          icon: (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
              <path d="M3 5h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 2v.5l9 5.5 9-5.5V7H3Zm18 10V9.83l-8.48 5.18a1 1 0 0 1-1.04 0L3 9.83V17h18Z" />
            </svg>
          )
        }
      : null,
    contacts.appleMusicUrl
      ? {
          label: 'Apple Music',
          url: contacts.appleMusicUrl,
          icon: (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
              <path d="M17 3v11.2a2.8 2.8 0 1 1-1.2-2.3V6.8L9 8.2v8a2.8 2.8 0 1 1-1.2-2.3V7.3L17 5.8V3h0Z" />
            </svg>
          )
        }
      : null
  ].filter(Boolean);

  const socialLinks = [
    {
      label: 'Spotify',
      url: contacts.spotifyUrl || fallbackSocialLinks.find((s) => s.label === 'Spotify').url,
      icon: fallbackSocialLinks.find((s) => s.label === 'Spotify').icon
    },
    {
      label: 'YouTube',
      url: contacts.youtubeUrl || fallbackSocialLinks.find((s) => s.label === 'YouTube').url,
      icon: fallbackSocialLinks.find((s) => s.label === 'YouTube').icon
    },
    {
      label: 'Facebook',
      url: contacts.facebookUrl || fallbackSocialLinks.find((s) => s.label === 'Facebook').url,
      icon: fallbackSocialLinks.find((s) => s.label === 'Facebook').icon
    },
    {
      label: 'Instagram',
      url: contacts.instagramUrl || fallbackSocialLinks.find((s) => s.label === 'Instagram').url,
      icon: fallbackSocialLinks.find((s) => s.label === 'Instagram').icon
    },
    {
      label: 'TikTok',
      url: contacts.tiktokUrl || fallbackSocialLinks.find((s) => s.label === 'TikTok').url,
      icon: fallbackSocialLinks.find((s) => s.label === 'TikTok').icon
    }
  ];
  const allLinks = [...dynamicLinks, ...socialLinks];

  return (
    <footer className="border-t border-gold/20 bg-black/50">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-2xl text-gold">Mohamed Diaby</p>
          <p className="mt-2 text-sm text-sand/70">Musique, tournée, collaborations et booking.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {allLinks.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              aria-label={link.label}
              title={link.label}
              className="rounded-full border border-gold/35 p-3 text-sand/85 transition hover:border-gold hover:bg-gold/10 hover:text-gold"
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>
      <div className="gold-line" />
      <p className="px-6 py-4 text-center text-xs text-sand/55">
        © {new Date().getFullYear()} Mohamed Diaby. Tous droits réservés.
      </p>
    </footer>
  );
}
