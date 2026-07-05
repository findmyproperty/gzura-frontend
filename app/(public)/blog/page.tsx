import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Clock, User, ArrowRight, Tag, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Blog | GZURA',
  description:
    'Read articles and insights on leadership, entrepreneurship, and professional development from GZURA.',
};

const categories = [
  'All Posts',
  'Leadership',
  'Entrepreneurship',
  'Career Growth',
  'Community',
  'Events',
];

const featuredPost = {
  title: 'The Future of Leadership: Skills That Will Define the Next Decade',
  excerpt:
    'As we navigate unprecedented change, the leadership landscape is evolving. Discover the essential skills that will define successful leaders in the coming decade.',
  author: 'Dr. Angela Okonkwo',
  authorRole: 'Founder & CEO',
  date: 'March 10, 2024',
  readTime: '8 min read',
  category: 'Leadership',
  image: 'https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=1000',
  featured: true,
};

const blogPosts = [
  {
    title: 'From Idea to IPO: A Founder\'s Journey Through the GZURA Incubator',
    excerpt:
      'Learn how one founder transformed a simple idea into a successful IPO with guidance from GZURA\'s entrepreneurship program.',
    author: 'Michael Chen',
    authorRole: 'Chief Program Officer',
    date: 'March 8, 2024',
    readTime: '6 min read',
    category: 'Entrepreneurship',
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    title: 'Building Resilience: Lessons from Our Community',
    excerpt:
      'How resilience became the defining trait of successful leaders and entrepreneurs in our community during challenging times.',
    author: 'Priya Sharma',
    authorRole: 'Director of Community',
    date: 'March 5, 2024',
    readTime: '5 min read',
    category: 'Community',
    image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    title: 'The Art of Networking: Quality Over Quantity',
    excerpt:
      'Why building meaningful professional relationships matters more than collecting business cards.',
    author: 'James Williams',
    authorRole: 'Head of Mentorship',
    date: 'March 1, 2024',
    readTime: '4 min read',
    category: 'Career Growth',
    image: 'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    title: 'Securing Your First Round: A Step-by-Step Guide',
    excerpt:
      'Everything you need to know about raising your first round of funding, from preparation to closing.',
    author: 'Michael Chen',
    authorRole: 'Chief Program Officer',
    date: 'February 28, 2024',
    readTime: '10 min read',
    category: 'Entrepreneurship',
    image: 'https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    title: 'Women in Leadership: Breaking the Glass Ceiling',
    excerpt:
      'Stories and strategies from women leaders who have shattered barriers and paved the way for others.',
    author: 'Dr. Angela Okonkwo',
    authorRole: 'Founder & CEO',
    date: 'February 25, 2024',
    readTime: '7 min read',
    category: 'Leadership',
    image: 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    title: 'Leadership Summit 2024: Highlights and Key Takeaways',
    excerpt:
      'A recap of our biggest event of the year with insights from world-class speakers and attendees.',
    author: 'GZURA Team',
    authorRole: 'Events Team',
    date: 'February 20, 2024',
    readTime: '6 min read',
    category: 'Events',
    image: 'https://images.pexels.com/photos/1540589/pexels-photo-1540589.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
];

export default function BlogPage() {
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
                GZURA Blog
              </span>
            </div>
            <h1 className="heading-xl text-white mb-6">
              Insights for{' '}
              <span className="text-gold-400">Leaders & Entrepreneurs</span>
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              Expert perspectives, actionable insights, and inspiring stories
              to help you grow professionally and personally.
            </p>
          </div>
        </div>
      </section>

      {/* Filter & Search */}
      <section className="py-8 bg-white border-b border-gray-100 sticky top-20 z-40">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    category === 'All Posts'
                      ? 'bg-purple-deep text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="inline-flex items-center gap-2 bg-gold-100 rounded-full px-4 py-2 mb-8">
            <span className="text-gold-700 text-sm font-semibold">
              FEATURED ARTICLE
            </span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/20">
              <img
                src={featuredPost.image}
                alt={featuredPost.title}
                className="w-full aspect-video object-cover"
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-gold-500 text-purple-950 hover:bg-gold-400">
                  {featuredPost.category}
                </Badge>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {featuredPost.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {featuredPost.readTime}
                </span>
              </div>

              <h2 className="heading-md text-gray-900 mb-4">
                {featuredPost.title}
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {featuredPost.excerpt}
              </p>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-deep to-purple-700 flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {featuredPost.author}
                  </p>
                  <p className="text-sm text-gray-500">
                    {featuredPost.authorRole}
                  </p>
                </div>
              </div>

              <Link
                href="#"
                className="inline-flex items-center gap-2 text-purple-700 font-semibold group"
              >
                Read Full Article
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <article
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-lg shadow-purple-500/5 border border-gray-100 card-hover group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-purple-deep text-white hover:bg-purple-800">
                      {post.category}
                    </Badge>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-purple-700 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">
                      By {post.author}
                    </span>
                    <Link
                      href="#"
                      className="text-purple-700 font-medium text-sm hover:text-purple-deep flex items-center gap-1"
                    >
                      Read
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="btn-primary">Load More Articles</button>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="section-padding gradient-bg relative overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="heading-lg text-white mb-4">
              Stay Informed
            </h2>
            <p className="text-white/80 mb-8">
              Subscribe to our newsletter for the latest insights on leadership,
              entrepreneurship, and professional development.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
              <button className="btn-secondary whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
