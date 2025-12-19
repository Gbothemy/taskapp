import React from 'react';
import Card from '../../components/ui/Card';

const CookiesPolicy = () => {
  return (
    <div className="min-h-screen bg-secondary-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-secondary-900 mb-4">
            Cookie Policy
          </h1>
          <p className="text-lg text-secondary-600">
            Last updated: December 12, 2024
          </p>
        </div>

        <Card className="prose prose-lg max-w-none">
          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-secondary-900 mb-4">What Are Cookies?</h2>
              <p className="text-secondary-700">
                Cookies are small text files that are stored on your device when you visit our website. 
                They help us provide you with a better experience by remembering your preferences and analyzing how you use our site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-secondary-900 mb-4">How We Use Cookies</h2>
              <p className="text-secondary-700 mb-4">We use cookies for:</p>
              <ul className="list-disc pl-6 text-secondary-700 space-y-2">
                <li>Essential site functionality and security</li>
                <li>Remembering your login status and preferences</li>
                <li>Analytics to improve our services</li>
                <li>Personalizing your experience</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-secondary-900 mb-4">Managing Cookies</h2>
              <p className="text-secondary-700">
                You can control cookies through your browser settings. However, disabling certain cookies may affect the functionality of our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-secondary-900 mb-4">Contact Us</h2>
              <p className="text-secondary-700">
                If you have questions about our use of cookies, please contact us at privacy@taskapp.com
              </p>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CookiesPolicy;