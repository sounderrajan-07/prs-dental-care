const PATIENT_HISTORY_KEY = 'prs_patient_treatment_history_v1';

const INITIAL_PATIENT_HISTORY = [
  {
    id: 'HIS-5001',
    patientName: 'Kavitha Ramesh',
    patientPhone: '+91 98401 23456',
    patientEmail: 'kavitha.ramesh@gmail.com',
    treatmentName: 'Root Canal Treatment - Lower Molar (Sitting 1)',
    attendingDoctor: 'Dr. P. R. Sundharam',
    doctorSpecialization: 'M.D.S - Endodontist',
    treatmentDate: '2026-07-28',
    timeSlot: '10:00 AM - 10:45 AM',
    duration: '45 mins',
    cost: '₹4,500',
    status: 'Completed',
    notes: 'Pulp extirpation done under rubber dam. Biomechanical preparation completed. Calcium hydroxide intra-canal dressing given.'
  },
  {
    id: 'HIS-5002',
    patientName: 'Rajesh Kumar',
    patientPhone: '+91 97100 88234',
    patientEmail: 'rajesh.k@yahoo.com',
    treatmentName: 'Full Mouth Scaling & Laser Whitening',
    attendingDoctor: 'Dr. R. Sathya',
    doctorSpecialization: 'M.D.S - Cosmetic Specialist',
    treatmentDate: '2026-07-25',
    timeSlot: '02:00 PM - 03:00 PM',
    duration: '60 mins',
    cost: '₹3,200',
    status: 'Completed',
    notes: 'Ultrasonic supragingival and subgingival calculus removal. Laser whitening applied for 30 minutes. Shade lightened by 3 tones.'
  },
  {
    id: 'HIS-5003',
    patientName: 'Suresh Varma',
    patientPhone: '+91 98840 55678',
    patientEmail: 'suresh.varma@gmail.com',
    treatmentName: 'Surgical Extraction - Impacted Tooth #38',
    attendingDoctor: 'Dr. A. K. Vikram',
    doctorSpecialization: 'M.D.S - Oral Surgeon',
    treatmentDate: '2026-07-20',
    timeSlot: '04:00 PM - 05:30 PM',
    duration: '90 mins',
    notes: 'Mucoperiosteal flap elevated, bone guttering performed. Tooth sectioned and removed completely. 3-0 silk sutures placed.'
  },
  {
    id: 'HIS-5004',
    patientName: 'Deepak Nathan',
    patientPhone: '+91 99620 44321',
    patientEmail: 'deepak.n@gmail.com',
    treatmentName: 'Titanium Dental Implant Placement (#24)',
    attendingDoctor: 'Dr. P. R. Sundharam',
    doctorSpecialization: 'M.D.S - Implantologist',
    treatmentDate: '2026-07-18',
    timeSlot: '10:00 AM - 11:15 AM',
    duration: '75 mins',
    cost: '₹22,000',
    status: 'In Progress',
    notes: 'Standard 4.2mm x 11.5mm implant osteotomy prepared. Excellent primary stability achieved (>35 Ncm). Healing cap placed.'
  },
  {
    id: 'HIS-5005',
    patientName: 'Meenakshi Sundaram',
    patientPhone: '+91 98410 99887',
    patientEmail: 'meenakshi.s@gmail.com',
    treatmentName: 'Pediatric Fluoride Varnish & Pulpotomy',
    attendingDoctor: 'Dr. M. Priya',
    doctorSpecialization: 'B.D.S - Pediatric Dentist',
    treatmentDate: '2026-07-15',
    timeSlot: '05:00 PM - 05:40 PM',
    duration: '40 mins',
    cost: '₹2,800',
    status: 'Completed',
    notes: 'Formocresol pulpotomy performed on tooth #74. Preformed stainless steel crown fitted. High patient co-operation.'
  },
  {
    id: 'HIS-5006',
    patientName: 'Ananya Srinivas',
    patientPhone: '+91 94442 11099',
    patientEmail: 'ananya.s@outlook.com',
    treatmentName: 'Clear Aligner Scan & 3D Treatment Simulation',
    attendingDoctor: 'Dr. R. Sathya',
    doctorSpecialization: 'M.D.S - Orthodontics',
    treatmentDate: '2026-07-10',
    timeSlot: '11:30 AM - 12:15 PM',
    duration: '45 mins',
    cost: '₹1,500',
    status: 'Completed',
    notes: 'Intraoral 3D digital scan captured. Digital setup previewed to patient. Expected duration: 8 months (16 aligner trays).'
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
      treatmentName: recordData.treatmentName || recordData.service || 'Dental Procedure',
      attendingDoctor: recordData.attendingDoctor || 'Dr. P. R. Sundharam',
      doctorSpecialization: recordData.doctorSpecialization || 'Specialist Consultant',
      treatmentDate: recordData.treatmentDate || new Date().toISOString().split('T')[0],
      timeSlot: recordData.timeSlot || '10:00 AM - 11:00 AM',
      duration: recordData.duration || '45 mins',
      cost: recordData.cost || '₹2,500',
      status: recordData.status || 'Completed',
      notes: recordData.notes || 'Treatment completed successfully with routine care instructions.'
    };

    const updated = [newRecord, ...current];
    localStorage.setItem(PATIENT_HISTORY_KEY, JSON.stringify(updated));
    return newRecord;
  } catch (err) {
    console.error('Error saving patient history:', err);
    return null;
  }
};

export const getPatientHistoryStats = () => {
  const history = getStoredPatientHistory();
  const totalTreatments = history.length;
  let totalRevenue = 0;
  const doctorWorkload = {};

  history.forEach((rec) => {
    // Parse numeric cost
    const numStr = (rec.cost || '').replace(/[^0-9]/g, '');
    if (numStr) totalRevenue += parseInt(numStr, 10);

    const doc = rec.attendingDoctor || 'Unassigned';
    doctorWorkload[doc] = (doctorWorkload[doc] || 0) + 1;
  });

  return {
    totalTreatments,
    totalRevenue: `₹${totalRevenue.toLocaleString('en-IN')}`,
    doctorWorkload,
    completedCount: history.filter((h) => h.status === 'Completed').length,
    inProgressCount: history.filter((h) => h.status === 'In Progress').length
  };
};
