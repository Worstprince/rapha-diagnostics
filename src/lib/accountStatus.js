export const ACCOUNT_ACTIVE = 0;
export const ACCOUNT_ARCHIVED = 1;
export const ACCOUNT_LOCKED = 2;

const LABELS = {
    [ACCOUNT_ACTIVE]: "Active",
    [ACCOUNT_ARCHIVED]: "Archived",
    [ACCOUNT_LOCKED]: "Locked",
};

const TONES = {
    [ACCOUNT_ACTIVE]: "emerald",
    [ACCOUNT_ARCHIVED]: "neutral",
    [ACCOUNT_LOCKED]: "rose",
};

export function toStatus(value) {
    const n = Number(value);
    return n === ACCOUNT_ARCHIVED || n === ACCOUNT_LOCKED ? n : ACCOUNT_ACTIVE;
}

export function statusLabel(value) {
    return LABELS[toStatus(value)];
}

export function statusTone(value) {
    return TONES[toStatus(value)];
}

export function isArchived(value) {
    return toStatus(value) === ACCOUNT_ARCHIVED;
}

export function isLocked(value) {
    return toStatus(value) === ACCOUNT_LOCKED;
}

export function canSignIn(value) {
    return toStatus(value) === ACCOUNT_ACTIVE;
}
