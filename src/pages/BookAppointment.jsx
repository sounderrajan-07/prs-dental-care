import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ContactModal from '../components/ContactModal';
import { saveAppointment } from '../utils/appointmentStorage';

export default function BookAppointment() {
  const [searchParams] = useSearchParams();
  const [isContactOpen, setIsContactOpen] = useState(false);
  const preselectedService = searchParams.get('service') || '';
  const preselectedDoctor = searchParams.get('doctor') || '';

  const doctorOptions = [
    'Any Available Specialist',
    'Dr. Vijaya Kumar M.D.S (Pedodontist)',
    'Dr. Keerthi.T M.D.S (Pedodontist)',
    'Dr. Ragavendra M.D.S (Orthodontist)',
    'Dr. Yunus Amin M.D.S (Orthodontist)',
    'Dr. Wasim Ahamed M.D.S (Oral Surgeon)',
    'Dr. Naren Kumar M.D.S, FCIP (Oral Surgeon)',
    'Dr. Samu Fathima M.D.S (Oral Radiology)',
    'Dr. Yoga Rajan M.D.S (Periodontist)',
    'Dr. Purushotham M.D.S (Endodontist)',
    'Dr. Faiz M.D.S (Implantologist)',
    'Dr. Kiran Kumar. P M.D.S (Implantologist)',
  ];

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
    
    const matched = doctorOptions.find((opt) => {
      const optLower = opt.toLowerCase();
      return optLower.includes(cleanQuery) || cleanQuery.includes(optLower.split(' m.d.s')[0]);
    });
    
    return matched || 'Any Available Specialist';
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
  }, [searchParams]);

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
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
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
                  Consultation requested for <strong className="font-extrabold text-primary underline decoration-secondary decoration-2">{formData.preferredDoctor}</strong>
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Step 1: Treatment */}
              <div>
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">1</span>
                  Select Treatment & Doctor
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="appointment-service" className="block text-xs font-bold text-on-surface mb-1.5">
                      Service / Procedure
                    </label>
                    <select
                      id="appointment-service"
                      name="service"
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-outline-variant/60 focus:outline-none focus:border-primary text-sm font-medium bg-surface-bright"
                      required
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="appointment-name" className="block text-xs font-bold text-on-surface mb-1.5">
                      Full Name *
                    </label>
                    <input
                      id="appointment-name"
                      name="name"
                      type="text"
                      placeholder="e.g. Ramesh Kumar"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-outline-variant/60 focus:outline-none focus:border-primary text-sm font-medium bg-surface-bright"
                      required
                      autoComplete="name"
                    />
                  </div>

                  <div>
                    <label htmlFor="appointment-phone" className="block text-xs font-bold text-on-surface mb-1.5">
                      Mobile Phone Number *
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

                <div className="mb-4">
                  <label htmlFor="appointment-email" className="block text-xs font-bold text-on-surface mb-1.5">
                    Email Address (Optional)
                  </label>
                  <input
                    id="appointment-email"
                    name="email"
                    type="email"
                    placeholder="patient@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant/60 focus:outline-none focus:border-primary text-sm font-medium bg-surface-bright"
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label htmlFor="appointment-notes" className="block text-xs font-bold text-on-surface mb-1.5">
                    Specific Symptoms or Requests
                  </label>
                  <textarea
                    id="appointment-notes"
                    name="notes"
                    rows="3"
                    placeholder="Please describe any tooth pain, sensitivity, or previous dental history..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant/60 focus:outline-none focus:border-primary text-sm font-medium bg-surface-bright"
                  ></textarea>
                </div>
              </div>

              {/* Submit button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-container text-on-primary font-bold py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all active:scale-95 text-base flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-xl">event_available</span>
                  Confirm & Reserve Appointment
                </button>
              </div>

            </form>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 sm:p-12 clinical-shadow border border-outline-variant/30 text-center space-y-6">
            <div className="w-20 h-20 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto shadow-inner border border-amber-300">
              <span className="material-symbols-outlined text-5xl">pending_actions</span>
            </div>
            
            <h2 className="text-3xl font-extrabold text-primary font-display">
              Appointment Under Approval Process
            </h2>

            <p className="text-base text-on-surface-variant max-w-lg mx-auto leading-relaxed">
              Thank you, <strong className="text-primary">{formData.name}</strong>. Your appointment request for <strong className="text-primary">{formData.service}</strong> is currently in the approval process. Once approved by our clinic team, you will receive a confirmation email at <strong className="text-primary">{formData.email || 'your email address'}</strong>.
            </p>

            <div className="bg-surface-container p-6 rounded-2xl max-w-md mx-auto text-left space-y-2.5 text-sm text-on-surface border border-outline-variant/20">
              <div className="flex justify-between border-b border-outline-variant/20 pb-2">
                <span className="text-on-surface-variant font-medium">Status:</span>
                <span className="text-amber-800 font-extrabold bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full text-xs flex items-center gap-1">
                  <span>⏳ Pending Admin Approval</span>
                </span>
              </div>
              <div className="flex justify-between border-b border-outline-variant/20 pb-2">
                <span className="text-on-surface-variant font-medium">Date:</span>
                <strong className="text-primary">{formData.date || 'Selected Date'}</strong>
              </div>
              <div className="flex justify-between border-b border-outline-variant/20 pb-2">
                <span className="text-on-surface-variant font-medium">Time Slot:</span>
                <strong className="text-primary">{formData.timeSlot}</strong>
              </div>
              <div className="flex justify-between border-b border-outline-variant/20 pb-2">
                <span className="text-on-surface-variant font-medium">Specialist:</span>
                <strong className="text-primary">{formData.preferredDoctor}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant font-medium">Clinic Branch:</span>
                <strong className="text-primary">PRS Dental Care - Kolathur</strong>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <a
                href="tel:+917200718607"
                onClick={(e) => {
                  if (window.innerWidth > 768) {
                    e.preventDefault();
                  }
                  setIsContactOpen(true);
                }}
                className="bg-primary text-on-primary font-bold py-3.5 px-6 rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">call</span>
                Call Clinic Directly: +91 72007 18607
              </a>
              <button
                onClick={() => setIsSubmitted(false)}
                className="bg-surface-container-high text-primary font-bold py-3.5 px-6 rounded-xl transition-all text-sm"
              >
                Book Another Appointment
              </button>
            </div>
          </div>
        )}

      </div>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
}
