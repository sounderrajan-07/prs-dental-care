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

    console.log('[Neon Postgres] All tables initialized & seeded successfully!');
    return true;
  } catch (err) {
    console.error('[Neon Postgres] Schema init error:', err);
    return false;
  }
}

export default sql;
