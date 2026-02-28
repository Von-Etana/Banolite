import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { CartDrawer } from "../components/CartDrawer";
import { AuthModal } from "../components/AuthModal";
import { CheckoutModal } from "../components/CheckoutModal";

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
    title: "Banolite - Digital Knowledge Platform",
    description: "Your hub for premium digital products, courses, and coaching.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${sans.variable} ${display.variable} font-sans min-h-screen bg-cream text-brand-dark selection:bg-brand-purple selection:text-white`}>
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
                    <Navbar />
                    <main>
                        {children}
                    </main>
                    <Footer />
                    <CartDrawer />
                    <AuthModal />
                    <CheckoutModal />
                </Providers>
            </body>
        </html>
    );
}
