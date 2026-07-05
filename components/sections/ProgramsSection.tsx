'use client';

import ScrollAnimate from '@/components/animations/ScrollAnimate';
import Link from 'next/link';
import {
  Briefcase,
  Users2,
  Target,
  Heart,
  Sparkles,
  GraduationCap,
  ArrowRight,
} from 'lucide-react';

const services = [
  {
    icon: Briefcase,
    title: 'Entrepreneurship Workshops',
    description:
      'Hands-on workshops covering business planning, marketing, sales, and growth strategies.',
    color: 'from-purple-600 to-purple-800',
  },
  {
    icon: Users2,
    title: 'Leadership Development',
    description:
      'Programs designed to build confidence, communication, and leadership skills.',
    color: 'from-gold-500 to-gold-600',
  },
  {
    icon: Target,
    title: 'Networking Events',
    description:
      'Connect with entrepreneurs, mentors, and industry professionals.',
    color: 'from-purple-500 to-purple-700',
  },
  {
    icon: Sparkles,
    title: 'Business Mentorship',
    description:
      'Receive guidance from experienced entrepreneurs and business leaders.',
    color: 'from-gold-400 to-gold-500',
  },
  {
    icon: Heart,
    title: 'Personal Growth Programs',
    description:
      'Develop mindset, productivity, and self-improvement skills.',
    color: 'from-purple-700 to-purple-900',
  },
  {
    icon: GraduationCap,
    title: 'Women & Men Empowerment Initiatives',
    description:
      'Special initiatives focused on empowering individuals to achieve their full potential.',
    color: 'from-gold-500 to-gold-600',
  },
];

export default function ProgramsSection() {
  return (
    <section className="section-padding bg-gray-50 relative overflow-hidden" aria-labelledby="programs-heading">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" aria-hidden="true" />

      <div className="container-custom relative z-10">
        {/* Header */}
        <ScrollAnimate animation="fade-up">
          <header className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-100 rounded-full px-4 py-2 mb-6">
              <span className="text-purple-700 text-sm font-semibold">
                Programs & Services
              </span>
            </div>

            <h2 id="programs-heading" className="heading-lg text-gray-900 mb-4">
              Programs & <span className="gradient-text">Services</span>
            </h2>

            <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
              Empowering individuals through learning, leadership, and opportunities.
            </p>
          </header>
        </ScrollAnimate>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <ScrollAnimate key={service.title} animation="fade-up" delay={index * 100}>
              <article className="group bg-white rounded-2xl p-6 md:p-8 shadow-lg shadow-purple-500/5 border border-gray-100 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden h-full">
                {/* Icon */}
                <div
                  className={`w-12 h-12 md:w-16 md:h-16 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300`}
                  aria-hidden="true"
                >
                  <service.icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-700 transition-colors">
                  {service.title}
                </h3>

                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  {service.description}
                </p>

                {/* Bottom Gradient Line */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  aria-hidden="true"
                />
              </article>
            </ScrollAnimate>
          ))}
        </div>

        {/* CTA */}
        <ScrollAnimate animation="fade-up" delay={600}>
          <div className="text-center mt-12 md:mt-16">
            <Link href="/programs">
              <button className="btn-primary group focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2">
                Learn More
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform inline" aria-hidden="true" />
              </button>
            </Link>
          </div>
        </ScrollAnimate>
      </div>
    </section>
  );
}
