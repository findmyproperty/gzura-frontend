'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Premium partner / network strip (reference: dark logo bar).
 * Custom monogram marks — no fake trademark claims.
 */

type Brand = {
  name: string;
  mark: ReactNode;
};

const brands: Brand[] = [
  {
    name: 'Leadership Lab',
    mark: (
      <svg viewBox="0 0 28 28" className="h-6 w-6 sm:h-7 sm:w-7" fill="none" aria-hidden>
        <circle cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="1.6" />
        <path d="M9 18V10l5 5 5-5v8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'NEXUS',
    mark: (
      <svg viewBox="0 0 28 28" className="h-6 w-6 sm:h-7 sm:w-7" fill="none" aria-hidden>
        <rect x="3" y="3" width="10" height="10" rx="2" fill="currentColor" opacity="0.9" />
        <rect x="15" y="15" width="10" height="10" rx="2" fill="currentColor" opacity="0.9" />
        <path d="M13 8h7a2 2 0 0 1 2 2v7M15 20H8a2 2 0 0 1-2-2V11" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    name: 'Harbor',
    mark: (
      <svg viewBox="0 0 28 28" className="h-6 w-6 sm:h-7 sm:w-7" fill="none" aria-hidden>
        <path d="M14 4v16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M6 12h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M5 22c2.5-3 5.5-4.5 9-4.5S20.5 19 23 22" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'Forge',
    mark: (
      <svg viewBox="0 0 28 28" className="h-6 w-6 sm:h-7 sm:w-7" fill="none" aria-hidden>
        <path d="M7 20 14 5l7 15H7Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M10 14h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'Summit',
    mark: (
      <svg viewBox="0 0 28 28" className="h-6 w-6 sm:h-7 sm:w-7" fill="none" aria-hidden>
        <path d="M3 22 10 8l5 8 3-5 7 11H3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'Elevate',
    mark: (
      <svg viewBox="0 0 28 28" className="h-6 w-6 sm:h-7 sm:w-7" fill="none" aria-hidden>
        <path d="M14 22V7M14 7l-5 5M14 7l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="14" cy="5" r="1.8" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: 'Connect',
    mark: (
      <svg viewBox="0 0 28 28" className="h-6 w-6 sm:h-7 sm:w-7" fill="none" aria-hidden>
        <circle cx="8" cy="14" r="3.2" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="20" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="20" cy="20" r="3.2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M10.8 12.5 17 9.2M10.8 15.5 17 18.8" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    name: 'Apex',
    mark: (
      <svg viewBox="0 0 28 28" className="h-6 w-6 sm:h-7 sm:w-7" fill="none" aria-hidden>
        <path d="M14 4 24 22H4L14 4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <circle cx="14" cy="16" r="2.2" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: 'Stride',
    mark: (
      <svg viewBox="0 0 28 28" className="h-6 w-6 sm:h-7 sm:w-7" fill="none" aria-hidden>
        <path d="M6 20c4-2 6-8 6-14 0 6 2 12 6 14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M8 22h12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'Pulse',
    mark: (
      <svg viewBox="0 0 28 28" className="h-6 w-6 sm:h-7 sm:w-7" fill="none" aria-hidden>
        <path
          d="M3 14h5l2.5-6 4 12 3-7H25"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

function BrandItem({ brand }: { brand: Brand }) {
  return (
    <li className="flex shrink-0 items-center gap-2 sm:gap-2.5 group">
      <span className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-white/[0.08] text-white/85 ring-1 ring-white/10 transition-all duration-300 group-hover:bg-white/12 group-hover:text-gold-300 group-hover:ring-gold-400/30">
        {brand.mark}
      </span>
      <span className="whitespace-nowrap text-sm sm:text-[0.95rem] font-semibold tracking-wide text-white/80 transition-colors duration-300 group-hover:text-white">
        {brand.name}
      </span>
    </li>
  );
}

function BrandRow({ className }: { className?: string }) {
  return (
    <ul
      className={cn(
        'flex shrink-0 items-center gap-7 sm:gap-8 md:gap-10 px-4 sm:px-5',
        className
      )}
      aria-hidden
    >
      {brands.map((brand) => (
        <BrandItem key={brand.name} brand={brand} />
      ))}
    </ul>
  );
}

export default function LogoStrip() {
  return (
    <section
      className="relative overflow-hidden"
      aria-label="Networks and partners in the GZURA ecosystem"
    >
      {/* Rich gradient bar — not flat purple */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-purple-950 via-purple-deep to-purple-900"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 50% 120% at 20% 50%, rgba(212,175,55,0.12), transparent), radial-gradient(ellipse 40% 100% at 80% 50%, rgba(139,95,199,0.2), transparent)',
        }}
        aria-hidden
      />

      {/* Top hairline gold */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent"
        aria-hidden
      />

      <div className="relative py-8 sm:py-9 md:py-10">
        {/* Optional label */}
        <p className="sr-only">Trusted networks and community partners</p>

        {/* Edge fades */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 sm:w-16 md:w-20 bg-gradient-to-r from-purple-950 via-purple-950/80 to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 sm:w-16 md:w-20 bg-gradient-to-l from-purple-950 via-purple-950/80 to-transparent"
          aria-hidden
        />

        <div className="flex w-max animate-logo-marquee motion-reduce:animate-none hover:[animation-play-state:paused]">
          <BrandRow />
          <BrandRow />
        </div>
      </div>

      {/* Bottom hairline */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
        aria-hidden
      />
    </section>
  );
}
