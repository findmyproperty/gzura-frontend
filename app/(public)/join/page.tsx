import { Metadata } from 'next';
import { CheckCircle2, Users, Star, ArrowRight } from 'lucide-react';
import CommunityForm from '@/components/forms/CommunityForm';

export const metadata: Metadata = {
  title: 'Join Community | GZURA',
  description:
    'Join the GZURA community and get access to leadership programs, mentorship, networking events, and more.',
};

const benefits = [
  'Access to exclusive leadership programs',
  'Free monthly workshops and webinars',
  'Network with 5,000+ ambitious professionals',
  'Personalized mentorship matching',
  'Priority registration for events',
  'Member-only resources and tools',
  'Private community forum access',
  'Discounts on premium programs',
];

const membershipPlans = [
  {
    name: 'Basic',
    price: 'Free',
    description: 'Perfect for exploring our community',
    features: [
      'Monthly webinars access',
      'Newsletter subscription',
      'Community forum access',
      'Event invitations',
    ],
    popular: false,
  },
  {
    name: 'Premium',
    price: '$49/mo',
    description: 'For serious growth seekers',
    features: [
      'All Basic features',
      'Priority event registration',
      'Mentorship matching',
      'Program discounts',
      'Exclusive resources',
      'Direct support',
    ],
    popular: true,
  },
  {
    name: 'Executive',
    price: '$199/mo',
    description: 'For leaders ready to accelerate',
    features: [
      'All Premium features',
      '1-on-1 executive coaching',
      'VIP event access',
      'Personalized development plan',
      'Exclusive networking',
      'Unlimited program access',
    ],
    popular: false,
  },
];

export default function JoinPage() {
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
              <Users className="w-4 h-4 text-gold-400" />
              <span className="text-gold-400 text-sm font-semibold">
                Join the Community
              </span>
            </div>
            <h1 className="heading-xl text-white mb-6">
              Become Part of{' '}
              <span className="text-gold-400">Something Greater</span>
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              Join a thriving community of leaders and entrepreneurs committed
              to growth, impact, and supporting each other.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.slice(0, 4).map((benefit) => (
              <div
                key={benefit}
                className="flex items-center gap-3 bg-purple-50 rounded-xl p-4"
              >
                <CheckCircle2 className="w-5 h-5 text-purple-700 flex-shrink-0" />
                <span className="text-gray-700 text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Plans */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="heading-lg text-gray-900 mb-4">
              Choose Your <span className="gradient-text">Membership</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Select the plan that best fits your growth journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {membershipPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-white rounded-2xl p-8 ${
                  plan.popular
                    ? 'ring-2 ring-gold-500 shadow-xl shadow-gold-500/10'
                    : 'shadow-lg shadow-purple-500/5 border border-gray-100'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gold-500 text-purple-950 text-sm font-bold px-4 py-1 rounded-full">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {plan.name}
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  {plan.description}
                </p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-purple-deep">
                    {plan.price}
                  </span>
                  {plan.price !== 'Free' && (
                    <span className="text-gray-500">/month</span>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-gray-600"
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <a href="#register">
                  <button
                    className={`w-full py-3 rounded-lg font-semibold transition-all ${
                      plan.popular
                        ? 'btn-secondary'
                        : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                    }`}
                  >
                    Get Started
                  </button>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section
        id="register"
        className="section-padding bg-white"
      >
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Benefits List */}
            <div>
              <div className="inline-flex items-center gap-2 bg-purple-100 rounded-full px-4 py-2 mb-6">
                <Star className="w-4 h-4 text-purple-700" />
                <span className="text-purple-700 text-sm font-semibold">
                  Why Join GZURA
                </span>
              </div>

              <h2 className="heading-lg text-gray-900 mb-8">
                Transform Your <span className="gradient-text">Journey</span>
              </h2>

              <div className="space-y-6">
                {benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-deep to-purple-700 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium">{benefit}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 p-6 bg-gradient-to-br from-purple-50 to-gold-50 rounded-xl">
                <p className="text-gray-700 italic">
                  &ldquo;Joining GZURA was the best decision I made for my
                  career. The community, mentorship, and programs have been
                  invaluable.&rdquo;
                </p>
                <p className="text-purple-700 font-semibold mt-3">
                  — Sarah Chen, CEO
                </p>
              </div>
            </div>

            {/* Form */}
            <div>
              <div className="bg-gray-50 rounded-2xl p-8 md:p-10 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Join the Community
                </h3>
                <p className="text-gray-600 mb-8">
                  Fill out the form below to get started.
                </p>
                <CommunityForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="section-padding gradient-bg relative overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-lg text-white mb-6">
              Questions? We Have Answers
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Browse our FAQ or contact us directly for any questions about
              membership, programs, or events.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/faq"
                className="bg-white/10 border border-white/30 text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/20 transition-all"
              >
                View FAQ
              </a>
              <a
                href="/contact"
                className="btn-secondary"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
