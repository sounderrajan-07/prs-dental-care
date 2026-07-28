import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../../Images/PRS.logo.webp';
import ContactModal from './ContactModal';

export default function Footer() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <footer className="bg-on-background text-on-primary pt-16 pb-12 border-t border-outline-variant/10 relative overflow-hidden">
      {/* Background soft glow elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-outline-variant/20">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="inline-block transition-transform duration-300 hover:scale-105">
              <img
                src={logoImg}
                alt="PRS Dental Care Logo"
                className="h-12 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-sm text-on-primary/80 leading-relaxed">
              Your premier dental destination in Kolathur, Chennai. Advanced treatments with painless techniques and personalized patient care.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="flex items-center justify-center w-9 h-9 rounded-full bg-surface-container-highest/20 text-secondary-container">
                <span className="material-symbols-outlined text-lg">verified</span>
              </span>
              <span className="text-xs font-semibold text-on-primary/90">
                100% Certified Dental Clinic & Sterilization
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-secondary-fixed uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-on-primary/80 hover:text-white transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-xs text-secondary-container">chevron_right</span>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-on-primary/80 hover:text-white transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-xs text-secondary-container">chevron_right</span>
                  Our Services
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-on-primary/80 hover:text-white transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-xs text-secondary-container">chevron_right</span>
                  About Our Team
                </Link>
              </li>
              <li>
                <Link to="/book-appointment" className="text-on-primary/80 hover:text-white transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-xs text-secondary-container">chevron_right</span>
                  Book Appointment
                </Link>
              </li>
            </ul>
          </div>

          {/* Dental Treatments */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-secondary-fixed uppercase tracking-wider">
              Popular Treatments
            </h3>
            <ul className="space-y-2 text-sm text-on-primary/80">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-success-teal">check_circle</span>
                Dental Implants
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-success-teal">check_circle</span>
                Laser Tooth Whitening
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-success-teal">check_circle</span>
                Painless Root Canal
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-success-teal">check_circle</span>
                Pediatric Dental Care
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-success-teal">check_circle</span>
                Cosmetic Smile Design
              </li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-secondary-fixed uppercase tracking-wider">
              Contact & Location
            </h3>
            <div className="space-y-3 text-sm text-on-primary/80">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary-fixed text-xl">location_on</span>
                <span>No 59/14, Jambulingam main road, Annai Anjugam Nagar, G.K.M Colony, Chennai - 600082</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary-fixed text-xl">call</span>
                <a
                  href="tel:+917200718607"
                  onClick={(e) => {
                    if (window.innerWidth > 768) {
                      e.preventDefault();
                    }
                    setIsContactOpen(true);
                  }}
                  className="hover:text-secondary-fixed font-semibold cursor-pointer"
                >
                  +91 72007 18607
                </a>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary-fixed text-xl">schedule</span>
                <div>
                  <p>Mon - Sat: 10:00 AM - 1:00 PM & 5:00 PM - 9:00 PM</p>
                  <p className="text-xs text-on-primary/80 font-medium">Sunday: 10:00 AM - 1:00 PM</p>
                </div>
              </div>
            </div>
            <a
              href="tel:+917200718607"
              onClick={(e) => {
                if (window.innerWidth > 768) {
                  e.preventDefault();
                }
                setIsContactOpen(true);
              }}
              className="inline-flex items-center gap-2 w-full justify-center bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">medical_services</span>
              24/7 Emergency Assistance
            </a>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-on-primary/60">
          <p>© {new Date().getFullYear()} PRS Dental Care. All Rights Reserved.</p>
          <div className="flex gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Patient Safety Standard</span>
          </div>
        </div>
      </div>
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </footer>
  );
}
