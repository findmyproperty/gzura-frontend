'use client';

import ScrollAnimate from '@/components/animations/ScrollAnimate';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const benefits = [
  'Access to exclusive leadership programs',
  'Network with 5,000+ ambitious professionals',
  'Free workshops and webinars monthly',
  'Mentorship matching program',
  'Priority event registration',
];

export default function CTASection() {
  return (
    <section className="section-padding bg-gray-50 relative overflow-hidden" aria-labelledby="cta-heading">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-deep/5 to-gold-500/5" aria-hidden="true" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-gold-500/10 to-transparent rounded-full blur-3xl" aria-hidden="true" />

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto">
          <ScrollAnimate animation="scale-in">
            <div className="gradient-bg rounded-3xl p-8 md:p-12 lg:p-16 text-center relative overflow-hidden">
              {/* Decorative Pattern */}
              <div className="absolute inset-0 opacity-5" aria-hidden="true">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRoLTJ2Mmgydi0yem0tMTAgMGgtMnYyaDJ2LTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] bg-repeat" />
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h2 id="cta-heading" className="heading-lg text-white mb-4">
                  Join the GZURA Community
                </h2>
                <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto mb-8 md:mb-10">
                  Become part of a thriving community of leaders and
                  entrepreneurs. Get access to resources, mentorship, and
                  opportunities to accelerate your growth.
                </p>

                {/* Benefits */}
                <ul className="flex flex-wrap justify-center gap-4 mb-8 md:mb-10 list-none p-0">
                  {benefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-center gap-2 text-white/90 text-sm md:text-base"
                    >
                      <CheckCircle2 className="w-5 h-5 text-gold-400 flex-shrink-0" aria-hidden="true" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4">
                  <Link href="/join" className="w-full sm:w-auto">
                    <button className="btn-secondary group w-full sm:w-auto text-base md:text-lg px-8 md:px-10 py-3 md:py-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-deep">
                      Join Now - It&apos;s Free
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform inline" aria-hidden="true" />
                    </button>
                  </Link>
                  <Link href="/contact" className="w-full sm:w-auto">
                    <button className="bg-white/10 border border-white/30 text-white font-semibold px-8 md:px-10 py-3 md:py-4 rounded-lg hover:bg-white/20 transition-all w-full sm:w-auto text-base md:text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-purple-deep">
                      Contact Us
                    </button>
                  </Link>
                </div>

                {/* Trust Badge */}
                <p className="mt-6 md:mt-8 text-white/60 text-sm md:text-base">
                  Join 5,000+ members from 50+ countries
                </p>
              </div>
            </div>
          </ScrollAnimate>
        </div>
      </div>
    </section>
  );
}
