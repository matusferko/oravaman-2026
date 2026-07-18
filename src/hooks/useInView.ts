import { useEffect, useRef, useState, type RefObject } from "react";

type Options = {
  once?: boolean;
  rootMargin?: string;
  threshold?: number | number[];
  disabled?: boolean;
};

export function useInView<T extends HTMLElement = HTMLElement>(
  options: Options = {},
): [RefObject<T | null>, boolean] {
  const { once = true, rootMargin = "0px 0px -12% 0px", threshold = 0.18, disabled = false } =
    options;
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(disabled);

  useEffect(() => {
    if (disabled) {
      setInView(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setInView(true);
        if (once) observer.disconnect();
      },
      { rootMargin, threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [disabled, once, rootMargin, threshold]);

  return [ref, inView];
}
