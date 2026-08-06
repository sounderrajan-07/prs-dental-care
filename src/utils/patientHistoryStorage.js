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

export const updatePatientHistoryRecord = (id, updates) => {
  try {
    const current = getStoredPatientHistory();
    const updated = current.map((rec) => {
      if (rec.id === id) {
        return {
          ...rec,
          ...updates,
          cost: updates.cost ? (updates.cost.startsWith('₹') ? updates.cost : `₹${updates.cost}`) : rec.cost
        };
      }
      return rec;
    });
    localStorage.setItem(PATIENT_HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error updating patient history record:', err);
    return null;
  }
};

export const deletePatientHistoryRecord = (id) => {
  try {
    const current = getStoredPatientHistory();
    const updated = current.filter((rec) => rec.id !== id);
    localStorage.setItem(PATIENT_HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error deleting patient history record:', err);
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

export const downloadPatientHistoryExcel = (records = []) => {
  const historyList = records.length > 0 ? records : getStoredPatientHistory();

  const totalRevenue = historyList.reduce((acc, r) => {
    const numericCost = Number(String(r.cost || 0).replace(/[^0-9]/g, ''));
    return acc + numericCost;
  }, 0);

  const completedCount = historyList.filter((r) => r.status === 'Completed').length;
  const inProgressCount = historyList.filter((r) => r.status === 'In Progress').length;

  let excelHtml = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>Patient Treatment History</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        body { font-family: Arial, sans-serif; font-size: 12px; }
        .header-title { font-size: 18px; font-weight: bold; color: #0f4c81; text-align: center; }
        .subtitle { font-size: 12px; color: #555555; text-align: center; }
        .meta-label { font-weight: bold; color: #333; }
        .meta-val { color: #0f4c81; font-weight: bold; }
        .section-header { background-color: #0f4c81; color: #ffffff; font-size: 13px; font-weight: bold; padding: 6px; }
        .th-cell { background-color: #e3f2fd; color: #0d47a1; font-weight: bold; border: 1px solid #bbdefb; padding: 8px; text-align: left; }
        .td-cell { border: 1px solid #e0e0e0; padding: 6px; vertical-align: middle; }
        .td-center { text-align: center; }
        .td-right { text-align: right; }
        .row-alt { background-color: #f9f9f9; }
        .badge-completed { font-weight: bold; color: #155724; background-color: #d4edda; text-align: center; }
        .badge-progress { font-weight: bold; color: #856404; background-color: #fff3cd; text-align: center; }
      </style>
    </head>
    <body>
      <table>
        <tr>
          <td colspan="11" class="header-title">PRS DENTAL CARE - PATIENT TREATMENT HISTORY &amp; CLINIC AUDIT REPORT</td>
        </tr>
        <tr>
          <td colspan="11" class="subtitle">Multi-Specialty Dental Clinic &amp; Implant Center • 58/150, Red Hills Road, Kolathur, Chennai - 600099</td>
        </tr>
        <tr><td colspan="11"></td></tr>
        <tr>
          <td colspan="3" class="meta-label">Generated Date &amp; Time:</td>
          <td colspan="8" class="meta-val">${new Date().toLocaleString()}</td>
        </tr>
        <tr>
          <td colspan="3" class="meta-label">Total Patients Logged:</td>
          <td colspan="8" class="meta-val">${historyList.length} Records</td>
        </tr>
        <tr>
          <td colspan="3" class="meta-label">Total Revenue Collected:</td>
          <td colspan="8" class="meta-val" style="color: #155724;">₹${totalRevenue.toLocaleString('en-IN')}</td>
        </tr>
        <tr>
          <td colspan="3" class="meta-label">Completed Procedures:</td>
          <td colspan="8" class="meta-val">${completedCount} Completed | ${inProgressCount} In Progress</td>
        </tr>
        <tr><td colspan="11"></td></tr>

        <!-- TABLE HEADER -->
        <tr>
          <td colspan="11" class="section-header">DETAILED PATIENT TREATMENT &amp; CLINICAL AUDIT LOGS</td>
        </tr>
        <tr>
          <th class="th-cell" style="width: 100px;">Record ID</th>
          <th class="th-cell" style="width: 110px;">Date</th>
          <th class="th-cell" style="width: 180px;">Patient Name</th>
          <th class="th-cell" style="width: 140px;">Phone Number</th>
          <th class="th-cell" style="width: 180px;">Email Address</th>
          <th class="th-cell" style="width: 260px;">Treatment / Procedure</th>
          <th class="th-cell" style="width: 180px;">Attending Specialist</th>
          <th class="th-cell" style="width: 150px;">Time Slot / Duration</th>
          <th class="th-cell" style="width: 110px; text-align: right;">Fee (₹)</th>
          <th class="th-cell" style="width: 110px; text-align: center;">Status</th>
          <th class="th-cell" style="width: 280px;">Clinical Procedure Notes</th>
        </tr>
  `;

  historyList.forEach((rec, idx) => {
    const bgClass = idx % 2 === 1 ? 'row-alt' : '';
    const badgeClass = rec.status === 'Completed' ? 'badge-completed' : 'badge-progress';
    const formattedCost = String(rec.cost || '₹0').startsWith('₹') ? rec.cost : `₹${Number(rec.cost || 0).toLocaleString('en-IN')}`;

    excelHtml += `
      <tr class="${bgClass}">
        <td class="td-cell td-center" style="font-weight: bold; color: #555;">${rec.id}</td>
        <td class="td-cell td-center" style="font-weight: bold;">${rec.treatmentDate}</td>
        <td class="td-cell" style="font-weight: bold; color: #0f4c81;">${rec.patientName}</td>
        <td class="td-cell">${rec.patientPhone || '-'}</td>
        <td class="td-cell">${rec.patientEmail || '-'}</td>
        <td class="td-cell" style="font-weight: bold;">${rec.treatmentName}</td>
        <td class="td-cell">${rec.attendingDoctor}</td>
        <td class="td-cell td-center">${rec.timeSlot || ''} (${rec.duration || '-'})</td>
        <td class="td-cell td-right" style="font-weight: bold; color: #155724;">${formattedCost}</td>
        <td class="td-cell ${badgeClass}">${rec.status}</td>
        <td class="td-cell" style="font-style: italic;">${rec.notes || '-'}</td>
      </tr>
    `;
  });

  excelHtml += `
      </table>
    </body>
    </html>
  `;

  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `PRS_Dental_Patient_Treatment_History_${dateStr}.xls`;

  const blob = new Blob([excelHtml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
