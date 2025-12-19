import React, { useState } from 'react';
import { 
  StarIcon,
  TrophyIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UserIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const SuccessStories = () => {
  const [currentStory, setCurrentStory] = useState(0);

  const stories = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Freelance Designer',
      location: 'San Francisco, CA',
      avatar: null,
      story: 'I started as a part-time worker on TaskApp while finishing my design degree. Within 6 months, I was earning enough to go full-time freelance. The platform connected me with amazing clients who appreciated quality work.',
      earnings: '$45,000',
      tasksCompleted: 127,
      rating: 4.9,
      timeframe: '8 months',
      category: 'Design & Creative',
      highlights: [
        'Increased income by 300%',
        'Built a portfolio of 50+ projects',
        'Established long-term client relationships'
      ]
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Software Developer',
      location: 'Austin, TX',
      avatar: null,
      story: 'As a recent bootcamp graduate, TaskApp gave me the opportunity to work on real projects and build my portfolio. The variety of tasks helped me discover my passion for backend development.',
      earnings: '$62,000',
      tasksCompleted: 89,
      rating: 4.8,
      timeframe: '1 year',
      category: 'Development',
      highlights: [
        'Landed first full-time developer role',
        'Gained experience in 5+ programming languages',
        'Mentored 10+ junior developers'
      ]
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'Content Writer',
      location: 'Miami, FL',
      avatar: null,
      story: 'TaskApp transformed my writing career. I went from struggling to find clients to having a waitlist of projects. The platform\'s rating system helped me build credibility quickly.',
      earnings: '$38,000',
      tasksCompleted: 203,
      rating: 5.0,
      timeframe: '10 months',
      category: 'Writing & Content',
      highlights: [
        'Perfect 5.0 rating maintained',
        'Published 500+ articles',
        'Developed expertise in 8 industries'
      ]
    },
    {
      id: 4,
      name: 'David Park',
      role: 'Digital Marketer',
      location: 'Seattle, WA',
      avatar: null,
      story: 'I used TaskApp to transition from traditional marketing to digital. The diverse projects exposed me to different industries and marketing strategies, accelerating my learning curve.',
      earnings: '$55,000',
      tasksCompleted: 156,
      rating: 4.9,
      timeframe: '14 months',
      category: 'Marketing',
      highlights: [
        'Increased client ROI by average 250%',
        'Specialized in e-commerce marketing',
        'Built personal brand with 10K+ followers'
      ]
    }
  ];

  const stats = [
    { label: 'Success Stories', value: '10,000+', icon: TrophyIcon },
    { label: 'Total Earnings', value: '$50M+', icon: CurrencyDollarIcon },
    { label: 'Average Rating', value: '4.8/5', icon: StarIcon },
    { label: 'Career Changes', value: '2,500+', icon: UserIcon }
  ];

  const categories = [
    { name: 'Design & Creative', count: 1250, color: 'from-purple-500 to-purple-600' },
    { name: 'Development', count: 980, color: 'from-blue-500 to-blue-600' },
    { name: 'Writing & Content', count: 1100, color: 'from-green-500 to-green-600' },
    { name: 'Marketing', count: 850, color: 'from-orange-500 to-orange-600' },
    { name: 'Data & Analytics', count: 720, color: 'from-red-500 to-red-600' },
    { name: 'Business', count: 650, color: 'from-indigo-500 to-indigo-600' }
  ];

  const nextStory = () => {
    setCurrentStory((prev) => (prev + 1) % stories.length);
  };

  const prevStory = () => {
    setCurrentStory((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIconSolid
        key={i}
        className={`w-5 h-5 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl flex items-center justify-center shadow-xl">
              <TrophyIcon className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-black text-secondary-900 mb-4">
            Success Stories
          </h1>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            Real stories from our community of professionals who transformed their careers through TaskApp
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-sm border border-primary-200/50 rounded-2xl p-6 text-center shadow-xl">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-black text-secondary-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-secondary-600">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Featured Story */}
        <div className="mb-16">
          <h2 className="text-3xl font-black text-secondary-900 mb-8 text-center">
            Featured Success Story
          </h2>
          <div className="bg-white/80 backdrop-blur-sm border border-primary-200/50 rounded-3xl shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Story Content */}
              <div className="p-8 lg:p-12">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center text-white text-xl font-black">
                    {getInitials(stories[currentStory].name)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-secondary-900">
                      {stories[currentStory].name}
                    </h3>
                    <p className="text-secondary-600">
                      {stories[currentStory].role} • {stories[currentStory].location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1 mb-6">
                  {renderStars(stories[currentStory].rating)}
                  <span className="ml-2 font-semibold text-secondary-900">
                    {stories[currentStory].rating}
                  </span>
                </div>

                <blockquote className="text-lg text-secondary-700 leading-relaxed mb-8 italic">
                  "{stories[currentStory].story}"
                </blockquote>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="text-center p-4 bg-success-50 rounded-xl">
                    <div className="text-2xl font-black text-success-900">
                      {stories[currentStory].earnings}
                    </div>
                    <div className="text-sm text-success-700">Total Earned</div>
                  </div>
                  <div className="text-center p-4 bg-primary-50 rounded-xl">
                    <div className="text-2xl font-black text-primary-900">
                      {stories[currentStory].tasksCompleted}
                    </div>
                    <div className="text-sm text-primary-700">Tasks Completed</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-secondary-900 mb-3">Key Achievements:</h4>
                  {stories[currentStory].highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                      <span className="text-secondary-700">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Story Stats */}
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-8 lg:p-12 text-white">
                <div className="space-y-8">
                  <div>
                    <Badge className="bg-white/20 text-white border-white/30 mb-4">
                      {stories[currentStory].category}
                    </Badge>
                    <h4 className="text-xl font-bold mb-2">Success Timeline</h4>
                    <p className="text-primary-100">
                      Achieved these results in just {stories[currentStory].timeframe}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-primary-100">Rating</span>
                      <span className="font-bold">{stories[currentStory].rating}/5.0</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-primary-100">Success Rate</span>
                      <span className="font-bold">98%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-primary-100">Repeat Clients</span>
                      <span className="font-bold">75%</span>
                    </div>
                  </div>

                  <Button className="w-full bg-white text-primary-600 hover:bg-primary-50">
                    <PlayIcon className="w-4 h-4 mr-2" />
                    Watch Video Story
                  </Button>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between p-6 bg-secondary-50 border-t border-secondary-200">
              <button
                onClick={prevStory}
                className="flex items-center space-x-2 px-4 py-2 text-secondary-600 hover:text-secondary-900 transition-colors"
              >
                <ChevronLeftIcon className="w-5 h-5" />
                <span>Previous</span>
              </button>

              <div className="flex space-x-2">
                {stories.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStory(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentStory ? 'bg-primary-600' : 'bg-secondary-300'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextStory}
                className="flex items-center space-x-2 px-4 py-2 text-secondary-600 hover:text-secondary-900 transition-colors"
              >
                <span>Next</span>
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-16">
          <h2 className="text-3xl font-black text-secondary-900 mb-8 text-center">
            Success by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm border border-primary-200/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <TrophyIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-secondary-900 mb-2">
                  {category.name}
                </h3>
                <p className="text-secondary-600 mb-4">
                  {category.count.toLocaleString()} success stories
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="primary" size="sm">
                    View Stories
                  </Badge>
                  <span className="text-primary-600 font-semibold group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-4xl font-black mb-4">
            Ready to Write Your Success Story?
          </h2>
          <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
            Join thousands of professionals who have transformed their careers through TaskApp
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-white text-primary-600 hover:bg-primary-50"
              size="lg"
            >
              Get Started Today
            </Button>
            <Button 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10"
              size="lg"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessStories;