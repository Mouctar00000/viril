import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useCart } from '../context/CartContext';
import { PRODUCTS, CATEGORIES } from '../data/products';
import ProductCustomizerModal from './ProductCustomizerModal';
import { useScrollReveal } from '../hooks/useScrollReveal';
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
  Star,
  LayoutGrid,
  Layers
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/**
 * Apple-Inspired Luxury Product Card
 * Implements interactive color swatches, aspect-square visual stage with 3D video/image,
 * wishlist heart, ratings, and instant configuration / add-to-cart actions.
 */
function AppleProductCard({
  product,
  formatMoney,
  isFavorite,
  toggleFavorite,
  handleOpenConfigurator,
  addToCart,
  isGrid = false,
}) {
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const isFav = isFavorite(product.id);
  const selectedColor = product.colors?.[selectedColorIdx];

  const handleFastAdd = (e) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      selectedMaterial: product.materials[0],
      selectedSize: product.sizes[0],
      selectedColor: selectedColor?.name || 'Standard',
    });
  };

  const cardWidthClass = isGrid
    ? 'w-full'
    : 'min-w-[280px] xs:min-w-[310px] sm:min-w-[330px] md:min-w-[350px] max-w-[360px] snap-start flex-shrink-0';

  return (
    <article
      className={`catalog-product-card apple-product-card ${cardWidthClass} flex flex-col justify-between rounded-[2rem] border border-white/10 bg-[#0A0C16] hover:border-[#D1B992]/40 transition-all duration-500 hover:-translate-y-1.5 p-5 sm:p-6 shadow-[0_15px_40px_rgba(0,0,0,0.5)] hover:shadow-[0_25px_60px_rgba(209,185,146,0.15)] group relative overflow-hidden`}
    >
      {/* Top Row: Badge & Wishlist Button */}
      <div className="flex items-center justify-between mb-3 relative z-20">
        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9.5px] uppercase font-mono tracking-widest text-[#D1B992] flex items-center gap-1.5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D1B992] shadow-[0_0_6px_#D1B992]" />
          <span>{product.badge}</span>
        </span>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
            isFav
              ? 'border-red-500/50 bg-red-500/20 text-red-500 scale-110 shadow-[0_0_12px_rgba(239,68,68,0.4)]'
              : 'border-white/10 bg-black/50 text-white/60 hover:text-white hover:border-white/30 hover:scale-105 active:scale-95'
          }`}
          aria-label={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <Heart className={`w-4 h-4 transition-transform ${isFav ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Center Visual Stage with 3D Video or Image */}
      <div
        onClick={() => handleOpenConfigurator(product)}
        className="relative w-full aspect-square rounded-2xl bg-[#04050A] border border-white/5 p-4 flex items-center justify-center overflow-hidden mb-4 cursor-pointer group-hover:border-[#D1B992]/30 transition-all duration-500 shadow-inner"
      >
        <div className="absolute inset-0 luxury-skeleton-shimmer z-0 pointer-events-none opacity-40" />

        <div
          className={`absolute inset-0 opacity-20 filter blur-xl transition-opacity duration-700 group-hover:opacity-40 ${
            product.paintBgShape || 'bg-[#D1B992]/20'
          }`}
        />

        {product.video && (
          <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#D1B992]/50 text-[9px] uppercase font-mono tracking-wider text-[#D1B992] flex items-center gap-1.5 shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D1B992] animate-pulse" />
            <span>Animation 3D</span>
          </div>
        )}

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

        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
          <span className="px-4 py-2 rounded-full bg-[#D1B992] text-[#04050A] font-semibold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(209,185,146,0.4)] transform translate-y-2 group-hover:translate-y-0 transition-transform">
            Personnaliser
          </span>
        </div>
      </div>

      {/* Color Swatches Row (Inspired by Apple reference screenshots) */}
      <div className="mb-3 min-h-[30px] flex items-center justify-between gap-2 border-b border-white/5 pb-2.5">
        {product.colors && product.colors.length > 0 ? (
          <>
            <div className="flex items-center gap-2">
              {product.colors.map((c, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedColorIdx(idx);
                  }}
                  title={c.name}
                  className={`w-3.5 h-3.5 rounded-full transition-all duration-300 cursor-pointer relative ${
                    selectedColorIdx === idx
                      ? 'ring-2 ring-[#D1B992] ring-offset-2 ring-offset-[#0A0C16] scale-110'
                      : 'opacity-70 hover:opacity-100 hover:scale-110'
                  }`}
                  style={{
                    backgroundColor: c.hex.includes('gradient') ? undefined : c.hex,
                    background: c.hex.includes('gradient') ? c.hex : undefined,
                  }}
                  aria-label={`Coloris ${c.name}`}
                />
              ))}
            </div>
            <span className="text-[10px] text-[#9AA0B4] font-mono tracking-wider truncate max-w-[145px]">
              {selectedColor?.name}
            </span>
          </>
        ) : (
          <div className="flex items-center justify-between w-full">
            <span className="text-[10px] text-[#5E6479] font-mono tracking-wider">
              Édition Unique
            </span>
            <span className="text-[10px] text-[#D1B992] font-mono">100% Authentique</span>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="space-y-2 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#9AA0B4] mb-1">
            <div className="flex text-[#D4AF37]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-current" />
              ))}
            </div>
            <span className="font-mono text-white font-medium">{product.rating.toFixed(1)}</span>
            <span className="text-[#5E6479]">({product.reviewsCount})</span>
          </div>

          <h4
            onClick={() => handleOpenConfigurator(product)}
            className="font-sans font-medium text-lg sm:text-xl text-white group-hover:text-[#D1B992] transition-colors cursor-pointer leading-snug line-clamp-1"
          >
            {product.name}
          </h4>

          <p className="font-sans text-xs text-[#9AA0B4] line-clamp-1">
            {product.sub}
          </p>
        </div>

        {/* Pricing and Actions */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
          <div>
            <div className="font-sans font-bold text-lg text-white">
              {formatMoney(product.price)}
            </div>
            {product.originalPrice && (
              <span className="font-mono text-[11px] text-[#5E6479] line-through block -mt-0.5">
                {formatMoney(product.originalPrice)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleOpenConfigurator(product)}
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full border border-white/15 bg-white/[0.04] text-[10.5px] uppercase tracking-wider text-white hover:text-[#D1B992] hover:border-[#D1B992] hover:bg-[#D1B992]/10 transition-all cursor-pointer font-medium active:scale-95"
            >
              Configurer
            </button>

            <button
              type="button"
              onClick={handleFastAdd}
              title="Ajout rapide au panier"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#D1B992]/10 border border-[#D1B992]/40 text-[#D1B992] hover:bg-[#D1B992] hover:text-[#04050A] hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-[0_0_12px_rgba(209,185,146,0.2)] hover:shadow-[0_0_20px_rgba(209,185,146,0.5)]"
              aria-label="Ajouter au panier"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

/**
 * Apple-Style Editorial Intro Card
 * Introduces the shelf with bold editorial typography and overlapping signature accessories
 */
function EditorialIntroCard({ onExploreAll }) {
  return (
    <article className="catalog-product-card min-w-[280px] xs:min-w-[310px] sm:min-w-[330px] md:min-w-[350px] max-w-[360px] snap-start flex-shrink-0 flex flex-col justify-between rounded-[2rem] border border-[#D1B992]/35 bg-gradient-to-b from-[#151929] via-[#0B0D18] to-[#04050A] p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.7)] group relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-[#D1B992]/15 filter blur-3xl pointer-events-none group-hover:bg-[#D1B992]/25 transition-all duration-700" />
      <div className="absolute -bottom-20 -left-20 w-44 h-44 rounded-full bg-[#162842]/30 filter blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D1B992]/10 border border-[#D1B992]/30 text-[#D1B992] text-[10px] font-mono uppercase tracking-widest">
          <Sparkles className="w-3 h-3 text-[#D1B992]" />
          <span>Sélection Privilège</span>
        </span>

        <h4 className="font-sans font-medium text-2xl sm:text-3xl text-white tracking-tight leading-[1.15]">
          Vos nouveaux <br />
          <span className="font-serif italic text-[#D1B992] font-normal">coups de cœur.</span>
        </h4>

        <p className="font-sans text-xs sm:text-[13px] text-[#9AA0B4] leading-relaxed">
          Des pièces de haute maroquinerie, d'horlogerie et de joaillerie masculine façonnées dans des matières d'exception.
        </p>
      </div>

      {/* Visual Composition: Overlapping Apple-style Hero Trio */}
      <div className="relative z-10 my-4 py-2 flex items-center justify-center">
        <div className="relative w-full max-w-[240px] h-[145px] flex items-center justify-center">
          {/* Item 1: Watch (Back Left) */}
          <div className="absolute left-2 top-2 w-20 h-20 rounded-2xl bg-black/60 border border-white/10 p-1.5 transform -rotate-12 group-hover:-rotate-6 transition-transform duration-500 shadow-xl overflow-hidden">
            <img
              src="/images/montre.jpg"
              alt="Montre Tank"
              className="w-full h-full object-cover rounded-xl"
              loading="lazy"
            />
          </div>

          {/* Item 2: Bracelet (Back Right) */}
          <div className="absolute right-2 top-2 w-20 h-20 rounded-2xl bg-black/60 border border-white/10 p-1.5 transform rotate-12 group-hover:rotate-6 transition-transform duration-500 shadow-xl overflow-hidden">
            <img
              src="/images/bracelet-clou.jpg"
              alt="Bracelet Clou"
              className="w-full h-full object-cover rounded-xl"
              loading="lazy"
            />
          </div>

          {/* Item 3: Bag (Front Center) */}
          <div className="relative z-10 w-28 h-28 rounded-2xl bg-black/80 border border-[#D1B992]/40 p-2 transform group-hover:scale-105 transition-transform duration-500 shadow-[0_15px_30px_rgba(0,0,0,0.9)] overflow-hidden">
            <img
              src="/images/SAC.jpg"
              alt="Luxury Croco Bag"
              className="w-full h-full object-cover rounded-xl"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between">
        <span className="font-mono text-[10.5px] uppercase tracking-wider text-[#D1B992]">
          7 Pièces de Maître
        </span>
        <button
          type="button"
          onClick={onExploreAll}
          className="inline-flex items-center gap-1.5 text-xs text-white hover:text-[#D1B992] transition-colors cursor-pointer group/btn"
        >
          <span className="font-medium">Explorer tout</span>
          <ArrowRight className="w-3.5 h-3.5 transform group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </article>
  );
}

/**
 * Apple-Style Horizontal Product Shelf
 * Smooth horizontal carousel with snap scrolling, subtle desktop prev/next controls,
 * and touch swiping on mobile.
 */
function ProductShelf({
  eyebrow,
  title,
  highlightWord,
  subtitle,
  products,
  introCard,
  formatMoney,
  isFavorite,
  toggleFavorite,
  handleOpenConfigurator,
  addToCart,
}) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll, products]);

  const scrollBy = (offset) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="space-y-5">
      {/* Shelf Header */}
      <div className="flex items-end justify-between gap-4">
        <div>
          {eyebrow && (
            <span className="font-mono text-[10px] sm:text-xs text-[#D1B992] tracking-widest uppercase block mb-1">
              {eyebrow}
            </span>
          )}
          <h3 className="font-sans font-medium text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-snug">
            {title}{' '}
            {highlightWord && (
              <span className="font-serif italic text-[#D1B992] font-normal">
                {highlightWord}
              </span>
            )}
          </h3>
          {subtitle && (
            <p className="font-sans text-xs sm:text-sm text-[#9AA0B4] mt-1 max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>

        {/* Controls: Desktop Prev / Next & Mobile Touch Swipe Hint */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#5E6479] flex sm:hidden items-center gap-1">
            Glisser ➔
          </span>

          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollBy(-360)}
              disabled={!canScrollLeft}
              aria-label="Faire défiler vers la gauche"
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                canScrollLeft
                  ? 'border-white/20 bg-[#0A0C16] text-white hover:border-[#D1B992] hover:text-[#D1B992] hover:scale-105 active:scale-95 shadow-md'
                  : 'border-white/5 bg-white/[0.02] text-[#5E6479] opacity-30 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(360)}
              disabled={!canScrollRight}
              aria-label="Faire défiler vers la droite"
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                canScrollRight
                  ? 'border-white/20 bg-[#0A0C16] text-white hover:border-[#D1B992] hover:text-[#D1B992] hover:scale-105 active:scale-95 shadow-md'
                  : 'border-white/5 bg-white/[0.02] text-[#5E6479] opacity-30 cursor-not-allowed'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Track with touch swipe and snap */}
      <div
        ref={scrollContainerRef}
        className="flex gap-5 sm:gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory pt-2 pb-6 px-1 -mx-2 sm:-mx-4 px-2 sm:px-4"
        style={{ scrollPaddingLeft: '1rem', scrollPaddingRight: '1rem' }}
      >
        {introCard}

        {products.map((product) => (
          <AppleProductCard
            key={product.id}
            product={product}
            formatMoney={formatMoney}
            isFavorite={isFavorite}
            toggleFavorite={toggleFavorite}
            handleOpenConfigurator={handleOpenConfigurator}
            addToCart={addToCart}
          />
        ))}
      </div>
    </section>
  );
}

export default function Elegance({ onOpenCustomizer, mode = 'all' }) {
  const { addToCart, formatMoney, toggleFavorite, isFavorite, unlockNav } = useCart();
  const saccVideoRef = useRef(null);
  const chaussureVideoRef = useRef(null);
  const montreVideoRef = useRef(null);
  const porteMonnaieVideoRef = useRef(null);
  const catalogSectionRef = useRef(null);
  const gridRef = useRef(null);
  const isFirstFilterRender = useRef(true);

  // Initialize compositor-friendly scroll reveal animations
  useScrollReveal('.reveal-on-scroll', [mode]);

  // Sequential Animation Showcase: SAC (sacc.mp4) -> CHAUSSURE (chaussure.mp4) -> MONTRE (montre.mp4) -> PORTE-MONNAIE (porte-monnaie.mp4)
  const showcaseProducts = useMemo(() => {
    const sacc = PRODUCTS.find((p) => p.id === 'art-3');
    const chaussure = PRODUCTS.find((p) => p.id === 'art-7');
    const montre = PRODUCTS.find((p) => p.id === 'art-6');
    const porteMonnaie = PRODUCTS.find((p) => p.id === 'art-2');
    return [sacc, chaussure, montre, porteMonnaie].filter(Boolean);
  }, []);

  const [currentShowcaseIdx, setCurrentShowcaseIdx] = useState(0);
  const [prevShowcaseIdx, setPrevShowcaseIdx] = useState(null);
  const activeShowcase = showcaseProducts[currentShowcaseIdx] || showcaseProducts[0];
  const isTransitioningRef = useRef(false);
  const transitionTimerRef = useRef(null);

  const videoRefs = useMemo(
    () => [saccVideoRef, chaussureVideoRef, montreVideoRef, porteMonnaieVideoRef],
    []
  );

  // Seamless crossfade transition coordinator: plays incoming video before fading out outgoing video
  // Guarantees ZERO black flashes, ZERO frozen frames, and ZERO layout jumps
  const transitionToShowcase = useCallback((nextIdx) => {
    if (isTransitioningRef.current || nextIdx === currentShowcaseIdx) return;
    isTransitioningRef.current = true;

    const outgoingIdx = currentShowcaseIdx;
    setPrevShowcaseIdx(outgoingIdx);
    setCurrentShowcaseIdx(nextIdx);

    // 1. Immediately cue and play the incoming video asset
    const incomingVideo = videoRefs[nextIdx]?.current;
    if (incomingVideo) {
      incomingVideo.currentTime = 0;
      incomingVideo.playbackRate = 1.0;
      incomingVideo.play().catch(() => {});
    }

    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
    }

    // 2. Allow 450ms crossfade overlap: keep outgoing video running cleanly until incoming is 100% visible
    transitionTimerRef.current = setTimeout(() => {
      const outgoingVideo = videoRefs[outgoingIdx]?.current;
      if (outgoingVideo) {
        outgoingVideo.pause();
        outgoingVideo.currentTime = 0;
      }
      setPrevShowcaseIdx(null);
      isTransitioningRef.current = false;
    }, 450);
  }, [currentShowcaseIdx, videoRefs]);

  const handleNextShowcase = () => {
    transitionToShowcase((currentShowcaseIdx + 1) % showcaseProducts.length);
  };

  const handlePrevShowcase = () => {
    transitionToShowcase((currentShowcaseIdx - 1 + showcaseProducts.length) % showcaseProducts.length);
  };

  // Initial autoplay on first render
  useEffect(() => {
    const firstVideo = saccVideoRef.current;
    if (firstVideo) {
      firstVideo.currentTime = 0;
      firstVideo.playbackRate = 1.0;
      firstVideo.play().catch(() => {});
    }
    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, []);

  // Catalog Filter & Search States
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyInStock, setShowOnlyInStock] = useState(false);
  const [localCustomizingProduct, setLocalCustomizingProduct] = useState(null);

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

  // Browse Mode: 'shelves' (Apple-inspired horizontal carousels stacked vertically) or 'grid' (all items in spacious grid)
  const [browseMode, setBrowseMode] = useState('shelves');

  // Curated Apple-Style Shelves
  const shelfCoupsDeCoeur = useMemo(() => {
    const ids = ['art-3', 'art-7', 'art-6', 'art-1', 'art-2'];
    return ids.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean);
  }, []);

  const shelfMaroquinerie = useMemo(() => {
    const ids = ['art-3', 'art-4', 'art-2', 'art-5'];
    return ids.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean);
  }, []);

  const shelfHorlogerie = useMemo(() => {
    const ids = ['art-6', 'art-1', 'art-7'];
    return ids.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean);
  }, []);

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
    <div className="relative rounded-[2.5rem] border border-white/10 bg-[#000000] p-6 sm:p-12 md:p-16 overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.8)]">

          {/* Section Header: Exactly "Plein feu sur l'excellence" without edition or extra words */}
          <div className="mb-8 sm:mb-12 relative z-10">
            <h2 className="font-sans font-medium text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1] whitespace-normal sm:whitespace-nowrap">
              Plein feu sur <span className="font-serif italic text-[#D1B992] font-normal">l'excellence</span>
            </h2>
          </div>

          {/* Showcase Stage: Pure Black Seamless Stage + Floating Product Visual + Flanking Navigation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center relative z-10">
            
            {/* Left: Floating Product Visual Stage with Flanking Left & Right Navigation Arrows */}
            <div className="lg:col-span-7 relative flex items-center justify-center py-4 sm:py-6">
              
              {/* Product Visual Wrapper with Flanking Arrows */}
              <div className="relative w-full max-w-[500px] flex items-center justify-center px-4 sm:px-6">
                
                {/* Left Navigation Arrow */}
                <button
                  onClick={handlePrevShowcase}
                  aria-label="Pièce précédente"
                  className="absolute left-0 sm:-left-3 md:-left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/20 bg-black/80 backdrop-blur-md text-white hover:border-[#D1B992] hover:text-[#D1B992] hover:bg-[#D1B992]/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-[0_4px_25px_rgba(0,0,0,0.9)]"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                {/* Right Navigation Arrow */}
                <button
                  onClick={handleNextShowcase}
                  aria-label="Pièce suivante"
                  className="absolute right-0 sm:-right-3 md:-right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/20 bg-black/80 backdrop-blur-md text-white hover:border-[#D1B992] hover:text-[#D1B992] hover:bg-[#D1B992]/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-[0_4px_25px_rgba(0,0,0,0.9)]"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                {/* Product Visual Container with Stable Aspect Ratio & Shimmer Fallback */}
                <div className="relative w-full aspect-square max-w-[430px] flex items-center justify-center">
                  
                  {/* Floating Product Visual: 3D Video Asset with Instant Poster Fallback */}
                  <div
                    className="relative z-10 w-[88%] sm:w-[92%] aspect-square rounded-[2rem] overflow-hidden group cursor-pointer bg-[#000000] shadow-[0_15px_45px_rgba(0,0,0,0.9)]"
                    onClick={() => handleOpenConfigurator(activeShowcase)}
                  >
                    {/* Underlying Skeleton Shimmer Placeholder (Guarantees zero blank screen on slow network) */}
                    <div className="absolute inset-0 luxury-skeleton-shimmer z-0 pointer-events-none" />

                    {/* Sequential Product Videos with Smooth Crossfade Overlap */}
                    {showcaseProducts.map((prod, idx) => {
                      const isActive = idx === currentShowcaseIdx;
                      const isOutgoing = idx === prevShowcaseIdx;

                      return (
                        <div
                          key={prod.id}
                          className={`absolute inset-0 w-full h-full transition-opacity duration-500 ease-out ${
                            isActive
                              ? 'opacity-100 z-10 pointer-events-auto'
                              : isOutgoing
                              ? 'opacity-80 z-5 pointer-events-none'
                              : 'opacity-0 z-0 pointer-events-none'
                          }`}
                        >
                          {/* High-Resolution Sharp Poster Image as Instant Fallback */}
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                              isActive ? 'opacity-100' : 'opacity-0'
                            }`}
                            loading={idx === 0 ? 'eager' : 'lazy'}
                          />

                          {/* 3D Quad-HD Rotating Video Asset */}
                          <video
                            ref={videoRefs[idx]}
                            src={prod.video}
                            autoPlay={idx === 0}
                            muted
                            playsInline
                            preload={idx <= 1 ? 'auto' : 'metadata'}
                            aria-label={`Animation ${prod.name}`}
                            onEnded={() => transitionToShowcase((idx + 1) % showcaseProducts.length)}
                            onTimeUpdate={(e) => {
                              const v = e.currentTarget;
                              if (isActive && v.duration && v.currentTime >= v.duration - 0.08) {
                                transitionToShowcase((idx + 1) % showcaseProducts.length);
                              }
                            }}
                            style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
                            className="absolute inset-0 w-full h-full object-cover transform-gpu will-change-transform pointer-events-none"
                          />
                        </div>
                      );
                    })}

                    {/* Restored Original Luxury Frosted Gold Glass Capsule Badge */}
                    {activeShowcase.badge && (
                      <div
                        key={activeShowcase.badge}
                        className="absolute top-4 right-4 z-20 text-[10px] tracking-widest uppercase font-mono shadow-[0_6px_25px_rgba(0,0,0,0.7)] flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-badge-pill transition-opacity duration-300 pointer-events-none"
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
            <div className="lg:col-span-5 relative">
              
              {/* CSS Grid Shared-Cell: col-start-1 row-start-1 locks the container height to the maximum of all 4 products.
                  Guarantees 100% stable container height, zero layout shifts, and silky cross-fade text transitions! */}
              <div className="grid grid-cols-1 grid-rows-1 w-full">
                {showcaseProducts.map((prod, idx) => {
                  const isActive = idx === currentShowcaseIdx;
                  return (
                    <div
                      key={prod.id}
                      className={`col-start-1 row-start-1 w-full flex flex-col justify-between space-y-5 sm:space-y-6 transition-all duration-500 ease-out ${
                        isActive
                          ? 'opacity-100 translate-y-0 pointer-events-auto z-10'
                          : 'opacity-0 translate-y-3 pointer-events-none z-0'
                      }`}
                      aria-hidden={!isActive}
                    >
                      <div>
                        <span className="font-mono text-xs text-[#D1B992] tracking-widest uppercase block mb-1">
                          {prod.categoryLabel}
                        </span>
                        <h3 className="font-sans font-medium text-2xl sm:text-3xl md:text-4xl text-white tracking-tight leading-snug">
                          {prod.name}
                        </h3>
                        <p className="font-sans text-xs uppercase tracking-wider text-[#9AA0B4] mt-1">
                          {prod.sub}
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
                          {prod.rating.toFixed(1)} / 5.0
                        </span>
                        <span className="text-xs text-[#5E6479]">
                          ({prod.reviewsCount} avis vérifiés)
                        </span>
                      </div>

                      {/* Highlight Quote */}
                      <blockquote className="font-serif italic text-base sm:text-lg text-[#FAF8F5] leading-relaxed border-l-2 border-[#D1B992] pl-4 py-1">
                        « {prod.featureQuote} »
                      </blockquote>

                      <p className="font-sans text-sm text-[#9AA0B4] leading-relaxed">
                        {prod.description}
                      </p>

                      {/* Specifications Badges */}
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-xl border border-white/10 bg-[#04050A]">
                          <span className="text-[10px] uppercase tracking-wider text-[#5E6479] block mb-0.5">Matière première</span>
                          <strong className="text-white font-medium truncate block">{prod.tag}</strong>
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
                              {formatMoney(prod.price)}
                            </span>
                            {prod.originalPrice && (
                              <span className="font-mono text-sm text-[#5E6479] line-through">
                                {formatMoney(prod.originalPrice)}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="w-full flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2.5 sm:gap-3">
                          <button
                            onClick={() => handleOpenConfigurator(prod)}
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
                  );
                })}
              </div>

            </div>

          </div>

          {/* Interactive Pagination Dots */}
          <div className="flex items-center justify-center gap-2.5 mt-8 pt-6 border-t border-white/10 relative z-10">
            {showcaseProducts.map((p, idx) => {
              const isActive = idx === currentShowcaseIdx;
              return (
                <button
                  key={p.id}
                  onClick={() => transitionToShowcase(idx)}
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

  const renderCatalog = () => {
    const isFiltered = selectedCategory !== 'all' || searchQuery.trim() !== '' || showOnlyInStock;

    // Filter by stock if toggled
    const displayedProducts = showOnlyInStock
      ? filteredProducts.filter((p) => p.badge !== 'Épuisé')
      : filteredProducts;

    const activeCategoryLabel =
      CATEGORIES.find((c) => c.id === selectedCategory)?.label || 'Toutes les créations';

    return (
      <div ref={catalogSectionRef} id="boutique" className="space-y-12 sm:space-y-16 scroll-mt-24">
        {/* Header of the Catalog (Scroll-Reveal) */}
        <div className="catalog-reveal-header flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#D1B992] font-medium mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D1B992]" />
              <span>Le Vestiaire & Les Accessoires</span>
            </p>
            <h3 className="font-sans font-medium text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
              Boutique <span className="font-serif italic text-[#D1B992] font-normal">Officielle</span>
            </h3>
          </div>

          {/* Privilege Announcement Strip */}
          <div className="glass-badge-pill px-4 py-2.5 text-xs shadow-[0_0_20px_rgba(209,185,146,0.2)]">
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
        <div className="catalog-reveal-controls space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-3 sm:gap-4 items-center">
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
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#5E6479] hover:text-white cursor-pointer"
                >
                  Effacer
                </button>
              )}
            </div>

            {/* In-Stock Toggle Button */}
            <button
              type="button"
              onClick={() => setShowOnlyInStock(!showOnlyInStock)}
              className={`px-4 py-3 rounded-2xl border text-xs font-sans tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer ${
                showOnlyInStock
                  ? 'border-[#D1B992] bg-[#D1B992]/10 text-[#D1B992] shadow-[0_0_15px_rgba(209,185,146,0.2)]'
                  : 'border-white/10 bg-[#0A0C16] text-[#9AA0B4] hover:border-white/25 hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Disponible de suite</span>
            </button>

            {/* View Mode Switcher: Apple Shelves vs Panoramic Grid */}
            <div className="hidden sm:flex items-center p-1 rounded-2xl border border-white/10 bg-[#0A0C16]">
              <button
                type="button"
                onClick={() => setBrowseMode('shelves')}
                className={`px-3.5 py-2 rounded-xl text-xs font-sans flex items-center gap-1.5 transition-all cursor-pointer ${
                  browseMode === 'shelves'
                    ? 'bg-[#D1B992] text-[#04050A] font-semibold shadow-md'
                    : 'text-[#9AA0B4] hover:text-white'
                }`}
                title="Parcours par rayons défilants (Style Apple)"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Rayons Apple</span>
              </button>
              <button
                type="button"
                onClick={() => setBrowseMode('grid')}
                className={`px-3.5 py-2 rounded-xl text-xs font-sans flex items-center gap-1.5 transition-all cursor-pointer ${
                  browseMode === 'grid'
                    ? 'bg-[#D1B992] text-[#04050A] font-semibold shadow-md'
                    : 'text-[#9AA0B4] hover:text-white'
                }`}
                title="Vue grille panoramique"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grille</span>
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
                  type="button"
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
        </div>

        {/* Content Area: Apple Curated Shelves OR Filtered Results */}
        {displayedProducts.length === 0 ? (
          <div className="py-20 text-center text-[#5E6479] rounded-[2rem] border border-white/5 bg-[#0A0C16]">
            <p className="text-base text-[#9AA0B4] mb-3">
              Aucune création ne correspond à votre sélection actuelle.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setShowOnlyInStock(false);
              }}
              className="text-xs text-[#D1B992] hover:underline font-mono uppercase tracking-wider cursor-pointer"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : !isFiltered && browseMode === 'shelves' ? (
          /* ============================================================ */
          /* APPLE-INSPIRED PRODUCT BROWSING EXPERIENCE (CURATED SHELVES) */
          /* ============================================================ */
          <div className="space-y-16 sm:space-y-20">
            {/* Shelf 1: Coups de Cœur & Nouveautés with Editorial Intro Card */}
            <ProductShelf
              eyebrow="SÉLECTION EMBLÉMATIQUE"
              title="Vos Nouveaux"
              highlightWord="Coups de Cœur"
              subtitle="Des accessoires de caractère taillés dans des cuirs précieux, métaux polis et textures d'exception."
              introCard={
                <EditorialIntroCard onExploreAll={() => setBrowseMode('grid')} />
              }
              products={shelfCoupsDeCoeur}
              formatMoney={formatMoney}
              isFavorite={isFavorite}
              toggleFavorite={toggleFavorite}
              handleOpenConfigurator={handleOpenConfigurator}
              addToCart={addToCart}
            />

            {/* Shelf 2: Haute Maroquinerie & Voyage */}
            <ProductShelf
              eyebrow="SAVOIR-FAIRE SELLIER & EXÉCUTIF"
              title="Haute Maroquinerie &"
              highlightWord="Voyage"
              subtitle="Sacs de voyage grande contenance, pochettes de main et portefeuilles à blindage anti-RFID en cuirs italiens rares."
              products={shelfMaroquinerie}
              formatMoney={formatMoney}
              isFavorite={isFavorite}
              toggleFavorite={toggleFavorite}
              handleOpenConfigurator={handleOpenConfigurator}
              addToCart={addToCart}
            />

            {/* Shelf 3: Haute Horlogerie & Joyaux Masculins */}
            <ProductShelf
              eyebrow="PRÉCISION ET GÉOMÉTRIE INTEMPORELLE"
              title="Haute Horlogerie &"
              highlightWord="Joyaux d'Élite"
              subtitle="L'élégance géométrique au poignet : cadrans rectangulaires biseautés, cuir vert sauge et acier 316L ionisé."
              products={shelfHorlogerie}
              formatMoney={formatMoney}
              isFavorite={isFavorite}
              toggleFavorite={toggleFavorite}
              handleOpenConfigurator={handleOpenConfigurator}
              addToCart={addToCart}
            />
          </div>
        ) : browseMode === 'shelves' ? (
          /* Filtered Apple-Style Shelf */
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs text-[#9AA0B4] border-b border-white/5 pb-2">
              <span className="font-mono uppercase tracking-wider text-[#D1B992]">
                {activeCategoryLabel} • {displayedProducts.length} création
                {displayedProducts.length > 1 ? 's' : ''}
              </span>
              {isFiltered && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setShowOnlyInStock(false);
                  }}
                  className="text-[#D1B992] hover:underline cursor-pointer"
                >
                  Tout réafficher
                </button>
              )}
            </div>

            <ProductShelf
              eyebrow="RÉSULTATS DE VOTRE SÉLECTION"
              title="Créations"
              highlightWord={activeCategoryLabel}
              subtitle="Explorez les modèles correspondants à vos critères de style."
              products={displayedProducts}
              formatMoney={formatMoney}
              isFavorite={isFavorite}
              toggleFavorite={toggleFavorite}
              handleOpenConfigurator={handleOpenConfigurator}
              addToCart={addToCart}
            />
          </div>
        ) : (
          /* Panoramic Grid View */
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs text-[#9AA0B4] border-b border-white/5 pb-2">
              <span className="font-mono uppercase tracking-wider text-[#D1B992]">
                {activeCategoryLabel} • {displayedProducts.length} création
                {displayedProducts.length > 1 ? 's' : ''}
              </span>
              {isFiltered && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setShowOnlyInStock(false);
                  }}
                  className="text-[#D1B992] hover:underline cursor-pointer"
                >
                  Tout réafficher
                </button>
              )}
            </div>

            <div
              ref={gridRef}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {displayedProducts.map((product) => (
                <AppleProductCard
                  key={product.id}
                  product={product}
                  formatMoney={formatMoney}
                  isFavorite={isFavorite}
                  toggleFavorite={toggleFavorite}
                  handleOpenConfigurator={handleOpenConfigurator}
                  addToCart={addToCart}
                  isGrid={true}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

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
