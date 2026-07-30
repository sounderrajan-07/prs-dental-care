const PATIENT_HISTORY_KEY = 'prs_patient_treatment_history_v2';

const INITIAL_PATIENT_HISTORY = [
  {
    id: 'HIS-5001',
    patientName: 'Kavitha Ramesh',
    patientPhone: '+91 98401 23456',
    patientEmail: 'kavitha.ramesh@gmail.com',
    treatmentName: 'Root Canal Treatment - Lower Molar (Sitting 1)',
    attendingDoctor: 'Dr. Purushotham',
    doctorSpecialization: 'M.D.S - Endodontist Specialist',
    treatmentDate: '2026-07-28',
    timeSlot: '10:00 AM - 10:45 AM',
    duration: '45 mins',
    cost: '₹4,500',
    status: 'Completed',
    notes: 'Pulp extirpation done under rubber dam. Biomechanical preparation completed. Calcium hydroxide intra-canal dressing given.'
  },
  {
    id: 'HIS-5002',
    patientName: 'Master Aarav Sundar',
    patientPhone: '+91 97100 88234',
    patientEmail: 'parent.aarav@gmail.com',
    treatmentName: 'Pediatric Fluoride Varnish & Pulpectomy',
    attendingDoctor: 'Dr. Vijaya Kumar',
    doctorSpecialization: 'M.D.S - Pedodontist Specialist',
    treatmentDate: '2026-07-25',
    timeSlot: '11:00 AM - 11:45 AM',
    duration: '45 mins',
    cost: '₹2,200',
    status: 'Completed',
    notes: 'Kid friendly behavior shaping applied. Fluoride varnish application on upper anteriors.'
  },
  {
    id: 'HIS-5003',
    patientName: 'Suresh Varma',
    patientPhone: '+91 98840 55678',
    patientEmail: 'suresh.varma@gmail.com',
    treatmentName: 'Surgical Extraction - Impacted Wisdom Tooth #38',
    attendingDoctor: 'Dr. Wasim Ahamed',
    doctorSpecialization: 'M.D.S - Oral & Maxillofacial Surgeon',
    treatmentDate: '2026-07-20',
    timeSlot: '04:00 PM - 05:30 PM',
    duration: '90 mins',
    cost: '₹5,500',
    status: 'Completed',
    notes: 'Mucoperiosteal flap elevated, bone guttering performed. Tooth sectioned and removed completely. 3-0 silk sutures placed.'
  },
  {
    id: 'HIS-5004',
    patientName: 'Ananya Srinivas',
    patientPhone: '+91 94442 11099',
    patientEmail: 'ananya.s@outlook.com',
    treatmentName: 'Metal Orthodontic Braces Bonding (Upper & Lower)',
    attendingDoctor: 'Dr. Ragavendra',
    doctorSpecialization: 'M.D.S - Orthodontics Specialist',
    treatmentDate: '2026-07-18',
    timeSlot: '11:30 AM - 12:30 PM',
    duration: '60 mins',
    cost: '₹25,000',
    status: 'Completed',
    notes: 'Etching & bonding of MBT 0.022 brackets. 0.012 NiTi wire placed. Oral hygiene instructions given.'
  },
  {
    id: 'HIS-5005',
    patientName: 'Meenakshi Sundaram',
    patientPhone: '+91 98401 77665',
    patientEmail: 'meenakshi.s@gmail.com',
    treatmentName: 'Dental Implant Osteotomy & Fixture Placement #36',
    attendingDoctor: 'Dr. Faiz',
    doctorSpecialization: 'M.D.S - Prosthodontist & Implantologist',
    treatmentDate: '2026-07-15',
    timeSlot: '05:00 PM - 06:30 PM',
    duration: '90 mins',
    cost: '₹28,000',
    status: 'Completed',
    notes: '4.3x10mm titanium fixture placed with 35Ncm torque. Healing abutment secured.'
  },
  {
    id: 'HIS-5006',
    patientName: 'Dinesh Karthik',
    patientPhone: '+91 97100 33445',
    patientEmail: 'dinesh.k@gmail.com',
    treatmentName: 'Flap Surgery & Bone Grafting - Upper Quadrant',
    attendingDoctor: 'Dr. Yoga Rajan',
    doctorSpecialization: 'M.D.S - Periodontist Specialist',
    treatmentDate: '2026-07-10',
    timeSlot: '02:00 PM - 03:30 PM',
    duration: '90 mins',
    cost: '₹8,500',
    status: 'Completed',
    notes: 'Full thickness flap. Root planing done. Allograft bone matrix packed. Coe-pak dressing placed.'
  }
];

export const getStoredPatientHistory = () => {
  try {
    const raw = localStorage.getItem(PATIENT_HISTORY_KEY);
    if (!raw) {
      localStorage.setItem(PATIENT_HISTORY_KEY, JSON.stringify(INITIAL_PATIENT_HISTORY));
      return INITIAL_PATIENT_HISTORY;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_PATIENT_HISTORY;
  } catch (err) {
    return INITIAL_PATIENT_HISTORY;
  }
};

export const savePatientHistoryRecord = (recordData) => {
  try {
    const current = getStoredPatientHistory();
    const newRecord = {
      id: `HIS-${5000 + current.length + 1}`,
      patientName: recordData.patientName,
      patientPhone: recordData.patientPhone || '',
      patientEmail: recordData.patientEmail || '',
      treatmentName: recordData.treatmentName,
      attendingDoctor: recordData.attendingDoctor || 'Dr. Purushotham',
      doctorSpecialization: recordData.doctorSpecialization || 'Specialist Consultant',
      treatmentDate: recordData.treatmentDate || new Date().toISOString().split('T')[0],
      timeSlot: recordData.timeSlot || '10:00 AM - 11:00 AM',
      duration: recordData.duration || '45 mins',
      cost: recordData.cost ? (recordData.cost.startsWith('₹') ? recordData.cost : `₹${recordData.cost}`) : '₹0',
      status: recordData.status || 'Completed',
      notes: recordData.notes || ''
    };

    const updated = [newRecord, ...current];
    localStorage.setItem(PATIENT_HISTORY_KEY, JSON.stringify(updated));
    return newRecord;
  } catch (err) {
    console.error('Error saving patient history record:', err);
    return null;
  }
};

export const getPatientHistoryStats = () => {
  const records = getStoredPatientHistory();
  const totalRevenue = records.reduce((sum, r) => {
    const num = parseInt(r.cost.replace(/[^0-9]/g, '')) || 0;
    return sum + num;
  }, 0);

  return {
    totalPatients: records.length,
    completedTreatments: records.filter((r) => r.status === 'Completed').length,
    inProgressTreatments: records.filter((r) => r.status === 'In Progress').length,
    totalRevenue: `₹${totalRevenue.toLocaleString('en-IN')}`
  };
};
