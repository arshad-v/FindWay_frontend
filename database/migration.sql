-- Migration Script: Drop old tables and create new Clerk-Supabase integration schema
-- Run this SQL in your Supabase SQL Editor

-- Drop existing tables if they exist (in correct order due to foreign key constraints)
DROP TABLE IF EXISTS public.user_activity_log CASCADE;
DROP TABLE IF EXISTS public.user_pretest_data CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Now create the new schema
-- Users table to store user profiles linked to Clerk authentication
CREATE TABLE public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    clerk_user_id TEXT UNIQUE NOT NULL DEFAULT auth.jwt()->>'sub', -- Clerk's user ID from JWT
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true
);

-- Pre-test data table to store user information from PreTestScreen
CREATE TABLE public.user_pretest_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    clerk_user_id TEXT NOT NULL DEFAULT auth.jwt()->>'sub', -- Direct reference to Clerk user ID
    name TEXT NOT NULL,
    phone TEXT,
    age INTEGER,
    gender TEXT CHECK (gender IN ('Male', 'Female', 'Others')),
    education TEXT NOT NULL,
    degree TEXT,
    department TEXT,
    skills TEXT,
    area_of_interest TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User activity log for analytics
CREATE TABLE public.user_activity_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    clerk_user_id TEXT NOT NULL DEFAULT auth.jwt()->>'sub', -- Direct reference to Clerk user ID
    activity_type TEXT NOT NULL, -- 'login', 'assessment_start', 'assessment_complete', 'chat_start', etc.
    activity_data JSONB, -- Additional data about the activity
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_users_clerk_user_id ON public.users(clerk_user_id);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_pretest_data_clerk_user_id ON public.user_pretest_data(clerk_user_id);
CREATE INDEX idx_activity_log_clerk_user_id ON public.user_activity_log(clerk_user_id);
CREATE INDEX idx_activity_log_type ON public.user_activity_log(activity_type);
CREATE INDEX idx_activity_log_created_at ON public.user_activity_log(created_at);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pretest_data_updated_at BEFORE UPDATE ON public.user_pretest_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS) for Clerk JWT integration
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_pretest_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies using Clerk JWT tokens
-- Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT 
TO authenticated 
USING ((select auth.jwt()->>'sub') = clerk_user_id);

CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE 
TO authenticated 
USING ((select auth.jwt()->>'sub') = clerk_user_id);

CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT 
TO authenticated 
WITH CHECK ((select auth.jwt()->>'sub') = clerk_user_id);

-- Users can manage their own pretest data
CREATE POLICY "Users can view own pretest data" ON public.user_pretest_data FOR SELECT 
TO authenticated 
USING ((select auth.jwt()->>'sub') = clerk_user_id);

CREATE POLICY "Users can insert own pretest data" ON public.user_pretest_data FOR INSERT 
TO authenticated 
WITH CHECK ((select auth.jwt()->>'sub') = clerk_user_id);

CREATE POLICY "Users can update own pretest data" ON public.user_pretest_data FOR UPDATE 
TO authenticated 
USING ((select auth.jwt()->>'sub') = clerk_user_id);

-- Users can view and insert their own activity logs
CREATE POLICY "Users can view own activity log" ON public.user_activity_log FOR SELECT 
TO authenticated 
USING ((select auth.jwt()->>'sub') = clerk_user_id);

CREATE POLICY "Users can insert own activity log" ON public.user_activity_log FOR INSERT 
TO authenticated 
WITH CHECK ((select auth.jwt()->>'sub') = clerk_user_id);
