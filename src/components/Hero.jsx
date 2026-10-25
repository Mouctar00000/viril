import React, { useEffect, useRef, useState } from 'react';
import { useCart } from '../context/CartContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const VIDEO_SRC = '/videos/viril-hero.mp4';
const DEFAULT_DURATION = 10.0;



/**
 * Dynamic text messages synchronized with the animation progress.
 * Easy to edit, add, or remove.
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

export default function Hero() {
  const { unlockNav } = useCart();
  const containerRef = useRef(null);
  const pinTargetRef = useRef(null);
  const videoRef = useRef(null);
  const cleanFrameRef = useRef(null);
  const centerBrandingRef = useRef(null);
  const messageBlockRefs = useRef([]);
  const messageLineRefs = useRef([]);
  const isMobileRef = useRef(false);

  const [videoDuration, setVideoDuration] = useState(DEFAULT_DURATION);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const targetTimeRef = useRef(0);
  const baseProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const mouseOffsetRef = useRef(0);
  const rafIdRef = useRef(null);

  // 1. Initialize Video & Metadata
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let isMounted = true;

    const handleLoadedMetadata = () => {
      if (!isMounted) return;
      const dur = video.duration && !isNaN(video.duration) && video.duration > 0
        ? video.duration
        : DEFAULT_DURATION;
      setVideoDuration(dur);
      setIsVideoLoaded(true);

      try {
        video.currentTime = 0.001;
      } catch {
        // Silently handled
      }
    };

    if (video.readyState >= 1) {
      handleLoadedMetadata();
    } else {
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
    }

    return () => {
      isMounted = false;
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  // 2. High-Performance RAF Seek Engine & Live Text Synchronization
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let isRunning = true;

    const updateMobileStatus = () => {
      isMobileRef.current = window.innerWidth < 768;
    };
    updateMobileStatus();
    window.addEventListener('resize', updateMobileStatus);

    const seekLoop = () => {
      if (!isRunning) return;

      // Smooth progress interpolation using weighted lerp
      const targetProg = baseProgressRef.current + mouseOffsetRef.current;
      currentProgressRef.current += (targetProg - currentProgressRef.current) * 0.22;
      const effectiveProg = Math.max(0, Math.min(1, currentProgressRef.current));

      const dur = video.duration || videoDuration;
      // Seek video in perfect lockstep with the smoothed progress
      const targetTime = Math.max(0, Math.min(dur - 0.01, effectiveProg * dur));
      const current = video.currentTime;
      const diff = Math.abs(current - targetTime);

      // Seek video smoothly when difference exceeds ~half a frame
      if (!video.seeking && diff > 0.016) {
        video.currentTime = targetTime;
      }

      // Synchronize animated typography (Line-by-Line Writing reveal, Image 1 inspired)
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

        // Centered vertical baseline on desktop, gentle float on mobile
        blockEl.style.transform = isMobileRef.current
          ? `translateY(${blockY.toFixed(2)}px)`
          : `translateY(calc(-50% + ${blockY.toFixed(2)}px))`;

        // Animate each line progressively during entrance window (0.00 to 0.32)
        const lineEls = messageLineRefs.current[msgIdx] || [];
        lineEls.forEach((lineEl, lineIdx) => {
          if (!lineEl) return;

          // Sequential line reveal stagger: each line writes across 0.085 of block progress
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
      // 1. Initial State (0.00 - 0.045): Fully visible (opacity 1, blur 0)
      // 2. Disappearance (0.045 - 0.075): Smooth quick fade-out & subtle blur before msg-1 starts at 0.08
      // 3. Subtitle Sequence (0.075 - 0.925): 100% hidden (opacity 0, visibility hidden)
      // 4. Reappearance (0.925 - 0.975): Elegant, gradual reveal after msg-4 finishes at 0.92
      // 5. Finale (0.975 - 1.00): Fully visible (opacity 1, blur 0)
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

      // Synchronize Clean Opening Frame (Pants & Shoes Removed at the very beginning):
      // When progress is at 0 (t <= 0.008): 100% visible (only jacket/blazer & upper outfit floating).
      // Smoothly dissolves into the video between progress 0.008 and 0.045 so original animation plays seamlessly.
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
      window.removeEventListener('resize', updateMobileStatus);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [videoDuration]);

  // 3. GSAP ScrollTrigger Full-Screen Pinning & Bidirectional Scrubbing
  useEffect(() => {
    if (!containerRef.current || !pinTargetRef.current) return;

    // Extended cinematic scroll distance to unfold the experience at a calm, relaxed pace
    const isMobile = window.innerWidth < 768;
    // Desktop: 7200px (~720px/sec of footage), Mobile: 5000px (~500px/sec of footage)
    const scrollDistance = isMobile ? 5000 : 7200;

    const progressProxy = { value: 0 };

    const ctx = gsap.context(() => {
      // Use a linear tween on a proxy object attached to ScrollTrigger with scrub.
      // In GSAP, scrub on a tween applies physical momentum damping to the tween's value,
      // completely eliminating mouse-wheel notch stepping and abrupt jumps.
      gsap.to(progressProxy, {
        value: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: `+=${scrollDistance}`,
          pin: pinTargetRef.current,
          pinSpacing: true,
          scrub: 0.45, // Responsive yet weighted momentum (no floating lag)
          onUpdate: () => {
            baseProgressRef.current = progressProxy.value;
          },
        },
      });
    }, containerRef);

    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      ctx.revert();
    };
  }, [videoDuration]);

  // 4. Subtle Interactive Mouse Tracking
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width > 0) {
      // Subtle micro-parallax shift (+/- 0.018) based on mouse position
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
        {/* 1. Full-Size Responsive Video Container */}
        {/* Begins exactly below the header line and spans 100% full width */}
        <div className="absolute top-[80px] sm:top-[88px] left-0 right-0 bottom-0 w-full h-[calc(100dvh-80px)] sm:h-[calc(100dvh-88px)] overflow-hidden z-10 pointer-events-none">
          <video
            ref={videoRef}
            src={VIDEO_SRC}
            playsInline
            muted
            preload="auto"
            className="w-full h-full object-cover object-center select-none pointer-events-none transition-opacity duration-700"
            style={{ opacity: isVideoLoaded ? 1 : 0.85 }}
          />

          {/* Master Opening Frame: Jacket/Blazer preserved, Pants & Shoes completely removed */}
          <img
            ref={cleanFrameRef}
            src="/images/hero-frame0-master.png"
            alt="VIRIL Upper Outfit Opening Frame"
            className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none transition-none"
            style={{ opacity: 1, zIndex: 12 }}
          />

          {/* Seamless bottom gradient fade to transition cleanly into the next section */}
          <div className="absolute inset-x-0 bottom-0 h-32 sm:h-44 bg-gradient-to-t from-[#04050A] via-[#04050A]/60 to-transparent pointer-events-none z-15" />

          {/* Subtle perimeter vignette for cinematic depth */}
          <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(4,5,10,0.65)] pointer-events-none z-15" />
        </div>

        {/* 2. Dynamic Scroll-Synchronized Animated Text Overlay (Alternating Left & Right, Image 1 Typography) */}
        <div className="absolute top-[80px] sm:top-[88px] left-0 right-0 bottom-0 z-40 pointer-events-none overflow-hidden">
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
                className={`absolute transition-none select-none text-left ${
                  isLeft
                    ? 'left-6 sm:left-10 md:left-14 lg:left-20 xl:left-28 2xl:left-32 top-[60%] sm:top-1/2'
                    : 'right-6 sm:right-10 md:right-14 lg:right-16 xl:right-24 2xl:right-28 top-[60%] sm:top-1/2'
                } w-[calc(100vw-48px)] sm:w-auto max-w-[290px] sm:max-w-[380px] md:max-w-[440px] lg:max-w-[480px] xl:max-w-[520px]`}
              >
                {/* Multi-line Monumental Headline (Image 1 Style: Stacked, Tight Tracking, Pure White) */}
                <div className="flex flex-col space-y-1 sm:space-y-1.5 md:space-y-2">
                  {msg.titleLines.map((line, lineIdx) => (
                    <div
                      key={lineIdx}
                      ref={(el) => {
                        if (!messageLineRefs.current[msgIdx]) messageLineRefs.current[msgIdx] = [];
                        messageLineRefs.current[msgIdx][lineIdx] = el;
                      }}
                      className="overflow-hidden will-change-[clip-path,opacity,transform]"
                      style={{
                        opacity: 0,
                        visibility: 'hidden',
                        clipPath: 'inset(0 100% 0 0)',
                        WebkitClipPath: 'inset(0 100% 0 0)',
                      }}
                    >
                      <h3 className="font-sans text-2xl sm:text-4xl md:text-5xl lg:text-[52px] xl:text-[58px] leading-[0.98] sm:leading-[1.0] tracking-[-0.035em] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] whitespace-nowrap">
                        <span className="font-extrabold">{line.main}</span>
                        {line.connector && (
                          <span className="font-light text-white/90 ml-2 sm:ml-2.5">
                            {line.connector}
                          </span>
                        )}
                      </h3>
                    </div>
                  ))}
                </div>

                {/* Description lines: Arranged across multiple lines (Image 1 Composition, Pure White) */}
                <div className="mt-5 sm:mt-6 md:mt-7 flex flex-col space-y-1 sm:space-y-1.5 max-w-xs sm:max-w-sm md:max-w-md">
                  {msg.descLines.map((descLine, dIdx) => {
                    const totalLineIdx = msg.titleLines.length + dIdx;
                    return (
                      <div
                        key={dIdx}
                        ref={(el) => {
                          if (!messageLineRefs.current[msgIdx]) messageLineRefs.current[msgIdx] = [];
                          messageLineRefs.current[msgIdx][totalLineIdx] = el;
                        }}
                        className="overflow-hidden will-change-[clip-path,opacity,transform]"
                        style={{
                          opacity: 0,
                          visibility: 'hidden',
                          clipPath: 'inset(0 100% 0 0)',
                          WebkitClipPath: 'inset(0 100% 0 0)',
                        }}
                      >
                        <p className="font-sans text-xs sm:text-[13.5px] md:text-[15px] lg:text-[16px] font-normal leading-[1.48] tracking-[-0.01em] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
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
          {/* Main Brand Title: VIRIL ACCESSOIRES (Matched to Side Subtitles Typography) */}
          <div className="pointer-events-auto max-w-5xl mx-auto px-4 -translate-y-3 sm:-translate-y-5 md:-translate-y-6">
            <h1 className="font-sans font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-[68px] xl:text-[76px] tracking-[-0.03em] sm:tracking-[-0.035em] uppercase text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)] leading-[0.98] sm:leading-[1.0] select-none whitespace-normal sm:whitespace-nowrap">
              VIRIL ACCESSOIRES
            </h1>
          </div>

          {/* Responsive CTA Button: Moved slightly downward with increased vertical spacing */}
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
