const STORAGE_KEY = 'prs_dental_appointments_v1';

// Seed initial realistic appointments for demonstration if empty
const INITIAL_DEMO_APPOINTMENTS = [
  {
    id: 'APT-1008',
    name: 'Kavitha Ramesh',
    phone: '+91 98401 23456',
    email: 'kavitha.ramesh@gmail.com',
    service: 'Root Canal Treatment',
    preferredDoctor: 'Dr. P. R. Sundharam',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '10:00 AM - 11:00 AM',
    duration: '45 mins',
    notes: 'Severe molar pain on right side when eating hot/cold foods.',
    doctorRemarks: 'Sitting 1 completed. Canals prepared & medicated.',
    status: 'Approved',
    treatmentStatus: 'In Progress',
    cost: '₹4,500',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'APT-1007',
    name: 'Rajesh Kumar',
    phone: '+91 97100 88234',
    email: 'rajesh.k@yahoo.com',
    service: 'Laser Teeth Whitening & Polishing',
    preferredDoctor: 'Dr. R. Sathya',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '02:00 PM - 03:00 PM',
    duration: '60 mins',
    notes: 'Stain removal required before wedding ceremony.',
    doctorRemarks: 'Slot confirmed. Patient notified via SMS.',
    status: 'Approved',
    treatmentStatus: 'Scheduled',
    cost: '₹3,200',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'APT-1006',
    name: 'Ananya Srinivas',
    phone: '+91 94442 11099',
    email: 'ananya.s@outlook.com',
    service: 'Invisalign & Clear Aligners Consultation',
    preferredDoctor: 'Dr. R. Sathya',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    timeSlot: '11:30 AM - 12:30 PM',
    duration: '30 mins',
    notes: 'Wants evaluation for upper teeth crowding.',
    doctorRemarks: '',
    status: 'Pending',
    treatmentStatus: 'Consultation',
    cost: '₹500',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: 'APT-1005',
    name: 'Suresh Varma',
    phone: '+91 98840 55678',
    email: 'suresh.varma@gmail.com',
    service: 'Wisdom Tooth Extraction',
    preferredDoctor: 'Dr. A. K. Vikram',
    date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    timeSlot: '04:00 PM - 05:30 PM',
    duration: '90 mins',
    notes: 'Impacted lower left wisdom tooth causing swelling.',
    doctorRemarks: 'Surgical extraction successful under local anesthesia.',
    status: 'Approved',
    treatmentStatus: 'Completed',
    cost: '₹6,000',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'APT-1004',
    name: 'Deepak Nathan',
    phone: '+91 99620 44321',
    email: 'deepak.n@gmail.com',
    service: 'Dental Implant & Crown',
    preferredDoctor: 'Dr. P. R. Sundharam',
    date: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0],
    timeSlot: '10:00 AM - 11:30 AM',
    duration: '75 mins',
    notes: 'Replacement for missing premolar tooth.',
    doctorRemarks: 'Implant post fixture placed. Osseointegration check in 2 weeks.',
    status: 'Approved',
    treatmentStatus: 'In Progress',
    cost: '₹22,000',
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString()
  }
];

export const getStoredAppointments = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_APPOINTMENTS));
      return INITIAL_DEMO_APPOINTMENTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_DEMO_APPOINTMENTS;
  } catch (err) {
    return INITIAL_DEMO_APPOINTMENTS;
  }
};

export const saveAppointment = (appointmentData) => {
  try {
    const current = getStoredAppointments();
    const newAppointment = {
      id: `APT-${1000 + current.length + 1}`,
      name: appointmentData.name,
      phone: appointmentData.phone,
      email: appointmentData.email || '',
      service: appointmentData.service,
      preferredDoctor: appointmentData.preferredDoctor || 'Dr. P. R. Sundharam',
      date: appointmentData.date,
      timeSlot: appointmentData.timeSlot || '10:00 AM - 11:00 AM',
      duration: appointmentData.duration || '45 mins',
      notes: appointmentData.notes || '',
      doctorRemarks: '',
      status: 'Pending',
      treatmentStatus: 'Scheduled',
      cost: appointmentData.cost || '₹1,500',
      createdAt: new Date().toISOString()
    };

    const updated = [newAppointment, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newAppointment;
  } catch (err) {
    console.error('Error saving appointment:', err);
    return null;
  }
};

export const updateStoredStatus = (id, newStatus, doctorRemarks = '', duration = '') => {
  try {
    const current = getStoredAppointments();
    const updated = current.map((apt) => {
      if (apt.id === id) {
        return {
          ...apt,
          status: newStatus,
          ...(doctorRemarks ? { doctorRemarks } : {}),
          ...(duration ? { duration } : {})
        };
      }
      return apt;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error updating appointment status:', err);
  }
};

export const updateAppointmentDetails = (id, updates) => {
  try {
    const current = getStoredAppointments();
    const updated = current.map((apt) => (apt.id === id ? { ...apt, ...updates } : apt));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error updating appointment details:', err);
  }
};

export const deleteStoredAppointment = (id) => {
  try {
    const current = getStoredAppointments();
    const updated = current.filter((apt) => apt.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error deleting appointment:', err);
  }
};
