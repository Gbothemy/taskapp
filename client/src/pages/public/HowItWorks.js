import React from 'react';
import { Link } from 'react-router-dom';
import { 
  UserPlusIcon, 
  MagnifyingGlassIcon, 
  CheckCircleIcon,
  CurrencyDollarIcon,
  PlusIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

const HowItWorks = () => {
  const workerSteps = [
    {
      icon: UserPlusIcon,
      title: 'Sign Up',
      description: 'Create your free worker account in minutes. No experience required to get started.',
    },
    {
      icon: MagnifyingGlassIcon,
      title: 'Browse Tasks',
      description: 'Explore hundreds of available tasks in categories like data entry, content creation, and more.',
    },
    {
      icon: CheckCircleIcon,
      title: 'Complete Work',
      description: 'Choose tasks that match your skills, complete them following the instructions, and submit your work.',
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Get Paid',
      description: 'Receive payment instantly once your work is approved. Withdraw earnings anytime.',
    },
  ];

  const employerSteps = [
    {
      icon: PlusIcon,
      title: 'Post a Task',
      description: 'Create detailed task descriptions with clear instructions and fair compensation.',
    },
    {
      icon: UserPlusIcon,
      title: 'Workers Apply',
      description: 'Skilled workers will complete your tasks according to your specifications.',
    },
    {
      icon: EyeIcon,
      title: 'Review Work',
      description: 'Review submitted work and provide feedback. Approve quality submissions.',
    },
    {
      icon: CheckCircleIcon,
      title: 'Task Complete',
      description: 'Your task is completed by qualified workers, and payment is processed automatically.',
    },
  ];

  const taskCategories = [
    {
      name: 'Data Entry',
      description: 'Input data, transcription, form filling, and database management tasks.',
      examples: ['Spreadsheet data entry', 'Online form completion', 'Contact list building'],
    },
    {
      name: 'Content Creation',
      description: 'Writing, editing, social media content, and creative tasks.',
      examples: ['Blog post writing', 'Social media posts', 'Product descriptions'],
    },
    {
      name: 'Research',
      description: 'Market research, competitor analysis, and information gathering.',
      examples: ['Company research', 'Price comparisons', 'Contact information lookup'],
    },
    {
      name: 'Review & Testing',
      description: 'Website testing, app reviews, and quality assurance tasks.',
      examples: ['Website usability testing', 'App store reviews', 'Product feedback'],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-50 to-secondary-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How TaskApp Works</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simple, fast, and fair. Learn how to start earning money or get work done on TaskApp.
          </p>
        </div>
      </div>

      {/* For Workers */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">For Workers</h2>
            <p className="text-lg text-gray-600">Start earning money in four simple steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {workerSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-8 w-8 text-primary-600" />
                </div>
                <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-4">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* For Employers */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">For Employers</h2>
            <p className="text-lg text-gray-600">Get quality work done quickly and affordably</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {employerSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-8 w-8 text-secondary-600" />
                </div>
                <div className="w-8 h-8 bg-secondary-500 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-4">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Task Categories */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Task Categories</h2>
            <p className="text-lg text-gray-600">Discover the types of tasks available on TaskApp</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {taskCategories.map((category, index) => (
              <div key={index} className="card p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{category.name}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Examples:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {category.examples.map((example, i) => (
                      <li key={i} className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2" />
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-8">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How much can I earn?</h3>
              <p className="text-gray-600">
                Earnings vary based on the tasks you complete. Simple tasks may pay $1-5, while more complex 
                tasks can pay $10-50 or more. Many workers earn $100-500 per month working part-time.
              </p>
            </div>
            
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">When do I get paid?</h3>
              <p className="text-gray-600">
                You get paid immediately after your work is approved by the employer. Funds are added to 
                your TaskApp wallet and can be withdrawn at any time with a minimum of $10.
              </p>
            </div>
            
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What fees does TaskApp charge?</h3>
              <p className="text-gray-600">
                TaskApp charges a 5% platform fee on completed tasks. This fee is automatically deducted 
                from the task payout, so you always know exactly how much you'll earn.
              </p>
            </div>
            
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How do I ensure quality work?</h3>
              <p className="text-gray-600">
                Our platform includes worker ratings, approval rates, and detailed task instructions. 
                You can also set quality requirements and review all submissions before approval.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-primary-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of users who are already earning money and getting work done on TaskApp.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-primary-500 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors text-lg"
            >
              Start as Worker
            </Link>
            <Link
              to="/register"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-500 font-medium py-3 px-8 rounded-lg transition-colors text-lg"
            >
              Post Tasks as Employer
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;