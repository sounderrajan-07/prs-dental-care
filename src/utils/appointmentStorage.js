const STORAGE_KEY = 'prs_dental_appointments_v1';

export const getStoredAppointments = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
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
      preferredDoctor: appointmentData.preferredDoctor || 'Any Available Specialist',
      date: appointmentData.date,
      timeSlot: appointmentData.timeSlot || '10:00 AM - 11:00 AM',
      notes: appointmentData.notes || '',
      status: 'Pending',
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

export const updateStoredStatus = (id, newStatus) => {
  try {
    const current = getStoredAppointments();
    const updated = current.map((apt) => (apt.id === id ? { ...apt, status: newStatus } : apt));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error updating appointment status:', err);
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
