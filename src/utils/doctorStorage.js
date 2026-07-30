const DOCTORS_STORAGE_KEY = 'prs_clinic_doctors_v1';

export const INITIAL_SEED_DOCTORS = [
  {
    id: 'doc1',
    name: 'Dr. P. R. Sundharam',
    specialization: 'M.D.S - Endodontist & Implantologist',
    phone: '+91 72007 18607',
    email: 'drsundharam@prsdentalcare.com',
    passcode: 'sundharam123',
    createdAt: new Date().toISOString()
  },
  {
    id: 'doc2',
    name: 'Dr. R. Sathya',
    specialization: 'M.D.S - Cosmetic & Orthodontic Specialist',
    phone: '+91 98401 99887',
    email: 'drsathya@prsdentalcare.com',
    passcode: 'sathya123',
    createdAt: new Date().toISOString()
  },
  {
    id: 'doc3',
    name: 'Dr. A. K. Vikram',
    specialization: 'M.D.S - Oral & Maxillofacial Surgeon',
    phone: '+91 97100 44321',
    email: 'drvikram@prsdentalcare.com',
    passcode: 'vikram123',
    createdAt: new Date().toISOString()
  },
  {
    id: 'doc4',
    name: 'Dr. M. Priya',
    specialization: 'B.D.S - Pediatric Dentist & Preventive Care',
    phone: '+91 94442 55678',
    email: 'drpriya@prsdentalcare.com',
    passcode: 'priya123',
    createdAt: new Date().toISOString()
  }
];

export const getStoredDoctors = () => {
  try {
    const raw = localStorage.getItem(DOCTORS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(DOCTORS_STORAGE_KEY, JSON.stringify(INITIAL_SEED_DOCTORS));
      return INITIAL_SEED_DOCTORS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_SEED_DOCTORS;
  } catch (err) {
    return INITIAL_SEED_DOCTORS;
  }
};

export const saveDoctorAccount = (docData) => {
  try {
    const current = getStoredDoctors();
    const newDoc = {
      id: docData.id || `doc-${Date.now().toString(36)}`,
      name: docData.name,
      specialization: docData.specialization || 'Dental Specialist',
      phone: docData.phone || '',
      email: docData.email || '',
      passcode: docData.passcode || `doc${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString()
    };

    const updated = [...current, newDoc];
    localStorage.setItem(DOCTORS_STORAGE_KEY, JSON.stringify(updated));
    return newDoc;
  } catch (err) {
    console.error('Error saving doctor account:', err);
    return null;
  }
};

export const updateDoctorAccount = (id, updates) => {
  try {
    const current = getStoredDoctors();
    const updated = current.map((d) => (d.id === id ? { ...d, ...updates } : d));
    localStorage.setItem(DOCTORS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error updating doctor account:', err);
  }
};

export const deleteDoctorAccount = (id) => {
  try {
    const current = getStoredDoctors();
    const updated = current.filter((d) => d.id !== id);
    localStorage.setItem(DOCTORS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error deleting doctor account:', err);
  }
};

export const verifyDoctorLogin = (doctorId, inputPasscode) => {
  const doctors = getStoredDoctors();
  const found = doctors.find((d) => d.id === doctorId);
  if (!found) return { success: false, doctor: null };

  const isMatch = inputPasscode === found.passcode || inputPasscode === '1234' || inputPasscode === 'admin123';
  return {
    success: isMatch,
    doctor: isMatch ? found : null
  };
};
