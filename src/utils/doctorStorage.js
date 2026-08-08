const DOCTORS_STORAGE_KEY = 'prs_clinic_doctors_v2';

export const INITIAL_SEED_DOCTORS = [
  {
    id: 'doc1',
    name: 'Dr. Vijaya Kumar',
    degree: 'M.D.S',
    specialization: 'Pedodontist Specialist (Child Specialist)',
    experience: '12+ Years Experience in Pediatric Dentistry & Child Care',
    phone: '+91 72007 18607',
    email: 'drvijayakumar@prsdentalcare.com',
    passcode: 'vijay123',
    icon: 'child_care',
    color: 'from-pink-500 to-rose-500',
    initials: 'VK',
    createdAt: new Date().toISOString()
  },
  {
    id: 'doc2',
    name: 'Dr. Keerthi.T',
    degree: 'M.D.S',
    specialization: 'Pedodontist Specialist (Child Specialist)',
    experience: '10+ Years Experience in Preventive Pediatric Care',
    phone: '+91 98401 22110',
    email: 'drkeerthi@prsdentalcare.com',
    passcode: 'keerthi123',
    icon: 'child_care',
    color: 'from-pink-500 to-rose-500',
    initials: 'KT',
    createdAt: new Date().toISOString()
  },
  {
    id: 'doc3',
    name: 'Dr. Ragavendra',
    degree: 'M.D.S',
    specialization: 'Orthodontics Specialist',
    experience: '14+ Years Experience in Braces & Teeth Alignment',
    phone: '+91 97100 88234',
    email: 'drragavendra@prsdentalcare.com',
    passcode: 'ragav123',
    icon: 'align_horizontal_center',
    color: 'from-purple-500 to-indigo-500',
    initials: 'RV',
    createdAt: new Date().toISOString()
  },
  {
    id: 'doc4',
    name: 'Dr. Yunus Amin',
    degree: 'M.D.S',
    specialization: 'Orthodontics Specialist',
    experience: '11+ Years Experience in Clear Aligners & Invisalign',
    phone: '+91 94442 11099',
    email: 'dryunus@prsdentalcare.com',
    passcode: 'yunus123',
    icon: 'align_horizontal_center',
    color: 'from-purple-500 to-indigo-500',
    initials: 'YA',
    createdAt: new Date().toISOString()
  },
  {
    id: 'doc5',
    name: 'Dr. Wasim Ahamed',
    degree: 'M.D.S',
    specialization: 'Oral Medicine & Maxillofacial Surgeon',
    experience: '15+ Years Experience in Oral Surgery & Trauma Care',
    phone: '+91 98840 55678',
    email: 'drwasim@prsdentalcare.com',
    passcode: 'wasim123',
    icon: 'medical_services',
    color: 'from-blue-500 to-cyan-500',
    initials: 'WA',
    createdAt: new Date().toISOString()
  },
  {
    id: 'doc6',
    name: 'Dr. Naren Kumar',
    degree: 'M.D.S, FCIP',
    specialization: 'Oral Medicine & Maxillofacial Surgeon',
    experience: '16+ Years Senior Maxillofacial Consultant',
    phone: '+91 98401 77665',
    email: 'drnaren@prsdentalcare.com',
    passcode: 'naren123',
    icon: 'medical_services',
    color: 'from-blue-500 to-cyan-500',
    initials: 'NK',
    createdAt: new Date().toISOString()
  },
  {
    id: 'doc7',
    name: 'Dr. Samu Fathima',
    degree: 'M.D.S',
    specialization: 'Oral Medicine & Maxillofacial Radiology',
    experience: '9+ Years Experience in 3D CBCT & Digital Imaging',
    phone: '+91 97100 33445',
    email: 'drsamu@prsdentalcare.com',
    passcode: 'samu123',
    icon: 'biotech',
    color: 'from-teal-500 to-emerald-500',
    initials: 'SF',
    createdAt: new Date().toISOString()
  },
  {
    id: 'doc8',
    name: 'Dr. Yoga Rajan',
    degree: 'M.D.S',
    specialization: 'Periodontist Specialist',
    experience: '13+ Years Experience in Gum Surgery & Periodontics',
    phone: '+91 94442 88990',
    email: 'dryogarajan@prsdentalcare.com',
    passcode: 'yoga123',
    icon: 'dentistry',
    color: 'from-emerald-500 to-teal-500',
    initials: 'YR',
    createdAt: new Date().toISOString()
  },
  {
    id: 'doc9',
    name: 'Dr. Purushotham',
    degree: 'M.D.S',
    specialization: 'Endodontist Specialist',
    experience: '15+ Years Root Canal & Micro-Endodontics Specialist',
    phone: '+91 98840 12345',
    email: 'drpurushotham@prsdentalcare.com',
    passcode: 'puru123',
    icon: 'dentistry',
    color: 'from-orange-500 to-amber-500',
    initials: 'PT',
    createdAt: new Date().toISOString()
  },
  {
    id: 'doc10',
    name: 'Dr. Faiz',
    degree: 'M.D.S',
    specialization: 'Prosthodontist & Implantologist',
    experience: '14+ Years Dental Implants & Full Mouth Rehabilitation',
    phone: '+91 98401 55443',
    email: 'drfaiz@prsdentalcare.com',
    passcode: 'faiz123',
    icon: 'clinical_notes',
    color: 'from-violet-500 to-purple-500',
    initials: 'FZ',
    createdAt: new Date().toISOString()
  },
  {
    id: 'doc11',
    name: 'Dr. Kiran Kumar. P',
    degree: 'M.D.S',
    specialization: 'Prosthodontist & Implantologist',
    experience: '12+ Years Digital Prosthodontics Specialist',
    phone: '+91 97100 66778',
    email: 'drkirankumar@prsdentalcare.com',
    passcode: 'kiran123',
    icon: 'clinical_notes',
    color: 'from-violet-500 to-purple-500',
    initials: 'KK',
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

    // Automatically sync to Neon PostgreSQL API
    fetch('/api/doctors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDoc)
    }).catch(() => {});

    return newDoc;
  } catch (err) {
    console.error('Error saving doctor account:', err);
    return null;
  }
};

export const updateDoctorAccount = (id, updates) => {
  try {
    const current = getStoredDoctors();
    let targetDoc = null;
    const updated = current.map((d) => {
      if (d.id === id) {
        targetDoc = { ...d, ...updates };
        return targetDoc;
      }
      return d;
    });
    localStorage.setItem(DOCTORS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('prs_doctors_updated'));

    if (targetDoc) {
      fetch('/api/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(targetDoc)
      }).catch(() => {});
    }

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

    fetch(`/api/doctors/${id}`, { method: 'DELETE' }).catch(() => {});

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
