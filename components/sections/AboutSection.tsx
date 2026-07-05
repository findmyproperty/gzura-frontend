'use client';

import ScrollAnimate from '@/components/animations/ScrollAnimate';
import Link from 'next/link';
import { ArrowRight, Target, Users, Lightbulb, Heart } from 'lucide-react';

const values = [
  {
    icon: Target,
    title: 'Mission-Driven',
    description:
      'We are committed to creating lasting impact through focused leadership and entrepreneurship programs.',
  },
  {
    icon: Users,
    title: 'Community First',
    description:
      'Building a supportive network where members lift each other toward success.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description:
      'Embracing new ideas and approaches to solve challenges and create opportunities.',
  },
  {
    icon: Heart,
    title: 'Empowerment',
    description:
      'Equipping individuals with tools and confidence to achieve their full potential.',
  },
];

export default function AboutSection() {
  return (
    <section className="section-padding bg-white relative overflow-hidden" aria-labelledby="about-heading">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-purple-50 to-transparent" aria-hidden="true" />

      <div className="container-custom relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <ScrollAnimate animation="slide-left">
            <div className="inline-flex items-center gap-2 bg-purple-100 rounded-full px-4 py-2 mb-6">
              <span className="text-purple-700 text-sm font-semibold">
                About GZURA
              </span>
            </div>

            <h2 id="about-heading" className="heading-lg text-gray-900 mb-6">
              Building Tomorrow&apos;s{' '}
              <span className="gradient-text">Leaders & Entrepreneurs</span>
            </h2>

            <p className="text-gray-600 mb-6 leading-relaxed text-base md:text-lg">
              GZURA is more than a platform—its a movement. We believe that
              every individual has the potential to lead, create, and inspire.
              Our comprehensive programs provide the skills, network, and
              resources needed to turn potential into achievement.
            </p>

            <p className="text-gray-600 mb-8 leading-relaxed text-base md:text-lg">
              Founded in 2020, we&apos;ve grown from a small community group to a
              thriving network of over 5,000 members across the globe. Our
              mission is simple: empower men and women to become confident
              leaders and successful entrepreneurs.
            </p>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-purple-700 font-semibold group focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 rounded-sm"
              aria-label="Learn more about GZURA"
            >
              Learn More About Us
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Link>
          </ScrollAnimate>

          {/* Values Grid */}
          <ScrollAnimate animation="slide-right" delay={200}>
            <div className="grid sm:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <article
                  key={value.title}
                  className="bg-white rounded-2xl p-6 shadow-lg shadow-purple-500/5 border border-gray-100 card-hover"
                >
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-purple-deep to-purple-700 flex items-center justify-center mb-4" aria-hidden="true">
                    <value.icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                    {value.description}
                  </p>
                </article>
              ))}
            </div>
          </ScrollAnimate>
        </div>
      </div>
    </section>
  );
}
