import { useEffect, useState } from 'react';
import HeroSection from '../sections/HeroSection';
import BioSection from '../sections/BioSection';
import YouTubeCatalogSection from '../sections/YouTubeCatalogSection';
import PartnersCarouselSection from '../sections/PartnersCarouselSection';
import TourSection from '../sections/TourSection';
import GallerySection from '../sections/GallerySection';
import ContactSection from '../sections/ContactSection';
import Footer from '../components/Footer';
import { api } from '../services/api';

export default function HomePage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getPublicData()
      .then(setData)
      .catch((error) =>
        setError(
          `Impossible de charger les données${error?.message ? `: ${error.message}` : '.'}`
        )
      );
  }, []);

  if (error) {
    return <div className="section-shell text-red-400">{error}</div>;
  }

  if (!data) {
    return <div className="section-shell text-sand/60">Chargement...</div>;
  }

  return (
    <>
      <HeroSection artist={data.artist} tracks={data.tracks || []} />
      <BioSection bio={data.artist.bio} />
      <YouTubeCatalogSection />
      <TourSection events={data.events} />
      <GallerySection gallery={data.gallery} />
      <PartnersCarouselSection partners={data.partners || []} />
      <ContactSection />
      <Footer contacts={data.contacts || {}} />
    </>
  );
}
