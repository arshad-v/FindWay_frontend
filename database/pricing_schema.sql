-- Pricing Plans Schema for FindWay Application
-- Add this to your existing Supabase database

-- Pricing plans table to define available subscription tiers
CREATE TABLE public.pricing_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL, -- 'Free', 'Basic', 'Premium', 'Enterprise'
    display_name TEXT NOT NULL, -- 'Free Plan', 'Basic Plan', etc.
    description TEXT,
    price_monthly DECIMAL(10,2) NOT NULL DEFAULT 0, -- Monthly price in USD
    price_yearly DECIMAL(10,2) NOT NULL DEFAULT 0, -- Yearly price in USD (with discount)
    features JSONB NOT NULL DEFAULT '[]', -- Array of features included
    limits JSONB NOT NULL DEFAULT '{}', -- Usage limits (assessments, reports, etc.)
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0, -- For display ordering
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User subscriptions table to track user's current plan
CREATE TABLE public.user_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    clerk_user_id TEXT NOT NULL DEFAULT auth.jwt()->>'sub',
    plan_id UUID REFERENCES public.pricing_plans(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'trial')),
    billing_cycle TEXT NOT NULL DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
    current_period_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    current_period_end TIMESTAMP WITH TIME ZONE,
    trial_end TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    payment_provider TEXT, -- 'stripe', 'paypal', etc.
    external_subscription_id TEXT, -- ID from payment provider
    metadata JSONB DEFAULT '{}', -- Additional subscription data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usage tracking table to monitor user consumption
CREATE TABLE public.user_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    clerk_user_id TEXT NOT NULL DEFAULT auth.jwt()->>'sub',
    usage_type TEXT NOT NULL, -- 'assessment', 'report', 'chat_session', etc.
    usage_count INTEGER DEFAULT 1,
    usage_date DATE DEFAULT CURRENT_DATE,
    metadata JSONB DEFAULT '{}', -- Additional usage data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment history table for tracking transactions
CREATE TABLE public.payment_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    clerk_user_id TEXT NOT NULL DEFAULT auth.jwt()->>'sub',
    subscription_id UUID REFERENCES public.user_subscriptions(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_provider TEXT NOT NULL,
    external_payment_id TEXT,
    payment_method TEXT, -- 'card', 'paypal', etc.
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_user_subscriptions_clerk_user_id ON public.user_subscriptions(clerk_user_id);
CREATE INDEX idx_user_subscriptions_status ON public.user_subscriptions(status);
CREATE INDEX idx_user_usage_clerk_user_id ON public.user_usage(clerk_user_id);
CREATE INDEX idx_user_usage_date ON public.user_usage(usage_date);
CREATE INDEX idx_payment_history_clerk_user_id ON public.payment_history(clerk_user_id);

-- Enable RLS for all pricing tables
ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for pricing plans (public read access)
CREATE POLICY "Anyone can view active pricing plans" ON public.pricing_plans FOR SELECT 
TO authenticated, anon
USING (is_active = true);

-- RLS Policies for user subscriptions
CREATE POLICY "Users can view own subscriptions" ON public.user_subscriptions FOR SELECT 
TO authenticated 
USING ((select auth.jwt()->>'sub') = clerk_user_id);

CREATE POLICY "Users can insert own subscriptions" ON public.user_subscriptions FOR INSERT 
TO authenticated 
WITH CHECK ((select auth.jwt()->>'sub') = clerk_user_id);

CREATE POLICY "Users can update own subscriptions" ON public.user_subscriptions FOR UPDATE 
TO authenticated 
USING ((select auth.jwt()->>'sub') = clerk_user_id);

-- RLS Policies for user usage
CREATE POLICY "Users can view own usage" ON public.user_usage FOR SELECT 
TO authenticated 
USING ((select auth.jwt()->>'sub') = clerk_user_id);

CREATE POLICY "Users can insert own usage" ON public.user_usage FOR INSERT 
TO authenticated 
WITH CHECK ((select auth.jwt()->>'sub') = clerk_user_id);

-- RLS Policies for payment history
CREATE POLICY "Users can view own payment history" ON public.payment_history FOR SELECT 
TO authenticated 
USING ((select auth.jwt()->>'sub') = clerk_user_id);

CREATE POLICY "Users can insert own payment history" ON public.payment_history FOR INSERT 
TO authenticated 
WITH CHECK ((select auth.jwt()->>'sub') = clerk_user_id);

-- Insert default pricing plans
INSERT INTO public.pricing_plans (name, display_name, description, price_monthly, price_yearly, features, limits, sort_order) VALUES
('free', 'Free Plan', 'Perfect for getting started with career assessment', 0.00, 0.00, 
 '["Basic career assessment", "1 detailed report", "Email support"]',
 '{"assessments_per_month": 1, "reports_per_month": 1, "chat_sessions_per_month": 0}',
 1),

('basic', 'Basic Plan', 'Ideal for individuals seeking comprehensive career guidance', 9.99, 99.99,
 '["Unlimited career assessments", "5 detailed reports per month", "Basic AI coaching", "Email support"]',
 '{"assessments_per_month": -1, "reports_per_month": 5, "chat_sessions_per_month": 10}',
 2),

('premium', 'Premium Plan', 'Best for professionals and career changers', 19.99, 199.99,
 '["Everything in Basic", "Unlimited detailed reports", "Advanced AI coaching", "Priority support", "Career roadmap planning"]',
 '{"assessments_per_month": -1, "reports_per_month": -1, "chat_sessions_per_month": 50}',
 3),

('enterprise', 'Enterprise Plan', 'Perfect for teams and organizations', 49.99, 499.99,
 '["Everything in Premium", "Team management", "Custom assessments", "Analytics dashboard", "Dedicated support"]',
 '{"assessments_per_month": -1, "reports_per_month": -1, "chat_sessions_per_month": -1}',
 4);

-- Add updated_at triggers
CREATE TRIGGER update_pricing_plans_updated_at BEFORE UPDATE ON public.pricing_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_subscriptions_updated_at BEFORE UPDATE ON public.user_subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
