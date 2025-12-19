-- ============================================================================
-- TASKAPP PROFESSIONAL - MASTER DATABASE SETUP
-- ============================================================================
-- 🎯 Complete production-ready database schema with all features
-- 🚀 One script to rule them all - run this once for complete setup
-- 💎 Optimized for performance, security, and scalability
-- ============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 🏗️  CORE TABLES
-- ============================================================================

-- 👥 USERS TABLE - Enhanced with all professional features
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  full_name VARCHAR NOT NULL,
  username VARCHAR UNIQUE,
  user_type VARCHAR CHECK (user_type IN ('worker', 'employer', 'admin')) NOT NULL,
  
  -- 🎨 Profile & Branding
  avatar_url VARCHAR,
  bio TEXT,
  company VARCHAR,
  website VARCHAR,
  location VARCHAR,
  timezone VARCHAR DEFAULT 'UTC',
  
  -- 💼 Professional Info
  skills JSONB DEFAULT '[]',
  certifications JSONB DEFAULT '[]',
  portfolio_links JSONB DEFAULT '[]',
  languages JSONB DEFAULT '["English"]',
  
  -- 📊 Performance Metrics
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_earnings DECIMAL(12,2) DEFAULT 0.00,
  tasks_completed INTEGER DEFAULT 0,
  tasks_created INTEGER DEFAULT 0,
  success_rate DECIMAL(5,2) DEFAULT 0.00,
  
  -- 💰 Financial
  wallet_balance DECIMAL(12,2) DEFAULT 0.00,
  selected_plan VARCHAR DEFAULT 'free',
  plan_expires_at TIMESTAMP,
  stripe_customer_id VARCHAR,
  
  -- 🔔 Preferences
  notification_settings JSONB DEFAULT '{"email": true, "push": true, "sms": false}',
  privacy_settings JSONB DEFAULT '{"profile_public": true, "show_earnings": false}',
  theme_preference VARCHAR DEFAULT 'light',
  
  -- 📱 Contact & Verification
  phone VARCHAR,
  address TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  identity_verified BOOLEAN DEFAULT FALSE,
  
  -- 🎯 Activity & Status
  last_active TIMESTAMP DEFAULT NOW(),
  join_date TIMESTAMP DEFAULT NOW(),
  status VARCHAR DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'banned')),
  
  -- 🕐 Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 📂 CATEGORIES TABLE - Task organization systemCREATE 
TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR DEFAULT 'blue',
  icon VARCHAR DEFAULT 'folder',
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  parent_id UUID REFERENCES categories(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 📋 TASKS TABLE - Core task management
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT NOT NULL,
  employer_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES categories(id),
  
  -- 💰 Financial
  reward_amount DECIMAL(10,2) NOT NULL,
  budget_min DECIMAL(10,2),
  budget_max DECIMAL(10,2),
  
  -- ⏰ Timeline
  deadline TIMESTAMP,
  estimated_hours INTEGER,
  
  -- 🎯 Requirements
  difficulty_level VARCHAR DEFAULT 'medium' CHECK (difficulty_level IN ('easy', 'medium', 'hard', 'expert')),
  required_skills JSONB DEFAULT '[]',
  required_rating DECIMAL(3,2) DEFAULT 0.00,
  
  -- 📁 Attachments & Files
  attachments JSONB DEFAULT '[]',
  deliverables JSONB DEFAULT '[]',
  
  -- 🔄 Status & Workflow
  status VARCHAR DEFAULT 'active' CHECK (status IN ('draft', 'active', 'in_progress', 'completed', 'cancelled', 'disputed')),
  priority VARCHAR DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  
  -- 👥 Collaboration
  max_submissions INTEGER DEFAULT 1,
  allow_revisions BOOLEAN DEFAULT TRUE,
  auto_approve BOOLEAN DEFAULT FALSE,
  
  -- 🕐 Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  started_at TIMESTAMP,
  completed_at TIMESTAMP
);

-- 📝 TASK SUBMISSIONS TABLE - Work submissions
CREATE TABLE task_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE NOT NULL,
  worker_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  
  -- 📄 Submission Content
  submission_text TEXT NOT NULL,
  submission_files JSONB DEFAULT '[]',
  
  -- 🔄 Review Process
  status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'revision_requested')),
  feedback TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  
  -- ⏰ Timeline
  submitted_at TIMESTAMP DEFAULT NOW(),
  reviewed_at TIMESTAMP,
  revision_requested_at TIMESTAMP,
  
  -- 💰 Payment
  payment_status VARCHAR DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'paid', 'failed')),
  payment_amount DECIMAL(10,2),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 🔔 NOTIFICATIONS TABLE - Real-time messaging
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  
  -- 📨 Content
  title VARCHAR NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error', 'task', 'payment')),
  
  -- 🔗 References
  reference_id UUID,
  reference_type VARCHAR,
  action_url VARCHAR,
  
  -- 📱 Delivery
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  delivery_method VARCHAR DEFAULT 'app' CHECK (delivery_method IN ('app', 'email', 'sms', 'push')),
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- 💳 TRANSACTIONS TABLE - Financial tracking
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  
  -- 💰 Transaction Details
  amount DECIMAL(12,2) NOT NULL,
  type VARCHAR NOT NULL CHECK (type IN ('earning', 'payment', 'withdrawal', 'refund', 'fee', 'bonus')),
  status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  
  -- 📄 Description & References
  description TEXT NOT NULL,
  reference_id UUID,
  reference_type VARCHAR,
  
  -- 🏦 Payment Processing
  payment_method VARCHAR,
  payment_processor VARCHAR,
  processor_transaction_id VARCHAR,
  processor_fee DECIMAL(10,2) DEFAULT 0.00,
  
  -- 🕐 Timeline
  processed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 🏆 REVIEWS TABLE - Rating and feedback system
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reviewer_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  reviewee_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  submission_id UUID REFERENCES task_submissions(id) ON DELETE CASCADE,
  
  -- ⭐ Rating & Feedback
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR,
  comment TEXT,
  
  -- 🏷️ Categories
  communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
  quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
  timeliness_rating INTEGER CHECK (timeliness_rating >= 1 AND timeliness_rating <= 5),
  
  -- 👁️ Visibility
  public BOOLEAN DEFAULT TRUE,
  featured BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT NOW()
);