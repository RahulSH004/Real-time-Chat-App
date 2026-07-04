import { useRef } from "react";
import { motion, useMotionTemplate } from "motion/react";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { CTAButton } from "./CTAButton";
import { Coffee } from "lucide-react";

const TECH_BADGES = [
  { icon: "⚡", label: "WebSocket" },
  { icon: "🔒", label: "Secure Auth" },
  { icon: "💬", label: "Group Chats" },
  { icon: "🚀", label: "Real-time" },
];

/**
 * HeroSection — full-bleed background photo with:
 * - Scroll-driven black overlay (fades to dark as you scroll)
 * - Subtle parallax drift on the background image
 * - Staggered entrance animations for logo, badges, headline, subheading, CTA
 */
export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { overlayOpacity, bgY } = useScrollProgress(sectionRef);

  // Compose the CSS background-position from the MotionValue
  const bgPosition = useMotionTemplate`center ${bgY}`;

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ paddingTop: "100px", paddingBottom: "160px" }}
    >
      {/* Background photo with parallax */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center will-change-transform"
        style={{
          backgroundImage: "url('/hero.jpg')",
          backgroundPosition: bgPosition,
          backgroundSize: "cover",
        }}
      />

      {/* Gradient overlays — bottom darkens more for preview card blending */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.08) 40%, rgba(0,0,0,0.55) 85%, rgba(0,0,0,0.92) 100%)",
        }}
      />

      {/* Scroll-driven black overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundColor: "#000", opacity: overlayOpacity }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-3xl mx-auto">

        {/* Logo wordmark */}
        <motion.div
          className="flex flex-col items-center mb-8"
          initial={{ opacity: 0, scale: 0.92, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="flex items-center gap-3 mb-2">
            {/* <div
              className="flex items-center justify-center w-12 h-12 rounded-2xl"
              style={{
                background: "linear-gradient(135deg, var(--brand-violet) 0%, var(--brand-pink) 100%)",
                boxShadow: "0 8px 24px rgba(213, 133, 217, 0.35)",
              }}
            >
              {/* <Coffee size={24} className="text-white" /> */}
             {/* </div> */}
            <span
              className="text-4xl font-bold tracking-tight text-white"
              style={{ fontFamily: "'Geist Variable', sans-serif" }}
            >
              Coffee Chat
            </span>
          </div>
          {/* Accent underline */}
          <div
            className="h-0.5 w-32 rounded-full"
            style={{
              background: "linear-gradient(to right, var(--brand-violet), var(--brand-pink))",
            }}
          />
        </motion.div>

        {/* Tech stack badge pills — staggered */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-10"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.06, delayChildren: 0.18 } },
          }}
        >
          {TECH_BADGES.map((badge) => (
            <motion.span
              key={badge.label}
              variants={{
                hidden: { opacity: 0, y: 8, scale: 0.95 },
                show: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] },
                },
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-full"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.12)",
                border: "1px solid rgba(255, 255, 255, 0.22)",
                backdropFilter: "blur(8px)",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              <span>{badge.icon}</span>
              <span>{badge.label}</span>
            </motion.span>
          ))}
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, delay: 0.22, ease: [0.23, 1, 0.32, 1] }}
        >
          <span
            style={{
              background:
                "linear-gradient(to right, #F2CFDB 0%, #FFFFFF 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
          Real Conversations,
          </span>{" "}
          <span
            className="block"
            style={{
              background: "linear-gradient(135deg, var(--brand-lavender) 0%, var(--brand-pink) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Real Time.
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          className="text-lg sm:text-xl font-normal max-w-xl mb-10"
          style={{ color: "rgba(255, 255, 255, 0.62)" }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, delay: 0.32, ease: [0.23, 1, 0.32, 1] }}
        >
          Instant messaging, group chats, and secure authentication —{" "}
          <span style={{ color: "rgba(255,255,255,0.82)" }}>
            all in one beautiful place.
          </span>
        </motion.p>

        {/* CTA Button */}
        <CTAButton label="Start Chatting Free" />

        {/* Social proof nudge */}
        <motion.p
          className="mt-5 text-sm"
          style={{ color: "rgba(255,255,255,0.38)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.6, ease: [0.23, 1, 0.32, 1] }}
        >
          No credit card required · Free forever plan
        </motion.p>
      </div>
    </section>
  );
}
