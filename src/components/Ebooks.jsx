import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { BookOpen, ShoppingBag, Star, Sparkles, CheckCircle2, Eye } from 'lucide-react';

export default function Ebooks({ onPreviewEbook, onDirectCheckout }) {
  const { addToCart, formatMoney } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const ebooks = [
    {
      id: 'e5',
      title: "Baiser comme un Viril",
      subtitle: "Comment la toucher pour qu'elle ne t'oublie jamais",
      author: "Dit Kelisse",
      category: "intimite",
      badge: "Bestseller #1",
      badgeColor: "bg-[#E63B2E] text-white",
      image: "/images/ebooks/baiser-comme-un-viril.jpg",
      price: 12500,
      originalPrice: 18000,
      pages: 88,
      rating: "4.9",
      reviewsCount: 195,
      theme: "Intimité & Magnétisme Sensoriel",
      readTime: "2h 00",
      description: "L'art de l'intimité supérieure. Orchestrez la tension, maîtrisez vos rythmes et laissez une empreinte ineffaçable."
    },
    {
      id: 'e1',
      title: "L’Usine du Charisme",
      subtitle: "Deviens irrésistible",
      author: "Dit Kelisse",
      category: "charisme",
      badge: "Coup de Cœur",
      badgeColor: "bg-[#D1B992] text-[#04050A]",
      image: "/images/ebooks/usine-du-charisme.jpg",
      price: 13500,
      originalPrice: 19500,
      pages: 148,
      rating: "5.0",
      reviewsCount: 242,
      theme: "Présence & Éloquence Sociale",
      readTime: "3h 30",
      description: "Captez l'attention dès les 5 premières secondes. Posez une voix affirmée et imposez une présence respectée."
    },
    {
      id: 'e3',
      title: "Maîtriser l’Art de Séduire",
      subtitle: "Gagne le pouvoir d'avoir n'importe quelle femme",
      author: "Dit Kelisse",
      category: "charisme",
      badge: "Essentiel",
      badgeColor: "bg-gradient-to-r from-[#C9A84C] to-[#E5C158] text-black",
      image: "/images/ebooks/maitriser-l-art-de-seduire.jpg",
      price: 11500,
      originalPrice: 16500,
      pages: 176,
      rating: "4.9",
      reviewsCount: 210,
      theme: "Psychologie & Tension Féminine",
      readTime: "4h 10",
      description: "Les leviers évolutifs de l'attraction. Créez une tension magnétique authentique sans supplier ni forcer."
    },
    {
      id: 'e4',
      title: "Guide Ultime pour Vaincre la Masturbation",
      subtitle: "Comment se libérer de cette prison infernale et enfin profiter pleinement de sa vie !",
      author: "Dit Kelisse",
      category: "mental",
      badge: "Transformation",
      badgeColor: "bg-[#8B1E1E] text-white",
      image: "/images/ebooks/vaincre-la-masturbation.jpg",
      price: 9900,
      originalPrice: 15000,
      pages: 110,
      rating: "4.9",
      reviewsCount: 185,
      theme: "Discipline & Puissance Vitale",
      readTime: "2h 45",
      description: "Transmutez votre énergie sexuelle en ambition brute et puissance athlétique. Protocole dopaminergique 90 jours."
    },
    {
      id: 'e2',
      title: "D’Hommelette à Viril",
      subtitle: "Le seul but qui compte pour un homme de valeur",
      author: "Dit Kelisse",
      category: "mental",
      badge: "Le Manifeste",
      badgeColor: "bg-white/90 text-black",
      image: "/images/ebooks/d-hommelette-a-viril.jpg",
      price: 9900,
      originalPrice: 14500,
      pages: 92,
      rating: "4.8",
      reviewsCount: 138,
      theme: "Mental d'Acier & Responsabilité",
      readTime: "2h 15",
      description: "Bannissez la complaisance moderne. Forgez une discipline d'acier et prenez la pleine responsabilité de votre destinée."
    },
  ];

  const categories = [
    { id: 'all', label: 'Toute la collection (5)' },
    { id: 'charisme', label: 'Charisme & Séduction' },
    { id: 'intimite', label: 'Intimité & Magnétisme' },
    { id: 'mental', label: 'Discipline & Mental' },
  ];

  const filteredEbooks = selectedCategory === 'all'
    ? ebooks
    : ebooks.filter((b) => b.category === selectedCategory);

  const whyUs = [
    {
      title: "Conception Réaliste & Structurée",
      desc: "Des protocoles clairs et applicables immédiatement, conçus pour des résultats tangibles dans votre quotidien.",
    },
    {
      title: "Méthodes Validées par l'Expérience",
      desc: "Chaque ouvrage s'appuie sur la psychologie comportementale et les retours de plus de 1 000 lecteurs transformés.",
    },
    {
      title: "Format Numérique Haute Définition",
      desc: "Livraison instantanée en PDF interactif optimisé pour smartphone, tablette, liseuse et ordinateur.",
    },
    {
      title: "Accompagnement & Mises à Jour",
      desc: "Accès à vie aux futures révisions et éditions enrichies sans aucun coût supplémentaire.",
    },
  ];

  return (
    <section id="ebooks" className="relative w-full py-24 sm:py-32 px-4 sm:px-8 md:px-12 lg:px-16 bg-[#04050A] border-t border-white/10 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#D1B992]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[300px] bg-[#E63B2E]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[#D1B992] animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#D1B992] font-semibold">
              Bibliothèque Numérique // Auteur Dit Kelisse
            </span>
          </div>

          <h2 className="font-sans font-medium text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-[1.05] mb-5">
            Le savoir est{' '}
            <span className="font-serif italic text-[#D1B992] font-normal">pouvoir</span>
          </h2>

          <p className="font-sans text-sm sm:text-base text-[#9AA0B4] leading-relaxed max-w-2xl mx-auto mb-8">
            5 œuvres maîtresses conçues pour transformer votre présence, forger un mental d'acier et déverrouiller votre potentiel masculin absolu.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                  selectedCategory === cat.id
                    ? 'bg-[#D1B992] text-[#04050A] shadow-[0_0_20px_rgba(209,185,146,0.4)] scale-105'
                    : 'bg-white/[0.04] text-[#9AA0B4] border border-white/10 hover:text-white hover:border-white/25 hover:bg-white/[0.08]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Book Showcase Grid (Realistic 3D covers with studio podium) */}
        <div className="flex flex-wrap justify-center gap-7 lg:gap-8 mb-24">
          {filteredEbooks.map((ebook) => (
            <article
              key={ebook.id}
              className="group w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] max-w-[390px] rounded-3xl border border-white/10 bg-[#0A0C16] hover:border-[#D1B992]/40 p-5 sm:p-6 flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(209,185,146,0.15)] relative"
            >
              <div>
                {/* 3D Realistic Book Podium Showcase Stage */}
                <div 
                  onClick={() => onPreviewEbook && onPreviewEbook(ebook)}
                  className="relative aspect-[9/13.5] w-full rounded-2xl bg-white overflow-hidden flex items-center justify-center p-4 sm:p-5 mb-5 cursor-pointer shadow-[inset_0_2px_10px_rgba(0,0,0,0.06),0_15px_35px_rgba(0,0,0,0.4)] group/stage"
                >
                  {/* Floating Badge */}
                  <div className="absolute top-3.5 left-3.5 z-20">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider shadow-md ${ebook.badgeColor}`}>
                      <Sparkles className="w-3 h-3" />
                      {ebook.badge}
                    </span>
                  </div>

                  {/* Discount pill */}
                  <div className="absolute top-3.5 right-3.5 z-20">
                    <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-sm text-[#D1B992] font-mono font-bold text-[10px] tracking-wider border border-white/10">
                      -30%
                    </span>
                  </div>

                  {/* 3D Book Mockup Image with realistic contact shadow */}
                  <img
                    src={ebook.image}
                    alt={`${ebook.title} par ${ebook.author}`}
                    className="w-full h-full object-contain filter drop-shadow-[0_16px_24px_rgba(0,0,0,0.22)] group-hover/stage:scale-105 group-hover/stage:-translate-y-1.5 transition-all duration-500 ease-out"
                    loading="lazy"
                  />

                  {/* Hover interactive overlay */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover/stage:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                    <span className="px-4 py-2 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-wider shadow-xl flex items-center gap-2 transform translate-y-2 group-hover/stage:translate-y-0 transition-transform duration-300">
                      <Eye className="w-3.5 h-3.5 text-[#D1B992]" />
                      Feuilleter l'extrait
                    </span>
                  </div>
                </div>

                {/* Author & Rating Header */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#D1B992] font-semibold">
                    {ebook.author}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-[#FAF8F5]/80">
                    <Star className="w-3 h-3 fill-[#FFD700] text-[#FFD700]" />
                    <span className="font-semibold">{ebook.rating}</span>
                    <span className="text-[#5E6479]">({ebook.reviewsCount})</span>
                  </div>
                </div>

                {/* Title */}
                <h3 
                  onClick={() => onPreviewEbook && onPreviewEbook(ebook)}
                  className="font-sans font-bold text-lg text-white tracking-tight leading-snug mb-1.5 group-hover:text-[#D1B992] transition-colors cursor-pointer min-h-[3rem] flex items-center"
                  title={ebook.title}
                >
                  {ebook.title}
                </h3>

                {/* Subtitle / Punchline from cover */}
                <p className="font-sans text-xs text-[#9AA0B4] leading-relaxed line-clamp-2 italic mb-4 min-h-[2rem]">
                  « {ebook.subtitle} »
                </p>

                {/* Key Specs Pills */}
                <div className="flex items-center gap-2 mb-5">
                  <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/5 font-mono text-[10px] text-[#FAF8F5]/80">
                    {ebook.pages} pages
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/5 font-mono text-[10px] text-[#FAF8F5]/80">
                    {ebook.readTime}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/5 font-mono text-[10px] text-[#D1B992]">
                    PDF HD
                  </span>
                </div>
              </div>

              {/* Price & Action Footer */}
              <div className="pt-4 border-t border-white/10 mt-auto">
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <span className="font-sans font-bold text-xl sm:text-2xl text-[#D1B992] tracking-tight">
                      {formatMoney(ebook.price)}
                    </span>
                    <span className="ml-2 font-sans text-xs text-[#5E6479] line-through">
                      {formatMoney(ebook.originalPrice)}
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#D1B992]/80">
                    Accès immédiat
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => onPreviewEbook && onPreviewEbook(ebook)}
                    className="w-full py-2.5 px-3 rounded-full border border-white/15 bg-white/[0.03] text-[11px] font-semibold uppercase tracking-wider text-white hover:text-[#D1B992] hover:border-[#D1B992]/40 hover:bg-white/[0.08] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#D1B992]" />
                    <span>Aperçu</span>
                  </button>

                  <button
                    onClick={() => {
                      if (onDirectCheckout) {
                        onDirectCheckout(ebook);
                      } else {
                        addToCart({
                          id: ebook.id,
                          name: ebook.title,
                          price: ebook.price,
                        });
                      }
                    }}
                    className="w-full py-2.5 px-3 rounded-full bg-[#D1B992] text-[#04050A] text-[11px] font-bold uppercase tracking-wider hover:bg-[#DFCAA0] hover:shadow-[0_0_20px_rgba(209,185,146,0.45)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Commander</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#0A0C16] mb-20 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
          <div className="text-center">
            <span className="block font-sans font-semibold text-3xl sm:text-4xl text-[#D1B992] mb-1">
              5
            </span>
            <span className="font-sans text-[11px] uppercase tracking-[0.15em] text-[#9AA0B4]">
              Éditions Exclusives
            </span>
          </div>

          <div className="text-center">
            <span className="block font-sans font-semibold text-3xl sm:text-4xl text-[#D1B992] mb-1">
              1 000+
            </span>
            <span className="font-sans text-[11px] uppercase tracking-[0.15em] text-[#9AA0B4]">
              Lecteurs Actifs
            </span>
          </div>

          <div className="text-center">
            <span className="block font-sans font-semibold text-3xl sm:text-4xl text-[#D1B992] mb-1">
              4.9 / 5
            </span>
            <span className="font-sans text-[11px] uppercase tracking-[0.15em] text-[#9AA0B4]">
              Avis Vérifiés
            </span>
          </div>

          <div className="text-center">
            <span className="block font-sans font-semibold text-3xl sm:text-4xl text-[#D1B992] mb-1">
              100 %
            </span>
            <span className="font-sans text-[11px] uppercase tracking-[0.15em] text-[#9AA0B4]">
              Téléchargement Immédiat
            </span>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {whyUs.map((card, idx) => (
            <div
              key={idx}
              className="p-7 rounded-2xl border border-white/10 bg-[#0A0C16] hover:border-white/20 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-8 h-8 rounded-full bg-[#D1B992]/10 border border-[#D1B992]/20 flex items-center justify-center text-[#D1B992] mb-4">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h4 className="font-sans font-medium text-lg text-white mb-2.5">
                {card.title}
              </h4>
              <p className="font-sans text-xs sm:text-[13px] leading-relaxed text-[#9AA0B4]">
                {card.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Luxury Quote / Testimonial */}
        <div className="text-center max-w-3xl mx-auto py-10 px-4">
          <blockquote className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-white font-normal leading-relaxed mb-6">
            « La qualité des e-books a dépassé mes attentes. J’ai déjà commencé à appliquer les techniques et j’observe de vrais résultats dans ma vie. »
          </blockquote>
          <cite className="font-sans text-xs uppercase tracking-[0.2em] text-[#D1B992] not-italic font-semibold">
            LOÏC MAES — Lecteur & Entrepreneur
          </cite>
        </div>

      </div>
    </section>
  );
}
