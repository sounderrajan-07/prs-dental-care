import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import BookAppointment from './pages/BookAppointment';
import Admin from './pages/Admin';
import MobileActionBar from './components/MobileActionBar';
import WhatsAppButton from './components/WhatsAppButton';

import { syncAllDataWithNeonDb } from './utils/syncManager';

// ScrollToTop helper on navigation
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  useEffect(() => {
    syncAllDataWithNeonDb();
  }, []);
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-background text-on-surface font-sans selection:bg-secondary-container selection:text-on-secondary-container pb-14 md:pb-0">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/book-appointment" element={<BookAppointment />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
        <MobileActionBar />
        <WhatsAppButton />
      </div>
    </Router>
  );
}
