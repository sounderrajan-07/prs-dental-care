import React, { useState, useEffect } from 'react';
import {
  getStoredAppointments,
  updateStoredStatus,
  deleteStoredAppointment
} from '../utils/appointmentStorage';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('prs_admin_auth') === 'true';
  });
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);

  const [appointments, setAppointments] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  // Email Notification Modal State
  const [emailModalData, setEmailModalData] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Fetch live appointments from localStorage + API
  useEffect(() => {
    const fetchAppointments = async () => {
      const localData = getStoredAppointments();

      try {
        const res = await fetch('/api/appointments');
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          const mergedMap = new Map();
          [...localData, ...data.data].forEach((apt) => mergedMap.set(apt.id, apt));
          setAppointments(Array.from(mergedMap.values()));
          return;
        }
      } catch (err) {
        // API offline fallback
      }

      setAppointments(localData);
    };

    fetchAppointments();
    const interval = setInterval(fetchAppointments, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode === 'admin123' || passcode === '1234' || passcode === 'admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('prs_admin_auth', 'true');
      setPasscodeError(false);
    } else {
      setPasscodeError(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('prs_admin_auth');
    setIsAuthenticated(false);
  };

  const handleStatusChange = async (id, newStatus) => {
    const targetApt = appointments.find((apt) => apt.id === id);
    if (!targetApt) return;

    const recipientEmail = targetApt.email || 'soundhersenthil07@gmail.com';
    const recipientName = targetApt.name || 'Patient';

    // 1. Update local storage & state
    updateStoredStatus(id, newStatus);
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: newStatus } : apt))
    );

    // 2. Build email notification template
    const emailSubject = `PRS Dental Care: Your Appointment is ${newStatus.toUpperCase()} (${targetApt.id})`;
    const emailBody = `Dear ${recipientName},\n\nYour appointment request at PRS Dental Care has been ${newStatus.toUpperCase()}.\n\nAppointment Details:\n- Appointment ID: ${targetApt.id}\n- Treatment/Service: ${targetApt.service}\n- Specialist: ${targetApt.preferredDoctor}\n- Date: ${targetApt.date}\n- Time Slot: ${targetApt.timeSlot}\n- Clinic Branch: PRS Dental Care, Kolathur, Chennai\n- Contact Phone: +91 72007 18607\n\n${
      newStatus === 'Approved'
        ? 'Please arrive 10 minutes prior to your time slot. We look forward to providing you with exceptional dental care!'
        : 'If you would like to reschedule for a different date or time, please contact our clinic directly.'
    }\n\nWarm regards,\nPRS Dental Care Team`;

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipientEmail)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    const outlookUrl = `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(recipientEmail)}&subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    // 3. Open Email Dispatch Modal for Admin
    setEmailModalData({
      id,
      patientName: recipientName,
      email: recipientEmail,
      phone: targetApt.phone,
      status: newStatus,
      subject: emailSubject,
      body: emailBody,
      gmailUrl,
      outlookUrl,
      mailtoUrl: `mailto:${recipientEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`
    });

    setActionMessage(`✓ Appointment ${id} marked as ${newStatus}. Email dispatch modal opened.`);
    setTimeout(() => setActionMessage(''), 5000);

    // 4. Send status update to Express API
    try {
      await fetch(`/api/appointments/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (err) {
      console.log('API status update error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete appointment ${id}?`)) return;

    deleteStoredAppointment(id);
    setAppointments((prev) => prev.filter((apt) => apt.id !== id));
    setActionMessage(`Appointment ${id} deleted`);
    setTimeout(() => setActionMessage(''), 3000);

    try {
      await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.log('API sync error');
    }
  };

  const handleCopyEmailText = () => {
    if (!emailModalData) return;
    navigator.clipboard.writeText(emailModalData.body);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleOpenGmail = () => {
    if (!emailModalData) return;
    const recipient = encodeURIComponent(emailModalData.email);
    const subject = encodeURIComponent(emailModalData.subject);
    const body = encodeURIComponent(emailModalData.body);
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank', 'noopener,noreferrer');
  };

  const handleOpenOutlook = () => {
    if (!emailModalData) return;
    const recipient = encodeURIComponent(emailModalData.email);
    const subject = encodeURIComponent(emailModalData.subject);
    const body = encodeURIComponent(emailModalData.body);
    const outlookUrl = `https://outlook.office.com/mail/deeplink/compose?to=${recipient}&subject=${subject}&body=${body}`;
    window.open(outlookUrl, '_blank', 'noopener,noreferrer');
  };

  const handleOpenMailto = () => {
    if (!emailModalData) return;
    const recipient = encodeURIComponent(emailModalData.email);
    const subject = encodeURIComponent(emailModalData.subject);
    const body = encodeURIComponent(emailModalData.body);
    window.location.href = `mailto:${emailModalData.email}?subject=${subject}&body=${body}`;
  };

  // Metrics
  const totalCount = appointments.length;
  const pendingCount = appointments.filter((a) => a.status === 'Pending').length;
  const approvedCount = appointments.filter((a) => a.status === 'Approved').length;
  const rejectedCount = appointments.filter((a) => a.status === 'Rejected').length;

  // Filtered list
  const filteredAppointments = appointments.filter((apt) => {
    const matchesFilter = activeFilter === 'All' || apt.status === activeFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      apt.name.toLowerCase().includes(q) ||
      apt.phone.toLowerCase().includes(q) ||
      apt.service.toLowerCase().includes(q) ||
      apt.preferredDoctor.toLowerCase().includes(q) ||
      apt.id.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full clinical-shadow border border-outline-variant/30 text-center space-y-6">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <span className="material-symbols-outlined text-3xl">admin_panel_settings</span>
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-primary font-display">PRS Clinic Admin Portal</h1>
            <p className="text-xs text-on-surface-variant mt-1">
              Enter admin passcode to manage patient appointment approvals.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label htmlFor="admin-passcode" className="block text-xs font-bold text-on-surface mb-1.5">
                Admin Passcode
              </label>
              <input
                id="admin-passcode"
                name="passcode"
                type="password"
                placeholder="Enter passcode (default: admin123)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-outline-variant/60 focus:outline-none focus:border-primary text-sm font-medium bg-surface-bright"
                required
                autoFocus
              />
              {passcodeError && (
                <p className="text-xs text-error font-semibold mt-1">
                  Incorrect passcode. Try <code>admin123</code>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-container text-on-primary font-bold py-3.5 rounded-xl shadow-md transition-all active:scale-95 text-sm flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">lock_open</span>
              Log In to Admin Dashboard
            </button>
          </form>

          <div className="pt-2 border-t border-outline-variant/15">
            <button
              onClick={() => {
                setPasscode('admin123');
                setIsAuthenticated(true);
                sessionStorage.setItem('prs_admin_auth', 'true');
              }}
              className="text-xs text-secondary font-bold hover:underline"
            >
              Quick Test Access (Auto-fill `admin123`)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-outline-variant/30 clinical-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-xl shadow-md">
              <span className="material-symbols-outlined text-2xl">event_upcoming</span>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-primary font-display">Appointment Approvals</h1>
              <p className="text-xs text-on-surface-variant font-medium">
                PRS Dental Care • Kolathur Clinic Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-extrabold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Sync & Mailer Active
            </span>
            <button
              onClick={handleLogout}
              className="bg-surface-container-high hover:bg-surface-container-highest text-primary font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-base">logout</span>
              Lock Admin
            </button>
          </div>
        </div>

        {/* Action Alert Banner */}
        {actionMessage && (
          <div className="p-4 bg-primary text-on-primary rounded-2xl text-xs font-bold shadow-md flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">mark_email_read</span>
              <span>{actionMessage}</span>
            </div>
          </div>
        )}

        {/* Metrics Counter Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-3xl border border-outline-variant/30 clinical-shadow space-y-1">
            <span className="text-xs font-extrabold text-on-surface-variant uppercase tracking-wider block">
              Total Requests
            </span>
            <span className="text-3xl font-black text-primary block">{totalCount}</span>
          </div>

          <div className="bg-amber-50/70 p-5 rounded-3xl border border-amber-200 clinical-shadow space-y-1">
            <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wider block">
              Pending Approval
            </span>
            <span className="text-3xl font-black text-amber-700 block">{pendingCount}</span>
          </div>

          <div className="bg-emerald-50/70 p-5 rounded-3xl border border-emerald-200 clinical-shadow space-y-1">
            <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider block">
              Approved
            </span>
            <span className="text-3xl font-black text-emerald-700 block">{approvedCount}</span>
          </div>

          <div className="bg-rose-50/70 p-5 rounded-3xl border border-rose-200 clinical-shadow space-y-1">
            <span className="text-xs font-extrabold text-rose-800 uppercase tracking-wider block">
              Rejected
            </span>
            <span className="text-3xl font-black text-rose-700 block">{rejectedCount}</span>
          </div>
        </div>

        {/* Controls Bar: Filters & Search */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-outline-variant/30 clinical-shadow flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 bg-surface-container-low p-1.5 rounded-2xl border border-outline-variant/20 w-full md:w-auto overflow-x-auto">
            {['All', 'Pending', 'Approved', 'Rejected'].map((tab) => {
              const isActive = activeFilter === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Search Field */}
          <div className="relative w-full md:w-80">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
              search
            </span>
            <input
              type="text"
              placeholder="Search by patient, phone, doctor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-outline-variant/60 text-xs font-semibold focus:outline-none focus:border-primary bg-surface-bright"
            />
          </div>
        </div>

        {/* Appointments List (Mobile Card View & Desktop Table View) */}
        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-outline-variant/30 clinical-shadow space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-3xl">mark_email_unread</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary">No Booked Appointments Yet</h3>
              <p className="text-xs text-on-surface-variant max-w-md mx-auto mt-1">
                Newly submitted patient appointment bookings will appear here automatically for your review and approval.
              </p>
            </div>
            <div className="pt-2">
              <a
                href="/book-appointment"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-container text-on-primary font-bold px-5 py-2.5 rounded-xl shadow-md transition-all text-xs"
              >
                <span className="material-symbols-outlined text-base">calendar_month</span>
                Book Test Appointment
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-3xl border border-outline-variant/30 clinical-shadow overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant/20 text-[11px] font-extrabold uppercase text-on-surface-variant tracking-wider">
                    <th className="py-4 px-6">ID & Patient</th>
                    <th className="py-4 px-6">Treatment & Doctor</th>
                    <th className="py-4 px-6">Date & Time Slot</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Approval & Mail Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/15 text-xs font-semibold">
                  {filteredAppointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-4 px-6">
                        <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full inline-block mb-1">
                          {apt.id}
                        </span>
                        <div className="font-extrabold text-sm text-primary">{apt.name}</div>
                        <a href={`tel:${apt.phone}`} className="text-on-surface-variant hover:underline text-xs block">
                          {apt.phone}
                        </a>
                        {apt.email && (
                          <span className="text-[11px] text-secondary font-bold block truncate max-w-[180px]">
                            ✉ {apt.email}
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        <div className="font-extrabold text-on-surface">{apt.service}</div>
                        <div className="text-xs text-on-surface-variant">{apt.preferredDoctor}</div>
                        {apt.notes && (
                          <div className="text-[11px] text-secondary font-medium italic mt-1 max-w-xs">
                            "{apt.notes}"
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        <div className="font-bold text-primary">{apt.date}</div>
                        <div className="text-xs text-on-surface-variant">{apt.timeSlot}</div>
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold ${
                            apt.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : apt.status === 'Rejected'
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}
                        >
                          {apt.status === 'Approved' && '✓ Approved'}
                          {apt.status === 'Rejected' && '✗ Rejected'}
                          {apt.status === 'Pending' && '⏳ Pending'}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right space-x-2">
                        {apt.status !== 'Approved' && (
                          <button
                            onClick={() => handleStatusChange(apt.id, 'Approved')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs shadow-sm transition-all active:scale-95 inline-flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-sm">check</span>
                            Approve & Mail
                          </button>
                        )}

                        {apt.status !== 'Rejected' && (
                          <button
                            onClick={() => handleStatusChange(apt.id, 'Rejected')}
                            className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs shadow-sm transition-all active:scale-95 inline-flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-sm">close</span>
                            Reject & Mail
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(apt.id)}
                          className="bg-surface-container-high hover:bg-rose-100 text-rose-700 p-1.5 rounded-xl transition-all active:scale-95"
                          title="Delete appointment"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="lg:hidden space-y-4">
              {filteredAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-white rounded-3xl p-5 border border-outline-variant/30 clinical-shadow space-y-4 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-2 border-b border-outline-variant/15 pb-3">
                    <div>
                      <span className="text-[10px] font-black text-primary bg-primary/10 px-2.5 py-0.5 rounded-full inline-block mb-1">
                        {apt.id}
                      </span>
                      <h3 className="font-extrabold text-base text-primary">{apt.name}</h3>
                      <a href={`tel:${apt.phone}`} className="text-xs text-secondary font-bold hover:underline block">
                        📞 {apt.phone}
                      </a>
                      {apt.email && (
                        <span className="text-[11px] text-on-surface-variant font-semibold block truncate">
                          ✉ {apt.email}
                        </span>
                      )}
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold ${
                        apt.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : apt.status === 'Rejected'
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {apt.status === 'Approved' && '✓ Approved'}
                      {apt.status === 'Rejected' && '✗ Rejected'}
                      {apt.status === 'Pending' && '⏳ Pending'}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Treatment</span>
                      <span className="font-bold text-on-surface">{apt.service}</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Specialist</span>
                      <span className="font-semibold text-primary">{apt.preferredDoctor}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 bg-surface-container p-3 rounded-2xl border border-outline-variant/20">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Date</span>
                        <span className="font-extrabold text-primary">{apt.date}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Time Slot</span>
                        <span className="font-bold text-on-surface">{apt.timeSlot}</span>
                      </div>
                    </div>

                    {apt.notes && (
                      <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-amber-900 text-xs italic">
                        "{apt.notes}"
                      </div>
                    )}
                  </div>

                  {/* Mobile Action Buttons */}
                  <div className="pt-2 flex items-center gap-2 border-t border-outline-variant/15">
                    {apt.status !== 'Approved' && (
                      <button
                        onClick={() => handleStatusChange(apt.id, 'Approved')}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1"
                      >
                        <span className="material-symbols-outlined text-base">check</span>
                        Approve & Mail
                      </button>
                    )}

                    {apt.status !== 'Rejected' && (
                      <button
                        onClick={() => handleStatusChange(apt.id, 'Rejected')}
                        className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1"
                      >
                        <span className="material-symbols-outlined text-base">close</span>
                        Reject & Mail
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(apt.id)}
                      className="bg-surface-container-high hover:bg-rose-100 text-rose-700 p-2.5 rounded-xl transition-all active:scale-95 flex items-center justify-center"
                      title="Delete appointment"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Email Dispatch Modal */}
      {emailModalData && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-on-background/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 clinical-shadow relative border border-outline-variant/30 space-y-5 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEmailModalData(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors"
              aria-label="Close email modal"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>

            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold ${
                emailModalData.status === 'Approved' ? 'bg-emerald-600' : 'bg-rose-600'
              }`}>
                <span className="material-symbols-outlined text-2xl">mark_email_read</span>
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-primary font-display">
                  Patient Email Dispatched
                </h3>
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-extrabold mt-0.5 ${
                  emailModalData.status === 'Approved'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  Status Updated: {emailModalData.status}
                </span>
              </div>
            </div>

            <div className="space-y-3 bg-surface-container p-4 rounded-2xl border border-outline-variant/20 text-xs">
              <div>
                <span className="font-extrabold text-on-surface-variant block uppercase text-[10px]">Recipient Email</span>
                <span className="font-bold text-primary text-sm">{emailModalData.email}</span>
              </div>

              <div>
                <span className="font-extrabold text-on-surface-variant block uppercase text-[10px]">Subject</span>
                <span className="font-bold text-on-surface">{emailModalData.subject}</span>
              </div>

              <div>
                <span className="font-extrabold text-on-surface-variant block uppercase text-[10px]">Message Body</span>
                <div className="bg-white p-3 rounded-xl border border-outline-variant/30 text-xs whitespace-pre-wrap font-mono text-on-surface leading-relaxed mt-1 max-h-48 overflow-y-auto">
                  {emailModalData.body}
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleOpenGmail}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all text-xs flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">send</span>
                <span>Send via Web Gmail (Opens Pre-filled Gmail Compose)</span>
              </button>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={handleOpenOutlook}
                  className="flex-1 bg-primary hover:bg-primary-container text-on-primary font-bold py-2.5 px-3 rounded-xl shadow-sm transition-all text-xs flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">mark_email_read</span>
                  <span>Outlook Web</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenMailto}
                  className="flex-1 bg-surface-container-high hover:bg-surface-container-highest text-primary border border-outline-variant/40 font-bold py-2.5 px-3 rounded-xl transition-all text-xs flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">mail</span>
                  <span>Mail App</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyEmailText}
                  className="flex-1 bg-surface-container-high hover:bg-surface-container-highest text-primary border border-outline-variant/40 font-bold py-2.5 px-3 rounded-xl transition-all text-xs flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">content_copy</span>
                  <span>{copiedEmail ? 'Copied! ✓' : 'Copy Text'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
