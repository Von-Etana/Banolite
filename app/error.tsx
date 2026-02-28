'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Home, RefreshCcw } from 'lucide-react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Global Error Boundary caught:', error);
    }, [error]);

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border border-selar-border relative overflow-hidden"
            >
                {/* Visual Accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-orange-500" />

                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="w-10 h-10" />
                </div>

                <h1 className="font-display font-bold text-3xl text-brand-dark mb-3">
                    Oops! Something went wrong.
                </h1>

                <p className="text-brand-muted mb-8 text-sm">
                    We've encountered an unexpected error. Our team has been notified. Please try refreshing the page or restarting your action.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={reset}
                        className="flex-1 py-3 px-4 bg-brand-dark text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all"
                    >
                        <RefreshCcw className="w-4 h-4" /> Try Again
                    </button>

                    <Link
                        href="/discover"
                        className="flex-1 py-3 px-4 bg-brand-light text-brand-dark rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-all border border-selar-border"
                    >
                        <Home className="w-4 h-4" /> Go Home
                    </Link>
                </div>

                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-red-100 text-left overflow-auto max-h-40">
                        <p className="text-xs font-mono text-red-600 font-bold mb-1">Developer Details:</p>
                        <p className="text-[10px] font-mono text-gray-700">{error.message}</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
