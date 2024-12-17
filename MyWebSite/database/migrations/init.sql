-- Drop Tables if Already Exist (One by One)
DROP TABLE IF EXISTS social_accounts;
DROP TABLE IF EXISTS chat_messages;
DROP TABLE IF EXISTS chats;
DROP TABLE IF EXISTS job_applications;
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS course_modules;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS devices;
DROP TABLE IF EXISTS users;

-- Users Table
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    phone TEXT,
    date_of_birth TEXT,
    address TEXT,
    occupation TEXT,
    profile_image TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Devices Table
CREATE TABLE devices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    serial_number TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    model TEXT,
    status TEXT DEFAULT 'offline',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Courses Table
CREATE TABLE courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    created_by INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE SET NULL
);

-- Course Modules Table
CREATE TABLE course_modules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    type TEXT CHECK (type IN ('Video', 'PDF', 'Article')),
    content_url TEXT,
    duration TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE
);

-- Jobs Table
CREATE TABLE jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT,
    job_type TEXT CHECK (job_type IN ('Full-Time', 'Part-Time', 'Freelance', 'Contract')),
    description TEXT,
    posted_by INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (posted_by) REFERENCES users (id) ON DELETE SET NULL
);

-- Job Applications Table
CREATE TABLE job_applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    resume_url TEXT,
    status TEXT DEFAULT 'Pending',
    applied_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    UNIQUE (job_id, user_id)
);

-- Chats Table
CREATE TABLE chats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    is_group BOOLEAN DEFAULT FALSE,
    name TEXT,
    created_by INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE SET NULL
);

-- Chat Messages Table
CREATE TABLE chat_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chat_id INTEGER NOT NULL,
    sender_id INTEGER NOT NULL,
    content TEXT,
    message_type TEXT CHECK (message_type IN ('text', 'media', 'file', 'system')),
    status TEXT DEFAULT 'sent',
    sent_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chat_id) REFERENCES chats (id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Social Accounts Table
CREATE TABLE social_accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    platform TEXT CHECK (platform IN ('Facebook', 'Instagram', 'Twitter', 'LinkedIn')),
    username TEXT,
    access_token TEXT,
    connected_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    UNIQUE (user_id, platform)
);

-- Indexes for Optimization
CREATE INDEX idx_devices_user_id ON devices (user_id);
CREATE INDEX idx_course_modules_course_id ON course_modules (course_id);
CREATE INDEX idx_jobs_posted_by ON jobs (posted_by);
CREATE INDEX idx_job_applications_job_id_user_id ON job_applications (job_id, user_id);
CREATE INDEX idx_chat_messages_chat_id ON chat_messages (chat_id);
CREATE INDEX idx_social_accounts_user_id ON social_accounts (user_id);