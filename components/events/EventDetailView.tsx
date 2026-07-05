import Link from 'next/link';
import { BookOpen, Calendar, Clock, MapPin, User } from 'lucide-react';
import EventDetailActions from '@/components/events/EventDetailActions';
import EventContentViewer from '@/components/events/EventContentViewer';
import RichTextContent from '@/components/ui/rich-text-content';
import { Event } from '@/lib/api';
import { getEventImages } from '@/lib/event-images';
import { formatEventPrice } from '@/lib/price';
import { cn } from '@/lib/utils';

type EventDetailViewProps = {
  event: Event;
  backHref: string;
  backLabel: string;
  shell: 'public' | 'member';
};

export default function EventDetailView({
  event,
  backHref,
  backLabel,
  shell,
}: EventDetailViewProps) {
  const price = Number(event.price);
  const memberPrice =
    event.memberPrice != null ? Number(event.memberPrice) : null;
  const isMemberShell = shell === 'member';
  const images = getEventImages(event);

  return (
    <>
      <section
        className={cn(
          'gradient-bg pb-12',
          isMemberShell ? 'pt-8 sm:pt-10' : 'pt-32',
        )}
      >
        <div className="container-custom">
          <Link
            href={backHref}
            className="mb-4 inline-block text-sm text-white/70 hover:text-gold-400"
          >
            {backLabel}
          </Link>
          <span className="mb-4 ml-4 inline-block rounded-full bg-gold-royal/20 px-3 py-1 text-xs font-semibold text-gold-400">
            {event.type}
          </span>
          <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            {event.title}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-white/80 sm:gap-6">
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gold-400" />
              {new Date(event.dateStart).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            {event.timeLabel ? (
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gold-400" />
                {event.timeLabel}
              </span>
            ) : null}
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gold-400" />
              {event.location}
            </span>
          </div>
        </div>
      </section>

      <section className={cn('bg-white', isMemberShell ? 'py-10 sm:py-12' : 'section-padding')}>
        <div className="container-custom grid gap-8 lg:grid-cols-3 lg:gap-12">
          <div className="space-y-8 lg:col-span-2">
            {images.length > 0 ? (
              <div
                className={cn(
                  'grid gap-3',
                  images.length === 1 ? 'grid-cols-1' : 'grid-cols-2 sm:grid-cols-3',
                )}
              >
                {images.map((url, index) => (
                  <img
                    key={`${url}-${index}`}
                    src={url}
                    alt={`${event.title} image ${index + 1}`}
                    className={cn(
                      'w-full rounded-2xl object-cover shadow-xl',
                      index === 0 && images.length > 1
                        ? 'col-span-2 sm:col-span-2 aspect-[16/9]'
                        : 'aspect-square',
                    )}
                  />
                ))}
              </div>
            ) : null}
            {event.description ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="heading-md mb-4 text-purple-deep">Course Summary</h2>
                <RichTextContent html={event.description} />
              </div>
            ) : null}
            {event.speakerName ? (
              <div className="rounded-2xl border border-purple-100 bg-purple-50 p-6">
                <div className="mb-3 flex items-center gap-3">
                  <User className="h-5 w-5 text-gold-royal" />
                  <h3 className="font-semibold text-purple-deep">Instructor Details</h3>
                </div>
                <p className="font-medium text-gray-900">{event.speakerName}</p>
                {event.speakerBio ? (
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {event.speakerBio}
                  </p>
                ) : null}
              </div>
            ) : null}
            {event.courseOutline ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-purple-deep" />
                  <h3 className="font-semibold text-purple-deep">Course Outline</h3>
                </div>
                <div className="space-y-3 text-sm leading-relaxed text-gray-700 whitespace-pre-line">
                  {event.courseOutline}
                </div>
              </div>
            ) : null}
            {isMemberShell ? <EventContentViewer eventId={event.id} /> : null}
          </div>

          <div>
            <div className="sticky top-24 rounded-2xl border border-gray-100 bg-white p-6 shadow-xl sm:p-8">
              <div className="mb-6">
                <p className="mb-1 text-sm text-gray-500">Enrollment</p>
                <p className="text-3xl font-bold text-purple-deep">
                  {formatEventPrice(event.price)}
                </p>
                {memberPrice !== null && memberPrice < price ? (
                  <p className="mt-1 text-sm font-medium text-gold-royal">
                    Member price: {formatEventPrice(event.memberPrice)}
                  </p>
                ) : null}
              </div>
              {event.venue ? (
                <p className="mb-6 text-sm text-gray-600">
                  <strong>Venue:</strong> {event.venue}
                </p>
              ) : null}
              {event.type === 'Online' && event.maxAttendees ? (
                <p className="mb-4 text-sm text-gray-600">
                  <strong>Seats:</strong>{' '}
                  {event.seatsRemaining != null
                    ? `${event.seatsRemaining} of ${event.maxAttendees} remaining`
                    : `${event.maxAttendees} total`}
                </p>
              ) : null}
              <EventDetailActions event={event} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
