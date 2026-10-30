import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Menu, X, ArrowRight, Heart, Phone } from 'lucide-react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('accueil');
  const { totalCount, setIsCartOpen, bump, favorites, navStage, unlockNav } = useCart();

  // Navigation links displayed when visitors enter the website's main navigation (Requirement 9)
  // Exact 5 pages in this exact order: 1. Accueil, 2. Boutique, 3. E-books, 4. À propos, 5. Contact
  const fullNavLinks = [
    { href: '#accueil', label: 'Accueil', id: 'accueil' },
    { href: '#boutique', label: 'Boutique', id: 'boutique' },
    { href: '#ebooks', label: 'E-books', id: 'ebooks' },
    { href: '#apropos', label: 'À propos', id: 'apropos' },
    { href: '#contact', label: 'Contact', id: 'contact' },
  ];

  // When navStage is 'unlocked', show full navigation; otherwise, show no links.
  const activeNavLinks = navStage === 'unlocked' ? fullNavLinks : [];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sectionIds = navStage === 'unlocked'
        ? ['boutique', 'ebooks', 'apropos', 'contact']
        : ['accueil'];

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 260 && rect.bottom >= 180) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navStage]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'h-[56px] sm:h-[64px] bg-[#04050A]/90 backdrop-blur-2xl border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.7)]'
            : 'h-[62px] sm:h-[70px] bg-[#04050A]/90 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_25px_rgba(0,0,0,0.15)]'
        } flex items-center`}
      >
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 md:px-14 flex items-center justify-between gap-6">
          
          {/* Left: Official Brand Logo & Wordmark VIRIL ACCESSORIES */}
          <a
            href="#accueil"
            onClick={(e) => {
              e.preventDefault();
              unlockNav('accueil');
            }}
            className="flex items-center gap-3 group cursor-pointer flex-shrink-0"
          >
            <img
              src="/images/logo-white.png"
              alt="VIRIL ACCESSORIES Logo"
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain group-hover:scale-105 transition-transform duration-300 filter drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]"
            />
            <div className="flex flex-col line-tight">
              <span className="font-sans font-semibold text-base sm:text-lg tracking-[0.42em] text-white group-hover:text-[#D1B992] transition-colors duration-300 uppercase">
                VIRIL
              </span>
              <span className="font-sans text-[8px] sm:text-[8.5px] tracking-[0.52em] uppercase text-[#9AA0B4] group-hover:text-white transition-colors duration-300 -mt-0.5">
                ACCESSORIES
              </span>
            </div>
          </a>

          {/* Center: Dynamic Nav Links (Displayed ONLY after entering the Boutique) */}
          {navStage === 'unlocked' && (
            <nav className="hidden md:flex items-center gap-7 lg:gap-9 animate-fade-in">
              {fullNavLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      unlockNav(link.id);
                    }}
                    className={`relative font-sans text-xs tracking-[0.18em] uppercase py-2 transition-all duration-300 font-medium cursor-pointer ${
                      isActive
                        ? 'text-white font-semibold'
                        : 'text-[#9AA0B4] hover:text-white'
                    }`}
                  >
                    <span>{link.label}</span>
                    {/* Active / Hover Gold Underline Indicator */}
                    <span
                      className={`absolute left-0 bottom-0 h-[1.5px] bg-[#D1B992] transition-transform duration-300 origin-left ${
                        isActive ? 'w-full scale-x-100 shadow-[0_0_8px_#D1B992]' : 'w-full scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </a>
                );
              })}
            </nav>
          )}

          {/* Right: Actions (Phone Call on Landing / Cart & Wishlist on Boutique Unlocked) */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
            {navStage === 'unlocked' ? (
              <>
                <a
                  href="#boutique"
                  className="relative hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full border border-white/15 bg-black/40 backdrop-blur-xl text-white hover:border-red-400/60 hover:text-red-400 transition-all duration-300"
                  title="Créations favorites"
                >
                  <Heart className={`w-3.5 h-3.5 ${favorites?.length > 0 ? 'fill-red-500 text-red-500' : 'text-white/70'}`} />
                  <span className="text-xs font-mono font-medium">{favorites?.length || 0}</span>
                </a>

                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative flex items-center gap-2 px-3.5 py-2 rounded-full border border-white/15 bg-black/40 backdrop-blur-xl text-white hover:border-[#D1B992] hover:text-[#D1B992] hover:bg-[#D1B992]/10 transition-all duration-300 group cursor-pointer"
                  aria-label="Ouvrir le panier"
                >
                  <ShoppingBag className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 duration-300" />
                  <span className="hidden sm:inline text-xs font-mono font-medium tracking-wider">
                    Panier
                  </span>
                  <span
                    className={`min-w-[18px] h-[18px] px-1 grid place-items-center font-sans text-[10px] font-bold bg-[#D1B992] text-[#04050A] rounded-full transition-transform duration-300 ${
                      totalCount > 0 ? 'scale-100' : 'scale-0'
                    } ${bump ? 'animate-bounce' : ''}`}
                  >
                    {totalCount}
                  </span>
                </button>

                {/* Mobile Hamburger toggle for small screens */}
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="md:hidden p-2 text-white/80 hover:text-white transition-colors"
                  aria-label="Menu"
                >
                  {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </>
            ) : (
              /* Landing stage: Direct Call Phone Button */
              <a
                href="tel:+237651024975"
                aria-label="Appeler VIRIL"
                title="Appeler VIRIL : +237 651 02 49 75"
                className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#D1B992]/40 bg-black/50 backdrop-blur-xl text-[#D1B992] hover:border-[#D1B992] hover:bg-[#D1B992]/15 hover:scale-105 active:scale-95 transition-all duration-300 group shadow-[0_0_15px_rgba(209,185,146,0.15)]"
              >
                <Phone className="w-4 h-4 text-[#D1B992] transition-transform duration-300 group-hover:rotate-12" />
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {menuOpen && navStage === 'unlocked' && (
        <div className="fixed inset-0 z-50 bg-[#04050A]/95 backdrop-blur-3xl px-8 pt-24 pb-12 flex flex-col justify-between animate-fade-in border-b border-white/10 md:hidden">
          <div className="max-w-xl mx-auto w-full">
            <div className="flex items-center justify-between pb-6 mb-8 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <img
                  src="/images/logo-white.png"
                  alt="VIRIL ACCESSORIES Logo"
                  className="w-7 h-7 object-contain"
                />
                <span className="font-mono text-xs uppercase tracking-widest text-[#D1B992]">
                  VIRILACCESSORIES
                </span>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <nav className="flex flex-col gap-2">
              {activeNavLinks.map((link) => {
                const isActive = activeSection === link.id || (navStage === 'initial' && link.id === 'accueil');
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      setMenuOpen(false);
                      unlockNav(link.id);
                    }}
                    className={`font-serif text-3xl sm:text-4xl py-3 border-b border-white/5 transition-all flex items-center justify-between group ${
                      isActive ? 'text-[#D1B992]' : 'text-white hover:text-[#D1B992]'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-5 h-5 text-[#5E6479] group-hover:text-[#D1B992] group-hover:translate-x-1 transition-all" />
                  </a>
                );
              })}
            </nav>
          </div>

          <div className="max-w-xl mx-auto w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-[#5E6479] pt-6 border-t border-white/10">
            <div>
              <span className="text-white block font-medium">Yaoundé — Cameroun</span>
              <span>virilaccessories@gmail.com</span>
            </div>
            <a
              href="https://wa.me/237651024975"
              target="_blank"
              rel="noreferrer"
              className="text-[#D1B992] font-semibold hover:underline"
            >
              WhatsApp : +237 651 02 49 75
            </a>
          </div>
        </div>
      )}
    </>
  );
}
