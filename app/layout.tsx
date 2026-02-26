import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { CartDrawer } from "../components/CartDrawer";
import { AuthModal } from "../components/AuthModal";
import { CheckoutModal } from "../components/CheckoutModal";

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
