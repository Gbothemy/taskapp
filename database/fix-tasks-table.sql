-- ============================================================================
-- FIX TASKS TABLE - Add Missing Columns
-- ============================================================================
-- This script adds any missing columns to the tasks table
-- Run this if you're getting "column not found" errors
-- ============================================================================

-- Check if deliverables column exists, if not add it
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tasks' AND column_name = 'deliverables'
    ) THEN
        ALTER TABLE tasks ADD COLUMN deliverables JSONB DEFAULT '[]';
        RAISE NOTICE 'Added deliverables column to tasks table';
    ELSE
        RAISE NOTICE 'deliverables column already exists';
    END IF;
END $$;

-- Check if required_skills column exists, if not add it
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tasks' AND column_name = 'required_skills'
    ) THEN
        ALTER TABLE tasks ADD COLUMN required_skills JSONB DEFAULT '[]';
        RAISE NOTICE 'Added required_skills column to tasks table';
    ELSE
        RAISE NOTICE 'required_skills column already exists';
    END IF;
END $$;

-- Check if attachments column exists, if not add it
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tasks' AND column_name = 'attachments'
    ) THEN
        ALTER TABLE tasks ADD COLUMN attachments JSONB DEFAULT '[]';
        RAISE NOTICE 'Added attachments column to tasks table';
    ELSE
        RAISE NOTICE 'attachments column already exists';
    END IF;
END $$;

-- Check if requirements column exists, if not add it
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tasks' AND column_name = 'requirements'
    ) THEN
        ALTER TABLE tasks ADD COLUMN requirements TEXT;
        RAISE NOTICE 'Added requirements column to tasks table';
    ELSE
        RAISE NOTICE 'requirements column already exists';
    END IF;
END $$;

-- Check if difficulty_level column exists, if not add it
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tasks' AND column_name = 'difficulty_level'
    ) THEN
        ALTER TABLE tasks ADD COLUMN difficulty_level VARCHAR DEFAULT 'medium' CHECK (difficulty_level IN ('easy', 'medium', 'hard', 'expert'));
        RAISE NOTICE 'Added difficulty_level column to tasks table';
    ELSE
        RAISE NOTICE 'difficulty_level column already exists';
    END IF;
END $$;

-- Check if max_submissions column exists, if not add it
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tasks' AND column_name = 'max_submissions'
    ) THEN
        ALTER TABLE tasks ADD COLUMN max_submissions INTEGER DEFAULT 1;
        RAISE NOTICE 'Added max_submissions column to tasks table';
    ELSE
        RAISE NOTICE 'max_submissions column already exists';
    END IF;
END $$;

-- Check if allow_revisions column exists, if not add it
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tasks' AND column_name = 'allow_revisions'
    ) THEN
        ALTER TABLE tasks ADD COLUMN allow_revisions BOOLEAN DEFAULT TRUE;
        RAISE NOTICE 'Added allow_revisions column to tasks table';
    ELSE
        RAISE NOTICE 'allow_revisions column already exists';
    END IF;
END $$;

-- Show current tasks table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'tasks' 
ORDER BY ordinal_position;