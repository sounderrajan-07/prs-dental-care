import React, { useState } from 'react';
import DoctorPortal from '../components/DoctorPortal';
import AttendancePortal from '../components/AttendancePortal';
import AdminHistoryPortal from '../components/AdminHistoryPortal';
import { CLINIC_DOCTORS } from '../utils/attendanceStorage';

export default function Admin() {
  // Authentication State
  // Role: 'admin' | 'doctor' | 'attendance' | null
  const [authRole, setAuthRole] = useState(() => {
    return sessionStorage.getItem('prs_clinic_role') || null;
  });

  const [selectedRoleTarget, setSelectedRoleTarget] = useState('admin'); // 'admin', 'doctor', 'attendance'
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);
  const [activeDoctor, setActiveDoctor] = useState(CLINIC_DOCTORS[0]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setPasscodeError(false);

    if (selectedRoleTarget === 'admin') {
      if (passcode === 'admin123' || passcode === 'admin' || passcode === '1234') {
        setAuthRole('admin');
        sessionStorage.setItem('prs_clinic_role', 'admin');
        setPasscode('');
      } else {
        setPasscodeError(true);
      }
    } else if (selectedRoleTarget === 'doctor') {
      if (passcode === 'doctor123' || passcode === 'doc123' || passcode === '1234' || passcode === activeDoctor.passcode) {
        setAuthRole('doctor');
        sessionStorage.setItem('prs_clinic_role', 'doctor');
        setPasscode('');
      } else {
        setPasscodeError(true);
      }
    } else if (selectedRoleTarget === 'attendance') {
      if (passcode === 'attend123' || passcode === 'attendance' || passcode === '1234' || passcode === 'admin123') {
        setAuthRole('attendance');
        sessionStorage.setItem('prs_clinic_role', 'attendance');
        setPasscode('');
      } else {
        setPasscodeError(true);
      }
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('prs_clinic_role');
    setAuthRole(null);
  };

  // If not logged in, render the Multi-Role Login Selection Portal
  if (!authRole) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 py-12 text-on-surface">
        <div className="max-w-md w-full bg-surface rounded-3xl border border-outline-variant p-8 shadow-2xl space-y-6 animate-fadeIn">
          
          {/* Logo & Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-primary/10 text-primary border border-primary/20 rounded-2xl flex items-center justify-center font-bold text-3xl mx-auto shadow-sm">
              🦷
            </div>
            <h1 className="text-2xl font-extrabold font-serif text-on-surface">PRS Dental Care</h1>
            <p className="text-xs text-on-surface-variant font-medium">Dynamic Clinic Management & Portal Access</p>
          </div>

          {/* Role Selection Tabs */}
          <div className="grid grid-cols-3 gap-2 bg-surface-container-low p-1.5 rounded-2xl border border-outline-variant/60">
            <button
              type="button"
              onClick={() => {
                setSelectedRoleTarget('admin');
                setPasscodeError(false);
              }}
              className={`py-2 px-1 text-center rounded-xl font-bold text-xs transition-all ${
                selectedRoleTarget === 'admin'
                  ? 'bg-surface text-primary shadow-sm border border-outline-variant/80'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              👑 Admin Login
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRoleTarget('doctor');
                setPasscodeError(false);
              }}
              className={`py-2 px-1 text-center rounded-xl font-bold text-xs transition-all ${
                selectedRoleTarget === 'doctor'
                  ? 'bg-surface text-primary shadow-sm border border-outline-variant/80'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              🩺 Doctor Login
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRoleTarget('attendance');
                setPasscodeError(false);
              }}
              className={`py-2 px-1 text-center rounded-xl font-bold text-xs transition-all ${
                selectedRoleTarget === 'attendance'
                  ? 'bg-surface text-primary shadow-sm border border-outline-variant/80'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              📅 Attendance
            </button>
          </div>

          {/* Role Info Box */}
          <div className="p-3 bg-surface-container rounded-xl border border-outline-variant text-xs text-on-surface-variant space-y-1">
            {selectedRoleTarget === 'admin' && (
              <>
                <div className="font-bold text-primary">Master Admin Access</div>
                <p>Manage patient history, treatment durations, cost, doctor assignments & clinic metrics. Default key: <code className="bg-surface px-1 py-0.5 rounded font-mono text-primary font-bold">admin123</code></p>
              </>
            )}

            {selectedRoleTarget === 'doctor' && (
              <>
                <div className="font-bold text-primary">Doctor Dedicated Portal</div>
                <p>Monitor patient slot bookings, approve or reject appointments & update patient notes. Default key: <code className="bg-surface px-1 py-0.5 rounded font-mono text-primary font-bold">doctor123</code></p>
              </>
            )}

            {selectedRoleTarget === 'attendance' && (
              <>
                <div className="font-bold text-primary">Doctor Attendance Portal</div>
                <p>Mark daily doctor attendance, shift hours & download monthly Excel report sheet. Default key: <code className="bg-surface px-1 py-0.5 rounded font-mono text-primary font-bold">attend123</code></p>
              </>
            )}
          </div>

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {selectedRoleTarget === 'doctor' && (
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Select Doctor Profile</label>
                <select
                  value={activeDoctor.id}
                  onChange={(e) => {
                    const doc = CLINIC_DOCTORS.find((d) => d.id === e.target.value);
                    if (doc) setActiveDoctor(doc);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline bg-surface text-xs font-semibold text-on-surface outline-none focus:ring-2 focus:ring-primary"
                >
                  {CLINIC_DOCTORS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.specialization.split('-')[1] || d.specialization})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                {selectedRoleTarget.toUpperCase()} Access Key
              </label>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode..."
                className="w-full px-4 py-3 rounded-xl border border-outline bg-surface text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {passcodeError && (
              <p className="text-xs font-bold text-rose-500 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20 text-center">
                ⚠️ Invalid access passcode. Please try again.
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-primary text-on-primary font-bold rounded-xl hover:bg-primary-hover shadow-md transition-all text-xs uppercase tracking-wider"
            >
              Sign In to {selectedRoleTarget.toUpperCase()} Portal
            </button>
          </form>

        </div>
      </div>
    );
  }

  // Render Authenticated Suite with Role Switcher Bar
  return (
    <div className="min-h-screen bg-background text-on-surface py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Control Bar with Quick Role Switcher */}
        <div className="bg-surface rounded-2xl border border-outline-variant p-4 shadow-sm flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold text-xl shadow-xs">
              🦷
            </div>
            <div>
              <h2 className="text-base font-bold font-serif text-on-surface">PRS Dental Clinic Management</h2>
              <span className="text-xs text-on-surface-variant">Active Portal: <strong className="text-primary uppercase">{authRole}</strong></span>
            </div>
          </div>

          {/* Role Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setAuthRole('admin')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                authRole === 'admin'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'border border-outline text-on-surface-variant hover:text-on-surface bg-surface'
              }`}
            >
              👑 Admin & Patient History
            </button>

            <button
              onClick={() => setAuthRole('doctor')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                authRole === 'doctor'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'border border-outline text-on-surface-variant hover:text-on-surface bg-surface'
              }`}
            >
              🩺 Doctor Portal
            </button>

            <button
              onClick={() => setAuthRole('attendance')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                authRole === 'attendance'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'border border-outline text-on-surface-variant hover:text-on-surface bg-surface'
              }`}
            >
              📅 Doctor Attendance
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-xl text-xs font-bold transition-colors ml-2"
            >
              🚪 Sign Out
            </button>
          </div>
        </div>

        {/* Dynamic Portal View Rendering based on active role */}
        {authRole === 'admin' && <AdminHistoryPortal onLogout={handleLogout} />}
        {authRole === 'doctor' && <DoctorPortal loggedDoctor={activeDoctor} onLogout={handleLogout} />}
        {authRole === 'attendance' && <AttendancePortal onLogout={handleLogout} />}

      </div>
    </div>
  );
}
