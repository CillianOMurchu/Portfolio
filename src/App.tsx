import { useLocation } from "react-router-dom";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import SphereOrb from "./components/name/SphereOrb";
import AppRoutes from "./pages/AppRoutes";

const NAVBAR_H = "4rem"; // h-16
const FOOTER_H = "4rem"; // h-16

function App() {
  const { pathname } = useLocation();
  const scrollable = pathname === "/about";

  return (
    <div className="app-root">
      <Navbar />
      <main
        style={{
          position: "fixed",
          top: NAVBAR_H,
          bottom: FOOTER_H,
          left: 0,
          right: 0,
          overflowY: scrollable ? "auto" : "hidden",
        }}
      >
        <AppRoutes />
      </main>
      <Footer />
      <SphereOrb />
    </div>
  );
}

export default App;
