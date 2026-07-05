import { Metadata } from 'next';
import { Target, Heart, Users, Lightbulb, Award, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | GZURA',
  description:
    'Learn about GZURA\'s mission to empower men and women through leadership development and entrepreneurship training.',
};

const values = [
  {
    icon: Target,
    title: 'Mission-Focused',
    description:
      'Every program, event, and initiative is designed with measurable impact in mind.',
  },
  {
    icon: Heart,
    title: 'People-Centric',
    description:
      'Our community members are at the heart of everything we do.',
  },
  {
    icon: Users,
    title: 'Inclusive Community',
    description:
      'Creating spaces where every voice is heard and valued.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation Driven',
    description:
      'Embracing new ideas and approaches to solve complex challenges.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description:
      'Committed to the highest standards in everything we deliver.',
  },
  {
    icon: Globe,
    title: 'Global Impact',
    description:
      'Building bridges across cultures and continents.',
  },
];

const teamMembers = [
  {
    name: 'Dr. Angela Okonkwo',
    role: 'Founder & CEO',
    bio: 'Former Fortune 500 executive with 20+ years in leadership development.',
    image: 'https://images.pexels.com/photos/7749094/pexels-photo-7749094.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    name: 'Michael Chen',
    role: 'Chief Program Officer',
    bio: 'Serial entrepreneur who has built and exited 3 successful ventures.',
    image: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    name: 'Priya Sharma',
    role: 'Director of Community',
    bio: 'Community builder with expertise in creating thriving networks.',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    name: 'James Williams',
    role: 'Head of Mentorship',
    bio: 'Executive coach who has mentored over 500 emerging leaders.',
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

export default function AboutPage() {
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
              <span className="text-gold-400 text-sm font-semibold">
                Our Story
              </span>
            </div>
            <h1 className="heading-xl text-white mb-6">
              About <span className="text-gold-400">GZURA</span>
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              We are a community of dreamers, doers, and leaders committed to
              creating positive change in the world through empowerment and
              entrepreneurship.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-purple-100 rounded-full px-4 py-2 mb-6">
                <span className="text-purple-700 text-sm font-semibold">
                  Our Mission
                </span>
              </div>
              <h2 className="heading-lg text-gray-900 mb-6">
                Empowering Every Individual to{' '}
                <span className="gradient-text">Thrive</span>
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                GZURA was founded on a simple belief: everyone deserves the
                opportunity to reach their full potential. We provide the tools,
                knowledge, and community needed to transform ambition into
                achievement.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Our mission is to build a global network of empowered leaders
                and entrepreneurs who create lasting positive impact in their
                communities and industries.
              </p>
              <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-gold-500">
                <p className="text-gray-700 italic">
                  &ldquo;When we invest in people, we invest in a better future.
                  Every leader we develop, every entrepreneur we support,
                  ripples outward to create change far beyond our community.&rdquo;
                </p>
                <p className="text-purple-700 font-semibold mt-4">
                  — Dr. Angela Okonkwo, Founder
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Community gathering"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 glass rounded-xl p-6 shadow-xl">
                <p className="text-3xl font-bold text-purple-deep">2020</p>
                <p className="text-gray-600">Year Founded</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-100 rounded-full px-4 py-2 mb-6">
              <span className="text-purple-700 text-sm font-semibold">
                Our Values
              </span>
            </div>
            <h2 className="heading-lg text-gray-900 mb-6">
              The Principles That{' '}
              <span className="gradient-text">Guide Us</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Our values form the foundation of everything we do and how we
              serve our community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-white rounded-2xl p-8 shadow-lg shadow-purple-500/5 border border-gray-100 card-hover"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-deep to-purple-700 flex items-center justify-center mb-6">
                  <value.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-100 rounded-full px-4 py-2 mb-6">
              <span className="text-purple-700 text-sm font-semibold">
                Leadership Team
              </span>
            </div>
            <h2 className="heading-lg text-gray-900 mb-6">
              Meet the <span className="gradient-text">Team</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Our leadership team brings decades of combined experience in
              leadership development, entrepreneurship, and community building.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg shadow-purple-500/5 border border-gray-100"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {member.name}
                  </h3>
                  <p className="text-purple-700 text-sm font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="section-padding gradient-bg relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRoLTJ2Mmgydi0yem0tMTAgMGgtMnYyaDJ2LTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] bg-repeat" />
        </div>
        <div className="container-custom relative z-10">
          <div className="text-center mb-16">
            <h2 className="heading-lg text-white mb-4">Our Impact</h2>
            <p className="text-white/80">
              Numbers that tell our story of transformation.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-5xl font-bold text-gold-400 mb-2">5,000+</p>
              <p className="text-white/80">Active Members</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold text-gold-400 mb-2">50+</p>
              <p className="text-white/80">Countries</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold text-gold-400 mb-2">200+</p>
              <p className="text-white/80">Programs Delivered</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold text-gold-400 mb-2">$15M+</p>
              <p className="text-white/80">Raised by Alumni</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
