import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Quote, Star, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { transformationStories } from '@/lib/success-stories';

export const metadata: Metadata = {
  title: 'Success Stories | GZURA',
  description:
    'Read inspiring success stories from GZURA community members who transformed their careers and businesses.',
};

const featuredStories = [
  {
    name: 'Sarah Chen',
    role: 'CEO, TechVenture Inc.',
    location: 'San Francisco, USA',
    story:
      'Before GZURA, I was a middle manager feeling stuck. The Leadership Development Program gave me the skills and confidence to start my own company. Today, TechVenture has raised $15M in funding and employs 80 people. The mentorship I received was invaluable - my mentor helped me navigate every major decision in my first year.',
    achievement: 'From manager to CEO, raised $15M funding',
    image: '/images/success-stories/sarah-chen.png',
    program: 'Leadership Development + Incubator',
    year: '2022',
    featured: true,
  },
  {
    name: 'Marcus Williams',
    role: 'Founder, GreenTech Solutions',
    location: 'London, UK',
    story:
      'The Entrepreneurship Incubator changed my life. I went from having a vague business idea to launching a company that now serves clients in 12 countries. The structured approach, expert mentors, and amazing community made all the difference. GZURA didn\'t just teach me business skills - it changed how I think.',
    achievement: 'Launched company, now in 12 countries',
    image: '/images/success-stories/marcus-williams.png',
    program: 'Entrepreneurship Incubator',
    year: '2021',
    featured: true,
  },
];

const allStories = transformationStories;

const stats = [
  { value: '85%', label: 'Report career advancement' },
  { value: '$15M+', label: 'Funding raised by alumni' },
  { value: '150+', label: 'Businesses launched' },
  { value: '92%', label: 'Member satisfaction' },
];

export default function SuccessStoriesPage() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-bg p-5 md:p-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRoLTJ2Mmgydi0yem0tMTAgMGgtMnYyaDJ2LTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] bg-repeat" />
        </div>
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center 2xl:max-w-5xl 4k:max-w-6xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Star className="w-4 h-4 text-gold-400" />
              <span className="text-gold-400 text-sm font-semibold">
                Success Stories
              </span>
            </div>
            <h1 className="heading-xl mb-6 text-white md:whitespace-nowrap">
              Real People,{' '}
              <span className="text-gold-400">Real Results</span>
            </h1>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/80 4k:max-w-4xl 4k:text-xl">
              Be inspired by the journeys of GZURA members who transformed their
              careers, launched businesses, and achieved their dreams.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-bold gradient-text mb-2">
                  {stat.value}
                </p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Stories */}
      <section className="section-padding bg-gray-50">
        <div className="container">
          <div className="inline-flex items-center gap-2 bg-purple-100 rounded-full px-4 py-2 mb-8">
            <span className="text-purple-700 text-sm font-semibold">
              FEATURED STORIES
            </span>
          </div>

          <div className="space-y-12 md:space-y-16">
            {featuredStories.map((story, index) => (
              <div
                key={story.name}
                className={`grid items-center gap-8 lg:gap-12 ${
                  index % 2 === 1
                    ? 'lg:grid-cols-[minmax(0,1fr)_minmax(0,18rem)]'
                    : 'lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]'
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : undefined}>
                  <div className="relative mx-auto aspect-[4/5] w-full max-w-[18rem] overflow-hidden rounded-2xl shadow-xl shadow-purple-500/15">
                    <Image
                      src={story.image}
                      alt={story.name}
                      fill
                      sizes="288px"
                      className="object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-deep/80 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <p className="mb-1 text-xs font-semibold text-gold-400">
                        {story.program}
                      </p>
                      <h3 className="mb-0.5 text-xl font-bold text-white">
                        {story.name}
                      </h3>
                      <p className="text-sm text-white/80">{story.role}</p>
                    </div>
                  </div>
                </div>

                <div className={index % 2 === 1 ? 'lg:order-1' : undefined}>
                  <div className="mb-4 flex items-center gap-2">
                    <Quote className="h-8 w-8 text-purple-200" />
                  </div>
                  <blockquote className="mb-6 text-lg italic leading-relaxed text-gray-700 md:text-xl">
                    &ldquo;{story.story}&rdquo;
                  </blockquote>

                  <div className="mb-6">
                    <p className="font-semibold text-gray-900">{story.name}</p>
                    <p className="text-sm text-gray-500">
                      {story.location} • Class of {story.year}
                    </p>
                  </div>

                  <div className="rounded-xl border-l-4 border-gold-500 bg-purple-50 p-4">
                    <p className="mb-1 text-sm font-medium text-purple-700">
                      Achievement
                    </p>
                    <p className="font-semibold text-gray-900">
                      {story.achievement}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Stories Grid */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="heading-lg text-gray-900 mb-4">
              More <span className="gradient-text">Transformations</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Every member has a unique journey. Here are more stories of
              transformation and achievement.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allStories.map((story) => (
              <div
                key={story.name}
                className="bg-white rounded-2xl overflow-hidden shadow-lg shadow-purple-500/5 border border-gray-100 card-hover"
              >
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
                    <h3 className="text-lg font-bold text-white">
                      {story.name}
                    </h3>
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding gradient-bg relative overflow-hidden">
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-lg text-white mb-6">
              Ready to Write Your Success Story?
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Join GZURA and start your transformation journey today.
            </p>
            <Link href="/join">
              <button className="btn-secondary group">
                Join the Community
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform inline" />
              </button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
