import { createClerkSupabaseClient } from './supabaseClient';

export interface PricingPlan {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  limits: {
    assessments_per_month: number;
    reports_per_month: number;
    chat_sessions_per_month: number;
  };
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface UserSubscription {
  id: string;
  clerk_user_id: string;
  plan_id: string;
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  billing_cycle: 'monthly' | 'yearly';
  current_period_start: string;
  current_period_end?: string;
  trial_end?: string;
  cancelled_at?: string;
  payment_provider?: string;
  external_subscription_id?: string;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export interface UserUsage {
  id: string;
  clerk_user_id: string;
  usage_type: string;
  usage_count: number;
  usage_date: string;
  metadata: any;
  created_at: string;
}

export class PricingService {
  // Get all active pricing plans (public access)
  static async getPricingPlans(): Promise<PricingPlan[]> {
    try {
      const { data, error } = await createClerkSupabaseClient(null)
        .from('pricing_plans')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) {
        console.error('Error fetching pricing plans:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getPricingPlans:', error);
      return [];
    }
  }

  // Get user's current subscription
  static async getUserSubscription(session: any): Promise<UserSubscription | null> {
    try {
      const client = createClerkSupabaseClient(session);
      
      const { data, error } = await client
        .from('user_subscriptions')
        .select('*')
        .eq('status', 'active')
        .maybeSingle();

      if (error) {
        console.error('Error fetching user subscription:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getUserSubscription:', error);
      return null;
    }
  }

  // Create a new subscription for user
  static async createSubscription(
    session: any,
    planId: string,
    billingCycle: 'monthly' | 'yearly',
    paymentProvider?: string,
    externalSubscriptionId?: string
  ): Promise<UserSubscription | null> {
    try {
      const client = createClerkSupabaseClient(session);
      
      // Calculate period end based on billing cycle
      const periodStart = new Date();
      const periodEnd = new Date();
      if (billingCycle === 'monthly') {
        periodEnd.setMonth(periodEnd.getMonth() + 1);
      } else {
        periodEnd.setFullYear(periodEnd.getFullYear() + 1);
      }

      const { data, error } = await client
        .from('user_subscriptions')
        .insert({
          plan_id: planId,
          billing_cycle: billingCycle,
          current_period_start: periodStart.toISOString(),
          current_period_end: periodEnd.toISOString(),
          payment_provider: paymentProvider,
          external_subscription_id: externalSubscriptionId,
          status: 'active'
        })
        .select();

      if (error) {
        console.error('Error creating subscription:', error);
        return null;
      }

      return Array.isArray(data) && data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error('Error in createSubscription:', error);
      return null;
    }
  }

  // Update subscription status
  static async updateSubscriptionStatus(
    session: any,
    subscriptionId: string,
    status: 'active' | 'cancelled' | 'expired' | 'trial'
  ): Promise<boolean> {
    try {
      const client = createClerkSupabaseClient(session);
      
      const updateData: any = { status };
      if (status === 'cancelled') {
        updateData.cancelled_at = new Date().toISOString();
      }

      const { error } = await client
        .from('user_subscriptions')
        .update(updateData)
        .eq('id', subscriptionId);

      if (error) {
        console.error('Error updating subscription status:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateSubscriptionStatus:', error);
      return false;
    }
  }

  // Track user usage
  static async trackUsage(
    session: any,
    usageType: string,
    usageCount: number = 1,
    metadata?: any
  ): Promise<boolean> {
    try {
      const client = createClerkSupabaseClient(session);
      
      const { error } = await client
        .from('user_usage')
        .insert({
          usage_type: usageType,
          usage_count: usageCount,
          usage_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
          metadata: metadata || {}
        });

      if (error) {
        console.error('Error tracking usage:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in trackUsage:', error);
      return false;
    }
  }

  // Get user's current month usage
  static async getUserUsage(session: any, usageType?: string): Promise<UserUsage[]> {
    try {
      const client = createClerkSupabaseClient(session);
      
      // Get current month's usage
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
      
      let query = client
        .from('user_usage')
        .select('*')
        .gte('usage_date', `${currentMonth}-01`)
        .lt('usage_date', `${currentMonth}-32`);

      if (usageType) {
        query = query.eq('usage_type', usageType);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user usage:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserUsage:', error);
      return [];
    }
  }

  // Check if user can perform an action based on their plan limits
  static async canUserPerformAction(
    session: any,
    actionType: 'assessment' | 'report' | 'chat_session'
  ): Promise<{ allowed: boolean; currentUsage: number; limit: number }> {
    try {
      // Get user's subscription and plan
      const subscription = await this.getUserSubscription(session);
      if (!subscription) {
        return { allowed: false, currentUsage: 0, limit: 0 };
      }

      // Get plan details
      const plans = await this.getPricingPlans();
      const plan = plans.find(p => p.id === subscription.plan_id);
      if (!plan) {
        return { allowed: false, currentUsage: 0, limit: 0 };
      }

      // Get usage type mapping
      const usageTypeMap = {
        assessment: 'assessment',
        report: 'report',
        chat_session: 'chat_session'
      };

      const limitMap = {
        assessment: 'assessments_per_month',
        report: 'reports_per_month',
        chat_session: 'chat_sessions_per_month'
      };

      const usageType = usageTypeMap[actionType];
      const limitKey = limitMap[actionType];
      const limit = plan.limits[limitKey];

      // -1 means unlimited
      if (limit === -1) {
        return { allowed: true, currentUsage: 0, limit: -1 };
      }

      // Get current usage
      const usage = await this.getUserUsage(session, usageType);
      const currentUsage = usage.reduce((total, u) => total + u.usage_count, 0);

      return {
        allowed: currentUsage < limit,
        currentUsage,
        limit
      };
    } catch (error) {
      console.error('Error in canUserPerformAction:', error);
      return { allowed: false, currentUsage: 0, limit: 0 };
    }
  }

  // Get user's subscription with plan details
  static async getUserSubscriptionWithPlan(session: any): Promise<{
    subscription: UserSubscription | null;
    plan: PricingPlan | null;
  }> {
    try {
      const subscription = await this.getUserSubscription(session);
      if (!subscription) {
        return { subscription: null, plan: null };
      }

      const plans = await this.getPricingPlans();
      const plan = plans.find(p => p.id === subscription.plan_id) || null;

      return { subscription, plan };
    } catch (error) {
      console.error('Error in getUserSubscriptionWithPlan:', error);
      return { subscription: null, plan: null };
    }
  }
}
