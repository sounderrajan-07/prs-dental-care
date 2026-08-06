import React, { useState, useEffect } from 'react';
import {
  getStoredPatientHistory,
  savePatientHistoryRecord,
  updatePatientHistoryRecord,
  deletePatientHistoryRecord,
  getPatientHistoryStats
} from '../utils/patientHistoryStorage';
import { getStoredDoctors } from '../utils/doctorStorage';
import InvoiceRxGeneratorModal from './InvoiceRxGeneratorModal';
import AdminFeedbackModeration from './AdminFeedbackModeration';
import AdminDoctorManagement from './AdminDoctorManagement';

export default function AdminHistoryPortal({ onLogout }) {
  const [doctorsList, setDoctorsList] = useState(() => getStoredDoctors());
  const [historyRecords, setHistoryRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // New Patient Record Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPatientName, setNewPatientName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newTreatment, setNewTreatment] = useState('Root Canal Treatment');
  const [newDoctor, setNewDoctor] = useState(() => getStoredDoctors()[0]?.name || 'Dr. Purushotham');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTimeSlot, setNewTimeSlot] = useState('10:00 AM - 11:00 AM');
  const [newDuration, setNewDuration] = useState('45 mins');
  const [newCost, setNewCost] = useState('₹4,500');
  const [newNotes, setNewNotes] = useState('');

  // Edit Patient Record Form State
  const [editingRecord, setEditingRecord] = useState(null);
  const [editPatientName, setEditPatientName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editTreatment, setEditTreatment] = useState('');
  const [editDoctor, setEditDoctor] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editTimeSlot, setEditTimeSlot] = useState('');
  const [editDuration, setEditDuration] = useState('45 mins');
  const [editCost, setEditCost] = useState('');
  const [editStatus, setEditStatus] = useState('Completed');
  const [editNotes, setEditNotes] = useState('');

  // Rx & Invoice Modal State
  const [activeModalData, setActiveModalData] = useState(null);

  const loadDoctors = () => {
    setDoctorsList(getStoredDoctors());
  };

  const loadHistory = () => {
    const data = getStoredPatientHistory();
    setHistoryRecords(data);
  };

  useEffect(() => {
    loadHistory();
    loadDoctors();
    window.addEventListener('prs_doctors_updated', loadDoctors);
    return () => window.removeEventListener('prs_doctors_updated', loadDoctors);
  }, []);

  const stats = getPatientHistoryStats();

  const handleAddRecord = (e) => {
    e.preventDefault();
    const docObj = doctorsList.find((d) => d.name === newDoctor) || doctorsList[0] || { name: newDoctor, specialization: 'Specialist' };

    savePatientHistoryRecord({
      patientName: newPatientName,
      patientPhone: newPhone,
      patientEmail: newEmail,
      treatmentName: newTreatment,
      attendingDoctor: docObj.name,
      doctorSpecialization: docObj.specialization,
      treatmentDate: newDate,
      timeSlot: newTimeSlot,
      duration: newDuration,
      cost: newCost,
      status: 'Completed',
      notes: newNotes || 'Treatment administered successfully with routine care guidelines.'
    });

    loadHistory();
    setShowAddModal(false);

    // Reset form
    setNewPatientName('');
    setNewPhone('');
    setNewNotes('');
  };

  const handleOpenEditModal = (rec) => {
    setEditingRecord(rec);
    setEditPatientName(rec.patientName || '');
    setEditPhone(rec.patientPhone || '');
    setEditEmail(rec.patientEmail || '');
    setEditTreatment(rec.treatmentName || '');
    setEditDoctor(rec.attendingDoctor || doctorsList[0]?.name || '');
    setEditDate(rec.treatmentDate || new Date().toISOString().split('T')[0]);
    setEditTimeSlot(rec.timeSlot || '10:00 AM - 11:00 AM');
    setEditDuration(rec.duration || '45 mins');
    setEditCost(rec.cost || '₹0');
    setEditStatus(rec.status || 'Completed');
    setEditNotes(rec.notes || '');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingRecord) return;

    const docObj = doctorsList.find((d) => d.name === editDoctor) || { name: editDoctor, specialization: 'Specialist' };

    updatePatientHistoryRecord(editingRecord.id, {
      patientName: editPatientName,
      patientPhone: editPhone,
      patientEmail: editEmail,
      treatmentName: editTreatment,
      attendingDoctor: docObj.name,
      doctorSpecialization: docObj.specialization,
      treatmentDate: editDate,
      timeSlot: editTimeSlot,
      duration: editDuration,
      cost: editCost,
      status: editStatus,
      notes: editNotes
    });

    setEditingRecord(null);
    loadHistory();
  };

  const handleDeleteRecord = (rec) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete treatment history record for ${rec.patientName}?`
    );
    if (!confirmed) return;

    deletePatientHistoryRecord(rec.id);
    loadHistory();
  };

  const handleExportBackup = () => {
    try {
      const backupData = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        appointments: JSON.parse(localStorage.getItem('prs_dental_appointments_v2') || '[]'),
        treatmentHistory: JSON.parse(localStorage.getItem('prs_patient_treatment_history_v2') || '[]'),
        attendance: JSON.parse(localStorage.getItem('prs_doctor_attendance_v1') || '[]'),
        doctors: JSON.parse(localStorage.getItem('prs_clinic_doctors_v2') || '[]')
      };

      const dateStr = new Date().toISOString().split('T')[0];
      const filename = `PRS_Dental_Clinic_Backup_${dateStr}.json`;

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', filename);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      alert(`✓ Full Clinic Database Backup (${filename}) exported successfully!`);
    } catch (err) {
      console.error('Export backup failed:', err);
      alert('Failed to export backup data.');
    }
  };

  const handleImportBackup = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (!imported.appointments && !imported.treatmentHistory && !imported.attendance) {
          alert('Invalid backup file structure.');
          return;
        }

        if (window.confirm('Are you sure you want to restore clinic data from this backup? Existing data will be merged/updated.')) {
          if (imported.appointments) localStorage.setItem('prs_dental_appointments_v2', JSON.stringify(imported.appointments));
          if (imported.treatmentHistory) localStorage.setItem('prs_patient_treatment_history_v2', JSON.stringify(imported.treatmentHistory));
          if (imported.attendance) localStorage.setItem('prs_doctor_attendance_v1', JSON.stringify(imported.attendance));
          if (imported.doctors) localStorage.setItem('prs_clinic_doctors_v2', JSON.stringify(imported.doctors));

          loadHistory();
          window.dispatchEvent(new Event('prs_history_updated'));
          window.dispatchEvent(new Event('prs_appointments_updated'));
          window.dispatchEvent(new Event('prs_doctors_updated'));

          alert('✓ Clinic database successfully restored from backup!');
        }
      } catch (err) {
        console.error('Import backup failed:', err);
        alert('Error parsing backup JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  // Filter patient history records
  const filteredHistory = historyRecords.filter((rec) => {
    if (doctorFilter !== 'All' && rec.attendingDoctor !== doctorFilter) return false;
    if (statusFilter !== 'All' && rec.status !== statusFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = rec.patientName?.toLowerCase().includes(q);
      const matchPhone = rec.patientPhone?.includes(q);
      const matchTreatment = rec.treatmentName?.toLowerCase().includes(q);
      const matchDoctor = rec.attendingDoctor?.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchTreatment && !matchDoctor) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Admin Header Banner */}
      <div className="bg-surface-container border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-2xl">
            <span className="material-symbols-outlined text-3xl">admin_panel_settings</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                Clinic Master Admin Portal
              </span>
              <span className="text-xs text-on-surface-variant">• Patient History & Analytics</span>
            </div>
            <h2 className="text-2xl font-bold font-serif text-on-surface mt-0.5">PRS Dental Clinic Administration Suite</h2>
            <p className="text-xs text-on-surface-variant font-medium">Manage complete patient history, procedure durations, attending doctors & revenue</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportBackup}
            className="px-3.5 py-2.5 border border-outline bg-surface rounded-xl text-xs font-bold text-on-surface hover:bg-surface-container-high transition-colors flex items-center gap-1.5 shadow-xs"
            title="Download full clinic database backup JSON file"
          >
            <span className="material-symbols-outlined text-base">download_for_offline</span>
            <span>Export Backup</span>
          </button>

          <label
            className="px-3.5 py-2.5 border border-outline bg-surface rounded-xl text-xs font-bold text-on-surface hover:bg-surface-container-high transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            title="Restore clinic database from backup JSON file"
          >
            <span className="material-symbols-outlined text-base">upload_file</span>
            <span>Restore Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-primary text-on-primary font-bold text-xs rounded-xl hover:bg-primary-hover shadow-md transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>Add Patient History</span>
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

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-surface-container rounded-2xl border border-primary/30 bg-primary/5 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-primary uppercase">Total Clinic Revenue</span>
            <div className="text-2xl font-extrabold text-primary mt-1">{stats.totalRevenue}</div>
            <span className="text-[11px] text-on-surface-variant">Tracked Treatments</span>
          </div>
          <span className="material-symbols-outlined text-3xl text-primary">payments</span>
        </div>

        <div className="p-5 bg-surface-container rounded-2xl border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase">Completed Procedures</span>
            <div className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300 mt-1">{stats.completedCount}</div>
            <span className="text-[11px] text-on-surface-variant">Successful Patients</span>
          </div>
          <span className="material-symbols-outlined text-3xl text-emerald-600">task_alt</span>
        </div>

        <div className="p-5 bg-surface-container rounded-2xl border border-amber-500/30 bg-amber-500/5 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase">In Progress Treatments</span>
            <div className="text-2xl font-extrabold text-amber-700 dark:text-amber-300 mt-1">{stats.inProgressCount}</div>
            <span className="text-[11px] text-on-surface-variant">Ongoing Sittings</span>
          </div>
          <span className="material-symbols-outlined text-3xl text-amber-600">hourglass_top</span>
        </div>

        <div className="p-5 bg-surface-container rounded-2xl border border-secondary/30 bg-secondary/5 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-secondary uppercase">Active Doctors</span>
            <div className="text-2xl font-extrabold text-secondary mt-1">{doctorsList.length}</div>
            <span className="text-[11px] text-on-surface-variant">Specialist Consultants</span>
          </div>
          <span className="material-symbols-outlined text-3xl text-secondary">stethoscope</span>
        </div>
      </div>

      {/* Main Patient History Management Table */}
      <div className="bg-surface-container rounded-2xl border border-outline-variant p-6 shadow-sm space-y-4">
        
        {/* Table Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between pb-3 border-b border-outline-variant">
          <div>
            <h3 className="text-lg font-bold font-serif text-on-surface">Patient Treatment History Log</h3>
            <p className="text-xs text-on-surface-variant">Detailed procedure log with duration, attending doctor & clinical notes</p>
          </div>

          <div className="flex flex-wrap gap-3 items-center w-full md:w-auto">
            {/* Search input */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patient, phone, doctor..."
              className="px-3.5 py-1.5 rounded-xl border border-outline bg-surface text-xs outline-none focus:ring-2 focus:ring-primary w-full md:w-60"
            />

            {/* Doctor Filter */}
            <select
              value={doctorFilter}
              onChange={(e) => setDoctorFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-outline bg-surface text-xs font-semibold outline-none"
            >
              <option value="All">All Attending Doctors</option>
              {doctorsList.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-outline bg-surface text-xs font-semibold outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-outline-variant">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container-high text-on-surface font-bold uppercase tracking-wider text-[11px] border-b border-outline-variant">
              <tr>
                <th className="py-3 px-4">Patient Name & Contact</th>
                <th className="py-3 px-4">Treatment / Procedure</th>
                <th className="py-3 px-4">Attending Doctor</th>
                <th className="py-3 px-4">Date & Time Slot</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Fee Charged</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/60 bg-surface">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-on-surface-variant italic">
                    No treatment history records found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((rec) => (
                  <tr key={rec.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-on-surface">{rec.patientName}</div>
                      <div className="text-[11px] text-on-surface-variant flex items-center gap-1 mt-0.5">
                        <span className="material-symbols-outlined text-xs">call</span> {rec.patientPhone}
                      </div>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-bold text-primary">{rec.treatmentName}</div>
                      {rec.notes && <div className="text-[11px] text-on-surface-variant truncate max-w-xs">{rec.notes}</div>}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-on-surface">{rec.attendingDoctor}</div>
                      <div className="text-[10px] text-on-surface-variant">{rec.doctorSpecialization}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-on-surface flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">calendar_month</span> {rec.treatmentDate}
                      </div>
                      <div className="text-[11px] text-on-surface-variant flex items-center gap-1 mt-0.5">
                        <span className="material-symbols-outlined text-xs">schedule</span> {rec.timeSlot}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 bg-surface-container-high rounded-lg font-bold text-[11px] inline-flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">timer</span> {rec.duration}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-extrabold text-emerald-700 dark:text-emerald-300">
                      {rec.cost}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] border ${
                          rec.status === 'Completed'
                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20'
                        }`}
                      >
                        {rec.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(rec)}
                          className="px-2.5 py-1 border border-outline rounded-lg text-xs font-semibold hover:bg-surface-container-high text-on-surface transition-colors flex items-center gap-1"
                          title="Edit Treatment History Record"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteRecord(rec)}
                          className="px-2.5 py-1 bg-rose-500/10 text-rose-700 dark:text-rose-300 hover:bg-rose-500/20 font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                          title="Delete Treatment History Record"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                          <span>Delete</span>
                        </button>
                        <button
                          onClick={() => setActiveModalData(rec)}
                          className="px-2.5 py-1 bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-1"
                          title="Rx / Invoice"
                        >
                          <span className="material-symbols-outlined text-sm">receipt_long</span>
                          <span>Rx / Bill</span>
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

      {/* Doctor Credentials & Access Code Manager Section */}
      <AdminDoctorManagement />

      {/* Patient Feedback Moderation Section */}
      <AdminFeedbackModeration />

      {/* Add New Patient Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-surface rounded-2xl border border-outline-variant max-w-xl w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex justify-between items-center border-b border-outline-variant pb-3">
              <h3 className="text-lg font-bold font-serif text-on-surface">Add New Patient Treatment History</h3>
              <button onClick={() => setShowAddModal(false)} className="text-on-surface-variant hover:text-on-surface font-bold">✕</button>
            </div>

            <form onSubmit={handleAddRecord} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-on-surface-variant uppercase">Patient Full Name</label>
                  <input
                    type="text"
                    required
                    value={newPatientName}
                    onChange={(e) => setNewPatientName(e.target.value)}
                    placeholder="e.g. Ramesh Babu"
                    className="w-full mt-1 p-2 rounded-xl border border-outline bg-surface text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-on-surface-variant uppercase">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+91 98400 12345"
                    className="w-full mt-1 p-2 rounded-xl border border-outline bg-surface text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-on-surface-variant uppercase">Treatment / Procedure Rendered</label>
                <input
                  type="text"
                  required
                  value={newTreatment}
                  onChange={(e) => setNewTreatment(e.target.value)}
                  placeholder="e.g. Root Canal Treatment, Crown Placement"
                  className="w-full mt-1 p-2 rounded-xl border border-outline bg-surface text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-on-surface-variant uppercase">Attending Doctor</label>
                  <select
                    value={newDoctor}
                    onChange={(e) => setNewDoctor(e.target.value)}
                    className="w-full mt-1 p-2 rounded-xl border border-outline bg-surface text-xs font-semibold outline-none"
                  >
                    {doctorsList.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-on-surface-variant uppercase">Treatment Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full mt-1 p-2 rounded-xl border border-outline bg-surface text-xs outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-on-surface-variant uppercase">Time Slot</label>
                  <input
                    type="text"
                    value={newTimeSlot}
                    onChange={(e) => setNewTimeSlot(e.target.value)}
                    placeholder="10:00 AM - 11:00 AM"
                    className="w-full mt-1 p-2 rounded-xl border border-outline bg-surface text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-on-surface-variant uppercase">Duration</label>
                  <select
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full mt-1 p-2 rounded-xl border border-outline bg-surface text-xs font-medium outline-none"
                  >
                    <option value="30 mins">30 mins</option>
                    <option value="45 mins">45 mins</option>
                    <option value="60 mins">60 mins</option>
                    <option value="90 mins">90 mins</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-on-surface-variant uppercase">Fee Charged</label>
                  <input
                    type="text"
                    value={newCost}
                    onChange={(e) => setNewCost(e.target.value)}
                    placeholder="₹4,500"
                    className="w-full mt-1 p-2 rounded-xl border border-outline bg-surface text-xs font-bold text-emerald-700 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-on-surface-variant uppercase">Clinical Treatment Notes</label>
                <textarea
                  rows="3"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Record treatment step-by-step notes..."
                  className="w-full mt-1 p-2.5 rounded-xl border border-outline bg-surface text-xs outline-none"
                ></textarea>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-outline rounded-xl font-semibold hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-on-primary font-bold rounded-xl hover:bg-primary-hover shadow-sm"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Patient History Modal */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-surface rounded-2xl border border-outline-variant max-w-xl w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex justify-between items-center border-b border-outline-variant pb-3">
              <h3 className="text-lg font-bold font-serif text-on-surface">Edit Patient Treatment Record</h3>
              <button onClick={() => setEditingRecord(null)} className="text-on-surface-variant hover:text-on-surface font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-on-surface-variant uppercase">Patient Full Name</label>
                  <input
                    type="text"
                    required
                    value={editPatientName}
                    onChange={(e) => setEditPatientName(e.target.value)}
                    className="w-full mt-1 p-2 rounded-xl border border-outline bg-surface text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-on-surface-variant uppercase">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full mt-1 p-2 rounded-xl border border-outline bg-surface text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-on-surface-variant uppercase">Treatment / Procedure Rendered</label>
                <input
                  type="text"
                  required
                  value={editTreatment}
                  onChange={(e) => setEditTreatment(e.target.value)}
                  className="w-full mt-1 p-2 rounded-xl border border-outline bg-surface text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-on-surface-variant uppercase">Attending Doctor</label>
                  <select
                    value={editDoctor}
                    onChange={(e) => setEditDoctor(e.target.value)}
                    className="w-full mt-1 p-2 rounded-xl border border-outline bg-surface text-xs font-semibold outline-none"
                  >
                    {doctorsList.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-on-surface-variant uppercase">Treatment Date</label>
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full mt-1 p-2 rounded-xl border border-outline bg-surface text-xs outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-on-surface-variant uppercase">Time Slot</label>
                  <input
                    type="text"
                    value={editTimeSlot}
                    onChange={(e) => setEditTimeSlot(e.target.value)}
                    className="w-full mt-1 p-2 rounded-xl border border-outline bg-surface text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-on-surface-variant uppercase">Duration</label>
                  <select
                    value={editDuration}
                    onChange={(e) => setEditDuration(e.target.value)}
                    className="w-full mt-1 p-2 rounded-xl border border-outline bg-surface text-xs font-medium outline-none"
                  >
                    <option value="30 mins">30 mins</option>
                    <option value="45 mins">45 mins</option>
                    <option value="60 mins">60 mins</option>
                    <option value="90 mins">90 mins</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-on-surface-variant uppercase">Fee Charged</label>
                  <input
                    type="text"
                    value={editCost}
                    onChange={(e) => setEditCost(e.target.value)}
                    className="w-full mt-1 p-2 rounded-xl border border-outline bg-surface text-xs font-bold text-emerald-700 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-on-surface-variant uppercase">Treatment Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full mt-1 p-2 rounded-xl border border-outline bg-surface text-xs font-semibold outline-none"
                >
                  <option value="Completed">Completed</option>
                  <option value="In Progress">In Progress</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-on-surface-variant uppercase">Clinical Treatment Notes</label>
                <textarea
                  rows="3"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl border border-outline bg-surface text-xs outline-none"
                ></textarea>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setEditingRecord(null)}
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

      {/* Rx / Invoice Modal */}
      {activeModalData && (
        <InvoiceRxGeneratorModal
          isOpen={!!activeModalData}
          onClose={() => setActiveModalData(null)}
          initialData={activeModalData}
        />
      )}
    </div>
  );
}
