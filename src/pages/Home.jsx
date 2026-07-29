import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import heroImg from '../../Images/Hero Section Image.webp';
import dentalImplantsImg from '../../Images/Dental Implants.webp';
import toothWhiteningImg from '../../Images/Tooth Whitening.webp';
import rootCanalImg from '../../Images/Root Canal.webp';
import generalDentistryImg from '../../Images/General Dentisty.webp';
import pediatricDentistryImg from '../../Images/Pediatric Dentistry.webp';
import TestimonialSlider from '../components/TestimonialSlider';
import BookingModal from '../components/BookingModal';
import ContactModal from '../components/ContactModal';
import SEO from '../components/SEO';
import BeforeAfterGallery from '../components/BeforeAfterGallery';
import LocationSection from '../components/LocationSection';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');

  const handleOpenBooking = (serviceName = '') => {
    setSelectedService(serviceName);
    setIsModalOpen(true);
  };

  const homeFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is root canal treatment at PRS Dental Care painless?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, PRS Dental Care in Kolathur uses modern rotary endodontics and local anesthesia to ensure painless single-sitting root canal treatments."
        }
      },
      {
        "@type": "Question",
        "name": "Where is PRS Dental Care located in Kolathur, Chennai?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "PRS Dental Care is located at No 59/14, Jambulingam main road, G.K.M Colony, Kolathur, Chennai - 600082."
        }
      },
      {
        "@type": "Question",
        "name": "How can I book a dental appointment online?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can book an appointment online directly on our website or call +91 72007 18607 for immediate consultations."
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="PRS Dental Care | Best Dental Clinic in Kolathur, Chennai"
        description="PRS Dental Care is a top-rated dental clinic in Kolathur, Chennai offering painless root canals, 3D dental implants, laser whitening & pediatric care."
        keywords="Dental clinic in Kolathur, Best Dentist in Kolathur Chennai, Root canal treatment Kolathur, Dental implants Chennai, Teeth whitening Kolathur, PRS Dental Care"
        canonical="https://prsdentalcare.com/"
        ogImage="https://prsdentalcare.com/Images/Hero%20Section%20Image.webp"
        jsonLd={homeFaqSchema}
      />
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-12 pb-16 overflow-hidden bg-gradient-soft border-b border-outline-variant/15">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 text-center lg:text-left z-10">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-highest text-primary font-bold text-xs uppercase tracking-wider shadow-sm">
                <span className="w-2 h-2 rounded-full bg-success-teal animate-pulse"></span>
                Top-Rated Dental Clinic in Kolathur, Chennai
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold text-xs shadow-sm">
                <span className="text-amber-500">★★★★★</span> 4.9 on Google (250+ Reviews)
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary mb-6 leading-[1.15] tracking-tight font-display">
              Best Dental Clinic in <span className="text-secondary">Kolathur, Chennai</span>
            </h1>

            <p className="text-base sm:text-lg text-on-surface-variant mb-8 max-w-2xl mx-auto lg:mx-0 font-body leading-relaxed">
              Welcome to PRS Dental Care, where your healthy, confident smile is our highest commitment. Experience painless procedures, modern 3D imaging, and specialized dental care tailored for your whole family.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={() => handleOpenBooking()}
                className="w-full sm:w-auto bg-primary hover:bg-primary-container text-on-primary font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-95 text-base flex items-center justify-center gap-3"
              >
                <span className="material-symbols-outlined text-xl">calendar_month</span>
                Book Your Appointment
              </button>

              <a
                href="tel:+917200718607"
                onClick={(e) => {
                  if (window.innerWidth > 768) {
                    e.preventDefault();
                  }
                  setIsContactOpen(true);
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 text-primary bg-white hover:bg-surface-container-low border border-outline-variant/30 font-bold py-4 px-6 rounded-2xl shadow-sm hover:shadow-md transition-all text-base cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl text-secondary">call</span>
                +91 72007 18607
              </a>
            </div>

            {/* Quick highlight points */}
            <div className="mt-10 pt-8 border-t border-outline-variant/20 grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <span className="text-2xl sm:text-3xl font-black text-primary block">5,000+</span>
                <span className="text-xs font-semibold text-on-surface-variant">Happy Smiles</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-primary block">15+</span>
                <span className="text-xs font-semibold text-on-surface-variant">Years Excellence</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-secondary block">100%</span>
                <span className="text-xs font-semibold text-on-surface-variant">Painless Care</span>
              </div>
            </div>
          </div>

          {/* Right Hero Image Container */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Soft backdrop blur shapes */}
            <div className="absolute -top-6 -left-6 w-40 h-40 bg-secondary-container/30 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -right-6 w-56 h-56 bg-primary-container/20 rounded-full blur-3xl"></div>

            <div className="relative w-full max-w-md rounded-3xl overflow-hidden clinical-shadow border-4 border-white transform hover:scale-[1.02] transition-transform duration-500">
              <img
                src={heroImg}
                alt="PRS Dental Care - Expert Dentist in Kolathur Chennai"
                className="w-full h-auto object-cover"
                loading="eager"
              />

              {/* Floating Trust Badge Overlay */}
              <div className="absolute bottom-4 inset-x-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl flex items-center gap-3 clinical-shadow border border-white/50">
                <div className="w-12 h-12 rounded-2xl bg-success-teal flex items-center justify-center text-white flex-shrink-0">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified
                  </span>
                </div>
                <div>
                  <p className="text-primary font-bold text-sm">Trusted Family Clinic</p>
                  <p className="text-xs text-on-surface-variant">Kolathur's Top Dental Specialists</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Emergency & Quick Actions Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          <div className="bg-white p-6 rounded-3xl clinical-shadow border border-outline-variant/30 flex items-center gap-4 hover:border-primary/40 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-error-container text-error flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-3xl">medical_services</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-on-surface">Emergency Toothache?</h3>
              <p className="text-xs text-on-surface-variant mb-1">Immediate relief & same-day walk-ins</p>
              <a
                href="tel:+917200718607"
                onClick={(e) => {
                  if (window.innerWidth > 768) {
                    e.preventDefault();
                  }
                  setIsContactOpen(true);
                }}
                className="text-xs font-extrabold text-error hover:underline flex items-center gap-1 cursor-pointer"
              >
                Call Now: +91 72007 18607 <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </a>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl clinical-shadow border border-outline-variant/30 flex items-center gap-4 hover:border-primary/40 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-info-sky text-primary flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-3xl">location_on</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-on-surface">Clinic Address</h3>
              <p className="text-xs text-on-surface-variant mb-1">No 59/14, Jambulingam main road, G.K.M Colony</p>
              <a
                href="https://maps.google.com/?q=No+59/14,+Jambulingam+main+road,+Annai+Anjugam+Nagar,+G.K.M+Colony,+Chennai+-+600082"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-extrabold text-primary hover:underline flex items-center gap-1"
              >
                Get Directions <span className="material-symbols-outlined text-xs">open_in_new</span>
              </a>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl clinical-shadow border border-outline-variant/30 flex items-center gap-4 hover:border-primary/40 transition-all sm:col-span-2 lg:col-span-1">
            <div className="w-14 h-14 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-3xl">schedule</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-on-surface">Clinic Hours</h3>
              <p className="text-xs text-on-surface-variant">Mon - Sat: 10:00 AM - 1:00 PM & 5:00 PM - 9:00 PM</p>
              <p className="text-xs font-bold text-secondary">Sunday: 10:00 AM - 1:00 PM</p>
            </div>
          </div>

        </div>
      </section>

      {/* Services Showcase - Bento Style Redesign */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block px-4 py-1 rounded-full bg-surface-container-highest text-primary font-bold text-xs uppercase tracking-wider mb-3">
            Our Dental Services
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight mb-4">
            Expert Dental Solutions
          </h2>
          <p className="text-base text-on-surface-variant">
            From precision implants to cosmetic whitening, we deliver painless treatments using world-class technology.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Hero Bento Card: Advanced Implants */}
          <div className="md:col-span-2 bg-gradient-to-br from-primary to-primary-container text-white p-8 rounded-3xl relative overflow-hidden group shadow-xl flex flex-col justify-between min-h-[320px]">
            <div className="relative z-10 max-w-md">
              <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold mb-4">
                Specialized Treatment
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold mb-3">Advanced Dental Implants</h3>
              <p className="text-sm text-on-primary-container leading-relaxed mb-6">
                Replace missing teeth with permanent, natural-looking implant restorations. Enjoy 100% bite strength and natural aesthetics.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleOpenBooking('Advanced Dental Implants')}
                  className="bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed font-bold py-3 px-6 rounded-xl text-sm shadow-md transition-all active:scale-95 flex items-center gap-2"
                >
                  Book Implant Consultation
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* Background image overlay */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden sm:block opacity-30 group-hover:opacity-40 transition-opacity">
              <img
                src={dentalImplantsImg}
                alt="Dental Implants"
                className="w-full h-full object-cover rounded-r-3xl"
              />
            </div>
          </div>

          {/* Whitening Card */}
          <div className="bg-white p-6 rounded-3xl border border-outline-variant/30 clinical-shadow flex flex-col justify-between group hover:border-primary/40 transition-all">
            <div>
              <div className="relative h-36 rounded-2xl overflow-hidden mb-4">
                <img
                  src={toothWhiteningImg}
                  alt="Tooth Whitening"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-md text-primary text-[10px] font-bold px-2 py-0.5 rounded-md">
                  Express 45-Min
                </span>
              </div>
              <h3 className="text-lg font-bold text-primary mb-1">Laser Tooth Whitening</h3>
              <p className="text-xs text-on-surface-variant mb-4">
                Remove tough stains and achieve up to 8 shades brighter teeth in one visit.
              </p>
            </div>
            <button
              onClick={() => handleOpenBooking('Laser Tooth Whitening')}
              className="w-full text-xs font-bold text-primary hover:text-secondary flex items-center justify-between pt-3 border-t border-outline-variant/15"
            >
              <span>Book Whitening</span>
              <span className="material-symbols-outlined text-base">chevron_right</span>
            </button>
          </div>

          {/* Root Canal Card */}
          <div className="bg-white p-6 rounded-3xl border border-outline-variant/30 clinical-shadow flex flex-col justify-between group hover:border-primary/40 transition-all">
            <div>
              <div className="relative h-36 rounded-2xl overflow-hidden mb-4">
                <img
                  src={rootCanalImg}
                  alt="Root Canal"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-md text-success-teal text-[10px] font-bold px-2 py-0.5 rounded-md">
                  Painless Single-Sitting
                </span>
              </div>
              <h3 className="text-lg font-bold text-primary mb-1">Root Canal Therapy</h3>
              <p className="text-xs text-on-surface-variant mb-4">
                Save infected teeth painlessly with single-visit rotary endodontics.
              </p>
            </div>
            <button
              onClick={() => handleOpenBooking('Painless Root Canal Treatment')}
              className="w-full text-xs font-bold text-primary hover:text-secondary flex items-center justify-between pt-3 border-t border-outline-variant/15"
            >
              <span>Book Root Canal</span>
              <span className="material-symbols-outlined text-base">chevron_right</span>
            </button>
          </div>

          {/* Pediatric Care Card */}
          <div className="bg-white p-6 rounded-3xl border border-outline-variant/30 clinical-shadow flex flex-col justify-between group hover:border-primary/40 transition-all">
            <div>
              <div className="relative h-36 rounded-2xl overflow-hidden mb-4">
                <img
                  src={pediatricDentistryImg}
                  alt="Pediatric Dentistry"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-md text-secondary text-[10px] font-bold px-2 py-0.5 rounded-md">
                  Kid-Friendly
                </span>
              </div>
              <h3 className="text-lg font-bold text-primary mb-1">Pediatric Dentistry</h3>
              <p className="text-xs text-on-surface-variant mb-4">
                Gentle, friendly dental checkups, sealants, and cavity protection for children.
              </p>
            </div>
            <button
              onClick={() => handleOpenBooking('Pediatric & Kids Dental Care')}
              className="w-full text-xs font-bold text-primary hover:text-secondary flex items-center justify-between pt-3 border-t border-outline-variant/15"
            >
              <span>Book Kid Visit</span>
              <span className="material-symbols-outlined text-base">chevron_right</span>
            </button>
          </div>

          {/* General Dentistry Card */}
          <div className="bg-white p-6 rounded-3xl border border-outline-variant/30 clinical-shadow flex flex-col justify-between group hover:border-primary/40 transition-all">
            <div>
              <div className="relative h-36 rounded-2xl overflow-hidden mb-4">
                <img
                  src={generalDentistryImg}
                  alt="General Dentistry"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-md text-primary text-[10px] font-bold px-2 py-0.5 rounded-md">
                  Routine Maintenance
                </span>
              </div>
              <h3 className="text-lg font-bold text-primary mb-1">General Dentistry</h3>
              <p className="text-xs text-on-surface-variant mb-4">
                Comprehensive oral checkups, scaling, fillings, and preventive hygiene.
              </p>
            </div>
            <button
              onClick={() => handleOpenBooking('General Consultation & Checkup')}
              className="w-full text-xs font-bold text-primary hover:text-secondary flex items-center justify-between pt-3 border-t border-outline-variant/15"
            >
              <span>Book Checkup</span>
              <span className="material-symbols-outlined text-base">chevron_right</span>
            </button>
          </div>

        </div>

        <div className="mt-10 text-center">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 bg-surface-container-high hover:bg-surface-container-highest text-primary font-bold py-3.5 px-8 rounded-full shadow-sm transition-all"
          >
            Explore All Treatment Options
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </Link>
        </div>
      </section>

      {/* Trust Signals Banner */}
      <section className="mx-4 sm:mx-6 lg:mx-8 my-8 max-w-7xl lg:mx-auto py-12 px-8 bg-primary rounded-[2.5rem] text-on-primary relative overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center relative z-10">
          <div className="flex items-start gap-4">
            <span className="material-symbols-outlined text-4xl text-secondary-fixed p-3 bg-white/10 rounded-2xl">
              biotech
            </span>
            <div>
              <h4 className="font-bold text-lg mb-1">Digital 3D Dentistry</h4>
              <p className="text-xs text-on-primary/80 leading-relaxed">
                Precision intraoral digital scanners and 3D imaging for painless diagnosis.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <span className="material-symbols-outlined text-4xl text-secondary-fixed p-3 bg-white/10 rounded-2xl">
              verified_user
            </span>
            <div>
              <h4 className="font-bold text-lg mb-1">Strict Sterilization</h4>
              <p className="text-xs text-on-primary/80 leading-relaxed">
                Class-B autoclave sterilization exceeding global hospital hygiene standards.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <span className="material-symbols-outlined text-4xl text-secondary-fixed p-3 bg-white/10 rounded-2xl">
              volunteer_activism
            </span>
            <div>
              <h4 className="font-bold text-lg mb-1">Transparent Pricing</h4>
              <p className="text-xs text-on-primary/80 leading-relaxed">
                Clear treatment cost breakdown with zero hidden charges and flexible payment options.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Before & After Smile Gallery */}
      <BeforeAfterGallery />

      {/* Patient Testimonials Section */}
      <TestimonialSlider />

      {/* Google Maps Location Section */}
      <LocationSection />

      {/* Booking Modal Trigger */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialService={selectedService}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
}
