'use client';

import ScrollAnimate from '@/components/animations/ScrollAnimate';
import Link from 'next/link';
import { Quote, Star, ArrowRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'CEO, TechVenture Inc.',
    content:
      'GZURA transformed my approach to leadership. The mentorship program connected me with industry veterans who helped me scale my business from $1M to $10M in just two years.',
    rating: 5,
    image: 'https://images.pexels.com/photos/7749094/pexels-photo-7749094.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    name: 'Marcus Williams',
    role: 'Founder, GreenTech Solutions',
    content:
      'The entrepreneurship incubator gave me the framework and confidence to leave my corporate job and launch my dream venture. Today we employ 50 people and are making real impact.',
    rating: 5,
    image: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    name: 'Priya Patel',
    role: 'Director, Innovation Labs',
    content:
      'Being part of GZURA opened doors I never knew existed. The network alone is worth its weight in gold. I have found mentors, partners, and lifelong friends.',
    rating: 5,
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="section-padding bg-white relative overflow-hidden" aria-labelledby="testimonials-heading">
      {/* Background Accent */}
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-purple-50 to-transparent -z-10" aria-hidden="true" />

      <div className="container-custom">
        {/* Header */}
        <ScrollAnimate animation="fade-up">
          <header className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-100 rounded-full px-4 py-2 mb-6">
              <Star className="w-4 h-4 text-purple-700" aria-hidden="true" />
              <span className="text-purple-700 text-sm font-semibold">
                Success Stories
              </span>
            </div>

            <h2 id="testimonials-heading" className="heading-lg text-gray-900 mb-4 md:mb-6">
              Real People,{' '}
              <span className="gradient-text">Real Results</span>
            </h2>

            <p className="text-gray-600 text-base md:text-lg">
              Hear from our community members who have transformed their careers
              and businesses through GZURA programs.
            </p>
          </header>
        </ScrollAnimate>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <ScrollAnimate key={testimonial.name} animation="fade-up" delay={index * 150}>
              <article
                className="bg-white rounded-2xl p-6 md:p-8 shadow-xl shadow-purple-500/10 border border-gray-100 relative overflow-hidden group h-full flex flex-col"
              >
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 w-10 h-10 md:w-12 md:h-12 rounded-full bg-purple-100 flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity" aria-hidden="true">
                  <Quote className="w-5 h-5 md:w-6 md:h-6 text-purple-700" />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-6" aria-label={`${testimonial.rating} out of 5 stars`}>
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-gold-500 fill-gold-500"
                      aria-hidden="true"
                    />
                  ))}
                </div>

                {/* Content */}
                <blockquote className="text-gray-600 leading-relaxed mb-8 italic flex-1 text-sm md:text-base">
                  &ldquo;{testimonial.content}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12 md:w-14 md:h-14">
                    <AvatarImage src={testimonial.image} alt={`Photo of ${testimonial.name}`} />
                    <AvatarFallback className="bg-purple-200 text-purple-700 font-semibold">
                      {testimonial.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm md:text-base">
                      {testimonial.name}
                    </p>
                    <p className="text-xs md:text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>

                {/* Bottom Gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-deep to-gold-500 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
              </article>
            </ScrollAnimate>
          ))}
        </div>

        {/* CTA */}
        <ScrollAnimate animation="fade-up" delay={450}>
          <div className="text-center mt-12 md:mt-16">
            <Link href="/success-stories">
              <button className="btn-primary group focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2">
                Read More Stories
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform inline" aria-hidden="true" />
              </button>
            </Link>
          </div>
        </ScrollAnimate>
      </div>
    </section>
  );
}
