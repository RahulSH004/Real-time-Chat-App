import { useRef } from "react";
import { motion, useInView } from "motion/react";

/**
 * ProductPreview — dark rounded card showing the chat.webp screenshot.
 * - Overlaps the hero section bottom by pulling up with negative margin
 * - Scroll-triggered: fades + slides up when entering the viewport (IntersectionObserver via useInView)
 * - Subtle -1deg tilt for premium depth feel
 * - Image cropped to top portion via overflow-hidden + max-height
 */
export function ProductPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div className="relative z-10 flex justify-center px-4 sm:px-8" style={{ marginTop: "-110px" }}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 48, scale: 0.97 }}
        animate={
          isInView
            ? { opacity: 1, y: 0, scale: 1 }
            : { opacity: 0, y: 48, scale: 0.97 }
        }
        transition={{
          duration: 0.65,
          ease: [0.23, 1, 0.32, 1],
        }}
        className="w-full max-w-5xl overflow-hidden"
        style={{
          borderRadius: "22px",
          backgroundColor: "#0d0d1a",
          boxShadow:
            "0 32px 80px rgba(0, 0, 0, 0.55), 0 8px 24px rgba(23, 22, 84, 0.4)",
          transform: "rotate(-0.6deg)",
        }}
      >
        {/* Top bar — simulated browser/app chrome */}
        <div
          className="flex items-center gap-2 px-5 py-3"
          style={{ backgroundColor: "#111130", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#ff5f57" }} />
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#febc2e" }} />
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#28c840" }} />
          <span
            className="ml-4 text-xs font-medium"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            coffee_chat — messages
          </span>
        </div>

        {/* Chat screenshot — cropped to reveal only the top portion */}
        <div className="overflow-hidden" style={{ maxHeight: "480px" }}>
          <img
            src="/chat.webp"
            alt="coffee_chat product preview — real-time chat interface"
            className="w-full object-cover object-top"
            style={{ display: "block" }}
          />
        </div>
      </motion.div>
    </div>
  );
}
