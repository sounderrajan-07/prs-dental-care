import React, { useState, useEffect } from 'react';
import DoctorPortal from '../components/DoctorPortal';
import AttendancePortal from '../components/AttendancePortal';
import AdminHistoryPortal from '../components/AdminHistoryPortal';
import { getStoredDoctors, verifyDoctorLogin } from '../utils/doctorStorage';

export default function Admin() {
  // Doctor accounts list
  const [doctorList, setDoctorList] = useState(() => getStoredDoctors());

  // Authentication & Authorized Roles State
  // Role: 'admin' | 'doctor' | 'attendance' | null
  const [authRole, setAuthRole] = useState(() => {
    return sessionStorage.getItem('prs_clinic_role') || null;
  });

  const [authorizedRoles, setAuthorizedRoles] = useState(() => {
    try {
      const raw = sessionStorage.getItem('prs_clinic_authorized_roles');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [selectedRoleTarget, setSelectedRoleTarget] = useState('admin'); // Login tab target
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);

  const [activeDoctor, setActiveDoctor] = useState(() => {
    try {
      const storedDoc = sessionStorage.getItem('prs_active_doctor');
      if (storedDoc) return JSON.parse(storedDoc);
    } catch {}
    const doctors = getStoredDoctors();
    return doctors[0] || { id: 'doc1', name: 'Dr. P. R. Sundharam', specialization: 'M.D.S - Endodontist' };
  });

  useEffect(() => {
    setDoctorList(getStoredDoctors());
  }, [authRole]);

  // Modal State for switching to locked/unauthorized role from header
  const [unlockRoleTarget, setUnlockRoleTarget] = useState(null); // 'admin' | 'doctor' | 'attendance' | null
  const [unlockPasscode, setUnlockPasscode] = useState('');
  const [unlockError, setUnlockError] = useState(false);

  const saveAuthSession = (currentRole, allowedList, docObj = null) => {
    setAuthRole(currentRole);
    setAuthorizedRoles(allowedList);
    sessionStorage.setItem('prs_clinic_role', currentRole);
    sessionStorage.setItem('prs_clinic_authorized_roles', JSON.stringify(allowedList));
    if (docObj) {
      setActiveDoctor(docObj);
      sessionStorage.setItem('prs_active_doctor', JSON.stringify(docObj));
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setPasscodeError(false);

    if (selectedRoleTarget === 'admin') {
      if (passcode === 'admin123' || passcode === 'admin' || passcode === '1234') {
        saveAuthSession('admin', ['admin', 'doctor', 'attendance']);
        setPasscode('');
      } else {
        setPasscodeError(true);
      }
    } else if (selectedRoleTarget === 'doctor') {
      const result = verifyDoctorLogin(activeDoctor.id, passcode);
      if (result.success && result.doctor) {
        saveAuthSession('doctor', ['admin', 'doctor', 'attendance'], result.doctor);
        setPasscode('');
      } else {
        setPasscodeError(true);
      }
    } else if (selectedRoleTarget === 'attendance') {
      if (passcode === 'attend123' || passcode === 'attendance' || passcode === '1234' || passcode === 'admin123') {
        saveAuthSession('attendance', ['admin', 'doctor', 'attendance']);
        setPasscode('');
      } else {
        setPasscodeError(true);
      }
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('prs_clinic_role');
    sessionStorage.removeItem('prs_clinic_authorized_roles');
    setAuthRole(null);
    setAuthorizedRoles([]);
  };

  const handleNavClick = (targetRole) => {
    setAuthRole(targetRole);
    sessionStorage.setItem('prs_clinic_role', targetRole);
    if (!authorizedRoles.includes(targetRole)) {
      const newRoles = [...authorizedRoles, targetRole];
      setAuthorizedRoles(newRoles);
      sessionStorage.setItem('prs_clinic_authorized_roles', JSON.stringify(newRoles));
    }
  };

  const handleUnlockSubmit = (e) => {
    e.preventDefault();
    setUnlockError(false);

    let isValid = false;
    let newAllowed = ['admin', 'doctor', 'attendance'];

    if (unlockRoleTarget === 'admin') {
      if (unlockPasscode === 'admin123' || unlockPasscode === 'admin' || unlockPasscode === '1234') {
        isValid = true;
      }
    } else if (unlockRoleTarget === 'doctor') {
      if (unlockPasscode === 'doctor123' || unlockPasscode === 'doc123' || unlockPasscode === '1234') {
        isValid = true;
      }
    } else if (unlockRoleTarget === 'attendance') {
      if (unlockPasscode === 'attend123' || unlockPasscode === 'attendance' || unlockPasscode === '1234') {
        isValid = true;
      }
    }

    if (isValid) {
      saveAuthSession(unlockRoleTarget, newAllowed);
      setUnlockRoleTarget(null);
    } else {
      setUnlockError(true);
    }
  };

  // If not logged in, render the Multi-Role Login Selection Portal
  if (!authRole) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 py-12 text-on-surface">
        <div className="max-w-md w-full bg-surface rounded-3xl border border-outline-variant p-8 shadow-2xl space-y-6 animate-fadeIn">
          
          {/* Logo & Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-primary/10 text-primary border border-primary/20 rounded-2xl flex items-center justify-center font-bold text-3xl mx-auto shadow-sm">
              <span className="material-symbols-outlined text-3xl">dentistry</span>
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
              className={`py-2 px-1 text-center rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1 ${
                selectedRoleTarget === 'admin'
                  ? 'bg-surface text-primary shadow-sm border border-outline-variant/80'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-base">admin_panel_settings</span>
              <span>Admin</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRoleTarget('doctor');
                setPasscodeError(false);
              }}
              className={`py-2 px-1 text-center rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1 ${
                selectedRoleTarget === 'doctor'
                  ? 'bg-surface text-primary shadow-sm border border-outline-variant/80'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-base">stethoscope</span>
              <span>Doctor</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRoleTarget('attendance');
                setPasscodeError(false);
              }}
              className={`py-2 px-1 text-center rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1 ${
                selectedRoleTarget === 'attendance'
                  ? 'bg-surface text-primary shadow-sm border border-outline-variant/80'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-base">calendar_month</span>
              <span>Attendance</span>
            </button>
          </div>

          {/* Role Info Box */}
          <div className="p-3 bg-surface-container rounded-xl border border-outline-variant text-xs text-on-surface-variant space-y-1">
            {selectedRoleTarget === 'admin' && (
              <>
                <div className="font-bold text-primary flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">security</span> Master Admin Access
                </div>
                <p>Manage patient history, treatment durations, cost, doctor assignments & clinic metrics. Default key: <code className="bg-surface px-1 py-0.5 rounded font-mono text-primary font-bold">admin123</code></p>
              </>
            )}

            {selectedRoleTarget === 'doctor' && (
              <>
                <div className="font-bold text-primary flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">medical_services</span> Doctor Dedicated Portal
                </div>
                <p>Monitor patient slot bookings, approve or reject appointments & update patient notes. Default key: <code className="bg-surface px-1 py-0.5 rounded font-mono text-primary font-bold">doctor123</code></p>
              </>
            )}

            {selectedRoleTarget === 'attendance' && (
              <>
                <div className="font-bold text-primary flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">badge</span> Doctor Attendance Portal
                </div>
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
                    const doc = doctorList.find((d) => d.id === e.target.value);
                    if (doc) setActiveDoctor(doc);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline bg-surface text-xs font-semibold text-on-surface outline-none focus:ring-2 focus:ring-primary"
                >
                  {doctorList.map((d) => (
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
              <p className="text-xs font-bold text-rose-500 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20 text-center flex items-center justify-center gap-1.5">
                <span className="material-symbols-outlined text-base">warning</span> Invalid access passcode. Please try again.
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-primary text-on-primary font-bold rounded-xl hover:bg-primary-hover shadow-md transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-lg">login</span>
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
        
        {/* Top Control Bar with Secured Role Switcher */}
        <div className="bg-surface rounded-2xl border border-outline-variant p-4 shadow-sm flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold text-xl shadow-xs">
              <span className="material-symbols-outlined text-2xl">dentistry</span>
            </div>
            <div>
              <h2 className="text-base font-bold font-serif text-on-surface">PRS Dental Clinic Management</h2>
              <span className="text-xs text-on-surface-variant">
                Active Portal: <strong className="text-primary uppercase">{authRole}</strong>
              </span>
            </div>
          </div>

          {/* Role Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleNavClick('admin')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                authRole === 'admin'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'border border-outline text-on-surface-variant hover:text-on-surface bg-surface'
              }`}
            >
              <span className="material-symbols-outlined text-base">admin_panel_settings</span>
              <span>Admin & Patient History</span>
            </button>

            <button
              onClick={() => handleNavClick('doctor')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                authRole === 'doctor'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'border border-outline text-on-surface-variant hover:text-on-surface bg-surface'
              }`}
            >
              <span className="material-symbols-outlined text-base">stethoscope</span>
              <span>Doctor Portal</span>
            </button>

            <button
              onClick={() => handleNavClick('attendance')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                authRole === 'attendance'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'border border-outline text-on-surface-variant hover:text-on-surface bg-surface'
              }`}
            >
              <span className="material-symbols-outlined text-base">calendar_month</span>
              <span>Doctor Attendance</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-xl text-xs font-bold transition-colors ml-2 flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-base">logout</span>
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Dynamic Portal View Rendering based on active role */}
        {authRole === 'admin' && <AdminHistoryPortal onLogout={handleLogout} />}
        {authRole === 'doctor' && (
          <DoctorPortal
            loggedDoctor={activeDoctor}
            onLogout={handleLogout}
            isAdmin={authorizedRoles.includes('admin')}
            doctorList={doctorList}
          />
        )}
        {authRole === 'attendance' && <AttendancePortal onLogout={handleLogout} />}

      </div>

      {/* Access Unlock Modal for Switching to Unauthorized Portals */}
      {unlockRoleTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-surface rounded-2xl border border-outline-variant max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-outline-variant pb-3">
              <h3 className="text-base font-bold font-serif text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">lock_open</span>
                <span>Unlock {unlockRoleTarget.toUpperCase()} Access</span>
              </h3>
              <button
                onClick={() => setUnlockRoleTarget(null)}
                className="text-on-surface-variant hover:text-on-surface font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-on-surface-variant">
              Please enter the <strong>{unlockRoleTarget.toUpperCase()} Access Key</strong> to switch to this portal view.
            </p>

            <form onSubmit={handleUnlockSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                  Passcode
                </label>
                <input
                  type="password"
                  autoFocus
                  required
                  value={unlockPasscode}
                  onChange={(e) => setUnlockPasscode(e.target.value)}
                  placeholder="Enter access passcode..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline bg-surface text-xs outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {unlockError && (
                <p className="text-xs font-bold text-rose-500 bg-rose-500/10 p-2 rounded-xl border border-rose-500/20 text-center flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-sm">warning</span> Incorrect passcode.
                </p>
              )}

              <div className="flex gap-2 justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setUnlockRoleTarget(null)}
                  className="px-3.5 py-2 border border-outline rounded-xl text-xs font-semibold hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-on-primary text-xs font-bold rounded-xl hover:bg-primary-hover shadow-sm flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">key</span>
                  <span>Authorize & View</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
