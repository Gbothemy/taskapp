import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircleIcon, 
  CurrencyDollarIcon, 
  ClockIcon, 
  ShieldCheckIcon,
  StarIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

const Home = () => {
  const features = [
    {
      icon: CurrencyDollarIcon,
      title: 'Instant Payments',
      description: 'Get paid immediately after task approval with our secure payment system.',
    },
    {
      icon: ClockIcon,
      title: 'Flexible Schedule',
      description: 'Work on your own time. Complete tasks whenever it suits your schedule.',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure Platform',
      description: 'Your data and payments are protected with enterprise-grade security.',
    },
    {
      icon: CheckCircleIcon,
      title: 'Quality Assurance',
      description: 'Our review system ensures high-quality work and fair compensation.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Freelance Writer',
      avatar: '👩‍💼',
      rating: 5,
      text: 'TaskApp has been a game-changer for my income. I can easily find writing tasks that fit my schedule and get paid quickly.',
    },
    {
      name: 'Mike Chen',
      role: 'Small Business Owner',
      avatar: '👨‍💻',
      rating: 5,
      text: 'As an employer, I love how easy it is to post tasks and find quality workers. The platform handles everything seamlessly.',
    },
    {
      name: 'Emma Davis',
      role: 'Student',
      avatar: '👩‍🎓',
      rating: 5,
      text: 'Perfect for earning extra money between classes. The tasks are varied and the payment is always on time.',
    },
  ];

  const stats = [
    { label: 'Active Users', value: '50K+' },
    { label: 'Tasks Completed', value: '1M+' },
    { label: 'Total Paid Out', value: '$2.5M+' },
    { label: 'Average Rating', value: '4.9/5' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-16 sm:py-20 lg:py-28 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-fade-in-up">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                Earn Money by Completing
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500"> Simple Tasks</span>
              </h1>
            </div>
            <div className="animate-fade-in-up delay-200">
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed">
                Join thousands of workers earning money on TaskApp. Complete micro-tasks, 
                get paid instantly, and work on your own schedule.
              </p>
            </div>
            <div className="animate-fade-in-up delay-400">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-lg mx-auto sm:max-w-none">
                <Link
                  to="/register"
                  className="group btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 inline-flex items-center justify-center transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Start Earning Today
                  <ArrowRightIcon className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/how-it-works"
                  className="btn-outline text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 transform hover:scale-105 transition-all duration-200"
                >
                  Learn How It Works
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-4 sm:p-6 mb-3 sm:mb-4 group-hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-1">
                  <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent mb-1 sm:mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm sm:text-base text-gray-600 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Why Choose TaskApp?
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We've built the most trusted platform for micro-earning with features 
              designed for both workers and employers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <div className="card p-6 sm:p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary-500" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-20 lg:py-28 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-50/30 to-secondary-50/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              How TaskApp Works
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600">
              Get started in three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 lg:gap-16">
            {[
              {
                step: 1,
                title: 'Sign Up & Browse Tasks',
                description: 'Create your account and explore hundreds of available tasks in various categories.'
              },
              {
                step: 2,
                title: 'Complete & Submit',
                description: 'Choose tasks that match your skills, complete them, and submit your work for review.'
              },
              {
                step: 3,
                title: 'Get Paid Instantly',
                description: 'Once approved, receive payment directly to your wallet and withdraw anytime.'
              }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6 sm:mb-8">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary-500 to-secondary-500 text-white rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                    {item.step}
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-gradient-to-r from-primary-200 to-secondary-200 transform -translate-y-1/2 z-0"></div>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-sm mx-auto">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              What Our Users Say
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600">
              Join thousands of satisfied workers and employers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="group">
                <div className="card p-6 sm:p-8 h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/90 backdrop-blur-sm border-0">
                  <div className="flex items-center mb-4 sm:mb-6">
                    <div className="text-3xl sm:text-4xl mr-3 sm:mr-4 group-hover:scale-110 transition-transform duration-300">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-base sm:text-lg">{testimonial.name}</h4>
                      <p className="text-sm sm:text-base text-gray-600 font-medium">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex mb-4 sm:mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon key={i} className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm sm:text-base text-gray-700 italic leading-relaxed">
                    "{testimonial.text}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 sm:py-20 lg:py-28 bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/5 rounded-full animate-pulse delay-500"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Ready to Start Earning?
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-primary-100 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
            Join TaskApp today and start earning money by completing simple tasks. 
            No experience required, just your time and effort.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center max-w-lg mx-auto sm:max-w-none">
            <Link
              to="/register"
              className="group bg-white text-primary-600 hover:bg-gray-50 font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-300 text-base sm:text-lg transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span className="flex items-center justify-center">
                Sign Up as Worker
                <ArrowRightIcon className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link
              to="/register"
              className="group border-2 border-white text-white hover:bg-white hover:text-primary-600 font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-300 text-base sm:text-lg transform hover:scale-105"
            >
              Post Tasks as Employer
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;