import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BookingModal from './BookingModal';
import ContactModal from './ContactModal';

export default function MobileActionBar() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <>
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-outline-variant/20 p-2.5 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] flex items-center gap-3">
        <a
          href="tel:+917200718607"
          onClick={(e) => {
            if (window.innerWidth > 768) {
              e.preventDefault();
            }
            setIsContactOpen(true);
          }}
          className="flex-1 bg-surface-container-high hover:bg-surface-container-highest text-primary font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 text-sm shadow-sm transition-all active:scale-95 cursor-pointer border border-outline-variant/30"
        >
          <span className="material-symbols-outlined text-xl text-secondary">call</span>
          Call Clinic
        </a>

        <button
          onClick={() => setIsBookingOpen(true)}
          className="flex-1 bg-primary hover:bg-primary-container text-on-primary font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 text-sm shadow-md transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-xl">calendar_month</span>
          Book Online
        </button>
      </div>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </>
  );
}
