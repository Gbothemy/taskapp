import React from 'react';
import { Link } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/24/solid';

const SuccessStories = () => {
  const stories = [
    {
      name: 'Sarah Johnson',
      role: 'Freelance Writer',
      avatar: '👩‍💼',
      location: 'New York, USA',
      earnings: '$2,500',
      period: 'in 3 months',
      story: 'I started using TaskApp as a side hustle while working my full-time job. The flexible schedule allowed me to work on writing tasks during evenings and weekends. Within 3 months, I was earning enough to quit my day job and work full-time on the platform.',
      tasks: 127,
      rating: 4.9,
      specialties: ['Content Writing', 'Blog Posts', 'Product Descriptions']
    },
    {
      name: 'Mike Chen',
      role: 'Small Business Owner',
      avatar: '👨‍💻',
      location: 'San Francisco, USA',
      savings: '$15,000',
      period: 'in hiring costs',
      story: 'As a startup founder, I needed help with various tasks but couldn\'t afford full-time employees. TaskApp connected me with skilled workers who helped with everything from data entry to social media management. It saved me thousands in hiring costs.',
      tasksPosted: 89,
      rating: 4.8,
      categories: ['Data Entry', 'Social Media', 'Research']
    },
    {
      name: 'Emma Davis',
      role: 'College Student',
      avatar: '👩‍🎓',
      location: 'Austin, USA',
      earnings: '$800',
      period: 'per month',
      story: 'TaskApp has been perfect for my college schedule. I can work between classes and earn money for textbooks and living expenses. The variety of tasks keeps it interesting, and the payment is always reliable.',
      tasks: 203,
      rating: 4.9,
      specialties: ['Surveys', 'Data Entry', 'Transcription']
    },
    {
      name: 'David Rodriguez',
      role: 'Graphic Designer',
      avatar: '👨‍🎨',
      location: 'Miami, USA',
      earnings: '$4,200',
      period: 'in 2 months',
      story: 'I use TaskApp to find quick design projects that fit around my client work. The logo design tasks have been particularly lucrative, and I\'ve built a great reputation on the platform. It\'s become a significant part of my income.',
      tasks: 67,
      rating: 5.0,
      specialties: ['Logo Design', 'Graphics', 'Branding']
    },
    {
      name: 'Lisa Thompson',
      role: 'Marketing Manager',
      avatar: '👩‍💼',
      location: 'Chicago, USA',
      savings: '$8,500',
      period: 'in agency fees',
      story: 'Instead of hiring expensive agencies, I use TaskApp to get marketing tasks done quickly and affordably. From content creation to market research, I\'ve found talented workers who deliver quality results at a fraction of the cost.',
      tasksPosted: 156,
      rating: 4.7,
      categories: ['Marketing', 'Content', 'Research']
    },
    {
      name: 'James Wilson',
      role: 'Retired Teacher',
      avatar: '👨‍🏫',
      location: 'Portland, USA',
      earnings: '$1,200',
      period: 'monthly supplement',
      story: 'After retirement, I wanted to stay active and supplement my pension. TaskApp\'s education and tutoring tasks are perfect for my background. I help students with homework and create educational content, earning extra income while doing what I love.',
      tasks: 89,
      rating: 4.8,
      specialties: ['Education', 'Tutoring', 'Content Creation']
    }
  ];

  const stats = [
    { label: 'Success Stories', value: '10,000+' },
    { label: 'Average Monthly Earnings', value: '$1,850' },
    { label: 'Tasks Completed', value: '2.5M+' },
    { label: 'User Satisfaction', value: '96%' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Success Stories
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real people, real results. See how TaskApp has transformed the way people work and earn money.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-500 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Success Stories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {stories.map((story, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">{story.avatar}</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{story.name}</h3>
                  <p className="text-gray-600">{story.role}</p>
                  <p className="text-sm text-gray-500">{story.location}</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(story.rating) ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-gray-600">{story.rating}</span>
                </div>
                
                {story.earnings && (
                  <div className="text-2xl font-bold text-primary-500 mb-1">
                    {story.earnings} {story.period}
                  </div>
                )}
                
                {story.savings && (
                  <div className="text-2xl font-bold text-green-500 mb-1">
                    Saved {story.savings} {story.period}
                  </div>
                )}
              </div>

              <p className="text-gray-700 leading-relaxed mb-6">
                "{story.story}"
              </p>

              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">
                      {story.tasks ? 'Tasks Completed:' : 'Tasks Posted:'}
                    </span>
                    <span className="font-semibold ml-1">
                      {story.tasks || story.tasksPosted}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Specialties:</span>
                    <div className="mt-1">
                      {(story.specialties || story.categories)?.map((specialty, i) => (
                        <span
                          key={i}
                          className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mr-1 mb-1"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-8 sm:p-12 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Write Your Success Story?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of successful users who have transformed their work life with TaskApp.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-primary-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Start Your Journey
            </Link>
            <Link
              to="/how-it-works"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Learn How It Works
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessStories;