export function getSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL!
  return raw.replace(/\/$/, '');
}
