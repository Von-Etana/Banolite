import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us | Banolite',
    description: 'Get in touch with the Banolite team for support, partnerships, or general inquiries.',
    openGraph: {
        title: 'Contact Us | Banolite',
        description: 'Get in touch with the Banolite team for support, partnerships, or general inquiries.',
        type: 'website',
        siteName: 'Banolite',
    },
    twitter: {
        card: 'summary',
        title: 'Contact Us | Banolite',
        description: 'Get in touch with the Banolite team for support, partnerships, or general inquiries.',
    },
};

export default function ContactPage() {
    return (
        <div className="min-h-screen pt-32 pb-20 container mx-auto px-6">
            <h1 className="text-4xl font-display font-bold text-brand-dark mb-4">Contact Us</h1>
            <p className="text-gray-600">This page is under construction.</p>
        </div>
    );
}
