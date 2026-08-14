import { Metadata } from 'next';
import Link from 'next/link';
import { Briefcase, Heart, Users, Globe } from 'lucide-react';
import PageHero from '@/components/layout/PageHero';

export const metadata: Metadata = {
  title: 'Careers | GZURA',
  description:
    'Join the GZURA team and help empower leaders and entrepreneurs through programs, mentorship, and community.',
};

const values = [
  {
    icon: Heart,
    title: 'People first',
    description: 'We build programs around the members we serve.',
  },
  {
    icon: Users,
    title: 'Inclusive by design',
    description: 'Every voice in our community should be heard and valued.',
  },
  {
    icon: Globe,
    title: 'Global impact',
    description: 'Our work connects leaders across countries and industries.',
  },
];

const openings = [
  {
    title: 'Program Coordinator',
    team: 'Programs',
    type: 'Full-time · Hybrid',
    summary:
      'Coordinate Leadership Development, Incubator, and Accelerator cohorts — from onboarding to session logistics and member follow-up.',
  },
  {
    title: 'Community Manager',
    team: 'Community',
    type: 'Full-time · Remote-friendly',
    summary:
      'Grow member engagement across events, forums, newsletters, and success-story storytelling with our 5,000+ member community.',
  },
  {
    title: 'Mentorship Lead',
    team: 'Mentorship',
    type: 'Full-time · Hybrid',
    summary:
      'Match mentors and mentees, support 1-on-1 sessions, and keep the Mentorship Network running with clear progress reviews.',
  },
  {
    title: 'Events Producer',
    team: 'Events',
    type: 'Contract · Hybrid',
    summary:
      'Produce workshops, mixers, and live sessions, including registration, host coordination, and on-site or virtual check-in.',
  },
];

export default function CareersPage() {
  return (
    <>
      <PageHero
        badge="Work With Us"
        badgeIcon={Briefcase}
        title="Careers at"
        titleAccent="GZURA"
        description="Help us empower men and women through leadership development, entrepreneurship training, and community building."
      />

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="heading-lg text-gray-900 mb-6">
              Build with a <span className="gradient-text">mission-focused</span> team
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Since 2020, GZURA has delivered 200+ programs across 50+ countries.
              We are looking for people who care about developing leaders,
              supporting founders, and running a thoughtful community.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-gray-50 rounded-2xl p-8 border border-gray-100"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-deep to-purple-700 flex items-center justify-center mb-5">
                  <value.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>

          <div className="max-w-4xl mx-auto">
            <h2 className="heading-md text-gray-900 mb-8 text-center">
              Open roles
            </h2>
            <div className="space-y-4">
              {openings.map((role) => (
                <div
                  key={role.title}
                  className="bg-white rounded-2xl p-6 md:p-8 shadow-lg shadow-purple-500/5 border border-gray-100"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <p className="text-purple-700 text-sm font-medium mb-1">
                        {role.team}
                      </p>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {role.title}
                      </h3>
                      <p className="text-gray-500 text-sm mt-1">{role.type}</p>
                      <p className="text-gray-600 mt-4 leading-relaxed">
                        {role.summary}
                      </p>
                    </div>
                    <Link
                      href="/contact"
                      className="shrink-0 text-sm font-semibold text-purple-700 hover:text-purple-900"
                    >
                      Apply via Contact →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-gray-50 rounded-2xl p-8 border border-gray-100 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Don&apos;t see the right role?
              </h3>
              <p className="text-gray-600 mb-6">
                We still want to hear from program facilitators, coaches, and
                operators who share our values. Send a note to{' '}
                <a
                  href="mailto:teamgzura@gmail.com"
                  className="text-purple-700 font-medium hover:underline"
                >
                  teamgzura@gmail.com
                </a>
                .
              </p>
              <Link href="/about" className="text-purple-700 font-medium hover:underline">
                Learn more about our team
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
