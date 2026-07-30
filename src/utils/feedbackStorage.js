const FEEDBACK_STORAGE_KEY = 'prs_patient_feedbacks_v1';

const INITIAL_DEMO_FEEDBACKS = [
  {
    id: 'FB-101',
    name: 'Pragalya Soundar',
    phone: '+91 98401 22334',
    rating: 5,
    treatment: 'Root Canal & Tooth Cap',
    comment: 'I had an excellent experience at PRS Dental Clinic. Dr. Saritha explained everything clearly and patients feel very comfortable. The root canal procedure was completely smooth and painless. Budget-friendly pricing too!',
    date: '2026-07-28',
    status: 'Approved',
    submittedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'FB-102',
    name: 'Bhavani M',
    phone: '+91 97100 88234',
    rating: 5,
    treatment: 'Root Canal & Tooth Extraction',
    comment: 'Painless treatment with state of the art equipment! Doctors take great care to ensure comfort at every single step.',
    date: '2026-07-25',
    status: 'Approved',
    submittedAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'FB-103',
    name: 'Kavin Kumar',
    phone: '+91 94442 11099',
    rating: 5,
    treatment: 'Dental Checkup & Wisdom Extraction',
    comment: 'Painless wisdom tooth removal in under 45 minutes! Clear post-op instructions and very caring staff.',
    date: '2026-07-20',
    status: 'Approved',
    submittedAt: new Date(Date.now() - 86400000 * 10).toISOString()
  },
  {
    id: 'FB-104',
    name: 'Hari K',
    phone: '+91 98840 55678',
    rating: 5,
    treatment: 'Broken Tooth Repair',
    comment: 'Handled my mother’s broken tooth with immense patience and knowledge. Highly recommended dental clinic in Kolathur.',
    date: '2026-07-15',
    status: 'Approved',
    submittedAt: new Date(Date.now() - 86400000 * 15).toISOString()
  }
];

export const getStoredFeedbacks = () => {
  try {
    const raw = localStorage.getItem(FEEDBACK_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_FEEDBACKS));
      return INITIAL_DEMO_FEEDBACKS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_DEMO_FEEDBACKS;
  } catch (err) {
    return INITIAL_DEMO_FEEDBACKS;
  }
};

export const getApprovedFeedbacks = () => {
  const all = getStoredFeedbacks();
  return all.filter((item) => item.status === 'Approved');
};

export const saveFeedback = (feedbackData) => {
  try {
    const current = getStoredFeedbacks();
    const newFeedback = {
      id: `FB-${100 + current.length + 1}`,
      name: feedbackData.name,
      phone: feedbackData.phone || '',
      rating: Number(feedbackData.rating) || 5,
      treatment: feedbackData.treatment || 'General Dental Care',
      comment: feedbackData.comment,
      date: feedbackData.date || new Date().toISOString().split('T')[0],
      status: 'Pending', // Requires Admin Approval
      submittedAt: new Date().toISOString()
    };

    const updated = [newFeedback, ...current];
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(updated));
    return newFeedback;
  } catch (err) {
    console.error('Error saving patient feedback:', err);
    return null;
  }
};

export const updateFeedbackStatus = (id, newStatus) => {
  try {
    const current = getStoredFeedbacks();
    const updated = current.map((item) => (item.id === id ? { ...item, status: newStatus } : item));
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error updating feedback status:', err);
  }
};

export const deleteStoredFeedback = (id) => {
  try {
    const current = getStoredFeedbacks();
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error deleting feedback:', err);
  }
};
