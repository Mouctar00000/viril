import React, { useState } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Elegance from './components/Elegance';
import Welcome from './components/Welcome';
import Ebooks from './components/Ebooks';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import EbookPreviewModal from './components/EbookPreviewModal';
import ProductCustomizerModal from './components/ProductCustomizerModal';
import CustomerReviews from './components/CustomerReviews';
import { useAdaptiveFavicon } from './hooks/useAdaptiveFavicon';
import { useScrollReveal } from './hooks/useScrollReveal';

function MainContent() {
  useAdaptiveFavicon();
  const { navStage } = useCart();
  useScrollReveal('.reveal-on-scroll', [navStage]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [directCheckoutItem, setDirectCheckoutItem] = useState(null);
  const [previewEbook, setPreviewEbook] = useState(null);
  const [customizingProduct, setCustomizingProduct] = useState(null);

  const handleOpenCartCheckout = () => {
    setDirectCheckoutItem(null);
    setIsCheckoutOpen(true);
  };

  const handleDirectCheckout = (item) => {
    setDirectCheckoutItem(item);
    setIsCheckoutOpen(true);
  };

  const handlePreviewEbook = (ebook) => {
    setPreviewEbook(ebook);
  };

  return (
    <div className="relative min-h-screen bg-[#04050A] text-[#FFFFFF] font-sans antialiased selection:bg-[#D1B992] selection:text-[#04050A] overflow-x-clip">
      {/* Film grain overlay */}
      <div className="grain-overlay" aria-hidden="true">
        <svg className="w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
          <filter id="filmGrain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.85"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.05 0"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#filmGrain)" />
        </svg>
      </div>

      {/* 1. Header */}
      <Header />

      <main id="top">
        {navStage === 'initial' ? (
          <>
            {/* ÉTAPE INITIALE : Exactement les 3 sections visibles */}
            {/* 1. Section « Remake with Wixpad Blunt » / We make waves */}
            <Hero />

            {/* 2. Section « Plein Feu sur l'Excellence » (Showcase sacs, montres, parures) */}
            <Elegance mode="showcase" onOpenCustomizer={setCustomizingProduct} />

            {/* 3. Section Contact « Restons en ligne directe » */}
            <Contact />
          </>
        ) : (
          <>
            {/* ÉTAPE BOUTIQUE DÉVERROUILLÉE : Les 2 sections initiales ont disparu */}
            {/* 1. Boutique Catalog (« Le Vestiaire », « Les Accessoires », « Collection complète ») */}
            <Elegance mode="catalog" onOpenCustomizer={setCustomizingProduct} />

            {/* 2. Bienvenue dans l'univers VIRILACCESSORIES */}
            <Welcome />

            {/* 3. E-books (Guides, Stats, Témoignages) */}
            <Ebooks
              onPreviewEbook={handlePreviewEbook}
              onDirectCheckout={handleDirectCheckout}
            />

            {/* 4. À Propos (Histoire, Valeurs, Processus) */}
            <About />

            {/* 5. Contact & Localisation Cameroun */}
            <Contact />
          </>
        )}

        {/* Section Avis Clients & Bouton VOIR LA COLLECTION */}
        <CustomerReviews />
      </main>

      {/* Footer */}
      <Footer />

      {/* 10. Interactive Cart Drawer */}
      <CartDrawer onOpenCheckoutModal={handleOpenCartCheckout} />

      {/* 11. Modal de Commande Directe & Paiements Cameroun */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false);
          setDirectCheckoutItem(null);
        }}
        directItem={directCheckoutItem}
      />

      {/* 12. Modal d'Aperçu Rapide E-book */}
      <EbookPreviewModal
        ebook={previewEbook}
        isOpen={Boolean(previewEbook)}
        onClose={() => setPreviewEbook(null)}
        onDirectCheckout={(ebook) => {
          setPreviewEbook(null);
          handleDirectCheckout(ebook);
        }}
      />

      {/* 13. Modal de Personnalisation & Configuration Sur-Mesure des Produits */}
      <ProductCustomizerModal
        product={customizingProduct}
        isOpen={Boolean(customizingProduct)}
        onClose={() => setCustomizingProduct(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <MainContent />
    </CartProvider>
  );
}
