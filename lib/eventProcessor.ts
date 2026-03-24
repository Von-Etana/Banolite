/**
 * Event Processor — Core Logic for Webhook Event Fulfillment
 *
 * Processes webhook events from the `webhook_events` table.
 * Implements retry logic with exponential backoff and dead-letter queue.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { sendOrderReceipt, sendSellerSaleNotification } from './resend';

// ─── Types ─────────────────────────────────────────────────────────

interface WebhookEvent {
    id: string;
    idempotency_key: string;
    event_type: string;
    payload: any;
    status: string;
    retry_count: number;
    max_retries: number;
}

interface FulfillmentItem {
    id: string;
    productId: string;
    title: string;
    price: number;
    quantity: number;
    creatorId: string;
    type: string;
    metadata: Record<string, any>;
}

// ─── Supabase Admin Client ─────────────────────────────────────────

function getAdminClient(): SupabaseClient {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    );
}

// ─── Exponential Backoff ───────────────────────────────────────────

/**
 * Calculate the next retry timestamp using exponential backoff.
 * Base delay: 1s, multiplied by 2^retryCount.
 * Max delay: 5 minutes.
 */
function calculateNextRetry(retryCount: number): Date {
    const baseDelayMs = 1000;
    const maxDelayMs = 5 * 60 * 1000; // 5 minutes
    const delayMs = Math.min(baseDelayMs * Math.pow(2, retryCount), maxDelayMs);
    // Add jitter (±25%)
    const jitter = delayMs * 0.25 * (Math.random() * 2 - 1);
    return new Date(Date.now() + delayMs + jitter);
}

// ─── Main Event Processor ──────────────────────────────────────────

/**
 * Process a single webhook event.
 * Returns true if processing succeeded, false otherwise.
 */
export async function processWebhookEvent(event: WebhookEvent): Promise<boolean> {
    const supabase = getAdminClient();

    // Mark as processing
    await supabase
        .from('webhook_events')
        .update({ status: 'processing' })
        .eq('id', event.id);

    try {
        if (event.event_type === 'charge.success') {
            const data = event.payload.data;
            if (data.metadata?.is_subscription) {
                await handleSubscriptionSuccess(supabase, event);
            } else {
                await handleChargeSuccess(supabase, event);
            }
        } else if (event.event_type === 'invoice.payment_failed') {
            await handleSubscriptionFailure(supabase, event);
        }
        // Add more event types here as needed:

        // Mark as completed
        await supabase
            .from('webhook_events')
            .update({
                status: 'completed',
                processed_at: new Date().toISOString(),
            })
            .eq('id', event.id);

        return true;
    } catch (error: any) {
        console.error(`[EventProcessor] Failed to process event ${event.id}:`, error.message);

        const newRetryCount = event.retry_count + 1;

        if (newRetryCount >= event.max_retries) {
            // Move to dead-letter queue
            await supabase
                .from('webhook_events')
                .update({
                    status: 'dead_letter',
                    retry_count: newRetryCount,
                    error_message: `Final failure after ${newRetryCount} attempts: ${error.message}`,
                })
                .eq('id', event.id);

            console.error(`[EventProcessor] Event ${event.id} moved to dead-letter queue`);
        } else {
            // Schedule retry with exponential backoff
            const nextRetry = calculateNextRetry(newRetryCount);
            await supabase
                .from('webhook_events')
                .update({
                    status: 'failed',
                    retry_count: newRetryCount,
                    next_retry_at: nextRetry.toISOString(),
                    error_message: error.message,
                })
                .eq('id', event.id);

            console.log(`[EventProcessor] Event ${event.id} scheduled for retry #${newRetryCount} at ${nextRetry.toISOString()}`);
        }

        return false;
    }
}

// ─── Subscription Handlers ────────────────────────────────────────

async function handleSubscriptionSuccess(supabase: SupabaseClient, event: WebhookEvent) {
    const data = event.payload.data;
    const { tier, userId } = data.metadata;

    if (!tier || !userId) {
        throw new Error('Missing tier or userId in subscription metadata');
    }

    // Update user's profile to the new tier
    const { error } = await supabase
        .from('profiles')
        .update({ subscription_plan: tier })
        .eq('id', userId);

    if (error) {
        throw new Error(`Failed to update subscription for user ${userId}: ${error.message}`);
    }

    // Optional: Notify user
    await supabase.from('notifications').insert({
        user_id: userId,
        type: 'subscription',
        message: `Your subscription has been successfully upgraded to the ${tier.toUpperCase()} plan!`,
        link: '/author-dashboard',
    });
}

async function handleSubscriptionFailure(supabase: SupabaseClient, event: WebhookEvent) {
    const data = event.payload.data;
    // Paystack invoice failed event typically includes customer info or subscription info
    // If we have customer email, we can downgrade them
    const email = data.customer?.email;
    if (!email) return;

    // Find user by email (assuming email is unique config in auth)
    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();
    
    if (profile) {
        await supabase
            .from('profiles')
            .update({ subscription_plan: 'starter' })
            .eq('id', profile.id);
            
        await supabase.from('notifications').insert({
            user_id: profile.id,
            type: 'subscription_failed',
            message: `Your recurring subscription payment failed. Your account has been securely downgraded to Starter. Please update your payment method.`,
            link: '/pricing',
        });
    }
}


// ─── charge.success Handler ────────────────────────────────────────

async function handleChargeSuccess(supabase: SupabaseClient, event: WebhookEvent) {
    const data = event.payload.data;
    const orderId = data.reference;

    // A. Fetch the order
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .select(`*, order_items(*, products(title, price, type, creator_id))`)
        .eq('id', orderId)
        .single();

    if (orderError || !order) {
        throw new Error(`Order ${orderId} not found: ${orderError?.message}`);
    }

    // Idempotency: skip if already completed
    if (order.status === 'completed') {
        console.log(`[EventProcessor] Order ${orderId} already completed, skipping.`);
        return;
    }

    // Transition to processing
    await supabase.from('orders').update({ status: 'processing' }).eq('id', orderId);

    const items: FulfillmentItem[] = order.order_items.map((item: any) => ({
        id: item.id,
        productId: item.product_id,
        title: item.products.title,
        price: item.price,
        quantity: item.quantity,
        creatorId: item.products.creator_id,
        type: item.products.type,
        metadata: item.metadata || {},
    }));

    const total = order.total;
    const buyerEmail = order.email;
    const buyerId = order.user_id;
    const affiliateId = order.affiliate_id;

    let emailAdditionalInfo: Record<string, any> = {};

    // B. Update product sales counts + generate Bookings/Tickets
    for (const item of items) {
        await supabase.rpc('increment_sales_count', {
            p_id: item.productId,
            amount: item.quantity || 1,
        }).then(({ error }) => {
            if (error) console.error('[EventProcessor] RPC increment_sales_count failed:', error.message);
        });

        // Coaching bookings
        if (item.type === 'COACHING' && item.metadata?.bookingDate && item.metadata?.coachId) {
            for (let i = 0; i < (item.quantity || 1); i++) {
                const meetLink = `https://meet.google.com/${crypto.randomBytes(4).toString('hex')}`;
                await supabase.from('bookings').insert({
                    user_id: buyerId !== 'guest' ? buyerId : null,
                    coach_id: item.metadata.coachId,
                    order_item_id: item.id,
                    date: item.metadata.bookingDate,
                    status: 'upcoming',
                    meet_link: meetLink,
                    amount: item.price,
                });
                emailAdditionalInfo.bookingDate = item.metadata.bookingDate;
                emailAdditionalInfo.meetLink = meetLink;
            }
        }

        // Event tickets
        if (item.type === 'TICKET') {
            for (let i = 0; i < (item.quantity || 1); i++) {
                const qrCode = `QR-${orderId.slice(0, 8)}-${item.id.slice(0, 4)}-${i}`;
                await supabase.from('tickets').insert({
                    user_id: buyerId !== 'guest' ? buyerId : null,
                    event_id: item.productId,
                    order_item_id: item.id,
                    qr_code: qrCode,
                    status: 'valid',
                    amount: item.price,
                });
                emailAdditionalInfo.qrCode = qrCode;
            }
        }
    }

    // C. Update buyer profile
    if (buyerId !== 'guest') {
        const productIds = items.map((item) => item.productId);
        const { data: profile } = await supabase
            .from('profiles')
            .select('purchased_product_ids, name')
            .eq('id', buyerId)
            .single();

        if (profile) {
            const existing = profile.purchased_product_ids || [];
            const merged = [...new Set([...existing, ...productIds])];
            await supabase.from('profiles').update({ purchased_product_ids: merged }).eq('id', buyerId);
        }

        // Buyer notification
        await supabase.from('notifications').insert({
            user_id: buyerId,
            type: 'order',
            message: `Your order #${orderId.slice(0, 8)} has been confirmed!`,
            link: '/library',
        });
    }

    // D. Email receipt (fire-and-forget)
    const buyerProfile = buyerId !== 'guest'
        ? await supabase.from('profiles').select('name').eq('id', buyerId).single()
        : { data: null };
    const buyerName = buyerProfile.data?.name || 'Customer';

    sendOrderReceipt({
        buyerName,
        buyerEmail,
        orderId,
        items,
        total,
        paymentRef: data.reference,
        additionalInfo: emailAdditionalInfo,
    }).catch(console.error);

    // E. Process seller payouts and affiliate commissions
    const sellerIds = [...new Set(items.map((i) => i.creatorId).filter(Boolean))];
    let commissionRate = 0;
    let affiliateUserId: string | null = null;

    if (affiliateId) {
        const { data: affData } = await supabase
            .from('affiliates')
            .select('user_id, commission_rate')
            .eq('id', affiliateId)
            .single();

        if (affData) {
            commissionRate = affData.commission_rate || 0;
            affiliateUserId = affData.user_id;

            // Increment affiliate conversions
            const { data: currentAff } = await supabase
                .from('affiliates')
                .select('conversions')
                .eq('id', affiliateId)
                .single();

            if (currentAff) {
                await supabase
                    .from('affiliates')
                    .update({ conversions: (currentAff.conversions || 0) + 1 })
                    .eq('id', affiliateId);
            }
        }
    }

    for (const sellerId of sellerIds) {
        const sellerItems = items.filter((i) => i.creatorId === sellerId);
        const sellerTotal = sellerItems.reduce((sum, i) => sum + i.price * (i.quantity || 1), 0);
        
        // Fetch seller profile to get subscription tier and info mapping
        const { data: sellerProfile } = await supabase
            .from('profiles')
            .select('name, email, subscription_plan')
            .eq('id', sellerId)
            .single();

        const subscriptionPlan = sellerProfile?.subscription_plan || 'starter';
        
        // Define dynamic platform fee based on subscription tier
        let platformFeePercentage = 0.10; // Starter/Free default
        if (subscriptionPlan === 'business') {
            platformFeePercentage = 0.02;
        } else if (subscriptionPlan === 'pro') {
            platformFeePercentage = 0.05;
        }

        const currency = data?.currency || 'NGN';
        let platformFee = sellerTotal * platformFeePercentage;

        // Record platform revenue
        await supabase.from('platform_revenue').insert({
            order_id: orderId,
            amount: platformFee,
            currency: currency,
            description: `Platform fee (${(platformFeePercentage * 100)}%) for sale by seller ${sellerId}`,
        });

        let affiliateCommission = 0;
        if (affiliateUserId && commissionRate > 0) {
            affiliateCommission = sellerTotal * (commissionRate / 100);
        }

        const sellerNet = sellerTotal - platformFee - affiliateCommission;

        // ATOMIC wallet update for seller
        await supabase.rpc('increment_wallet_balance', {
            p_user_id: sellerId,
            p_amount: sellerNet,
        });

        // Seller notification
        if (sellerProfile) {
            await supabase.from('notifications').insert({
                user_id: sellerId,
                type: 'sale',
                message: `You made a sale! ₦${sellerTotal.toFixed(2)} from ${sellerItems.length} item(s).${affiliateCommission > 0 ? ` (₦${affiliateCommission.toFixed(2)} paid to affiliate)` : ''}`,
                link: '/store',
            });

            sendSellerSaleNotification({
                sellerEmail: sellerProfile.email,
                sellerName: sellerProfile.name,
                productTitle: sellerItems[0]?.title || 'a product',
                amount: sellerTotal,
                buyerName,
            }).catch(console.error);
        }

        // ATOMIC affiliate earnings update
        if (affiliateUserId && affiliateCommission > 0) {
            await supabase.rpc('increment_affiliate_earnings', {
                p_user_id: affiliateUserId,
                p_amount: affiliateCommission,
            });

            await supabase.from('notifications').insert({
                user_id: affiliateUserId,
                type: 'sale',
                message: `You earned ₦${affiliateCommission.toFixed(2)} in affiliate commission!`,
                link: '/dashboard',
            });
        }
    }

    // F. Mark order as completed
    await supabase.from('orders').update({ status: 'completed' }).eq('id', orderId);
}

// ─── Queue Processor ───────────────────────────────────────────────

/**
 * Process pending webhook events from the queue.
 * Called by the cron job route.
 */
export async function processEventQueue(): Promise<{
    processed: number;
    failed: number;
    deadLettered: number;
}> {
    const supabase = getAdminClient();
    const now = new Date().toISOString();

    // Fetch events that need processing:
    // 1. Status = 'received' (new events)
    // 2. Status = 'failed' AND next_retry_at <= now (retries due)
    const { data: events, error } = await supabase
        .from('webhook_events')
        .select('*')
        .or(`status.eq.received,and(status.eq.failed,next_retry_at.lte.${now})`)
        .order('created_at', { ascending: true })
        .limit(50); // Process in batches of 50

    if (error || !events) {
        console.error('[QueueProcessor] Failed to fetch events:', error?.message);
        return { processed: 0, failed: 0, deadLettered: 0 };
    }

    let processed = 0;
    let failed = 0;
    let deadLettered = 0;

    for (const event of events) {
        const success = await processWebhookEvent(event);
        if (success) {
            processed++;
        } else {
            // Check if it was dead-lettered
            const { data: updated } = await supabase
                .from('webhook_events')
                .select('status')
                .eq('id', event.id)
                .single();

            if (updated?.status === 'dead_letter') {
                deadLettered++;
            } else {
                failed++;
            }
        }
    }

    // Also expire stale pending orders
    await supabase.rpc('expire_stale_orders');

    // Clean up old rate limit entries
    await supabase.rpc('cleanup_old_rate_limits');

    console.log(`[QueueProcessor] Batch complete: ${processed} processed, ${failed} failed, ${deadLettered} dead-lettered`);
    return { processed, failed, deadLettered };
}
