'use client';

import ScrollAnimate from '@/components/animations/ScrollAnimate';
import Link from 'next/link';
import { Quote, Star, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Small Business Owner',
    content:
      'GZURA helped me connect with mentors and build the confidence to grow my business.',
    rating: 5,
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    name: 'Arjun Patel',
    role: 'Startup Founder',
    content:
      'The networking opportunities at GZURA opened doors to partnerships and new ideas.',
    rating: 5,
    image: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    name: 'Meera Nair',
    role: 'Entrepreneur',
    content:
      'The leadership programs transformed the way I approach challenges and opportunities.',
    rating: 5,
    image: 'https://images.pexels.com/photos/7749094/pexels-photo-7749094.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

export default function SuccessStoriesSection() {
  return (
    <section className="section-padding bg-white relative overflow-hidden" aria-labelledby="success-heading">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100/50 rounded-full blur-3xl opacity-60" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-100/30 rounded-full blur-3xl opacity-60" aria-hidden="true" />

      <div className="container-custom relative z-10">
        {/* Header */}
        <ScrollAnimate animation="fade-up">
          <header className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-100 rounded-full px-4 py-2 mb-6">
              <Star className="w-4 h-4 text-purple-700" aria-hidden="true" />
              <span className="text-purple-700 text-sm font-semibold">
                Success Stories
              </span>
            </div>

            <h2 id="success-heading" className="heading-lg text-gray-900 mb-4">
              Success <span className="gradient-text">Stories</span>
            </h2>

            <p className="text-gray-600 text-lg md:text-xl">
              Real people. Real growth. Real impact.
            </p>
          </header>
        </ScrollAnimate>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <ScrollAnimate key={testimonial.name} animation="fade-up" delay={index * 150}>
              <Card
                className="group bg-white border border-gray-100 shadow-lg shadow-purple-500/5 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden rounded-2xl"
              >
                <CardContent className="p-6 md:p-8">
                  {/* Quote Icon */}
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true">
                    <Quote className="w-5 h-5 text-purple-600" />
                  </div>

                  {/* 5-Star Rating */}
                  <div className="flex gap-1 mb-5" aria-label={`${testimonial.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-gold-500 fill-gold-500"
                        aria-hidden="true"
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-gray-700 text-base leading-relaxed mb-6 italic">
                    &ldquo;{testimonial.content}&rdquo;
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                    <Avatar className="w-12 h-12 ring-2 ring-purple-100">
                      <AvatarImage src={testimonial.image} alt={`Photo of ${testimonial.name}`} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-purple-800 text-white font-semibold">
                        {testimonial.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>

                {/* Bottom Gradient Line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-deep via-purple-600 to-gold-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
              </Card>
            </ScrollAnimate>
          ))}
        </div>

        {/* CTA */}
        <ScrollAnimate animation="fade-up" delay={450}>
          <div className="text-center mt-12 md:mt-16">
            <Link href="/join">
              <button className="btn-primary group focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2">
                Become Our Next Success Story
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform inline" aria-hidden="true" />
              </button>
            </Link>
          </div>
        </ScrollAnimate>
      </div>
    </section>
  );
}
