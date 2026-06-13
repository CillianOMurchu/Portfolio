import "./index.css";
import "./styles/theme.css";
import { usePageNavigation } from "./hooks/usePageNavigation";
import PageRouter from "./pages/PageRouter";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import SphereOrb from "./components/name/SphereOrb";


function App() {
  const { currentPage } = usePageNavigation();

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <main className="page-main" style={{ paddingTop: "4rem", paddingBottom: "2.5rem", flex: 1, overflow: "hidden" }}>
        <PageRouter currentPage={currentPage} />
      </main>
      <Footer />
      <SphereOrb />
    </div>
  );
}

export default App;
