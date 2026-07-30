import React, { useState } from 'react';
import BookingModal from './BookingModal';
import whiteningImg from '../../Images/Tooth Whitening.webp';
import implantsImg from '../../Images/Dental Implants.webp';
import rootCanalImg from '../../Images/Root Canal.webp';

export default function BeforeAfterGallery() {
  const [activeCategory, setActiveCategory] = useState('whitening');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');

  const transformations = {
    whitening: {
      title: 'Laser Tooth Whitening',
      subtitle: 'Achieved 8 shades whiter smile in a single 45-minute sitting.',
      image: whiteningImg,
      beforeStats: 'Heavy tea & nicotine stains',
      afterStats: 'Enamel-safe 100% stain removal',
      duration: '45 Minutes Sitting',
      guarantee: 'Zero Tooth Sensitivity',
      serviceName: 'Laser Tooth Whitening'
    },
    implants: {
      title: '3D Guided Dental Implants',
      subtitle: 'Permanent replacement for missing molar tooth with full bite strength.',
      image: implantsImg,
      beforeStats: 'Missing tooth & jaw discomfort',
      afterStats: 'Natural ceramic crown matching teeth',
      duration: 'Lifetime Warranty',
      guarantee: '100% Bite Function Restored',
      serviceName: 'Advanced Dental Implants'
    },
    rootcanal: {
      title: 'Single-Sitting Painless Root Canal',
      subtitle: 'Saved severe tooth decay with rotary endodontics and custom crown.',
      image: rootCanalImg,
      beforeStats: 'Severe acute toothache & infection',
      afterStats: 'Painless single-visit infection relief',
      duration: 'Single 60-Min Visit',
      guarantee: 'Natural Tooth Preserved',
      serviceName: 'Painless Root Canal Treatment'
    }
  };

  const current = transformations[activeCategory];

  const handleBookCurrent = () => {
    setSelectedService(current.serviceName);
    setIsModalOpen(true);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="inline-block px-4 py-1.5 rounded-full bg-surface-container-highest text-primary font-bold text-xs uppercase tracking-wider mb-3">
          Real Patient Results
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight mb-4 font-display">
          Smile Transformations at PRS Dental Care
        </h2>
        <p className="text-base text-on-surface-variant">
          See the real difference our specialist dentists achieve with painless techniques and advanced 3D imaging.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        <button
          onClick={() => setActiveCategory('whitening')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
            activeCategory === 'whitening'
              ? 'bg-primary text-on-primary shadow-md'
              : 'bg-white border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low'
          }`}
        >
          ✨ Teeth Whitening
        </button>
        <button
          onClick={() => setActiveCategory('implants')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
            activeCategory === 'implants'
              ? 'bg-primary text-on-primary shadow-md'
              : 'bg-white border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low'
          }`}
        >
          🦷 Dental Implants
        </button>
        <button
          onClick={() => setActiveCategory('rootcanal')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
            activeCategory === 'rootcanal'
              ? 'bg-primary text-on-primary shadow-md'
              : 'bg-white border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low'
          }`}
        >
          ⚡ Painless Root Canal
        </button>
      </div>

      {/* Transformation Card Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-outline-variant/20 clinical-shadow grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Visual Banner */}
        <div className="lg:col-span-6 relative rounded-2xl overflow-hidden group border border-outline-variant/20 shadow-md">
          <img
            src={current.image}
            alt={current.title}
            className="w-full h-72 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent flex flex-col justify-end p-6 text-white">
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-xs font-bold w-fit mb-2">
              Verified Clinical Result
            </span>
            <h3 className="text-xl font-bold">{current.title}</h3>
            <p className="text-xs text-white/90">{current.subtitle}</p>
          </div>
        </div>

        {/* Right Details Column */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-primary mb-2">{current.title}</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              {current.subtitle} Our specialist team formulates a customized treatment roadmap for maximum comfort and lasting aesthetic excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="p-3.5 sm:p-4 bg-error-container/30 rounded-2xl border border-error/20">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-error block mb-1">
                Before Treatment
              </span>
              <p className="text-xs sm:text-sm font-semibold text-on-surface leading-snug">
                {current.beforeStats}
              </p>
            </div>

            <div className="p-3.5 sm:p-4 bg-success-teal/10 rounded-2xl border border-success-teal/30">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-success-teal block mb-1">
                After Transformation
              </span>
              <p className="text-xs sm:text-sm font-semibold text-on-surface leading-snug">
                {current.afterStats}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-outline-variant/15">
            <div className="flex items-center gap-4 text-xs font-bold text-on-surface-variant">
              <span className="flex items-center gap-1 text-primary">
                <span className="material-symbols-outlined text-base">schedule</span>
                {current.duration}
              </span>
              <span className="flex items-center gap-1 text-secondary">
                <span className="material-symbols-outlined text-base">verified</span>
                {current.guarantee}
              </span>
            </div>

            <button
              onClick={handleBookCurrent}
              className="w-full sm:w-auto bg-primary hover:bg-primary-container text-on-primary font-bold py-3.5 px-6 rounded-xl shadow-md transition-all active:scale-95 text-xs flex items-center justify-center gap-2"
            >
              Book This Transformation
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>
        </div>

      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialService={selectedService}
      />
    </section>
  );
}
