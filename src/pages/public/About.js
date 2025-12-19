import React from 'react';
import { 
  ShieldCheckIcon, 
  UserGroupIcon, 
  GlobeAltIcon,
  HeartIcon,
  LightBulbIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import Card from '../../components/ui/Card';

const About = () => {
  const values = [
    {
      icon: ShieldCheckIcon,
      title: 'Trust & Security',
      description: 'We prioritize the safety and security of our community with enterprise-grade protection and secure systems.'
    },
    {
      icon: HeartIcon,
      title: 'Fair & Transparent',
      description: 'We believe in fair compensation and transparent processes that benefit both workers and employers.'
    },
    {
      icon: LightBulbIcon,
      title: 'Innovation',
      description: 'We continuously improve our platform with cutting-edge technology and user-focused features.'
    },
    {
      icon: UserGroupIcon,
      title: 'Community First',
      description: 'Our community of professionals is at the heart of everything we do, driving our decisions and improvements.'
    }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Co-Founder',
      bio: 'Former VP of Engineering at a Fortune 500 company with 15+ years in tech leadership.',
      image: '/api/placeholder/150/150'
    },
    {
      name: 'Michael Chen',
      role: 'CTO & Co-Founder',
      bio: 'Security expert and full-stack developer with experience at leading fintech companies.',
      image: '/api/placeholder/150/150'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Community',
      bio: 'Community building specialist focused on creating safe and inclusive professional environments.',
      image: '/api/placeholder/150/150'
    },
    {
      name: 'David Kim',
      role: 'Head of Security',
      bio: 'Cybersecurity expert ensuring platform safety and data protection for all users.',
      image: '/api/placeholder/150/150'
    }
  ];

  const milestones = [
    { year: '2022', event: 'TaskApp founded with a vision for professional freelancing' },
    { year: '2023', event: 'Reached 10,000 active users and $500K in transactions' },
    { year: '2024', event: 'Expanded globally with 50,000+ users and $2.5M+ paid out' },
    { year: '2025', event: 'Launching enterprise solutions and advanced security features' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6">
            About TaskApp
          </h1>
          <p className="text-xl text-secondary-600 mb-8">
            We're building the future of professional work by connecting talented individuals 
            with meaningful opportunities in a secure, transparent, and fair environment.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-secondary-600 mb-6">
                TaskApp was created to solve the fundamental challenges in the freelance economy: 
                lack of trust, unfair payment practices, and poor quality control.
              </p>
              <p className="text-lg text-secondary-600 mb-6">
                We believe that talented professionals deserve a platform that respects their skills, 
                protects their earnings, and provides opportunities for growth. Similarly, businesses 
                need access to reliable, talented professionals without the risks associated with traditional freelancing.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <TrophyIcon className="w-6 h-6 text-primary-600" />
                  <span className="font-semibold text-secondary-900">Quality First</span>
                </div>
                <div className="flex items-center space-x-2">
                  <GlobeAltIcon className="w-6 h-6 text-primary-600" />
                  <span className="font-semibold text-secondary-900">Global Reach</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl p-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">50,000+</div>
                <div className="text-secondary-600 mb-4">Verified Professionals</div>
                <div className="text-4xl font-bold text-success-600 mb-2">$2.5M+</div>
                <div className="text-secondary-600 mb-4">Paid to Workers</div>
                <div className="text-4xl font-bold text-info-600 mb-2">99.9%</div>
                <div className="text-secondary-600">Platform Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              These principles guide every decision we make and every feature we build
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-secondary-600">
                  {value.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-secondary-600">
              Experienced professionals dedicated to building the future of work
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-600">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-1">
                  {member.name}
                </h3>
                <div className="text-primary-600 font-medium mb-3">
                  {member.role}
                </div>
                <p className="text-sm text-secondary-600">
                  {member.bio}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-secondary-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-secondary-600">
              Key milestones in building a trusted professional platform
            </p>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                  {milestone.year}
                </div>
                <Card className="flex-1">
                  <p className="text-secondary-700 font-medium">
                    {milestone.event}
                  </p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Get in Touch
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Have questions about TaskApp? We'd love to hear from you.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
            <div>
              <h3 className="font-semibold mb-2">Email Us</h3>
              <p className="text-primary-100">support@taskapp.com</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Call Us</h3>
              <p className="text-primary-100">+1 (555) 123-4567</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Visit Us</h3>
              <p className="text-primary-100">San Francisco, CA</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;