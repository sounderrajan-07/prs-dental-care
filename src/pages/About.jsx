import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import doctorImg from '../../Images/Patient.avif';
import logoImg from '../../Images/PRS.logo.webp';
import ContactModal from '../components/ContactModal';

export default function About() {
  const [activeFaq, setActiveFaq] = useState(null);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const specialists = [
    {
      name: "Dr. Vijaya Kumar",
      degree: "M.D.S",
      specialty: "Pedodontist Specialist (Child Specialist)",
      icon: "child_care",
      color: "from-pink-500 to-rose-500",
      initials: "VK"
    },
    {
      name: "Dr. Keerthi.T",
      degree: "M.D.S",
      specialty: "Pedodontist Specialist (Child Specialist)",
      icon: "child_care",
      color: "from-pink-500 to-rose-500",
      initials: "KT"
    },
    {
      name: "Dr. Ragavendra",
      degree: "M.D.S",
      specialty: "Orthodontics Specialist",
      icon: "align_horizontal_center",
      color: "from-purple-500 to-indigo-500",
      initials: "RV"
    },
    {
      name: "Dr. Yunus Amin",
      degree: "M.D.S",
      specialty: "Orthodontics Specialist",
      icon: "align_horizontal_center",
      color: "from-purple-500 to-indigo-500",
      initials: "YA"
    },
    {
      name: "Dr. Wasim Ahamed",
      degree: "M.D.S",
      specialty: "Oral Medicine & Maxillofacial Surgeon",
      icon: "medical_services",
      color: "from-blue-500 to-cyan-500",
      initials: "WA"
    },
    {
      name: "Dr. Naren Kumar",
      degree: "M.D.S, FCIP",
      specialty: "Oral Medicine & Maxillofacial Surgeon",
      icon: "medical_services",
      color: "from-blue-500 to-cyan-500",
      initials: "NK"
    },
    {
      name: "Dr. Samu Fathima",
      degree: "M.D.S",
      specialty: "Oral Medicine & Maxillofacial Radiology",
      icon: "biotech",
      color: "from-teal-500 to-emerald-500",
      initials: "SF"
    },
    {
      name: "Dr. Yoga Rajan",
      degree: "M.D.S",
      specialty: "Periodontist Specialist",
      icon: "dentistry",
      color: "from-emerald-500 to-teal-500",
      initials: "YR"
    },
    {
      name: "Dr. Purushotham",
      degree: "M.D.S",
      specialty: "Endodontist Specialist",
      icon: "dentistry",
      color: "from-orange-500 to-amber-500",
      initials: "PT"
    },
    {
      name: "Dr. Faiz",
      degree: "M.D.S",
      specialty: "Prosthodontist & Implantologist",
      icon: "clinical_notes",
      color: "from-violet-500 to-purple-500",
      initials: "FZ"
    },
    {
      name: "Dr. Kiran Kumar. P",
      degree: "M.D.S",
      specialty: "Prosthodontist & Implantologist",
      icon: "clinical_notes",
      color: "from-violet-500 to-purple-500",
      initials: "KK"
    }
  ];

  const faqs = [
    {
      question: "How often should I schedule a dental check-up?",
      answer: "It is recommended to visit the dentist every six months for preventive care, professional scaling, and early detection of potential dental issues."
    },
    {
      question: "How can I effectively prevent cavities?",
      answer: "To prevent cavities, brush twice daily with fluoride toothpaste, floss regularly, limit sugary snacks and beverages, and maintain your routine 6-month dental checkups."
    },
    {
      question: "What are common causes of bad breath?",
      answer: "Bad breath (halitosis) is typically caused by poor oral hygiene, food debris, gum disease, dry mouth, or bacteria build-up on the tongue. Regular dental cleanings can resolve this."
    },
    {
      question: "Is gum disease reversible?",
      answer: "Yes, early-stage gum disease (gingivitis) is fully reversible through professional scaling (cleaning) and maintaining excellent daily brushing and flossing habits."
    },
    {
      question: "Who are the key specialists at PRS Dental Care?",
      answer: "Our expert team consists of highly qualified MDS specialists, including Dr. Vijaya Kumar & Dr. Keerthi.T (Pedodontics), Dr. Ragavendra & Dr. Yunus Amin (Orthodontics), Dr. Wasim Ahamed & Dr. Naren Kumar (Oral Surgery), Dr. Samu Fathima (Radiology), Dr. Yoga Rajan (Periodontics), Dr. Purushotham (Endodontics), and Dr. Faiz & Dr. Kiran Kumar (Implantology)."
    }
  ];

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Hero Header Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-20 pb-16 overflow-hidden bg-gradient-soft border-b border-outline-variant/15 mb-16">
        {/* Decorative backdrop shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-secondary/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-highest text-primary font-bold text-xs uppercase tracking-wider mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            About PRS Dental Care
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary tracking-tight mb-6 font-display leading-[1.15]">
            Dedicated to Gentle, <span className="text-secondary underline decoration-secondary-container decoration-4">High-Precision</span> Dental Excellence
          </h1>
          <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed max-w-2xl mx-auto">
            Since our founding in Chennai, PRS Dental Care has provided patient-centric, painless dental solutions backed by cutting-edge digital dentistry and a trusted team of specialists.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Doctor & Leadership Profile */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 clinical-shadow border border-outline-variant/30 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 relative">
            {/* Ambient Background Glow */}
            <div className="absolute -inset-2 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-[2.5rem] blur-xl opacity-75"></div>
            
            <div className="relative rounded-3xl overflow-hidden border border-outline-variant/30 shadow-2xl bg-surface-container group">
              <img
                src={doctorImg}
                alt="PRS Dental Care Lead Doctor & Specialist Team"
                className="w-full h-80 sm:h-96 lg:h-[420px] object-cover object-top transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/10 to-transparent"></div>
              
              {/* Floating Top Badge */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/60 shadow-md flex items-center gap-1.5 text-xs font-bold text-primary">
                <span className="material-symbols-outlined text-secondary text-sm">stars</span>
                <span>Leading Clinical Team</span>
              </div>

              {/* Glassmorphic Caption Card */}
              <div className="absolute bottom-4 inset-x-4 p-4 rounded-2xl backdrop-blur-md bg-white/90 text-primary border border-white/60 shadow-lg space-y-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-base">verified</span>
                  <p className="font-extrabold text-sm text-primary leading-tight">Dr. Vijaya Kumar & Specialists</p>
                </div>
                <p className="text-xs font-semibold text-on-surface-variant pl-6">
                  M.D.S - Clinical Directors & Specialists
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-container/30 text-on-secondary-container rounded-full text-xs font-bold">
              <span className="material-symbols-outlined text-sm">workspace_premium</span>
              15+ Years Clinical Experience
            </div>
            
            <h2 className="text-3xl font-bold text-primary font-display">
              Our Vision: Compassionate Care with Zero Pain
            </h2>

            <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed font-body">
              At PRS Dental Care, we understand that visiting the dentist can feel daunting. That's why our clinic was built around patient comfort. From computerized painless local anesthesia to digital 3D imaging, every treatment is engineered to be swift, effective, and stress-free.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-success-teal text-xl">check_circle</span>
                <div>
                  <h4 className="font-bold text-xs text-primary">State-of-the-Art Clinic</h4>
                  <p className="text-xs text-on-surface-variant">Digital intraoral scanners & rotary tools</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-success-teal text-xl">check_circle</span>
                <div>
                  <h4 className="font-bold text-xs text-primary">Hospital Sterilization</h4>
                  <p className="text-xs text-on-surface-variant">Class-B Autoclave 100% infection control</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-success-teal text-xl">check_circle</span>
                <div>
                  <h4 className="font-bold text-xs text-primary">Transparent Treatment</h4>
                  <p className="text-xs text-on-surface-variant">No hidden charges or unexpected bills</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-success-teal text-xl">check_circle</span>
                <div>
                  <h4 className="font-bold text-xs text-primary">Comprehensive Specialty</h4>
                  <p className="text-xs text-on-surface-variant">Implants, whitening, root canals & braces</p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex gap-4">
              <Link
                to="/book-appointment"
                className="bg-primary hover:bg-primary-container text-on-primary font-bold py-3.5 px-6 rounded-xl shadow-md transition-all text-sm flex items-center gap-2 active:scale-95"
              >
                <span className="material-symbols-outlined text-lg">calendar_month</span>
                Book Appointment
              </Link>
              <a
                href="tel:+917200718607"
                onClick={(e) => {
                  if (window.innerWidth > 768) {
                    e.preventDefault();
                  }
                  setIsContactOpen(true);
                }}
                className="bg-surface-container-high hover:bg-surface-container-highest text-primary font-bold py-3.5 px-6 rounded-xl transition-all text-sm flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">call</span>
                Contact Clinic
              </a>
            </div>
          </div>
        </div>

        {/* 4 Pillars Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-outline-variant/30 clinical-shadow text-center space-y-3">
            <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-3xl">psychology</span>
            </div>
            <h3 className="font-bold text-base text-primary">Painless Protocol</h3>
            <p className="text-xs text-on-surface-variant">
              Advanced anesthesia and gentle techniques designed for dental anxiety relief.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-outline-variant/30 clinical-shadow text-center space-y-3">
            <div className="w-14 h-14 bg-secondary-container/30 text-secondary rounded-2xl flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-3xl">sanitizer</span>
            </div>
            <h3 className="font-bold text-base text-primary">Hygiene Guarantee</h3>
            <p className="text-xs text-on-surface-variant">
              Strict multi-tier sterilization for all instruments and operating operatories.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-outline-variant/30 clinical-shadow text-center space-y-3">
            <div className="w-14 h-14 bg-success-teal/10 text-success-teal rounded-2xl flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-3xl">biotech</span>
            </div>
            <h3 className="font-bold text-base text-primary">3D Technology</h3>
            <p className="text-xs text-on-surface-variant">
              High resolution digital diagnostic imaging for precision treatment planning.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-outline-variant/30 clinical-shadow text-center space-y-3">
            <div className="w-14 h-14 bg-info-sky text-primary rounded-2xl flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-3xl">family_restroom</span>
            </div>
            <h3 className="font-bold text-base text-primary">Family Friendly</h3>
            <p className="text-xs text-on-surface-variant">
              Tailored care for toddlers, teens, adults, and senior citizens under one roof.
            </p>
          </div>
        </div>

        {/* Meet Our Specialists Section */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full bg-surface-container-highest text-primary font-bold text-xs uppercase tracking-wider mb-3">
              Specialist Team
            </span>
            <h2 className="text-3xl font-extrabold text-primary tracking-tight font-display">
              Meet Our Dental Specialists
            </h2>
            <p className="text-sm sm:text-base text-on-surface-variant">
              Get to know the highly qualified dental surgeons and consultants dedicated to your care. Click any specialist to book a consultation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {specialists.map((doc, idx) => {
              const bookUrl = `/book-appointment?doctor=${encodeURIComponent(doc.name)}&service=${encodeURIComponent(doc.specialty.split(' (')[0].replace(' Specialist', ''))}`;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl border border-outline-variant/30 clinical-shadow p-6 text-center space-y-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
                >
                  {/* Visual Accent Background Accent */}
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary to-secondary"></div>
                  
                  {/* Initials Avatar */}
                  <Link to={bookUrl} className="block relative mx-auto w-20 h-20 rounded-full bg-surface-container flex items-center justify-center border-4 border-white shadow-md group-hover:scale-105 transition-transform duration-300">
                    <div className={`absolute inset-0.5 rounded-full bg-gradient-to-tr ${doc.color} flex items-center justify-center text-white text-xl font-bold shadow-inner`}>
                      {doc.initials}
                    </div>
                    {/* Floating Icon badge */}
                    <span className="absolute -bottom-1 -right-1 w-7 h-7 bg-white text-primary border border-outline-variant/30 rounded-full flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined text-base">{doc.icon}</span>
                    </span>
                  </Link>

                  <div className="space-y-1">
                    <h3 className="font-extrabold text-base text-primary leading-tight">
                      <Link to={bookUrl} className="hover:text-secondary transition-colors inline-block">
                        {doc.name}
                      </Link>
                    </h3>
                    <span className="inline-block text-[10px] font-extrabold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
                      {doc.degree}
                    </span>
                    <p className="text-xs text-on-surface-variant font-semibold pt-1 min-h-[32px] flex items-center justify-center leading-normal">
                      {doc.specialty}
                    </p>
                  </div>

                  <div className="pt-2">
                    <Link
                      to={bookUrl}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-secondary transition-colors bg-surface-container-high/60 px-4 py-2 rounded-xl border border-outline-variant/20 hover:border-primary/40 active:scale-95 transition-all"
                    >
                      <span>Book Consult</span>
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Frequently Asked Questions (FAQ) Section */}
        <section className="bg-surface-ice rounded-[2.5rem] p-8 sm:p-12 border border-outline-variant/20 clinical-shadow space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/70 border border-outline-variant/30 text-primary font-bold text-xs uppercase tracking-wider mb-3">
              FAQ
            </span>
            <h2 className="text-3xl font-extrabold text-primary tracking-tight font-display">
              Frequently Asked Questions
            </h2>
            <p className="text-sm sm:text-base text-on-surface-variant">
              Find instant answers to common questions about treatments and our specialist team.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-outline-variant/30 clinical-shadow overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none hover:bg-surface-container-low transition-colors"
                  >
                    <span className="font-bold text-sm sm:text-base text-primary pr-4 leading-relaxed">
                      {faq.question}
                    </span>
                    <span className={`material-symbols-outlined text-primary transition-transform duration-300 ${isOpen ? 'rotate-180 text-secondary' : ''}`}>
                      keyboard_arrow_down
                    </span>
                  </button>
                  
                  {/* Collapsible Answer */}
                  {isOpen && (
                    <div className="border-t border-outline-variant/15 overflow-hidden bg-surface-bright animate-fadeIn">
                      <p className="px-6 py-4 text-xs sm:text-sm text-on-surface-variant font-medium leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

      </div>
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
}
