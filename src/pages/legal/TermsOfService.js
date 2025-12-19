import React from 'react';
import Card from '../../components/ui/Card';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-secondary-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-secondary-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-secondary-600">
            Last updated: December 12, 2024
          </p>
        </div>

        <Card className="prose prose-lg max-w-none">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-secondary-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-secondary-700 mb-4">
                By accessing and using TaskApp ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
              <p className="text-secondary-700">
                These Terms of Service ("Terms") govern your use of our website located at taskapp.com (the "Service") operated by TaskApp Inc. ("us", "we", or "our").
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-secondary-900 mb-4">2. Description of Service</h2>
              <p className="text-secondary-700 mb-4">
                TaskApp is a professional platform that connects skilled workers with employers seeking to complete specific tasks or projects. 
                Our service facilitates:
              </p>
              <ul className="list-disc pl-6 text-secondary-700 space-y-2">
                <li>Task posting and management for employers</li>
                <li>Task discovery and completion for workers</li>
                <li>Secure payment processing and escrow services</li>
                <li>Communication tools between parties</li>
                <li>Dispute resolution services</li>
                <li>User profile and trust systems</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-secondary-900 mb-4">3. User Accounts and Registration</h2>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">3.1 Account Creation</h3>
              <p className="text-secondary-700 mb-4">
                To use our Service, you must create an account by providing accurate, complete, and current information. 
                You are responsible for safeguarding your account credentials and for all activities that occur under your account.
              </p>
              
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">3.2 Profile Requirements</h3>
              <p className="text-secondary-700 mb-4">
                Users are required to maintain accurate and complete profile information, including:
              </p>
              <ul className="list-disc pl-6 text-secondary-700 space-y-2 mb-4">
                <li>Valid email address</li>
                <li>Accurate personal information</li>
                <li>Professional skills and experience</li>
                <li>Current contact information</li>
                <li>Business verification (for corporate accounts)</li>
              </ul>

              <h3 className="text-lg font-semibold text-secondary-900 mb-2">3.3 Account Eligibility</h3>
              <p className="text-secondary-700">
                You must be at least 18 years old to create an account. By creating an account, you represent and warrant that you meet this age requirement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-secondary-900 mb-4">4. User Responsibilities and Conduct</h2>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">4.1 Prohibited Activities</h3>
              <p className="text-secondary-700 mb-4">Users are prohibited from:</p>
              <ul className="list-disc pl-6 text-secondary-700 space-y-2 mb-4">
                <li>Posting false, misleading, or fraudulent information</li>
                <li>Engaging in any form of harassment or discrimination</li>
                <li>Attempting to circumvent platform fees or payment systems</li>
                <li>Sharing contact information to conduct business outside the platform</li>
                <li>Posting tasks that violate laws or regulations</li>
                <li>Using automated systems to manipulate the platform</li>
                <li>Infringing on intellectual property rights</li>
              </ul>

              <h3 className="text-lg font-semibold text-secondary-900 mb-2">4.2 Quality Standards</h3>
              <p className="text-secondary-700">
                All users are expected to maintain professional standards in their interactions and work quality. 
                Repeated violations of quality standards may result in account suspension or termination.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-secondary-900 mb-4">5. Payment Terms</h2>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">5.1 Service Fees</h3>
              <p className="text-secondary-700 mb-4">
                TaskApp charges service fees for completed transactions. These fees are subject to change with 30 days notice to users.
              </p>

              <h3 className="text-lg font-semibold text-secondary-900 mb-2">5.2 Payment Processing</h3>
              <p className="text-secondary-700 mb-4">
                All payments are processed through our secure payment system. We use escrow services to protect both parties in transactions.
              </p>

              <h3 className="text-lg font-semibold text-secondary-900 mb-2">5.3 Refunds and Disputes</h3>
              <p className="text-secondary-700">
                Refund policies and dispute resolution procedures are detailed in our separate Dispute Resolution Policy. 
                All disputes must be reported within 30 days of task completion.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-secondary-900 mb-4">6. Intellectual Property</h2>
              <p className="text-secondary-700 mb-4">
                The TaskApp platform, including its design, functionality, and content, is protected by copyright, trademark, and other intellectual property laws. 
                Users retain ownership of their original content but grant TaskApp a license to use, display, and distribute such content as necessary to provide the service.
              </p>
              <p className="text-secondary-700">
                Users are responsible for ensuring they have the right to use any content they upload or share on the platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-secondary-900 mb-4">7. Privacy and Data Protection</h2>
              <p className="text-secondary-700 mb-4">
                Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information. 
                By using our service, you consent to the collection and use of information in accordance with our Privacy Policy.
              </p>
              <p className="text-secondary-700">
                We comply with applicable data protection regulations, including GDPR for European users.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-secondary-900 mb-4">8. Limitation of Liability</h2>
              <p className="text-secondary-700 mb-4">
                TaskApp acts as an intermediary platform and is not responsible for the quality, safety, or legality of tasks posted, 
                the truth or accuracy of user profiles, or the ability of users to complete transactions.
              </p>
              <p className="text-secondary-700">
                In no event shall TaskApp be liable for any indirect, incidental, special, consequential, or punitive damages, 
                including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-secondary-900 mb-4">9. Termination</h2>
              <p className="text-secondary-700 mb-4">
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, 
                including without limitation if you breach the Terms.
              </p>
              <p className="text-secondary-700">
                Upon termination, your right to use the Service will cease immediately. If you wish to terminate your account, 
                you may simply discontinue using the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-secondary-900 mb-4">10. Changes to Terms</h2>
              <p className="text-secondary-700 mb-4">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
                If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
              </p>
              <p className="text-secondary-700">
                What constitutes a material change will be determined at our sole discretion. 
                By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-secondary-900 mb-4">11. Governing Law</h2>
              <p className="text-secondary-700">
                These Terms shall be interpreted and governed by the laws of the State of California, United States, 
                without regard to its conflict of law provisions. Any disputes arising from these Terms will be resolved 
                through binding arbitration in accordance with the rules of the American Arbitration Association.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-secondary-900 mb-4">12. Contact Information</h2>
              <p className="text-secondary-700 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-secondary-50 p-4 rounded-lg">
                <p className="text-secondary-700 mb-2"><strong>Email:</strong> legal@taskapp.com</p>
                <p className="text-secondary-700 mb-2"><strong>Address:</strong> TaskApp Inc., 123 Business Ave, San Francisco, CA 94105</p>
                <p className="text-secondary-700"><strong>Phone:</strong> +1 (555) 123-4567</p>
              </div>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfService;