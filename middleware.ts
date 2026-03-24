import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import {
    getClientIdentifier,
    getConfigForPath,
    checkRateLimit,
    rateLimitExceededResponse,
    applyRateLimitHeaders,
} from './lib/rateLimit';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // ─── HTTPS Enforcement (production only) ──────────────────────
    if (process.env.NODE_ENV === 'production') {
        const proto = request.headers.get('x-forwarded-proto');
        if (proto && proto !== 'https') {
            const httpsUrl = request.nextUrl.clone();
            httpsUrl.protocol = 'https';
            return NextResponse.redirect(httpsUrl, 301);
        }
    }

    // ─── Rate Limiting (API routes only) ──────────────────────────
    if (pathname.startsWith('/api/')) {
        const identifier = getClientIdentifier(request);
        const config = getConfigForPath(pathname);
        const result = checkRateLimit(identifier, config);

        if (!result.allowed) {
            return rateLimitExceededResponse(result);
        }
    }

    // ─── Supabase Auth Session Refresh ────────────────────────────
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // Refresh the auth token
    const { data: { user } } = await supabase.auth.getUser();

    // ─── Protected Routes ─────────────────────────────────────────
    const protectedPaths = ['/dashboard/seller', '/dashboard/admin', '/library'];
    const isProtected = protectedPaths.some(path => pathname.startsWith(path));

    if (isProtected && !user) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = '/';
        redirectUrl.searchParams.set('auth', 'required');
        return NextResponse.redirect(redirectUrl);
    }

    // ─── Admin-Only Route ─────────────────────────────────────────
    if (pathname.startsWith('/dashboard/admin') && user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
        if (profile?.role !== 'admin') {
            const redirectUrl = request.nextUrl.clone();
            redirectUrl.pathname = '/';
            return NextResponse.redirect(redirectUrl);
        }
    }

    // ─── Security Headers ─────────────────────────────────────────
    supabaseResponse.headers.set('X-Content-Type-Options', 'nosniff');
    supabaseResponse.headers.set('X-Frame-Options', 'DENY');
    supabaseResponse.headers.set('X-XSS-Protection', '1; mode=block');
    supabaseResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    if (process.env.NODE_ENV === 'production') {
        supabaseResponse.headers.set(
            'Strict-Transport-Security',
            'max-age=63072000; includeSubDomains; preload'
        );
    }

    // Apply rate limit headers to API responses
    if (pathname.startsWith('/api/')) {
        const identifier = getClientIdentifier(request);
        const config = getConfigForPath(pathname);
        const result = checkRateLimit(identifier, config);
        applyRateLimitHeaders(supabaseResponse, result);
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/library/:path*',
        '/api/:path*',
    ],
};
