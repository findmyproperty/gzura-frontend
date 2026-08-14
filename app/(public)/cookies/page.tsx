import { Metadata } from 'next';
import { Cookie } from 'lucide-react';
import PageHero from '@/components/layout/PageHero';
import LegalContent from '@/components/layout/LegalContent';

export const metadata: Metadata = {
  title: 'Cookie Policy | GZURA',
  description:
    'How GZURA uses cookies and similar technologies to keep you signed in and improve the website experience.',
};

export default function CookiesPage() {
  return (
    <>
      <PageHero
        badge="Preferences"
        badgeIcon={Cookie}
        title="Cookie"
        titleAccent="Policy"
        description="How GZURA uses cookies to keep you signed in, remember preferences, and operate member and event features."
      />
      <LegalContent
        lastUpdated="August 14, 2026"
        intro="This Cookie Policy explains how GZURA uses cookies and similar technologies on our website. It should be read together with our Privacy Policy."
        sections={[
          {
            heading: '1. What are cookies?',
            paragraphs: [
              'Cookies are small text files stored on your device when you visit a website. They help the site remember you, keep sessions secure, and understand how pages are used.',
            ],
          },
          {
            heading: '2. Cookies we use',
            paragraphs: ['GZURA uses the following categories of cookies:'],
            bullets: [
              'Essential cookies: required for login, account sessions (including the gzura_token cookie), and protected member, host, and admin areas.',
              'Preference cookies: remember choices such as form state or interface settings where available.',
              'Analytics cookies: help us understand which public pages (such as Programs, Events, and Success Stories) are most useful so we can improve the site.',
            ],
            after:
              'Google sign-in and one-tap login may also set cookies from Google according to Google’s own policies when you choose those options.',
          },
          {
            heading: '3. How long cookies last',
            paragraphs: [
              'Session cookies expire when you close your browser. Authentication cookies remain until they expire or you log out, so you can return to your dashboard without signing in every time. You can delete cookies at any time through your browser settings.',
            ],
          },
          {
            heading: '4. Managing cookies',
            paragraphs: [
              'Most browsers let you block or delete cookies. If you block essential cookies, you may not be able to log in, register for events, access My Learnings, or use host tools. Analytics cookies can usually be refused without affecting core features.',
            ],
          },
          {
            heading: '5. Updates',
            paragraphs: [
              'We may update this Cookie Policy when we add features or change how the platform works. The “Last updated” date at the top of this page reflects the current version.',
            ],
          },
        ]}
        contactNote="For questions about cookies or your privacy choices, contact GZURA."
      />
    </>
  );
}
