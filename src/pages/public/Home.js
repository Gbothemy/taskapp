import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { categoriesService } from '../../services/supabase';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const Home = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoriesService.getCategories();
      setCategories(data?.slice(0, 6) || []); // Show first 6 categories
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const features = [
    {
      icon: (
        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      ),
      title: 'Secure Payments',
      description: 'Escrow protection ensures safe transactions. Get paid securely for completed work with our trusted payment system.'
    },
    {
      icon: (
        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      ),
      title: 'Quality Professionals',
      description: 'Talented professionals with ratings and reviews. Find the right talent for your project from our curated community.'
    },
    {
      icon: (
        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      ),
      title: 'Fast & Easy',
      description: 'Simple workflow from posting tasks to getting results. Start earning or hiring today with our intuitive platform.'
    },
    {
      icon: (
        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
      ),
      title: 'Real-time Updates',
      description: 'Stay informed with instant notifications about task updates, messages, and payments. Never miss an opportunity.'
    },
    {
      icon: (
        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Flexible Rates',
      description: 'Set your own rates or browse tasks within your budget. Transparent system with no hidden fees.'
    },
    {
      icon: (
        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      title: '24/7 Support',
      description: 'Get help when you need it with our dedicated support team. We\'re here to ensure your success.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Graphic Designer',
      avatar: 'SJ',
      content: 'TaskApp has transformed my freelance career. The quality of clients and secure payment system gives me peace of mind.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Business Owner',
      avatar: 'MC',
      content: 'Finding skilled professionals has never been easier. The platform connects me with exactly the talent I need.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Content Writer',
      avatar: 'ER',
      content: 'I love the user-friendly interface and how quickly I can find projects that match my skills and interests.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-primary-900 to-secondary-900 py-24 sm:py-32">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 via-transparent to-secondary-600/20"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            animation: 'float 20s ease-in-out infinite'
          }}></div>
        </div>
        
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 animate-fade-in">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-6">
                <span className="text-2xl">🚀</span>
                <span className="text-white font-semibold">Now Live - Join Thousands of Professionals</span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-none animate-slide-up">
              Where Talent
              <span className="block bg-gradient-to-r from-primary-400 via-primary-300 to-secondary-400 bg-clip-text text-transparent mt-2">
                Meets Success
              </span>
            </h1>
            
            <p className="mt-8 text-xl md:text-2xl leading-relaxed text-white/80 max-w-4xl mx-auto font-light animate-fade-in">
              The modern platform connecting exceptional professionals with amazing opportunities.
              <span className="block mt-3 text-lg md:text-xl text-white/60">
                Build your career • Grow your business • Achieve your dreams
              </span>
            </p>
            
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 animate-slide-up">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <button className="group relative px-10 py-4 text-lg font-bold text-white bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl shadow-2xl hover:shadow-primary-500/50 transform hover:scale-105 transition-all duration-300 overflow-hidden">
                    <span className="relative z-10 flex items-center">
                      Go to Dashboard
                      <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-secondary-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <button className="group relative px-10 py-4 text-lg font-bold text-white bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl shadow-2xl hover:shadow-primary-500/50 transform hover:scale-105 transition-all duration-300 overflow-hidden">
                      <span className="relative z-10 flex items-center">
                        Start Your Journey
                        <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-secondary-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                  </Link>
                  <Link to="/tasks">
                    <button className="group px-10 py-4 text-lg font-bold text-white bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl hover:bg-white/20 hover:border-white/30 transition-all duration-300">
                      <span className="flex items-center">
                        Browse Tasks
                        <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </span>
                    </button>
                  </Link>
                </>
              )}
            </div>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto animate-fade-in">
              {[
                { icon: '🆓', text: 'Free to join' },
                { icon: '🔒', text: 'Secure payments' },
                { icon: '🌟', text: '24/7 support' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-white/80 font-medium text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Popular Categories
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Discover opportunities in your area of expertise
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/tasks?category=${category.id}`}
                  className="group relative card-modern p-6 hover:scale-105 transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-lg bg-${category.color}-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <span className={`text-${category.color}-600 text-xl`}>
                      {category.icon === 'pencil' && '✏️'}
                      {category.icon === 'paint-brush' && '🎨'}
                      {category.icon === 'code' && '💻'}
                      {category.icon === 'chart-bar' && '📊'}
                      {category.icon === 'megaphone' && '📢'}
                      {category.icon === 'globe' && '🌍'}
                      {category.icon === 'briefcase' && '💼'}
                      {category.icon === 'film' && '🎬'}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-2 group-hover:text-primary-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {category.description}
                  </p>
                </Link>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Link to="/tasks">
                <Button variant="outline">
                  View All Categories
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to succeed
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Professional tools and features designed for modern freelancing
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group relative card-modern p-8 hover:scale-105 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-gradient-primary group-hover:scale-110 transition-transform glow-effect">
                    {feature.icon}
                  </div>
                  <h3 className="ml-4 text-xl font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-hero py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Trusted by professionals worldwide
              </h2>
              <p className="mt-4 text-lg leading-8 text-primary-200">
                Join thousands of successful freelancers and businesses
              </p>
            </div>
            <dl className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: 'Tasks Completed', value: '10,000+' },
                { label: 'Active Users', value: '5,000+' },
                { label: 'Total Earnings', value: '$2M+' },
                { label: 'Success Rate', value: '98%' }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <dd className="text-4xl font-bold text-white mb-2">{stat.value}</dd>
                  <dt className="text-primary-200 font-medium">{stat.label}</dt>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 sm:py-32 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              What our users say
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Real stories from real professionals
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card-modern p-8 hover:scale-105 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold glow-effect">
                    {testimonial.avatar}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
              Join TaskApp today and start your journey to professional success. 
              Whether you're looking to hire or get hired, we've got you covered.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              {!isAuthenticated ? (
                <>
                  <Link to="/register">
                    <Button size="lg" className="px-12 py-4 text-lg shadow-lg hover:shadow-xl transition-shadow">
                      Sign Up Free
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" size="lg" className="px-12 py-4 text-lg">
                      Sign In
                    </Button>
                  </Link>
                </>
              ) : (
                <Link to="/dashboard">
                  <Button size="lg" className="px-12 py-4 text-lg">
                    Go to Dashboard
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;