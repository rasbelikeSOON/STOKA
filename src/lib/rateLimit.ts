// Simple in-memory rate limiter for serverless environments.
// Note: In Vercel, this state resets per-lambda cold start, 
// but it's sufficient for basic abuse prevention in an MVP.
// For production scale, use Redis (e.g., Upstash KV).

type RateRecord = {
    count: number;
    resetAt: number;
}

const rateLimitMap = new Map<string, RateRecord>();

export function rateLimit(identifier: string, limit: number, windowMs: number) {
    const now = Date.now();
    let record = rateLimitMap.get(identifier);

    if (!record || now > record.resetAt) {
        record = { count: 1, resetAt: now + windowMs };
        rateLimitMap.set(identifier, record);
        return { success: true, remaining: limit - 1, reset: record.resetAt };
    }

    if (record.count >= limit) {
        return { success: false, remaining: 0, reset: record.resetAt };
    }

    record.count += 1;
    rateLimitMap.set(identifier, record);
    return { success: true, remaining: limit - record.count, reset: record.resetAt };
}
