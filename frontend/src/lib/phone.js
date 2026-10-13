/**
 * Uzbek phone numbers: +998 followed by 9 digits (operator code + number).
 * The input holds the local part ("90 123-45-67") next to a fixed "+998"
 * prefix; orders carry the normalized form "+998901234567".
 */

const PREFIX = '+998';
const LOCAL_LENGTH = 9;

/** Extracts up to 9 local digits from any user input, pasted numbers included. */
export function toLocalDigits(value) {
  let digits = String(value ?? '').replace(/\D/g, '');
  if (digits.startsWith('998') && digits.length > LOCAL_LENGTH) {
    digits = digits.slice(3);
  }
  return digits.slice(0, LOCAL_LENGTH);
}

/** "901234567" -> "90 123-45-67", formatting partial input progressively. */
export function formatLocal(digits) {
  const parts = [digits.slice(0, 2), digits.slice(2, 5), digits.slice(5, 7), digits.slice(7, 9)];
  let out = parts[0];
  if (parts[1]) out += ` ${parts[1]}`;
  if (parts[2]) out += `-${parts[2]}`;
  if (parts[3]) out += `-${parts[3]}`;
  return out;
}

/**
 * Next value for the phone field. When the user deletes only a formatting
 * character (space or dash), the digit before it goes too, so the caret
 * never gets stuck on punctuation.
 */
export function nextPhoneValue(previous, raw) {
  const prevDigits = toLocalDigits(previous);
  let digits = toLocalDigits(raw);
  if (raw.length < previous.length && digits === prevDigits) digits = digits.slice(0, -1);
  return formatLocal(digits);
}

/** Returns "+998XXXXXXXXX" for a complete number, otherwise null. */
export function normalizePhone(value) {
  const digits = toLocalDigits(value);
  return digits.length === LOCAL_LENGTH ? `${PREFIX}${digits}` : null;
}

/** "+998901234567" -> "+998 90 123-45-67". */
export function formatPhone(value) {
  return `${PREFIX} ${formatLocal(toLocalDigits(value))}`;
}
