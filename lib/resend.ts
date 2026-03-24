import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

export interface OrderEmailData {
    buyerName: string;
    buyerEmail: string;
    orderId: string;
    items: { title: string; price: number; quantity: number }[];
    total: number;
    paymentRef: string;
    additionalInfo?: {
        bookingDate?: string;
        attendeeName?: string;
        meetLink?: string;
        qrCode?: string;
    };
}

export interface SaleEmailData {
    sellerEmail: string;
    sellerName: string;
    productTitle: string;
    amount: number;
    buyerName: string;
}

export async function sendOrderReceipt(data: OrderEmailData) {
    const itemsHtml = data.items
        .map(
            (item) =>
                `<tr>
                    <td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; color: #1a1a1a;">${item.title}</td>
                    <td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; text-align: center; color: #666;">${item.quantity}</td>
                    <td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; text-align: right; font-weight: 600; color: #1a1a1a;">₦${(item.price * item.quantity).toFixed(2)}</td>
                </tr>`
        )
        .join('');

    let additionalInfoHtml = '';
    if (data.additionalInfo && Object.keys(data.additionalInfo).length > 0) {
        additionalInfoHtml = `
            <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin: 24px 0;">
                <h3 style="margin: 0 0 16px 0; font-size: 14px; text-transform: uppercase; color: #111827; letter-spacing: 0.05em; font-weight: 800;">Access Details</h3>
                ${data.additionalInfo.bookingDate ? `<p style="margin: 0 0 8px 0; font-size: 14px; color: #374151;"><strong>Scheduled For:</strong> ${new Date(data.additionalInfo.bookingDate).toLocaleString()}</p>` : ''}
                ${data.additionalInfo.meetLink ? `<p style="margin: 0 0 8px 0; font-size: 14px; color: #374151;"><strong>Meeting Link:</strong> <a href="${data.additionalInfo.meetLink}" style="color: #111827; text-decoration: underline; font-weight: bold;">Join Session</a></p>` : ''}
                ${data.additionalInfo.qrCode ? `<p style="margin: 0 0 8px 0; font-size: 14px; color: #374151;"><strong>Ticket Code:</strong> <span style="background: white; border: 1px solid #d1d5db; padding: 4px 8px; border-radius: 6px; font-family: monospace; font-weight: bold; color: #111827;">${data.additionalInfo.qrCode}</span></p>` : ''}
            </div>
        `;
    }

    try {
        const { data: result, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: data.buyerEmail,
            subject: `Banolite — Receipt for Order #${data.orderId.slice(0, 8)}`,
            html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a; line-height: 1.5;">
                    <div style="background: #000; padding: 40px; text-align: center; border-radius: 20px 20px 0 0;">
                        <h1 style="color: white; font-size: 28px; font-weight: 800; margin: 0; letter-spacing: -0.02em;">Banolite</h1>
                        <p style="color: #888; font-size: 14px; margin-top: 10px;">Order Confirmed • Receipt #${data.orderId.slice(0, 8)}</p>
                    </div>
                    <div style="background: white; padding: 40px; border: 1px solid #eee; border-top: none;">
                        <p style="font-size: 16px; margin-bottom: 24px;">Hi ${data.buyerName},</p>
                        <p style="font-size: 16px; color: #444; margin-bottom: 32px;">Your order has been successfully processed! Below is your itemized receipt.</p>
                        
                        ${additionalInfoHtml}

                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
                            <thead>
                                <tr style="background: #f8f8f8;">
                                    <th style="padding: 12px 16px; text-align: left; font-size: 11px; text-transform: uppercase; color: #888; letter-spacing: 0.05em;">Item</th>
                                    <th style="padding: 12px 16px; text-align: center; font-size: 11px; text-transform: uppercase; color: #888; letter-spacing: 0.05em;">Qty</th>
                                    <th style="padding: 12px 16px; text-align: right; font-size: 11px; text-transform: uppercase; color: #888; letter-spacing: 0.05em;">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>₦{itemsHtml}</tbody>
                        </table>

                        <div style="text-align: right; margin-top: 32px; padding-top: 24px; border-top: 2px solid #000;">
                            <p style="font-size: 11px; color: #888; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 0.05em;">Total Paid</p>
                            <p style="font-size: 36px; font-weight: 800; margin: 0; color: #000;">₦${data.total.toFixed(2)}</p>
                        </div>

                        <div style="margin-top: 48px; text-align: center;">
                            <a href="https://banolite.vercel.app/library" style="background: #000; color: white; padding: 16px 32px; border-radius: 12px; font-weight: 700; text-decoration: none; display: inline-block;">Access Your Library</a>
                            <p style="font-size: 12px; color: #888; margin-top: 20px;">Reference: ${data.orderId}</p>
                        </div>
                    </div>
                    <div style="padding: 32px; text-align: center; color: #888; font-size: 12px;">
                        <p>© ${new Date().getFullYear()} Banolite. All rights reserved.</p>
                        <p>If you have any questions, reply to this email.</p>
                    </div>
                </div>
            `,
        });
        if (error) console.error('Resend order receipt error:', error);
        return result;
    } catch (err) {
        console.error('Failed to send order receipt:', err);
    }
}

export async function sendSellerSaleNotification(data: SaleEmailData) {
    try {
        const { data: result, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: data.sellerEmail,
            subject: `🎉 You made a sale on Banolite!`,
            html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a; line-height: 1.5;">
                    <div style="background: #000; padding: 40px; text-align: center; border-radius: 20px 20px 0 0;">
                        <h1 style="color: white; font-size: 28px; font-weight: 800; margin: 0; letter-spacing: -0.02em;">Cha-ching! 💸</h1>
                        <p style="color: #888; font-size: 14px; margin-top: 10px;">New Sale Notification</p>
                    </div>
                    <div style="background: white; padding: 40px; border: 1px solid #eee; border-top: none; border-radius: 0 0 20px 20px;">
                        <p style="font-size: 18px; font-weight: 600; margin-bottom: 16px;">Hey ${data.sellerName},</p>
                        <p style="font-size: 16px; color: #444; margin-bottom: 32px;">You've just made a sale! <strong>${data.buyerName}</strong> purchased your product.</p>
                        
                        <div style="background: #f8f8f8; border: 1px solid #eee; border-radius: 16px; padding: 24px; margin-bottom: 32px; text-align: center;">
                            <p style="margin: 0 0 8px 0; font-size: 14px; color: #888; text-transform: uppercase; letter-spacing: 0.05em;">Product</p>
                            <p style="margin: 0 0 20px 0; font-size: 20px; font-weight: 700; color: #000;">${data.productTitle}</p>
                            <p style="margin: 0; font-size: 32px; font-weight: 800; color: #22c55e;">+₦${data.amount.toFixed(2)}</p>
                        </div>

                        <div style="text-align: center; margin-top: 40px;">
                            <a href="https://banolite.vercel.app/dashboard/seller" style="background: #000; color: white; padding: 16px 32px; border-radius: 12px; font-weight: 700; text-decoration: none; display: inline-block;">View Seller Dashboard</a>
                        </div>
                    </div>
                    <div style="padding: 32px; text-align: center; color: #888; font-size: 12px;">
                        <p>© ${new Date().getFullYear()} Banolite. Empowering Digital Creators.</p>
                    </div>
                </div>
            `,
        });
        if (error) console.error('Resend seller notification error:', error);
        return result;
    } catch (err) {
        console.error('Failed to send seller notification:', err);
    }
}
