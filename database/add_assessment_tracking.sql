-- Migration to add assessment tracking fields to existing users table
-- Run this SQL in your Supabase SQL Editor if you already have the users table

-- Add assessment tracking columns to existing users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS assessment_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_pro_user BOOLEAN DEFAULT false;

-- Update existing users to have 0 assessment count if NULL
UPDATE public.users 
SET assessment_count = 0 
WHERE assessment_count IS NULL;

-- Update existing users to be non-pro if NULL
UPDATE public.users 
SET is_pro_user = false 
WHERE is_pro_user IS NULL;

-- Add indexes for better performance on new columns
CREATE INDEX IF NOT EXISTS idx_users_assessment_count ON public.users(assessment_count);
CREATE INDEX IF NOT EXISTS idx_users_is_pro_user ON public.users(is_pro_user);

-- Verify the changes
SELECT column_name, data_type, column_default, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'public'
ORDER BY ordinal_position;
