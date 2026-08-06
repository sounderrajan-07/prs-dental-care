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
  const [docDegree, setDocDegree] = useState('M.D.S');
  const [docSpec, setDocSpec] = useState('');
  const [docExperience, setDocExperience] = useState('');
  const [docPhone, setDocPhone] = useState('');
  const [docEmail, setDocEmail] = useState('');
  const [docPasscode, setDocPasscode] = useState('');
  const [docIcon, setDocIcon] = useState('dentistry');

  const [showPasscodes, setShowPasscodes] = useState({});
  const [actionMsg, setActionMsg] = useState('');

  const loadDoctors = () => {
    const list = getStoredDoctors();
    setDoctors(list);
  };

  useEffect(() => {
    loadDoctors();
    window.addEventListener('prs_doctors_updated', loadDoctors);
    return () => window.removeEventListener('prs_doctors_updated', loadDoctors);
  }, []);

  const resetForm = () => {
    setDocName('');
    setDocDegree('M.D.S');
    setDocSpec('');
    setDocExperience('');
    setDocPhone('');
    setDocEmail('');
    setDocPasscode(`doc${Math.floor(100 + Math.random() * 900)}`);
    setDocIcon('dentistry');
  };

  const handleCreateDoctor = (e) => {
    e.preventDefault();
    if (!docName.trim() || !docPasscode.trim()) return;

    saveDoctorAccount({
      name: docName,
      degree: docDegree,
      specialization: docSpec || 'Dental Specialist',
      experience: docExperience || `${docDegree} Specialist at PRS Dental Care`,
      phone: docPhone,
      email: docEmail,
      passcode: docPasscode,
      icon: docIcon
    });

    loadDoctors();
    setShowAddModal(false);
    resetForm();
    setActionMsg(`✓ Created profile for ${docName}. Changes are now live on About Us & Appointment Booking!`);
    setTimeout(() => setActionMsg(''), 5000);
  };

  const handleEditDoctor = (doc) => {
    setEditingDoc(doc);
    setDocName(doc.name);
    setDocDegree(doc.degree || 'M.D.S');
    setDocSpec(doc.specialization);
    setDocExperience(doc.experience || '');
    setDocPhone(doc.phone || '');
    setDocEmail(doc.email || '');
    setDocPasscode(doc.passcode || '');
    setDocIcon(doc.icon || 'dentistry');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingDoc) return;

    updateDoctorAccount(editingDoc.id, {
      name: docName,
      degree: docDegree,
      specialization: docSpec,
      experience: docExperience,
      phone: docPhone,
      email: docEmail,
      passcode: docPasscode,
      icon: docIcon
    });

    loadDoctors();
    setEditingDoc(null);
    resetForm();
    setActionMsg(`✓ Saved changes for ${docName}. Website pages updated.`);
    setTimeout(() => setActionMsg(''), 4000);
  };

  const handleDelete = (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name}? This will update About Us and Appointment booking forms.`)) return;
    deleteDoctorAccount(id);
    loadDoctors();
    setActionMsg(`Doctor profile removed.`);
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
            <span>Doctor Directory & Security Key Manager</span>
          </h3>
          <p className="text-xs text-on-surface-variant">Add, edit, or delete doctors. Updates instantly reflect on the website About Us page & Appointment forms.</p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="px-4 py-2.5 bg-primary text-on-primary font-bold text-xs rounded-xl hover:bg-primary-hover shadow-md transition-all flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-base">person_add</span>
          <span>Add New Doctor Profile</span>
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
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm border border-primary/20">
                    {doc.initials || 'DR'}
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-primary tracking-wider uppercase">{doc.id}</span>
                    <h4 className="text-base font-bold text-on-surface leading-tight">{doc.name}</h4>
                    <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full inline-block mt-0.5">
                      {doc.degree || 'M.D.S'}
                    </span>
                  </div>
                </div>

                <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold rounded-full border border-emerald-500/20">
                  Active
                </span>
              </div>

              <div className="mt-3 space-y-2 text-xs text-on-surface-variant">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span className="font-semibold text-on-surface shrink-0">Specialty:</span>
                  <span className="text-primary font-semibold break-words">{doc.specialization}</span>
                </div>
                {doc.experience && (
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="font-semibold text-on-surface shrink-0">Experience/Bio:</span>
                    <span className="break-words">{doc.experience}</span>
                  </div>
                )}
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span className="font-semibold text-on-surface shrink-0">Contact:</span>
                  <span className="break-all font-medium">📞 {doc.phone || 'Not set'} • ✉️ {doc.email || 'Not set'}</span>
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
                <span className="material-symbols-outlined text-base">edit</span>
                <span>Edit Profile & Passcode</span>
              </button>

              <button
                onClick={() => handleDelete(doc.id, doc.name)}
                className="px-3 py-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-500/10 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-base">delete</span>
                <span>Delete Doctor</span>
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
                <span>Add Doctor & Access Credentials</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-on-surface-variant hover:text-on-surface font-bold text-sm">✕</button>
            </div>

            <form onSubmit={handleCreateDoctor} className="space-y-3.5 text-xs text-on-surface">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="font-bold text-on-surface-variant uppercase block mb-1">Doctor Name *</label>
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
                  <label className="font-bold text-on-surface-variant uppercase block mb-1">Degree</label>
                  <input
                    type="text"
                    value={docDegree}
                    onChange={(e) => setDocDegree(e.target.value)}
                    placeholder="M.D.S"
                    className="w-full px-3 py-2.5 rounded-xl border border-outline bg-surface text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-on-surface-variant uppercase block mb-1">Specialization / Department *</label>
                <input
                  type="text"
                  required
                  value={docSpec}
                  onChange={(e) => setDocSpec(e.target.value)}
                  placeholder="e.g. Orthodontics & Dentofacial Specialist"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline bg-surface text-xs outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="font-bold text-on-surface-variant uppercase block mb-1">Experience / Bio History</label>
                <input
                  type="text"
                  value={docExperience}
                  onChange={(e) => setDocExperience(e.target.value)}
                  placeholder="e.g. 10+ Years Experience in Clear Aligners"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline bg-surface text-xs outline-none"
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
                <label className="font-bold text-primary uppercase block">Doctor Secret Access Code *</label>
                <input
                  type="text"
                  required
                  value={docPasscode}
                  onChange={(e) => setDocPasscode(e.target.value)}
                  placeholder="e.g. ramesh123 or doc456"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline bg-surface font-mono font-bold text-primary text-sm outline-none"
                />
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
                  Create & Publish Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Doctor Modal */}
      {editingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-surface rounded-2xl border border-outline-variant max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-outline-variant pb-3">
              <h3 className="text-base font-bold font-serif text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">edit</span>
                <span>Edit Doctor - {editingDoc.name}</span>
              </h3>
              <button onClick={() => setEditingDoc(null)} className="text-on-surface-variant hover:text-on-surface font-bold text-sm">✕</button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs text-on-surface">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="font-bold text-on-surface-variant uppercase block mb-1">Doctor Name</label>
                  <input
                    type="text"
                    required
                    value={docName}
                    onChange={(e) => setDocName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline bg-surface text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-on-surface-variant uppercase block mb-1">Degree</label>
                  <input
                    type="text"
                    value={docDegree}
                    onChange={(e) => setDocDegree(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline bg-surface text-xs outline-none"
                  />
                </div>
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

              <div>
                <label className="font-bold text-on-surface-variant uppercase block mb-1">Experience / Bio</label>
                <input
                  type="text"
                  value={docExperience}
                  onChange={(e) => setDocExperience(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline bg-surface text-xs outline-none"
                />
              </div>

              <div className="bg-primary/5 p-3.5 rounded-xl border border-primary/20 space-y-1">
                <label className="font-bold text-primary uppercase block">Doctor Access Code</label>
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
                  Save & Sync Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
