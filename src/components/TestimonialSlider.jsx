import React, { useState, useEffect } from 'react';
import { getApprovedFeedbacks } from '../utils/feedbackStorage';

export default function TestimonialSlider() {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const loadFeedbacks = () => {
    const approved = getApprovedFeedbacks();
    setTestimonials(approved);
  };

  useEffect(() => {
    loadFeedbacks();
    const interval = setInterval(loadFeedbacks, 4000);
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  if (testimonials.length === 0) return null;

  const current = testimonials[currentIndex] || testimonials[0];

  return (
    <section className="py-16 px-4 bg-surface-ice relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center mb-10">
        <span className="inline-block px-4 py-1 rounded-full bg-secondary-container/30 text-on-secondary-container font-semibold text-xs uppercase tracking-wider mb-2">
          Verified Customer Reviews
        </span>
        <h2 className="text-3xl font-extrabold text-primary tracking-tight mb-3 font-display">
          What Our Patients Say
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-3">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="material-symbols-outlined text-amber-500 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
            ))}
          </div>
          <span className="text-xs sm:text-sm font-bold text-on-surface text-center">
            4.9 / 5.0 Rating ({testimonials.length} Verified Reviews)
          </span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto relative bg-white rounded-3xl p-8 sm:p-10 clinical-shadow border border-outline-variant/30">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-left">
          {/* Patient User Avatar Icon Frame */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden flex-shrink-0 border-4 border-blue-100 shadow-md bg-[#e1f0fa] flex items-center justify-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#6ba4d8] flex items-center justify-center p-1 shadow-sm">
              <svg className="w-full h-full text-slate-800" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9.5" stroke="#1f2937" strokeWidth="1.6" fill="none" />
                <circle cx="12" cy="9" r="3.2" stroke="#1f2937" strokeWidth="1.6" fill="none" />
                <path d="M5.8 18c1.6-2.2 3.8-3.2 6.2-3.2s4.6 1 6.2 3.2" stroke="#1f2937" strokeWidth="1.6" strokeLinecap="round" fill="none" />
              </svg>
            </div>
          </div>

          {/* Testimonial Content */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex text-amber-500">
                  {[...Array(current.rating || 5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                  ))}
                </div>
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                  “
                </span>
              </div>
              <span className="text-xs font-semibold text-on-surface-variant bg-surface-container px-2.5 py-0.5 rounded-full">
                Review {currentIndex + 1} of {testimonials.length}
              </span>
            </div>

            <p className="text-sm sm:text-base text-on-surface italic font-body leading-relaxed">
              "{current.comment}"
            </p>

            <div className="pt-1">
              <h4 className="text-base font-extrabold text-primary leading-tight">{current.name}</h4>
              <p className="text-xs text-on-surface-variant font-medium">PRS Dental Care Patient • {current.date || 'Verified Review'}</p>
              <span className="inline-block mt-2 text-xs font-bold text-success-teal bg-success-teal/10 px-3 py-1 rounded-lg">
                Treatment: {current.treatment}
              </span>
            </div>
          </div>
        </div>

        {/* Carousel Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-6 border-t border-outline-variant/15">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-6 sm:w-8 bg-primary' : 'w-2 sm:w-2.5 bg-outline-variant/40'
                }`}
                aria-label={`Go to review ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4 ml-auto sm:ml-0">
            <span className="text-xs sm:text-sm text-on-surface-variant font-bold whitespace-nowrap bg-surface-container px-3 py-1 rounded-full border border-outline-variant/20">
              {currentIndex + 1} / {testimonials.length}
            </span>
            <div className="flex gap-2">
              <button
                onClick={prevSlide}
                className="p-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary transition-all active:scale-95 flex items-center justify-center"
                aria-label="Previous review"
              >
                <span className="material-symbols-outlined text-lg sm:text-xl">arrow_back</span>
              </button>
              <button
                onClick={nextSlide}
                className="p-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary shadow-md transition-all active:scale-95 flex items-center justify-center"
                aria-label="Next review"
              >
                <span className="material-symbols-outlined text-lg sm:text-xl">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
