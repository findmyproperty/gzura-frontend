'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Fundpro-style split hero for GZURA.
 * Left: copy + video card · Center: men & women leaders pose · Right: float cards
 * Viewport-locked · purple theme
 */

const HERO_POSE = '/images/hero-leaders.jpg';

const VIDEO_THUMB =
  'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=700';

const avatars = [
  'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=120',
  'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=120',
  'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=120',
] as const;

export default function HeroSection() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const show = cn(
    'transition-all duration-700 ease-out',
    ready ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
  );
  const d = (ms: number): CSSProperties => ({ transitionDelay: `${ms}ms` });

  return (
    <section
      className="relative overflow-hidden bg-white"
      aria-labelledby="hero-heading"
    >
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-[min(42vw,40rem)] bg-gradient-to-l from-purple-50 via-purple-50/80 to-transparent"
        aria-hidden
      />

      <div className="container relative z-10 flex h-full flex-col justify-center pt-3 pb-3 sm:pb-4">
        <div
          className="pointer-events-none absolute -right-6 top-12 hidden h-[22rem] w-[22rem] lg:block xl:-right-10"
          aria-hidden
        >
          <div className="absolute inset-0 rounded-[2.5rem] bg-purple-100/90 rotate-6" />
          <div className="absolute left-8 top-16 h-[17rem] w-[17rem] rounded-[2rem] bg-purple-200/45 -rotate-3" />
        </div>
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-8 xl:gap-10">
          {/* ── LEFT: copy + video ── */}
          <div className="min-w-0 lg:col-span-5">
            <p
              className={cn(show, 'mb-4 text-sm text-neutral-500')}
              style={d(0)}
            >
              Welcome to{' '}
              <span className="rounded-md bg-purple-100 px-2 py-0.5 font-semibold text-purple-deep">
                GZURA
              </span>{' '}
              Leadership Community
            </p>

            <h1
              id="hero-heading"
              className={cn(
                show,
                'text-3xl font-bold leading-[1.15] tracking-tight text-neutral-900 sm:text-4xl lg:text-[2.5rem] xl:text-[2.75rem]'
              )}
              style={d(60)}
            >
              We Empower{' '}
              <span className="text-purple-deep">Men & Women</span>
              <span className="block mt-1">
                Building{' '}
                <span className="bg-gradient-to-r from-purple-600 to-gold-500 bg-clip-text text-transparent">
                  Entrepreneurs
                </span>
              </span>
            </h1>

            <p
              className={cn(
                show,
                'mt-4 max-w-md text-sm leading-relaxed text-neutral-500 sm:text-base'
              )}
              style={d(120)}
            >
              Leadership training, entrepreneurship programs, and a community
              that helps ambitious people create lasting impact — together.
            </p>

            {/* Video card */}
            <div
              className={cn(show, 'mt-6 max-w-sm sm:mt-8')}
              style={d(180)}
            >
              <Link
                href="/about"
                className="group relative block overflow-hidden rounded-2xl shadow-lg shadow-purple-900/10 ring-1 ring-purple-100"
              >
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src={VIDEO_THUMB}
                    alt="GZURA community workshop"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="400px"
                    priority
                  />
                  <div className="absolute inset-0 bg-purple-deep/10 transition-colors group-hover:bg-purple-deep/20" />
                </div>
              </Link>
              <p className="mt-2.5 text-sm font-medium text-neutral-700">
                Seamless growth starts here
              </p>
              <p className="text-xs text-neutral-400">Watch our 2‑min story</p>
            </div>
          </div>

          {/* ── CENTER: men & women pose ── */}
          <div
            className={cn(show, 'relative min-w-0 lg:col-span-4')}
            style={d(140)}
          >
            <div className="relative mx-auto aspect-[3/4] max-h-[min(58svh,520px)] w-full max-w-md overflow-hidden rounded-[1.75rem] bg-purple-100 shadow-2xl shadow-purple-900/15 ring-1 ring-purple-100/80 sm:max-h-[min(62svh,560px)] lg:max-w-none">
              <Image
                src={HERO_POSE}
                alt="Men and women leaders standing together with confidence"
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 90vw, 40vw"
                priority
              />
              {/* Soft bottom fade for polish */}
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-purple-deep/20 to-transparent"
                aria-hidden
              />
            </div>
          </div>

          {/* ── RIGHT: floating cards ── */}
          <div
            className={cn(
              show,
              'flex min-w-0 flex-col gap-4 sm:gap-5 lg:col-span-3'
            )}
            style={d(200)}
          >
            {/* Rating card */}
            <div className="rounded-2xl bg-white p-5 shadow-xl shadow-purple-900/10 ring-1 ring-purple-100/80 sm:p-6">
              <p className="text-3xl font-bold tracking-tight text-purple-deep sm:text-4xl">
                4.9
                <span className="text-2xl text-neutral-400">/5</span>
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-neutral-500 sm:text-sm">
                Member satisfaction across leadership & entrepreneurship programs
              </p>
              <div className="mt-3 flex gap-0.5" aria-label="5 star rating">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-gold-400 text-gold-400"
                    aria-hidden
                  />
                ))}
              </div>
            </div>

            {/* Avatars pill */}
            <div className="inline-flex w-fit items-center gap-1 rounded-full bg-white py-2 pl-2 pr-3 shadow-lg shadow-purple-900/10 ring-1 ring-purple-100/80">
              <div className="flex -space-x-2">
                {avatars.map((src) => (
                  <span
                    key={src}
                    className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-white"
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="36px"
                      aria-hidden
                    />
                  </span>
                ))}
              </div>
              <Link
                href="/join"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-deep text-lg font-semibold text-white transition-transform hover:scale-105"
                aria-label="Join community"
              >
                +
              </Link>
            </div>

            {/* CTA card */}
            <div className="rounded-2xl bg-white p-5 shadow-xl shadow-purple-900/10 ring-1 ring-purple-100/80 sm:p-6">
              <h2 className="text-lg font-bold leading-snug text-neutral-900 sm:text-xl">
                Get To Know
                <span className="block">Our Community</span>
              </h2>
              <Link
                href="/join"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-purple-deep transition-colors hover:text-purple-600"
              >
                Let&apos;s Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Secondary CTA — programs */}
            <Link
              href="/programs"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-purple-deep px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-900/25 transition-all hover:bg-purple-800 hover:shadow-xl sm:w-fit"
            >
              Explore Programs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
