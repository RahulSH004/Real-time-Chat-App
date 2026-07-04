import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

interface CTAButtonProps {
  label?: string;
  onClick?: () => void;
}

/**
 * Full-pill CTA button.
 * - Dark #171654 bg with brand-pink arrow icon
 * - Hover: scale(1.02) + icon shifts right 4px (200ms ease-out)
 * - Active: scale(0.97) press feedback per Emil's principles
 * - Icon shift uses CSS transition, not JS, for hardware acceleration
 */
export function CTAButton({ label = "Start Chatting Free", onClick }: CTAButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="cta-button group flex items-center gap-3 rounded-full px-8 py-4 text-base font-semibold text-white select-none cursor-pointer"
      style={{ backgroundColor: "var(--brand-deep)" }}
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 0.7, y: 0, scale: 1 }}
      transition={{
        duration: 0.35,
        delay: 0.45,
        ease: [0.23, 1, 0.32, 1],
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
    >
      <span>{label}</span>
      <span
        className="cta-icon flex items-center justify-center rounded-full w-7 h-7 transition-transform duration-200"
        style={{
          backgroundColor: "var(--brand-pink)",
          transitionTimingFunction: "var(--ease-out-strong)",
        }}
      >
        <ArrowRight
          size={15}
          className="text-white transition-transform duration-200 group-hover:translate-x-0.5"
          style={{ transitionTimingFunction: "var(--ease-out-strong)" }}
        />
      </span>
    </motion.button>
  );
}
