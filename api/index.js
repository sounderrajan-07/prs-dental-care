import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

// In-memory appointments store (populated live when users submit bookings)
let appointments = [];

// Helper function for email notification log
function sendStatusEmailNotification(appointment, status) {
  const recipient = appointment.email || 'patient@example.com';
  console.log(`[EMAIL DISPATCH] Sent ${status} confirmation email to: ${recipient}`);
  return {
    sent: true,
    recipient: recipient,
    subject: `PRS Dental Care: Your Appointment Request is ${status.toUpperCase()}`,
    body: `Dear ${appointment.name},\n\nYour appointment for ${appointment.service} on ${appointment.date} (${appointment.timeSlot}) has been ${status.toUpperCase()} by our clinic team.\n\nThank you,\nPRS Dental Care Team`
  };
}

// GET /api/appointments - Fetch all appointments
app.get('/api/appointments', (req, res) => {
  res.status(200).json({
    success: true,
    count: appointments.length,
    data: appointments
  });
});

// POST /api/appointments - Create new appointment
app.post('/api/appointments', (req, res) => {
  const { name, phone, email, service, preferredDoctor, date, timeSlot, notes } = req.body;

  if (!name || !phone || !service || !date) {
    return res.status(400).json({
      success: false,
      message: 'Please provide required fields: name, phone, service, date'
    });
  }

  const newAppointment = {
    id: `APT-${1000 + appointments.length + 1}`,
    name,
    phone,
    email: email || '',
    service,
    preferredDoctor: preferredDoctor || 'Any Available Specialist',
    date,
    timeSlot: timeSlot || '10:00 AM - 11:00 AM',
    notes: notes || '',
    status: 'Pending',
    createdAt: new Date().toISOString()
  };

  appointments.unshift(newAppointment);

  res.status(201).json({
    success: true,
    message: 'Appointment request submitted successfully',
    data: newAppointment
  });
});

// PUT /api/appointments/:id/status - Approve or reject appointment
app.put('/api/appointments/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status value. Must be Approved, Rejected, or Pending.'
    });
  }

  const appointment = appointments.find((apt) => apt.id === id);

  if (!appointment) {
    return res.status(404).json({
      success: false,
      message: `Appointment with ID ${id} not found.`
    });
  }

  appointment.status = status;
  const emailResult = sendStatusEmailNotification(appointment, status);

  res.status(200).json({
    success: true,
    message: `Appointment ${id} status updated to ${status}`,
    emailSent: emailResult.sent,
    emailRecipient: emailResult.recipient,
    data: appointment
  });
});

// DELETE /api/appointments/:id - Delete appointment
app.delete('/api/appointments/:id', (req, res) => {
  const { id } = req.params;
  const initialLength = appointments.length;
  appointments = appointments.filter((apt) => apt.id !== id);

  if (appointments.length === initialLength) {
    return res.status(404).json({
      success: false,
      message: `Appointment with ID ${id} not found.`
    });
  }

  res.status(200).json({
    success: true,
    message: `Appointment ${id} deleted successfully.`
  });
});

export default app;
