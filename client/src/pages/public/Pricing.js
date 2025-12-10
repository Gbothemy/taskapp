import React from 'react';
import { Link } from 'react-router-dom';
import { CheckIcon } from '@heroicons/react/24/outline';

const Pricing = () => {
  const plans = [
    {
      name: 'Worker',
      price: 'Free',
      description: 'Perfect for individuals looking to earn money',
      features: [
        'Access to all available tasks',
        'Instant payments upon approval',
        'Basic profile and portfolio',
        'Email support',
        'Mobile app access',
        'Standard withdrawal options'
      ],
      cta: 'Start as Worker',
      popular: false
    },
    {
      name: 'Employer Basic',
      price: '5%',
      priceDetail: 'platform fee per task',
      description: 'Great for small businesses and individuals',
      features: [
        'Post unlimited tasks',
        'Access to verified workers',
        'Basic task management',
        'Email support',
        'Payment processing',
        'Basic analytics'
      ],
      cta: 'Start Posting Tasks',
      popular: true
    },
    {
      name: 'Employer Pro',
      price: '$29',
      priceDetail: 'per month + 3% fee',
      description: 'Advanced features for growing businesses',
      features: [
        'All Basic features',
        'Priority task placement',
        'Advanced worker filtering',
        'Dedicated account manager',
        'Advanced analytics',
        'Custom task templates',
        'Bulk task operations',
        'API access'
      ],
      cta: 'Upgrade to Pro',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that works best for you. No hidden fees, no long-term contracts.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-lg p-8 ${
                plan.popular ? 'ring-2 ring-primary-500 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.priceDetail && (
                    <span className="text-gray-600 ml-2">{plan.priceDetail}</span>
                  )}
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-primary-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/register"
                className={`w-full py-3 px-6 rounded-lg font-medium text-center block transition-colors ${
                  plan.popular
                    ? 'bg-primary-500 hover:bg-primary-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How does the platform fee work?
              </h3>
              <p className="text-gray-600">
                We charge a 5% platform fee on completed tasks for basic employers. 
                This fee is automatically deducted from the task payout.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                When do I get paid?
              </h3>
              <p className="text-gray-600">
                Workers receive payment immediately after their work is approved by the employer. 
                Funds are added to your TaskApp wallet instantly.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I change my plan anytime?
              </h3>
              <p className="text-gray-600">
                Yes, employers can upgrade or downgrade their plan at any time. 
                Changes take effect immediately for new tasks.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards, PayPal, and bank transfers. 
                All payments are processed securely through our payment partners.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of users already earning and getting work done on TaskApp.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="btn-primary text-lg px-8 py-3"
            >
              Sign Up Now
            </Link>
            <Link
              to="/contact"
              className="btn-outline text-lg px-8 py-3"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;