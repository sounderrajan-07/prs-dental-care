import React, { useState } from 'react';

export default function TestimonialSlider() {
  const testimonials = [
    {
      id: 1,
      name: "Pragalya Soundar",
      location: "PRS Dental Care Patient",
      rating: 5,
      treatment: "Root Canal, Tooth Cap & Extraction",
      comment: "I had an excellent experience at this dental clinic. I got my root canal treatment, tooth cap, and even tooth extraction done here. Dr. Saritha Mam explained everything so clearly and patiently, which made me feel very comfortable and confident before starting the treatment. Dr. Vishali Mam did an amazing job with the root canal; the procedure was smooth, professional, and almost painless. The entire team was extremely friendly and supportive throughout the process. What I really appreciated was how well they took care of patients and ensured comfort at every step. Most importantly, the cost was very budget-friendly compared to other clinics. Getting such high-quality treatment at an affordable price is truly impressive. I highly recommend this clinic to anyone looking for excellent dental care with kind doctors and reasonable pricing. Thank you for the wonderful service!"
    },
    {
      id: 2,
      name: "Bhavani M",
      location: "PRS Dental Care Patient",
      rating: 5,
      treatment: "Root Canal & Tooth Extraction",
      comment: "I had an excellent experience at this dental clinic. I got my root canal treatment, tooth cap, and even tooth extraction done here. Dr. Saritha Mam explained everything so clearly and patiently, which made me feel very comfortable and confident before starting the treatment. Dr. Vishali Mam did an amazing job with the root canal; the procedure was smooth, professional, and almost painless. The entire team was extremely friendly and supportive throughout the process. What I really appreciated was how well they took care of patients and ensured comfort at every step. Most importantly, the cost was very budget-friendly compared to other clinics. Getting such high-quality treatment at an affordable price is truly impressive. I highly recommend this clinic to anyone looking for excellent dental care with kind doctors and reasonable pricing. Thank you for the wonderful service!"
    },
    {
      id: 3,
      name: "Kavin",
      location: "PRS Dental Care Patient",
      rating: 5,
      treatment: "Dental Checkup & Root Canal",
      comment: "I just came back from a dental checkup that turned into a surprisingly smooth experience, and I felt compelled to share. First, the dentist explained everything in plain language, showing clear pictures of my X-rays. When they pointed out a badly infected molar, they walked me through the two options: a root canal to save the tooth or a simple extraction. Their confidence in both procedures put me at ease. The root canal itself was painless; the numbing agent worked instantly, and the staff kept the room comfortable. They finished the cleaning and sealing in under an hour, and I left with a temporary crown that felt natural. For the wisdom tooth that needed removal, the extraction was quick and virtually painless. They used a modern, minimally invasive technique, and I only felt a slight pressure before the tooth was out. Post-op care instructions were clear, and the prescribed medication kept any discomfort to a minimum. Overall, the whole visit felt professional. The team answered every question, made sure I understood each step, and left me with a bright, healthy smile and confidence in my dental plan. If you’re nervous about root canals or extractions, I highly recommend giving this practice a try—you’ll be pleasantly surprised."
    },
    {
      id: 4,
      name: "Hari K",
      location: "PRS Dental Care Patient",
      rating: 5,
      treatment: "Root Canal & Tooth Repair",
      comment: "Excellent Service, Had a good experience here. Dr. treated my mother’s broken tooth with a root canal and fixed it, and handled everything with knowledge, patience, and care. The procedure was smooth, and my mother is feeling much better now. Highly recommended!"
    },
    {
      id: 5,
      name: "Rohit Bala",
      location: "PRS Dental Care Patient",
      rating: 5,
      treatment: "General Consultation & Care",
      comment: "Excellent dental care! The clinic is hygienic, well-equipped with modern technology, and the staff is very professional. Dr. Saritha Mam gave clear, helpful suggestions and managed everything smoothly. Highly recommend for quality treatment."
    },
    {
      id: 6,
      name: "Sarathi Balaji",
      location: "PRS Dental Care Patient",
      rating: 5,
      treatment: "Specialist Dental Care",
      comment: "I went for my brother. We got an excellent treatment from the doctor. I can't believe this affordable price for this neat ambience with new equipments.. Thank you."
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const current = testimonials[currentIndex];

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
            4.9 / 5.0 Rating (23 Verified Google Reviews)
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
                  {[...Array(current.rating)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                  ))}
                </div>
                {/* Docx Quote Icon */}
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
              <p className="text-xs text-on-surface-variant font-medium">{current.location}</p>
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
                className="p-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary transition-all active:scale-95"
                aria-label="Previous review"
              >
                <span className="material-symbols-outlined text-lg sm:text-xl">arrow_back</span>
              </button>
              <button
                onClick={nextSlide}
                className="p-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary shadow-md transition-all active:scale-95"
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
