'use client';

import { StoreProvider } from '../context/StoreContext';
import { CurrencyProvider } from '../context/CurrencyContext';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <CurrencyProvider>
            <StoreProvider>
                {children}
            </StoreProvider>
        </CurrencyProvider>
    );
}
