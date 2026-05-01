import React from "react";
import { Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import HomeScreen from "./HomeScreen";
import About from "./About";
import Fintech from "./Fintech";
import Hospitality from "./Hospitality";
import IGaming from "./iGaming";
import Contact from "./Contact";
import Streaming from "./Streaming";

const defaultMotion = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  duration: 0.5,
};

const routeConfigs = [
  {
    path: "/",
    key: "home",
    screen: <HomeScreen />,
    motion: defaultMotion,
  },
  {
    path: "/about",
    key: "about",
    screen: <About />,
    motion: defaultMotion,
  },
  {
    path: "/fintech",
    key: "fintech",
    screen: <Fintech />,
    motion: defaultMotion,
  },
  {
    path: "/hospitality",
    key: "hospitality",
    screen: <Hospitality />,
    motion: defaultMotion,
  },
  {
    path: "/igaming",
    key: "igaming",
    screen: <IGaming />,
    motion: defaultMotion,
  },
  {
    path: "/contact",
    key: "contact",
    screen: <Contact />,
    motion: defaultMotion,
  },
  {
    path: "/streaming",
    key: "streaming",
    screen: <Streaming />,
    motion: defaultMotion,
  },
];

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {routeConfigs.map(({ path, key, screen, motion: m }) => (
        <Route
          key={key}
          path={path}
          element={
            <motion.div
              key={key}
              initial={m.initial}
              animate={m.animate}
              exit={m.exit}
              transition={{ duration: m.duration, ease: [0.25, 0.75, 0.5, 1.25] }}
              className="relative z-10"
            >
              {screen}
            </motion.div>
          }
        />
      ))}
    </Routes>
  );
};

export default AppRoutes;
