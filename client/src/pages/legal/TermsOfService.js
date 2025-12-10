import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Terms of Service
            </h1>
            <p className="text-lg text-gray-600">
              Last updated: December 10, 2024
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Service Description</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                TaskApp is a platform that connects employers with workers for completing various micro-tasks. 
                Our service facilitates task posting, completion, review, and payment processing.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. User Responsibilities</h2>
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">For Workers:</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Complete tasks according to provided specifications</li>
                  <li>Submit work within specified deadlines</li>
                  <li>Provide accurate proof of completion</li>
                  <li>Maintain professional communication</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">For Employers:</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Provide clear and detailed task instructions</li>
                  <li>Review submissions fairly and promptly</li>
                  <li>Pay for approved work as agreed</li>
                  <li>Communicate respectfully with workers</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Payment Terms</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                All payments are processed through our secure payment system. TaskApp charges a 5% platform fee 
                on completed tasks. Payments are released upon task approval by the employer.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Quality Standards</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                All work submitted must meet the quality standards specified in the task description. 
                TaskApp reserves the right to mediate disputes between employers and workers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Account Termination</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We reserve the right to suspend or terminate accounts that violate our terms of service, 
                engage in fraudulent activity, or consistently provide poor quality work.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Intellectual Property</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Work completed through TaskApp belongs to the employer who commissioned it, unless otherwise 
                specified in the task description. Workers retain rights to their general skills and knowledge.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                TaskApp acts as an intermediary platform and is not responsible for the quality of work 
                or disputes between users. Our liability is limited to the platform fees collected.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                For questions about our Terms of Service:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  Email: support@taskapp.com<br />
                  Phone: +1 (555) 123-4567<br />
                  Address: 123 TaskApp Street, Digital City, DC 12345
                </p>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <Link
              to="/"
              className="btn-primary inline-flex items-center"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;