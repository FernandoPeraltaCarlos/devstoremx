const MAX_DELAY = 600;

/**
 * Repeat entrances after an element has fully left the viewport.
 * `data-reveal` accepts a variant (up, left, right, scale, blur) styled in global.css.
 */
export function setupViewportReveals(root: ParentNode = document): () => void {
  const elements = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  // Content stays visible until the observer is ready to reveal it.
  const html = typeof document === 'undefined' ? undefined : document.documentElement;
  let observer: IntersectionObserver | undefined;

  const reset = () => {
    observer?.disconnect();
    observer = undefined;
    html?.classList.remove('reveal-ready');
    elements.forEach((element) => element.classList.remove('reveal-visible'));
  };

  const start = () => {
    reset();
    if (motion.matches || !('IntersectionObserver' in window)) return;

    observer = new window.IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const element = entry.target as HTMLElement;

        // Reset only outside the viewport to avoid flicker at the threshold.
        if (!entry.isIntersecting) {
          element.classList.remove('reveal-visible');
          // Enter from the edge that will be crossed next.
          element.style.setProperty('--reveal-dir', entry.boundingClientRect.top < 0 ? '-1' : '1');
          return;
        }

        const visibleEnough = entry.intersectionRatio >= 0.12 || entry.intersectionRect.height >= 48;
        if (!visibleEnough || element.classList.contains('reveal-visible')) return;

        element.style.setProperty('--reveal-dir', entry.boundingClientRect.top < 0 ? '-1' : '1');
        element.classList.add('reveal-visible');
      });
    }, { threshold: [0, 0.12] });

    elements.forEach((element) => {
      const delay = Number(element.dataset.revealDelay ?? 0);
      element.style.setProperty('--reveal-delay', `${Number.isFinite(delay) ? Math.min(MAX_DELAY, Math.max(0, delay)) : 0}ms`);
      observer!.observe(element);
    });
    html?.classList.add('reveal-ready');
  };

  start();
  motion.addEventListener('change', start);
  return () => {
    motion.removeEventListener('change', start);
    reset();
  };
}
