import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Discover Products, Coaches & Events | Banolite',
    description: 'Explore top-tier coaches, attend exclusive events, and discover premium digital products on Banolite.',
    openGraph: {
        title: 'Discover Products, Coaches & Events | Banolite',
        description: 'Explore top-tier coaches, attend exclusive events, and discover premium digital products on Banolite.',
        type: 'website',
        siteName: 'Banolite',
    },
    twitter: {
        card: 'summary',
        title: 'Discover Products, Coaches & Events | Banolite',
        description: 'Explore top-tier coaches, attend exclusive events, and discover premium digital products on Banolite.',
    },
};

export default function DiscoverLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
