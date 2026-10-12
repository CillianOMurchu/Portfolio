import { AnimatePresence, m } from "framer-motion";
import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import StreamGate from "../components/StreamAuth/StreamGate";
import HomeScreen from "./HomeScreen";
import Streaming from "./Streaming";

const routes = [
  { path: "/", key: "home", screen: <HomeScreen /> },
  // About is hidden for now (detective puzzle in progress); send visitors home.
  { path: "/about", key: "about", screen: <Navigate to="/" replace /> },
  {
    path: "/streaming",
    key: "streaming",
    screen: (
      <StreamGate>
        <Streaming />
      </StreamGate>
    ),
  },
];

export const AppRoutes: React.FC = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <m.div
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
      </m.div>
    </AnimatePresence>
  );
};

export default AppRoutes;
