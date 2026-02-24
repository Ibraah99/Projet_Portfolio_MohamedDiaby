import { Link, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <div className="min-h-screen bg-ink text-sand">
      <header className="sticky top-0 z-50 border-b border-gold/20 bg-black/70 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="font-display text-xl text-gold">
            Mohamed Diaby
          </Link>
          <div className="flex gap-5 text-sm text-sand/80">
            <a href="/#bio" className="hover:text-gold">
              Bio
            </a>
            <a href="/#tour" className="hover:text-gold">
              Tournée
            </a>
            <a href="/#videos" className="hover:text-gold">
              Vidéos
            </a>
            <a href="/#gallery" className="hover:text-gold">
              Galerie
            </a>
            <a href="/#contact" className="hover:text-gold">
              Contact
            </a>
            <Link to="/admin" className="hover:text-gold">
              Espace Admin
            </Link>
          </div>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </div>
  );
}
