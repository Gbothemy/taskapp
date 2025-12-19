import React from 'react';
import Card from '../../components/ui/Card';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-secondary-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-secondary-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-secondary-600">
            Last updated: December 12, 2024
          </p>
        </div>

        <Card className="prose prose-lg max-w-none">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-secondary-900 mb-4">1. Introduction</h2>
              <p className="text-secondary-700 mb-4">
                TaskApp Inc. ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, 
                use, disclose, and safeguard your information when you use our platform and services.
              </p>
              <p className="text-secondary-700">
                Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, 
                please do not access or use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-secondary-900 mb-4">2. Information We Collect</h2>
              
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">2.1 Personal Information</h3>
              <p className="text-secondary-700 mb-4">We collect personal information that you provide directly to us, including:</p>
              <ul className="list-disc pl-6 text-secondary-700 space-y-2 mb-4">
                <li>Name, email address, and contact information</li>
                <li>Profile information, including skills, experience, and portfolio</li>
                <li>Payment information and financial details</li>
                <li>Identity verification documents</li>
                <li>Communications and correspondence with us</li>
              </ul>

              <h3 className="text-lg font-semibold text-secondary-900 mb-2">2.2 Automatically Collected Information</h3>
              <p className="text-secondary-700 mb-4">We automatically collect certain information when you use our platform:</p>
              <ul className="list-disc pl-6 text-secondary-700 space-y-2 mb-4">
                <li>Device information (IP address, browser type, operating system)</li>
                <li>Usage data (pages visited, time spent, click patterns)</li>
                <li>Location information (if you enable location services)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>

              <h3 className="text-lg font-semibold text-secondary-900 mb-2">2.3 Information from Third Parties</h3>
              <p className="text-secondary-700">
                We may receive information about you from third parties, such as identity verification services, 
                payment processors, and social media platforms (if you choose to connect your accounts).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-secondary-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-secondary-700 mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-6 text-secondary-700 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and payments</li>
                <li>Verify user identity and prevent fraud</li>
                <li>Communicate with you about your account and our services</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Send marketing communications (with your consent)</li>
                <li>Comply with legal obligations and enforce our terms</li>
                <li>Analyze usage patterns to improve user experience</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-secondary-900 mb-4">4. Information Sharing and Disclosure</h2>
              
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">4.1 With Other Users</h3>
              <p className="text-secondary-700 mb-4">
                Certain information in your profile may be visible to other users to facilitate connections and transactions. 
                This includes your name, profile picture, skills, ratings, and work history.
              </p>

              <h3 className="text-lg font-semibold text-secondary-900 mb-2">4.2 With Service Providers</h3>
              <p className="text-secondary-700 mb-4">
                We share information with trusted third-party service providers who help us operate our platform, 
                including payment processors, identity verification services, and cloud hosting providers.
              </p>

              <h3 className="text-lg font-semibold text-secondary-900 mb-2">4.3 Legal Requirements</h3>
              <p className="text-secondary-700 mb-4">
                We may disclose your information if required by law, court order, or government regulation, 
                or if we believe disclosure is necessary to protect our rights or the safety of our users.
              </p>

              <h3 className="text-lg font-semibold text-secondary-900 mb-2">4.4 Business Transfers</h3>
              <p className="text-secondary-700">
                In the event of a merger, acquisition, or sale of assets, your information may be transferred 
                as part of the business transaction, subject to confidentiality agreements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-secondary-900 mb-4">5. Data Security</h2>
              <p className="text-secondary-700 mb-4">
                We implement appropriate technical and organizational security measures to protect your personal information against 
                unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc pl-6 text-secondary-700 space-y-2">
                <li>SSL encryption for data transmission</li>
                <li>Secure data storage with encryption at rest</li>
                <li>Regular security audits and penetration testing</li>
                <li>Access controls and employee training</li>
                <li>Incident response procedures</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-secondary-900 mb-4">6. Your Rights and Choices</h2>
              
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">6.1 Access and Correction</h3>
              <p className="text-secondary-700 mb-4">
                You have the right to access, update, or correct your personal information through your account settings 
                or by contacting us directly.
              </p>

              <h3 className="text-lg font-semibold text-secondary-900 mb-2">6.2 Data Portability</h3>
              <p className="text-secondary-700 mb-4">
                You have the right to request a copy of your personal information in a structured, machine-readable format.
              </p>

              <h3 className="text-lg font-semibold text-secondary-900 mb-2">6.3 Deletion</h3>
              <p className="text-secondary-700 mb-4">
                You may request deletion of your personal information, subject to certain legal and contractual obligations. 
                Some information may be retained for legitimate business purposes or legal compliance.
              </p>

              <h3 className="text-lg font-semibold text-secondary-900 mb-2">6.4 Marketing Communications</h3>
              <p className="text-secondary-700">
                You can opt out of marketing communications at any time by using the unsubscribe link in emails 
                or updating your communication preferences in your account settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-secondary-900 mb-4">7. Cookies and Tracking Technologies</h2>
              <p className="text-secondary-700 mb-4">
                We use cookies and similar technologies to enhance your experience, analyze usage patterns, and provide personalized content. 
                You can control cookie settings through your browser preferences.
              </p>
              <p className="text-secondary-700">
                For more detailed information about our use of cookies, please see our Cookie Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-secondary-900 mb-4">8. International Data Transfers</h2>
              <p className="text-secondary-700">
                Your information may be transferred to and processed in countries other than your country of residence. 
                We ensure appropriate safeguards are in place to protect your information in accordance with applicable data protection laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-secondary-900 mb-4">9. Data Retention</h2>
              <p className="text-secondary-700">
                We retain your personal information for as long as necessary to provide our services, comply with legal obligations, 
                resolve disputes, and enforce our agreements. Specific retention periods vary based on the type of information and applicable legal requirements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-secondary-900 mb-4">10. Children's Privacy</h2>
              <p className="text-secondary-700">
                Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information 
                from children under 18. If we become aware that we have collected such information, we will take steps to delete it promptly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-secondary-900 mb-4">11. Changes to This Privacy Policy</h2>
              <p className="text-secondary-700">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new 
                Privacy Policy on our platform and updating the "Last Updated" date. Your continued use of our services after such 
                changes constitutes acceptance of the updated Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-secondary-900 mb-4">12. Contact Us</h2>
              <p className="text-secondary-700 mb-4">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us:
              </p>
              <div className="bg-secondary-50 p-4 rounded-lg">
                <p className="text-secondary-700 mb-2"><strong>Email:</strong> privacy@taskapp.com</p>
                <p className="text-secondary-700 mb-2"><strong>Address:</strong> TaskApp Inc., 123 Business Ave, San Francisco, CA 94105</p>
                <p className="text-secondary-700 mb-2"><strong>Phone:</strong> +1 (555) 123-4567</p>
                <p className="text-secondary-700"><strong>Data Protection Officer:</strong> dpo@taskapp.com</p>
              </div>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;