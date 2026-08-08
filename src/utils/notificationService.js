/**
 * PRS Dental Care - Automated Notification Service (SMS & WhatsApp)
 */

export const cleanPhoneNumber = (phoneStr) => {
  if (!phoneStr) return '';
  let digits = phoneStr.replace(/[^0-9]/g, '');
  if (digits.length === 10) {
    digits = '91' + digits;
  }
  return digits;
};

export const generateAppointmentMessage = (apt, status, remarksOrReason = '') => {
  const isApproved = status === 'Approved';
  const docName = apt.preferredDoctor || 'PRS Specialist Dentist';
  const clinicAddress = '58/150, Red Hills Road, Kolathur, Chennai - 600099';
  const clinicHelpline = '+91 72007 18607';

  if (isApproved) {
    const waText = 
`🏥 *PRS DENTAL CARE - APPOINTMENT CONFIRMED*

Hello *${apt.name}*,

Great news! Your appointment booking has been *APPROVED* by our clinic doctor.

📌 *Booking Details:*
• *Appointment ID:* ${apt.id}
• *Treatment/Service:* ${apt.service}
• *Attending Doctor:* ${docName}
• *Date:* ${apt.date}
• *Time Slot:* ${apt.timeSlot || apt.time || 'Scheduled Slot'}
• *Estimated Duration:* ${apt.duration || '45 mins'}

📍 *Clinic Location:*
PRS Dental Care, ${clinicAddress}
(Landmark: Opposite Red Hills Road Market)

${remarksOrReason ? `📝 *Doctor Note:* ${remarksOrReason}\n\n` : ''}⚠️ *Important Note:* Please reach the clinic 10 minutes before your time slot. If you need to reschedule, call ${clinicHelpline}.

Thank you for choosing PRS Dental Care!`;

    const smsText = 
`[PRS Dental Care] CONFIRMED: Hello ${apt.name}, your appointment for ${apt.service} with ${docName} on ${apt.date} (${apt.timeSlot || apt.time}) is APPROVED. Location: Kolathur, Chennai. Call ${clinicHelpline} for queries.`;

    return { waText, smsText };
  } else {
    // Rejected state
    const reasonText = remarksOrReason ? remarksOrReason.replace(/^Rejected:\s*/i, '') : 'Doctor unavailable at requested time slot';

    const waText = 
`🏥 *PRS DENTAL CARE - APPOINTMENT UPDATE*

Hello *${apt.name}*,

We regret to inform you that your requested appointment slot could not be accepted at this time.

📌 *Requested Booking Details:*
• *Appointment ID:* ${apt.id}
• *Service:* ${apt.service}
• *Requested Date:* ${apt.date} (${apt.timeSlot || apt.time || 'Slot'})
• *Doctor:* ${docName}

⚠️ *Reason:* ${reasonText}

📞 *Rescheduling Help:*
We would love to help you find another convenient time slot! Please reply to this WhatsApp message or call our helpline at *${clinicHelpline}*.

We apologize for any inconvenience caused.
- *PRS Dental Care Team*`;

    const smsText = 
`[PRS Dental Care] UPDATE: Hello ${apt.name}, your requested slot on ${apt.date} (${apt.service}) could not be confirmed. Reason: ${reasonText}. Please call ${clinicHelpline} to reschedule.`;

    return { waText, smsText };
  }
};

/**
 * Main automated dispatch handler for SMS and WhatsApp
 */
export const dispatchPatientNotifications = async (apt, status, remarksOrReason = '', options = {}) => {
  const { autoOpenWhatsApp = true, autoOpenSMS = false } = options;
  const cleanPhone = cleanPhoneNumber(apt.phone);
  const { waText, smsText } = generateAppointmentMessage(apt, status, remarksOrReason);

  const waUrl = cleanPhone
    ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(waText)}`
    : `https://api.whatsapp.com/send?text=${encodeURIComponent(waText)}`;

  const smsUrl = `sms:${cleanPhone ? '+' + cleanPhone : ''}?body=${encodeURIComponent(smsText)}`;

  // Automatically trigger WhatsApp Web / App popup
  if (autoOpenWhatsApp) {
    try {
      window.open(waUrl, '_blank');
    } catch (err) {
      console.warn('WhatsApp window open popup blocked or failed:', err);
    }
  }

  // Optionally trigger SMS app protocol
  if (autoOpenSMS) {
    try {
      window.open(smsUrl, '_blank');
    } catch (err) {
      console.warn('SMS protocol trigger failed:', err);
    }
  }

  // Call backend API notification logger synchronously / asynchronously
  try {
    fetch('/api/notifications/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        appointmentId: apt.id,
        patientName: apt.name,
        patientPhone: apt.phone,
        cleanPhone,
        status,
        remarksOrReason,
        waText,
        smsText,
        dispatchedAt: new Date().toISOString()
      })
    }).catch(() => {});
  } catch (e) {
    // Ignore server sync errors in local fallback
  }

  return {
    success: true,
    status,
    cleanPhone,
    waUrl,
    smsUrl,
    waText,
    smsText,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
};
