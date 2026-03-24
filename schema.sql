-- D1 SQL SCHEMA FOR CLOUDABSEN PRO
-- Execute this in your Cloudflare D1 Console

-- 1. Table Users
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT NOT NULL,
    role TEXT DEFAULT 'pegawai', -- 'admin' or 'pegawai'
    dept TEXT,
    password TEXT, -- For admin login
    base_salary INTEGER DEFAULT 0,
    food_allowance INTEGER DEFAULT 0,
    cash_advance INTEGER DEFAULT 0,
    leave_total INTEGER DEFAULT 12, -- Total annual leave allowance
    leave_used INTEGER DEFAULT 0,
    schedule TEXT DEFAULT '08:00-17:00', -- Simple shift string
    face_data TEXT, -- Simulated face hash/reference
    status TEXT DEFAULT 'active'
);

-- 2. Table Attendance
CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    nama TEXT,
    type TEXT, -- 'IN' or 'OUT'
    waktu DATETIME DEFAULT CURRENT_TIMESTAMP,
    lokasi TEXT,
    status TEXT, -- 'Ontime', 'Late', 'Overtime'
    lat_lng TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

-- 3. Table Leave Requests
CREATE TABLE IF NOT EXISTS leave_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    nama TEXT,
    type TEXT, -- 'Sakit', 'Cuti', 'Mendadak'
    start_date DATE,
    end_date DATE,
    reason TEXT,
    status TEXT DEFAULT 'Pending', -- 'Pending', 'Approved', 'Rejected'
    FOREIGN KEY(user_id) REFERENCES users(id)
);

-- 4. Table Payroll History
CREATE TABLE IF NOT EXISTS payroll (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    month TEXT, -- e.g., '2026-03'
    basic_salary INTEGER,
    allowances INTEGER,
    deductions INTEGER,
    net_salary INTEGER,
    status TEXT DEFAULT 'Unpaid'
);

-- Seed Initial Admin
INSERT INTO users (nama, role, password, dept) VALUES ('Administrator', 'admin', 'dr.bofoi1212', 'Management');
