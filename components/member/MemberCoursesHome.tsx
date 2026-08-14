'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, ChevronRight, ChevronLeft, MapPin, Sparkles, TrendingUp, Users, Award, Compass, ArrowRight } from 'lucide-react';
import CourseCardImage from '@/components/member/CourseCardImage';
import RecommendedEvents from '@/components/member/RecommendedEvents';
import { Button } from '@/components/ui/button';
import { Event } from '@/lib/api';
import { formatEventPrice } from '@/lib/price';

const ITEMS_PER_PAGE = 8;

export default function MemberCoursesHome({ events }: { events: Event[] }) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(events.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEvents = events.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Modern Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white py-8 lg:py-20">
        {/* Background glow effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -right-20 w-96 h-96 rounded-full bg-amber-500/15 blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-[500px] h-[500px] rounded-full bg-purple-600/25 blur-3xl" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-400/10 via-transparent to-transparent opacity-70" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Left Content Card */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Master In-Demand Skills with{' '}
                <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 bg-clip-text text-transparent">
                  World-Class Experts
                </span>
              </h1>

              <p className="text-purple-100/90 text-base sm:text-lg max-w-2xl leading-relaxed">
                Join live masterclasses, interactive workshops, and exclusive community events tailored for ambitious leaders, founders, and professionals.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button
                  asChild
                  className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-purple-950 font-bold px-7 py-3.5 h-auto text-sm sm:text-base rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35"
                >
                  <Link href="/events" className="flex items-center gap-2">
                    Browse All Events <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20 hover:text-amber-400 text-white border-white/20 hover:border-amber-400/30 backdrop-blur-md font-semibold px-6 py-3.5 h-auto text-sm sm:text-base rounded-xl transition-all"
                >
                  <Link href="/my-learnings">My Learnings</Link>
                </Button>
              </div>

              {/* Stats pill list */}
              <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 max-w-lg text-center sm:text-left">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-amber-300">{events.length}+</div>
                  <div className="text-xs text-purple-200/80">Active Programs</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-amber-300">100%</div>
                  <div className="text-xs text-purple-200/80">Verified Mentors</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-amber-300">4.9/5</div>
                  <div className="text-xs text-purple-200/80">Community Rating</div>
                </div>
              </div>
            </div>

            {/* Right Media Display */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-purple-950/60 border border-white/15 group">
                <img
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80"
                  alt="GZURA Learning Community"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-950/90 via-purple-950/20 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 text-white">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-amber-400 text-purple-950 font-bold shrink-0">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-300">Live Network</h4>
                      <p className="text-xs text-white/90">Connect & Learn with Industry Leaders</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Events Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-purple-700 font-semibold text-xs tracking-wider uppercase mb-1">
              <Compass className="w-4 h-4" />
              <span>Explore Top Events</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Trending Events & Masterclasses
            </h2>
            {events.length > 0 && (
              <p className="text-sm text-slate-500 mt-1">
                Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, events.length)} of {events.length} available events.
              </p>
            )}
          </div>

          {events.length > 0 && (
            <Link
              href="/events"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-purple-800 hover:text-purple-950 transition-colors bg-purple-50 hover:bg-purple-100 px-4 py-2 rounded-lg border border-purple-200/60"
            >
              <span>Explore All ({events.length})</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {events.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
            <Calendar className="w-12 h-12 text-purple-400 mx-auto mb-3 opacity-60" />
            <h3 className="text-lg font-bold text-slate-800">No Events Available</h3>
            <p className="text-slate-500 text-sm mt-1">Check back soon for new upcoming programs!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedEvents.map((event) => (
                <Link key={event.id} href={`/home/events/${event.id}`} className="group block">
                  <article className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-purple-200 transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
                    <CourseCardImage imageUrl={event.imageUrl} title={event.title} />

                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-100 capitalize">
                          {event.type || 'Workshop'}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                          <span>★ 4.9</span>
                        </div>
                      </div>

                      <h3 className="font-bold text-base text-slate-900 group-hover:text-purple-800 transition-colors line-clamp-2 leading-snug mb-1">
                        {event.title}
                      </h3>

                      {event.speakerName && (
                        <p className="text-xs text-slate-500 font-medium mb-3 flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                          <span className="truncate">{event.speakerName}</span>
                        </p>
                      )}

                      <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs text-slate-500">
                        <div className="flex items-center gap-1 truncate text-slate-600">
                          <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                          <span className="truncate">{event.location || 'Online'}</span>
                        </div>

                        <div className="font-extrabold text-sm text-slate-900 shrink-0 bg-slate-100/80 px-2.5 py-1 rounded-lg">
                          {formatEventPrice(event.price)}
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="rounded-xl border-slate-200"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                </Button>

                <div className="flex items-center gap-1.5 px-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                        currentPage === page
                          ? 'bg-purple-900 text-white shadow-md'
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="rounded-xl border-slate-200"
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Personalized Recommendations */}
      <RecommendedEvents events={events} />
    </div>
  );
}
