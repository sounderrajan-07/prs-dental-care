import { getStoredDoctors } from './doctorStorage';

const ATTENDANCE_STORAGE_KEY = 'prs_doctor_attendance_v1';

export const CLINIC_DOCTORS = getStoredDoctors();

export const getActiveDoctorsList = () => {
  return getStoredDoctors();
};

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

export const downloadMonthlyAttendanceExcel = (year, monthStr, doctorFilter = 'All', format = 'xls') => {
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
  const summaryList = getAttendanceSummaryByDoctor(year, monthStr);

  if (format === 'csv') {
    // Generate perfectly aligned 9-column CSV where Table 1 and Table 2 use matching column positions
    let csvContent = `PRS DENTAL CARE - DOCTORS MONTHLY ATTENDANCE REPORT\n`;
    csvContent += `Report Period: ${monthLabel} ${year}\n`;
    csvContent += `Generated On: ${new Date().toLocaleString()}\n\n`;

    // Table 1 Summary Header aligned to 9 columns
    csvContent += `Period / Date,Doctor Name,Specialization,Shift / Category,Status,Days Present / Check-In,Half Days / Check-Out,Late / Hours,Remarks / Total Days\n`;
    summaryList.forEach((sum) => {
      csvContent += `"${monthLabel} ${year} Summary","${sum.doctorName}","${sum.specialization}","Monthly Summary","Summary",${sum.presentCount},${sum.halfDayCount},${sum.lateCount},"Total Tracked: ${sum.totalMarkedDays} Days (Leaves: ${sum.onLeaveCount})"\n`;
    });

    csvContent += `\n\n`;
    csvContent += `DETAILED DAILY ATTENDANCE LOGS\n`;
    csvContent += `Date,Doctor Name,Specialization,Shift,Status,Check-In Time,Check-Out Time,Working Hours,Remarks\n`;

    filtered.forEach((rec) => {
      csvContent += `"${rec.date}","${rec.doctorName}","${rec.specialization}","${rec.shift}","${rec.status}","${rec.checkInTime}","${rec.checkOutTime}","${rec.workingHours}","${rec.remarks.replace(/"/g, '""')}"\n`;
    });

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `PRS_Dental_Attendance_${monthLabel}_${year}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  // Format = 'xls' -> HTML Spreadsheet format supported natively by Excel with custom colors, auto column widths & cell borders
  let excelHtml = `
  <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <!--[if gte mso 9]>
    <xml>
      <x:ExcelWorkbook>
        <x:ExcelWorksheets>
          <x:ExcelWorksheet>
            <x:Name>Monthly Attendance Report</x:Name>
            <x:WorksheetOptions>
              <x:DisplayGridlines/>
            </x:WorksheetOptions>
          </x:ExcelWorksheet>
        </x:ExcelWorksheets>
      </x:ExcelWorkbook>
    </xml>
    <![endif]-->
    <style>
      body { font-family: 'Segoe UI', Arial, sans-serif; }
      .title-cell { font-size: 16pt; font-weight: bold; color: #0f4c81; padding: 10px 0; }
      .meta-label { font-size: 10pt; font-weight: bold; color: #495057; }
      .meta-val { font-size: 10pt; color: #212529; }
      .section-header { font-size: 12pt; font-weight: bold; background-color: #0f4c81; color: #ffffff; padding: 8px 12px; }
      .th-cell { background-color: #1d70b8; color: #ffffff; font-weight: bold; font-size: 10pt; text-align: center; border: 1px solid #0f4c81; padding: 8px; }
      .td-cell { font-size: 10pt; border: 1px solid #dee2e6; padding: 6px 10px; vertical-align: middle; }
      .td-center { text-align: center; }
      .td-right { text-align: right; }
      .badge-present { background-color: #d4edda; color: #155724; font-weight: bold; text-align: center; border-radius: 4px; }
      .badge-half { background-color: #fff3cd; color: #856404; font-weight: bold; text-align: center; border-radius: 4px; }
      .badge-late { background-color: #d1ecf1; color: #0c5460; font-weight: bold; text-align: center; border-radius: 4px; }
      .badge-leave { background-color: #f8d7da; color: #721c24; font-weight: bold; text-align: center; border-radius: 4px; }
      .row-alt { background-color: #f8f9fa; }
    </style>
  </head>
  <body>
    <table>
      <tr>
        <td colspan="9" class="title-cell">PRS DENTAL CARE - DOCTORS MONTHLY ATTENDANCE REPORT</td>
      </tr>
      <tr>
        <td colspan="2" class="meta-label">Report Period:</td>
        <td colspan="7" class="meta-val">${monthLabel} ${year}</td>
      </tr>
      <tr>
        <td colspan="2" class="meta-label">Generated On:</td>
        <td colspan="7" class="meta-val">${new Date().toLocaleString()}</td>
      </tr>
      <tr><td colspan="9"></td></tr>

      <!-- SECTION 1: SUMMARY TABLE -->
      <tr>
        <td colspan="9" class="section-header">1. MONTHLY DOCTOR ATTENDANCE SUMMARY</td>
      </tr>
      <tr>
        <th class="th-cell" style="width: 110px;">Period</th>
        <th class="th-cell" style="width: 200px;">Doctor Name</th>
        <th class="th-cell" style="width: 240px;">Specialization</th>
        <th class="th-cell" style="width: 100px;">Days Present</th>
        <th class="th-cell" style="width: 100px;">Half Days</th>
        <th class="th-cell" style="width: 100px;">Late Arrivals</th>
        <th class="th-cell" style="width: 100px;">On Leave</th>
        <th class="th-cell" style="width: 120px;">Total Days Tracked</th>
        <th class="th-cell" style="width: 200px;">Performance Summary</th>
      </tr>
  `;

  summaryList.forEach((sum, idx) => {
    const bgClass = idx % 2 === 1 ? 'row-alt' : '';
    excelHtml += `
      <tr class="${bgClass}">
        <td class="td-cell td-center">${monthLabel} ${year}</td>
        <td class="td-cell" style="font-weight: bold; color: #0f4c81;">${sum.doctorName}</td>
        <td class="td-cell">${sum.specialization}</td>
        <td class="td-cell td-center" style="font-weight: bold; color: #155724;">${sum.presentCount}</td>
        <td class="td-cell td-center" style="font-weight: bold; color: #856404;">${sum.halfDayCount}</td>
        <td class="td-cell td-center" style="font-weight: bold; color: #0c5460;">${sum.lateCount}</td>
        <td class="td-cell td-center" style="font-weight: bold; color: #721c24;">${sum.onLeaveCount}</td>
        <td class="td-cell td-center" style="font-weight: bold;">${sum.totalMarkedDays}</td>
        <td class="td-cell">Attendance Rate: ${Math.round(((sum.presentCount + sum.halfDayCount * 0.5) / Math.max(1, sum.totalMarkedDays)) * 100)}%</td>
      </tr>
    `;
  });

  excelHtml += `
      <tr><td colspan="9"></td></tr>
      <tr><td colspan="9"></td></tr>

      <!-- SECTION 2: DETAILED DAILY LOGS -->
      <tr>
        <td colspan="9" class="section-header">2. DETAILED DAILY ATTENDANCE LOGS</td>
      </tr>
      <tr>
        <th class="th-cell" style="width: 110px;">Date</th>
        <th class="th-cell" style="width: 200px;">Doctor Name</th>
        <th class="th-cell" style="width: 240px;">Specialization</th>
        <th class="th-cell" style="width: 120px;">Shift</th>
        <th class="th-cell" style="width: 110px;">Status</th>
        <th class="th-cell" style="width: 110px;">Check-In Time</th>
        <th class="th-cell" style="width: 110px;">Check-Out Time</th>
        <th class="th-cell" style="width: 110px;">Working Hours</th>
        <th class="th-cell" style="width: 220px;">Remarks</th>
      </tr>
  `;

  filtered.forEach((rec, idx) => {
    const bgClass = idx % 2 === 1 ? 'row-alt' : '';
    const badgeClass =
      rec.status === 'Present'
        ? 'badge-present'
        : rec.status === 'Half Day'
        ? 'badge-half'
        : rec.status === 'Late'
        ? 'badge-late'
        : 'badge-leave';

    excelHtml += `
      <tr class="${bgClass}">
        <td class="td-cell td-center" style="font-weight: bold;">${rec.date}</td>
        <td class="td-cell" style="font-weight: bold;">${rec.doctorName}</td>
        <td class="td-cell">${rec.specialization}</td>
        <td class="td-cell td-center">${rec.shift}</td>
        <td class="td-cell ${badgeClass}">${rec.status}</td>
        <td class="td-cell td-center">${rec.checkInTime}</td>
        <td class="td-cell td-center">${rec.checkOutTime}</td>
        <td class="td-cell td-center" style="font-weight: bold;">${rec.workingHours}</td>
        <td class="td-cell">${rec.remarks || '-'}</td>
      </tr>
    `;
  });

  excelHtml += `
    </table>
  </body>
  </html>
  `;

  const blob = new Blob([excelHtml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `PRS_Dental_Doctors_Attendance_${monthLabel}_${year}.xls`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
