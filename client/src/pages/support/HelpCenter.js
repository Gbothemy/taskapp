import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  CurrencyDollarIcon,
  UserIcon,
  ShieldCheckIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      icon: QuestionMarkCircleIcon,
      title: 'Getting Started',
      description: 'Learn the basics of using TaskApp',
      articles: [
        'How to create an account',
        'Setting up your profile',
        'Understanding user roles',
        'First steps for workers',
        'First steps for employers'
      ]
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Payments & Earnings',
      description: 'Everything about money on TaskApp',
      articles: [
        'How payments work',
        'Withdrawal methods',
        'Platform fees explained',
        'Payment schedules',
        'Tax information'
      ]
    },
    {
      icon: UserIcon,
      title: 'Account Management',
      description: 'Managing your TaskApp account',
      articles: [
        'Updating profile information',
        'Changing password',
        'Account verification',
        'Privacy settings',
        'Deleting your account'
      ]
    },
    {
      icon: ShieldCheckIcon,
      title: 'Safety & Security',
      description: 'Staying safe on the platform',
      articles: [
        'Reporting inappropriate content',
        'Avoiding scams',
        'Data protection',
        'Account security tips',
        'Dispute resolution'
      ]
    }
  ];

  const popularArticles = [
    'How do I get paid for completed tasks?',
    'What types of tasks are available?',
    'How to increase my approval rate?',
    'Minimum withdrawal amount',
    'How to contact support',
    'Platform fee structure'
  ];

  const filteredCategories = categories.map(category => ({
    ...category,
    articles: category.articles.filter(article =>
      article.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => 
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.articles.length > 0
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Help Center
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Find answers to your questions and get the help you need
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
              />
            </div>
          </div>
        </div>

        {/* Popular Articles */}
        {!searchQuery && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularArticles.map((article, index) => (
                <Link
                  key={index}
                  to={`/help/article/${index + 1}`}
                  className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 flex items-center justify-between group"
                >
                  <span className="text-gray-700 group-hover:text-primary-600">
                    {article}
                  </span>
                  <ChevronRightIcon className="h-4 w-4 text-gray-400 group-hover:text-primary-600" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {filteredCategories.map((category, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                  <category.icon className="h-6 w-6 text-primary-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{category.title}</h3>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              </div>

              <ul className="space-y-3">
                {category.articles.map((article, articleIndex) => (
                  <li key={articleIndex}>
                    <Link
                      to={`/help/article/${index * 10 + articleIndex + 1}`}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <span className="text-gray-700 group-hover:text-primary-600">
                        {article}
                      </span>
                      <ChevronRightIcon className="h-4 w-4 text-gray-400 group-hover:text-primary-600" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-8 sm:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Still Need Help?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-white text-primary-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Contact Support
            </Link>
            <Link
              to="/help/submit-ticket"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Submit a Ticket
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;