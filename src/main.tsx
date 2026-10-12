import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { LazyMotion, domAnimation } from "framer-motion";
import "./index.css";
import App from "./App";
import { OrbOriginProvider } from "./context/OrbOriginContext";
import { StreamAuthProvider } from "./context/StreamAuthContext";

// Get the root element and create React root
const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);

// Render React app immediately
root.render(
  <StrictMode>
    <BrowserRouter>
      <StreamAuthProvider>
        <OrbOriginProvider>
          {/* domAnimation covers everything used here (no layout/drag); `strict` flags any stray motion.* */}
          <LazyMotion features={domAnimation} strict>
            <App />
          </LazyMotion>
        </OrbOriginProvider>
      </StreamAuthProvider>
    </BrowserRouter>
  </StrictMode>
);
