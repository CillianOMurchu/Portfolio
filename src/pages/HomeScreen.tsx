import { motion } from "framer-motion";
import React, { useState } from "react";
import HeroTitle from "../components/HeroTitle/HeroTitle";
import ItemSphere from "../components/sphere/ItemSphere";
import ToggleSphere from "../components/sphere/ToggleSphere";

type ItemType = "SASS" | "Hospitality" | "iGaming" | null;

interface ThemeConfig {
  background: string;
  accentColor: string;
  scrollIndicatorColor: string;
}

const themeMap: Record<string, ThemeConfig> = {
  SASS: {
    background:
      "linear-gradient(135deg, #6b1635 0%, #4a0f24 50%, #2d0917 100%)",
    accentColor: "#e73e7f",
    scrollIndicatorColor: "#f29bc0",
  },
  Hospitality: {
    background:
      "linear-gradient(135deg, #3d5a7d 0%, #2d3f52 50%, #1a252f 100%)",
    accentColor: "#6ba3d1",
    scrollIndicatorColor: "#9bc5ed",
  },
  iGaming: {
    background:
      "linear-gradient(135deg, #3d5a47 0%, #2d4435 50%, #1a2820 100%)",
    accentColor: "#5d9d7a",
    scrollIndicatorColor: "#8fbca5",
  },
  null: {
    background: "linear-gradient(135deg, #0a0e1a 0%, #131a28 100%)",
    accentColor: "#10b981",
    scrollIndicatorColor: "#10b981",
  },
};

const itemDescriptions: Record<Exclude<ItemType, null>, string> = {
  SASS: "Explore my SASS/SCSS expertise and advanced styling techniques I've implemented across various projects. From component-level styling to complex animations and theme management.",
  Hospitality:
    "Discover my work in the hospitality industry, including booking systems, property management tools, and customer engagement platforms that enhance guest experiences.",
  iGaming:
    "View my contributions to innovative gaming platforms, featuring real-time analytics, player engagement tools, and interactive gaming experiences.",
};

const HomeScreen: React.FC = () => {
  const [showSphere, setShowSphere] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemType>(null);
  const [scrollY, setScrollY] = useState(0);

  const theme = themeMap[selectedItem || "null"];

  const handleCloseDescription = () => {
    setSelectedItem(null);
  };

  React.useEffect(() => {
    let rafId: number | null = null;
    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        setScrollY(window.scrollY);
        rafId = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <motion.div
      className="home-screen relative"
      animate={{
        background: theme.background,
      }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      style={{
        minHeight: "auto",
      }}
    >
      {/* Background transition overlay */}
      <ToggleSphere toggled={showSphere} setToggled={setShowSphere} />

      {/* Hero Section */}
      <div
        style={{
          height: "100vh",
          position: "relative",
          zIndex: 1,
          paddingTop: "2rem",
        }}
      >
        <HeroTitle selectedItem={selectedItem} />
        <div
          className="sphere"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: -1,
            pointerEvents: showSphere ? "auto" : "none",
            opacity: showSphere ? 1 : 0,
            transition: "opacity 0.4s cubic-bezier(.4,0,.2,1)",
          }}
        >
          <ItemSphere visible={showSphere} />
        </div>
      </div>

      {selectedItem && scrollY < 50 && (
        <motion.div
          className="fixed bottom-20 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 z-20 pointer-events-none"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ color: theme.scrollIndicatorColor }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </motion.div>
      )}

      {selectedItem && (
        <motion.div
          className="relative w-full px-4 md:px-8 lg:px-16 py-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            background: `linear-gradient(to bottom, transparent 0%, rgba(19, 26, 40, 0.4) 100%)`,
          }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-end mb-4">
              <button
                onClick={handleCloseDescription}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Close description"
              >
                <svg
                  className="w-6 h-6 text-white/80 hover:text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <h2
              className="text-4xl md:text-5xl font-bold mb-8"
              style={{ color: theme.accentColor }}
            >
              {selectedItem}
            </h2>

            <div className="space-y-6">
              <p className="text-lg text-gray-300 leading-relaxed">
                {itemDescriptions[selectedItem]}
              </p>

              <div className="mt-10 pt-8 border-t border-white/10">
                <h3
                  className="text-2xl font-semibold mb-6"
                  style={{ color: theme.accentColor }}
                >
                  Key Technologies
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {selectedItem === "SASS" && (
                    <>
                      <div className="px-4 py-3 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition-colors cursor-default border border-white/5">
                        SASS/SCSS
                      </div>
                      <div className="px-4 py-3 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition-colors cursor-default border border-white/5">
                        CSS Modules
                      </div>
                      <div className="px-4 py-3 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition-colors cursor-default border border-white/5">
                        Tailwind CSS
                      </div>
                      <div className="px-4 py-3 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition-colors cursor-default border border-white/5">
                        PostCSS
                      </div>
                      <div className="px-4 py-3 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition-colors cursor-default border border-white/5">
                        Animations
                      </div>
                      <div className="px-4 py-3 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition-colors cursor-default border border-white/5">
                        Theme Systems
                      </div>
                    </>
                  )}
                  {selectedItem === "Hospitality" && (
                    <>
                      <div className="px-4 py-3 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition-colors cursor-default border border-white/5">
                        React
                      </div>
                      <div className="px-4 py-3 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition-colors cursor-default border border-white/5">
                        Node.js
                      </div>
                      <div className="px-4 py-3 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition-colors cursor-default border border-white/5">
                        PostgreSQL
                      </div>
                      <div className="px-4 py-3 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition-colors cursor-default border border-white/5">
                        Real-time Updates
                      </div>
                      <div className="px-4 py-3 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition-colors cursor-default border border-white/5">
                        APIs
                      </div>
                      <div className="px-4 py-3 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition-colors cursor-default border border-white/5">
                        UI/UX
                      </div>
                    </>
                  )}
                  {selectedItem === "iGaming" && (
                    <>
                      <div className="px-4 py-3 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition-colors cursor-default border border-white/5">
                        WebGL
                      </div>
                      <div className="px-4 py-3 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition-colors cursor-default border border-white/5">
                        Three.js
                      </div>
                      <div className="px-4 py-3 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition-colors cursor-default border border-white/5">
                        Analytics
                      </div>
                      <div className="px-4 py-3 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition-colors cursor-default border border-white/5">
                        Real-time
                      </div>
                      <div className="px-4 py-3 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition-colors cursor-default border border-white/5">
                        WebSocket
                      </div>
                      <div className="px-4 py-3 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition-colors cursor-default border border-white/5">
                        Performance
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default HomeScreen;
