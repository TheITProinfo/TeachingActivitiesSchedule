/**
 * Get full locale string
 * @param {string} locale - 'zh' or 'en'
 * @returns {string} 'zh-CN' or 'en-US'
 */
function getFullLocale(locale = 'zh') {
    return locale === 'en' ? 'en-US' : 'zh-CN';
}

/**
 * Format a date string to locale format
 * @param {string|Date} dateString - Date to format
 * @param {string} locale - 'zh' or 'en'
 * @returns {string} Formatted date string
 */
export function formatDate(dateString, locale = 'zh') {
    const date = new Date(dateString);
    return date.toLocaleDateString(getFullLocale(locale), {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

/**
 * Format a date and time string to locale format
 * @param {string|Date} dateString - Date to format
 * @param {string} locale - 'zh' or 'en'
 * @returns {string} Formatted date and time string
 */
export function formatDateTime(dateString, locale = 'zh') {
    const date = new Date(dateString);
    return date.toLocaleString(getFullLocale(locale), {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Format time range for display
 * @param {string|Date} startTime - Start time
 * @param {string|Date} endTime - End time
 * @param {string} locale - 'zh' or 'en'
 * @returns {string} Formatted time range
 */
export function formatTimeRange(startTime, endTime, locale = 'zh') {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const fullLocale = getFullLocale(locale);

    const startStr = start.toLocaleString(fullLocale, {
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    const endStr = end.toLocaleTimeString(fullLocale, {
        hour: '2-digit',
        minute: '2-digit',
    });

    return `${startStr} - ${endStr}`;
}

/**
 * Convert date to ISO string for input fields
 * @param {string|Date} dateString - Date to convert
 * @returns {string} ISO date string (YYYY-MM-DD)
 */
export function toInputDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}

/**
 * Convert datetime to ISO string for datetime-local input fields
 * @param {string|Date} dateString - Date to convert
 * @returns {string} ISO datetime string (YYYY-MM-DDTHH:mm)
 */
export function toInputDateTime(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}
