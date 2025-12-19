import React from 'react';
import { Link } from 'react-router-dom';
import { 
  UserPlusIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  StarIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const HowItWorks = () => {
  const workerSteps = [
    {
      icon: UserPlusIcon,
      title: 'Create Your Profile',
      description: 'Sign up and build a professional profile showcasing your skills, experience, and portfolio.',
      details: ['Complete your profile setup', 'Add your skills and certifications', 'Upload portfolio samples', 'Set your availability']
    },
    {
      icon: MagnifyingGlassIcon,
      title: 'Browse & Apply',
      description: 'Search through thousands of quality tasks that match your expertise and interests.',
      details: ['Filter by category and budget', 'Read detailed requirements', 'Check employer ratings', 'Apply to suitable tasks']
    },
    {
      icon: DocumentTextIcon,
      title: 'Complete Work',
      description: 'Deliver high-quality work according to the project requirements and deadlines.',
      details: ['Follow project guidelines', 'Communicate with employers', 'Submit work on time', 'Provide revisions if needed']
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Get Paid Securely',
      description: 'Receive payments directly to your account once work is approved by the employer.',
      details: ['Automatic payment processing', 'Multiple withdrawal options', 'Transaction history tracking', 'Tax documentation support']
    }
  ];

  const employerSteps = [
    {
      icon: DocumentTextIcon,
      title: 'Post Your Task',
      description: 'Create a detailed task posting with clear requirements, budget, and timeline.',
      details: ['Describe your project needs', 'Set a fair budget', 'Add relevant files', 'Specify deadlines']
    },
    {
      icon: UserPlusIcon,
      title: 'Review Applications',
      description: 'Browse through qualified worker profiles and select the best candidates.',
      details: ['View worker portfolios', 'Check ratings and reviews', 'Compare proposals', 'Interview candidates']
    },
    {
      icon: CheckCircleIcon,
      title: 'Manage Projects',
      description: 'Collaborate with workers, track progress, and provide feedback throughout the project.',
      details: ['Real-time communication', 'Progress tracking', 'File sharing', 'Milestone management']
    },
    {
      icon: StarIcon,
      title: 'Review & Rate',
      description: 'Approve completed work, release payments, and leave reviews for future reference.',
      details: ['Quality assurance checks', 'Secure payment release', 'Leave detailed feedback', 'Build long-term relationships']
    }
  ];

  const securityFeatures = [
    {
      icon: ShieldCheckIcon,
      title: 'Secure Platform',
      description: 'All users enjoy a secure platform with robust safety measures and community guidelines.'
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Escrow Protection',
      description: 'Payments are held in escrow until work is completed and approved.'
    },
    {
      icon: CheckCircleIcon,
      title: 'Dispute Resolution',
      description: 'Professional mediation service for any project-related disputes.'
    },
    {
      icon: StarIcon,
      title: 'Rating System',
      description: 'Comprehensive rating and review system to maintain quality standards.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6">
            How TaskApp Works
          </h1>
          <p className="text-xl text-secondary-600 mb-8">
            A simple, secure, and professional platform connecting skilled workers with quality employers
          </p>
        </div>
      </section>

      {/* For Workers Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              For Workers
            </h2>
            <p className="text-xl text-secondary-600">
              Start earning with your skills in four simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {workerSteps.map((step, index) => (
              <Card key={index} className="text-center relative">
                <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-8 h-8 text-success-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-success-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-secondary-600 mb-4">
                  {step.description}
                </p>
                <ul className="text-sm text-secondary-500 space-y-1">
                  {step.details.map((detail, i) => (
                    <li key={i} className="flex items-center">
                      <CheckCircleIcon className="w-4 h-4 text-success-500 mr-2 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" className="px-8">
              <Link to="/register" className="flex items-center">
                Start as a Worker
                <ArrowRightIcon className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* For Employers Section */}
      <section className="py-20 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              For Employers
            </h2>
            <p className="text-xl text-secondary-600">
              Find and hire top talent with confidence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {employerSteps.map((step, index) => (
              <Card key={index} className="text-center relative">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-8 h-8 text-primary-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-secondary-600 mb-4">
                  {step.description}
                </p>
                <ul className="text-sm text-secondary-500 space-y-1">
                  {step.details.map((detail, i) => (
                    <li key={i} className="flex items-center">
                      <CheckCircleIcon className="w-4 h-4 text-primary-500 mr-2 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" className="px-8">
              <Link to="/register" className="flex items-center">
                Post Your First Task
                <ArrowRightIcon className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Security Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Built for Security & Trust
            </h2>
            <p className="text-xl text-secondary-600">
              Enterprise-grade security features protect both workers and employers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {securityFeatures.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-12 h-12 bg-info-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-info-600" />
                </div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-secondary-600">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-secondary-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                How does payment protection work?
              </h3>
              <p className="text-secondary-600">
                All payments are held in escrow until work is completed and approved. This protects both workers and employers, ensuring fair compensation for quality work.
              </p>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                What fees does TaskApp charge?
              </h3>
              <p className="text-secondary-600">
                We charge a small service fee only when transactions are completed successfully. Simple, transparent fees with no hidden costs or monthly subscriptions.
              </p>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                How do I resolve disputes?
              </h3>
              <p className="text-secondary-600">
                Our professional mediation team helps resolve any project-related disputes fairly and quickly. We review all evidence and communications to reach a fair resolution.
              </p>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                Is my personal information secure?
              </h3>
              <p className="text-secondary-600">
                Yes, we use bank-level encryption and security measures to protect your data. We're GDPR compliant and never share your personal information with third parties.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of professionals who trust TaskApp for their work
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="xl" className="px-8 py-4">
              <Link to="/register">
                Join as Worker
              </Link>
            </Button>
            <Button variant="outline" size="xl" className="px-8 py-4 border-white text-white hover:bg-white hover:text-primary-600">
              <Link to="/register">
                Hire Talent
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;