import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Quote, Star, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
    image: 'https://images.pexels.com/photos/7749094/pexels-photo-7749094.jpeg?auto=compress&cs=tinysrgb&w=600',
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
    image: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=600',
    program: 'Entrepreneurship Incubator',
    year: '2021',
    featured: true,
  },
];

const allStories = [
  {
    name: 'Priya Patel',
    role: 'Director of Innovation',
    location: 'Mumbai, India',
    story:
      'The GZURA network opened doors I never knew existed. I found mentors, business partners, and lifelong friends. My career trajectory has completely changed.',
    achievement: '3x salary increase in 2 years',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    program: 'Leadership Development',
    year: '2023',
  },
  {
    name: 'David Kim',
    role: 'Serial Entrepreneur',
    location: 'Seoul, South Korea',
    story:
      'I wish I had found GZURA earlier. The mentorship and community pushed me to think bigger. Now I\'ve successfully exited two startups.',
    achievement: '2 successful startup exits',
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    program: 'Success Accelerator',
    year: '2022',
  },
  {
    name: 'Aisha Mohammed',
    role: 'VP of Marketing',
    location: 'Dubai, UAE',
    story:
      'The leadership program helped me overcome imposter syndrome and step into executive roles with confidence. Worth every moment invested.',
    achievement: 'Promoted 3 times in 18 months',
    image: 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=400',
    program: 'Leadership Development',
    year: '2023',
  },
  {
    name: 'Carlos Rodriguez',
    role: 'Social Impact Entrepreneur',
    location: 'Mexico City, Mexico',
    story:
      'GZURA helped me turn my passion for social change into a sustainable business. My company now serves over 10,000 families.',
    achievement: 'Impact on 10,000+ families',
    image: 'https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=400',
    program: 'Entrepreneurship Incubator',
    year: '2022',
  },
  {
    name: 'Emma Thompson',
    role: 'Executive Coach',
    location: 'Sydney, Australia',
    story:
      'After 15 years in corporate, GZURA gave me the framework and confidence to start my own consulting practice. Best career decision ever.',
    achievement: 'Successful career transition at 45',
    image: 'https://images.pexels.com/photos/7749094/pexels-photo-7749094.jpeg?auto=compress&cs=tinysrgb&w=400',
    program: 'Success Accelerator',
    year: '2023',
  },
  {
    name: 'Ahmed Hassan',
    role: 'Tech Startup Founder',
    location: 'Cairo, Egypt',
    story:
      'The pitch training and investor connections through GZURA helped us raise our seed round. Now scaling across the Middle East.',
    achievement: 'Raised $2M seed funding',
    image: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=400',
    program: 'Entrepreneurship Incubator',
    year: '2024',
  },
];

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
      <section className="gradient-bg pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRoLTJ2Mmgydi0yem0tMTAgMGgtMnYyaDJ2LTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] bg-repeat" />
        </div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Star className="w-4 h-4 text-gold-400" />
              <span className="text-gold-400 text-sm font-semibold">
                Success Stories
              </span>
            </div>
            <h1 className="heading-xl text-white mb-6">
              Real People,{' '}
              <span className="text-gold-400">Real Results</span>
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              Be inspired by the journeys of GZURA members who transformed their
              careers, launched businesses, and achieved their dreams.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="container-custom">
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
        <div className="container-custom">
          <div className="inline-flex items-center gap-2 bg-purple-100 rounded-full px-4 py-2 mb-8">
            <span className="text-purple-700 text-sm font-semibold">
              FEATURED STORIES
            </span>
          </div>

          <div className="space-y-16">
            {featuredStories.map((story, index) => (
              <div
                key={story.name}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/20">
                    <img
                      src={story.image}
                      alt={story.name}
                      className="w-full aspect-[3/4] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-deep/80 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <p className="text-gold-400 text-sm font-semibold mb-2">
                        {story.program}
                      </p>
                      <h3 className="text-2xl font-bold text-white mb-1">
                        {story.name}
                      </h3>
                      <p className="text-white/80">{story.role}</p>
                    </div>
                  </div>
                </div>

                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <div className="flex items-center gap-2 mb-4">
                    <Quote className="w-8 h-8 text-purple-200" />
                  </div>
                  <blockquote className="text-xl text-gray-700 leading-relaxed mb-6 italic">
                    &ldquo;{story.story}&rdquo;
                  </blockquote>

                  <div className="flex items-center gap-4 mb-6">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {story.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {story.location} • Class of {story.year}
                      </p>
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-xl p-4 border-l-4 border-gold-500">
                    <p className="text-sm text-purple-700 font-medium mb-1">
                      Achievement
                    </p>
                    <p className="text-gray-900 font-semibold">
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
        <div className="container-custom">
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
                  <img
                    src={story.image}
                    alt={story.name}
                    className="w-full h-full object-cover"
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
        <div className="container-custom relative z-10">
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
