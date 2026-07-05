export function isFreeEventPrice(price: string | number | null | undefined): boolean {
  const value = Number(price);
  return !Number.isFinite(value) || value <= 0;
}

export function formatEventPrice(price: string | number | null | undefined): string {
  if (isFreeEventPrice(price)) {
    return 'Free';
  }

  return `₹${Number(price).toLocaleString('en-IN')}`;
}

export function parseEventPrice(value: string): number {
  const price = Number(value);
  return Number.isFinite(price) && price >= 0 ? price : 0;
}