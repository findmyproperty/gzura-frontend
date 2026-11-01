/** Client-side Indian phone helpers (mirrors backend phone.util). */

export function phoneDigits(phone: string): string {
  return phone.replace(/\D/g, '');
}

export function normalizeIndianPhone(phone: string): string {
  const trimmed = phone.trim();
  if (!trimmed) return '';

  const digits = phoneDigits(trimmed);
  if (digits.length < 10) return '';

  const last10 = digits.slice(-10);
  if (!/^[6-9]\d{9}$/.test(last10)) return '';

  return `+91${last10}`;
}

export function isValidIndianPhone(phone: string): boolean {
  if (!phone.trim()) return true; // optional
  return Boolean(normalizeIndianPhone(phone));
}
