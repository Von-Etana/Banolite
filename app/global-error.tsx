'use client';

import React from 'react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body style={{
                fontFamily: 'system-ui, sans-serif',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                margin: 0,
                padding: '20px',
                textAlign: 'center',
                backgroundColor: '#FAF7F2',
                color: '#000'
            }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>Something went wrong!</h2>
                <p style={{ color: '#666', marginBottom: '20px' }}>A critical error occurred.</p>
                <button
                    onClick={() => reset()}
                    style={{
                        padding: '12px 24px',
                        backgroundColor: '#000',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    Try again
                </button>
            </body>
        </html>
    );
}
