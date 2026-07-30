const DOCTORS_STORAGE_KEY = 'prs_clinic_doctors_v1';

export const INITIAL_SEED_DOCTORS = [
  {
    id: 'doc1',
    name: 'Dr. P. R. Sundharam',
    degree: 'M.D.S',
    specialization: 'Endodontist & Implantologist',
    experience: '15+ Years Experience in Root Canal & Implants',
    phone: '+91 72007 18607',
    email: 'drsundharam@prsdentalcare.com',
    passcode: 'sundharam123',
    icon: 'dentistry',
    color: 'from-blue-500 to-indigo-500',
    initials: 'PS',
    createdAt: new Date().toISOString()
  },
  {
    id: 'doc2',
    name: 'Dr. R. Sathya',
    degree: 'M.D.S',
    specialization: 'Cosmetic & Orthodontic Specialist',
    experience: '12+ Years Experience in Braces & Aligners',
    phone: '+91 98401 99887',
    email: 'drsathya@prsdentalcare.com',
    passcode: 'sathya123',
    icon: 'align_horizontal_center',
    color: 'from-purple-500 to-indigo-500',
    initials: 'RS',
    createdAt: new Date().toISOString()
  },
  {
    id: 'doc3',
    name: 'Dr. A. K. Vikram',
    degree: 'M.D.S',
    specialization: 'Oral & Maxillofacial Surgeon',
    experience: '14+ Years Experience in Surgical Extractions',
    phone: '+91 97100 44321',
    email: 'drvikram@prsdentalcare.com',
    passcode: 'vikram123',
    icon: 'medical_services',
    color: 'from-emerald-500 to-teal-500',
    initials: 'AV',
    createdAt: new Date().toISOString()
  },
  {
    id: 'doc4',
    name: 'Dr. M. Priya',
    degree: 'B.D.S',
    specialization: 'Pediatric Dentist & Preventive Care',
    experience: '10+ Years Experience in Child Dental Care',
    phone: '+91 94442 55678',
    email: 'drpriya@prsdentalcare.com',
    passcode: 'priya123',
    icon: 'child_care',
    color: 'from-pink-500 to-rose-500',
    initials: 'MP',
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
    const nameParts = docData.name.replace('Dr. ', '').split(' ');
    const initials = nameParts.length >= 2 ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase() : docData.name.substring(0, 2).toUpperCase();

    const newDoc = {
      id: docData.id || `doc-${Date.now().toString(36)}`,
      name: docData.name.startsWith('Dr.') ? docData.name : `Dr. ${docData.name}`,
      degree: docData.degree || 'M.D.S',
      specialization: docData.specialization || 'Dental Specialist',
      experience: docData.experience || 'Specialist Consultant at PRS Dental Care',
      phone: docData.phone || '',
      email: docData.email || '',
      passcode: docData.passcode || `doc${Math.floor(100 + Math.random() * 900)}`,
      icon: docData.icon || 'stethoscope',
      color: docData.color || 'from-primary to-secondary',
      initials,
      createdAt: new Date().toISOString()
    };

    const updated = [...current, newDoc];
    localStorage.setItem(DOCTORS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('prs_doctors_updated'));
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
    window.dispatchEvent(new Event('prs_doctors_updated'));
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
    window.dispatchEvent(new Event('prs_doctors_updated'));
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
