import { useEffect } from 'react';

/**
 * High-performance, compositor-friendly Scroll Reveal hook using IntersectionObserver.
 * Never alters layout geometry, runs outside main render cycle, respects reduced-motion.
 */
export function useScrollReveal(selector = '.reveal-on-scroll', dependencies = []) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Respect reduced-motion preferences immediately
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll(selector).forEach((el) => {
        el.classList.add('is-revealed');
      });
      return;
    }

    const elements = document.querySelectorAll(selector);
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            // Unobserve to free memory and prevent repeated animations
            obs.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.12,
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, dependencies);
}
