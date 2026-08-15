'use client';

import Image from 'next/image';
import ScrollAnimate from '@/components/animations/ScrollAnimate';
import Link from 'next/link';
import { Star, ArrowRight } from 'lucide-react';
import { transformationStories } from '@/lib/success-stories';

export default function TestimonialsSection() {
  return (
    <section className="section-padding bg-white relative overflow-hidden" aria-labelledby="testimonials-heading">
      {/* Background Accent */}
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-purple-50 to-transparent -z-10" aria-hidden="true" />

      <div className="container">
        {/* Header */}
        <ScrollAnimate animation="fade-up">
          <header className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
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
          {transformationStories.slice(0, 3).map((story, index) => (
            <ScrollAnimate key={story.name} animation="fade-up" delay={index * 100}>
              <article className="bg-white rounded-2xl overflow-hidden shadow-lg shadow-purple-500/5 border border-gray-100 card-hover h-full">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={story.image}
                    alt={story.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                    style={{ objectPosition: story.objectPosition }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-deep/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-gold-400 text-xs font-semibold">
                      {story.program}
                    </p>
                    <h3 className="text-lg font-bold text-white">{story.name}</h3>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    &ldquo;{story.story}&rdquo;
                  </p>
                  <p className="text-gray-500 text-xs mb-3">
                    {story.role} • {story.location}
                  </p>
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-purple-700 font-semibold text-sm">
                      {story.achievement}
                    </p>
                  </div>
                </div>
              </article>
            </ScrollAnimate>
          ))}
        </div>

        {/* CTA */}
        <ScrollAnimate animation="fade-up" delay={450}>
          <div className="text-center mt-8 md:mt-10">
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
