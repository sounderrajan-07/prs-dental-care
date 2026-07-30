const ATTENDANCE_STORAGE_KEY = 'prs_doctor_attendance_v1';

export const CLINIC_DOCTORS = [
  { id: 'doc1', name: 'Dr. P. R. Sundharam', specialization: 'M.D.S - Endodontist & Implantologist', passcode: 'doc123' },
  { id: 'doc2', name: 'Dr. R. Sathya', specialization: 'M.D.S - Cosmetic & Orthodontic Specialist', passcode: 'doc123' },
  { id: 'doc3', name: 'Dr. A. K. Vikram', specialization: 'M.D.S - Oral & Maxillofacial Surgeon', passcode: 'doc123' },
  { id: 'doc4', name: 'Dr. M. Priya', specialization: 'B.D.S - Pediatric Dentist & Preventive Care', passcode: 'doc123' }
];

// Helper to generate seed attendance records for demo
const generateSeedAttendance = () => {
  const records = [];
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-indexed

  // Seed last 15 days of attendance for each doctor
  for (let day = 1; day <= today.getDate(); day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayOfWeek = new Date(year, month, day).getDay();

    if (dayOfWeek === 0) continue; // Skip Sunday clinic closed

    CLINIC_DOCTORS.forEach((doc, idx) => {
      let status = 'Present';
      let checkIn = '09:30 AM';
      let checkOut = '08:00 PM';
      let shift = 'Full Day';
      let remarks = 'On Time';

      if (day % 7 === idx + 1) {
        status = 'Half Day';
        checkIn = '09:30 AM';
        checkOut = '02:00 PM';
        shift = 'Morning Shift';
        remarks = 'Approved half day leave';
      } else if (day % 11 === idx + 2) {
        status = 'Late';
        checkIn = '10:45 AM';
        checkOut = '08:00 PM';
        shift = 'Full Day';
        remarks = 'Emergency traffic delay';
      } else if (day % 13 === idx + 3) {
        status = 'On Leave';
        checkIn = '-';
        checkOut = '-';
        shift = 'Off';
        remarks = 'Medical conference attendance';
      }

      records.push({
        id: `ATT-${doc.id}-${dateStr}`,
        doctorId: doc.id,
        doctorName: doc.name,
        specialization: doc.specialization,
        date: dateStr,
        shift,
        status,
        checkInTime: checkIn,
        checkOutTime: checkOut,
        workingHours: status === 'Present' ? '10.5 hrs' : status === 'Half Day' ? '4.5 hrs' : '0 hrs',
        remarks,
        markedAt: new Date(year, month, day, 9, 30).toISOString()
      });
    });
  }

  return records;
};

export const getStoredAttendance = () => {
  try {
    const raw = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
    if (!raw) {
      const initial = generateSeedAttendance();
      localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : generateSeedAttendance();
  } catch (err) {
    return generateSeedAttendance();
  }
};

export const saveAttendanceEntry = (entryData) => {
  try {
    const current = getStoredAttendance();
    const existingIndex = current.findIndex(
      (item) => item.doctorId === entryData.doctorId && item.date === entryData.date
    );

    const newRecord = {
      id: entryData.id || `ATT-${entryData.doctorId}-${entryData.date}`,
      doctorId: entryData.doctorId,
      doctorName: entryData.doctorName,
      specialization: entryData.specialization || '',
      date: entryData.date,
      shift: entryData.shift || 'Full Day',
      status: entryData.status || 'Present',
      checkInTime: entryData.checkInTime || '09:30 AM',
      checkOutTime: entryData.checkOutTime || '08:00 PM',
      workingHours: entryData.workingHours || (entryData.status === 'Present' ? '10.5 hrs' : '4.5 hrs'),
      remarks: entryData.remarks || '',
      markedAt: new Date().toISOString()
    };

    let updated;
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = newRecord;
    } else {
      updated = [newRecord, ...current];
    }

    localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(updated));
    return newRecord;
  } catch (err) {
    console.error('Error saving attendance:', err);
    return null;
  }
};

export const getAttendanceSummaryByDoctor = (year, monthStr) => {
  const allRecords = getStoredAttendance();
  const filtered = allRecords.filter((rec) => {
    if (!rec.date) return false;
    const [rYear, rMonth] = rec.date.split('-');
    return rYear === String(year) && rMonth === String(monthStr).padStart(2, '0');
  });

  const summaryMap = new Map();
  CLINIC_DOCTORS.forEach((doc) => {
    summaryMap.set(doc.id, {
      doctorId: doc.id,
      doctorName: doc.name,
      specialization: doc.specialization,
      presentCount: 0,
      absentCount: 0,
      halfDayCount: 0,
      lateCount: 0,
      onLeaveCount: 0,
      totalMarkedDays: 0
    });
  });

  filtered.forEach((rec) => {
    const summary = summaryMap.get(rec.doctorId);
    if (summary) {
      summary.totalMarkedDays += 1;
      if (rec.status === 'Present') summary.presentCount += 1;
      else if (rec.status === 'Absent') summary.absentCount += 1;
      else if (rec.status === 'Half Day') summary.halfDayCount += 1;
      else if (rec.status === 'Late') summary.lateCount += 1;
      else if (rec.status === 'On Leave') summary.onLeaveCount += 1;
    }
  });

  return Array.from(summaryMap.values());
};

export const downloadMonthlyAttendanceExcel = (year, monthStr, doctorFilter = 'All') => {
  const allRecords = getStoredAttendance();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthIndex = parseInt(monthStr, 10) - 1;
  const monthLabel = monthNames[monthIndex] || monthStr;

  const filtered = allRecords.filter((rec) => {
    if (!rec.date) return false;
    const [rYear, rMonth] = rec.date.split('-');
    const matchesMonth = rYear === String(year) && rMonth === String(monthStr).padStart(2, '0');
    const matchesDoctor = doctorFilter === 'All' || rec.doctorId === doctorFilter || rec.doctorName === doctorFilter;
    return matchesMonth && matchesDoctor;
  });

  // Sort by date ascending then doctor name
  filtered.sort((a, b) => a.date.localeCompare(b.date) || a.doctorName.localeCompare(b.doctorName));

  // Build CSV content formatted for Excel
  let csvContent = `PRS DENTAL CARE - DOCTORS MONTHLY ATTENDANCE REPORT\n`;
  csvContent += `Report Period: ${monthLabel} ${year}\n`;
  csvContent += `Generated On: ${new Date().toLocaleString()}\n\n`;

  // Summary header
  csvContent += `Doctor Name,Specialization,Total Present,Half Days,Late Arrivals,On Leave,Total Tracked Days\n`;
  const summaryList = getAttendanceSummaryByDoctor(year, monthStr);
  summaryList.forEach((sum) => {
    csvContent += `"${sum.doctorName}","${sum.specialization}",${sum.presentCount},${sum.halfDayCount},${sum.lateCount},${sum.onLeaveCount},${sum.totalMarkedDays}\n`;
  });

  csvContent += `\n\n`;
  csvContent += `DETAILED DAILY ATTENDANCE LOGS\n`;
  csvContent += `Date,Doctor Name,Specialization,Shift,Status,Check-In Time,Check-Out Time,Working Hours,Remarks\n`;

  filtered.forEach((rec) => {
    csvContent += `"${rec.date}","${rec.doctorName}","${rec.specialization}","${rec.shift}","${rec.status}","${rec.checkInTime}","${rec.checkOutTime}","${rec.workingHours}","${rec.remarks.replace(/"/g, '""')}"\n`;
  });

  // Create blob and trigger file download
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `PRS_Dental_Doctors_Attendance_${monthLabel}_${year}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
