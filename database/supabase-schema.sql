-- TaskApp Supabase Database Schema
-- PostgreSQL compatible schema for TaskApp platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types (with IF NOT EXISTS equivalent)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('worker', 'employer', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_status AS ENUM ('active', 'suspended', 'banned');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE task_category AS ENUM ('data-entry', 'content', 'review', 'research', 'testing', 'design', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE task_status AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE proof_type AS ENUM ('image', 'text', 'url', 'file');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE submission_status AS ENUM ('pending', 'approved', 'rejected', 'auto-approved');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_type AS ENUM ('task_payment', 'withdrawal', 'deposit', 'refund', 'platform_fee');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM ('stripe', 'paypal', 'bank_transfer', 'crypto', 'wallet');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role user_role NOT NULL,
    status user_status DEFAULT 'active',
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
    worker_badges TEXT[], -- Array of badge names
    
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

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    instructions TEXT NOT NULL,
    category task_category NOT NULL,
    employer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Payout and completion tracking
    payout_per_task DECIMAL(8,2) NOT NULL CHECK (payout_per_task > 0),
    total_tasks_needed INTEGER NOT NULL CHECK (total_tasks_needed > 0),
    completed_tasks INTEGER DEFAULT 0 CHECK (completed_tasks >= 0),
    approved_tasks INTEGER DEFAULT 0 CHECK (approved_tasks >= 0),
    rejected_tasks INTEGER DEFAULT 0 CHECK (rejected_tasks >= 0),
    
    -- Timing
    deadline TIMESTAMPTZ NOT NULL,
    status task_status DEFAULT 'draft',
    
    -- Requirements
    required_proof_type proof_type NOT NULL,
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

-- Task submissions table
CREATE TABLE IF NOT EXISTS task_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    worker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    employer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Proof data
    proof_type proof_type NOT NULL,
    proof_content TEXT NOT NULL,
    proof_files JSONB DEFAULT '[]'::jsonb,
    
    -- Status and review
    status submission_status DEFAULT 'pending',
    
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
    UNIQUE(task_id, worker_id), -- One submission per worker per task
    CHECK (payout_amount = platform_fee + worker_earning)
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type transaction_type NOT NULL,
    amount DECIMAL(10,2) NOT NULL, -- Can be negative for withdrawals/fees
    currency VARCHAR(3) DEFAULT 'USD',
    status transaction_status DEFAULT 'pending',
    
    -- Payment details
    payment_method payment_method,
    external_transaction_id TEXT,
    
    -- Related records
    related_task_id UUID REFERENCES tasks(id),
    related_submission_id UUID REFERENCES task_submissions(id),
    
    -- Additional data
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better performance (with IF NOT EXISTS equivalent)
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

CREATE INDEX IF NOT EXISTS idx_tasks_employer_id ON tasks(employer_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks(category);
CREATE INDEX IF NOT EXISTS idx_tasks_deadline ON tasks(deadline);
CREATE INDEX IF NOT EXISTS idx_tasks_payout ON tasks(payout_per_task);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_submissions_task_id ON task_submissions(task_id);
CREATE INDEX IF NOT EXISTS idx_submissions_worker_id ON task_submissions(worker_id);
CREATE INDEX IF NOT EXISTS idx_submissions_employer_id ON task_submissions(employer_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON task_submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_submitted_at ON task_submissions(submitted_at DESC);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);

-- Compound indexes
CREATE INDEX IF NOT EXISTS idx_tasks_status_category ON tasks(status, category);
CREATE INDEX IF NOT EXISTS idx_submissions_worker_status ON task_submissions(worker_id, status);
CREATE INDEX IF NOT EXISTS idx_submissions_employer_status ON task_submissions(employer_id, status);
CREATE INDEX IF NOT EXISTS idx_transactions_user_type ON transactions(user_id, type);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON task_submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update task completion counts
CREATE OR REPLACE FUNCTION update_task_completion_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Increment completed tasks when submission is created
        UPDATE tasks 
        SET completed_tasks = completed_tasks + 1
        WHERE id = NEW.task_id;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Update approved/rejected counts when status changes
        IF OLD.status = 'pending' AND NEW.status = 'approved' THEN
            UPDATE tasks 
            SET approved_tasks = approved_tasks + 1
            WHERE id = NEW.task_id;
        ELSIF OLD.status = 'pending' AND NEW.status = 'rejected' THEN
            UPDATE tasks 
            SET rejected_tasks = rejected_tasks + 1,
                completed_tasks = completed_tasks - 1  -- Reduce completed count for rejections
            WHERE id = NEW.task_id;
        END IF;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for task completion stats
CREATE TRIGGER trigger_update_task_stats
    AFTER INSERT OR UPDATE ON task_submissions
    FOR EACH ROW EXECUTE FUNCTION update_task_completion_stats();

-- Function to update user wallet and stats
CREATE OR REPLACE FUNCTION update_user_stats_on_transaction()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' THEN
        CASE NEW.type
            WHEN 'task_payment' THEN
                -- Update worker earnings
                UPDATE users 
                SET wallet_balance = wallet_balance + NEW.amount,
                    wallet_total_earned = wallet_total_earned + NEW.amount,
                    worker_tasks_completed = worker_tasks_completed + 1
                WHERE id = NEW.user_id AND role = 'worker';
                
            WHEN 'withdrawal' THEN
                -- Deduct from balance (amount is negative for withdrawals)
                UPDATE users 
                SET wallet_balance = wallet_balance + NEW.amount
                WHERE id = NEW.user_id;
                
            WHEN 'deposit' THEN
                -- Add to balance
                UPDATE users 
                SET wallet_balance = wallet_balance + NEW.amount
                WHERE id = NEW.user_id;
                
            WHEN 'platform_fee' THEN
                -- Deduct platform fee from employer
                UPDATE users 
                SET wallet_total_spent = wallet_total_spent + ABS(NEW.amount)
                WHERE id = NEW.user_id AND role = 'employer';
        END CASE;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for user stats updates
CREATE TRIGGER trigger_update_user_stats
    AFTER INSERT OR UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_user_stats_on_transaction();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Users can read their own data and public profiles
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Public profiles (limited fields)
CREATE POLICY "Public user profiles" ON users
    FOR SELECT USING (true);

-- Tasks policies
CREATE POLICY "Anyone can view active tasks" ON tasks
    FOR SELECT USING (status = 'active');

CREATE POLICY "Employers can manage own tasks" ON tasks
    FOR ALL USING (auth.uid()::text = employer_id::text);

-- Submissions policies
CREATE POLICY "Workers can view own submissions" ON task_submissions
    FOR SELECT USING (auth.uid()::text = worker_id::text);

CREATE POLICY "Employers can view submissions for their tasks" ON task_submissions
    FOR SELECT USING (auth.uid()::text = employer_id::text);

CREATE POLICY "Workers can create submissions" ON task_submissions
    FOR INSERT WITH CHECK (auth.uid()::text = worker_id::text);

CREATE POLICY "Employers can update submissions for their tasks" ON task_submissions
    FOR UPDATE USING (auth.uid()::text = employer_id::text);

-- Transactions policies
CREATE POLICY "Users can view own transactions" ON transactions
    FOR SELECT USING (auth.uid()::text = user_id::text);

-- Insert demo data (with conflict handling)
INSERT INTO users (id, email, password_hash, first_name, last_name, role, wallet_balance, wallet_total_earned, worker_tasks_completed, worker_approval_rate, worker_level, worker_badges) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'worker@taskapp.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John', 'Worker', 'worker', 150.00, 500.00, 45, 95.5, 3, ARRAY['reliable', 'fast-worker']),
('550e8400-e29b-41d4-a716-446655440002', 'employer@taskapp.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Jane', 'Employer', 'employer', 1000.00, 0.00, 0, 100.0, 1, NULL),
('550e8400-e29b-41d4-a716-446655440003', 'admin@taskapp.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', 'admin', 0.00, 0.00, 0, 100.0, 1, NULL)
ON CONFLICT (id) DO NOTHING;

-- Update employer stats (only if user exists)
UPDATE users SET employer_tasks_posted = 2, employer_total_spent = 750.00 WHERE email = 'employer@taskapp.com';

-- Insert demo tasks (using 'other' category to avoid enum issues)
INSERT INTO tasks (id, title, description, instructions, category, employer_id, payout_per_task, total_tasks_needed, completed_tasks, approved_tasks, deadline, status, required_proof_type, min_approval_rate, min_worker_level) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Website Review and Feedback', 'Visit a website and provide detailed feedback on user experience', 'Navigate through the website, test key features, and provide constructive feedback', 'review', '550e8400-e29b-41d4-a716-446655440002', 15.00, 10, 3, 2, '2024-12-31 23:59:59+00', 'active', 'text', 80.00, 1),
('660e8400-e29b-41d4-a716-446655440002', 'Social Media Post Creation', 'Create engaging social media posts for a small business', 'Create 3 unique posts with captions for Instagram/Facebook', 'other', '550e8400-e29b-41d4-a716-446655440002', 25.00, 5, 1, 1, '2024-12-25 23:59:59+00', 'active', 'image', 85.00, 2)
ON CONFLICT (id) DO NOTHING;

-- Insert demo submission
INSERT INTO task_submissions (id, task_id, worker_id, employer_id, proof_type, proof_content, status, payout_amount, platform_fee, worker_earning, review_rating, review_feedback, reviewed_at) VALUES
('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'text', 'Detailed feedback about the website usability and design improvements needed.', 'approved', 15.00, 0.75, 14.25, 5, 'Excellent detailed feedback!', NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert demo transaction
INSERT INTO transactions (id, user_id, type, amount, status, related_task_id, related_submission_id, description) VALUES
('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'task_payment', 14.25, 'completed', '660e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'Task completion payment')
ON CONFLICT (id) DO NOTHING;

-- Create views for easier querying
CREATE VIEW task_stats AS
SELECT 
    t.*,
    u.first_name || ' ' || u.last_name as employer_name,
    u.email as employer_email,
    CASE 
        WHEN t.total_tasks_needed > 0 THEN (t.completed_tasks::float / t.total_tasks_needed * 100)
        ELSE 0 
    END as completion_percentage,
    (t.total_tasks_needed - t.completed_tasks) as remaining_tasks
FROM tasks t
JOIN users u ON t.employer_id = u.id;

CREATE VIEW submission_details AS
SELECT 
    s.*,
    t.title as task_title,
    t.category as task_category,
    w.first_name || ' ' || w.last_name as worker_name,
    w.email as worker_email,
    e.first_name || ' ' || e.last_name as employer_name,
    e.email as employer_email
FROM task_submissions s
JOIN tasks t ON s.task_id = t.id
JOIN users w ON s.worker_id = w.id
JOIN users e ON s.employer_id = e.id;

-- Comments for documentation
COMMENT ON TABLE users IS 'User accounts with role-based access and wallet information';
COMMENT ON TABLE tasks IS 'Tasks posted by employers for workers to complete';
COMMENT ON TABLE task_submissions IS 'Worker submissions for tasks with proof and review data';
COMMENT ON TABLE transactions IS 'Financial transactions including payments, withdrawals, and fees';

COMMENT ON COLUMN users.worker_badges IS 'Array of achievement badges for workers';
COMMENT ON COLUMN tasks.attachments IS 'JSON array of file attachments for task instructions';
COMMENT ON COLUMN task_submissions.proof_files IS 'JSON array of uploaded proof files';
COMMENT ON COLUMN transactions.metadata IS 'Additional transaction metadata as JSON';