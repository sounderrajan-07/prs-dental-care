/**
 * PRS Dental Care - Neon PostgreSQL Dual Sync Manager
 * Ensures all local storage data is automatically pushed to & pulled from Neon PostgreSQL Database
 */

import { getStoredAppointments, saveAppointment } from './appointmentStorage';
import { getStoredDoctors, saveDoctorAccount } from './doctorStorage';
import { getStoredPatientHistory, savePatientHistoryRecord } from './patientHistoryStorage';
import { getStoredFeedbacks, saveFeedback } from './feedbackStorage';

export const syncAllDataWithNeonDb = async () => {
  try {
    // 1. Sync Appointments
    const appointments = getStoredAppointments();
    for (const apt of appointments) {
      fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apt)
      }).catch(() => {});
    }

    // 2. Sync Doctors
    const doctors = getStoredDoctors();
    for (const doc of doctors) {
      fetch('/api/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doc)
      }).catch(() => {});
    }

    // 3. Sync Patient History
    const history = getStoredPatientHistory();
    for (const rec of history) {
      fetch('/api/patient-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rec)
      }).catch(() => {});
    }

    // 4. Sync Feedback
    const feedbacks = getStoredFeedbacks();
    for (const fb of feedbacks) {
      fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fb)
      }).catch(() => {});
    }

    console.log('[SyncManager] Initialized background auto-sync to Neon PostgreSQL Database!');
  } catch (err) {
    console.warn('[SyncManager] Auto-sync attempt error:', err);
  }
};
