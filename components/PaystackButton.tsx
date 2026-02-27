'use client';
import React, { useEffect, useState } from 'react';

interface PaystackButtonProps {
    email: string;
    amount: number; // in Naira (will be converted to kobo)
    reference?: string; // Optional custom reference (Order ID)
    onSuccess: (reference: any) => void;
    onClose: () => void;
    disabled?: boolean;
    className?: string;
    children: React.ReactNode;
}

// Replace with your own Paystack test/live public key
const PAYSTACK_PUBLIC_KEY = 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';

export const PaystackButton: React.FC<PaystackButtonProps> = ({
    email,
    amount,
    reference,
    onSuccess,
    onClose,
    disabled = false,
    className = '',
    children
}) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleClick = async () => {
        if (disabled || !isMounted) return;

        const refString = reference || `BNL_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;

        // Use Paystack Inline JS SDK directly (avoids SSR issues)
        const handler = (window as any).PaystackPop;
        if (handler) {
            const popup = handler.setup({
                key: PAYSTACK_PUBLIC_KEY,
                email,
                amount: Math.round(amount * 100),
                currency: 'NGN',
                ref: refString,
                callback: (response: any) => {
                    onSuccess(response);
                },
                onClose: () => {
                    onClose();
                },
            });
            popup.openIframe();
        } else {
            // Fallback: load Paystack script first
            const script = document.createElement('script');
            script.src = 'https://js.paystack.co/v1/inline.js';
            script.async = true;
            script.onload = () => {
                const pop = (window as any).PaystackPop;
                if (pop) {
                    const popup = pop.setup({
                        key: PAYSTACK_PUBLIC_KEY,
                        email,
                        amount: Math.round(amount * 100),
                        currency: 'NGN',
                        ref: refString,
                        callback: (response: any) => {
                            onSuccess(response);
                        },
                        onClose: () => {
                            onClose();
                        },
                    });
                    popup.openIframe();
                }
            };
            document.body.appendChild(script);
        }
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={disabled || !isMounted}
            className={className}
        >
            {children}
        </button>
    );
};
