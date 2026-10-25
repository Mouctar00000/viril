import React from 'react';
import { useCart } from '../context/CartContext';

export default function Footer() {
  const { unlockNav, navStage } = useCart();
  return (
    <footer className="relative w-full bg-[#04050A] border-t border-white/10 pt-16 sm:pt-20 pb-10 px-6 sm:px-10 md:px-16 text-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr_1fr] gap-12 md:gap-16 pb-16">
          
          {/* Brand Info (Matching Screenshot 1) */}
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3.5">
              <img
                src="/images/logo-white.png"
                alt="VIRIL ACCESSORIES Logo"
                className="w-10 h-10 object-contain filter drop-shadow-[0_0_15px_rgba(255,255,255,0.25)]"
              />
              <div className="flex flex-col line-tight">
                <span className="font-sans font-semibold text-base sm:text-lg tracking-[0.42em] text-white">
                  VIRIL
                </span>
                <span className="font-sans text-[8.5px] tracking-[0.56em] uppercase text-[#9AA0B4] -mt-0.5">
                  ACCESSORIES
                </span>
              </div>
            </div>

            <div className="space-y-1 text-xs text-[#9AA0B4] pt-2">
              <p>Yaoundé, Cameroun</p>
              <p>virilaccessories@gmail.com</p>
              <p>+237 651 02 49 75</p>
            </div>

            <p className="font-serif italic text-base sm:text-lg text-[#D1B992] pt-3">
              « Le style dans les détails. »
            </p>
          </div>

          {/* Navigation Column */}
          <div className="space-y-4">
            <h4 className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#D1B992] font-medium">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-[#9AA0B4]">
              {navStage === 'initial' ? (
                <>
                  <li>
                    <button
                      onClick={() => unlockNav('boutique')}
                      className="hover:text-white transition-colors text-left font-semibold text-[#D1B992] cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <span>Découvrir la collection</span>
                      <span>→</span>
                    </button>
                  </li>
                  <li>
                    <a href="#contact" className="hover:text-white transition-colors">
                      Contact
                    </a>
                  </li>
                  <li>
                    <a href="#avis-clients" className="hover:text-white transition-colors">
                      Avis clients
                    </a>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <a
                      href="#boutique"
                      onClick={() => unlockNav('boutique')}
                      className="hover:text-white transition-colors"
                    >
                      Boutique
                    </a>
                  </li>
                  <li>
                    <a
                      href="#ebooks"
                      onClick={() => unlockNav('ebooks')}
                      className="hover:text-white transition-colors"
                    >
                      E-books
                    </a>
                  </li>
                  <li>
                    <a
                      href="#apropos"
                      onClick={() => unlockNav('apropos')}
                      className="hover:text-white transition-colors"
                    >
                      À propos
                    </a>
                  </li>
                  <li>
                    <a
                      href="#contact"
                      onClick={() => unlockNav('contact')}
                      className="hover:text-white transition-colors"
                    >
                      Contact
                    </a>
                  </li>
                  <li>
                    <a
                      href="#avis-clients"
                      className="hover:text-white transition-colors"
                    >
                      Avis clients
                    </a>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Legal & Socials (Matching Screenshot 1) */}
          <div className="space-y-4">
            <h4 className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#D1B992] font-medium">
              Légal & Réseaux
            </h4>
            <ul className="space-y-2.5 text-xs text-[#9AA0B4]">
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  Mentions légales
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  CGV
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  Confidentialité
                </a>
              </li>
              <li className="pt-2">
                <a
                  href="https://www.instagram.com/virilaccessories"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#D1B992] transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.tiktok.com/@virilaccessories"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#D1B992] transition-colors"
                >
                  TikTok
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/share/1CWGRTesDg/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#D1B992] transition-colors"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/237651024975"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#D1B992] transition-colors"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Line (Matching Screenshot 1) */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 font-sans text-[10.5px] uppercase tracking-[0.14em] text-[#5E6479]">
          <span>© 2026 VIRILACCESSORIES. TOUS DROITS RÉSERVÉS.</span>
          <span className="text-[#9AA0B4]">PORTEZ LA VIRILITÉ AU QUOTIDIEN.</span>
        </div>
      </div>
    </footer>
  );
}
