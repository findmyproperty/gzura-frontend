import { Metadata } from 'next';
import Link from 'next/link';
import { HelpCircle } from 'lucide-react';
import PageHero from '@/components/layout/PageHero';
import FaqAccordion from '@/components/sections/FaqAccordion';

export const metadata: Metadata = {
  title: 'FAQ | GZURA',
  description:
    'Answers about GZURA membership, leadership and entrepreneurship programs, events, hosting, and accounts.',
};

const faqGroups = [
  {
    title: 'Membership',
    items: [
      {
        question: 'How do I join the GZURA community?',
        answer:
          'Visit the Join Community page, share a few details about yourself, and create an account. Basic membership is free and includes monthly webinars, newsletter updates, community forum access, and event invitations.',
      },
      {
        question: 'What is included in Premium and Executive plans?',
        answer:
          'Premium ($49/mo) adds priority event registration, mentorship matching, program discounts, exclusive resources, and direct support. Executive ($199/mo) includes all Premium benefits plus 1-on-1 executive coaching, VIP event access, a personalized development plan, exclusive networking, and unlimited program access.',
      },
      {
        question: 'Can I change or cancel my plan later?',
        answer:
          'Yes. You can update membership from your account or by contacting teamgzura@gmail.com. Basic access remains available if you leave a paid plan.',
      },
    ],
  },
  {
    title: 'Programs',
    items: [
      {
        question: 'What programs does GZURA offer?',
        answer:
          'Our core offerings are the 12-week Leadership Development Program, 16-week Entrepreneurship Incubator, 6-month Mentorship Network, and 8-week Success Accelerator, plus workshops, executive coaching, and community events.',
      },
      {
        question: 'Are programs online, in person, or hybrid?',
        answer:
          'Formats vary. Leadership Development is hybrid, the Incubator is in-person with mentorship, Mentorship Network combines virtual and in-person meetings, and the Success Accelerator is an intensive mix of in-person and virtual sessions.',
      },
      {
        question: 'Do you guarantee career or funding outcomes?',
        answer:
          'No. Programs are designed to build skills, networks, and confidence. Alumni stories and impact figures on our site reflect real community experience, not a promise of the same result for every participant.',
      },
    ],
  },
  {
    title: 'Events & hosting',
    items: [
      {
        question: 'How do I register for an event?',
        answer:
          'Browse Events, open the event you want, and complete registration. Members may receive priority access depending on their plan. After registering you may receive a digital pass for check-in.',
      },
      {
        question: 'Can I host a course on GZURA?',
        answer:
          'Yes. Use Host a Course on the homepage to submit your course. Approved hosts can manage sessions from the host dashboard. Course details must be accurate and sessions should follow our community standards.',
      },
    ],
  },
  {
    title: 'Account & support',
    items: [
      {
        question: 'I already have an account. Where do I sign in?',
        answer:
          'Use Login in the header. Members go to the home dashboard; hosts and admins use the admin area. Google sign-in is available where offered.',
      },
      {
        question: 'How do I contact GZURA?',
        answer:
          'Email teamgzura@gmail.com, call 6360685656 (Monday–Friday, 9:00 AM–6:00 PM EST), or send a message on the Contact page. For privacy or terms questions, see those pages in the footer.',
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <PageHero
        badge="Support"
        badgeIcon={HelpCircle}
        title="Frequently Asked"
        titleAccent="Questions"
        description="Answers about GZURA membership, programs, events, and accounts. Still need help? Contact our team."
      />

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <FaqAccordion groups={faqGroups} />

            <div className="mt-12 bg-gray-50 rounded-2xl p-8 border border-gray-100 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Didn&apos;t find what you need?
              </h2>
              <p className="text-gray-600 mb-6">
                Our team is happy to help with membership, programs, or events.
              </p>
              <Link href="/contact" className="btn-primary inline-flex">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
