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
        lastUpdated="September 4, 2026"
        intro="GZURA is a platform dedicated to leadership development, entrepreneurship training, mentorship, and community building. This Privacy Policy explains how we handle personal information when you visit gzura.com, create an account, join the community, register for in-person or online events, attend virtual Google Meet sessions, host a course, or contact us."
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
              'We collect information you provide directly as well as information generated automatically through platform usage:',
            ],
            bullets: [
              'Account and profile details: name, email, phone number, password, city, country, profession, and areas of interest.',
              'Community and membership data: plan tier selection (Basic, Premium, or Executive), newsletter subscriptions, and onboarding responses.',
              'Event and virtual session activity: event registrations, payment transactions, digital tickets, session join/leave telemetry, attendance duration logs, and issued certificates.',
              'Third-party integration data: Google sign-in profile information, Google Meet attendance logs, and payment identifiers from payment processors (Razorpay).',
              'Communications and inquiries: messages sent via contact forms, customer support inquiries, and feedback surveys.',
              'Technical and session identifiers: encrypted authentication cookies (including gzura_token), IP address, and browser metadata.',
            ],
          },
          {
            heading: '3. How we use your information',
            paragraphs: ['We process personal information to:'],
            bullets: [
              'Administer your GZURA member or host account, profile, and security credentials.',
              'Facilitate event enrollment, verify access at virtual meeting gates, and provide smooth Google Meet connectivity.',
              'Track virtual event attendance and compute participation duration to generate verified course completion certificates.',
              'Process transactions, generate official tax invoices, and maintain financial records.',
              'Send transactional updates, event reminders, digital passes, and, if opted in, community newsletters.',
              'Protect the platform against unauthorized access, fraud, and abusive conduct.',
            ],
          },
          {
            heading: '4. Third-Party Integrations and Data Sharing',
            paragraphs: [
              'We never sell your personal data. We disclose information strictly to trusted service partners necessary to provide our services:',
            ],
            bullets: [
              'Google Workspace & Google Meet: For scheduling calendar events, generating meeting rooms, and synchronizing attendee conference logs.',
              'Payment Processors (Razorpay): To safely process debit/credit card, UPI, and net-banking transactions (we do not store raw card credentials).',
              'Email Service Providers (Nodemailer / SMTP): For sending enrollment confirmations, digital tickets, invoices, and password reset tokens.',
              'Cloud & Infrastructure Providers: For secure data storage and operational continuity.',
              'Legal & Regulatory Authorities: Only when mandatory under applicable legal processes.',
            ],
          },
          {
            heading: '5. Cookies and Session Telemetry',
            paragraphs: [
              'We utilize cookies and session storage to keep you authenticated across page visits, remember preferences, and record keepalive heartbeat pings when you attend live online sessions. Disabling essential cookies may prevent login and meeting gate access.',
            ],
          },
          {
            heading: '6. Data Security and Retention',
            paragraphs: [
              'We employ industry-standard administrative, technical, and physical safeguards—including SSL/TLS data encryption in transit and hashed passwords—to safeguard your information.',
              'Account and registration histories are retained for as long as your account remains active or as required by statutory record-keeping and tax regulations.',
            ],
          },
          {
            heading: '7. Your Rights and Choices',
            paragraphs: [
              'You have the right to review, update, or request deletion of your personal data at any time. You can edit your profile directly in your account dashboard, unsubscribe from marketing communications, or contact us at teamgzura@gmail.com for data access or erasure requests.',
            ],
          },
          {
            heading: '8. Children’s Privacy',
            paragraphs: [
              'GZURA services and events are directed to adults and professionals. We do not knowingly collect personal information from individuals under the age of 16.',
            ],
          },
          {
            heading: '9. Updates to This Policy',
            paragraphs: [
              'We may periodically revise this Privacy Policy to reflect platform features, event formats, or regulatory requirements. The “Last updated” date indicates when the policy was last revised. Continued participation in GZURA events or services constitutes agreement to the current version.',
            ],
          },
        ]}
        contactNote="If you have questions about this Privacy Policy or how GZURA handles your personal information, reach out to our team."
      />
    </>
  );
}
