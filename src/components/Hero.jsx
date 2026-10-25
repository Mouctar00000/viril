import React, { useEffect, useRef, useState } from 'react';
import { useCart } from '../context/CartContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 240;
const FRAME_BASE_URL = '/images/hero-frames/frame_';

/**
 * Dynamic text messages synchronized with the animation progress.
 * - start / end: animation progress range (0.00 to 1.00)
 * - side: 'left' or 'right' (alternating presentation)
 */
export const HERO_DYNAMIC_MESSAGES = [
  {
    id: 'msg-1',
    start: 0.08,
    end: 0.28,
    side: 'left',
    titleLines: [
      { main: 'Une présence', connector: 'de' },
      { main: 'Caractère &', connector: '' },
      { main: 'd’Allure', connector: '' },
    ],
    descLines: [
      'L’autorité naturelle d’un homme',
      'qui s’affirme avec distinction',
      'dès le premier regard.',
    ],
  },
  {
    id: 'msg-2',
    start: 0.30,
    end: 0.50,
    side: 'right',
    titleLines: [
      { main: 'La perfection', connector: '' },
      { main: 'des Lignes &', connector: '' },
      { main: 'des Volumes', connector: '' },
    ],
    descLines: [
      'Des coupes architecturales',
      'et des proportions sur-mesure',
      'taillées pour l’impact.',
    ],
  },
  {
    id: 'msg-3',
    start: 0.52,
    end: 0.72,
    side: 'left',
    titleLines: [
      { main: 'Le souci', connector: 'du' },
      { main: 'Détail en', connector: '' },
      { main: 'Chaque Pièce', connector: '' },
    ],
    descLines: [
      'Cuirs précieux rigoureusement choisis',
      'et finitions joaillières d’exception',
      'façonnées pour durer.',
    ],
  },
  {
    id: 'msg-4',
    start: 0.74,
    end: 0.92,
    side: 'right',
    titleLines: [
      { main: 'L’art du', connector: '' },
      { main: 'Style viril', connector: 'en' },
      { main: 'Héritage', connector: '' },
    ],
    descLines: [
      'Bien plus qu’un accessoire :',
      'l’empreinte indélébile et singulière',
      'de votre caractère.',
    ],
  },
];

/**
 * Smooth Hermite interpolation (smootherstep) for ultra-fluid materialization
 */
function smootherstep(t) {
  const x = Math.max(0, Math.min(1, t));
  return x * x * x * (x * (x * 6 - 15) + 10);
}

/**
 * Draws an image into canvas:
 * - On Mobile (isMobile = true): uses object-cover (Math.max) so the animation fills the vertical mobile viewport cleanly (100% untouched).
 * - On Desktop / PC (isMobile = false): uses object-contain (Math.min) so the character, jacket, and outfit fit naturally and elegantly in the center without excessive scaling, cropping, or overflow.
 */
function drawImageCover(ctx, img, canvasWidth, canvasHeight, isMobile = false) {
  if (!img || !img.complete || img.naturalWidth === 0) return;
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  const hRatio = canvasWidth / iw;
  const vRatio = canvasHeight / ih;

  if (isMobile) {
    // 100% UNCHANGED mobile behavior: object-cover
    const ratio = Math.max(hRatio, vRatio);
    const nw = iw * ratio;
    const nh = ih * ratio;
    const cx = (canvasWidth - nw) * 0.5;
    const cy = (canvasHeight - nh) * 0.5;
    ctx.drawImage(img, cx, cy, nw, nh);
  } else {
    // Desktop / PC restored original balanced appearance: object-contain
    const ratio = Math.min(hRatio, vRatio);
    const nw = iw * ratio;
    const nh = ih * ratio;
    const cx = (canvasWidth - nw) * 0.5;
    const cy = (canvasHeight - nh) * 0.5;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, cx, cy, nw, nh);
  }
}

export default function Hero() {
  const { unlockNav } = useCart();
  const containerRef = useRef(null);
  const pinTargetRef = useRef(null);
  const canvasRef = useRef(null);
  const cleanFrameRef = useRef(null);
  const centerBrandingRef = useRef(null);
  const messageBlockRefs = useRef([]);
  const messageLineRefs = useRef([]);
  const isMobileRef = useRef(false);
  const framesRef = useRef([]);
  const lastDrawnIndexRef = useRef(-1);
  const needsResizeRedrawRef = useRef(true);

  const [isReady, setIsReady] = useState(false);

  const baseProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const mouseOffsetRef = useRef(0);
  const rafIdRef = useRef(null);

  // 1. Preload 240-frame WebP Animation Sequence (Guarantees 0% Black Screen on Mobile)
  useEffect(() => {
    let isCancelled = false;
    const loadedImages = new Array(TOTAL_FRAMES);

    const getFrameSrc = (index) => {
      const num = String(index + 1).padStart(3, '0');
      return `${FRAME_BASE_URL}${num}.webp`;
    };

    // Load initial frame immediately to paint canvas
    const img0 = new Image();
    img0.src = getFrameSrc(0);
    img0.onload = () => {
      if (isCancelled) return;
      loadedImages[0] = img0;
      setIsReady(true);
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          drawImageCover(ctx, img0, canvas.width, canvas.height);
          lastDrawnIndexRef.current = 0;
        }
      }
    };

    // Progressive loading:
    // First load every 4th frame (keyframes) to cover full scroll range immediately, then fill all frames
    const loadRemaining = () => {
      if (isCancelled) return;

      // Phase 1: Sparse keyframes
      for (let i = 0; i < TOTAL_FRAMES; i += 4) {
        if (loadedImages[i]) continue;
        const img = new Image();
        img.src = getFrameSrc(i);
        img.onload = () => {
          if (!isCancelled) loadedImages[i] = img;
        };
      }

      // Phase 2: All intermediate frames
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        if (loadedImages[i]) continue;
        const img = new Image();
        img.src = getFrameSrc(i);
        img.onload = () => {
          if (!isCancelled) loadedImages[i] = img;
        };
      }
    };

    const timer = setTimeout(loadRemaining, 60);
    framesRef.current = loadedImages;

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, []);

  // 2. High-Performance RAF Canvas Drawing Engine & Live Text Synchronization
  useEffect(() => {
    let isRunning = true;

    const updateCanvasSize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(rect.width * dpr);
      const h = Math.round(rect.height * dpr);
      // Only resize canvas if width changed or height changed significantly (> 70px)
      // to avoid canvas clears during mobile URL bar movements
      if (canvas.width !== w || Math.abs(canvas.height - h) > 70) {
        canvas.width = w;
        canvas.height = h;
        needsResizeRedrawRef.current = true;
      }
      isMobileRef.current = window.innerWidth < 768;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    const seekLoop = () => {
      if (!isRunning) return;

      // Smooth progress interpolation using weighted lerp
      const targetProg = baseProgressRef.current + mouseOffsetRef.current;
      currentProgressRef.current += (targetProg - currentProgressRef.current) * 0.22;
      const effectiveProg = Math.max(0, Math.min(1, currentProgressRef.current));

      // Draw canvas frame corresponding to effective progress
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const targetIndex = Math.min(
            TOTAL_FRAMES - 1,
            Math.max(0, Math.floor(effectiveProg * TOTAL_FRAMES))
          );

          if (targetIndex !== lastDrawnIndexRef.current || needsResizeRedrawRef.current) {
            needsResizeRedrawRef.current = false;
            let img = framesRef.current[targetIndex];

            // If exact frame isn't loaded yet, find nearest available loaded frame
            if (!img || !img.complete || img.naturalWidth === 0) {
              for (let d = 1; d < TOTAL_FRAMES; d++) {
                if (targetIndex - d >= 0 && framesRef.current[targetIndex - d]?.complete) {
                  img = framesRef.current[targetIndex - d];
                  break;
                }
                if (targetIndex + d < TOTAL_FRAMES && framesRef.current[targetIndex + d]?.complete) {
                  img = framesRef.current[targetIndex + d];
                  break;
                }
              }
            }

            if (img && img.complete && img.naturalWidth > 0) {
              drawImageCover(ctx, img, canvas.width, canvas.height, isMobileRef.current);
              lastDrawnIndexRef.current = targetIndex;
            }
          }
        }
      }

      // Synchronize animated typography
      HERO_DYNAMIC_MESSAGES.forEach((msg, msgIdx) => {
        const blockEl = messageBlockRefs.current[msgIdx];
        if (!blockEl) return;

        const { start, end } = msg;
        if (effectiveProg < start || effectiveProg > end) {
          blockEl.style.opacity = '0';
          blockEl.style.visibility = 'hidden';
          blockEl.style.pointerEvents = 'none';
          return;
        }

        const localProgress = (effectiveProg - start) / (end - start);

        // Overall block exit fading (0.80 to 1.0)
        let blockOpacity = 1;
        let blockY = 0;
        if (localProgress > 0.80) {
          const egress = (localProgress - 0.80) / 0.20;
          const egressPhase = smootherstep(egress);
          blockOpacity = 1 - egressPhase;
          blockY = -egressPhase * 16;
        }

        blockEl.style.opacity = blockOpacity.toFixed(3);
        blockEl.style.visibility = blockOpacity > 0.005 ? 'visible' : 'hidden';
        blockEl.style.pointerEvents = blockOpacity > 0.4 ? 'auto' : 'none';

        // Responsive vertical placement: centered baseline on desktop, lower third on mobile to not cover the jacket
        blockEl.style.transform = isMobileRef.current
          ? `translateY(calc(-30% + ${blockY.toFixed(2)}px))`
          : `translateY(calc(-50% + ${blockY.toFixed(2)}px))`;

        // Animate each line progressively during entrance window
        const lineEls = messageLineRefs.current[msgIdx] || [];
        lineEls.forEach((lineEl, lineIdx) => {
          if (!lineEl) return;

          const stepSize = 0.045;
          const lineDuration = 0.085;
          const lineStart = lineIdx * stepSize;
          const lineEnd = lineStart + lineDuration;

          let lineProg = 0;
          if (localProgress <= lineStart) {
            lineProg = 0;
          } else if (localProgress >= lineEnd) {
            lineProg = 1;
          } else {
            const raw = (localProgress - lineStart) / (lineEnd - lineStart);
            lineProg = smootherstep(raw);
          }

          if (lineProg <= 0.001) {
            lineEl.style.opacity = '0';
            lineEl.style.clipPath = 'inset(0 100% 0 0)';
            lineEl.style.webkitClipPath = 'inset(0 100% 0 0)';
            lineEl.style.transform = 'translateY(6px)';
            lineEl.style.visibility = 'hidden';
          } else if (lineProg >= 0.999) {
            lineEl.style.opacity = '1';
            lineEl.style.clipPath = 'none';
            lineEl.style.webkitClipPath = 'none';
            lineEl.style.transform = 'none';
            lineEl.style.visibility = 'visible';
          } else {
            lineEl.style.opacity = Math.min(1, lineProg * 1.5).toFixed(3);
            const clipInset = ((1 - lineProg) * 100).toFixed(2);
            lineEl.style.clipPath = `inset(0 ${clipInset}% 0 0)`;
            lineEl.style.webkitClipPath = `inset(0 ${clipInset}% 0 0)`;
            lineEl.style.transform = `translateY(${((1 - lineProg) * 6).toFixed(2)}px)`;
            lineEl.style.visibility = 'visible';
          }
        });
      });

      // Synchronize Central Branding (VIRIL ACCESSOIRES + CTA Button):
      if (centerBrandingRef.current) {
        let centerOpacity = 0;
        let centerBlur = 0;

        if (effectiveProg <= 0.045) {
          centerOpacity = 1;
          centerBlur = 0;
        } else if (effectiveProg < 0.075) {
          const t = (effectiveProg - 0.045) / 0.030;
          const phase = smootherstep(t);
          centerOpacity = 1 - phase;
          centerBlur = phase * 6;
        } else if (effectiveProg <= 0.925) {
          centerOpacity = 0;
          centerBlur = 6;
        } else if (effectiveProg < 0.975) {
          const t = (effectiveProg - 0.925) / 0.050;
          const phase = smootherstep(t);
          centerOpacity = phase;
          centerBlur = (1 - phase) * 6;
        } else {
          centerOpacity = 1;
          centerBlur = 0;
        }

        centerBrandingRef.current.style.opacity = centerOpacity.toFixed(3);
        centerBrandingRef.current.style.filter = centerBlur > 0.1 ? `blur(${centerBlur.toFixed(1)}px)` : 'none';
        centerBrandingRef.current.style.visibility = centerOpacity > 0.005 ? 'visible' : 'hidden';
        centerBrandingRef.current.style.pointerEvents = centerOpacity > 0.4 ? 'auto' : 'none';
      }

      // Synchronize Clean Opening Frame (Pants & Shoes Removed at start)
      if (cleanFrameRef.current) {
        let cleanOpacity = 0;
        if (effectiveProg <= 0.008) {
          cleanOpacity = 1;
        } else if (effectiveProg < 0.045) {
          cleanOpacity = 1 - (effectiveProg - 0.008) / 0.037;
        } else {
          cleanOpacity = 0;
        }
        cleanFrameRef.current.style.opacity = cleanOpacity;
        cleanFrameRef.current.style.visibility = cleanOpacity > 0.005 ? 'visible' : 'hidden';
      }

      rafIdRef.current = requestAnimationFrame(seekLoop);
    };

    rafIdRef.current = requestAnimationFrame(seekLoop);

    return () => {
      isRunning = false;
      window.removeEventListener('resize', updateCanvasSize);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  // 3. GSAP ScrollTrigger Full-Screen Pinning & Bidirectional Scrubbing
  useEffect(() => {
    if (!containerRef.current || !pinTargetRef.current) return;

    const isMobile = window.innerWidth < 768;
    const scrollDistance = isMobile ? 4800 : 7200;
    const progressProxy = { value: 0 };

    const ctx = gsap.context(() => {
      gsap.to(progressProxy, {
        value: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: `+=${scrollDistance}`,
          pin: pinTargetRef.current,
          pinSpacing: true,
          scrub: 0.45,
          onUpdate: () => {
            baseProgressRef.current = progressProxy.value;
          },
        },
      });
    }, containerRef);

    let lastWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
    const handleResize = () => {
      // Only refresh ScrollTrigger if the window width changed (orientation change or screen resize).
      // On mobile browsers, scrolling up/down toggles the URL bar, changing window.innerHeight only.
      // Calling ScrollTrigger.refresh() on innerHeight changes causes pin spacing recalculation
      // and resets the scroll offset, causing jarring scroll jumps or pulling backward.
      if (Math.abs(window.innerWidth - lastWidth) > 10) {
        lastWidth = window.innerWidth;
        ScrollTrigger.refresh();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      ctx.revert();
    };
  }, []);

  // 4. Subtle Interactive Mouse Tracking
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width > 0) {
      const ratio = (e.clientX / rect.width - 0.5) * 0.02;
      mouseOffsetRef.current = ratio;
    }
  };

  const handleMouseLeave = () => {
    mouseOffsetRef.current = 0;
  };

  return (
    <section
      ref={containerRef}
      id="accueil"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full bg-[#04050A]"
    >
      {/* Full-Screen Sticky Viewport (100dvh) */}
      <div
        ref={pinTargetRef}
        className="relative w-full h-[100dvh] overflow-hidden bg-[#04050A]"
      >
        {/* 1. Full-Size Responsive Canvas Animation Container (100% Reliable on Mobile) */}
        <div className="absolute top-[80px] sm:top-[88px] left-0 right-0 bottom-0 w-full h-[calc(100dvh-80px)] sm:h-[calc(100dvh-88px)] overflow-hidden z-10 pointer-events-none">
          <canvas
            ref={canvasRef}
            className="w-full h-full object-cover object-center select-none pointer-events-none transition-opacity duration-500"
            style={{ opacity: isReady ? 1 : 0.85 }}
          />

          {/* Master Opening Frame: Jacket/Blazer preserved, Pants & Shoes completely removed */}
          <img
            ref={cleanFrameRef}
            src="/images/hero-frame0-master.png"
            alt="VIRIL Upper Outfit Opening Frame"
            className="absolute inset-0 w-full h-full object-cover md:object-contain object-center select-none pointer-events-none transition-none"
            style={{ opacity: 1, zIndex: 12 }}
          />

          {/* Seamless bottom gradient fade to transition cleanly into the next section */}
          <div className="absolute inset-x-0 bottom-0 h-32 sm:h-44 bg-gradient-to-t from-[#04050A] via-[#04050A]/60 to-transparent pointer-events-none z-15" />

          {/* Subtle perimeter vignette for cinematic depth */}
          <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(4,5,10,0.65)] pointer-events-none z-15" />
        </div>

        {/* 2. Dynamic Scroll-Synchronized Animated Text Overlay (Alternating Left & Right) */}
        <div className="absolute top-[75px] sm:top-[88px] left-0 right-0 bottom-0 z-40 pointer-events-none overflow-hidden">
          {HERO_DYNAMIC_MESSAGES.map((msg, msgIdx) => {
            const isLeft = msg.side === 'left';
            return (
              <div
                key={msg.id}
                ref={(el) => (messageBlockRefs.current[msgIdx] = el)}
                style={{
                  opacity: 0,
                  visibility: 'hidden',
                  willChange: 'opacity, transform',
                }}
                className={`absolute transition-none select-none ${
                  isLeft
                    ? 'left-4 xs:left-6 sm:left-10 md:left-14 lg:left-20 xl:left-28 2xl:left-32 top-[62%] sm:top-1/2 text-left'
                    : 'right-4 xs:right-6 sm:right-10 md:right-14 lg:right-16 xl:right-24 2xl:right-28 top-[62%] sm:top-1/2 text-left sm:text-right'
                } w-[calc(100vw-32px)] xs:w-[calc(100vw-48px)] sm:w-auto max-w-[280px] xs:max-w-[320px] sm:max-w-[380px] md:max-w-[440px] lg:max-w-[480px] xl:max-w-[520px]`}
              >
                {/* Multi-line Monumental Headline */}
                <div className={`flex flex-col space-y-1 sm:space-y-1.5 md:space-y-2 ${isLeft ? 'items-start' : 'items-start sm:items-end'}`}>
                  {msg.titleLines.map((line, lineIdx) => (
                    <div
                      key={lineIdx}
                      ref={(el) => {
                        if (!messageLineRefs.current[msgIdx]) messageLineRefs.current[msgIdx] = [];
                        messageLineRefs.current[msgIdx][lineIdx] = el;
                      }}
                      className="overflow-hidden will-change-[clip-path,opacity,transform] max-w-full"
                      style={{
                        opacity: 0,
                        visibility: 'hidden',
                        clipPath: 'inset(0 100% 0 0)',
                        WebkitClipPath: 'inset(0 100% 0 0)',
                      }}
                    >
                      <h3 className="font-sans text-xl xs:text-2xl sm:text-4xl md:text-5xl lg:text-[52px] xl:text-[58px] leading-[1.05] sm:leading-[1.0] tracking-[-0.03em] sm:tracking-[-0.035em] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] whitespace-normal sm:whitespace-nowrap break-words">
                        <span className="font-extrabold">{line.main}</span>
                        {line.connector && (
                          <span className="font-light text-white/90 ml-1.5 sm:ml-2.5">
                            {line.connector}
                          </span>
                        )}
                      </h3>
                    </div>
                  ))}
                </div>

                {/* Description lines */}
                <div className={`mt-3 xs:mt-4 sm:mt-6 md:mt-7 flex flex-col space-y-1 sm:space-y-1.5 max-w-xs sm:max-w-sm md:max-w-md ${isLeft ? 'items-start' : 'items-start sm:items-end'}`}>
                  {msg.descLines.map((descLine, dIdx) => {
                    const totalLineIdx = msg.titleLines.length + dIdx;
                    return (
                      <div
                        key={dIdx}
                        ref={(el) => {
                          if (!messageLineRefs.current[msgIdx]) messageLineRefs.current[msgIdx] = [];
                          messageLineRefs.current[msgIdx][totalLineIdx] = el;
                        }}
                        className="overflow-hidden will-change-[clip-path,opacity,transform] max-w-full"
                        style={{
                          opacity: 0,
                          visibility: 'hidden',
                          clipPath: 'inset(0 100% 0 0)',
                          WebkitClipPath: 'inset(0 100% 0 0)',
                        }}
                      >
                        <p className="font-sans text-xs xs:text-[13px] sm:text-[13.5px] md:text-[15px] lg:text-[16px] font-normal leading-[1.45] sm:leading-[1.48] tracking-[-0.01em] text-white/95 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
                          {descLine}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* 3. Centered Branding: Heading moved slightly upward & Button moved slightly downward */}
        <div
          ref={centerBrandingRef}
          className="absolute top-[80px] sm:top-[88px] left-0 right-0 bottom-0 z-30 flex flex-col items-center justify-center text-center px-4 sm:px-6 pointer-events-none will-change-[opacity,filter]"
        >
          {/* Main Brand Title: VIRIL ACCESSOIRES */}
          <div className="pointer-events-auto max-w-5xl mx-auto px-4 -translate-y-3 sm:-translate-y-5 md:-translate-y-6">
            <h1 className="font-sans font-extrabold text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-[68px] xl:text-[76px] tracking-[-0.03em] sm:tracking-[-0.035em] uppercase text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)] leading-[1.0] select-none whitespace-normal sm:whitespace-nowrap">
              VIRIL ACCESSOIRES
            </h1>
          </div>

          {/* Responsive CTA Button */}
          <div className="mt-8 sm:mt-12 md:mt-14 translate-y-3 sm:translate-y-4 md:translate-y-5 pointer-events-auto">
            <button
              onClick={() => unlockNav('boutique')}
              className="btn-main btn--solid btn-light-sweep text-[11px] sm:text-xs md:text-sm tracking-[0.16em] sm:tracking-[0.18em] uppercase font-bold py-3.5 sm:py-4 px-8 sm:px-11 cursor-pointer inline-flex items-center gap-3 sm:gap-3.5 bg-[#D1B992] text-[#04050A] rounded-full shadow-[0_0_35px_rgba(209,185,146,0.45)] hover:shadow-[0_0_55px_rgba(209,185,146,0.7)] hover:bg-[#DFCAA0] hover:scale-105 active:scale-95 transition-all duration-300 group"
            >
              <span>Découvrir la collection</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#04050A] group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
