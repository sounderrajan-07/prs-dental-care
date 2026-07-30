import React, { useState, useEffect } from 'react';
import {
  getStoredDoctors,
  saveDoctorAccount,
  updateDoctorAccount,
  deleteDoctorAccount
} from '../utils/doctorStorage';

export default function AdminDoctorManagement() {
  const [doctors, setDoctors] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);

  // Form State
  const [docName, setDocName] = useState('');
  const [docSpec, setDocSpec] = useState('');
  const [docPhone, setDocPhone] = useState('');
  const [docEmail, setDocEmail] = useState('');
  const [docPasscode, setDocPasscode] = useState('');
  const [showPasscodes, setShowPasscodes] = useState({});
  const [actionMsg, setActionMsg] = useState('');

  const loadDoctors = () => {
    const list = getStoredDoctors();
    setDoctors(list);
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const handleCreateDoctor = (e) => {
    e.preventDefault();
    if (!docName.trim() || !docPasscode.trim()) return;

    saveDoctorAccount({
      name: docName,
      specialization: docSpec || 'Dental Specialist',
      phone: docPhone,
      email: docEmail,
      passcode: docPasscode
    });

    loadDoctors();
    setShowAddModal(false);
    setDocName('');
    setDocSpec('');
    setDocPhone('');
    setDocEmail('');
    setDocPasscode('');
    setActionMsg(`✓ New doctor account created for ${docName} with access code: ${docPasscode}`);
    setTimeout(() => setActionMsg(''), 5000);
  };

  const handleEditDoctor = (doc) => {
    setEditingDoc(doc);
    setDocName(doc.name);
    setDocSpec(doc.specialization);
    setDocPhone(doc.phone || '');
    setDocEmail(doc.email || '');
    setDocPasscode(doc.passcode || '');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingDoc) return;

    updateDoctorAccount(editingDoc.id, {
      name: docName,
      specialization: docSpec,
      phone: docPhone,
      email: docEmail,
      passcode: docPasscode
    });

    loadDoctors();
    setEditingDoc(null);
    setDocName('');
    setDocSpec('');
    setDocPhone('');
    setDocEmail('');
    setDocPasscode('');
    setActionMsg(`✓ Updated credentials for ${docName}`);
    setTimeout(() => setActionMsg(''), 4000);
  };

  const handleDelete = (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from clinic doctors?`)) return;
    deleteDoctorAccount(id);
    loadDoctors();
    setActionMsg(`Doctor account removed.`);
    setTimeout(() => setActionMsg(''), 3000);
  };

  const togglePasscodeVisibility = (id) => {
    setShowPasscodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-surface-container rounded-2xl border border-outline-variant p-6 shadow-sm space-y-4 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between pb-3 border-b border-outline-variant">
        <div>
          <h3 className="text-lg font-bold font-serif text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">stethoscope</span>
            <span>Doctor Credentials & Access Code Manager</span>
          </h3>
          <p className="text-xs text-on-surface-variant">Create doctor profiles, assign secret access codes & manage portal credentials</p>
        </div>

        <button
          onClick={() => {
            setDocName('');
            setDocSpec('');
            setDocPhone('');
            setDocEmail('');
            setDocPasscode(`doc${Math.floor(100 + Math.random() * 900)}`);
            setShowAddModal(true);
          }}
          className="px-4 py-2.5 bg-primary text-on-primary font-bold text-xs rounded-xl hover:bg-primary-hover shadow-md transition-all flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-base">person_add</span>
          <span>Add New Doctor Account</span>
        </button>
      </div>

      {actionMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-semibold rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>{actionMsg}</span>
        </div>
      )}

      {/* Doctors List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {doctors.map((doc) => (
          <div
            key={doc.id}
            className="bg-surface rounded-xl border border-outline-variant/80 p-5 hover:border-primary/50 transition-all shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] font-extrabold text-primary tracking-wider uppercase">{doc.id}</span>
                  <h4 className="text-base font-bold text-on-surface leading-tight mt-0.5">{doc.name}</h4>
                  <p className="text-xs text-on-surface-variant font-medium mt-0.5">{doc.specialization}</p>
                </div>
                <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full border border-primary/20">
                  Doctor Account
                </span>
              </div>

              <div className="mt-3 space-y-1.5 text-xs text-on-surface-variant">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-on-surface">Contact Phone:</span>
                  <span>📞 {doc.phone || 'Not set'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-on-surface">Email Address:</span>
                  <span>✉️ {doc.email || 'Not set'}</span>
                </div>

                {/* Access Code Box */}
                <div className="mt-3 p-3 bg-surface-container-high rounded-xl border border-primary/20 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Secret Portal Access Code</span>
                    <code className="text-sm font-bold text-primary font-mono tracking-wider">
                      {showPasscodes[doc.id] ? doc.passcode : '••••••••'}
                    </code>
                  </div>
                  <button
                    type="button"
                    onClick={() => togglePasscodeVisibility(doc.id)}
                    className="p-1.5 text-on-surface-variant hover:text-primary rounded-lg transition-colors"
                    title={showPasscodes[doc.id] ? "Hide Passcode" : "Show Passcode"}
                  >
                    <span className="material-symbols-outlined text-base">
                      {showPasscodes[doc.id] ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-3 border-t border-outline-variant/60 flex items-center justify-between">
              <button
                onClick={() => handleEditDoctor(doc)}
                className="px-3.5 py-1.5 border border-outline rounded-xl text-xs font-semibold hover:bg-surface-container-high transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-base">key</span>
                <span>Edit Credentials</span>
              </button>

              <button
                onClick={() => handleDelete(doc.id, doc.name)}
                className="px-3 py-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-500/10 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-base">delete</span>
                <span>Remove Doctor</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Doctor Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-surface rounded-2xl border border-outline-variant max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-outline-variant pb-3">
              <h3 className="text-base font-bold font-serif text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">person_add</span>
                <span>Create Doctor Profile & Access Code</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-on-surface-variant hover:text-on-surface font-bold text-sm">✕</button>
            </div>

            <form onSubmit={handleCreateDoctor} className="space-y-3.5 text-xs text-on-surface">
              <div>
                <label className="font-bold text-on-surface-variant uppercase block mb-1">Doctor Full Name *</label>
                <input
                  type="text"
                  required
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="e.g. Dr. K. Ramesh"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline bg-surface text-xs outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="font-bold text-on-surface-variant uppercase block mb-1">Specialization / Qualification *</label>
                <input
                  type="text"
                  required
                  value={docSpec}
                  onChange={(e) => setDocSpec(e.target.value)}
                  placeholder="e.g. M.D.S - Orthodontics & Dentofacial Specialist"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline bg-surface text-xs outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-on-surface-variant uppercase block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={docPhone}
                    onChange={(e) => setDocPhone(e.target.value)}
                    placeholder="+91 98401 22334"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline bg-surface text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-on-surface-variant uppercase block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={docEmail}
                    onChange={(e) => setDocEmail(e.target.value)}
                    placeholder="doctor@prs.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline bg-surface text-xs outline-none"
                  />
                </div>
              </div>

              <div className="bg-primary/5 p-3.5 rounded-xl border border-primary/20 space-y-1">
                <label className="font-bold text-primary uppercase block">Secret Doctor Access Passcode / Code *</label>
                <input
                  type="text"
                  required
                  value={docPasscode}
                  onChange={(e) => setDocPasscode(e.target.value)}
                  placeholder="e.g. ramesh123 or doc456"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline bg-surface font-mono font-bold text-primary text-sm outline-none"
                />
                <p className="text-[10px] text-on-surface-variant">This unique access code will be used by the doctor to log in into their isolated portal.</p>
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
                  Create Doctor Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Doctor Credentials Modal */}
      {editingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-surface rounded-2xl border border-outline-variant max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-outline-variant pb-3">
              <h3 className="text-base font-bold font-serif text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">key</span>
                <span>Edit Credentials - {editingDoc.name}</span>
              </h3>
              <button onClick={() => setEditingDoc(null)} className="text-on-surface-variant hover:text-on-surface font-bold text-sm">✕</button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs text-on-surface">
              <div>
                <label className="font-bold text-on-surface-variant uppercase block mb-1">Doctor Full Name</label>
                <input
                  type="text"
                  required
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline bg-surface text-xs outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-on-surface-variant uppercase block mb-1">Specialization</label>
                <input
                  type="text"
                  required
                  value={docSpec}
                  onChange={(e) => setDocSpec(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline bg-surface text-xs outline-none"
                />
              </div>

              <div className="bg-primary/5 p-3.5 rounded-xl border border-primary/20 space-y-1">
                <label className="font-bold text-primary uppercase block">Doctor Secret Access Code</label>
                <input
                  type="text"
                  required
                  value={docPasscode}
                  onChange={(e) => setDocPasscode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline bg-surface font-mono font-bold text-primary text-sm outline-none"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setEditingDoc(null)}
                  className="px-4 py-2 border border-outline rounded-xl font-semibold hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-on-primary font-bold rounded-xl hover:bg-primary-hover shadow-sm"
                >
                  Save Passcode Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
