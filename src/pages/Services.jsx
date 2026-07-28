import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import dentalImplantsImg from '../../Images/Dental Implants.webp';
import toothWhiteningImg from '../../Images/Tooth Whitening.webp';
import rootCanalImg from '../../Images/Root Canal.webp';
import generalDentistryImg from '../../Images/General Dentisty.webp';
import pediatricDentistryImg from '../../Images/Pediatric Dentistry.webp';
import ServiceCard from '../components/ServiceCard';
import BookingModal from '../components/BookingModal';

export default function Services() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeServiceModal, setActiveServiceModal] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingService, setBookingService] = useState('');
  const location = useLocation();

  const servicesData = [
    {
      id: 'implants',
      title: 'Advanced Dental Implants',
      category: 'Restorative',
      description: 'Replace single or multiple missing teeth with permanent titanium implants. Implants act like natural tooth roots and prevent jawbone loss.',
      image: dentalImplantsImg,
      tag: 'Lifetime Warranty',
      features: [
        'Natural look and feel matching existing teeth',
        'Restores 100% chew and bite function',
        'CBCT 3D guided precision placement',
        'Single-day implant options available'
      ],
      timeline: '2-3 visits over 3-6 months',
      idealFor: 'Patients missing 1 or more teeth seeking permanent replacement',
      specialists: [
        "Dr. Faiz M.D.S (Prosthodontist & Implantologist)",
        "Dr. Kiran Kumar. P M.D.S (Prosthodontist & Implantologist)"
      ]
    },
    {
      id: 'whitening',
      title: 'Laser Tooth Whitening',
      category: 'Cosmetic',
      description: 'Remove stubborn tea, coffee, smoking, and age stains. Achieve up to 8 shades whiter teeth in under 60 minutes with safe laser activation.',
      image: toothWhiteningImg,
      tag: 'Fast Results',
      features: [
        'Instant visible results in 1 sitting',
        'Enamel-safe peroxide formula',
        'Includes custom take-home touchup tray',
        'Zero tooth sensitivity post-treatment'
      ],
      timeline: 'Single 45-minute visit',
      idealFor: 'Anyone wanting a brighter, camera-ready smile',
      specialists: [
        "Dr. Yoga Rajan M.D.S (Periodontist Specialist)",
        "Dr. Wasim Ahamed M.D.S (Oral Surgeon)",
        "Dr. Naren Kumar M.D.S, FCIP (Oral Surgeon)"
      ]
    },
    {
      id: 'root-canal',
      title: 'Painless Root Canal Therapy',
      category: 'Endodontics',
      description: 'Relieve intense tooth pain and save your natural tooth from extraction using advanced rotary endodontic equipment and digital imaging.',
      image: rootCanalImg,
      tag: 'Pain-Free Guaranteed',
      features: [
        'Microscope & rotary endodontic accuracy',
        'Computerized painless local anesthesia',
        'High-strength Zirconia/PFM crown capping',
        'Single-visit option for acute cases'
      ],
      timeline: '1 to 2 short visits',
      idealFor: 'Patients experiencing severe toothache, swelling, or nerve decay',
      specialists: [
        "Dr. Purushotham M.D.S (Endodontist Specialist)"
      ]
    },
    {
      id: 'general',
      title: 'General & Preventive Dentistry',
      category: 'Preventive',
      description: 'Comprehensive dental hygiene cleanings, tartar removal, tooth-colored composite fillings, and early oral health screenings.',
      image: generalDentistryImg,
      tag: 'Essential Care',
      features: [
        'Ultrasonic painless scaling & polishing',
        'Invisible tooth-colored resin fillings',
        'Comprehensive oral cancer screening',
        'Custom night guards & fluoride protection'
      ],
      timeline: '30-45 minutes',
      idealFor: 'Routine 6-month checkup and preventive hygiene',
      specialists: [
        "Dr. Yoga Rajan M.D.S (Periodontist Specialist)",
        "Dr. Samu Fathima M.D.S (Oral Medicine & Radiology)"
      ]
    },
    {
      id: 'pediatric',
      title: 'Pediatric & Kids Dental Care',
      category: 'Pediatric',
      description: 'Specialized gentle dental care for children in a warm, anxiety-free environment. Sealants, fluoride applications, and cavity fillings.',
      image: pediatricDentistryImg,
      tag: 'Child Friendly',
      features: [
        'Kid-friendly pain-free treatment approach',
        'Dental pit & fissure sealants to block decay',
        'Space maintainers for baby teeth',
        'Fun, educational oral hygiene instruction'
      ],
      timeline: '30 minutes per session',
      idealFor: 'Children aged 1 to 14 years',
      specialists: [
        "Dr. Vijaya Kumar M.D.S (Pedodontist Specialist)",
        "Dr. Keerthi.T M.D.S (Pedodontist Specialist)"
      ]
    }
  ];

  const allSpecialists = [
    {
      name: "Dr. Vijaya Kumar M.D.S",
      dept: "Pedodontist Specialist (Child Specialist)"
    },
    {
      name: "Dr. Keerthi.T M.D.S",
      dept: "Pedodontist Specialist (Child Specialist)"
    },
    {
      name: "Dr. Ragavendra M.D.S",
      dept: "Orthodontics Specialist"
    },
    {
      name: "Dr. Yunus Amin M.D.S",
      dept: "Orthodontics Specialist"
    },
    {
      name: "Dr. Wasim Ahamed M.D.S",
      dept: "Oral Medicine & Maxillofacial Surgeon Specialist"
    },
    {
      name: "Dr. Naren Kumar M.D.S, FCIP",
      dept: "Oral Medicine & Maxillofacial Surgeon Specialist"
    },
    {
      name: "Dr. Samu Fathima M.D.S",
      dept: "Oral Medicine & Maxillofacial Radiology Specialist"
    },
    {
      name: "Dr. Yoga Rajan M.D.S",
      dept: "Periodontist Specialist"
    },
    {
      name: "Dr. Purushotham M.D.S",
      dept: "Endodontist Specialist"
    },
    {
      name: "Dr. Faiz M.D.S",
      dept: "Prosthodontist and Implantologist Specialist"
    },
    {
      name: "Dr. Kiran Kumar. P M.D.S",
      dept: "Prosthodontist and Implantologist Specialist"
    }
  ];

  const categories = ['All', 'Restorative', 'Cosmetic', 'Endodontics', 'Preventive', 'Pediatric'];

  const filteredServices = selectedCategory === 'All'
    ? servicesData
    : servicesData.filter(s => s.category === selectedCategory);

  const handleOpenBookingFor = (serviceTitle) => {
    setBookingService(serviceTitle);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 space-y-16">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header section */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full bg-surface-container-highest text-primary font-bold text-xs uppercase tracking-wider mb-3">
            PRS Dental Specialties
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-primary tracking-tight mb-4 font-display">
            Comprehensive Dental Treatments
          </h1>
          <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed">
            We offer advanced clinical dental care in Chennai. Explore our full range of pain-free procedures below.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-primary text-on-primary shadow-md scale-105'
                  : 'bg-white text-on-surface-variant hover:bg-surface-container-high border border-outline-variant/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onSelect={(svc) => setActiveServiceModal(svc)}
            />
          ))}
        </div>

        {/* Meet Our Specialists section specifically for Services page */}
        <section className="bg-surface-ice rounded-[2.5rem] p-8 sm:p-12 border border-outline-variant/20 clinical-shadow space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white border border-outline-variant/30 text-primary font-bold text-xs uppercase tracking-wider mb-3 animate-pulse">
              Clinical Specialists
            </span>
            <h2 className="text-3xl font-extrabold text-primary tracking-tight font-display">
              Meet Our Treatment Specialists
            </h2>
            <p className="text-sm text-on-surface-variant">
              Our clinical experts are available for consultations across all departments.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {allSpecialists.map((doc, i) => (
              <Link
                key={i}
                to={`/book-appointment?doctor=${encodeURIComponent(doc.name.split(' M.D.S')[0])}&service=${encodeURIComponent(doc.dept.split(' (')[0].replace(' Specialist', ''))}`}
                className="bg-white p-5 rounded-2xl border border-outline-variant/35 clinical-shadow flex items-center justify-between gap-4 hover:border-primary/50 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-sm font-bold group-hover:bg-primary group-hover:text-white transition-colors">
                    {doc.name.substring(4, 6)}
                  </div>
                  <div className="space-y-1 text-left">
                    <h4 className="text-sm font-extrabold text-primary group-hover:text-secondary transition-colors leading-none">{doc.name}</h4>
                    <p className="text-xs font-semibold text-on-surface-variant leading-tight pt-1">{doc.dept}</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-primary text-sm opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                  arrow_forward
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Service Detail Modal */}
        {activeServiceModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-on-background/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 clinical-shadow relative max-h-[90vh] overflow-y-auto border border-outline-variant/30">
              <button
                onClick={() => setActiveServiceModal(null)}
                className="absolute top-5 right-5 p-2 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>

              <div className="flex items-center gap-3 mb-4">
                <span className="bg-primary/10 text-primary font-bold text-xs px-3 py-1 rounded-full">
                  {activeServiceModal.category}
                </span>
                {activeServiceModal.tag && (
                  <span className="bg-secondary-container text-on-secondary-container font-bold text-xs px-3 py-1 rounded-full">
                    {activeServiceModal.tag}
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-primary mb-4 font-display">
                {activeServiceModal.title}
              </h2>

              <div className="relative h-64 rounded-2xl overflow-hidden mb-6 bg-surface-container-low">
                <img
                  src={activeServiceModal.image}
                  alt={activeServiceModal.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="text-sm sm:text-base text-on-surface leading-relaxed mb-6 font-body">
                {activeServiceModal.description}
              </p>

              {/* Mapped Specialists Section */}
              {activeServiceModal.specialists && (
                <div className="mb-6 bg-secondary-container/10 border border-secondary-container/20 p-4 rounded-2xl">
                  <h4 className="font-bold text-xs text-primary mb-2 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-secondary">clinical_notes</span>
                    Assigned Treatment Specialists:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeServiceModal.specialists.map((doc, i) => (
                      <span key={i} className="text-xs bg-white text-primary border border-outline-variant/30 font-bold px-3 py-1.5 rounded-xl shadow-sm">
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-surface-container-low p-5 rounded-2xl mb-6 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-primary">
                  <span className="material-symbols-outlined text-base">schedule</span>
                  Typical Treatment Timeline: <span className="text-on-surface font-semibold">{activeServiceModal.timeline}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-primary">
                  <span className="material-symbols-outlined text-base">person</span>
                  Ideal Candidate: <span className="text-on-surface font-semibold">{activeServiceModal.idealFor}</span>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-bold text-sm text-primary mb-3">Key Treatment Highlights:</h4>
                <ul className="space-y-2.5">
                  {activeServiceModal.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-xs font-semibold text-on-surface">
                      <span className="material-symbols-outlined text-success-teal text-lg">check_circle</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-4 pt-4 border-t border-outline-variant/20">
                <button
                  onClick={() => {
                    const title = activeServiceModal.title;
                    setActiveServiceModal(null);
                    handleOpenBookingFor(title);
                  }}
                  className="w-full bg-primary hover:bg-primary-container text-on-primary font-bold py-3.5 px-6 rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">calendar_month</span>
                  Book This Treatment Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Global Booking Modal */}
        <BookingModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          initialService={bookingService}
        />

      </div>
    </div>
  );
}
