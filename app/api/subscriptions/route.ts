import { NextRequest, NextResponse } from 'next/server';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

// Fallback values or fetch from env
const PLAN_CODES = {
  pro: process.env.PAYSTACK_PLAN_PRO || null, 
  business: process.env.PAYSTACK_PLAN_BUSINESS || null
};

const PLAN_PRICES = {
  pro: 500000, 
  business: 1500000 
};

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    
    // Validate required fields
    if (!payload.tier || !['pro', 'business'].includes(payload.tier)) {
      return NextResponse.json({ error: 'Invalid subscription tier' }, { status: 400 });
    }
    if (!payload.email || !payload.userId) {
      return NextResponse.json({ error: 'Email and userId are required' }, { status: 400 });
    }

    const { tier, email, userId } = payload;
    const planCode = PLAN_CODES[tier as 'pro' | 'business'];
    const amount = PLAN_PRICES[tier as 'pro' | 'business'];

    const paystackPayload: any = {
        email,
        amount,
        metadata: {
            custom_fields: [
                {
                    display_name: 'Subscription Tier',
                    variable_name: 'subscription_tier',
                    value: tier,
                },
                {
                    display_name: 'User ID',
                    variable_name: 'user_id',
                    value: userId,
                }
            ],
            is_subscription: true,
            tier,
            userId,
        },
        callback_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/author-dashboard`,
    };

    // If a valid plan code is provided in env, add it to start a recurring subscription natively via Paystack
    if (planCode) {
        paystackPayload.plan = planCode;
    }

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(paystackPayload),
    });

    const data = await response.json();

    if (!response.ok || !data.status) {
        throw new Error(data.message || 'Failed to initialize payment');
    }

    return NextResponse.json({
        authorizationUrl: data.data.authorization_url,
        reference: data.data.reference,
    });

  } catch (error: any) {
    console.error('[SubscriptionAPI] Error initializing checkout:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
