import { Metadata } from 'next';
import { MyLibrary } from "../../views/MyLibrary";

export const metadata: Metadata = {
    title: 'My Library | Banolite',
    description: 'Access your purchased ebooks, courses, tickets, and bookings in your personal Banolite library.',
    openGraph: {
        title: 'My Library | Banolite',
        description: 'Access your purchased ebooks, courses, tickets, and bookings in your personal Banolite library.',
        type: 'website',
        siteName: 'Banolite',
    },
    twitter: {
        card: 'summary',
        title: 'My Library | Banolite',
        description: 'Access your purchased ebooks, courses, tickets, and bookings in your personal Banolite library.',
    },
};

export default function Page() {
    return <MyLibrary />;
}
