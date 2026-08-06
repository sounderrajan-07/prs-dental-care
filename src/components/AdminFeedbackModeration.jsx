import React, { useState, useEffect } from 'react';
import {
  getStoredFeedbacks,
  updateFeedbackStatus,
  deleteStoredFeedback
} from '../utils/feedbackStorage';

export default function AdminFeedbackModeration() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All'); // 'All', 'Pending', 'Approved', 'Rejected'
  const [actionMessage, setActionMessage] = useState('');

  const loadFeedbacks = () => {
    const data = getStoredFeedbacks();
    setFeedbacks(data);
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const handleApprove = (id) => {
    updateFeedbackStatus(id, 'Approved');
    loadFeedbacks();
    setActionMessage(`✓ Review ${id} approved! It is now live in the homepage testimonials.`);
    setTimeout(() => setActionMessage(''), 4000);
  };

  const handleReject = (id) => {
    updateFeedbackStatus(id, 'Rejected');
    loadFeedbacks();
    setActionMessage(`Review ${id} rejected.`);
    setTimeout(() => setActionMessage(''), 3000);
  };

  const handleDelete = (id) => {
    if (!window.confirm(`Are you sure you want to delete feedback ${id}?`)) return;
    deleteStoredFeedback(id);
    loadFeedbacks();
    setActionMessage(`Feedback ${id} deleted.`);
    setTimeout(() => setActionMessage(''), 3000);
  };

  const filteredFeedbacks = feedbacks.filter((fb) => {
    if (activeFilter === 'All') return true;
    return fb.status === activeFilter;
  });

  const counts = {
    Pending: feedbacks.filter((f) => f.status === 'Pending').length,
    Approved: feedbacks.filter((f) => f.status === 'Approved').length,
    Rejected: feedbacks.filter((f) => f.status === 'Rejected').length,
    All: feedbacks.length
  };

  return (
    <div className="bg-surface-container rounded-2xl border border-outline-variant p-6 shadow-sm space-y-4 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between pb-3 border-b border-outline-variant">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold font-serif text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">rate_review</span>
              <span>Patient Feedback Moderation</span>
            </h3>
            {counts.Pending > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold text-xs border border-amber-500/30 animate-pulse">
                {counts.Pending} Pending Approval
              </span>
            )}
          </div>
          <p className="text-xs text-on-surface-variant">Review submitted ratings & comments before displaying publicly on website</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex bg-surface-container-low p-1 rounded-xl border border-outline-variant/60">
          {['Pending', 'Approved', 'Rejected', 'All'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeFilter === tab
                  ? 'bg-surface text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {tab} ({counts[tab] || 0})
            </button>
          ))}
        </div>
      </div>

      {actionMessage && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-semibold rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Feedbacks Grid / List */}
      {filteredFeedbacks.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-outline-variant rounded-xl bg-surface">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant">rate_review</span>
          <h4 className="text-sm font-bold text-on-surface mt-2">No feedbacks in {activeFilter} status</h4>
          <p className="text-xs text-on-surface-variant mt-0.5">Submitted patient reviews will appear here for admin moderation.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFeedbacks.map((fb) => (
            <div
              key={fb.id}
              className="bg-surface rounded-xl border border-outline-variant/80 p-5 hover:border-primary/50 transition-all shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-extrabold text-primary tracking-wider uppercase">{fb.id}</span>
                    <h4 className="text-base font-bold text-on-surface leading-tight mt-0.5">{fb.name}</h4>
                    <p className="text-xs text-on-surface-variant font-medium flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-xs text-primary">call</span>
                      <span>{fb.phone || 'No Contact Provided'}</span>
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
                      fb.status === 'Approved'
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                        : fb.status === 'Rejected'
                        ? 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30'
                        : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30'
                    }`}
                  >
                    {fb.status}
                  </span>
                </div>

                {/* Rating Stars & Treatment info */}
                <div className="mt-3 space-y-1.5 text-xs text-on-surface-variant">
                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-500">
                      {[...Array(fb.rating || 5)].map((_, i) => (
                        <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                          star
                        </span>
                      ))}
                    </div>
                    <span className="font-bold text-on-surface">({fb.rating}/5 Stars)</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-on-surface">Treatment:</span>
                    <span className="text-primary font-bold">{fb.treatment}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-on-surface">Visit Date:</span>
                    <span className="flex items-center gap-1 text-on-surface font-medium">
                      <span className="material-symbols-outlined text-xs text-primary">calendar_today</span>
                      <span>{fb.date}</span>
                    </span>
                  </div>

                  <div className="mt-2 p-3 bg-surface-container-low rounded-lg border border-outline-variant/40 text-xs italic text-on-surface">
                    "{fb.comment}"
                  </div>
                </div>
              </div>

              {/* Moderation Actions */}
              <div className="mt-4 pt-3 border-t border-outline-variant/60 flex flex-wrap gap-2 items-center justify-between">
                <div className="flex gap-2">
                  {fb.status !== 'Approved' && (
                    <button
                      onClick={() => handleApprove(fb.id)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-base">check_circle</span>
                      <span>Approve Review</span>
                    </button>
                  )}
                  {fb.status !== 'Rejected' && (
                    <button
                      onClick={() => handleReject(fb.id)}
                      className="px-3 py-1.5 bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-base">block</span>
                      <span>Reject</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(fb.id)}
                  className="px-2.5 py-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-500/10 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-base">delete</span>
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
