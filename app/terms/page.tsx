import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions | Banolite',
  description: 'Terms and conditions for using the Banolite platform.',
};

export default function TermsPage() {
  return (
    <div className="bg-cream min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-4xl tracking-tight">
        <div className="mb-16">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-brand-dark mb-6">
            Terms and Conditions
          </h1>
          <p className="text-lg md:text-xl text-brand-muted font-medium">
            Last updated: March 2026
          </p>
        </div>

        <div className="font-sans font-medium text-[17px] leading-relaxed max-w-none text-brand-muted space-y-12">
          <p className="text-brand-dark font-semibold text-xl mb-8">
            Welcome to Banolite. These Terms and Conditions govern your use of the Banolite platform, website, and services. By accessing or using Banolite, you agree to comply with and be bound by these Terms. If you do not agree with these Terms, you must not use the platform.
          </p>

          <section>
            <h2 className="text-2xl font-display font-bold text-brand-dark mb-4">1. Definitions</h2>
            <ul className="list-disc pl-6 space-y-3">
              <li><strong className="text-brand-dark font-semibold">Banolite</strong> refers to the Banolite platform, website, services, and technology used to enable digital commerce.</li>
              <li><strong className="text-brand-dark font-semibold">User</strong> refers to anyone who accesses or uses Banolite.</li>
              <li><strong className="text-brand-dark font-semibold">Seller (Creator)</strong> refers to users who list or sell products on Banolite.</li>
              <li><strong className="text-brand-dark font-semibold">Buyer (Customer)</strong> refers to users who purchase products or services on Banolite.</li>
              <li><strong className="text-brand-dark font-semibold">Products</strong> include digital products, physical products, subscriptions, or services listed on the platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-brand-dark mb-4">2. Eligibility</h2>
            <p className="mb-4">To use Banolite:</p>
            <ul className="list-disc pl-6 space-y-3">
              <li>You must be at least 18 years old.</li>
              <li>You must provide accurate and complete registration information.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            </ul>
            <p className="mt-4 font-semibold text-brand-dark">Banolite reserves the right to suspend or terminate accounts that violate these terms.</p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-brand-dark mb-4">3. Account Registration</h2>
            <p className="mb-4">To sell on Banolite, users must create an account. You agree that:</p>
            <ul className="list-disc pl-6 space-y-3">
              <li>All information provided is accurate and up to date.</li>
              <li>You will not impersonate another person.</li>
              <li>You are responsible for all activities conducted under your account.</li>
            </ul>
            <p className="mt-4 font-semibold text-brand-dark">Banolite may suspend or terminate accounts involved in fraudulent or suspicious activities.</p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-brand-dark mb-4">4. Products and Services</h2>
            <p className="mb-4">Sellers may list and sell:</p>
            <ul className="list-disc pl-6 space-y-3">
              <li>Digital products (courses, ebooks)</li>
              <li>Memberships or subscriptions</li>
              <li>Services</li>
              <li>Tickets</li>
            </ul>
            <p className="mt-6 mb-4">Sellers are responsible for:</p>
            <ul className="list-disc pl-6 space-y-3">
              <li>Ensuring products are legal and legitimate</li>
              <li>Delivering products as described</li>
              <li>Providing accurate product descriptions</li>
            </ul>
            <p className="mt-4 font-semibold text-brand-dark">Banolite is not responsible for the quality, accuracy, or legality of products sold by sellers.</p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-brand-dark mb-4">5. Prohibited Products and Activities</h2>
            <p className="mb-4">Users may not use Banolite to:</p>
            <ul className="list-disc pl-6 space-y-3">
              <li>Sell illegal products</li>
              <li>Distribute pirated or copyrighted content without permission</li>
              <li>Promote scams or fraudulent schemes</li>
              <li>Upload malware or harmful software</li>
              <li>Violate intellectual property rights</li>
              <li>Engage in abusive or deceptive practices</li>
            </ul>
            <p className="mt-4 font-semibold text-brand-dark">Banolite may remove content and suspend accounts that violate these rules.</p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-brand-dark mb-4">6. Payments and Fees</h2>
            <p className="mb-4">Banolite processes payments on behalf of sellers. By using Banolite:</p>
            <ul className="list-disc pl-6 space-y-3">
              <li>Sellers agree to pay applicable platform transaction fees.</li>
              <li>Banolite may deduct fees before payouts are made.</li>
              <li>Payouts will be sent according to Banolite&apos;s payout schedule.</li>
            </ul>
            <p className="mt-4 font-semibold text-brand-dark">Banolite reserves the right to hold or delay payments in cases of fraud, disputes, or violations.</p>
            
            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 md:p-8 mt-8 shadow-sm">
              <h3 className="text-xl font-display font-bold text-brand-dark mb-4">Transaction Fees (Important)</h3>
              <p className="mb-4">Besides the plan, Banolite charges a fee per sale. Example:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-brand-dark">₦ transactions:</strong> 4% + ₦50 per sale</li>
                <li><strong className="text-brand-dark">USD transactions:</strong> 7% + $0.50 per sale</li>
                <li><strong className="text-brand-dark">Other currencies</strong> have similar small fees.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-brand-dark mb-4">7. Refunds and Disputes</h2>
            <p className="mb-4">Sellers may define their own refund policies. However:</p>
            <ul className="list-disc pl-6 space-y-3">
              <li>Buyers must review refund policies before purchasing.</li>
              <li>Banolite may intervene in disputes between buyers and sellers.</li>
              <li>Banolite reserves the right to reverse transactions in cases of fraud.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-brand-dark mb-4">8. Intellectual Property</h2>
            <p className="mb-4">
              All content on Banolite including logos, software, and design is owned by Banolite or its licensors. 
              Sellers retain ownership of their products but grant Banolite the right to:
            </p>
            <ul className="list-disc pl-6 space-y-3">
              <li>Display</li>
              <li>Promote</li>
              <li>Distribute</li>
            </ul>
            <p className="mt-4">their products on the platform.</p>
            <p className="mt-4 font-semibold text-brand-dark">Users may not copy, reproduce, or distribute Banolite content without permission.</p>
          </section>

          <hr className="my-16 border-[#E5E5E5]" />

          <section>
            <h2 className="text-2xl font-display font-bold text-brand-dark mb-4">9. Platform Availability</h2>
            <p className="mb-4">Banolite strives to maintain reliable service but does not guarantee uninterrupted availability. Banolite is not liable for:</p>
            <ul className="list-disc pl-6 space-y-3">
              <li>Temporary outages</li>
              <li>Data loss</li>
              <li>Service interruptions caused by third-party providers.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-brand-dark mb-4">10. Account Suspension or Termination</h2>
            <p className="mb-4">Banolite may suspend or terminate accounts that:</p>
            <ul className="list-disc pl-6 space-y-3">
              <li>Violate these Terms</li>
              <li>Engage in fraudulent activities</li>
              <li>Sell prohibited products</li>
              <li>Abuse the platform.</li>
            </ul>
            <p className="mt-4">Termination may result in removal of content and restriction of platform access.</p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-brand-dark mb-4">11. Limitation of Liability</h2>
            <p className="mb-4">Banolite shall not be liable for:</p>
            <ul className="list-disc pl-6 space-y-3">
              <li>Disputes between buyers and sellers</li>
              <li>Loss of profits or revenue</li>
              <li>Indirect or consequential damages arising from the use of the platform.</li>
            </ul>
            <p className="mt-4 font-semibold text-brand-dark">Use of Banolite is at the user&apos;s own risk.</p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-brand-dark mb-4">12. Changes to Terms</h2>
            <p>
              Banolite may update these Terms at any time. Users will be notified of significant changes. Continued use of the platform after updates constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section className="bg-white border border-[#E5E5E5] shadow-sm p-8 md:p-10 rounded-2xl mt-12">
            <h2 className="text-2xl font-display font-bold text-brand-dark mb-6">13. Contact Information</h2>
            <p className="mb-6">For questions regarding these Terms and Conditions, please contact:</p>
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
