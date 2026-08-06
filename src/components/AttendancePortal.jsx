import React, { useState, useEffect } from 'react';
import {
  getStoredAttendance,
  saveAttendanceEntry,
  updateAttendanceEntry,
  deleteAttendanceEntry,
  calculateWorkingHours,
  getAttendanceSummaryByDoctor,
  downloadMonthlyAttendanceExcel
} from '../utils/attendanceStorage';
import { getStoredDoctors } from '../utils/doctorStorage';

export default function AttendancePortal({ onLogout }) {
  const [doctorsList, setDoctorsList] = useState(() => getStoredDoctors());
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(String(new Date().getMonth() + 1).padStart(2, '0'));
  const [selectedDoctorFilter, setSelectedDoctorFilter] = useState('All');

  // Form State for marking daily attendance
  const [formDoctorId, setFormDoctorId] = useState(() => getStoredDoctors()[0]?.id || 'doc1');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formShift, setFormShift] = useState('Full Day');
  const [formStatus, setFormStatus] = useState('Present');
  const [formCheckIn, setFormCheckIn] = useState('09:30 AM');
  const [formCheckOut, setFormCheckOut] = useState('08:00 PM');
  const [formRemarks, setFormRemarks] = useState('On Time');
  const [successMessage, setSuccessMessage] = useState('');

  // Edit Modal State
  const [editingAttendance, setEditingAttendance] = useState(null);
  const [editDoctorId, setEditDoctorId] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editShift, setEditShift] = useState('Full Day');
  const [editStatus, setEditStatus] = useState('Present');
  const [editCheckIn, setEditCheckIn] = useState('09:30 AM');
  const [editCheckOut, setEditCheckOut] = useState('08:00 PM');
  const [editRemarks, setEditRemarks] = useState('');

  const loadAttendance = () => {
    const data = getStoredAttendance();
    setAttendanceRecords(data);
    const docs = getStoredDoctors();
    setDoctorsList(docs);
  };

  useEffect(() => {
    loadAttendance();
    window.addEventListener('prs_doctors_updated', loadAttendance);
    return () => window.removeEventListener('prs_doctors_updated', loadAttendance);
  }, []);

  const handleMarkAttendance = (e) => {
    e.preventDefault();
    const docObj = doctorsList.find((d) => d.id === formDoctorId) || doctorsList[0];

    const checkInTime = formStatus === 'On Leave' || formStatus === 'Absent' ? '-' : formCheckIn;
    const checkOutTime = formStatus === 'On Leave' || formStatus === 'Absent' ? '-' : formCheckOut;
    const workingHours = calculateWorkingHours(checkInTime, checkOutTime, formStatus);

    saveAttendanceEntry({
      doctorId: docObj.id,
      doctorName: docObj.name,
      specialization: docObj.specialization,
      date: formDate,
      shift: formShift,
      status: formStatus,
      checkInTime,
      checkOutTime,
      workingHours,
      remarks: formRemarks
    });

    loadAttendance();
    setSuccessMessage(`✓ Attendance recorded for ${docObj.name} on ${formDate}`);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const handleOpenEditModal = (rec) => {
    setEditingAttendance(rec);
    setEditDoctorId(rec.doctorId || doctorsList[0]?.id || 'doc1');
    setEditDate(rec.date || new Date().toISOString().split('T')[0]);
    setEditShift(rec.shift || 'Full Day');
    setEditStatus(rec.status || 'Present');
    setEditCheckIn(rec.checkInTime || '09:30 AM');
    setEditCheckOut(rec.checkOutTime || '08:00 PM');
    setEditRemarks(rec.remarks || '');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingAttendance) return;

    const docObj = doctorsList.find((d) => d.id === editDoctorId) || doctorsList[0];
    const checkInTime = editStatus === 'On Leave' || editStatus === 'Absent' ? '-' : editCheckIn;
    const checkOutTime = editStatus === 'On Leave' || editStatus === 'Absent' ? '-' : editCheckOut;
    const workingHours = calculateWorkingHours(checkInTime, checkOutTime, editStatus);

    updateAttendanceEntry(editingAttendance.id, {
      doctorId: docObj.id,
      doctorName: docObj.name,
      specialization: docObj.specialization,
      date: editDate,
      shift: editShift,
      status: editStatus,
      checkInTime,
      checkOutTime,
      workingHours,
      remarks: editRemarks
    });

    setEditingAttendance(null);
    loadAttendance();
    setSuccessMessage(`✓ Attendance record updated for ${docObj.name}`);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const handleDeleteAttendance = (rec) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete the attendance log for ${rec.doctorName} on ${rec.date}?`
    );
    if (!isConfirmed) return;

    deleteAttendanceEntry(rec.id);
    loadAttendance();
    setSuccessMessage(`✓ Attendance log deleted for ${rec.doctorName}`);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const handleExportExcel = (format = 'xls') => {
    downloadMonthlyAttendanceExcel(selectedYear, selectedMonth, selectedDoctorFilter, format);
  };

  // Filter records for table
  const filteredRecords = attendanceRecords.filter((rec) => {
    if (!rec.date) return false;
    const [rYear, rMonth] = rec.date.split('-');
    const matchesMonth = rYear === String(selectedYear) && rMonth === String(selectedMonth).padStart(2, '0');
    const matchesDoctor = selectedDoctorFilter === 'All' || rec.doctorId === selectedDoctorFilter;
    return matchesMonth && matchesDoctor;
  });

  const doctorSummaries = getAttendanceSummaryByDoctor(selectedYear, selectedMonth);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Attendance Header */}
      <div className="bg-surface-container border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-secondary/10 text-secondary border border-secondary/20 flex items-center justify-center font-bold text-2xl">
            <span className="material-symbols-outlined text-3xl">calendar_month</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                Staff & Doctor Attendance Portal
              </span>
              <span className="text-xs text-on-surface-variant">• Monthly Payroll Tracking</span>
            </div>
            <h2 className="text-2xl font-bold font-serif text-on-surface mt-0.5">PRS Dental Doctors Attendance Tracker</h2>
            <p className="text-xs text-on-surface-variant font-medium">Daily attendance logging & Excel spreadsheet report generator</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleExportExcel('xls')}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">table_chart</span>
            <span>Download Formatted Excel (.xls)</span>
          </button>
          <button
            onClick={() => handleExportExcel('csv')}
            className="px-3.5 py-2.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-bold text-xs rounded-xl border border-outline transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">file_download</span>
            <span>Aligned CSV (.csv)</span>
          </button>
          {onLogout && (
            <button
              onClick={onLogout}
              className="px-3.5 py-2.5 border border-outline rounded-xl text-xs font-semibold hover:bg-surface-container-high transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-base">logout</span>
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-semibold rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Grid: Left = Mark Attendance Form, Right = Monthly Doctor Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Mark Attendance Card */}
        <div className="lg:col-span-5 bg-surface-container rounded-2xl border border-outline-variant p-6 shadow-sm space-y-4">
          <div className="border-b border-outline-variant pb-3">
            <h3 className="text-lg font-bold font-serif text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-xl text-primary">edit_calendar</span>
              <span>Mark Daily Doctor Attendance</span>
            </h3>
            <p className="text-xs text-on-surface-variant mt-0.5">Select doctor, date, and shift time to log entry.</p>
          </div>

          <form onSubmit={handleMarkAttendance} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-on-surface-variant uppercase">Select Doctor</label>
              <select
                value={formDoctorId}
                onChange={(e) => setFormDoctorId(e.target.value)}
                className="w-full mt-1 p-2.5 rounded-xl border border-outline bg-surface text-sm font-semibold text-on-surface outline-none focus:ring-2 focus:ring-primary"
              >
                {doctorsList.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} ({doc.specialization})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-on-surface-variant uppercase">Date</label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full mt-1 p-2 rounded-xl border border-outline bg-surface text-xs font-semibold outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-on-surface-variant uppercase">Shift</label>
                <select
                  value={formShift}
                  onChange={(e) => setFormShift(e.target.value)}
                  className="w-full mt-1 p-2 rounded-xl border border-outline bg-surface text-xs font-semibold outline-none"
                >
                  <option value="Full Day">Full Day (09:30 AM - 08:00 PM)</option>
                  <option value="Morning Shift">Morning Shift (09:30 AM - 02:00 PM)</option>
                  <option value="Evening Shift">Evening Shift (04:00 PM - 08:30 PM)</option>
                  <option value="Off">Off Day</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-bold text-on-surface-variant uppercase">Attendance Status</label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {['Present', 'Half Day', 'Late', 'On Leave', 'Absent'].map((statusOption) => (
                  <button
                    key={statusOption}
                    type="button"
                    onClick={() => setFormStatus(statusOption)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border ${
                      formStatus === statusOption
                        ? 'bg-primary text-on-primary border-primary shadow-xs'
                        : 'border-outline text-on-surface-variant hover:text-on-surface bg-surface'
                    }`}
                  >
                    {statusOption}
                  </button>
                ))}
              </div>
            </div>

            {formStatus !== 'On Leave' && formStatus !== 'Absent' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-on-surface-variant uppercase">Check-In Time</label>
                  <input
                    type="text"
                    value={formCheckIn}
                    onChange={(e) => setFormCheckIn(e.target.value)}
                    placeholder="09:30 AM"
                    className="w-full mt-1 p-2 rounded-xl border border-outline bg-surface text-xs font-semibold outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-on-surface-variant uppercase">Check-Out Time</label>
                  <input
                    type="text"
                    value={formCheckOut}
                    onChange={(e) => setFormCheckOut(e.target.value)}
                    placeholder="08:00 PM"
                    className="w-full mt-1 p-2 rounded-xl border border-outline bg-surface text-xs font-semibold outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="font-bold text-on-surface-variant uppercase">Remarks / Notes</label>
              <input
                type="text"
                value={formRemarks}
                onChange={(e) => setFormRemarks(e.target.value)}
                placeholder="e.g. On time, Emergency surgery delay..."
                className="w-full mt-1 p-2.5 rounded-xl border border-outline bg-surface text-xs outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary text-on-primary font-bold rounded-xl hover:bg-primary-hover shadow-md transition-all text-xs uppercase tracking-wider"
            >
              ✓ Save Attendance Record
            </button>
          </form>
        </div>

        {/* Doctor Attendance Summary Cards */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-surface-container rounded-2xl border border-outline-variant p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-outline-variant">
              <div>
                <h3 className="text-lg font-bold font-serif text-on-surface">Monthly Doctor Attendance Summary</h3>
                <p className="text-xs text-on-surface-variant">Real-time attendance tallies for selected month</p>
              </div>

              {/* Month & Year Controls */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-outline bg-surface text-xs font-bold outline-none"
                >
                  <option value="01">January</option>
                  <option value="02">February</option>
                  <option value="03">March</option>
                  <option value="04">April</option>
                  <option value="05">May</option>
                  <option value="06">June</option>
                  <option value="07">July</option>
                  <option value="08">August</option>
                  <option value="09">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>

                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="px-3 py-1.5 rounded-xl border border-outline bg-surface text-xs font-bold outline-none"
                >
                  <option value={2026}>2026</option>
                  <option value={2025}>2025</option>
                </select>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="space-y-3">
              {doctorSummaries.map((summary) => (
                <div
                  key={summary.doctorId}
                  className="p-4 bg-surface rounded-xl border border-outline-variant/80 flex flex-wrap gap-4 items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold text-sm text-on-surface">{summary.doctorName}</h4>
                    <p className="text-[11px] text-on-surface-variant">{summary.specialization}</p>
                  </div>

                  <div className="flex items-center gap-3 text-center">
                    <div className="px-2.5 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                      <span className="block text-[10px] text-emerald-700 dark:text-emerald-300 uppercase font-bold">Present</span>
                      <span className="font-extrabold text-sm text-emerald-700 dark:text-emerald-300">{summary.presentCount}</span>
                    </div>

                    <div className="px-2.5 py-1 bg-amber-500/10 rounded-lg border border-amber-500/20">
                      <span className="block text-[10px] text-amber-700 dark:text-amber-300 uppercase font-bold">Half Day</span>
                      <span className="font-extrabold text-sm text-amber-700 dark:text-amber-300">{summary.halfDayCount}</span>
                    </div>

                    <div className="px-2.5 py-1 bg-sky-500/10 rounded-lg border border-sky-500/20">
                      <span className="block text-[10px] text-sky-700 dark:text-sky-300 uppercase font-bold">Late</span>
                      <span className="font-extrabold text-sm text-sky-700 dark:text-sky-300">{summary.lateCount}</span>
                    </div>

                    <div className="px-2.5 py-1 bg-rose-500/10 rounded-lg border border-rose-500/20">
                      <span className="block text-[10px] text-rose-700 dark:text-rose-300 uppercase font-bold">Leave</span>
                      <span className="font-extrabold text-sm text-rose-700 dark:text-rose-300">{summary.onLeaveCount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Attendance History Table with Edit & Delete Actions */}
      <div className="bg-surface-container rounded-2xl border border-outline-variant p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold font-serif text-on-surface">Detailed Attendance Logs</h3>
            <p className="text-xs text-on-surface-variant">Day-by-day check-in & check-out records</p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedDoctorFilter}
              onChange={(e) => setSelectedDoctorFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-outline bg-surface text-xs font-semibold outline-none"
            >
              <option value="All">All Doctors</option>
              {doctorsList.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-outline-variant">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container-high text-on-surface font-bold uppercase tracking-wider text-[11px] border-b border-outline-variant">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Doctor Name</th>
                <th className="py-3 px-4">Shift</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Check-In</th>
                <th className="py-3 px-4">Check-Out</th>
                <th className="py-3 px-4">Hours</th>
                <th className="py-3 px-4">Remarks</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/60 bg-surface">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-8 text-center text-on-surface-variant italic">
                    No attendance records logged for this period. Use form above to add daily attendance.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="py-3 px-4 font-semibold text-on-surface">{rec.date}</td>
                    <td className="py-3 px-4 font-bold text-primary">{rec.doctorName}</td>
                    <td className="py-3 px-4">{rec.shift}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] border ${
                          rec.status === 'Present'
                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20'
                            : rec.status === 'Half Day'
                            ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20'
                            : rec.status === 'Late'
                            ? 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20'
                            : 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20'
                        }`}
                      >
                        {rec.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium">{rec.checkInTime}</td>
                    <td className="py-3 px-4 font-medium">{rec.checkOutTime}</td>
                    <td className="py-3 px-4 font-semibold">{calculateWorkingHours(rec.checkInTime, rec.checkOutTime, rec.status)}</td>
                    <td className="py-3 px-4 text-on-surface-variant italic">{rec.remarks || '-'}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(rec)}
                          className="px-2.5 py-1 border border-outline rounded-lg text-xs font-semibold hover:bg-surface-container-high text-on-surface transition-colors flex items-center gap-1"
                          title="Edit Attendance Log"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteAttendance(rec)}
                          className="px-2.5 py-1 bg-rose-500/10 text-rose-700 dark:text-rose-300 hover:bg-rose-500/20 font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                          title="Delete Attendance Log"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Attendance Record Modal */}
      {editingAttendance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-surface rounded-2xl border border-outline-variant max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-outline-variant pb-3">
              <h3 className="text-lg font-bold font-serif text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">edit_calendar</span>
                <span>Edit Attendance Log - {editingAttendance.doctorName}</span>
              </h3>
              <button onClick={() => setEditingAttendance(null)} className="text-on-surface-variant hover:text-on-surface font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-on-surface-variant uppercase">Doctor Name</label>
                <select
                  value={editDoctorId}
                  onChange={(e) => setEditDoctorId(e.target.value)}
                  className="w-full mt-1 p-2 rounded-xl border border-outline bg-surface text-xs font-semibold outline-none"
                >
                  {doctorsList.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.specialization})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-on-surface-variant uppercase">Date</label>
                  <input
                    type="date"
                    required
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full mt-1 p-2 rounded-xl border border-outline bg-surface text-xs font-semibold outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-on-surface-variant uppercase">Shift</label>
                  <select
                    value={editShift}
                    onChange={(e) => setEditShift(e.target.value)}
                    className="w-full mt-1 p-2 rounded-xl border border-outline bg-surface text-xs font-semibold outline-none"
                  >
                    <option value="Full Day">Full Day (09:30 AM - 08:00 PM)</option>
                    <option value="Morning Shift">Morning Shift (09:30 AM - 02:00 PM)</option>
                    <option value="Evening Shift">Evening Shift (04:00 PM - 08:30 PM)</option>
                    <option value="Off">Off Day</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-on-surface-variant uppercase">Attendance Status</label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {['Present', 'Half Day', 'Late', 'On Leave', 'Absent'].map((statusOption) => (
                    <button
                      key={statusOption}
                      type="button"
                      onClick={() => setEditStatus(statusOption)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border ${
                        editStatus === statusOption
                          ? 'bg-primary text-on-primary border-primary shadow-xs'
                          : 'border-outline text-on-surface-variant hover:text-on-surface bg-surface'
                      }`}
                    >
                      {statusOption}
                    </button>
                  ))}
                </div>
              </div>

              {editStatus !== 'On Leave' && editStatus !== 'Absent' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-on-surface-variant uppercase">Check-In Time</label>
                    <input
                      type="text"
                      value={editCheckIn}
                      onChange={(e) => setEditCheckIn(e.target.value)}
                      placeholder="09:30 AM"
                      className="w-full mt-1 p-2 rounded-xl border border-outline bg-surface text-xs font-semibold outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-on-surface-variant uppercase">Check-Out Time</label>
                    <input
                      type="text"
                      value={editCheckOut}
                      onChange={(e) => setEditCheckOut(e.target.value)}
                      placeholder="08:00 PM"
                      className="w-full mt-1 p-2 rounded-xl border border-outline bg-surface text-xs font-semibold outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="font-bold text-on-surface-variant uppercase">Remarks / Notes</label>
                <input
                  type="text"
                  value={editRemarks}
                  onChange={(e) => setEditRemarks(e.target.value)}
                  placeholder="Notes or reasons..."
                  className="w-full mt-1 p-2.5 rounded-xl border border-outline bg-surface text-xs outline-none"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setEditingAttendance(null)}
                  className="px-4 py-2 border border-outline rounded-xl font-semibold hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-on-primary font-bold rounded-xl hover:bg-primary-hover shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
