import { Metadata } from 'next';
import { Shield } from 'lucide-react';
import PageHero from '@/components/layout/PageHero';
import LegalContent from '@/components/layout/LegalContent';

export const metadata: Metadata = {
  title: 'Privacy Policy | GZURA',
  description:
    'Learn how GZURA collects, uses, and protects personal information for community members, event attendees, and program participants.',
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        badge="Your Data"
        badgeIcon={Shield}
        title="Privacy"
        titleAccent="Policy"
        description="How GZURA collects, uses, and protects information when you join our community, register for events, or take part in our programs."
      />
      <LegalContent
        lastUpdated="August 14, 2026"
        intro="GZURA is a platform dedicated to leadership development, entrepreneurship training, mentorship, and community building. This Privacy Policy explains how we handle personal information when you visit gzura.com, create an account, join the community, register for events, host a course, or contact us."
        sections={[
          {
            heading: '1. Who we are',
            paragraphs: [
              'GZURA (“we”, “us”, or “our”) operates this website and related member, host, and admin services. For privacy questions, contact teamgzura@gmail.com or call 6360685656 during office hours (Monday–Friday, 9:00 AM–6:00 PM EST).',
            ],
          },
          {
            heading: '2. Information we collect',
            paragraphs: [
              'We collect information you provide and information generated when you use our services:',
            ],
            bullets: [
              'Account and profile details: name, email, phone number, password, city, country, profession, and interests such as leadership, entrepreneurship, mentorship, or career growth.',
              'Community and membership data: plan selection (Basic, Premium, or Executive), newsletter preferences, and how you heard about GZURA.',
              'Event and program activity: event registrations, attendance, digital pass information, course hosting details, invoices, and learning progress.',
              'Communications: messages sent through our contact form or email, including your name, email, and inquiry.',
              'Authentication data: session cookies (including gzura_token) and optional Google sign-in credentials used to keep you logged in.',
            ],
          },
          {
            heading: '3. How we use your information',
            paragraphs: ['We use personal information to:'],
            bullets: [
              'Create and manage your GZURA account, member dashboard, and onboarding.',
              'Deliver programs, workshops, mentorship matching, and community events.',
              'Process event registrations, host applications, invoices, and related confirmations.',
              'Send service messages and, if you opt in, newsletters with updates and insights.',
              'Respond to support requests and improve the safety and quality of our platform.',
            ],
          },
          {
            heading: '4. Sharing of information',
            paragraphs: [
              'We do not sell your personal information. We may share it with trusted service providers who help us run authentication, email, payments, and video sessions for events, and only as needed to operate GZURA. We may also share information if required by law or to protect our community.',
            ],
          },
          {
            heading: '5. Cookies and similar technologies',
            paragraphs: [
              'We use cookies to keep you signed in, remember preferences, and understand how the site is used. You can learn more in our Cookie Policy. You may control cookies through your browser, but disabling essential cookies can prevent login and member features from working.',
            ],
          },
          {
            heading: '6. Data retention and security',
            paragraphs: [
              'We keep account, registration, and invoice records for as long as needed to provide services and meet legal obligations. We use reasonable administrative and technical safeguards to protect your information, including encrypted sessions for signed-in users.',
            ],
          },
          {
            heading: '7. Your choices',
            paragraphs: [
              'You may update profile details from your account, unsubscribe from newsletters, or request access, correction, or deletion of personal information by emailing teamgzura@gmail.com. If you signed in with Google, you can disconnect that access through your Google account settings.',
            ],
          },
          {
            heading: '8. Children’s privacy',
            paragraphs: [
              'GZURA programs and membership are intended for adults. We do not knowingly collect personal information from children under 16.',
            ],
          },
          {
            heading: '9. Changes to this policy',
            paragraphs: [
              'We may update this Privacy Policy as our programs and platform evolve. The “Last updated” date at the top of this page reflects the latest version. Continued use of GZURA after changes means you accept the updated policy.',
            ],
          },
        ]}
        contactNote="If you have questions about this Privacy Policy or how GZURA handles your information, reach out to our team."
      />
    </>
  );
}
