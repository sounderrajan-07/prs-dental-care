import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoImg from '../../Images/PRS.logo.webp';
import ContactModal from './ContactModal';

export default function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/', icon: 'home' },
    { name: 'Our Services', path: '/services', icon: 'dentistry' },
    { name: 'About Us', path: '/about', icon: 'health_and_safety' },
    { name: 'Clinic Portal', path: '/admin', icon: 'admin_panel_settings' },
  ];

  return (
    <>
      {/* Top Header */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md py-2.5'
            : 'bg-surface-bright py-3.5 border-b border-outline-variant/20'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group py-1">
            <img
              src={logoImg}
              alt="PRS Dental Care Logo"
              className="h-12 sm:h-14 lg:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 bg-surface-container-low/70 p-1.5 rounded-full border border-outline-variant/30">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-on-primary shadow-md'
                      : 'text-on-surface-variant hover:text-primary hover:bg-primary-fixed-dim/20'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">{link.icon}</span>
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="tel:+917200718607"
              onClick={(e) => {
                if (window.innerWidth > 768) {
                  e.preventDefault();
                }
                setIsContactOpen(true);
              }}
              className="flex items-center justify-center text-primary bg-surface-container-high hover:bg-surface-container-highest rounded-xl transition-all w-10 h-10 lg:w-auto lg:h-auto lg:px-3.5 lg:py-2 text-sm font-bold gap-2 active:scale-95 shadow-sm hover:shadow cursor-pointer"
            >
              <span className="material-symbols-outlined text-primary text-base">call</span>
              <span className="hidden lg:inline">+91 72007 18607</span>
            </a>

            <Link
              to="/book-appointment"
              className="hidden sm:flex items-center gap-2 bg-primary hover:bg-primary-container text-on-primary font-bold px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 text-sm"
            >
              <span className="material-symbols-outlined text-lg">calendar_month</span>
              Book Appointment
            </Link>

            {/* Mobile Drawer Toggle Button */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="md:hidden p-2.5 text-primary hover:bg-surface-container-low rounded-xl transition-all active:scale-95"
              aria-label="Toggle Menu"
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-on-background/50 backdrop-blur-xs z-[60] md:hidden animate-fadeIn"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white z-[70] md:hidden transform transition-transform duration-300 ease-in-out flex flex-col clinical-shadow border-l border-outline-variant/20 ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-5 flex items-center justify-between border-b border-outline-variant/20 bg-surface-container-low">
          <Link to="/" onClick={() => setIsDrawerOpen(false)} className="flex items-center">
            <img src={logoImg} alt="PRS Dental Care Logo" className="h-10 w-auto object-contain" />
          </Link>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors"
            aria-label="Close menu"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-5 space-y-2.5">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsDrawerOpen(false)}
                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-bold transition-all text-base ${
                  isActive
                    ? 'bg-primary text-on-primary shadow-md'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-primary'
                }`}
              >
                <span className="material-symbols-outlined text-xl">{link.icon}</span>
                {link.name}
              </Link>
            );
          })}

          {/* Book Appointment Button (Mobile Drawer) */}
          <Link
            to="/book-appointment"
            onClick={() => setIsDrawerOpen(false)}
            className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-bold transition-all text-base bg-primary text-on-primary shadow-md hover:bg-primary-container active:scale-95"
          >
            <span className="material-symbols-outlined text-xl">calendar_month</span>
            <span>Book Appointment</span>
          </Link>
        </nav>

        {/* Drawer Emergency & Contact Footer */}
        <div className="p-5 bg-surface-container-low border-t border-outline-variant/30 space-y-3">
          <a
            href="tel:+917200718607"
            onClick={(e) => {
              if (window.innerWidth > 768) {
                e.preventDefault();
              }
              setIsContactOpen(true);
            }}
            className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-3 rounded-xl font-bold text-sm shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">call</span>
            Emergency Call: +91 72007 18607
          </a>
          <div className="text-center text-xs text-on-surface-variant flex flex-col items-center justify-center gap-0.5">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-success-teal">schedule</span>
              <span>Mon - Sat: 10:00 AM - 1:00 PM & 5:00 PM - 9:00 PM</span>
            </div>
            <span className="text-[11px] font-semibold text-secondary">Sunday: 10:00 AM - 1:00 PM</span>
          </div>
        </div>
      </div>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  );
}
