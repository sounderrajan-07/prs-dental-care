import React, { useState } from 'react';
import { saveFeedback } from '../utils/feedbackStorage';

export default function PatientFeedbackForm() {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [treatment, setTreatment] = useState('Root Canal Treatment');
  const [customTreatment, setCustomTreatment] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    const finalTreatment = treatment === 'Other' ? (customTreatment || 'Dental Care') : treatment;

    saveFeedback({
      name,
      phone,
      rating,
      treatment: finalTreatment,
      comment,
      date
    });

    setSubmitted(true);
    setName('');
    setPhone('');
    setComment('');
    setRating(5);
    setTimeout(() => setSubmitted(false), 6000);
  };

  return (
    <section className="py-16 px-4 bg-surface relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center mb-8">
        <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider mb-2">
          Patient Experience & Feedback
        </span>
        <h2 className="text-3xl font-extrabold text-on-surface tracking-tight mb-2 font-display">
          Share Your Dental Care Feedback
        </h2>
        <p className="text-xs sm:text-sm text-on-surface-variant max-w-xl mx-auto">
          We value your experience at PRS Dental Care! Rate your treatment and leave a review to help us continue providing exceptional dental care.
        </p>
      </div>

      <div className="max-w-2xl mx-auto bg-surface-container rounded-3xl p-6 sm:p-8 border border-outline-variant/60 shadow-xl">
        {submitted ? (
          <div className="text-center py-8 space-y-4 animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/20">
              <span className="material-symbols-outlined text-4xl">task_alt</span>
            </div>
            <h3 className="text-xl font-bold font-serif text-on-surface">Thank You For Your Feedback!</h3>
            <p className="text-xs text-on-surface-variant max-w-md mx-auto">
              Your feedback has been submitted successfully for verification. Once reviewed and approved by our clinic admin, your testimonial will appear publicly on our website!
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="px-5 py-2.5 bg-primary text-on-primary font-bold text-xs rounded-xl hover:bg-primary-hover transition-all"
            >
              Submit Another Review
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 text-xs text-on-surface">
            {/* Interactive Star Rating Selector */}
            <div className="text-center bg-surface p-4 rounded-2xl border border-outline-variant/40 space-y-2">
              <label className="font-bold text-on-surface-variant uppercase tracking-wider block">
                Rate Your Overall Treatment Experience
              </label>
              <div className="flex justify-center items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-125 focus:outline-none"
                  >
                    <span
                      className={`material-symbols-outlined text-3xl sm:text-4xl transition-colors ${
                        star <= (hoverRating || rating) ? 'text-amber-500' : 'text-outline-variant/60'
                      }`}
                      style={{ fontVariationSettings: star <= (hoverRating || rating) ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      star
                    </span>
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-primary block">
                {rating === 5 ? 'Excellent (5/5)' : rating === 4 ? 'Very Good (4/5)' : rating === 3 ? 'Good (3/5)' : 'Needs Improvement'}
              </span>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="feedback-name" className="font-bold text-on-surface-variant uppercase block mb-1">Your Full Name *</label>
                <input
                  id="feedback-name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Anand Saravanan"
                  autoComplete="name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline bg-surface text-xs font-medium outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="feedback-phone" className="font-bold text-on-surface-variant uppercase block mb-1">Contact Number (Phone) *</label>
                <input
                  id="feedback-phone"
                  name="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  autoComplete="tel"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline bg-surface text-xs font-medium outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="feedback-treatment" className="font-bold text-on-surface-variant uppercase block mb-1">Treatment Received *</label>
                <select
                  id="feedback-treatment"
                  name="treatment"
                  value={treatment}
                  onChange={(e) => setTreatment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline bg-surface text-xs font-semibold outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Root Canal Treatment">Root Canal Treatment</option>
                  <option value="Laser Teeth Whitening">Laser Teeth Whitening</option>
                  <option value="Dental Implants">Dental Implants & Crown</option>
                  <option value="Invisalign & Braces">Invisalign & Clear Aligners</option>
                  <option value="Tooth Extraction">Painless Tooth Extraction</option>
                  <option value="Pediatric Dentistry">Pediatric Dental Care</option>
                  <option value="Cleaning & Polishing">Full Mouth Scaling & Polishing</option>
                  <option value="Tooth Filling">Composite Tooth Filling</option>
                  <option value="Other">Other Treatment</option>
                </select>
                {treatment === 'Other' && (
                  <input
                    id="feedback-custom-treatment"
                    name="customTreatment"
                    type="text"
                    required
                    value={customTreatment}
                    onChange={(e) => setCustomTreatment(e.target.value)}
                    placeholder="Enter treatment name..."
                    className="w-full mt-2 px-3.5 py-2 rounded-xl border border-outline bg-surface text-xs outline-none"
                  />
                )}
              </div>

              <div>
                <label htmlFor="feedback-date" className="font-bold text-on-surface-variant uppercase block mb-1">Treatment / Visit Date</label>
                <input
                  id="feedback-date"
                  name="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline bg-surface text-xs font-medium outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label htmlFor="feedback-comment" className="font-bold text-on-surface-variant uppercase block mb-1">Your Detailed Feedback & Review *</label>
              <textarea
                id="feedback-comment"
                name="comment"
                rows="4"
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your doctor experience, comfort level, hygiene, or treatment results..."
                className="w-full px-3.5 py-3 rounded-xl border border-outline bg-surface text-xs outline-none focus:ring-2 focus:ring-primary"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-primary text-on-primary font-bold rounded-xl hover:bg-primary-hover shadow-md transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">rate_review</span>
              <span>Submit Patient Review For Approval</span>
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
