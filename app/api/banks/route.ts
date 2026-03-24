import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const apiKey = process.env.PAYSTACK_SECRET_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'Paystack API key not configured' }, { status: 500 });
        }

        const response = await fetch('https://api.paystack.co/bank?currency=NGN', {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        
        if (!data.status) {
            return NextResponse.json({ error: data.message || 'Failed to fetch banks' }, { status: 400 });
        }

        // Return just the relevant mapped info: names and codes
        const banks = data.data.map((b: any) => ({
            name: b.name,
            code: b.code,
            slug: b.slug
        }));

        // Optional: Sort alphabetically for easy dropdown browsing
        banks.sort((a: any, b: any) => a.name.localeCompare(b.name));

        return NextResponse.json({ success: true, data: banks }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to connect to provider' }, { status: 500 });
    }
}
