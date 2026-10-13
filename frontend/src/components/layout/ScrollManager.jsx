import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router';

/**
 * Scrolls to `#anchor` targets after navigation and to the top on new pages.
 * Back/forward navigation is left to the browser.
 */
export function ScrollManager() {
  const { pathname, hash, key } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType === 'POP' && key !== 'default') return undefined;
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      return undefined;
    }
    let frame;
    let attempts = 0;
    const scroll = () => {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else if (attempts++ < 20) frame = requestAnimationFrame(scroll);
    };
    frame = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash, key, navigationType]);

  return null;
}
