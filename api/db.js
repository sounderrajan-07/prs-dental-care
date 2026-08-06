import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;

// Initialize Neon Client if connection string is provided
const sql = DATABASE_URL ? neon(DATABASE_URL) : null;

export const isDbConnected = () => !!sql;

// Database Auto-Initialization: Creates required tables in Neon PostgreSQL if they don't exist
export async function initDbSchema() {
  if (!sql) {
    console.log('[Neon Postgres] No DATABASE_URL set. Running in fallback mode.');
    return false;
  }

  try {
    // 1. Appointments Table
    await sql`
      CREATE TABLE IF NOT EXISTS appointments (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        email VARCHAR(255),
        service VARCHAR(255) NOT NULL,
        preferred_doctor VARCHAR(255),
        date VARCHAR(50) NOT NULL,
        time_slot VARCHAR(100),
        notes TEXT,
        status VARCHAR(50) DEFAULT 'Pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 2. Doctors Table
    await sql`
      CREATE TABLE IF NOT EXISTS doctors (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        degree VARCHAR(100),
        specialization VARCHAR(255) NOT NULL,
        experience VARCHAR(255),
        phone VARCHAR(50),
        email VARCHAR(255),
        passcode VARCHAR(100) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 3. Doctor Attendance Table
    await sql`
      CREATE TABLE IF NOT EXISTS attendance (
        id VARCHAR(100) PRIMARY KEY,
        doctor_id VARCHAR(50) NOT NULL,
        doctor_name VARCHAR(255) NOT NULL,
        specialization VARCHAR(255),
        date VARCHAR(50) NOT NULL,
        shift VARCHAR(100),
        status VARCHAR(50) NOT NULL,
        check_in_time VARCHAR(50),
        check_out_time VARCHAR(50),
        working_hours VARCHAR(50),
        remarks TEXT,
        marked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 4. Patient Treatment History Table
    await sql`
      CREATE TABLE IF NOT EXISTS patient_history (
        id VARCHAR(50) PRIMARY KEY,
        patient_name VARCHAR(255) NOT NULL,
        patient_phone VARCHAR(50) NOT NULL,
        patient_email VARCHAR(255),
        treatment_name VARCHAR(255) NOT NULL,
        attending_doctor VARCHAR(255) NOT NULL,
        doctor_specialization VARCHAR(255),
        treatment_date VARCHAR(50) NOT NULL,
        time_slot VARCHAR(100),
        duration VARCHAR(50),
        cost VARCHAR(50),
        status VARCHAR(50) DEFAULT 'Completed',
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 5. Patient Feedback & Reviews Table
    await sql`
      CREATE TABLE IF NOT EXISTS patient_feedback (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        rating INTEGER DEFAULT 5,
        treatment VARCHAR(255),
        comment TEXT NOT NULL,
        date VARCHAR(50) NOT NULL,
        status VARCHAR(50) DEFAULT 'Pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 6. Auto-seed default doctors if empty
    const [{ count: docCount }] = await sql`SELECT count(*)::int FROM doctors`;
    if (docCount === 0) {
      await sql`
        INSERT INTO doctors (id, name, degree, specialization, experience, phone, email, passcode) VALUES
        ('doc1', 'Dr. P. R. Sundharam', 'M.D.S', 'Endodontist & Root Canal Specialist', '15+ Years Clinical Experience', '+91 72007 18607', 'drprsundharam@prsdentalcare.com', 'prs123'),
        ('doc2', 'Dr. Purushotham', 'M.D.S', 'Orthodontist & Dentofacial Specialist', '12+ Years Aligners & Braces Experience', '+91 94443 65637', 'drpurushotham@prsdentalcare.com', 'puru123'),
        ('doc3', 'Dr. Wasim Ahamed', 'B.D.S, M.D.S', 'Prosthodontist & Implantologist', '10+ Years 3D Guided Implants Experience', '+91 98401 22334', 'drwasim@prsdentalcare.com', 'wasim123')
      `;
    }

    // 7. Auto-seed patient history if empty
    const [{ count: historyCount }] = await sql`SELECT count(*)::int FROM patient_history`;
    if (historyCount === 0) {
      await sql`
        INSERT INTO patient_history (id, patient_name, patient_phone, patient_email, treatment_name, attending_doctor, doctor_specialization, treatment_date, time_slot, duration, cost, status, notes) VALUES
        ('HIS-5001', 'Kavitha Ramesh', '+91 98401 23456', 'kavitha.ramesh@gmail.com', 'Root Canal Treatment - Lower Molar (Sitting 1)', 'Dr. Purushotham', 'M.D.S - Endodontist Specialist', '2026-07-28', '10:00 AM - 10:45 AM', '45 mins', '₹4,500', 'Completed', 'Pulp extirpation done under rubber dam. Biomechanical preparation completed.'),
        ('HIS-5002', 'Master Aarav Sundar', '+91 97100 88234', 'parent.aarav@gmail.com', 'Pediatric Fluoride Varnish & Pulpectomy', 'Dr. Vijaya Kumar', 'M.D.S - Pedodontist Specialist', '2026-07-25', '11:00 AM - 11:45 AM', '45 mins', '₹2,200', 'Completed', 'Kid friendly behavior shaping applied. Fluoride varnish application on upper anteriors.'),
        ('HIS-5003', 'Suresh Varma', '+91 98840 55678', 'suresh.varma@gmail.com', 'Surgical Extraction - Impacted Wisdom Tooth #38', 'Dr. Wasim Ahamed', 'M.D.S - Oral & Maxillofacial Surgeon', '2026-07-20', '04:00 PM - 05:30 PM', '90 mins', '₹5,500', 'Completed', 'Mucoperiosteal flap elevated, bone guttering performed. Tooth sectioned and removed completely.'),
        ('HIS-5004', 'Ananya Srinivas', '+91 94442 11099', 'ananya.s@outlook.com', 'Metal Orthodontic Braces Bonding (Upper & Lower)', 'Dr. Purushotham', 'M.D.S - Orthodontics Specialist', '2026-07-18', '11:30 AM - 12:30 PM', '60 mins', '₹25,000', 'Completed', 'Etching & bonding of MBT 0.022 brackets. 0.012 NiTi wire placed.'),
        ('HIS-5005', 'Meenakshi Sundaram', '+91 98401 77665', 'meenakshi.s@gmail.com', 'Dental Implant Osteotomy & Fixture Placement #36', 'Dr. Wasim Ahamed', 'M.D.S - Prosthodontist & Implantologist', '2026-07-15', '05:00 PM - 06:30 PM', '90 mins', '₹28,000', 'Completed', '4.3x10mm titanium fixture placed with 35Ncm torque. Healing abutment secured.')
      `;
    }

    // 8. Auto-seed patient feedback if empty
    const [{ count: feedbackCount }] = await sql`SELECT count(*)::int FROM patient_feedback`;
    if (feedbackCount === 0) {
      await sql`
        INSERT INTO patient_feedback (id, name, phone, rating, treatment, comment, date, status) VALUES
        ('FB-101', 'Pragalya Soundar', '+91 98401 22334', 5, 'Root Canal & Tooth Cap', 'I had an excellent experience at PRS Dental Clinic. Dr. Saritha explained everything clearly and patients feel very comfortable. The root canal procedure was completely smooth and painless. Budget-friendly pricing too!', '2026-07-28', 'Approved'),
        ('FB-102', 'Bhavani M', '+91 97100 88234', 5, 'Root Canal & Tooth Extraction', 'Painless treatment with state of the art equipment! Doctors take great care to ensure comfort at every single step.', '2026-07-25', 'Approved'),
        ('FB-103', 'Kavin Kumar', '+91 94442 11099', 5, 'Dental Checkup & Wisdom Extraction', 'Painless wisdom tooth removal in under 45 minutes! Clear post-op instructions and very caring staff.', '2026-07-20', 'Approved'),
        ('FB-104', 'Hari K', '+91 98840 55678', 5, 'Broken Tooth Repair', 'Handled my mother’s broken tooth with immense patience and knowledge. Highly recommended dental clinic in Kolathur.', '2026-07-15', 'Approved')
      `;
    }

    console.log('[Neon Postgres] All tables initialized & seeded successfully!');
    return true;
  } catch (err) {
    console.error('[Neon Postgres] Schema init error:', err);
    return false;
  }
}

export default sql;
