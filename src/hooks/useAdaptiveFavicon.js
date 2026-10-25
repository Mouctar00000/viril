import { useEffect } from 'react';

/**
 * Custom React hook that automatically adapts the website favicon
 * to the browser / OS light and dark color scheme in real time.
 */
export function useAdaptiveFavicon() {
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateFavicon = (isDark) => {
      const svgHref = isDark ? '/favicon-dark.svg' : '/favicon-light.svg';
      const png32Href = isDark ? '/favicon-dark-32x32.png' : '/favicon-32x32.png';
      const png16Href = isDark ? '/favicon-dark-16x16.png' : '/favicon-16x16.png';

      // 1. Update or create the SVG icon link
      let svgLink = document.querySelector("link[data-favicon-type='svg']");
      if (!svgLink) {
        svgLink = document.createElement('link');
        svgLink.rel = 'icon';
        svgLink.type = 'image/svg+xml';
        svgLink.setAttribute('data-favicon-type', 'svg');
        document.head.appendChild(svgLink);
      }
      svgLink.href = svgHref;

      // 2. Update or create the 32x32 PNG icon link
      let png32Link = document.querySelector("link[data-favicon-type='png-32']");
      if (!png32Link) {
        png32Link = document.createElement('link');
        png32Link.rel = 'icon';
        png32Link.type = 'image/png';
        png32Link.sizes = '32x32';
        png32Link.setAttribute('data-favicon-type', 'png-32');
        document.head.appendChild(png32Link);
      }
      png32Link.href = png32Href;

      // 3. Update or create the 16x16 PNG icon link
      let png16Link = document.querySelector("link[data-favicon-type='png-16']");
      if (!png16Link) {
        png16Link = document.createElement('link');
        png16Link.rel = 'icon';
        png16Link.type = 'image/png';
        png16Link.sizes = '16x16';
        png16Link.setAttribute('data-favicon-type', 'png-16');
        document.head.appendChild(png16Link);
      }
      png16Link.href = png16Href;
    };

    // Initialize with current system theme
    updateFavicon(mediaQuery.matches);

    // Listen for theme transitions in real time without page refresh
    const handleChange = (e) => updateFavicon(e.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else if (mediaQuery.removeListener) {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);
}
