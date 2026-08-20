export const MAX_ATTEMPTS = 5;
export const LOCK_MINUTES = 10;

const LOCK_MS = LOCK_MINUTES * 60 * 1000;

const tracker = new Map();

function prune(now) {
    for (const [id, entry] of tracker) {
        if (entry.until && entry.until <= now) {
            tracker.delete(id);
            continue;
        }
        if (!entry.until && now - entry.seen > LOCK_MS) {
            tracker.delete(id);
        }
    }
}

export function recordFailure(userId) {
    const now = Date.now();
    prune(now);

    const key = String(userId);
    const entry = tracker.get(key) ?? { count: 0, until: null, seen: now };

    entry.count += 1;
    entry.seen = now;

    const locked = entry.count >= MAX_ATTEMPTS;

    if (locked) {
        entry.until = now + LOCK_MS;
    }

    tracker.set(key, entry);

    return {
        count: entry.count,
        remaining: Math.max(0, MAX_ATTEMPTS - entry.count),
        locked,
        until: entry.until,
    };
}

export function lockState(userId) {
    const now = Date.now();
    const entry = tracker.get(String(userId));

    if (!entry || !entry.until || entry.until <= now) {
        return { locked: false, minutesLeft: 0 };
    }

    return {
        locked: true,
        minutesLeft: Math.max(1, Math.ceil((entry.until - now) / 60000)),
    };
}

export function clearAttempts(userId) {
    tracker.delete(String(userId));
}
