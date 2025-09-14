-- FindWay Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Users table to store user profiles linked to Clerk authentication
CREATE TABLE public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    clerk_user_id TEXT UNIQUE NOT NULL, -- Clerk's user ID
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
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
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
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL, -- 'login', 'assessment_start', 'assessment_complete', 'chat_start', etc.
    activity_data JSONB, -- Additional data about the activity
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_users_clerk_user_id ON public.users(clerk_user_id);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_pretest_data_user_id ON public.user_pretest_data(user_id);
CREATE INDEX idx_activity_log_user_id ON public.user_activity_log(user_id);
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

-- Note: RLS is disabled for Clerk integration
-- Security is handled at the application level through Clerk authentication
-- Tables are accessible with anon key but protected by application logic
