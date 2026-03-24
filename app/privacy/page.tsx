import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Banolite',
  description: 'How Banolite collects, uses, and protects your data.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-cream min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-4xl tracking-tight">
        <div className="mb-16">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-brand-dark mb-6">
            Privacy Policy
          </h1>
          <p className="text-lg md:text-xl text-brand-muted font-medium">
            Last updated: March 2026
          </p>
        </div>

        <div className="font-sans font-medium text-[17px] leading-relaxed max-w-none text-brand-muted space-y-12">
          <p className="text-brand-dark font-semibold text-xl mb-8">
            At Banolite, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use the Banolite platform.
          </p>

          <section>
            <h2 className="text-2xl font-display font-bold text-brand-dark mb-4">1. Information We Collect</h2>
            <p className="mb-4">We collect information to provide you with the best experience and to improve our platform. The types of information we collect include:</p>
            <ul className="list-disc pl-6 space-y-3">
              <li><strong className="text-brand-dark font-semibold">Account Information:</strong> When you create an account, we collect your name, email address, password, and profile details.</li>
              <li><strong className="text-brand-dark font-semibold">Transaction Data:</strong> If you buy or sell products on Banolite, we collect payment and billing information, purchase history, and product details.</li>
              <li><strong className="text-brand-dark font-semibold">Usage Data:</strong> We automatically collect information about your interaction with our platform, such as IP addresses, browser types, device information, and pages visited.</li>
              <li><strong className="text-brand-dark font-semibold">Communication Data:</strong> We collect details of customer support inquiries and other communications you have with us.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-brand-dark mb-4">2. How We Use Your Information</h2>
            <p className="mb-4">Banolite uses the collected data for various purposes, including:</p>
            <ul className="list-disc pl-6 space-y-3">
              <li>To provide and maintain the Banolite services</li>
              <li>To process transactions, refunds, and creator payouts</li>
              <li>To notify you about changes to our platform or services</li>
              <li>To provide customer support and troubleshoot issues</li>
              <li>To detect, prevent, and address technical issues, fraud, or violations of our Terms and Conditions</li>
              <li>To send you administrative or promotional communications (with your consent)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-brand-dark mb-4">3. Data Sharing and Disclosure</h2>
            <p className="mb-4">We do not sell your personal information. However, we may share your data in the following situations:</p>
            <ul className="list-disc pl-6 space-y-3">
              <li><strong className="text-brand-dark font-semibold">With Creators/Sellers:</strong> If you purchase a product, the seller receives your name and email to deliver the product and provide support.</li>
              <li><strong className="text-brand-dark font-semibold">Service Providers:</strong> We use trusted third-party services (e.g., payment processors, hosting services) who assist us in operating Banolite securely.</li>
              <li><strong className="text-brand-dark font-semibold">Legal Requirements:</strong> We may disclose information if required by law or to protect the rights, property, or safety of Banolite, our users, or others.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-brand-dark mb-4">4. Cookies and Tracking Technologies</h2>
            <p>
              Banolite uses cookies and similar tracking technologies to enhance your experience, analyze trends, and operate the platform efficiently. You can control the use of cookies at the individual browser level, but disabling cookies may limit features of the platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-brand-dark mb-4">5. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. While we strive to protect your data, no method of transmission over the internet or electronic storage is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-brand-dark mb-4">6. Your Privacy Rights</h2>
            <p className="mb-4">Depending on your location, you may have rights regarding your personal data, including the right to:</p>
            <ul className="list-disc pl-6 space-y-3">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data or account closure</li>
              <li>Opt-out of marketing communications</li>
            </ul>
            <p className="mt-4 font-semibold text-brand-dark">
              To exercise these rights, please contact us using the information provided below.
            </p>
          </section>

          <section className="bg-white border border-[#E5E5E5] shadow-sm p-8 md:p-10 rounded-2xl mt-12">
            <h2 className="text-2xl font-display font-bold text-brand-dark mb-6">7. Contact Us</h2>
            <p className="mb-6">If you have any questions or concerns about this Privacy Policy, please contact us:</p>
            <div className="space-y-3 font-medium text-brand-dark text-lg">
              <p><strong>Banolite Support</strong></p>
              <p className="flex flex-col md:flex-row md:items-center gap-2">
                <span className="text-brand-muted text-base w-24">Email:</span>
                <a href="mailto:support@banolite.com" className="text-brand-primary hover:text-brand-dark transition-colors font-semibold">support@banolite.com</a>
              </p>
              <p className="flex flex-col md:flex-row md:items-center gap-2">
                <span className="text-brand-muted text-base w-24">Website:</span>
                <a href="https://www.banolite.com" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:text-brand-dark transition-colors font-semibold">www.banolite.com</a>
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
