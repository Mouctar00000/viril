import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Welcome() {
  const { unlockNav } = useCart();

  return (
    <section id="univers" className="relative w-full py-24 sm:py-32 px-6 sm:px-10 md:px-16 bg-[#04050A] border-t border-white/10 text-center overflow-hidden">
      {/* Background Gold Subtle Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#D1B992]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 reveal-on-scroll">
        {/* White Phoenix Brand Emblem */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 rounded-3xl bg-white/[0.04] border border-white/10 flex items-center justify-center p-3.5 sm:p-4 shadow-[0_0_35px_rgba(255,255,255,0.06)] hover:border-[#D1B992]/40 transition-all group">
          <img
            src="/images/logo-white.png"
            alt="Emblème VIRILACCESSORIES"
            className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(255,255,255,0.35)] group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#D1B992]" />
          <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#D1B992]">
            L'Univers de Marque
          </span>
        </div>

        <h2 className="font-sans font-medium text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight mb-6">
          Bienvenue dans l'univers VIRILACCESSORIES
        </h2>

        <p className="font-sans text-sm sm:text-base text-[#9AA0B4] leading-relaxed max-w-2xl mx-auto mb-4">
          Une expérience unique qui redéfinit l'élégance masculine moderne. Découvrez une collection exclusive d'accessoires alliant sophistication, audace et raffinement.
        </p>

        <p className="font-sans text-sm sm:text-base text-[#9AA0B4] leading-relaxed max-w-2xl mx-auto mb-10">
          Chaque pièce raconte une histoire. Chaque détail est pensé pour sublimer votre style et affirmer votre caractère.
        </p>

        {/* Call to Action with animated light sweep */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => unlockNav('boutique')}
            className="btn-main btn--solid btn-light-sweep text-xs tracking-[0.16em] uppercase font-bold py-4 px-8 sm:px-10 cursor-pointer inline-flex items-center gap-3 shadow-[0_0_30px_rgba(209,185,146,0.45)] hover:scale-105 transition-all duration-300 group"
          >
            <span>Découvrir la collection</span>
            <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            type="button"
            onClick={() => unlockNav('ebooks')}
            className="btn-main btn--line inline-flex items-center gap-3 text-xs tracking-[0.16em] uppercase py-4 px-8 cursor-pointer hover:border-[#D1B992] transition-colors"
          >
            <span>Découvrir nos E-books</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
