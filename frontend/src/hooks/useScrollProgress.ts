import { useScroll, useTransform, MotionValue } from "motion/react";
import { useRef } from "react";

/**
 * Returns a MotionValue<number> that goes from 0 → 1 as the user scrolls
 * through the hero section (target element).
 * Consumed by HeroSection to drive the dark overlay opacity + parallax.
 */
export function useScrollProgress(targetRef: React.RefObject<HTMLElement | null>): {
  scrollYProgress: MotionValue<number>;
  overlayOpacity: MotionValue<number>;
  bgY: MotionValue<string>;
} {
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  // Fade hero bg to nearly-black as it scrolls out (0 → 0.75 opacity overlay)
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0, 0.82]);

  // Subtle parallax — bg image moves at 30% of scroll speed
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return { scrollYProgress, overlayOpacity, bgY };
}
