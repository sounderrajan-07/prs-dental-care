import React, { useState, useEffect, useMemo } from 'react';
import { getStoredAppointments, updateStoredStatus, updateAppointmentDetails, deleteAppointmentRecord } from '../utils/appointmentStorage';
import { getStoredDoctors } from '../utils/doctorStorage';
import { dispatchPatientNotifications, generateAppointmentMessage } from '../utils/notificationService';
import InvoiceRxGeneratorModal from './InvoiceRxGeneratorModal';

export default function DoctorPortal({ loggedDoctor, onLogout, isAdmin = false, doctorList = [] }) {
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('Pending');
  const [searchQuery, setSearchQuery] = useState('');

  const allAvailableDoctors = useMemo(() => {
    return doctorList && doctorList.length > 0 ? doctorList : getStoredDoctors();
  }, [doctorList]);

  // Selected Doctor ID state: defaults to 'all' in Admin mode, or logged-in doctor ID
  const [selectedDoctorId, setSelectedDoctorId] = useState(() => {
    if (isAdmin) return 'all';
    return loggedDoctor?.id || allAvailableDoctors[0]?.id || 'doc1';
  });

  // Doctor Remarks / Entry Drawer State
  const [editingApt, setEditingApt] = useState(null);
  const [remarksText, setRemarksText] = useState('');
  const [durationText, setDurationText] = useState('45 mins');
  const [treatmentStatusText, setTreatmentStatusText] = useState('In Progress');

  // Productivity Modal State
  const [rxModalData, setRxModalData] = useState(null);

  // Automated Notification Toast Banner State
  const [notificationToast, setNotificationToast] = useState(null);

  // Rejection Reason Modal State
  const [rejectionModalApt, setRejectionModalApt] = useState(null);
  const [selectedPresetReason, setSelectedPresetReason] = useState('Doctor unavailable at requested time slot');
  const [customReasonText, setCustomReasonText] = useState('');

  const activeDocObj = useMemo(() => {
    if (selectedDoctorId === 'all') {
      return {
        id: 'all',
        name: 'All Clinic Doctors',
        specialization: 'Master Admin Access • Combined Clinic View',
        icon: 'groups'
      };
    }
    const found = allAvailableDoctors.find(
      (d) => d.id === selectedDoctorId || d.name === selectedDoctorId
    );
    return found || loggedDoctor || { name: 'Doctor', specialization: 'Specialist Consultant' };
  }, [selectedDoctorId, allAvailableDoctors, loggedDoctor]);

  const fetchAppointments = () => {
    const data = getStoredAppointments();
    setAppointments(data);
  };

  useEffect(() => {
    fetchAppointments();
    const interval = setInterval(fetchAppointments, 3000);
    return () => clearInterval(interval);
  }, []);

  // Filter appointments according to selected doctor view & active tab & search query
  const doctorAppointments = appointments.filter((apt) => {
    // If not 'all', filter strictly by assigned doctor
    if (selectedDoctorId !== 'all') {
      const isAssignedToThisDoctor =
        apt.preferredDoctor === activeDocObj.name ||
        apt.preferredDoctor === activeDocObj.id;

      if (!isAssignedToThisDoctor) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = apt.name?.toLowerCase().includes(q);
      const matchPhone = apt.phone?.includes(q);
      const matchService = apt.service?.toLowerCase().includes(q);
      const matchDoctor = apt.preferredDoctor?.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchService && !matchDoctor) return false;
    }

    if (activeTab === 'All') return true;
    return apt.status === activeTab;
  });

  // Handle Automated Approval & Notification Dispatch
  const handleApprove = async (apt) => {
    const defaultRemarks = `Approved by ${activeDocObj.name !== 'All Clinic Doctors' ? activeDocObj.name : 'Admin'}. Slot confirmed.`;
    
    // 1. Update appointment status in storage / DB
    updateStoredStatus(apt.id, 'Approved', defaultRemarks, apt.duration || '45 mins');
    fetchAppointments();

    // 2. Dispatch automated SMS & WhatsApp notification
    const result = await dispatchPatientNotifications(apt, 'Approved', defaultRemarks, { autoOpenWhatsApp: true });

    // 3. Display notification toast banner
    setNotificationToast({
      show: true,
      type: 'Approved',
      patientName: apt.name,
      phone: apt.phone,
      waText: result.waText,
      smsText: result.smsText,
      waUrl: result.waUrl,
      smsUrl: result.smsUrl,
      time: result.timestamp
    });
  };

  // Open Rejection Reason Selection Modal
  const handleOpenRejectModal = (apt) => {
    setRejectionModalApt(apt);
    setSelectedPresetReason('Doctor unavailable at requested time slot');
    setCustomReasonText('');
  };

  // Confirm Rejection & Dispatch Automated Notification
  const handleConfirmReject = async (e) => {
    e.preventDefault();
    if (!rejectionModalApt) return;

    const finalReason = customReasonText.trim() || selectedPresetReason;
    const fullRemarks = `Rejected: ${finalReason}`;

    // 1. Update status to Rejected
    updateStoredStatus(rejectionModalApt.id, 'Rejected', fullRemarks);
    fetchAppointments();

    // 2. Trigger automated SMS & WhatsApp notification
    const result = await dispatchPatientNotifications(rejectionModalApt, 'Rejected', finalReason, { autoOpenWhatsApp: true });

    // 3. Show notification confirmation toast
    setNotificationToast({
      show: true,
      type: 'Rejected',
      patientName: rejectionModalApt.name,
      phone: rejectionModalApt.phone,
      waText: result.waText,
      smsText: result.smsText,
      waUrl: result.waUrl,
      smsUrl: result.smsUrl,
      time: result.timestamp
    });

    setRejectionModalApt(null);
  };

  const handleDeleteAppointment = (apt) => {
    const confirmed = window.confirm(`Are you sure you want to delete appointment for ${apt.name}?`);
    if (!confirmed) return;
    deleteAppointmentRecord(apt.id);
    fetchAppointments();
  };

  // Manual WhatsApp Notification Dispatch
  const handleWhatsAppReminder = (apt) => {
    dispatchPatientNotifications(apt, apt.status || 'Approved', apt.doctorRemarks || '', { autoOpenWhatsApp: true });
  };

  // Manual SMS Notification Dispatch
  const handleSmsReminder = (apt) => {
    dispatchPatientNotifications(apt, apt.status || 'Approved', apt.doctorRemarks || '', { autoOpenWhatsApp: false, autoOpenSMS: true });
  };

  const handleOpenEditModal = (apt) => {
    setEditingApt(apt);
    setRemarksText(apt.doctorRemarks || '');
    setDurationText(apt.duration || '45 mins');
    setTreatmentStatusText(apt.treatmentStatus || 'In Progress');
  };

  const handleSaveEntry = (e) => {
    e.preventDefault();
    if (!editingApt) return;

    updateAppointmentDetails(editingApt.id, {
      doctorRemarks: remarksText,
      duration: durationText,
      treatmentStatus: treatmentStatusText
    });

    setEditingApt(null);
    fetchAppointments();
  };

  // Base list of appointments matching the doctor filter for KPI card calculation
  const baseAppointments = appointments.filter((a) => {
    if (selectedDoctorId === 'all') return true;
    return a.preferredDoctor === activeDocObj.name || a.preferredDoctor === activeDocObj.id;
  });

  const counts = {
    Pending: baseAppointments.filter((a) => a.status === 'Pending').length,
    Approved: baseAppointments.filter((a) => a.status === 'Approved').length,
    Rejected: baseAppointments.filter((a) => a.status === 'Rejected').length,
    All: baseAppointments.length
  };

  return (
    <div className="space-y-6 animate-fadeIn relative">

      {/* Automated Notification Dispatch Toast Overlay */}
      {notificationToast && (
        <div className="fixed top-5 right-5 z-50 max-w-md w-full bg-surface border-2 border-emerald-500 rounded-2xl shadow-2xl p-4 animate-bounce-short space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white ${
                notificationToast.type === 'Approved' ? 'bg-emerald-600' : 'bg-rose-600'
              }`}>
                <span className="material-symbols-outlined text-xl">
                  {notificationToast.type === 'Approved' ? 'check_circle' : 'cancel'}
                </span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider">
                  Automated SMS & WhatsApp Sent
                </h4>
                <p className="text-xs text-on-surface-variant">
                  Patient: <strong className="text-primary">{notificationToast.patientName}</strong> ({notificationToast.phone})
                </p>
              </div>
            </div>
            <button
              onClick={() => setNotificationToast(null)}
              className="text-on-surface-variant hover:text-on-surface text-xs font-bold p-1"
            >
              ✕
            </button>
          </div>

          <div className="p-2.5 bg-surface-container rounded-xl text-[11px] font-mono text-on-surface-variant max-h-24 overflow-y-auto border border-outline-variant/60">
            <span className="font-bold text-primary block mb-0.5">Dispatched Message Preview:</span>
            {notificationToast.smsText}
          </div>

          <div className="flex items-center justify-between gap-2 pt-1 border-t border-outline-variant/40">
            <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              WhatsApp Web Link Launched ({notificationToast.time})
            </span>
            <div className="flex gap-2">
              <a
                href={notificationToast.waUrl}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs"
              >
                <span className="material-symbols-outlined text-xs">chat</span> WhatsApp
              </a>
              <a
                href={notificationToast.smsUrl}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs"
              >
                <span className="material-symbols-outlined text-xs">sms</span> SMS
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Doctor Header Banner with Admin Dropdown Selector */}
      <div className="bg-surface-container border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-2xl">
            <span className="material-symbols-outlined text-3xl">
              {activeDocObj.icon || (selectedDoctorId === 'all' ? 'groups' : 'stethoscope')}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              {isAdmin ? (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">admin_panel_settings</span> Master Admin Access
                </span>
              ) : (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">medical_services</span> Doctor Portal Active
                </span>
              )}
              <span className="text-xs text-on-surface-variant">• PRS Dental Care</span>
            </div>
            <h2 className="text-2xl font-bold font-serif text-on-surface mt-0.5">{activeDocObj.name}</h2>
            <p className="text-xs text-on-surface-variant font-medium">{activeDocObj.specialization}</p>
          </div>
        </div>

        {/* Header Actions & Admin Doctor Dropdown */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {isAdmin && (
            <div className="flex flex-wrap items-center gap-2 bg-surface p-1.5 rounded-xl border border-primary/30 shadow-xs w-full sm:w-auto">
              <label htmlFor="admin-doctor-dropdown" className="text-xs font-bold text-primary flex items-center gap-1 pl-1 shrink-0">
                <span className="material-symbols-outlined text-base">swap_horiz</span>
                <span>Select View:</span>
              </label>
              <select
                id="admin-doctor-dropdown"
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                className="bg-surface-container-high text-xs font-bold text-on-surface px-3 py-1.5 rounded-lg border border-outline outline-none focus:ring-2 focus:ring-primary cursor-pointer w-full sm:w-auto max-w-full"
              >
                <option value="all">All Doctors (Combined View)</option>
                {allAvailableDoctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} ({doc.specialization.split('-')[0].trim()})
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={() => setRxModalData({ doctorName: activeDocObj.name !== 'All Clinic Doctors' ? activeDocObj.name : 'Dr. Purushotham' })}
            className="px-4 py-2 bg-secondary text-on-secondary hover:bg-secondary-hover text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">description</span>
            <span>Write Rx / Invoice</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-surface-container rounded-xl border border-amber-500/30 bg-amber-500/5">
          <span className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase">
            {selectedDoctorId === 'all' ? 'All Pending Slots' : 'My Pending Slots'}
          </span>
          <div className="text-3xl font-extrabold text-amber-700 dark:text-amber-300 mt-1">{counts.Pending}</div>
          <span className="text-[11px] text-on-surface-variant">Requires Action</span>
        </div>

        <div className="p-4 bg-surface-container rounded-xl border border-emerald-500/30 bg-emerald-500/5">
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase">
            {selectedDoctorId === 'all' ? 'All Approved Slots' : 'My Approved Slots'}
          </span>
          <div className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-300 mt-1">{counts.Approved}</div>
          <span className="text-[11px] text-on-surface-variant">Confirmed & Notified</span>
        </div>

        <div className="p-4 bg-surface-container rounded-xl border border-rose-500/30 bg-rose-500/5">
          <span className="text-xs font-bold text-rose-700 dark:text-rose-300 uppercase">
            {selectedDoctorId === 'all' ? 'All Declined Slots' : 'My Declined Slots'}
          </span>
          <div className="text-3xl font-extrabold text-rose-700 dark:text-rose-300 mt-1">{counts.Rejected}</div>
          <span className="text-[11px] text-on-surface-variant">Rejected & Notified</span>
        </div>

        <div className="p-4 bg-surface-container rounded-xl border border-primary/30 bg-primary/5">
          <span className="text-xs font-bold text-primary uppercase">
            {selectedDoctorId === 'all' ? 'Total Patients' : 'My Assigned Patients'}
          </span>
          <div className="text-3xl font-extrabold text-primary mt-1">{counts.All}</div>
          <span className="text-[11px] text-on-surface-variant">
            {selectedDoctorId === 'all' ? 'Across All Doctors' : 'Private Queue'}
          </span>
        </div>
      </div>

      {/* Main Filter & Search Bar */}
      <div className="bg-surface-container rounded-2xl border border-outline-variant p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Tabs */}
          <div className="flex bg-surface-container-low p-1 rounded-xl border border-outline-variant/60 w-full md:w-auto overflow-x-auto">
            {['Pending', 'Approved', 'Rejected', 'All'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-surface text-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tab} ({counts[tab] || 0})
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={selectedDoctorId === 'all' ? "Search patient, doctor, phone..." : "Search patient name, phone..."}
              className="w-full pl-9 pr-4 py-2 bg-surface border border-outline rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary"
            />
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-on-surface-variant text-base">search</span>
          </div>

        </div>

        {/* Doctor Appointment Cards List */}
        {doctorAppointments.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-outline-variant rounded-xl bg-surface">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant">dentistry</span>
            <h4 className="text-base font-bold text-on-surface mt-2">No appointments found</h4>
            <p className="text-xs text-on-surface-variant mt-1">
              There are no {activeTab !== 'All' ? activeTab.toLowerCase() : ''} bookings for {activeDocObj.name}.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {doctorAppointments.map((apt) => (
              <div
                key={apt.id}
                className="bg-surface rounded-xl border border-outline-variant/80 p-5 hover:border-primary/50 transition-all shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-extrabold text-primary tracking-wider uppercase">{apt.id}</span>
                        {(apt.status === 'Approved' || apt.status === 'Rejected') && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-500/20 flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">mark_email_read</span>
                            SMS & WhatsApp Sent ✓
                          </span>
                        )}
                      </div>
                      <h4 className="text-lg font-bold text-on-surface leading-tight mt-0.5">{apt.name}</h4>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
                        apt.status === 'Approved'
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                          : apt.status === 'Rejected'
                          ? 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>

                  {/* Booking Metadata */}
                  <div className="mt-3 space-y-1.5 text-xs text-on-surface-variant">
                    {/* Assigned Doctor Tag */}
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-on-surface">Assigned Doctor:</span>
                      <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-lg text-[11px] font-bold flex items-center gap-1 border border-primary/20">
                        <span className="material-symbols-outlined text-xs">medical_services</span>
                        <span>{apt.preferredDoctor || 'Unassigned'}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-on-surface">Service:</span>
                      <span className="text-primary font-bold">{apt.service}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-on-surface">Date & Time:</span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">calendar_month</span> {apt.date} ({apt.timeSlot || apt.time})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-on-surface">Duration:</span>
                      <span className="px-2 py-0.5 bg-surface-container-high rounded text-[11px] font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">schedule</span> {apt.duration || '45 mins'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-on-surface">Contact:</span>
                      <span className="flex items-center gap-1 font-bold text-on-surface">
                        <span className="material-symbols-outlined text-xs text-primary">call</span> {apt.phone}
                      </span>
                    </div>
                    {apt.notes && (
                      <div className="mt-2 p-2 bg-surface-container-low rounded-lg border border-outline-variant/40 text-[11px]">
                        <span className="font-bold text-on-surface">Patient Request Notes:</span> "{apt.notes}"
                      </div>
                    )}
                    {apt.doctorRemarks && (
                      <div className="mt-2 p-2 bg-primary/5 rounded-lg border border-primary/20 text-[11px] text-primary">
                        <span className="font-bold">Doctor Notes / Remarks:</span> {apt.doctorRemarks}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-3 border-t border-outline-variant/60 flex flex-wrap gap-2 items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {apt.status !== 'Approved' && (
                      <button
                        onClick={() => handleApprove(apt)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1"
                        title="Approve slot & automatically send SMS and WhatsApp message"
                      >
                        <span className="material-symbols-outlined text-base">check_circle</span>
                        <span>Approve Slot</span>
                      </button>
                    )}
                    {apt.status !== 'Rejected' && (
                      <button
                        onClick={() => handleOpenRejectModal(apt)}
                        className="px-3 py-1.5 bg-rose-500/10 text-rose-700 dark:text-rose-300 hover:bg-rose-500/20 font-bold text-xs rounded-xl transition-all active:scale-95 flex items-center gap-1"
                        title="Reject slot & automatically send reschedule SMS and WhatsApp"
                      >
                        <span className="material-symbols-outlined text-base">cancel</span>
                        <span>Reject</span>
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleWhatsAppReminder(apt)}
                      className="px-2.5 py-1.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                      title="Send / Resend WhatsApp message to patient"
                    >
                      <span className="material-symbols-outlined text-base">chat</span>
                      <span>WhatsApp</span>
                    </button>

                    <button
                      onClick={() => handleSmsReminder(apt)}
                      className="px-2.5 py-1.5 bg-sky-500/10 text-sky-700 dark:text-sky-300 hover:bg-sky-500/20 text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                      title="Send / Resend SMS message to patient"
                    >
                      <span className="material-symbols-outlined text-base">sms</span>
                      <span>SMS</span>
                    </button>

                    <button
                      onClick={() => handleOpenEditModal(apt)}
                      className="px-2.5 py-1.5 border border-outline rounded-xl text-xs font-semibold hover:bg-surface-container-high transition-colors flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-base">edit</span>
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteAppointment(apt)}
                      className="px-2.5 py-1.5 bg-rose-500/10 text-rose-700 dark:text-rose-300 hover:bg-rose-500/20 text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                      title="Delete Appointment"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                    <button
                      onClick={() => setRxModalData(apt)}
                      className="px-2.5 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-base">receipt_long</span>
                      <span>Rx / Bill</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rejection Reason Modal */}
      {rejectionModalApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-surface rounded-2xl border border-outline-variant max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-outline-variant pb-3">
              <h3 className="text-base font-bold font-serif text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-rose-600 text-xl">cancel</span>
                <span>Decline Appointment - {rejectionModalApt.name}</span>
              </h3>
              <button onClick={() => setRejectionModalApt(null)} className="text-on-surface-variant hover:text-on-surface font-bold text-sm">✕</button>
            </div>

            <p className="text-xs text-on-surface-variant">
              Selecting a rejection reason will automatically format and dispatch a reschedule request message to <strong>{rejectionModalApt.name}</strong> via <strong>SMS & WhatsApp</strong>.
            </p>

            <form onSubmit={handleConfirmReject} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Select Rejection Reason
                </label>
                <div className="space-y-2">
                  {[
                    'Doctor unavailable at requested time slot',
                    'Slot fully booked - please choose another time',
                    'Emergency surgery scheduled during this slot',
                    'Doctor on leave on selected date'
                  ].map((reasonOption) => (
                    <label
                      key={reasonOption}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                        selectedPresetReason === reasonOption && !customReasonText
                          ? 'border-rose-500 bg-rose-500/10 font-bold text-rose-700 dark:text-rose-300'
                          : 'border-outline-variant/60 hover:bg-surface-container'
                      }`}
                    >
                      <input
                        type="radio"
                        name="rejectionPreset"
                        checked={selectedPresetReason === reasonOption && !customReasonText}
                        onChange={() => {
                          setSelectedPresetReason(reasonOption);
                          setCustomReasonText('');
                        }}
                        className="accent-rose-600"
                      />
                      <span>{reasonOption}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                  Or Type Custom Reason
                </label>
                <input
                  type="text"
                  value={customReasonText}
                  onChange={(e) => setCustomReasonText(e.target.value)}
                  placeholder="Enter custom rejection reason..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline bg-surface text-xs outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setRejectionModalApt(null)}
                  className="px-4 py-2 border border-outline rounded-xl font-semibold hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-sm flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">send</span>
                  <span>Confirm & Send Notifications</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Entry Drawer/Modal */}
      {editingApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-surface rounded-2xl border border-outline-variant max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-outline-variant pb-3">
              <h3 className="text-lg font-bold font-serif text-on-surface">Manage Patient Entry - {editingApt.name}</h3>
              <button onClick={() => setEditingApt(null)} className="text-on-surface-variant hover:text-on-surface font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveEntry} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-on-surface-variant uppercase">Estimated Treatment Duration</label>
                <select
                  value={durationText}
                  onChange={(e) => setDurationText(e.target.value)}
                  className="w-full mt-1 p-2 rounded-xl border border-outline bg-surface text-sm font-medium outline-none"
                >
                  <option value="15 mins">15 mins (Quick Checkup)</option>
                  <option value="30 mins">30 mins (Scaling / Consultation)</option>
                  <option value="45 mins">45 mins (Root Canal / Filling)</option>
                  <option value="60 mins">60 mins (Laser Whitening)</option>
                  <option value="90 mins">90 mins (Surgical Extraction / Implant)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-on-surface-variant uppercase">Treatment Progress Status</label>
                <select
                  value={treatmentStatusText}
                  onChange={(e) => setTreatmentStatusText(e.target.value)}
                  className="w-full mt-1 p-2 rounded-xl border border-outline bg-surface text-sm font-medium outline-none"
                >
                  <option value="Consultation">Consultation Only</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="In Progress">In Progress (Sitting 1 / Ongoing)</option>
                  <option value="Completed">Completed</option>
                  <option value="Follow-up Needed">Follow-up Needed</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-on-surface-variant uppercase">Doctor's Clinical Notes & Remarks</label>
                <textarea
                  rows="4"
                  value={remarksText}
                  onChange={(e) => setRemarksText(e.target.value)}
                  placeholder="Record diagnosis, procedure performed, intra-canal medicament, next appointment instructions..."
                  className="w-full mt-1 p-3 rounded-xl border border-outline bg-surface text-xs outline-none focus:ring-2 focus:ring-primary"
                ></textarea>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setEditingApt(null)}
                  className="px-4 py-2 border border-outline rounded-xl font-semibold hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-on-primary font-bold rounded-xl hover:bg-primary-hover shadow-sm"
                >
                  Save Patient Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rx / Invoice Modal */}
      {rxModalData && (
        <InvoiceRxGeneratorModal
          isOpen={!!rxModalData}
          onClose={() => setRxModalData(null)}
          initialData={rxModalData}
        />
      )}
    </div>
  );
}
