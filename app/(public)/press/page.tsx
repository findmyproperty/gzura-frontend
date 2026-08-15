import { Metadata } from 'next';
import Link from 'next/link';
import { Newspaper } from 'lucide-react';
import PageHero from '@/components/layout/PageHero';

export const metadata: Metadata = {
  title: 'Press | GZURA',
  description:
    'Media resources and facts about GZURA, a community for leadership development, entrepreneurship, and mentorship.',
};

const facts = [
  { label: 'Founded', value: '2020' },
  { label: 'Active members', value: '5,000+' },
  { label: 'Countries', value: '50+' },
  { label: 'Programs delivered', value: '200+' },
  { label: 'Raised by alumni', value: '$15M+' },
];

const leadership = [
  { name: 'Dr. Angela Okonkwo', role: 'Founder & CEO' },
  { name: 'Michael Chen', role: 'Chief Program Officer' },
  { name: 'Priya Sharma', role: 'Director of Community' },
  { name: 'James Williams', role: 'Head of Mentorship' },
];

export default function PressPage() {
  return (
    <>
      <PageHero
        badge="Media"
        badgeIcon={Newspaper}
        title="Press &"
        titleAccent="Media"
        description="Facts, boilerplate, and contacts for journalists covering GZURA’s work in leadership, entrepreneurship, and community building."
      />

      <section className="section-padding bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <div>
                <h2 className="heading-md text-gray-900 mb-4">Boilerplate</h2>
                <p className="text-gray-600 leading-relaxed">
                  GZURA is a community dedicated to empowering men and women
                  through leadership development, entrepreneurship training,
                  mentorship, and networking. Founded in 2020, GZURA delivers
                  hybrid and in-person programs — including a Leadership
                  Development Program, Entrepreneurship Incubator, Mentorship
                  Network, and Success Accelerator — alongside workshops and
                  community events. The organization serves 5,000+ members
                  across 50+ countries and exists to help ambitious
                  professionals turn potential into lasting impact.
                </p>
              </div>

              <div>
                <h2 className="heading-md text-gray-900 mb-6">Key facts</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {facts.map((fact) => (
                    <div
                      key={fact.label}
                      className="rounded-2xl border border-gray-100 bg-gray-50 p-6"
                    >
                      <p className="text-sm text-gray-500 mb-1">{fact.label}</p>
                      <p className="text-2xl font-bold text-purple-deep">
                        {fact.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="heading-md text-gray-900 mb-6">Leadership</h2>
                <ul className="space-y-4">
                  {leadership.map((person) => (
                    <li
                      key={person.name}
                      className="flex flex-col sm:flex-row sm:items-baseline sm:gap-4 border-b border-gray-100 pb-4"
                    >
                      <span className="font-semibold text-gray-900">
                        {person.name}
                      </span>
                      <span className="text-gray-600">{person.role}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/about#team"
                  className="inline-block mt-4 text-purple-700 font-medium hover:underline"
                >
                  View team bios
                </Link>
              </div>
            </div>

            <aside>
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 lg:sticky lg:top-28">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Media inquiries
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  For interviews, speaking requests, or brand assets, contact
                  the GZURA team. We typically respond within two business days.
                </p>
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <a
                  href="mailto:teamgzura@gmail.com"
                  className="text-purple-700 font-medium hover:underline"
                >
                  teamgzura@gmail.com
                </a>
                <p className="text-sm text-gray-500 mt-4 mb-1">Phone</p>
                <a
                  href="tel:6360685656"
                  className="text-purple-700 font-medium hover:underline"
                >
                  6360685656
                </a>
                <p className="text-sm text-gray-500 mt-4">
                  Monday–Friday, 9:00 AM–6:00 PM EST
                </p>
                <Link href="/contact" className="btn-primary inline-flex mt-8">
                  Contact Us
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
