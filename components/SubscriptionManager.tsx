import React, { useState, useEffect } from 'react';
import { useUser, useSession } from '@clerk/clerk-react';
import { PricingService, PricingPlan, UserSubscription } from '../services/pricingService';

export const SubscriptionManager: React.FC = () => {
  const { user } = useUser();
  const { session } = useSession();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [plan, setPlan] = useState<PricingPlan | null>(null);
  const [usage, setUsage] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      loadSubscriptionData();
    }
  }, [session]);

  const loadSubscriptionData = async () => {
    try {
      setLoading(true);
      
      // Get subscription with plan details
      const { subscription: userSub, plan: userPlan } = await PricingService.getUserSubscriptionWithPlan(session);
      setSubscription(userSub);
      setPlan(userPlan);

      // Get current usage
      if (userSub) {
        const assessmentUsage = await PricingService.getUserUsage(session, 'assessment');
        const reportUsage = await PricingService.getUserUsage(session, 'report');
        const chatUsage = await PricingService.getUserUsage(session, 'chat_session');

        setUsage({
          assessments: assessmentUsage.reduce((total, u) => total + u.usage_count, 0),
          reports: reportUsage.reduce((total, u) => total + u.usage_count, 0),
          chat_sessions: chatUsage.reduce((total, u) => total + u.usage_count, 0)
        });
      }
    } catch (error) {
      console.error('Error loading subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription) return;

    const confirmed = window.confirm('Are you sure you want to cancel your subscription? You will still have access until the end of your current billing period.');
    
    if (confirmed) {
      const success = await PricingService.updateSubscriptionStatus(session, subscription.id, 'cancelled');
      if (success) {
        await loadSubscriptionData();
        alert('Subscription cancelled successfully. You will retain access until the end of your current billing period.');
      } else {
        alert('Failed to cancel subscription. Please try again or contact support.');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getUsagePercentage = (current: number, limit: number) => {
    if (limit === -1) return 0; // Unlimited
    return Math.min((current / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!subscription || !plan) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Active Subscription</h2>
          <p className="text-gray-600 mb-6">You don't have an active subscription yet.</p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            View Pricing Plans
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Subscription Management</h1>

      {/* Current Plan */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{plan.display_name}</h2>
            <p className="text-gray-600">{plan.description}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              ${subscription.billing_cycle === 'monthly' ? plan.price_monthly : (plan.price_yearly / 12).toFixed(2)}
              <span className="text-sm font-normal text-gray-500">
                /{subscription.billing_cycle === 'monthly' ? 'month' : 'month (yearly)'}
              </span>
            </div>
            <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              subscription.status === 'active' ? 'bg-green-100 text-green-800' :
              subscription.status === 'cancelled' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Billing Cycle:</span>
            <span className="ml-2 font-medium capitalize">{subscription.billing_cycle}</span>
          </div>
          <div>
            <span className="text-gray-500">Current Period:</span>
            <span className="ml-2 font-medium">
              {formatDate(subscription.current_period_start)} - {subscription.current_period_end ? formatDate(subscription.current_period_end) : 'N/A'}
            </span>
          </div>
          {subscription.cancelled_at && (
            <div className="md:col-span-2">
              <span className="text-gray-500">Cancelled On:</span>
              <span className="ml-2 font-medium text-red-600">{formatDate(subscription.cancelled_at)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Usage Overview */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Month Usage</h3>
        
        <div className="space-y-4">
          {/* Assessments */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Career Assessments</span>
              <span className="text-sm text-gray-500">
                {usage.assessments || 0} / {plan.limits.assessments_per_month === -1 ? '∞' : plan.limits.assessments_per_month}
              </span>
            </div>
            {plan.limits.assessments_per_month !== -1 && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${getUsageColor(getUsagePercentage(usage.assessments || 0, plan.limits.assessments_per_month))}`}
                  style={{ width: `${getUsagePercentage(usage.assessments || 0, plan.limits.assessments_per_month)}%` }}
                ></div>
              </div>
            )}
          </div>

          {/* Reports */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Detailed Reports</span>
              <span className="text-sm text-gray-500">
                {usage.reports || 0} / {plan.limits.reports_per_month === -1 ? '∞' : plan.limits.reports_per_month}
              </span>
            </div>
            {plan.limits.reports_per_month !== -1 && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${getUsageColor(getUsagePercentage(usage.reports || 0, plan.limits.reports_per_month))}`}
                  style={{ width: `${getUsagePercentage(usage.reports || 0, plan.limits.reports_per_month)}%` }}
                ></div>
              </div>
            )}
          </div>

          {/* AI Coaching */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">AI Coaching Sessions</span>
              <span className="text-sm text-gray-500">
                {usage.chat_sessions || 0} / {plan.limits.chat_sessions_per_month === -1 ? '∞' : plan.limits.chat_sessions_per_month}
              </span>
            </div>
            {plan.limits.chat_sessions_per_month !== -1 && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${getUsageColor(getUsagePercentage(usage.chat_sessions || 0, plan.limits.chat_sessions_per_month))}`}
                  style={{ width: `${getUsagePercentage(usage.chat_sessions || 0, plan.limits.chat_sessions_per_month)}%` }}
                ></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Plan Features */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Features</h3>
        <ul className="space-y-2">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Manage Subscription</h3>
        <div className="flex flex-wrap gap-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Upgrade Plan
          </button>
          <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
            Update Payment Method
          </button>
          {subscription.status === 'active' && (
            <button 
              onClick={handleCancelSubscription}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Cancel Subscription
            </button>
          )}
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          <p>Need help? <a href="#" className="text-blue-600 hover:text-blue-500">Contact our support team</a></p>
        </div>
      </div>
    </div>
  );
};
