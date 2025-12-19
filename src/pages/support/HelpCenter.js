import React, { useState } from 'react';
import { 
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  BookOpenIcon,
  VideoCameraIcon,
  ChatBubbleLeftRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  RocketLaunchIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const categories = [
    {
      icon: RocketLaunchIcon,
      title: 'Getting Started',
      description: 'Learn the basics and set up your account',
      articles: 12,
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: CreditCardIcon,
      title: 'Payments & Billing',
      description: 'Manage payments, withdrawals, and invoices',
      articles: 8,
      color: 'from-green-500 to-green-600'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Security & Privacy',
      description: 'Keep your account safe and secure',
      articles: 6,
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: UserGroupIcon,
      title: 'Account Management',
      description: 'Update profile, settings, and preferences',
      articles: 10,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const faqs = [
    {
      question: 'How do I create an account?',
      answer: 'Click on the "Sign Up" button in the top right corner, choose your account type (Worker or Employer), and fill in your details. You\'ll receive a confirmation email to verify your account.'
    },
    {
      question: 'How do I post a task as an employer?',
      answer: 'After logging in as an employer, navigate to "Create Task" from your dashboard. Fill in the task details including title, description, budget, and deadline. Once submitted, your task will be visible to workers.'
    },
    {
      question: 'How do I get paid for completed tasks?',
      answer: 'Once an employer approves your submission, the payment is processed to your wallet. You can withdraw funds from your wallet to your bank account or preferred payment method. Payments typically process within 2-5 business days.'
    },
    {
      question: 'What payment methods are supported?',
      answer: 'We support bank transfers, PayPal, and major credit/debit cards. You can manage your payment methods in the Settings section under Payment Methods.'
    },
    {
      question: 'How do I contact support?',
      answer: 'You can reach our support team through the Contact Us page, or email us directly at support@taskapp.com. We typically respond within 24 hours during business days.'
    },
    {
      question: 'Can I cancel a task after posting it?',
      answer: 'Yes, employers can cancel tasks before they are accepted by a worker. Once a worker has started working on a task, cancellation requires mutual agreement or admin intervention.'
    },
    {
      question: 'How is my data protected?',
      answer: 'We use industry-standard encryption and security measures to protect your data. All sensitive information is encrypted both in transit and at rest. We never share your personal information with third parties without your consent.'
    },
    {
      question: 'What happens if there\'s a dispute?',
      answer: 'If there\'s a disagreement between employer and worker, you can open a dispute through the task page. Our admin team will review the case and make a fair decision based on the evidence provided by both parties.'
    }
  ];

  const popularArticles = [
    { title: 'Getting Started Guide for Workers', views: 1234, category: 'Getting Started' },
    { title: 'How to Create Your First Task', views: 987, category: 'Getting Started' },
    { title: 'Understanding Payment Processing', views: 856, category: 'Payments' },
    { title: 'Best Practices for Task Descriptions', views: 743, category: 'Tips & Tricks' },
    { title: 'Account Security Tips', views: 621, category: 'Security' }
  ];

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-xl">
              <QuestionMarkCircleIcon className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-black text-secondary-900 mb-4">
            Help Center
          </h1>
          <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
            Find answers to common questions and get the support you need
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-secondary-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help articles, guides, and FAQs..."
              className="w-full pl-14 pr-4 py-5 text-lg border-2 border-secondary-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-lg"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-16">
          <h2 className="text-3xl font-black text-secondary-900 mb-8 text-center">
            Browse by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm border border-primary-200/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <category.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-secondary-900 mb-2">
                  {category.title}
                </h3>
                <p className="text-secondary-600 mb-4">
                  {category.description}
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="primary" size="sm">
                    {category.articles} articles
                  </Badge>
                  <span className="text-primary-600 font-semibold group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Articles */}
        <div className="mb-16">
          <h2 className="text-3xl font-black text-secondary-900 mb-8 text-center">
            Popular Articles
          </h2>
          <div className="bg-white/80 backdrop-blur-sm border border-primary-200/50 rounded-2xl shadow-xl overflow-hidden">
            {popularArticles.map((article, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-6 border-b border-secondary-100 last:border-b-0 hover:bg-secondary-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <BookOpenIcon className="w-6 h-6 text-primary-600" />
                  <div>
                    <h3 className="font-semibold text-secondary-900 mb-1">
                      {article.title}
                    </h3>
                    <div className="flex items-center space-x-3">
                      <Badge variant="default" size="sm">
                        {article.category}
                      </Badge>
                      <span className="text-sm text-secondary-500">
                        {article.views.toLocaleString()} views
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronDownIcon className="w-5 h-5 text-secondary-400 transform -rotate-90" />
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-16">
          <h2 className="text-3xl font-black text-secondary-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm border border-primary-200/50 rounded-2xl shadow-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-secondary-50 transition-colors"
                >
                  <span className="font-semibold text-secondary-900 pr-4">
                    {faq.question}
                  </span>
                  {expandedFaq === index ? (
                    <ChevronUpIcon className="w-5 h-5 text-primary-600 flex-shrink-0" />
                  ) : (
                    <ChevronDownIcon className="w-5 h-5 text-secondary-400 flex-shrink-0" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-6 text-secondary-700 leading-relaxed border-t border-secondary-100 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-8 text-center">
            <VideoCameraIcon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-blue-900 mb-2">
              Video Tutorials
            </h3>
            <p className="text-blue-700 mb-4">
              Watch step-by-step guides
            </p>
            <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
              Watch Now
            </Button>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-8 text-center">
            <ChatBubbleLeftRightIcon className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-900 mb-2">
              Live Chat Support
            </h3>
            <p className="text-green-700 mb-4">
              Chat with our support team
            </p>
            <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white">
              Start Chat
            </Button>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-8 text-center">
            <BookOpenIcon className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-purple-900 mb-2">
              Documentation
            </h3>
            <p className="text-purple-700 mb-4">
              Read detailed guides
            </p>
            <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white">
              View Docs
            </Button>
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-3xl font-black mb-4">
            Still Need Help?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Our support team is here to assist you
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-white text-primary-600 hover:bg-primary-50"
              size="lg"
            >
              Contact Support
            </Button>
            <Button 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10"
              size="lg"
            >
              Email Us
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;