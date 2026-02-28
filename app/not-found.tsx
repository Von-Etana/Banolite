import Link from 'next/link';
import { Compass, Home, Search } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-cream flex flex-col">
            <Navbar />

            <main className="flex-grow flex items-center justify-center p-4 py-20">
                <div className="max-w-2xl w-full text-center space-y-8">
                    {/* Visual element */}
                    <div className="relative w-40 h-40 mx-auto">
                        <div className="absolute inset-0 bg-brand-purple/10 rounded-full animate-ping opacity-75" />
                        <div className="relative w-40 h-40 bg-brand-light border-2 border-selar-border rounded-full flex items-center justify-center text-brand-purple shadow-xl">
                            <Compass className="w-16 h-16" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="font-display font-black text-6xl text-brand-dark tracking-tighter">
                            404
                        </h1>
                        <h2 className="font-bold text-2xl text-brand-dark">
                            Looks like you're lost in the digital void.
                        </h2>
                        <p className="text-brand-muted max-w-md mx-auto">
                            The product, creator, or page you are looking for does not exist or has been moved.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
                        <Link
                            href="/discover"
                            className="w-full sm:w-auto px-8 py-4 bg-brand-dark text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        >
                            <Search className="w-5 h-5" /> Explore Products
                        </Link>

                        <Link
                            href="/"
                            className="w-full sm:w-auto px-8 py-4 bg-white text-brand-dark rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all border border-selar-border/50"
                        >
                            <Home className="w-5 h-5 text-brand-muted" /> Return Home
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
