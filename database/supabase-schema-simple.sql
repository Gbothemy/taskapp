-- TaskApp Supabase Database Schema - Simple Version
-- Run this if you're getting enum conflicts

-- First, let's check what enums exist and create only missing ones
DO $$ 
BEGIN
    -- Check if task_category enum exists and what values it has
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_category') THEN
        CREATE TYPE task_category AS ENUM ('data-entry', 'content', 'review', 'research', 'testing', 'design', 'other');
    ELSE
        -- Add missing enum values if they don't exist
        BEGIN
            ALTER TYPE task_category ADD VALUE IF NOT EXISTS 'content';
        EXCEPTION
            WHEN duplicate_object THEN NULL;
        END;
    END IF;
END $$;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create or update the users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('worker', 'employer', 'admin')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'banned')),
    avatar TEXT,
    bio TEXT,
    location VARCHAR(100),
    
    -- Wallet information
    wallet_balance DECIMAL(10,2) DEFAULT 0.00 CHECK (wallet_balance >= 0),
    wallet_pending_earnings DECIMAL(10,2) DEFAULT 0.00 CHECK (wallet_pending_earnings >= 0),
    wallet_total_earned DECIMAL(10,2) DEFAULT 0.00 CHECK (wallet_total_earned >= 0),
    wallet_total_spent DECIMAL(10,2) DEFAULT 0.00 CHECK (wallet_total_spent >= 0),
    
    -- Worker stats
    worker_tasks_completed INTEGER DEFAULT 0 CHECK (worker_tasks_completed >= 0),
    worker_approval_rate DECIMAL(5,2) DEFAULT 100.00 CHECK (worker_approval_rate >= 0 AND worker_approval_rate <= 100),
    worker_level INTEGER DEFAULT 1 CHECK (worker_level >= 1),
    worker_badges TEXT[],
    
    -- Employer stats
    employer_tasks_posted INTEGER DEFAULT 0 CHECK (employer_tasks_posted >= 0),
    employer_total_spent DECIMAL(10,2) DEFAULT 0.00 CHECK (employer_total_spent >= 0),
    
    -- Account verification and security
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token TEXT,
    password_reset_token TEXT,
    password_reset_expires TIMESTAMPTZ,
    last_login TIMESTAMPTZ,
    
    -- Preferences
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create or update the tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    instructions TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('data-entry', 'content', 'review', 'research', 'testing', 'design', 'other')),
    employer_id UUID NOT NULL,
    
    -- Payout and completion tracking
    payout_per_task DECIMAL(8,2) NOT NULL CHECK (payout_per_task > 0),
    total_tasks_needed INTEGER NOT NULL CHECK (total_tasks_needed > 0),
    completed_tasks INTEGER DEFAULT 0 CHECK (completed_tasks >= 0),
    approved_tasks INTEGER DEFAULT 0 CHECK (approved_tasks >= 0),
    rejected_tasks INTEGER DEFAULT 0 CHECK (rejected_tasks >= 0),
    
    -- Timing
    deadline TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled')),
    
    -- Requirements
    required_proof_type VARCHAR(20) NOT NULL CHECK (required_proof_type IN ('image', 'text', 'url', 'file')),
    min_approval_rate DECIMAL(5,2) DEFAULT 80.00 CHECK (min_approval_rate >= 0 AND min_approval_rate <= 100),
    min_worker_level INTEGER DEFAULT 1 CHECK (min_worker_level >= 1),
    
    -- Auto approval settings
    auto_approval_enabled BOOLEAN DEFAULT FALSE,
    auto_approval_hours INTEGER DEFAULT 24 CHECK (auto_approval_hours > 0),
    
    -- Additional data
    tags TEXT[],
    attachments JSONB DEFAULT '[]'::jsonb,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create or update the task_submissions table
CREATE TABLE IF NOT EXISTS task_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL,
    worker_id UUID NOT NULL,
    employer_id UUID NOT NULL,
    
    -- Proof data
    proof_type VARCHAR(20) NOT NULL CHECK (proof_type IN ('image', 'text', 'url', 'file')),
    proof_content TEXT NOT NULL,
    proof_files JSONB DEFAULT '[]'::jsonb,
    
    -- Status and review
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'auto-approved')),
    
    -- Payout information
    payout_amount DECIMAL(8,2) NOT NULL CHECK (payout_amount > 0),
    platform_fee DECIMAL(8,2) NOT NULL CHECK (platform_fee >= 0),
    worker_earning DECIMAL(8,2) NOT NULL CHECK (worker_earning > 0),
    
    -- Review data
    review_rating INTEGER CHECK (review_rating >= 1 AND review_rating <= 5),
    review_feedback TEXT,
    
    -- Timestamps
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    auto_approval_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(task_id, worker_id),
    CHECK (payout_amount = platform_fee + worker_earning)
);

-- Create or update the transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('task_payment', 'withdrawal', 'deposit', 'refund', 'platform_fee')),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    
    -- Payment details
    payment_method VARCHAR(20) CHECK (payment_method IN ('stripe', 'paypal', 'bank_transfer', 'crypto', 'wallet')),
    external_transaction_id TEXT,
    
    -- Related records
    related_task_id UUID,
    related_submission_id UUID,
    
    -- Additional data
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key constraints if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'tasks_employer_id_fkey') THEN
        ALTER TABLE tasks ADD CONSTRAINT tasks_employer_id_fkey FOREIGN KEY (employer_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'task_submissions_task_id_fkey') THEN
        ALTER TABLE task_submissions ADD CONSTRAINT task_submissions_task_id_fkey FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'task_submissions_worker_id_fkey') THEN
        ALTER TABLE task_submissions ADD CONSTRAINT task_submissions_worker_id_fkey FOREIGN KEY (worker_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'task_submissions_employer_id_fkey') THEN
        ALTER TABLE task_submissions ADD CONSTRAINT task_submissions_employer_id_fkey FOREIGN KEY (employer_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'transactions_user_id_fkey') THEN
        ALTER TABLE transactions ADD CONSTRAINT transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'transactions_related_task_id_fkey') THEN
        ALTER TABLE transactions ADD CONSTRAINT transactions_related_task_id_fkey FOREIGN KEY (related_task_id) REFERENCES tasks(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'transactions_related_submission_id_fkey') THEN
        ALTER TABLE transactions ADD CONSTRAINT transactions_related_submission_id_fkey FOREIGN KEY (related_submission_id) REFERENCES task_submissions(id);
    END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_tasks_employer_id ON tasks(employer_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks(category);
CREATE INDEX IF NOT EXISTS idx_submissions_worker_id ON task_submissions(worker_id);
CREATE INDEX IF NOT EXISTS idx_submissions_task_id ON task_submissions(task_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);

-- Insert demo data (safe version)
INSERT INTO users (id, email, password_hash, first_name, last_name, role, wallet_balance, wallet_total_earned, worker_tasks_completed, worker_approval_rate, worker_level, worker_badges) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'worker@taskapp.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John', 'Worker', 'worker', 150.00, 500.00, 45, 95.5, 3, ARRAY['reliable', 'fast-worker']),
('550e8400-e29b-41d4-a716-446655440002', 'employer@taskapp.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Jane', 'Employer', 'employer', 1000.00, 0.00, 0, 100.0, 1, NULL),
('550e8400-e29b-41d4-a716-446655440003', 'admin@taskapp.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', 'admin', 0.00, 0.00, 0, 100.0, 1, NULL)
ON CONFLICT (email) DO NOTHING;

-- Insert demo tasks
INSERT INTO tasks (id, title, description, instructions, category, employer_id, payout_per_task, total_tasks_needed, completed_tasks, approved_tasks, deadline, status, required_proof_type, min_approval_rate, min_worker_level) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Website Review and Feedback', 'Visit a website and provide detailed feedback on user experience', 'Navigate through the website, test key features, and provide constructive feedback', 'review', '550e8400-e29b-41d4-a716-446655440002', 15.00, 10, 3, 2, '2024-12-31 23:59:59+00', 'active', 'text', 80.00, 1),
('660e8400-e29b-41d4-a716-446655440002', 'Social Media Post Creation', 'Create engaging social media posts for a small business', 'Create 3 unique posts with captions for Instagram/Facebook', 'content', '550e8400-e29b-41d4-a716-446655440002', 25.00, 5, 1, 1, '2024-12-25 23:59:59+00', 'active', 'image', 85.00, 2)
ON CONFLICT (id) DO NOTHING;

-- Insert demo submission
INSERT INTO task_submissions (id, task_id, worker_id, employer_id, proof_type, proof_content, status, payout_amount, platform_fee, worker_earning, review_rating, review_feedback, reviewed_at) VALUES
('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'text', 'Detailed feedback about the website usability and design improvements needed.', 'approved', 15.00, 0.75, 14.25, 5, 'Excellent detailed feedback!', NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert demo transaction
INSERT INTO transactions (id, user_id, type, amount, status, related_task_id, related_submission_id, description) VALUES
('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'task_payment', 14.25, 'completed', '660e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'Task completion payment')
ON CONFLICT (id) DO NOTHING;