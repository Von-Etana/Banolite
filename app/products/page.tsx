import { Metadata } from 'next';
import { ProductSection } from '../../components/ProductSection';

export const metadata: Metadata = {
    title: 'Browse Products | Banolite',
    description: 'Explore premium ebooks, courses, templates, and digital downloads from top creators on Banolite.',
    openGraph: {
        title: 'Browse Products | Banolite',
        description: 'Explore premium ebooks, courses, templates, and digital downloads from top creators on Banolite.',
        type: 'website',
        siteName: 'Banolite',
    },
    twitter: {
        card: 'summary',
        title: 'Browse Products | Banolite',
        description: 'Explore premium ebooks, courses, templates, and digital downloads from top creators on Banolite.',
    },
};

export default function ProductsPage() {
    return (
        <main className="min-h-screen pt-20">
            <ProductSection />
        </main>
    );
}
