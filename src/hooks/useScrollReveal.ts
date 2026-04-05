import { useEffect, useLayoutEffect, useRef, useState, RefObject } from 'react';

/** Walk up the DOM to find the nearest scrolling ancestor (or null for window). */
function getScrollRoot(el: HTMLElement): Element | null {
  let parent = el.parentElement;
  while (parent && parent !== document.documentElement) {
    const { overflow, overflowY } = window.getComputedStyle(parent);
    if (/auto|scroll/.test(overflow) || /auto|scroll/.test(overflowY)) {
      return parent;
    }
    parent = parent.parentElement;
  }
  return null;
}

/** Check if element has non-zero dimensions and is in viewport. */
function isAlreadyVisible(el: HTMLElement, root: Element | null): boolean {
  const rect = el.getBoundingClientRect();
  // Element must have some size to be considered visible
  if (rect.height === 0 && rect.width === 0) return false;
  if (root) {
    const rootRect = root.getBoundingClientRect();
    return rect.top < rootRect.bottom && rect.bottom > rootRect.top;
  }
  return rect.top < (window.innerHeight || 800) && rect.bottom > 0;
}

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: { threshold?: number; rootMargin?: string } = {}
): [RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);
  const visibleRef = useRef(false); // track across unmount/remount cycles

  // useLayoutEffect: synchronous, before paint, after DOM commit
  // Catches elements that are in-viewport at mount with real dimensions
  useLayoutEffect(() => {
    if (visibleRef.current) {
      setIsVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || isAlreadyVisible(el, getScrollRoot(el))) {
      visibleRef.current = true;
      setIsVisible(true);
    }
  });

  useEffect(() => {
    if (visibleRef.current) return;
    const el = ref.current;
    if (!el) return;

    const root = getScrollRoot(el);

    // Check again in case layout changed between layoutEffect and effect
    if (isAlreadyVisible(el, root)) {
      visibleRef.current = true;
      setIsVisible(true);
      return;
    }

    // Fallback: reveal after 500ms to prevent permanently invisible content
    const fallbackTimer = setTimeout(() => {
      visibleRef.current = true;
      setIsVisible(true);
    }, 500);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          clearTimeout(fallbackTimer);
          visibleRef.current = true;
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      {
        root,
        threshold: options.threshold ?? 0.05,
        rootMargin: options.rootMargin ?? '0px 0px -20px 0px',
      }
    );

    observer.observe(el);
    return () => {
      clearTimeout(fallbackTimer);
      observer.disconnect();
    };
  }, [options.threshold, options.rootMargin]);

  return [ref as RefObject<T>, isVisible];
}
