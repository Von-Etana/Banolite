import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { CartDrawer } from "../components/CartDrawer";
import { AuthModal } from "../components/AuthModal";
import { CheckoutModal } from "../components/CheckoutModal";
import { Suspense } from "react";

import { Toaster } from 'react-hot-toast';

const sans = Plus_Jakarta_Sans({
    subsets: ["latin"],
    variable: '--font-sans'
});
const display = Outfit({
    subsets: ["latin"],
    variable: '--font-display'
});

export const metadata: Metadata = {
    metadataBase: new URL('https://banolite.com'),
    title: {
        default: "Banolite - Digital Knowledge Platform",
        template: "%s | Banolite",
    },
    description: "Your hub for premium digital products, courses, and coaching.",
    keywords: ["digital products", "ebooks", "online courses", "coaching", "creators", "selar alternative"],
    authors: [{ name: "Banolite Team" }],
    openGraph: {
        title: "Banolite - Digital Knowledge Platform",
        description: "Your hub for premium digital products, courses, and coaching.",
        url: "https://banolite.com",
        siteName: "Banolite",
        images: [
            {
                url: "/ban.png",
                width: 1200,
                height: 630,
                alt: "Banolite - Digital Knowledge Platform",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Banolite - Digital Knowledge Platform",
        description: "Your hub for premium digital products, courses, and coaching.",
        images: ["/ban.png"],
    },
};


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${sans.variable} ${display.variable}`}>
            <head>
                <link rel="dns-prefetch" href="https://bkyowvturhfsvxxeyurr.supabase.co" />
                <link rel="preconnect" href="https://bkyowvturhfsvxxeyurr.supabase.co" />
            </head>
            <body className="font-sans min-h-screen bg-cream text-brand-dark selection:bg-brand-purple selection:text-white">
                <Providers>
                    <Toaster
                        position="top-center"
                        toastOptions={{
                            className: 'font-sans font-medium',
                            style: {
                                background: '#1a1a1a',
                                color: '#fff',
                                borderRadius: '12px',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                                padding: '16px 20px',
                            },
                            success: {
                                iconTheme: {
                                    primary: '#22c55e',
                                    secondary: '#fff',
                                },
                            },
                            error: {
                                iconTheme: {
                                    primary: '#ef4444',
                                    secondary: '#fff',
                                },
                            },
                        }}
                    />
                    <Suspense fallback={null}>
                        <Navbar />
                    </Suspense>
                    <main className="pt-32 md:pt-48">
                        {children}
                    </main>
                    <Footer />
                    <CartDrawer />
                    <AuthModal />
                    <Suspense fallback={null}>
                        <CheckoutModal />
                    </Suspense>
                </Providers>
            </body>
        </html>
    );
}
