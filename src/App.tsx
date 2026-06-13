import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import SphereOrb from "./components/name/SphereOrb";
import { usePageNavigation } from "./hooks/usePageNavigation";
import "./index.css";
import PageRouter from "./pages/PageRouter";
import "./styles/theme.css";

const NAVBAR_H = "4rem"; // h-16
const FOOTER_H = "4rem"; // h-16

function App() {
  const { currentPage } = usePageNavigation();
  const scrollable = currentPage === "/about";

  return (
    <div style={{ height: "100vh", overflow: "hidden" }}>
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
        <PageRouter currentPage={currentPage} />
      </main>
      <Footer />
      <SphereOrb />
    </div>
  );
}

export default App;
