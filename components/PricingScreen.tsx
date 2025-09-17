import React, { useState, useEffect } from 'react';
import { useUser, useSession } from '@clerk/clerk-react';
import { DatabaseService } from '../services/databaseService';

interface TokenPlan {
  id: string;
  name: string;
  displayName: string;
  price: number;
  originalPrice?: number; // For offer pricing
  currency: string;
  tokens: number;
  features: string[];
  limitations?: string[];
  isPopular?: boolean;
  isEnterprise?: boolean;
}

interface PricingScreenProps {
  onBack?: () => void;
  onPlanSelect?: (plan: TokenPlan) => void;
}

export const PricingScreen: React.FC<PricingScreenProps> = ({ onBack, onPlanSelect }) => {
  const { user } = useUser();
  const { session } = useSession();
  const [userTokens, setUserTokens] = useState<number | null>(null);
  const [isProUser, setIsProUser] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch user's current token status
  useEffect(() => {
    const fetchUserTokens = async () => {
      if (!session) {
        setLoading(false);
        return;
      }

      try {
        const status = await DatabaseService.getUserAssessmentStatus(session);
        if (status) {
          // Calculate remaining tokens based on user type and usage
          const usedTokens = status.assessmentCount;
          const isProUser = status.isProUser;
          
          setIsProUser(isProUser);
          
          if (isProUser) {
            // Pro users have 2 tokens total
            const remainingTokens = Math.max(0, 2 - usedTokens);
            setUserTokens(remainingTokens);
          } else {
            // Free users have 1 token total
            const remainingTokens = Math.max(0, 1 - usedTokens);
            setUserTokens(remainingTokens);
          }
        } else {
          // New user - has 1 free token
          setUserTokens(1);
          setIsProUser(false);
        }
      } catch (error) {
        console.error('Error fetching user tokens:', error);
        // Default to 1 token for new users
        setUserTokens(1);
        setIsProUser(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUserTokens();
  }, [session]);

  // Static pricing plans - will be moved to backend later
  const plans: TokenPlan[] = [
    {
      id: 'free',
      name: 'free',
      displayName: 'Free Plan',
      price: 0,
      currency: 'INR',
      tokens: 1,
      features: [
        '1 Career Assessment',
        '1 Generated Report',
        'Limited Insights',
        'Limited Report Pages',
        'Limited PDF Downloads',
        'Basic AI Career Chat'
      ],
      limitations: [
        'No Memory in AI Chat',
        'No Saved Reports',
        'Basic Support Only'
      ]
    },
    {
      id: 'pro',
      name: 'pro',
      displayName: 'Pro Plan',
      price: 99, // Offer price
      originalPrice: 299, // Original price for discount display
      currency: 'INR',
      tokens: 2,
      isPopular: true,
      features: [
        '2 Assessment Tokens',
        '50+ Page Detailed Reports',
        'Advanced Career Insights',
        'Unlimited AI Career Coach',
        'AI Chat Memory & Context',
        'Save & Download Reports',
        'Priority Support',
        'Career Roadmap Planning',
        'Industry Trend Analysis'
      ]
    },
    {
      id: 'enterprise',
      name: 'enterprise',
      displayName: 'Enterprise Plan',
      price: 0, // Custom pricing
      currency: 'INR',
      tokens: -1, // Unlimited
      isEnterprise: true,
      features: [
        'Unlimited Assessments',
        'Custom PDF Templates',
        'Custom Report Formats',
        'Custom Assessment Questions',
        'White-label Solutions',
        'Advanced AI Customization',
        'Dedicated Account Manager',
        'Custom Integrations',
        'Team Management',
        'Analytics Dashboard',
        'API Access'
      ]
    }
  ];

  const handlePlanSelect = (plan: TokenPlan) => {
    if (onPlanSelect) {
      onPlanSelect(plan);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    if (price === 0) return 'Free';
    return `₹${price}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        {onBack && (
          <div className="mb-8">
            <button
              onClick={onBack}
              className="inline-flex items-center px-4 py-2 text-white hover:text-blue-300 transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </button>
          </div>
        )}

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Choose Your Career Journey
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Unlock your potential with our limited-time offer. Get advanced career insights and personalized guidance to shape your future.
          </p>
          {/* User Token Display */}
          {user && (
            <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  loading ? 'bg-gray-400' : 
                  userTokens === 0 ? 'bg-red-400' : 
                  isProUser ? 'bg-purple-400' : 'bg-blue-400'
                }`}></div>
                <span className="text-white font-medium">
                  {loading ? (
                    'Loading tokens...'
                  ) : (
                    <>
                      Your Tokens: <span className={`font-bold ${
                        userTokens === 0 ? 'text-red-300' : 
                        isProUser ? 'text-purple-300' : 'text-blue-300'
                      }`}>
                        {userTokens}
                      </span>
                      {isProUser && (
                        <span className="ml-2 px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                          PRO
                        </span>
                      )}
                    </>
                  )}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            return (
              <div
                key={plan.id}
                className={`relative bg-white/10 backdrop-blur-md border rounded-2xl p-6 shadow-2xl transition-all hover:scale-105 ${
                  plan.isPopular
                    ? 'border-blue-400 ring-2 ring-blue-400/50 scale-105'
                    : plan.isEnterprise
                    ? 'border-purple-400 ring-2 ring-purple-400/50'
                    : 'border-white/20'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 text-sm font-medium rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                {plan.isEnterprise && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 text-sm font-medium rounded-full">
                      Enterprise
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {plan.displayName}
                  </h3>
                  
                  {/* Token Display */}
                  <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <div className={`w-4 h-4 rounded-full ${
                        plan.tokens === -1 ? 'bg-purple-400' : 
                        plan.tokens > 1 ? 'bg-blue-400' : 'bg-gray-400'
                      }`}></div>
                      <span className="text-white font-bold text-lg">
                        {plan.tokens === -1 ? 'Unlimited' : `${plan.tokens} Token${plan.tokens > 1 ? 's' : ''}`}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">
                      {plan.tokens === -1 
                        ? 'Unlimited assessments & reports' 
                        : `${plan.tokens} complete assessment${plan.tokens > 1 ? 's' : ''} + report${plan.tokens > 1 ? 's' : ''}`
                      }
                    </p>
                  </div>

                  <div className="mb-6">
                    {plan.originalPrice && plan.originalPrice > plan.price ? (
                      <>
                        <div className="flex items-center justify-center space-x-2 mb-2">
                          <span className="text-3xl font-bold text-white">{formatPrice(plan.price, plan.currency)}</span>
                          <span className="text-xl text-gray-400 line-through">{formatPrice(plan.originalPrice, plan.currency)}</span>
                        </div>
                        <div className="text-center">
                          <span className="inline-block px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-semibold rounded-full">
                            {Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100)}% OFF
                          </span>
                        </div>
                        {!plan.isEnterprise && (
                          <p className="text-gray-400 text-sm text-center mt-2">
                            Limited Time Offer
                          </p>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="text-4xl font-bold text-white mb-2 text-center">
                          {plan.isEnterprise ? 'Custom' : formatPrice(plan.price, plan.currency)}
                        </div>
                        {!plan.isEnterprise && (
                          <p className="text-gray-400 text-sm text-center">
                            One-time payment
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => handlePlanSelect(plan)}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                      plan.isEnterprise
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                        : plan.isPopular
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    {plan.isEnterprise ? 'Contact Sales' : plan.price === 0 ? 'Get Started Free' : 'Coming Soon'}
                  </button>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-300 uppercase tracking-wide">
                    What's Included
                  </h4>
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Limitations for Free Plan */}
                {plan.limitations && (
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <h5 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
                      Limitations
                    </h5>
                    <div className="space-y-2">
                      {plan.limitations.map((limitation, index) => (
                        <div key={index} className="flex items-start">
                          <svg className="h-4 w-4 text-red-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-400 text-sm">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Payment Gateway Notice */}
        <div className="mt-12 mb-8 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 border border-amber-500/50 backdrop-blur-sm rounded-2xl p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-amber-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-amber-300 font-semibold">Payment Processing Coming Soon</span>
            </div>
            <p className="text-amber-200 text-sm leading-relaxed">
              We're currently setting up our payment gateway. You can explore our plans above, but purchasing will be available soon. 
              Stay tuned for updates and get ready to unlock advanced career insights!
            </p>
          </div>
        </div>

        {/* How Tokens Work */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">How Tokens Work</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-400 font-bold text-xl">1</span>
                </div>
                <h4 className="text-white font-semibold mb-2">Take Assessment</h4>
                <p className="text-gray-300 text-sm">Complete your career assessment questionnaire</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-400 font-bold text-xl">2</span>
                </div>
                <h4 className="text-white font-semibold mb-2">Generate Report</h4>
                <p className="text-gray-300 text-sm">AI generates your personalized career report</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-400 font-bold text-xl">3</span>
                </div>
                <h4 className="text-white font-semibold mb-2">Use 1 Token</h4>
                <p className="text-gray-300 text-sm">One token is consumed for the complete process</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-400 text-sm mb-2">
            Tokens never expire. Use them whenever you're ready for your next career assessment.
          </p>
          <p className="text-gray-400 text-sm">
            Need help choosing? <a href="#" className="text-blue-400 hover:text-blue-300">Contact our team</a>
          </p>
        </div>
      </div>
    </div>
  );
};
