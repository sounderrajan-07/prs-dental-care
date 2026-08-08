import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ContactModal from '../components/ContactModal';
import { saveAppointment } from '../utils/appointmentStorage';
import { getStoredDoctors } from '../utils/doctorStorage';
import SEO from '../components/SEO';

export default function BookAppointment() {
  const [searchParams] = useSearchParams();
  const [isContactOpen, setIsContactOpen] = useState(false);
  const preselectedService = searchParams.get('service') || '';
  const preselectedDoctor = searchParams.get('doctor') || '';

  // Dynamic doctor list loaded from store
  const [doctorsList, setDoctorsList] = useState(() => getStoredDoctors());

  const loadDoctors = () => {
    setDoctorsList(getStoredDoctors());
  };

  useEffect(() => {
    loadDoctors();
    window.addEventListener('prs_doctors_updated', loadDoctors);
    return () => window.removeEventListener('prs_doctors_updated', loadDoctors);
  }, []);

  // Formatted doctor option labels for dropdown
  const doctorOptions = useMemo(() => {
    const options = ['Any Available Specialist'];
    doctorsList.forEach((doc) => {
      const specShort = (doc.specialization || '').split('-')[0].split('(')[0].trim();
      const label = `${doc.name} ${doc.degree || 'M.D.S'} (${specShort})`;
      options.push(label);
    });
    return options;
  }, [doctorsList]);

  const servicesList = [
    'General Consultation & Checkup',
    'Advanced Dental Implants',
    'Laser Tooth Whitening',
    'Painless Root Canal Treatment',
    'Pediatric & Kids Dental Care',
    'Orthodontic Braces & Aligners',
    'Crowns, Bridges & Veneers',
    'Wisdom Tooth Extraction',
    'Emergency Pain Relief',
  ];

  const findMatchingDoctor = (doctorQuery) => {
    if (!doctorQuery) return 'Any Available Specialist';
    const cleanQuery = decodeURIComponent(doctorQuery).toLowerCase().trim();
    
    // First check exact option string matches
    const exactOpt = doctorOptions.find((opt) => opt.toLowerCase().includes(cleanQuery));
    if (exactOpt) return exactOpt;

    // Then match by base doctor name (e.g. Dr. Soundher S)
    const foundDoc = doctorsList.find((doc) => {
      const docNameClean = doc.name.toLowerCase().trim();
      const nameWithoutTitle = docNameClean.replace(/^dr\.?\s*/i, '');
      const queryWithoutTitle = cleanQuery.replace(/^dr\.?\s*/i, '');

      return (
        docNameClean.includes(queryWithoutTitle) ||
        queryWithoutTitle.includes(nameWithoutTitle) ||
        docNameClean.includes(cleanQuery)
      );
    });

    if (foundDoc) {
      const specShort = (foundDoc.specialization || '').split('-')[0].split('(')[0].trim();
      return `${foundDoc.name} ${foundDoc.degree || 'M.D.S'} (${specShort})`;
    }

    return 'Any Available Specialist';
  };

  const findMatchingService = (serviceQuery) => {
    if (!serviceQuery) return 'General Consultation & Checkup';
    const cleanQuery = decodeURIComponent(serviceQuery).toLowerCase().trim();
    
    const exact = servicesList.find((s) => s.toLowerCase() === cleanQuery);
    if (exact) return exact;

    if (cleanQuery.includes('pedodont') || cleanQuery.includes('child')) return 'Pediatric & Kids Dental Care';
    if (cleanQuery.includes('orthodont')) return 'Orthodontic Braces & Aligners';
    if (cleanQuery.includes('implant')) return 'Advanced Dental Implants';
    if (cleanQuery.includes('endodont') || cleanQuery.includes('root canal')) return 'Painless Root Canal Treatment';
    if (cleanQuery.includes('whitening')) return 'Laser Tooth Whitening';
    if (cleanQuery.includes('surgeon') || cleanQuery.includes('wisdom')) return 'Wisdom Tooth Extraction';
    
    const partial = servicesList.find((s) => s.toLowerCase().includes(cleanQuery) || cleanQuery.includes(s.toLowerCase()));
    return partial || 'General Consultation & Checkup';
  };

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: findMatchingService(preselectedService),
    date: '',
    timeSlot: '10:00 AM - 11:00 AM',
    preferredDoctor: findMatchingDoctor(preselectedDoctor),
    notes: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const rawDoctor = searchParams.get('doctor');
    const rawService = searchParams.get('service');
    
    if (rawDoctor || rawService) {
      setFormData((prev) => ({
        ...prev,
        preferredDoctor: rawDoctor ? findMatchingDoctor(rawDoctor) : prev.preferredDoctor,
        service: rawService ? findMatchingService(rawService) : prev.service,
      }));
    }
  }, [searchParams, doctorsList, doctorOptions]);

  const morningSlots = [
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '12:00 PM - 01:00 PM',
  ];

  const eveningSlots = [
    '05:00 PM - 06:00 PM',
    '06:00 PM - 07:00 PM',
    '07:00 PM - 08:00 PM',
    '08:00 PM - 09:00 PM',
  ];

  const getDayOfWeek = (dateString) => {
    if (!dateString) return null;
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day).getDay();
  };

  const selectedDay = getDayOfWeek(formData.date);
  const isSunday = selectedDay === 0;

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    const day = getDayOfWeek(newDate);
    const newIsSunday = day === 0;

    let updatedSlot = formData.timeSlot;
    if (newIsSunday && eveningSlots.includes(formData.timeSlot)) {
      updatedSlot = morningSlots[0];
    }

    setFormData({ ...formData, date: newDate, timeSlot: updatedSlot });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    saveAppointment(formData);
    setIsSubmitted(true);
    try {
      await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
    } catch (err) {
      console.log('API sync error');
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-surface animate-fadeIn">
      <SEO
        title="Book Appointment | PRS Dental Care Kolathur Chennai"
        description="Book your appointment online at PRS Dental Care, Kolathur, Chennai. Choose your specialist dentist, preferred date & time for instant confirmation."
        keywords="Book dentist appointment Kolathur, Dental consultation Chennai, PRS Dental appointment, Dentist booking Kolathur"
        canonical="https://prsdentalcare.com/book-appointment"
      />
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full bg-surface-container-highest text-primary font-bold text-xs uppercase tracking-wider mb-3">
            PRS Dental Appointment
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight mb-3 font-display">
            Schedule Your Visit Today
          </h1>
          <p className="text-sm sm:text-base text-on-surface-variant">
            Choose your preferred treatment, date, and time. We will confirm your priority booking instantly.
          </p>
        </div>

        {!isSubmitted ? (
          <div className="bg-white rounded-3xl p-6 sm:p-10 clinical-shadow border border-outline-variant/30">
            {formData.preferredDoctor !== 'Any Available Specialist' && (
              <div className="mb-6 p-4 bg-primary/5 rounded-2xl border border-primary/20 flex items-center gap-3 text-primary text-sm font-semibold">
                <span className="material-symbols-outlined text-secondary">verified_user</span>
                <span>
                  Consultation requested for <strong className="font-extrabold text-primary">{formData.preferredDoctor}</strong>
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Select Service & Doctor */}
              <div>
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">1</span>
                  Select Procedure & Specialist
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="appointment-service" className="block text-xs font-bold text-on-surface mb-1.5">
                      Treatment / Service Needed
                    </label>
                    <select
                      id="appointment-service"
                      name="service"
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-outline-variant/60 focus:outline-none focus:border-primary text-sm font-medium bg-surface-bright"
                    >
                      {servicesList.map((svc, i) => (
                        <option key={i} value={svc}>
                          {svc}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="appointment-doctor" className="block text-xs font-bold text-on-surface mb-1.5">
                      Preferred Specialist
                    </label>
                    <select
                      id="appointment-doctor"
                      name="preferredDoctor"
                      value={formData.preferredDoctor}
                      onChange={(e) => setFormData({ ...formData, preferredDoctor: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-outline-variant/60 focus:outline-none focus:border-primary text-sm font-medium bg-surface-bright"
                    >
                      {doctorOptions.map((docOpt, i) => (
                        <option key={i} value={docOpt}>
                          {docOpt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 2: Date & Time */}
              <div className="pt-4 border-t border-outline-variant/20">
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">2</span>
                  Select Date & Time Slot
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="appointment-date" className="block text-xs font-bold text-on-surface mb-1.5">
                      Date of Visit
                    </label>
                    <input
                      id="appointment-date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleDateChange}
                      className="w-full px-4 py-3 rounded-xl border border-outline-variant/60 focus:outline-none focus:border-primary text-sm font-medium bg-surface-bright"
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div>
                    <label htmlFor="appointment-timeslot" className="block text-xs font-bold text-on-surface mb-1.5">
                      Available Time Slot
                    </label>
                    <select
                      id="appointment-timeslot"
                      name="timeSlot"
                      value={formData.timeSlot}
                      onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-outline-variant/60 focus:outline-none focus:border-primary text-sm font-medium bg-surface-bright"
                      required
                    >
                      <optgroup label="Morning Shift (10:00 AM - 1:00 PM)">
                        {morningSlots.map((slot, i) => (
                          <option key={`m-${i}`} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </optgroup>
                      {!isSunday && (
                        <optgroup label="Evening Shift (5:00 PM - 9:00 PM)">
                          {eveningSlots.map((slot, i) => (
                            <option key={`e-${i}`} value={slot}>
                              {slot}
                            </option>
                          ))}
                        </optgroup>
                      )}
                    </select>
                    {isSunday && (
                      <p className="text-[11px] text-secondary font-semibold mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">info</span>
                        Sunday Hours: 10:00 AM - 1:00 PM (Morning Only)
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 3: Patient Information */}
              <div className="pt-4 border-t border-outline-variant/20">
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">3</span>
                  Patient Contact Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="appointment-name" className="block text-xs font-bold text-on-surface mb-1.5">
                      Full Name
                    </label>
                    <input
                      id="appointment-name"
                      name="name"
                      type="text"
                      placeholder="Enter patient full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-outline-variant/60 focus:outline-none focus:border-primary text-sm font-medium bg-surface-bright"
                      required
                      autoComplete="name"
                    />
                  </div>

                  <div>
                    <label htmlFor="appointment-phone" className="block text-xs font-bold text-on-surface mb-1.5">
                      Phone Number (WhatsApp Preferred)
                    </label>
                    <input
                      id="appointment-phone"
                      name="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-outline-variant/60 focus:outline-none focus:border-primary text-sm font-medium bg-surface-bright"
                      required
                      autoComplete="tel"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="appointment-email" className="block text-xs font-bold text-on-surface mb-1.5">
                    Email Address (Optional)
                  </label>
                  <input
                    id="appointment-email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant/60 focus:outline-none focus:border-primary text-sm font-medium bg-surface-bright"
                    autoComplete="email"
                  />
                </div>

                <div className="mt-4">
                  <label htmlFor="appointment-notes" className="block text-xs font-bold text-on-surface mb-1.5">
                    Symptoms or Specific Questions (Optional)
                  </label>
                  <textarea
                    id="appointment-notes"
                    name="notes"
                    rows="3"
                    placeholder="Describe your symptoms (e.g. Tooth ache, bleeding gums, sensitivity)..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant/60 focus:outline-none focus:border-primary text-sm font-medium bg-surface-bright"
                  ></textarea>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-container text-on-primary font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all text-base flex items-center justify-center gap-2 active:scale-95"
                >
                  <span className="material-symbols-outlined text-xl">event_available</span>
                  Confirm & Request Appointment
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 sm:p-12 clinical-shadow text-center space-y-6 border border-outline-variant/30 animate-fadeIn">
            <div className="w-20 h-20 bg-amber-50 text-amber-700 border border-amber-200 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <span className="material-symbols-outlined text-5xl">pending_actions</span>
            </div>
            <div>
              <span className="inline-block px-3.5 py-1 bg-amber-100 text-amber-800 font-extrabold text-xs rounded-full uppercase tracking-wider mb-2 border border-amber-300">
                Pending Admin Approval
              </span>
              <h2 className="text-3xl font-extrabold text-primary font-display">Appointment Request Submitted</h2>
              <p className="text-sm text-on-surface-variant max-w-lg mx-auto leading-relaxed mt-2">
                Thank you <strong className="text-primary">{formData.name}</strong>. Your consultation request for{' '}
                <strong className="text-primary">{formData.service}</strong> with <strong className="text-primary">{formData.preferredDoctor}</strong> is currently being processed by our clinic team.
              </p>
            </div>

            <div className="bg-surface-bright p-6 rounded-2xl text-left text-xs space-y-2.5 max-w-md mx-auto border border-outline-variant/40">
              <div className="flex justify-between border-b border-outline-variant/20 pb-2">
                <span className="text-on-surface-variant font-semibold">Attending Specialist:</span>
                <strong className="text-primary">{formData.preferredDoctor}</strong>
              </div>
              <div className="flex justify-between border-b border-outline-variant/20 pb-2">
                <span className="text-on-surface-variant font-semibold">Date of Visit:</span>
                <strong className="text-primary">{formData.date}</strong>
              </div>
              <div className="flex justify-between border-b border-outline-variant/20 pb-2">
                <span className="text-on-surface-variant font-semibold">Time Slot:</span>
                <strong className="text-primary">{formData.timeSlot}</strong>
              </div>
              <div className="flex justify-between border-b border-outline-variant/20 pb-2">
                <span className="text-on-surface-variant font-semibold">Patient Phone:</span>
                <strong className="text-primary">{formData.phone}</strong>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-on-surface-variant font-semibold">Clinic Location:</span>
                <strong className="text-primary">Kolathur, Chennai</strong>
              </div>
            </div>

            <p className="text-xs text-on-surface-variant max-w-md mx-auto">
              Our receptionist will review your preferred slot and confirm your booking via <strong>SMS & WhatsApp</strong>.
            </p>

            <div className="pt-2">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    name: '',
                    phone: '',
                    email: '',
                    service: 'General Consultation & Checkup',
                    date: '',
                    timeSlot: '10:00 AM - 11:00 AM',
                    preferredDoctor: 'Any Available Specialist',
                    notes: '',
                  });
                }}
                className="bg-primary hover:bg-primary-container text-on-primary font-bold px-8 py-3.5 rounded-xl shadow-md transition-all active:scale-95 text-sm"
              >
                Book Another Visit
              </button>
            </div>
          </div>
        )}
      </div>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
}
