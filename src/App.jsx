import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import About from "./components/About";
import Schedule from "./components/Schedule";
import Tracks from "./components/Tracks";
import Registration from "./components/Registration";
import SelectedTeams from "./components/SelectedTeams";
import FAQ from "./components/FAQ";
import Sponsors from "./components/Sponsors";
import Footer from "./components/Footer";
import PrizePool from "./components/PrizePool";
import CustomCursor from "./components/CustomCursor";
import Gallery from "./components/Gallery";
import AdminLogin from "./components/AdminLogin";
import AdminGallery from "./components/AdminGallery";
import { AdminProvider } from "./context/AdminContext";

function Home() {
  return (
    <>
      <Hero />
      <About />
      <Tracks />
      <Registration />
      <SelectedTeams />
      <PrizePool />
      <Schedule />
      <Sponsors />
      <FAQ />
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <AdminProvider>
        <div className="min-h-screen bg-goku-dark text-white font-sans selection:bg-goku-orange selection:text-white">
          <CustomCursor />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/gallery" element={<AdminGallery />} />
          </Routes>
        </div>
      </AdminProvider>
    </Router>
  );
}

export default App;
