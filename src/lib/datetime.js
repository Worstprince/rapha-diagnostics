
export const CLINIC_TIME_ZONE = "Asia/Manila";
export const CLINIC_LOCALE = "en-PH";


export function toDate(value) {

    if (value === null || value === undefined || value === "") {
        return null;
    }

    const date = value instanceof Date ? value : new Date(value);

    return Number.isNaN(date.getTime()) ? null : date;

}


function formatter(options) {

    return new Intl.DateTimeFormat(CLINIC_LOCALE, {
        timeZone: CLINIC_TIME_ZONE,
        ...options
    });

}


export function formatDate(value, options = {}) {

    const date = toDate(value);
    if (!date) return "";

    return formatter({
        day: "numeric",
        month: "short",
        year: "numeric",
        ...options
    }).format(date);

}


export function formatTime(value, options = {}) {

    const date = toDate(value);
    if (!date) return "";

    return formatter({
        hour: "numeric",
        minute: "2-digit",
        ...options
    }).format(date);

}


export function formatFull(value) {

    const date = toDate(value);
    if (!date) return "";

    return formatter({
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short"
    }).format(date);

}


const DAY_KEY = new Intl.DateTimeFormat("en-CA", {
    timeZone: CLINIC_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
});

export function clinicDayKey(value) {

    const date = toDate(value);
    return date ? DAY_KEY.format(date) : null;

}


export function clinicDayKeys(now = Date.now()) {

    return {
        today: clinicDayKey(now),
        yesterday: clinicDayKey(now - 86400000)
    };

}
