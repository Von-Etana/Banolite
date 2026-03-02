import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Events & Tickets | Banolite',
    description: 'Find and book tickets for webinars, workshops, and live events on Banolite.',
    openGraph: {
        title: 'Events & Tickets | Banolite',
        description: 'Find and book tickets for webinars, workshops, and live events on Banolite.',
        type: 'website',
        siteName: 'Banolite',
    },
    twitter: {
        card: 'summary',
        title: 'Events & Tickets | Banolite',
        description: 'Find and book tickets for webinars, workshops, and live events on Banolite.',
    },
};

export default function EventsPage() {
    return (
        <div className="min-h-screen pt-32 pb-20 container mx-auto px-6">
            <h1 className="text-4xl font-display font-bold text-brand-dark mb-4">Event Tickets</h1>
            <p className="text-gray-600">Find and book upcoming events. This page is under construction.</p>
        </div>
    );
}
