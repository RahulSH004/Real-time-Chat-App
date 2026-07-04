import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Sun, Moon, Menu, X, Coffee } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "Login", href: "#login" },
];

/**
 * Navbar — sticky floating pill navbar
 * - Centered, max-w-xl, rounded-full, margin from top
 * - Transparent bg with subtle glass border
 * - Dark/light toggle that adds/removes .dark on <html>
 * - Mobile: hamburger toggles inline link menu
 * - Animates in from top on mount (ease-out, 300ms)
 */
export function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Sync dark class to <html>
  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <div className="fixed top-4 inset-x-0 z-50 flex justify-center px-4">
      <motion.nav
        initial={{ opacity: 0, y: -20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-2xl"
        style={{
          borderRadius: "9999px",
          backgroundColor: "rgba(255, 255, 255, 0.12)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.22)",
          boxShadow: "0 4px 24px rgba(23, 22, 84, 0.18)",
        }}
      >
        <div className="flex items-center justify-between px-5 py-3">
          {/* Logo */}
          <a
            href="#home"
            className="flex items-center gap-2 font-bold text-lg tracking-tight select-none"
            style={{ color: "var(--brand-pink)" }}
          >
            <Coffee size={20} style={{ color: "var(--brand-pink)" }} />
            <span className="text-[#F2CFDB]">coffee chat</span>
          </a>

          {/* Desktop nav links */}
          <ul className="hidden sm:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 text-white/80 hover:text-white hover:bg-white/10"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Dark/Light toggle */}
            <button
              onClick={() => setIsDark((d) => !d)}
              className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 text-white/70 hover:text-white hover:bg-white/10 active:scale-95"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              <motion.div
                key={isDark ? "moon" : "sun"}
                initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
              </motion.div>
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="sm:hidden flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 text-white/70 hover:text-white hover:bg-white/10 active:scale-95"
              aria-label="Toggle menu"
            >
              <motion.div
                key={menuOpen ? "close" : "open"}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
              >
                {menuOpen ? <X size={16} /> : <Menu size={16} />}
              </motion.div>
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="sm:hidden flex flex-col px-4 pb-4 gap-1"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="px-4 py-2.5 rounded-2xl text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </motion.div>
        )}
      </motion.nav>
    </div>
  );
}
