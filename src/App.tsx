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
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 page-main pb-14">
        <PageRouter currentPage={currentPage} />
      </main>
      <Footer />
      <SphereOrb />
    </div>
  );
}

export default App;
