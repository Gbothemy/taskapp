import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-secondary-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-secondary-900 mb-4">
            Terms and Conditions
          </h1>
          <p className="text-lg text-secondary-600">
            Please review our complete terms and policies
          </p>
        </div>

        <Card className="text-center py-20">
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">
            Comprehensive Legal Documentation
          </h2>
          <p className="text-secondary-600 mb-6">
            For detailed terms and conditions, please refer to our Terms of Service and Privacy Policy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/terms-of-service"
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              View Terms of Service
            </Link>
            <Link 
              to="/privacy-policy"
              className="bg-secondary-600 text-white px-6 py-3 rounded-lg hover:bg-secondary-700 transition-colors"
            >
              View Privacy Policy
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TermsAndConditions;