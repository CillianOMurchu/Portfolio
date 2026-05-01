import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { OrbOriginProvider } from "./context/OrbOriginContext";

// Get the root element and create React root
const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);

// Render React app immediately
root.render(
  <StrictMode>
    <BrowserRouter>
      <OrbOriginProvider>
        <App />
      </OrbOriginProvider>
    </BrowserRouter>
  </StrictMode>
);
