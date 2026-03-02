import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About Us | Banolite',
    description: 'Learn about Banolite — the premier digital marketplace empowering creators and professionals worldwide.',
    openGraph: {
        title: 'About Us | Banolite',
        description: 'Learn about Banolite — the premier digital marketplace empowering creators and professionals worldwide.',
        type: 'website',
        siteName: 'Banolite',
    },
    twitter: {
        card: 'summary',
        title: 'About Us | Banolite',
        description: 'Learn about Banolite — the premier digital marketplace empowering creators and professionals worldwide.',
    },
};

export default function AboutPage() {
    return (
        <div className="min-h-screen pt-32 pb-20 container mx-auto px-6">
            <h1 className="text-4xl font-display font-bold text-brand-dark mb-4">About Banolite</h1>
            <p className="text-gray-600">This page is under construction.</p>
        </div>
    );
}
