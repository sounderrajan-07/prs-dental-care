const STORAGE_KEY = 'prs_dental_appointments_v2';

const todayStr = new Date().toISOString().split('T')[0];
const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

const INITIAL_DEMO_APPOINTMENTS = [
  {
    id: 'APT-1001',
    name: 'Kavitha Ramesh',
    phone: '+91 98401 23456',
    email: 'kavitha.ramesh@gmail.com',
    service: 'Painless Root Canal Treatment',
    preferredDoctor: 'Dr. Purushotham',
    date: todayStr,
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
    id: 'APT-1002',
    name: 'Master Aarav Sundar',
    phone: '+91 97100 88234',
    email: 'parent.aarav@gmail.com',
    service: 'Pediatric & Kids Dental Care',
    preferredDoctor: 'Dr. Vijaya Kumar',
    date: todayStr,
    timeSlot: '11:00 AM - 12:00 PM',
    duration: '30 mins',
    notes: 'Milk tooth caries checkup and Fluoride application.',
    doctorRemarks: 'Approved for morning shift.',
    status: 'Approved',
    treatmentStatus: 'Scheduled',
    cost: '₹1,200',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: 'APT-1003',
    name: 'Ananya Srinivas',
    phone: '+91 94442 11099',
    email: 'ananya.s@outlook.com',
    service: 'Orthodontic Braces & Aligners',
    preferredDoctor: 'Dr. Ragavendra',
    date: tomorrowStr,
    timeSlot: '11:30 AM - 12:30 PM',
    duration: '45 mins',
    notes: 'Wants evaluation for upper teeth crowding & metal braces.',
    doctorRemarks: '',
    status: 'Pending',
    treatmentStatus: 'Consultation',
    cost: '₹25,000',
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString()
  },
  {
    id: 'APT-1004',
    name: 'Suresh Babu',
    phone: '+91 98840 55678',
    email: 'sureshbabu@gmail.com',
    service: 'Emergency Tooth Pain Relief',
    preferredDoctor: 'Dr. Wasim Ahamed',
    date: todayStr,
    timeSlot: '05:00 PM - 06:00 PM',
    duration: '60 mins',
    notes: 'Impacted wisdom tooth pain & gum swelling.',
    doctorRemarks: 'Emergency consultation confirmed.',
    status: 'Approved',
    treatmentStatus: 'In Progress',
    cost: '₹3,500',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString()
  },
  {
    id: 'APT-1005',
    name: 'Meenakshi Sundaram',
    phone: '+91 98401 77665',
    email: 'meenakshi.s@gmail.com',
    service: 'Advanced Dental Implants',
    preferredDoctor: 'Dr. Faiz',
    date: tomorrowStr,
    timeSlot: '06:00 PM - 07:00 PM',
    duration: '90 mins',
    notes: 'Lower left missing tooth replacement with titanium implant.',
    doctorRemarks: 'Pending doctor review for surgical slot availability.',
    status: 'Pending',
    treatmentStatus: 'Scheduled',
    cost: '₹28,000',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: 'APT-1006',
    name: 'Dinesh Karthik',
    phone: '+91 97100 33445',
    email: 'dinesh.k@gmail.com',
    service: 'Full Mouth Scaling & Polishing',
    preferredDoctor: 'Dr. Yoga Rajan',
    date: todayStr,
    timeSlot: '07:00 PM - 08:00 PM',
    duration: '45 mins',
    notes: 'Bleeding gums checkup & deep laser cleaning.',
    doctorRemarks: 'Scaling completed.',
    status: 'Approved',
    treatmentStatus: 'Completed',
    cost: '₹1,800',
    createdAt: new Date(Date.now() - 3600000 * 15).toISOString()
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
    const newApt = {
      id: appointmentData.id || `APT-${1000 + current.length + 1}`,
      name: appointmentData.name,
      phone: appointmentData.phone,
      email: appointmentData.email || '',
      service: appointmentData.service,
      preferredDoctor: appointmentData.preferredDoctor || 'Dr. Purushotham',
      date: appointmentData.date,
      timeSlot: appointmentData.timeSlot,
      duration: '45 mins',
      notes: appointmentData.notes || '',
      doctorRemarks: '',
      status: appointmentData.status || 'Pending',
      treatmentStatus: 'Consultation',
      cost: '₹0',
      createdAt: new Date().toISOString()
    };

    const updated = [newApt, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Automatically sync to Neon PostgreSQL API
    fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newApt)
    }).catch(() => {});

    return newApt;
  } catch (err) {
    console.error('Error saving appointment:', err);
    return null;
  }
};

export const updateStoredStatus = (id, newStatus, doctorRemarks = '', duration = '', notificationMeta = null) => {
  try {
    const current = getStoredAppointments();
    let targetApt = null;
    const updated = current.map((apt) => {
      if (apt.id === id) {
        targetApt = {
          ...apt,
          status: newStatus,
          doctorRemarks: doctorRemarks || apt.doctorRemarks,
          duration: duration || apt.duration,
          smsSent: true,
          whatsappSent: true,
          lastNotificationStatus: newStatus,
          lastNotificationTime: new Date().toISOString(),
          ...(notificationMeta || {})
        };
        return targetApt;
      }
      return apt;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Automatically sync status update to Neon PostgreSQL API
    fetch(`/api/appointments/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus, doctorRemarks, duration })
    }).catch(() => {});

    return updated;
  } catch (err) {
    console.error('Error updating appointment status:', err);
  }
};

export const updateAppointmentDetails = (id, updates) => {
  try {
    const current = getStoredAppointments();
    let targetApt = null;
    const updated = current.map((apt) => {
      if (apt.id === id) {
        targetApt = { ...apt, ...updates };
        return targetApt;
      }
      return apt;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Sync to Neon PostgreSQL API
    if (targetApt) {
      fetch(`/api/appointments/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: targetApt.status || 'Pending', doctorRemarks: targetApt.doctorRemarks, duration: targetApt.duration })
      }).catch(() => {});
    }

    return updated;
  } catch (err) {
    console.error('Error updating appointment details:', err);
  }
};

export const deleteAppointmentRecord = (id) => {
  try {
    const current = getStoredAppointments();
    const updated = current.filter((apt) => apt.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Delete in Neon PostgreSQL API
    fetch(`/api/appointments/${id}`, {
      method: 'DELETE'
    }).catch(() => {});

    return updated;
  } catch (err) {
    console.error('Error deleting appointment:', err);
    return null;
  }
};
