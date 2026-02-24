import { useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const baseUrl = import.meta.env.BASE_URL || '/';
  const homeSectionHref = (sectionId) => `${baseUrl}#${sectionId}`;
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-ink text-sand">
      <header className="sticky top-0 z-50 border-b border-gold/20 bg-black/70 backdrop-blur">
        <nav className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="font-display text-xl text-gold" onClick={closeMobileMenu}>
              Mohamed Diaby
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center rounded border border-gold/40 text-gold md:hidden"
              aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={mobileMenuOpen}
            >
              <span className="text-lg">{mobileMenuOpen ? '×' : '☰'}</span>
            </button>
          </div>

          <div className="mt-3 hidden items-center gap-5 text-sm text-sand/80 md:flex md:mt-0">
            <a href={homeSectionHref('bio')} className="hover:text-gold">
              Bio
            </a>
            <a href={homeSectionHref('tour')} className="hover:text-gold">
              Tournée
            </a>
            <a href={homeSectionHref('videos')} className="hover:text-gold">
              Vidéos
            </a>
            <a href={homeSectionHref('gallery')} className="hover:text-gold">
              Galerie
            </a>
            <a href={homeSectionHref('contact')} className="hover:text-gold">
              Contact
            </a>
            <Link to="/admin" className="hover:text-gold">
              Espace Admin
            </Link>
          </div>

          {mobileMenuOpen && (
            <div className="mt-3 grid gap-2 rounded border border-gold/20 bg-black/90 p-3 text-sm md:hidden">
              <a href={homeSectionHref('bio')} className="rounded px-2 py-2 hover:bg-gold/10" onClick={closeMobileMenu}>
                Bio
              </a>
              <a href={homeSectionHref('tour')} className="rounded px-2 py-2 hover:bg-gold/10" onClick={closeMobileMenu}>
                Tournée
              </a>
              <a href={homeSectionHref('videos')} className="rounded px-2 py-2 hover:bg-gold/10" onClick={closeMobileMenu}>
                Vidéos
              </a>
              <a href={homeSectionHref('gallery')} className="rounded px-2 py-2 hover:bg-gold/10" onClick={closeMobileMenu}>
                Galerie
              </a>
              <a href={homeSectionHref('contact')} className="rounded px-2 py-2 hover:bg-gold/10" onClick={closeMobileMenu}>
                Contact
              </a>
              <Link to="/admin" className="rounded px-2 py-2 hover:bg-gold/10" onClick={closeMobileMenu}>
                Espace Admin
              </Link>
            </div>
          )}
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </div>
  );
}
