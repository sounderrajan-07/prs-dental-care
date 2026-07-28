import React, { useState } from 'react';

export default function ContactModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const phoneNumber = "+917200718607";
  const formattedNumber = "+91 72007 18607";

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(phoneNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-on-background/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 clinical-shadow border border-outline-variant/30 relative text-center space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors"
          aria-label="Close modal"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto shadow-inner">
          <span className="material-symbols-outlined text-3xl">call</span>
        </div>

        <div>
          <h3 className="text-xl font-extrabold text-primary font-display">Contact PRS Dental Care</h3>
          <p className="text-xs text-on-surface-variant mt-1">
            Call us directly or chat on WhatsApp for instant appointment booking & emergency assistance.
          </p>
        </div>

        {/* Phone number card with Copy button */}
        <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/30 flex items-center justify-between">
          <div className="text-left">
            <span className="text-[10px] font-extrabold uppercase text-on-surface-variant tracking-wider block">Phone Number</span>
            <a href={`tel:${phoneNumber}`} className="text-base font-extrabold text-primary hover:underline">
              {formattedNumber}
            </a>
          </div>
          <button
            onClick={handleCopy}
            className="bg-white hover:bg-surface-bright text-primary border border-outline-variant/40 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm"
          >
            {copied ? "Copied! ✓" : "Copy"}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          <a
            href={`tel:${phoneNumber}`}
            className="w-full bg-primary hover:bg-primary-container text-on-primary font-bold py-3 px-4 rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2 active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">call</span>
            <span>Call Now ({formattedNumber})</span>
          </a>

          <a
            href="https://wa.me/917200718607?text=Hi%20PRS%20Dental%20Care,%20I%20would%20like%20to%20enquire%20about%20a%20consultation"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2 active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">chat</span>
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
