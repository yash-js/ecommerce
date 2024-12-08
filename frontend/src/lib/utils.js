/**
 * Format a number into a custom INR-like format
 * @param {number|string} amount - The number to be formatted
 * @returns {string} - Formatted number as per custom grouping
 */
export function formatINR(amount) {
    if (isNaN(amount)) {
        throw new Error("Invalid input: amount must be a number or numeric string");
    }

    const amountStr = amount.toString().replace('.', ''); // Remove decimals, treat as integer
    const len = amountStr.length;
    let formattedAmount = '';

    for (let i = 0; i < len; i++) {
        if (i > 0 && i % 2 === 0) {
            formattedAmount += ',';
        }
        formattedAmount += amountStr[i];
    }

    return formattedAmount;
}

