import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { PRODUCTS, CATEGORIES } from '../data/products';
import ProductCustomizerModal from './ProductCustomizerModal';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Search,
  SlidersHorizontal,
  Heart,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Plus,
  Star
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Elegance({ onOpenCustomizer, mode = 'all' }) {
  const { addToCart, formatMoney, toggleFavorite, isFavorite, unlockNav } = useCart();
  const saccVideoRef = useRef(null);
  const chaussureVideoRef = useRef(null);
  const montreVideoRef = useRef(null);
  const porteMonnaieVideoRef = useRef(null);
  const catalogSectionRef = useRef(null);
  const gridRef = useRef(null);
  const isFirstFilterRender = useRef(true);

  // Sequential Animation Showcase: SAC (sacc.mp4) -> CHAUSSURE (chaussure.mp4) -> MONTRE (montre.mp4) -> PORTE-MONNAIE (porte-monnaie.mp4)
  const showcaseProducts = useMemo(() => {
    const sacc = PRODUCTS.find((p) => p.id === 'art-3');
    const chaussure = PRODUCTS.find((p) => p.id === 'art-7');
    const montre = PRODUCTS.find((p) => p.id === 'art-6');
    const porteMonnaie = PRODUCTS.find((p) => p.id === 'art-2');
    return [sacc, chaussure, montre, porteMonnaie].filter(Boolean);
  }, []);

  const [currentShowcaseIdx, setCurrentShowcaseIdx] = useState(0);
  const activeShowcase = showcaseProducts[currentShowcaseIdx] || showcaseProducts[0];
  const isTransitioningRef = useRef(false);

  // Reliable transition triggers: SAC (0) -> CHAUSSURE (1) -> MONTRE (2) -> PORTE-MONNAIE (3) -> SAC (0)
  const handleSaccEnded = () => {
    if (isTransitioningRef.current || currentShowcaseIdx !== 0) return;
    isTransitioningRef.current = true;
    setCurrentShowcaseIdx(1);
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 300);
  };

  const handleChaussureEnded = () => {
    if (isTransitioningRef.current || currentShowcaseIdx !== 1) return;
    isTransitioningRef.current = true;
    setCurrentShowcaseIdx(2);
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 300);
  };

  const handleMontreEnded = () => {
    if (isTransitioningRef.current || currentShowcaseIdx !== 2) return;
    isTransitioningRef.current = true;
    setCurrentShowcaseIdx(3);
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 300);
  };

  const handlePorteMonnaieEnded = () => {
    if (isTransitioningRef.current || currentShowcaseIdx !== 3) return;
    isTransitioningRef.current = true;
    setCurrentShowcaseIdx(0);
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 300);
  };

  const handleSaccTimeUpdate = (e) => {
    const v = e.currentTarget;
    if (v.duration && v.currentTime >= v.duration - 0.05) {
      handleSaccEnded();
    }
  };

  const handleChaussureTimeUpdate = (e) => {
    const v = e.currentTarget;
    if (v.duration && v.currentTime >= v.duration - 0.05) {
      handleChaussureEnded();
    }
  };

  const handleMontreTimeUpdate = (e) => {
    const v = e.currentTarget;
    if (v.duration && v.currentTime >= v.duration - 0.05) {
      handleMontreEnded();
    }
  };

  const handlePorteMonnaieTimeUpdate = (e) => {
    const v = e.currentTarget;
    if (v.duration && v.currentTime >= v.duration - 0.05) {
      handlePorteMonnaieEnded();
    }
  };

  // Synchronize playback: strictly play only the active video, pause and reset the other three
  useEffect(() => {
    const videos = [
      saccVideoRef.current,
      chaussureVideoRef.current,
      montreVideoRef.current,
      porteMonnaieVideoRef.current
    ];

    videos.forEach((v, idx) => {
      if (!v) return;
      if (idx === currentShowcaseIdx) {
        v.currentTime = 0;
        v.playbackRate = 1.0;
        v.play().catch(() => {});
      } else {
        v.pause();
        v.currentTime = 0;
      }
    });
  }, [currentShowcaseIdx]);

  // Catalog Filter & Search States (Inspired by Screenshot 1: Product Display)
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyInStock, setShowOnlyInStock] = useState(false);
  const [localCustomizingProduct, setLocalCustomizingProduct] = useState(null);

  const handleNextShowcase = () => {
    setCurrentShowcaseIdx((prev) => (prev + 1) % showcaseProducts.length);
  };

  const handlePrevShowcase = () => {
    setCurrentShowcaseIdx((prev) => (prev - 1 + showcaseProducts.length) % showcaseProducts.length);
  };

  const handleOpenConfigurator = (product) => {
    if (onOpenCustomizer) {
      onOpenCustomizer(product);
    } else {
      setLocalCustomizingProduct(product);
    }
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((prod) => {
      const matchCategory = selectedCategory === 'all' || prod.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === '' ||
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.sub.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Scroll-Reveal Animation Engine for the Boutique Page Catalog
  useEffect(() => {
    if (mode === 'showcase') return;
    if (!catalogSectionRef.current) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const yDistance = isMobile ? 24 : 38;
    const staggerTime = isMobile ? 0.05 : 0.08;

    const ctx = gsap.context(() => {
      // 1. Catalog Header Reveal (Title & Privilege Announcement)
      gsap.fromTo(
        '.catalog-reveal-header',
        { opacity: 0, y: yDistance },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.catalog-reveal-header',
            start: 'top 88%',
            once: true,
          },
        }
      );

      // 2. Search & Filter Controls Reveal
      gsap.fromTo(
        '.catalog-reveal-controls',
        { opacity: 0, y: yDistance * 0.8 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.catalog-reveal-controls',
            start: 'top 88%',
            once: true,
          },
        }
      );

      // 3. Category Tabs Reveal
      gsap.fromTo(
        '.catalog-reveal-categories',
        { opacity: 0, y: yDistance * 0.6 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.catalog-reveal-categories',
            start: 'top 88%',
            once: true,
          },
        }
      );

      // 4. Staggered Product Cards Scroll-Reveal
      ScrollTrigger.batch('.catalog-product-card', {
        start: 'top 90%',
        once: true,
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            {
              opacity: 0,
              y: yDistance,
              scale: 0.98,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.75,
              stagger: staggerTime,
              ease: 'power2.out',
              overwrite: 'auto',
            }
          );
        },
      });
    }, catalogSectionRef);

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, [mode]);

  // Dynamic stagger reveal when filtering or searching products
  useEffect(() => {
    if (isFirstFilterRender.current) {
      isFirstFilterRender.current = false;
      return;
    }
    if (mode === 'showcase') return;
    if (!gridRef.current) return;

    const cards = gridRef.current.querySelectorAll('.catalog-product-card');
    if (cards.length > 0) {
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      gsap.fromTo(
        cards,
        { opacity: 0, y: isMobile ? 18 : 26, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: isMobile ? 0.04 : 0.06,
          ease: 'power2.out',
          overwrite: 'auto',
        }
      );
    }
  }, [selectedCategory, searchQuery, showOnlyInStock, mode]);

  const renderShowcase = () => (
    <div className="relative rounded-[2.5rem] border border-white/10 bg-[#000000] p-6 sm:p-12 md:p-16 overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.8)] min-h-[960px] sm:min-h-[920px] lg:min-h-[660px]">

          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 sm:mb-12 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#D1B992]" />
                <span className="font-sans text-[10.5px] uppercase tracking-[0.25em] text-[#D1B992] font-medium">
                  Pleins Feux sur l'Excellence // Édition 2026
                </span>
              </div>
              <h2 className="font-sans font-medium text-3xl sm:text-5xl md:text-6xl text-white tracking-tight leading-[1.05]">
                L'art de{' '}
                <span className="font-serif italic text-[#D1B992] font-normal">
                  l'élégance suprême.
                </span>
              </h2>
            </div>
          </div>

          {/* Showcase Stage (Matching Screenshot 3: Pure Black Seamless Stage + Floating Product Visual + Flanking Navigation) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center relative z-10">
            
            {/* Left: Floating Product Visual Stage with Flanking Left & Right Navigation Arrows */}
            <div className="lg:col-span-7 relative flex items-center justify-center py-4 sm:py-8">
              
              {/* Product Visual Wrapper with Flanking Arrows */}
              <div className="relative w-full max-w-[500px] flex items-center justify-center px-4 sm:px-6">
                
                {/* Left Navigation Arrow (Repositioned to the left of the visual, vertically centered) */}
                <button
                  onClick={handlePrevShowcase}
                  aria-label="Pièce précédente"
                  className="absolute left-0 sm:-left-3 md:-left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/20 bg-black/80 backdrop-blur-md text-white hover:border-[#D1B992] hover:text-[#D1B992] hover:bg-[#D1B992]/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-[0_4px_25px_rgba(0,0,0,0.9)]"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                {/* Right Navigation Arrow (Repositioned to the right of the visual, vertically centered) */}
                <button
                  onClick={handleNextShowcase}
                  aria-label="Pièce suivante"
                  className="absolute right-0 sm:-right-3 md:-right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/20 bg-black/80 backdrop-blur-md text-white hover:border-[#D1B992] hover:text-[#D1B992] hover:bg-[#D1B992]/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-[0_4px_25px_rgba(0,0,0,0.9)]"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                {/* Product Visual Container (Pure Black #000000 Seamless Integration) */}
                <div className="relative w-full aspect-square max-w-[430px] flex items-center justify-center">
                  {/* Floating Product Visual: Automatic Sequential 3D Rotating Video Animation */}
                  <div
                    className="relative z-10 w-[88%] sm:w-[92%] aspect-square rounded-[2rem] overflow-hidden group cursor-pointer animate-in fade-in zoom-in-95 duration-500 transform hover:-translate-y-1.5 transition-transform bg-[#000000] shadow-[0_15px_45px_rgba(0,0,0,0.9)]"
                    onClick={() => handleOpenConfigurator(activeShowcase)}
                  >
                    {/* Video 1: SAC (SAC.mp4) - Plays complete rotation first */}
                    <video
                      ref={saccVideoRef}
                      src="/videos/SAC.mp4"
                      autoPlay
                      muted
                      playsInline
                      preload="auto"
                      aria-label="Animation Sac VIRIL"
                      onEnded={handleSaccEnded}
                      onTimeUpdate={handleSaccTimeUpdate}
                      style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
                      className={`absolute inset-0 w-full h-full object-cover transform-gpu will-change-transform pointer-events-none transition-opacity duration-300 ease-in-out ${
                        currentShowcaseIdx === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'
                      }`}
                    />

                    {/* Video 2: CHAUSSURE (chaussure.mp4) - Plays complete rotation second */}
                    <video
                      ref={chaussureVideoRef}
                      src="/videos/chaussure.mp4"
                      muted
                      playsInline
                      preload="auto"
                      aria-label="Animation Chaussure VIRIL"
                      onEnded={handleChaussureEnded}
                      onTimeUpdate={handleChaussureTimeUpdate}
                      style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
                      className={`absolute inset-0 w-full h-full object-cover transform-gpu will-change-transform pointer-events-none transition-opacity duration-300 ease-in-out ${
                        currentShowcaseIdx === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0'
                      }`}
                    />

                    {/* Video 3: MONTRE (montre.mp4) - Plays complete rotation third */}
                    <video
                      ref={montreVideoRef}
                      src="/videos/montre.mp4"
                      muted
                      playsInline
                      preload="auto"
                      aria-label="Animation Montre VIRIL"
                      onEnded={handleMontreEnded}
                      onTimeUpdate={handleMontreTimeUpdate}
                      style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
                      className={`absolute inset-0 w-full h-full object-cover transform-gpu will-change-transform pointer-events-none transition-opacity duration-300 ease-in-out ${
                        currentShowcaseIdx === 2 ? 'opacity-100 z-10' : 'opacity-0 z-0'
                      }`}
                    />

                    {/* Video 4: PORTE-MONNAIE (porte-monnaie.mp4) - Plays complete rotation fourth */}
                    <video
                      ref={porteMonnaieVideoRef}
                      src="/videos/porte-monnaie.mp4"
                      muted
                      playsInline
                      preload="auto"
                      aria-label="Animation Porte-Monnaie VIRIL"
                      onEnded={handlePorteMonnaieEnded}
                      onTimeUpdate={handlePorteMonnaieTimeUpdate}
                      style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
                      className={`absolute inset-0 w-full h-full object-cover transform-gpu will-change-transform pointer-events-none transition-opacity duration-300 ease-in-out ${
                        currentShowcaseIdx === 3 ? 'opacity-100 z-10' : 'opacity-0 z-0'
                      }`}
                    />

                    {/* Restored Original Luxury Frosted Gold Glass Capsule Badge */}
                    {activeShowcase.badge && (
                      <div
                        className="absolute top-4 right-4 z-20 text-[10px] tracking-widest uppercase font-mono shadow-[0_6px_25px_rgba(0,0,0,0.7)] flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-badge-pill transition-all duration-300 pointer-events-none"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D1B992] shadow-[0_0_8px_#D1B992] animate-pulse" />
                        <span>{activeShowcase.badge}</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>

            {/* Right: Narrative Description & Customization Callout */}
            <div className="lg:col-span-5 min-h-[490px] sm:min-h-[470px] lg:min-h-[510px] flex flex-col justify-between">
              <div key={activeShowcase.id} className="animate-showcase-fade flex flex-col justify-between h-full space-y-5 sm:space-y-6">
                
                <div>
                  <span className="font-mono text-xs text-[#D1B992] tracking-widest uppercase block mb-1">
                    {activeShowcase.categoryLabel}
                  </span>
                  <h3 className="font-sans font-medium text-2xl sm:text-3xl md:text-4xl text-white tracking-tight leading-snug min-h-[3.2rem] sm:min-h-[4rem] flex items-center">
                    {activeShowcase.name}
                  </h3>
                  <p className="font-sans text-xs uppercase tracking-wider text-[#9AA0B4] mt-1">
                    {activeShowcase.sub}
                  </p>
                </div>

                {/* Star Rating & Review count */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center text-[#D4AF37]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="font-mono text-xs text-white font-semibold">
                    {activeShowcase.rating.toFixed(1)} / 5.0
                  </span>
                  <span className="text-xs text-[#5E6479]">
                    ({activeShowcase.reviewsCount} avis vérifiés)
                  </span>
                </div>

                {/* Highlight Quote */}
                <blockquote className="font-serif italic text-base sm:text-lg text-[#FAF8F5] leading-relaxed border-l-2 border-[#D1B992] pl-4 py-1 min-h-[3.8rem] flex items-center">
                  « {activeShowcase.featureQuote} »
                </blockquote>

                <p className="font-sans text-sm text-[#9AA0B4] leading-relaxed min-h-[4.4rem]">
                  {activeShowcase.description}
                </p>

                {/* Specifications Badges */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl border border-white/10 bg-[#04050A]">
                    <span className="text-[10px] uppercase tracking-wider text-[#5E6479] block mb-0.5">Matière première</span>
                    <strong className="text-white font-medium truncate block">{activeShowcase.tag}</strong>
                  </div>
                  <div className="p-3 rounded-xl border border-white/10 bg-[#04050A]">
                    <span className="text-[10px] uppercase tracking-wider text-[#5E6479] block mb-0.5">Sur-mesure</span>
                    <strong className="text-[#D1B992] font-medium block">Gravure Laser Dispo</strong>
                  </div>
                </div>

                {/* Pricing & CTA */}
                <div className="pt-2 space-y-4">
                  <div className="text-center sm:text-left">
                    <span className="text-[10.5px] uppercase tracking-wider text-[#5E6479] block mb-0.5">Prix création</span>
                    <div className="flex items-baseline justify-center sm:justify-start gap-2.5">
                      <span className="font-sans font-bold text-2xl sm:text-3xl text-white">
                        {formatMoney(activeShowcase.price)}
                      </span>
                      {activeShowcase.originalPrice && (
                        <span className="font-mono text-sm text-[#5E6479] line-through">
                          {formatMoney(activeShowcase.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="w-full flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2.5 sm:gap-3">
                    <button
                      onClick={() => handleOpenConfigurator(activeShowcase)}
                      className="btn-main btn--line cursor-pointer inline-flex items-center justify-center gap-2 w-full sm:w-auto py-2.5 sm:py-3 px-4 sm:px-5 text-[10px] sm:text-[11px] tracking-wider"
                    >
                      <span>Personnaliser ce modèle</span>
                      <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
                    </button>
                    <button
                      onClick={() => unlockNav('boutique')}
                      className="btn-main btn--solid btn-light-sweep cursor-pointer inline-flex items-center justify-center gap-2 w-full sm:w-auto py-2.5 sm:py-3 px-4 sm:px-5 text-[10px] sm:text-[11px] tracking-wider shadow-[0_0_20px_rgba(209,185,146,0.4)]"
                    >
                      <span>Découvrir la collection</span>
                      <ArrowRight className="w-3.5 h-3.5 text-black flex-shrink-0" />
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Interactive Pagination Dots (Inspired by Screenshot 3) */}
          <div className="flex items-center justify-center gap-2.5 mt-8 pt-6 border-t border-white/10 relative z-10">
            {showcaseProducts.map((p, idx) => {
              const isActive = idx === currentShowcaseIdx;
              return (
                <button
                  key={p.id}
                  onClick={() => setCurrentShowcaseIdx(idx)}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    isActive
                      ? 'w-8 h-2 bg-[#D1B992] shadow-[0_0_12px_#D1B992]'
                      : 'w-2 h-2 bg-white/20 hover:bg-white/50'
                  }`}
                  aria-label={`Aller au slide ${idx + 1}`}
                />
              );
            })}
          </div>
        </div>
      );

  const renderCatalog = () => (
    <div ref={catalogSectionRef} id="boutique" className="space-y-10 scroll-mt-24">
          
          {/* Header of the Catalog (Scroll-Reveal) */}
          <div className="catalog-reveal-header flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-white/10">
            <div>
              <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#D1B992] font-medium mb-2">
                Le Vestiaire & Les Accessoires
              </p>
              <h3 className="font-sans font-medium text-3xl sm:text-4xl text-white tracking-tight">
                Collection Complète
              </h3>
            </div>

            {/* Privilege Announcement Strip */}
            <div className="glass-badge-pill px-4 py-2 text-xs shadow-[0_0_20px_rgba(209,185,146,0.2)]">
              <span className="w-2 h-2 rounded-full bg-[#D1B992] animate-ping" />
              <span className="text-[#D1B992] font-semibold uppercase tracking-wider text-[11px]">
                Offre Privilège Cameroun :
              </span>
              <span className="text-white hidden sm:inline text-xs">
                Livraison express offerte + Écrin luxe offert
              </span>
            </div>
          </div>

          {/* Search Bar & Filter Controls (Scroll-Reveal) */}
          <div className="catalog-reveal-controls grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-center">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#9AA0B4] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Rechercher par nom, cuir, montre, bracelet..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#0A0C16] border border-white/10 text-white placeholder-[#5E6479] text-xs sm:text-sm focus:border-[#D1B992] focus:outline-none transition-colors shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#5E6479] hover:text-white cursor-pointer"
                >
                  Effacer
                </button>
              )}
            </div>

            {/* Quick Filter Toggle Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowOnlyInStock(!showOnlyInStock)}
                className={`px-4 py-3 rounded-2xl border text-xs font-sans tracking-wide transition-all flex items-center gap-2 cursor-pointer ${
                  showOnlyInStock
                    ? 'border-[#D1B992] bg-[#D1B992]/10 text-[#D1B992] shadow-[0_0_15px_rgba(209,185,146,0.2)]'
                    : 'border-white/10 bg-[#0A0C16] text-[#9AA0B4] hover:border-white/25 hover:text-white'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Disponible immédiatement</span>
              </button>
            </div>
          </div>

          {/* Category Tabs (Scroll-Reveal) */}
          <div className="catalog-reveal-categories flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 sm:px-5 py-2.5 rounded-full border text-xs sm:text-[13px] font-sans font-medium whitespace-nowrap transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'border-[#D1B992] bg-[#D1B992] text-[#04050A] shadow-[0_0_20px_rgba(209,185,146,0.4)] scale-105'
                      : 'border-white/10 bg-[#0A0C16] text-[#9AA0B4] hover:text-white hover:border-white/20 hover:scale-[1.02]'
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Products Grid (Scroll-Reveal & Luxury Hover Effects) */}
          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center text-[#5E6479] rounded-2xl border border-white/5 bg-[#0A0C16]">
              <p className="text-sm text-[#9AA0B4] mb-2">Aucune création ne correspond à votre recherche.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setShowOnlyInStock(false);
                }}
                className="text-xs text-[#D1B992] hover:underline cursor-pointer"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredProducts.map((product) => {
                const isFav = isFavorite(product.id);
                return (
                  <article
                    key={product.id}
                    className="catalog-product-card group relative rounded-3xl border border-white/10 bg-[#0A0C16] hover:border-[#D1B992]/40 p-5 sm:p-6 flex flex-col justify-between overflow-hidden transition-all duration-500 hover:-translate-y-2 shadow-[0_15px_40px_rgba(0,0,0,0.5)] hover:shadow-[0_25px_60px_rgba(209,185,146,0.15),0_10px_30px_rgba(0,0,0,0.8)]"
                  >
                    {/* Top Row: Tag Badge & Wishlist Heart */}
                    <div className="flex items-center justify-between mb-4 relative z-20">
                      <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[9.5px] uppercase font-mono tracking-widest text-[#D1B992]">
                        {product.badge}
                      </span>

                      {/* Interactive Wishlist Heart Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(product.id);
                        }}
                        className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                          isFav
                            ? 'border-red-500/50 bg-red-500/20 text-red-500 scale-110 shadow-[0_0_12px_rgba(239,68,68,0.4)]'
                            : 'border-white/10 bg-black/40 text-white/60 hover:text-white hover:border-white/30 hover:scale-105 active:scale-95'
                        }`}
                        aria-label={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                      >
                        <Heart className={`w-4 h-4 transition-transform ${isFav ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Product Image Stage with Subtle Elevation & Zoom on Hover */}
                    <div 
                      onClick={() => handleOpenConfigurator(product)}
                      className="relative w-full aspect-square rounded-2xl bg-[#04050A] border border-white/5 p-4 flex items-center justify-center overflow-hidden mb-5 cursor-pointer group-hover:border-[#D1B992]/25 transition-all duration-500 shadow-inner"
                    >
                      {/* Subtle Ambient Backing Glow */}
                      <div 
                        className={`absolute inset-0 opacity-20 filter blur-xl transition-opacity duration-700 group-hover:opacity-50 ${
                          product.paintBgShape || 'bg-[#D1B992]/20'
                        }`} 
                      />

                      {/* 3D Animation Pill Badge if product has video */}
                      {product.video && (
                        <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-[#D1B992]/50 text-[9px] uppercase font-mono tracking-wider text-[#D1B992] flex items-center gap-1.5 shadow-lg">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D1B992] animate-pulse" />
                          <span>Animation 3D</span>
                        </div>
                      )}

                      {/* Product Visual: 3D Video Animation if available, otherwise Image with hover zoom */}
                      {product.video ? (
                        <video
                          src={product.video}
                          autoPlay
                          muted
                          loop
                          playsInline
                          preload="metadata"
                          className="relative z-10 w-full h-full object-cover rounded-xl filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.85)] group-hover:drop-shadow-[0_22px_35px_rgba(0,0,0,0.95)] group-hover:scale-[1.04] transition-all duration-700 ease-out pointer-events-none"
                        />
                      ) : (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.85)] group-hover:drop-shadow-[0_22px_35px_rgba(0,0,0,0.95)] group-hover:scale-[1.06] group-hover:-translate-y-1 transition-all duration-700 ease-out"
                          loading="lazy"
                        />
                      )}

                      {/* Hover Overlay Prompt */}
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                        <span className="px-4 py-2 rounded-full bg-[#D1B992] text-[#04050A] font-semibold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(209,185,146,0.4)] transform translate-y-2 group-hover:translate-y-0 transition-transform">
                          Personnaliser
                        </span>
                      </div>
                    </div>

                    {/* Product Info & Pricing */}
                    <div className="space-y-3 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Rating */}
                        <div className="flex items-center gap-1.5 text-[11px] text-[#9AA0B4] mb-1">
                          <div className="flex text-[#D4AF37]">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-current" />
                            ))}
                          </div>
                          <span className="font-mono text-white font-medium">{product.rating}</span>
                          <span className="text-[#5E6479]">({product.reviewsCount})</span>
                        </div>

                        {/* Title */}
                        <h4 
                          onClick={() => handleOpenConfigurator(product)}
                          className="font-sans font-medium text-lg sm:text-xl text-white group-hover:text-[#D1B992] transition-colors cursor-pointer leading-snug"
                        >
                          {product.name}
                        </h4>

                        {/* Subtitle / Description */}
                        <p className="font-sans text-xs text-[#9AA0B4] mt-1 line-clamp-1">
                          {product.sub}
                        </p>
                      </div>

                      {/* Price Row + Actions */}
                      <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                        <div>
                          <div className="font-sans font-bold text-lg sm:text-xl text-white">
                            {formatMoney(product.price)}
                          </div>
                          {product.originalPrice && (
                            <span className="font-mono text-[11px] text-[#5E6479] line-through block -mt-0.5">
                              {formatMoney(product.originalPrice)}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          {/* Customize / Configurator button */}
                          <button
                            type="button"
                            onClick={() => handleOpenConfigurator(product)}
                            className="px-3.5 py-2 rounded-full border border-white/15 bg-white/[0.04] text-[11px] uppercase tracking-wider text-white hover:text-[#D1B992] hover:border-[#D1B992] hover:bg-[#D1B992]/10 transition-all cursor-pointer font-medium active:scale-95"
                          >
                            Configurer
                          </button>

                          {/* Fast Add to Cart Button */}
                          <button
                            type="button"
                            onClick={() =>
                              addToCart({
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                image: product.image,
                                selectedMaterial: product.materials[0],
                                selectedSize: product.sizes[0],
                                selectedColor: product.colors[0]?.name || 'Standard'
                              })
                            }
                            title="Ajout rapide au panier"
                            className="w-9 h-9 rounded-full bg-[#D1B992]/10 border border-[#D1B992]/40 text-[#D1B992] hover:bg-[#D1B992] hover:text-[#04050A] hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-[0_0_12px_rgba(209,185,146,0.2)] hover:shadow-[0_0_20px_rgba(209,185,146,0.5)]"
                            aria-label="Ajouter au panier"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      );

  if (mode === 'showcase') {
    return (
      <section id="excellence" className="relative w-full py-16 sm:py-24 px-6 sm:px-10 md:px-16 bg-[#000000]">
        <div className="max-w-[1440px] mx-auto">
          {renderShowcase()}
        </div>
        {!onOpenCustomizer && (
          <ProductCustomizerModal
            product={localCustomizingProduct}
            isOpen={Boolean(localCustomizingProduct)}
            onClose={() => setLocalCustomizingProduct(null)}
          />
        )}
      </section>
    );
  }

  if (mode === 'catalog') {
    return (
      <section id="boutique" className="relative w-full pt-28 sm:pt-36 pb-24 px-6 sm:px-10 md:px-16 bg-[#04050A] scroll-mt-20">
        <div className="max-w-[1440px] mx-auto">
          {renderCatalog()}
        </div>
        {!onOpenCustomizer && (
          <ProductCustomizerModal
            product={localCustomizingProduct}
            isOpen={Boolean(localCustomizingProduct)}
            onClose={() => setLocalCustomizingProduct(null)}
          />
        )}
      </section>
    );
  }

  return (
    <section id="collections" className="relative w-full py-24 sm:py-32 px-6 sm:px-10 md:px-16 bg-[#000000]">
      <div className="max-w-[1440px] mx-auto space-y-24">
        {renderShowcase()}
        {renderCatalog()}
      </div>
      {!onOpenCustomizer && (
        <ProductCustomizerModal
          product={localCustomizingProduct}
          isOpen={Boolean(localCustomizingProduct)}
          onClose={() => setLocalCustomizingProduct(null)}
        />
      )}
    </section>
  );
}
