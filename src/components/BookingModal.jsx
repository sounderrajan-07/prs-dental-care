import React, { useState, useEffect } from 'react';
import { saveAppointment } from '../utils/appointmentStorage';
import { getStoredDoctors } from '../utils/doctorStorage';

export default function BookingModal({ isOpen, onClose, initialService = '' }) {
  const [doctorsList, setDoctorsList] = useState(() => getStoredDoctors());

  const loadDoctors = () => {
    setDoctorsList(getStoredDoctors());
  };

  useEffect(() => {
    loadDoctors();
    window.addEventListener('prs_doctors_updated', loadDoctors);
    return () => window.removeEventListener('prs_doctors_updated', loadDoctors);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: initialService || 'General Consultation & Checkup',
    preferredDoctor: 'Dr. P. R. Sundharam',
    date: '',
    timeSlot: '10:00 AM - 11:00 AM',
    notes: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const servicesList = [
    'General Consultation & Checkup',
    'Advanced Dental Implants',
    'Laser Tooth Whitening',
    'Painless Root Canal Treatment',
    'Pediatric & Kids Dental Care',
    'Orthodontic Braces & Aligners',
    'Crowns & Bridges',
    'Emergency Tooth Pain Relief',
  ];

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

  const resetAndClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-on-background/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 clinical-shadow relative max-h-[90vh] overflow-y-auto border border-outline-variant/30">
        
        {/* Close Button */}
        <button
          onClick={resetAndClose}
          className="absolute top-5 right-5 p-2 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        {!isSubmitted ? (
          <>
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-surface-container-highest text-primary font-bold text-xs rounded-full uppercase tracking-wider mb-2">
                Quick Appointment
              </span>
              <h2 className="text-2xl font-extrabold text-primary">Book Your Visit</h2>
              <p className="text-sm text-on-surface-variant">
                Select your preferred date & time slot at PRS Dental Care, Kolathur.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="modal-service" className="block text-xs font-bold text-on-surface mb-1.5">
                  Treatment / Service
                </label>
                <select
                  id="modal-service"
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
                <label htmlFor="modal-doctor" className="block text-xs font-bold text-on-surface mb-1.5 flex items-center justify-between">
                  <span>Preferred Specialist Dentist</span>
                  <span className="text-[10px] text-primary font-normal font-sans">Synced with Clinic Specialists</span>
                </label>
                <select
                  id="modal-doctor"
                  name="preferredDoctor"
                  value={formData.preferredDoctor}
                  onChange={(e) => setFormData({ ...formData, preferredDoctor: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant/60 focus:outline-none focus:border-primary text-sm font-semibold bg-surface-bright text-primary"
                  required
                >
                  <option value="Any Available Specialist">Any Available Specialist (Clinic Choice)</option>
                  {doctorsList.map((doc) => {
                    const specShort = (doc.specialization || '').split('-')[0].split('(')[0].trim();
                    const label = `${doc.name} ${doc.degree || 'M.D.S'} (${specShort})`;
                    return (
                      <option key={doc.id} value={label}>
                        {label}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="modal-date" className="block text-xs font-bold text-on-surface mb-1.5">
                    Preferred Date
                  </label>
                  <input
                    id="modal-date"
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
                  <label htmlFor="modal-timeslot" className="block text-xs font-bold text-on-surface mb-1.5">
                    Time Slot
                  </label>
                  <select
                    id="modal-timeslot"
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="modal-name" className="block text-xs font-bold text-on-surface mb-1.5">
                    Full Name
                  </label>
                  <input
                    id="modal-name"
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant/60 focus:outline-none focus:border-primary text-sm font-medium bg-surface-bright"
                    required
                    autoComplete="name"
                  />
                </div>

                <div>
                  <label htmlFor="modal-phone" className="block text-xs font-bold text-on-surface mb-1.5">
                    Phone Number
                  </label>
                  <input
                    id="modal-phone"
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

              <div>
                <label htmlFor="modal-notes" className="block text-xs font-bold text-on-surface mb-1.5">
                  Additional Notes (Optional)
                </label>
                <textarea
                  id="modal-notes"
                  name="notes"
                  rows="2"
                  placeholder="Any specific symptoms or questions?"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant/60 focus:outline-none focus:border-primary text-sm font-medium bg-surface-bright"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-container text-on-primary font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 text-base flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-xl">event_available</span>
                  Confirm Appointment Booking
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto shadow-inner border border-amber-300">
              <span className="material-symbols-outlined text-4xl">pending_actions</span>
            </div>
            <h3 className="text-2xl font-extrabold text-primary font-display">Under Approval Process</h3>
            <p className="text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
              Thank you, <strong className="text-primary">{formData.name}</strong>. Your appointment request for{' '}
              <strong className="text-primary">{formData.service}</strong> is currently in the approval process. Once approved by our clinic team, you will receive a confirmation email.
            </p>
            <div className="bg-surface-container p-4 rounded-2xl text-left text-xs space-y-2 text-on-surface max-w-sm mx-auto border border-outline-variant/20">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Status:</span>
                <span className="text-amber-800 font-extrabold bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full text-[11px] flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">hourglass_top</span>
                  <span>Pending Admin Approval</span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Clinic:</span>
                <strong className="text-primary">PRS Dental Care - Kolathur</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Contact Phone:</span>
                <strong className="text-primary">{formData.phone}</strong>
              </div>
            </div>
            <button
              onClick={resetAndClose}
              className="bg-primary hover:bg-primary-container text-on-primary font-bold px-6 py-3 rounded-xl shadow-md transition-all active:scale-95 text-sm"
            >
              Done & Return
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
