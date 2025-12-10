import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About TaskApp</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connecting skilled workers with meaningful opportunities in the digital economy.
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <h2>Our Mission</h2>
          <p>
            TaskApp was founded with a simple mission: to create a fair, transparent, and efficient 
            marketplace where anyone can earn money by completing valuable tasks, and businesses can 
            get quality work done quickly and affordably.
          </p>

          <h2>How We Started</h2>
          <p>
            In 2024, we recognized that the gig economy was growing rapidly, but many platforms were 
            taking large fees and creating barriers for both workers and employers. We set out to 
            build a better solution - one that prioritizes fairness, quality, and user experience.
          </p>

          <h2>What Makes Us Different</h2>
          <ul>
            <li><strong>Fair Pricing:</strong> We charge only a 5% platform fee, much lower than competitors</li>
            <li><strong>Instant Payments:</strong> Workers get paid immediately upon task approval</li>
            <li><strong>Quality Focus:</strong> Our review system ensures high-quality work and fair compensation</li>
            <li><strong>User-Friendly:</strong> Simple, intuitive interface designed for efficiency</li>
          </ul>

          <h2>Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 not-prose">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Transparency</h3>
              <p className="text-gray-600">
                Clear pricing, open communication, and honest business practices in everything we do.
              </p>
            </div>
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fairness</h3>
              <p className="text-gray-600">
                Equal opportunities for all users, fair compensation, and unbiased review processes.
              </p>
            </div>
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Innovation</h3>
              <p className="text-gray-600">
                Continuously improving our platform with new features and better user experiences.
              </p>
            </div>
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600">
                Building a supportive community where workers and employers can thrive together.
              </p>
            </div>
          </div>

          <h2>Join Our Community</h2>
          <p>
            Whether you're looking to earn extra income or need help with tasks, TaskApp provides 
            the tools and community to help you succeed. Join thousands of satisfied users who 
            have already discovered the benefits of our platform.
          </p>
        </div>

        <div className="text-center mt-12">
          <Link
            to="/register"
            className="btn-primary text-lg px-8 py-3"
          >
            Get Started Today
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;