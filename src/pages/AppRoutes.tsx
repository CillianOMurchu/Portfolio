import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import About from "./About";
import HomeScreen from "./HomeScreen";
import Streaming from "./Streaming";

const routes = [
  { path: "/", key: "home", screen: <HomeScreen /> },
  { path: "/about", key: "about", screen: <About /> },
  { path: "/streaming", key: "streaming", screen: <Streaming /> },
];

export const AppRoutes: React.FC = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, filter: "blur(8px)", y: 20 }}
        animate={{
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        }}
        exit={{
          opacity: 0,
          y: -12,
          transition: { duration: 0.25, ease: [0.4, 0, 1, 1] },
        }}
        className="relative z-10 h-full"
      >
        <Routes location={location}>
          {routes.map(({ path, key, screen }) => (
            <Route key={key} path={path} element={screen} />
          ))}
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

export default AppRoutes;
