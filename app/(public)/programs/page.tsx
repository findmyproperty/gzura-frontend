import { Metadata } from 'next';
import Link from 'next/link';
import {
  GraduationCap,
  Briefcase,
  Users2,
  Trophy,
  BookOpen,
  Target,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Programs & Services | GZURA',
  description:
    'Explore GZURA\'s comprehensive programs for leadership development, entrepreneurship, mentorship, and business growth.',
};

const programs = [
  {
    id: 'leadership',
    icon: GraduationCap,
    title: 'Leadership Development Program',
    subtitle: 'Transform Your Leadership Potential',
    description:
      'Our flagship program designed to cultivate the essential skills, mindset, and strategies needed to lead effectively in any context.',
    duration: '12 weeks',
    format: 'Hybrid (Online + In-person)',
    features: [
      'Executive presence and communication',
      'Strategic thinking and decision-making',
      'Team leadership and motivation',
      'Change management',
      'Personal branding',
      'Public speaking mastery',
    ],
    outcomes: [
      'Master essential leadership competencies',
      'Build confidence in executive settings',
      'Develop your unique leadership style',
      'Network with senior leaders',
    ],
    color: 'from-purple-500 to-purple-700',
    image: 'https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'entrepreneurship',
    icon: Briefcase,
    title: 'Entrepreneurship Incubator',
    subtitle: 'From Idea to Market-Ready Venture',
    description:
      'A comprehensive program that guides aspiring entrepreneurs through every stage of building a successful business.',
    duration: '16 weeks',
    format: 'In-person + Mentorship',
    features: [
      'Business model development',
      'Market research and validation',
      'Financial planning and funding',
      'Product development',
      'Marketing and sales strategy',
      'Pitch preparation',
    ],
    outcomes: [
      'Launch your business or MVP',
      'Connect with potential investors',
      'Develop entrepreneurial mindset',
      'Join a cohort of founders',
    ],
    color: 'from-gold-500 to-gold-600',
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'mentorship',
    icon: Users2,
    title: 'Mentorship Network',
    subtitle: 'Guided Growth Through Expert Connections',
    description:
      'Connect with experienced mentors who provide personalized guidance, accountability, and industry insights.',
    duration: '6 months',
    format: 'Virtual + In-person meetings',
    features: [
      'Personalized mentor matching',
      '1-on-1 mentorship sessions',
      'Industry-specific guidance',
      'Career path planning',
      'Network introductions',
      'Monthly progress reviews',
    ],
    outcomes: [
      'Accelerate your career growth',
      'Navigate career transitions',
      'Build lasting professional relationships',
      'Gain insider industry knowledge',
    ],
    color: 'from-purple-600 to-purple-800',
    image: 'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'accelerator',
    icon: Trophy,
    title: 'Success Accelerator',
    subtitle: 'Intensive Growth for High Performers',
    description:
      'An intensive program for professionals ready to break through to the next level of achievement.',
    duration: '8 weeks',
    format: 'Intensive in-person + Virtual',
    features: [
      'Goal setting and achievement',
      'Performance optimization',
      'High-stakes communication',
      'Executive coaching',
      'Personal accountability systems',
      'Visibility and influence building',
    ],
    outcomes: [
      'Achieve ambitious career goals',
      'Increase visibility and influence',
      'Develop high-performance habits',
      'Build strategic relationships',
    ],
    color: 'from-gold-400 to-gold-500',
    image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

const additionalServices = [
  {
    icon: BookOpen,
    title: 'Workshops & Webinars',
    description:
      'Regular sessions on trending topics, skills, and industry insights.',
    href: '/events',
  },
  {
    icon: Target,
    title: 'Executive Coaching',
    description: 'Personalized 1-on-1 coaching for senior professionals.',
    href: '/contact',
  },
  {
    icon: Users2,
    title: 'Community Events',
    description: 'Networking mixers, conferences, and community gatherings.',
    href: '/events',
  },
];

export default function ProgramsPage() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-bg pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRoLTJ2Mmgydi0yem0tMTAgMGgtMnYyaDJ2LTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] bg-repeat" />
        </div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <span className="text-gold-400 text-sm font-semibold">
                Programs & Services
              </span>
            </div>
            <h1 className="heading-xl text-white mb-6">
              Programs Designed for{' '}
              <span className="text-gold-400">Your Success</span>
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              Comprehensive programs and services designed to develop leaders,
              build entrepreneurs, and accelerate careers.
            </p>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="space-y-24">
            {programs.map((program, index) => (
              <div
                key={program.id}
                id={program.id}
                className={`grid lg:grid-cols-2 gap-16 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="inline-flex items-center gap-2 bg-purple-100 rounded-full px-4 py-2 mb-6">
                    <program.icon className="w-4 h-4 text-purple-700" />
                    <span className="text-purple-700 text-sm font-semibold">
                      {program.duration} Program
                    </span>
                  </div>

                  <h2 className="heading-lg text-gray-900 mb-4">
                    {program.title}
                  </h2>
                  <p className="text-purple-700 font-medium mb-4">
                    {program.subtitle}
                  </p>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    {program.description}
                  </p>

                  <div className="grid sm:grid-cols-2 gap-4 mb-8">
                    {program.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-start gap-2 text-gray-700"
                      >
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link href="/join">
                    <button className="btn-primary group">
                      Apply Now
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform inline" />
                    </button>
                  </Link>
                </div>

                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/20">
                    <img
                      src={program.image}
                      alt={program.title}
                      className="w-full aspect-[4/3] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-deep/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex flex-wrap gap-2">
                        {program.outcomes.map((outcome) => (
                          <span
                            key={outcome}
                            className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full"
                          >
                            {outcome}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-100 rounded-full px-4 py-2 mb-6">
              <span className="text-purple-700 text-sm font-semibold">
                Additional Services
              </span>
            </div>
            <h2 className="heading-lg text-gray-900 mb-6">
              More Ways to <span className="gradient-text">Grow</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Beyond our core programs, we offer additional services to support
              your journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {additionalServices.map((service) => (
              <Link
                key={service.title}
                href={service.href}
                className="group bg-white rounded-2xl p-8 shadow-lg shadow-purple-500/5 border border-gray-100 card-hover"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-deep to-purple-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <service.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="flex items-center gap-2 text-purple-700 font-medium group-hover:text-purple-deep">
                  Learn More
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding gradient-bg relative overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-lg text-white mb-6">
              Ready to Transform Your Career?
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Join thousands of professionals who have accelerated their growth
              through GZURA programs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/join">
                <button className="btn-secondary">Apply Now</button>
              </Link>
              <Link href="/contact">
                <button className="bg-white/10 border border-white/30 text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/20 transition-all">
                  Contact Us
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
