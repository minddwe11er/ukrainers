import { NextRequest, NextResponse } from 'next/server';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX = 3;
const rateMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = rateMap.get(ip);

    if (!entry || now > entry.resetAt) {
        rateMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
        return false;
    }

    entry.count++;
    return entry.count > RATE_LIMIT_MAX;
}

export async function POST(request: NextRequest) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
        || request.headers.get('x-real-ip')
        || 'unknown';

    if (isRateLimited(ip)) {
        return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
    }

    const body = await request.json();

    if (body.website) {
        return NextResponse.json({ success: true });
    }

    const email = body.email?.trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
    }

    const res = await fetch(`${STRAPI_URL}/api/subscribers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { email } }),
    });

    if (res.ok) {
        return NextResponse.json({ success: true });
    }

    const data = await res.json().catch(() => null);
    const strapiError = data?.error?.message ?? '';

    if (res.status === 400 && strapiError.includes('unique')) {
        return NextResponse.json({ error: 'already_subscribed' }, { status: 409 });
    }

    return NextResponse.json({ error: 'server_error' }, { status: 500 });
}
