import React from 'react';
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-secondary-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-secondary-900 mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-secondary-600">
            Get in touch with our support team
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <Card>
            <h2 className="text-2xl font-bold text-secondary-900 mb-6">Get in Touch</h2>
            <div className="space-y-6">
              <div className="flex items-center">
                <EnvelopeIcon className="w-6 h-6 text-primary-600 mr-4" />
                <div>
                  <h3 className="font-semibold text-secondary-900">Email</h3>
                  <p className="text-secondary-600">support@taskapp.com</p>
                </div>
              </div>
              <div className="flex items-center">
                <PhoneIcon className="w-6 h-6 text-primary-600 mr-4" />
                <div>
                  <h3 className="font-semibold text-secondary-900">Phone</h3>
                  <p className="text-secondary-600">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPinIcon className="w-6 h-6 text-primary-600 mr-4" />
                <div>
                  <h3 className="font-semibold text-secondary-900">Address</h3>
                  <p className="text-secondary-600">123 Business Ave<br />San Francisco, CA 94105</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Contact Form */}
          <Card>
            <h2 className="text-2xl font-bold text-secondary-900 mb-6">Send us a Message</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>
              <Button className="w-full">
                Send Message
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;