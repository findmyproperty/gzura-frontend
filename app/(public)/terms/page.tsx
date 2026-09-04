import { Metadata } from 'next';
import { FileText } from 'lucide-react';
import PageHero from '@/components/layout/PageHero';
import LegalContent from '@/components/layout/LegalContent';

export const metadata: Metadata = {
  title: 'Terms of Service | GZURA',
  description:
    'The terms that govern use of GZURA’s website, community membership, programs, events, and related services.',
};

export default function TermsPage() {
  return (
    <>
      <PageHero
        badge="Agreement"
        badgeIcon={FileText}
        title="Terms of"
        titleAccent="Service"
        description="The rules for using GZURA’s website, community, programs, events, and member services."
      />
      <LegalContent
        lastUpdated="September 4, 2026"
        intro="These Terms of Service (“Terms”) govern your access to GZURA’s website and services, including community membership, leadership and entrepreneurship programs, mentorship, workshops, in-person and online event registration, virtual meeting attendance, course hosting, and member or host dashboards. By creating an account, joining the community, or using our site, you agree to these Terms."
        sections={[
          {
            heading: '1. Who may use GZURA',
            paragraphs: [
              'You must be at least 16 years old and able to form a binding contract. If you use GZURA on behalf of an organization, you confirm that you have authority to bind that organization to these Terms.',
            ],
          },
          {
            heading: '2. Accounts and membership',
            paragraphs: [
              'You are responsible for the accuracy of your account information and for keeping your login credentials confidential. Membership plans currently include Basic (free), Premium, and Executive tiers, with benefits described on the Join Community page. We may change plan features or pricing with reasonable notice.',
              'Community access, program discounts, mentorship matching, and event priority are privileges of the applicable plan and may be suspended if these Terms are violated.',
            ],
          },
          {
            heading: '3. In-person & Online Events and Virtual Sessions',
            paragraphs: [
              'GZURA hosts both offline (in-person) and online virtual events, workshops, and courses. Event registration is subject to availability, eligibility, and any stated ticket fees.',
              'For online events hosted via Google Meet or other integrated virtual conferencing platforms, access to the meeting room is strictly governed by our platform enrollment gate. Only authenticated attendees with a confirmed registration, authorized administrators, and assigned session hosts are granted access.',
              'Digital event passes, check-in QR codes, and meeting URLs are non-transferable and strictly intended for the registered attendee only.',
            ],
          },
          {
            heading: '4. Virtual Attendance Tracking & Certification',
            paragraphs: [
              'To verify participation and grant verified certificates of completion, GZURA monitors online session attendance via platform heartbeat pings and Google Meet conference logs. Total time spent in the session determines your final attendance status (Present, Partial, or Absent).',
              'Certificates are issued only to attendees who satisfy the minimum attendance duration criteria defined for the event.',
            ],
          },
          {
            heading: '5. Host and Instructor Responsibilities',
            paragraphs: [
              'Instructors and hosts are responsible for preparing their course curriculum, starting virtual sessions promptly, and conducting sessions in a professional, respectful manner aligned with our community values.',
              'Hosts are assigned to specific events and may only access the host controls and start sessions for events they have been officially assigned to manage.',
            ],
          },
          {
            heading: '6. Payments, Cancellations, and Refunds',
            paragraphs: [
              'Paid memberships, programs, and events generate digital invoices in your member dashboard. Fees are processed via secure payment gateways (such as Razorpay) and are due upon registration.',
              'Unless a specific program policy explicitly states otherwise, ticket fees are non-refundable once an event has commenced or after digital access passes have been issued.',
            ],
          },
          {
            heading: '7. Acceptable Use and Community Standards',
            paragraphs: ['When participating in GZURA events and using our platform, you agree not to:'],
            bullets: [
              'Share your account credentials, event pass, or meeting links with unauthorized third parties.',
              'Disrupt, harass, discriminate against, or record other attendees, hosts, mentors, or staff without explicit consent.',
              'Misrepresent your identity, credentials, or affiliations.',
              'Attempt to bypass registration gates, scrape platform data, or tamper with attendance tracking systems.',
              'Attempt unauthorized access to administrator, host, or other member dashboard areas.',
            ],
            after:
              'Violations of these standards may lead to immediate suspension or termination of your account and revocation of event privileges.',
          },
          {
            heading: '8. Intellectual Property',
            paragraphs: [
              'All platform branding, software, logos, program curricula, and materials provided by GZURA are protected under copyright and intellectual property laws. You may use them solely for personal, non-commercial educational purposes.',
            ],
          },
          {
            heading: '9. Disclaimers and Limitation of Liability',
            paragraphs: [
              'GZURA educational programs and mentorship sessions are provided for personal and professional development. GZURA does not guarantee specific career placement, funding, or commercial success.',
              'Services are provided on an “as is” and “as available” basis. While we strive for 99.9% uptime, we are not liable for third-party service outages including internet failures or Google Meet disruptions.',
              'To the fullest extent permitted by law, GZURA’s total liability for any claim arising from these Terms or your participation in events is limited to the amounts paid by you to GZURA in the preceding 12 months.',
            ],
          },
          {
            heading: '10. Changes and Termination',
            paragraphs: [
              'We may periodically update these Terms to reflect service enhancements and regulatory changes. Continued use of GZURA after revisions signifies your acceptance of the updated Terms.',
            ],
          },
        ]}
        contactNote="Questions about these Terms, event registration, or virtual session policies can be sent to our team."
      />
    </>
  );
}
