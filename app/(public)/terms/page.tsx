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
        lastUpdated="August 14, 2026"
        intro="These Terms of Service (“Terms”) govern your access to GZURA’s website and services, including community membership, leadership and entrepreneurship programs, mentorship, workshops, event registration, course hosting, and member or host dashboards. By creating an account, joining the community, or using our site, you agree to these Terms."
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
            heading: '3. Programs, events, and hosting',
            paragraphs: [
              'GZURA offers leadership development, entrepreneurship, mentorship, workshops, and related events. Program duration, format, and outcomes described on the Programs page are informational and may vary by cohort.',
              'Event registration is subject to availability, eligibility, and any stated fees. Digital passes and check-in tools are for the registered attendee only. If you host a course, you must provide accurate course details and conduct sessions in a professional, respectful manner consistent with our community values.',
            ],
          },
          {
            heading: '4. Payments and invoices',
            paragraphs: [
              'Paid memberships, programs, and events may generate invoices in your member account. Fees are due as stated at checkout or on the invoice. Unless a specific program policy says otherwise, fees are non-refundable after a program or event has begun.',
            ],
          },
          {
            heading: '5. Acceptable use',
            paragraphs: ['You agree not to:'],
            bullets: [
              'Share your account, event pass, or meeting links with others without permission.',
              'Harass, discriminate against, or disrupt other members, mentors, hosts, or staff.',
              'Misrepresent your identity, credentials, or course offerings.',
              'Copy, scrape, or commercially exploit GZURA content, member data, or program materials without written consent.',
              'Attempt to access admin, host, or member areas you are not authorized to use.',
            ],
            after:
              'We may suspend or terminate accounts that violate these rules to protect the community.',
          },
          {
            heading: '6. Intellectual property',
            paragraphs: [
              'GZURA, our logo, program materials, website content, and related branding are owned by GZURA or our licensors. You may use them only as needed to participate in our services. Content you submit (such as course descriptions, profile information, or success stories) may be used by GZURA to operate and promote the community, with attribution where appropriate.',
            ],
          },
          {
            heading: '7. Community standards',
            paragraphs: [
              'GZURA is built around people-centric, inclusive, and excellence-driven values. Members, mentors, and hosts are expected to treat one another with respect in events, video sessions, forums, and communications. We may remove content or revoke access that conflicts with those standards.',
            ],
          },
          {
            heading: '8. Disclaimers',
            paragraphs: [
              'Programs, mentorship, and events are educational and professional-development services. GZURA does not guarantee specific career outcomes, funding results, or business success. Testimonials and impact figures on the site reflect community experience and are not promises of similar results.',
              'The site is provided “as is.” We do not warrant uninterrupted availability of live sessions, dashboards, or third-party tools such as video meetings or sign-in services.',
            ],
          },
          {
            heading: '9. Limitation of liability',
            paragraphs: [
              'To the fullest extent permitted by law, GZURA is not liable for indirect, incidental, or consequential damages arising from your use of the site, programs, or events. Our total liability for any claim related to these Terms is limited to the amounts you paid to GZURA in the 12 months before the claim.',
            ],
          },
          {
            heading: '10. Changes and termination',
            paragraphs: [
              'We may update these Terms as our services change. The “Last updated” date shows the current version. You may stop using GZURA and request account closure at any time. We may end or limit access if you breach these Terms or if we discontinue a service.',
            ],
          },
        ]}
        contactNote="Questions about these Terms, membership, or a specific program or event can be sent to our team."
      />
    </>
  );
}
