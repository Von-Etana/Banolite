'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

type Currency = 'NGN' | 'USD';

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    toggleCurrency: () => void;
    formatPrice: (priceInUsd: number) => string;
    exchangeRate: number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currency, setCurrency] = useState<Currency>('NGN');

    // Fixed exchange rate for now: 1 USD = 1500 NGN
    const exchangeRate = 1500;

    // Persist preference
    useEffect(() => {
        const savedCurrency = localStorage.getItem('redex_currency');
        if (savedCurrency === 'USD' || savedCurrency === 'NGN') {
            setCurrency(savedCurrency);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('redex_currency', currency);
    }, [currency]);

    const toggleCurrency = () => {
        setCurrency(prev => prev === 'NGN' ? 'USD' : 'NGN');
    };

    const formatPrice = (priceInUsd: number) => {
        if (currency === 'USD') {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            }).format(priceInUsd);
        } else {
            return new Intl.NumberFormat('en-NG', {
                style: 'currency',
                currency: 'NGN',
            }).format(priceInUsd * exchangeRate);
        }
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, toggleCurrency, formatPrice, exchangeRate }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};
