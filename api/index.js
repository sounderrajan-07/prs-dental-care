import express from 'express';
import cors from 'cors';
import sql, { isDbConnected, initDbSchema } from './db.js';

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

// In-memory fallback stores (used if NEON_DATABASE_URL is not set yet)
let memoryStore = {
  appointments: [],
  doctors: [],
  attendance: [],
  patientHistory: [],
  feedback: [],
  notifications: []
};

// Initialize Neon DB Schema on server boot
initDbSchema().catch((err) => console.log('Schema init fallback:', err));

// ----------------------------------------------------
// 0. HEALTH CHECK & NEON DB STATUS
// ----------------------------------------------------
app.get('/api/db-status', async (req, res) => {
  const connected = isDbConnected();
  if (connected && sql) {
    try {
      const [{ count: aptCount }] = await sql`SELECT count(*)::int FROM appointments`;
      const [{ count: docCount }] = await sql`SELECT count(*)::int FROM doctors`;
      const [{ count: attCount }] = await sql`SELECT count(*)::int FROM attendance`;
      return res.status(200).json({
        success: true,
        provider: 'Neon PostgreSQL Serverless',
        connected: true,
        tableCounts: {
          appointments: aptCount,
          doctors: docCount,
          attendance: attCount
        }
      });
    } catch (err) {
      return res.status(200).json({
        success: true,
        provider: 'Neon PostgreSQL',
        connected: true,
        error: err.message
      });
    }
  }

  res.status(200).json({
    success: true,
    provider: 'Local Storage / In-Memory Fallback',
    connected: false,
    message: 'Set NEON_DATABASE_URL environment variable in Vercel to activate Neon PostgreSQL.'
  });
});

// ----------------------------------------------------
// 0.1 NOTIFICATION DISPATCH LOGGING ENDPOINT (SMS & WHATSAPP)
// ----------------------------------------------------
app.post('/api/notifications/send', async (req, res) => {
  const { appointmentId, patientName, patientPhone, cleanPhone, status, remarksOrReason, waText, smsText, dispatchedAt } = req.body;

  const notificationRecord = {
    id: `NTF-${Date.now()}`,
    appointmentId,
    patientName,
    patientPhone,
    cleanPhone,
    status,
    remarksOrReason: remarksOrReason || '',
    whatsappStatus: 'DISPATCHED',
    smsStatus: 'DISPATCHED',
    dispatchedAt: dispatchedAt || new Date().toISOString()
  };

  memoryStore.notifications.unshift(notificationRecord);

  console.log(`[SMS & WHATSAPP DISPATCH] Appointment ${appointmentId} (${patientName}) status set to ${status}. Notification sent to +${cleanPhone}`);

  return res.status(200).json({
    success: true,
    message: `Automated SMS & WhatsApp notification recorded for ${patientName}`,
    data: notificationRecord
  });
});

app.get('/api/notifications', (req, res) => {
  res.status(200).json({
    success: true,
    count: memoryStore.notifications.length,
    data: memoryStore.notifications
  });
});

// ----------------------------------------------------
// 1. APPOINTMENTS ENDPOINTS
// ----------------------------------------------------
app.get('/api/appointments', async (req, res) => {
  if (sql) {
    try {
      const rows = await sql`SELECT * FROM appointments ORDER BY created_at DESC`;
      return res.status(200).json({ success: true, count: rows.length, data: rows });
    } catch (err) {
      console.error('Fetch appointments error:', err);
    }
  }
  res.status(200).json({ success: true, count: memoryStore.appointments.length, data: memoryStore.appointments });
});

app.post('/api/appointments', async (req, res) => {
  const { name, phone, email, service, preferredDoctor, date, timeSlot, notes } = req.body;
  if (!name || !phone || !service || !date) {
    return res.status(400).json({ success: false, message: 'Missing required fields: name, phone, service, date' });
  }

  const id = `APT-${Date.now().toString().slice(-6)}`;
  const newApt = {
    id,
    name,
    phone,
    email: email || '',
    service,
    preferred_doctor: preferredDoctor || 'Any Available Specialist',
    date,
    time_slot: timeSlot || '10:00 AM - 11:00 AM',
    notes: notes || '',
    status: 'Pending',
    created_at: new Date().toISOString()
  };

  if (sql) {
    try {
      await sql`
        INSERT INTO appointments (id, name, phone, email, service, preferred_doctor, date, time_slot, notes, status)
        VALUES (${newApt.id}, ${newApt.name}, ${newApt.phone}, ${newApt.email}, ${newApt.service}, ${newApt.preferred_doctor}, ${newApt.date}, ${newApt.time_slot}, ${newApt.notes}, ${newApt.status})
      `;
      return res.status(201).json({ success: true, message: 'Appointment created in Neon DB', data: newApt });
    } catch (err) {
      console.error('Insert appointment error:', err);
    }
  }

  memoryStore.appointments.unshift(newApt);
  res.status(201).json({ success: true, message: 'Appointment saved', data: newApt });
});

app.put('/api/appointments/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (sql) {
    try {
      await sql`UPDATE appointments SET status = ${status} WHERE id = ${id}`;
      return res.status(200).json({ success: true, message: `Appointment ${id} status updated to ${status}` });
    } catch (err) {
      console.error('Update appointment status error:', err);
    }
  }

  const item = memoryStore.appointments.find((a) => a.id === id);
  if (item) item.status = status;
  res.status(200).json({ success: true, message: `Updated status for ${id}` });
});

app.delete('/api/appointments/:id', async (req, res) => {
  const { id } = req.params;
  if (sql) {
    try {
      await sql`DELETE FROM appointments WHERE id = ${id}`;
      return res.status(200).json({ success: true, message: `Appointment ${id} deleted` });
    } catch (err) {
      console.error('Delete appointment error:', err);
    }
  }
  memoryStore.appointments = memoryStore.appointments.filter((a) => a.id !== id);
  res.status(200).json({ success: true, message: `Appointment ${id} deleted` });
});

// ----------------------------------------------------
// 2. DOCTORS ENDPOINTS
// ----------------------------------------------------
app.get('/api/doctors', async (req, res) => {
  if (sql) {
    try {
      const rows = await sql`SELECT * FROM doctors ORDER BY created_at ASC`;
      return res.status(200).json({ success: true, count: rows.length, data: rows });
    } catch (err) {
      console.error('Fetch doctors error:', err);
    }
  }
  res.status(200).json({ success: true, data: memoryStore.doctors });
});

app.post('/api/doctors', async (req, res) => {
  const { name, degree, specialization, experience, phone, email, passcode } = req.body;
  const id = `doc_${Date.now()}`;
  const newDoc = { id, name, degree: degree || '', specialization, experience: experience || '', phone: phone || '', email: email || '', passcode };

  if (sql) {
    try {
      await sql`
        INSERT INTO doctors (id, name, degree, specialization, experience, phone, email, passcode)
        VALUES (${newDoc.id}, ${newDoc.name}, ${newDoc.degree}, ${newDoc.specialization}, ${newDoc.experience}, ${newDoc.phone}, ${newDoc.email}, ${newDoc.passcode})
      `;
      return res.status(201).json({ success: true, message: 'Doctor saved in Neon DB', data: newDoc });
    } catch (err) {
      console.error('Insert doctor error:', err);
    }
  }

  memoryStore.doctors.push(newDoc);
  res.status(201).json({ success: true, data: newDoc });
});

// ----------------------------------------------------
// 3. ATTENDANCE ENDPOINTS
// ----------------------------------------------------
app.get('/api/attendance', async (req, res) => {
  if (sql) {
    try {
      const rows = await sql`SELECT * FROM attendance ORDER BY date DESC, marked_at DESC`;
      return res.status(200).json({ success: true, count: rows.length, data: rows });
    } catch (err) {
      console.error('Fetch attendance error:', err);
    }
  }
  res.status(200).json({ success: true, data: memoryStore.attendance });
});

app.post('/api/attendance', async (req, res) => {
  const { doctorId, doctorName, specialization, date, shift, status, checkInTime, checkOutTime, workingHours, remarks } = req.body;
  const id = `ATT-${doctorId}-${date}`;
  const entry = { id, doctor_id: doctorId, doctor_name: doctorName, specialization, date, shift, status, check_in_time: checkInTime, check_out_time: checkOutTime, working_hours: workingHours, remarks };

  if (sql) {
    try {
      await sql`
        INSERT INTO attendance (id, doctor_id, doctor_name, specialization, date, shift, status, check_in_time, check_out_time, working_hours, remarks)
        VALUES (${entry.id}, ${entry.doctor_id}, ${entry.doctor_name}, ${entry.specialization}, ${entry.date}, ${entry.shift}, ${entry.status}, ${entry.check_in_time}, ${entry.check_out_time}, ${entry.working_hours}, ${entry.remarks})
        ON CONFLICT (id) DO UPDATE SET
          shift = EXCLUDED.shift,
          status = EXCLUDED.status,
          check_in_time = EXCLUDED.check_in_time,
          check_out_time = EXCLUDED.check_out_time,
          working_hours = EXCLUDED.working_hours,
          remarks = EXCLUDED.remarks,
          marked_at = CURRENT_TIMESTAMP
      `;
      return res.status(200).json({ success: true, message: 'Attendance record upserted in Neon DB', data: entry });
    } catch (err) {
      console.error('Attendance insert error:', err);
    }
  }

  memoryStore.attendance.unshift(entry);
  res.status(200).json({ success: true, data: entry });
});

// ----------------------------------------------------
// 4. PATIENT FEEDBACK & REVIEWS ENDPOINTS
// ----------------------------------------------------
app.get('/api/feedback', async (req, res) => {
  if (sql) {
    try {
      const rows = await sql`SELECT * FROM patient_feedback ORDER BY created_at DESC`;
      return res.status(200).json({ success: true, count: rows.length, data: rows });
    } catch (err) {
      console.error('Fetch feedback error:', err);
    }
  }
  res.status(200).json({ success: true, data: memoryStore.feedback });
});

app.post('/api/feedback', async (req, res) => {
  const { id, name, phone, rating, treatment, comment, date, status } = req.body;
  if (!name || !comment) {
    return res.status(400).json({ success: false, message: 'Missing required fields: name, comment' });
  }

  const fbId = id || `FB-${Date.now().toString().slice(-6)}`;
  const newFb = {
    id: fbId,
    name,
    phone: phone || '',
    rating: Number(rating) || 5,
    treatment: treatment || 'General Dental Care',
    comment,
    date: date || new Date().toISOString().split('T')[0],
    status: status || 'Pending',
    created_at: new Date().toISOString()
  };

  if (sql) {
    try {
      await sql`
        INSERT INTO patient_feedback (id, name, phone, rating, treatment, comment, date, status)
        VALUES (${newFb.id}, ${newFb.name}, ${newFb.phone}, ${newFb.rating}, ${newFb.treatment}, ${newFb.comment}, ${newFb.date}, ${newFb.status})
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          phone = EXCLUDED.phone,
          rating = EXCLUDED.rating,
          treatment = EXCLUDED.treatment,
          comment = EXCLUDED.comment,
          date = EXCLUDED.date,
          status = EXCLUDED.status
      `;
      console.log(`[Neon DB Sync] Feedback ${newFb.id} (${newFb.name}) saved in Neon PostgreSQL.`);
      return res.status(201).json({ success: true, message: 'Feedback saved in Neon DB', data: newFb });
    } catch (err) {
      console.error('Insert feedback error:', err);
    }
  }

  memoryStore.feedback.unshift(newFb);
  res.status(201).json({ success: true, message: 'Feedback saved locally', data: newFb });
});

app.put('/api/feedback/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (sql) {
    try {
      await sql`UPDATE patient_feedback SET status = ${status} WHERE id = ${id}`;
      console.log(`[Neon DB Sync] Feedback ${id} status updated to ${status} in Neon PostgreSQL.`);
      return res.status(200).json({ success: true, message: `Feedback ${id} status updated to ${status}` });
    } catch (err) {
      console.error('Update feedback status error:', err);
    }
  }

  const item = memoryStore.feedback.find((f) => f.id === id);
  if (item) item.status = status;
  res.status(200).json({ success: true, message: `Updated status for feedback ${id}` });
});

app.delete('/api/feedback/:id', async (req, res) => {
  const { id } = req.params;
  if (sql) {
    try {
      await sql`DELETE FROM patient_feedback WHERE id = ${id}`;
      return res.status(200).json({ success: true, message: `Feedback ${id} deleted` });
    } catch (err) {
      console.error('Delete feedback error:', err);
    }
  }
  memoryStore.feedback = memoryStore.feedback.filter((f) => f.id !== id);
  res.status(200).json({ success: true, message: `Feedback ${id} deleted` });
});

// ----------------------------------------------------
// 5. PATIENT HISTORY ENDPOINTS
// ----------------------------------------------------
app.get('/api/patient-history', async (req, res) => {
  if (sql) {
    try {
      const rows = await sql`SELECT * FROM patient_history ORDER BY treatment_date DESC, created_at DESC`;
      return res.status(200).json({ success: true, count: rows.length, data: rows });
    } catch (err) {
      console.error('Fetch patient history error:', err);
    }
  }
  res.status(200).json({ success: true, data: memoryStore.patientHistory });
});

app.post('/api/patient-history', async (req, res) => {
  const { id, patientName, patientPhone, patientEmail, treatmentName, attendingDoctor, doctorSpecialization, treatmentDate, timeSlot, duration, cost, status, notes } = req.body;
  const recId = id || `HIS-${Date.now().toString().slice(-6)}`;
  const record = {
    id: recId,
    patient_name: patientName,
    patient_phone: patientPhone || '',
    patient_email: patientEmail || '',
    treatment_name: treatmentName,
    attending_doctor: attendingDoctor || '',
    doctor_specialization: doctorSpecialization || '',
    treatment_date: treatmentDate || new Date().toISOString().split('T')[0],
    time_slot: timeSlot || '',
    duration: duration || '45 mins',
    cost: cost || '₹0',
    status: status || 'Completed',
    notes: notes || ''
  };

  if (sql) {
    try {
      await sql`
        INSERT INTO patient_history (id, patient_name, patient_phone, patient_email, treatment_name, attending_doctor, doctor_specialization, treatment_date, time_slot, duration, cost, status, notes)
        VALUES (${record.id}, ${record.patient_name}, ${record.patient_phone}, ${record.patient_email}, ${record.treatment_name}, ${record.attending_doctor}, ${record.doctor_specialization}, ${record.treatment_date}, ${record.time_slot}, ${record.duration}, ${record.cost}, ${record.status}, ${record.notes})
        ON CONFLICT (id) DO UPDATE SET
          patient_name = EXCLUDED.patient_name,
          patient_phone = EXCLUDED.patient_phone,
          treatment_name = EXCLUDED.treatment_name,
          attending_doctor = EXCLUDED.attending_doctor,
          status = EXCLUDED.status,
          notes = EXCLUDED.notes
      `;
      console.log(`[Neon DB Sync] Patient history record ${record.id} (${record.patient_name}) saved in Neon PostgreSQL.`);
      return res.status(201).json({ success: true, message: 'Patient history record saved in Neon DB', data: record });
    } catch (err) {
      console.error('Insert patient history error:', err);
    }
  }

  memoryStore.patientHistory.unshift(record);
  res.status(201).json({ success: true, data: record });
});

app.delete('/api/patient-history/:id', async (req, res) => {
  const { id } = req.params;
  if (sql) {
    try {
      await sql`DELETE FROM patient_history WHERE id = ${id}`;
      return res.status(200).json({ success: true, message: `Patient history record ${id} deleted` });
    } catch (err) {
      console.error('Delete patient history error:', err);
    }
  }
  memoryStore.patientHistory = memoryStore.patientHistory.filter((h) => h.id !== id);
  res.status(200).json({ success: true, message: `Patient history record ${id} deleted` });
});

export default app;
