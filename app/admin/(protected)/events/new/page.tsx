'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { AdminDetailLayout } from '@/components/admin/AdminDetailLayout';
import { getAvatarColor, getInitialsFromFullName } from '@/components/admin/AdminDataTable';
import { EventFormSection } from '@/components/admin/EventFormCard';
import { EventImageGalleryUpload } from '@/components/admin/EventImageGalleryUpload';
import TimeRangePicker from '@/components/admin/TimeRangePicker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/components/providers/AuthProvider';
import { toast } from '@/hooks/use-toast';
import { api, Event } from '@/lib/api';
import { bioForHost, hostOptionLabel, labelForHost } from '@/lib/host-users';
import { isFullAdmin } from '@/lib/user-roles';
import { normalizeRichText } from '@/lib/rich-text';
import { parseEventPrice } from '@/lib/price';
import { slugify } from '@/lib/slug';
import { cn } from '@/lib/utils';

const LocationMapPicker = dynamic(
  () => import('@/components/admin/LocationMapPicker'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50/50 to-white text-sm text-purple-deep/70">
        Loading map…
      </div>
    ),
  },
);

const RichTextEditor = dynamic(() => import('@/components/ui/rich-text-editor'), {
  ssr: false,
  loading: () => (
    <div className="min-h-[220px] animate-pulse rounded-2xl border border-gray-200 bg-gray-50/80" />
  ),
});

type EventFormState = {
  title: string;
  description: string;
  courseOutline: string;
  type: 'Online' | 'Offline';
  dateStart: string;
  timeLabel: string;
  location: string;
  venue: string;
  latitude: string;
  longitude: string;
  speakerName: string;
  speakerBio: string;
  hostId: string;
  imageUrls: string[];
  price: string;
  maxAttendees: string;
  meetingLink: string;
  status: 'DRAFT' | 'PUBLISHED' | 'PENDING';
};

const emptyForm: EventFormState = {
  title: '',
  description: '',
  courseOutline: '',
  type: 'Offline',
  dateStart: '',
  timeLabel: '',
  location: '',
  venue: '',
  latitude: '',
  longitude: '',
  speakerName: '',
  speakerBio: '',
  hostId: '',
  imageUrls: [],
  price: '0',
  maxAttendees: '',
  meetingLink: '',
  status: 'DRAFT',
};

export default function CreateEventPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [hosts, setHosts] = useState<Awaited<ReturnType<typeof api.getHostUsers>>>([]);
  const [loadingHosts, setLoadingHosts] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<EventFormState>(emptyForm);
  const canPickAnyHost = user ? isFullAdmin(user.role) : false;

  useEffect(() => {
    api
      .getHostUsers()
      .then(async (list) => {
        let fullList = list;
        if (!fullList.length) {
          try {
            fullList = await api.getUsers();
          } catch {
            fullList = [];
          }
        }
        setHosts(fullList);
        if (user?.role === 'HOST') {
          const self = fullList.find((h) => h.id === user.id);
          if (self) {
            setForm((prev) => ({
              ...prev,
              hostId: self.id,
              speakerName: labelForHost(self),
              speakerBio: prev.speakerBio || bioForHost(self),
            }));
          } else {
            setForm((prev) => ({
              ...prev,
              hostId: user.id,
              speakerName:
                prev.speakerName ||
                `${user.firstName} ${user.lastName}`.trim() ||
                user.email,
            }));
          }
        }
      })
      .catch(() => setHosts([]))
      .finally(() => setLoadingHosts(false));
  }, [user]);

  const handleHostChange = (hostId: string) => {
    const host = hosts.find((item) => item.id === hostId);
    setForm((prev) => ({
      ...prev,
      hostId,
      speakerName: host ? labelForHost(host) : prev.speakerName,
      speakerBio: host && !prev.speakerBio ? bioForHost(host) : prev.speakerBio,
    }));
  };

  const handleTypeChange = (value: 'Online' | 'Offline') => {
    setForm((prev) => {
      if (value === 'Online') {
        return {
          ...prev,
          type: value,
          location: prev.location.trim() || 'Google Meet',
          venue: '',
          latitude: '',
          longitude: '',
        };
      }

      return {
        ...prev,
        type: value,
        location: prev.location === 'Google Meet' ? '' : prev.location,
        meetingLink: '',
        maxAttendees: '',
      };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      form.type === 'Offline' &&
      !form.location.trim() &&
      !form.venue.trim()
    ) {
      toast({
        title: 'Venue required',
        description: 'Enter a venue name or address. The map pin is optional.',
        variant: 'destructive',
      });
      return;
    }

    if (!form.hostId) {
      toast({
        title: 'Host required',
        description: 'Please select a host for this event.',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      const offlineLocation =
        form.location.trim() || form.venue.trim() || undefined;

      const payload = {
        ...form,
        location:
          form.type === 'Offline'
            ? offlineLocation
            : form.location,
        description: normalizeRichText(form.description) || undefined,
        courseOutline: form.courseOutline.trim() || undefined,
        speakerName: form.speakerName.trim() || undefined,
        speakerBio: form.speakerBio.trim() || undefined,
        galleryImages: form.imageUrls.length ? form.imageUrls : undefined,
        imageUrl: form.imageUrls[0] || undefined,
        price: parseEventPrice(form.price),
        maxAttendees:
          form.type === 'Online'
            ? parseInt(form.maxAttendees, 10)
            : form.maxAttendees
              ? parseInt(form.maxAttendees, 10)
              : undefined,
        meetingLink:
          form.type === 'Online' && form.meetingLink.trim()
            ? form.meetingLink.trim()
            : undefined,
        latitude:
          form.type === 'Offline' && form.latitude
            ? parseFloat(form.latitude)
            : undefined,
        longitude:
          form.type === 'Offline' && form.longitude
            ? parseFloat(form.longitude)
            : undefined,
        featured: false,
      };
      const { imageUrls, hostId, ...rest } = payload;
      const savePayload = {
        ...rest,
        slug: slugify(form.title),
        hostId: hostId,
      };
      const saved: Event = await api.createEvent(savePayload);
      toast({ title: 'Event created' });

      if (saved?.id) {
        router.push(`/admin/events/${saved.id}`);
        return;
      }

      router.push('/admin/events');
    } catch (err) {
      toast({
        title: 'Could not create event',
        description: err instanceof Error ? err.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminDetailLayout
      backHref="/admin/events"
      backLabel="Back to events"
      title="Create Event"
    >
      <form id="event-create-form" onSubmit={handleSave}>
        <div className="space-y-8 md:space-y-10">
          <EventFormSection
            step={1}
            title="Core event info"
            description="Name your event and set the basics — type, date, and pricing."
            badge="Basics"
          >
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Leadership Summit 2026"
                required
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={form.type}
                  onValueChange={(value) => handleTypeChange(value as 'Online' | 'Offline')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Online">Online</SelectItem>
                    <SelectItem value="Offline">Offline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={form.dateStart}
                  onChange={(e) => setForm({ ...form, dateStart: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Price (₹)</Label>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
                <p className="text-xs text-gray-500">
                  Set to 0 for free enrollment — users can join without payment.
                </p>
              </div>
            </div>
          </EventFormSection>

          <EventFormSection
            step={2}
            title="Event images"
            description="Upload a gallery for the event page. The first image becomes the cover."
            badge="Media"
          >
            <EventImageGalleryUpload
              value={form.imageUrls}
              onChange={(imageUrls) => setForm((prev) => ({ ...prev, imageUrls }))}
            />
          </EventFormSection>

          <EventFormSection
            step={3}
            title="Course details"
            description="Instructor profile, what learners get, and how the course is structured."
            badge="Content"
          >
            <div className="space-y-4">
              <div className="rounded-xl border border-purple-100 bg-gradient-to-br from-white to-purple-50/40 p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm',
                      getAvatarColor(form.hostId || form.speakerName || 'host'),
                    )}
                  >
                    {getInitialsFromFullName(form.speakerName)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-purple-deep/50">
                      Instructor
                    </p>
                    <p className="truncate text-sm font-semibold text-purple-deep">
                      {form.speakerName || 'Select a host'}
                    </p>
                    {form.speakerBio ? (
                      <p className="truncate text-xs text-gray-500">{form.speakerBio}</p>
                    ) : null}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-medium text-gray-500">Host</Label>
                    {canPickAnyHost ? (
                      <>
                        <Select
                          value={form.hostId}
                          onValueChange={(value) => {
                            handleHostChange(value);
                          }}
                        >
                          <SelectTrigger className="h-11 border-purple-100 bg-white">
                            <SelectValue
                              placeholder={
                                loadingHosts
                                  ? 'Loading hosts…'
                                  : hosts.length
                                    ? 'Select a host'
                                    : 'No host users found'
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {hosts.map((host) => (
                              <SelectItem key={host.id} value={host.id}>
                                {hostOptionLabel(host)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {!loadingHosts && hosts.length === 0 ? (
                          <p className="text-xs text-gray-500">
                            Add users with the Host role in{' '}
                            <Link
                              href="/admin/users"
                              className="font-medium text-purple-deep underline"
                            >
                              Users
                            </Link>
                            .
                          </p>
                        ) : null}
                      </>
                    ) : (
                      <>
                        <Input
                          value={form.speakerName || 'You'}
                          readOnly
                          className="h-11 bg-purple-50/50 border-purple-100"
                        />
                        <p className="text-xs text-gray-500">
                          You are set as the host for this event.
                        </p>
                      </>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-medium text-gray-500">Display name</Label>
                    <Input
                      value={form.speakerName}
                      onChange={(e) => setForm({ ...form, speakerName: e.target.value })}
                      placeholder="Name shown on the course"
                      readOnly={true}
                      required
                      className="h-11 border-purple-100 bg-purple-50/50"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[11px] font-medium text-gray-500">Host details</Label>
                  <Textarea
                    value={form.speakerBio}
                    onChange={(e) => setForm({ ...form, speakerBio: e.target.value })}
                    placeholder="Short bio, expertise, or teaching background."
                    rows={4}
                    className="min-h-[96px] resize-none border-purple-100 bg-white"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-purple-100 bg-gradient-to-br from-white to-purple-50/40 p-4 space-y-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-purple-deep/50">
                    Course outline
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    List modules one per line. Learners see this on the event page.
                  </p>
                </div>
                <Textarea
                  value={form.courseOutline}
                  onChange={(e) => setForm({ ...form, courseOutline: e.target.value })}
                  placeholder={'Module 1 — Foundations\nModule 2 — Practice\nModule 3 — Wrap-up'}
                  rows={8}
                  className="min-h-[180px] resize-none border-purple-100 bg-white font-mono text-[13px] leading-relaxed"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Course summary</Label>
              <RichTextEditor
                value={form.description}
                onChange={(description) => setForm({ ...form, description })}
                placeholder="Describe the course, the promise for learners, and what they will take away."
              />
            </div>
          </EventFormSection>

          <EventFormSection
            step={4}
            title={
              form.type === 'Online' ? 'Online session details' : 'Offline venue details'
            }
            description={
              form.type === 'Online'
                ? 'Meeting link, capacity, and session time for your virtual event.'
                : 'Venue, map pin, capacity, and schedule for your in-person event.'
            }
            badge={form.type === 'Online' ? 'Online' : 'Offline'}
          >
            {form.type === 'Online' ? (
              <div className="space-y-5 rounded-xl border border-purple-100 bg-gradient-to-br from-purple-50/50 via-white to-gold-50/30 p-4 sm:p-5">
                <div className="grid gap-5 lg:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Online label</Label>
                    <Input
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      placeholder="Google Meet"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Google Meet link (optional fallback)</Label>
                    <Input
                      value={form.meetingLink}
                      onChange={(e) => setForm({ ...form, meetingLink: e.target.value })}
                      placeholder="https://meet.google.com/abc-defg-hij"
                    />
                  </div>
                </div>
                <div className="grid gap-5 lg:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Total seats</Label>
                    <Input
                      type="number"
                      min={1}
                      value={form.maxAttendees}
                      onChange={(e) => setForm({ ...form, maxAttendees: e.target.value })}
                      placeholder="e.g. 50"
                      required
                    />
                  </div>
                  <TimeRangePicker
                    value={form.timeLabel}
                    onChange={(timeLabel) => setForm({ ...form, timeLabel })}
                    variant="bare"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-5 rounded-xl border border-purple-100 bg-gradient-to-br from-purple-50/40 via-white to-gold-50/25 p-4 sm:p-5">
                <LocationMapPicker
                  visible
                  location={form.location}
                  venue={form.venue}
                  latitude={form.latitude ? parseFloat(form.latitude) : null}
                  longitude={form.longitude ? parseFloat(form.longitude) : null}
                  onLocationChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      location: value.location,
                      venue: value.venue || prev.venue,
                      latitude: String(value.latitude),
                      longitude: String(value.longitude),
                    }))
                  }
                  onLocationTextChange={(location) =>
                    setForm((prev) => ({ ...prev, location }))
                  }
                  onVenueChange={(venue) => setForm((prev) => ({ ...prev, venue }))}
                />
                <p className="text-xs text-gray-500">
                  Map pin is optional. You can edit the address and venue fields above.
                </p>
                <div className="grid gap-5 lg:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Max attendees</Label>
                    <Input
                      type="number"
                      min={1}
                      value={form.maxAttendees}
                      onChange={(e) => setForm({ ...form, maxAttendees: e.target.value })}
                      placeholder="Leave empty for unlimited"
                    />
                  </div>
                  <TimeRangePicker
                    value={form.timeLabel}
                    onChange={(timeLabel) => setForm({ ...form, timeLabel })}
                    variant="bare"
                  />
                </div>
              </div>
            )}
          </EventFormSection>

          <EventFormSection
            step={5}
            title="Visibility"
            description={
              canPickAnyHost
                ? 'Choose whether this event is a draft or published for members.'
                : 'Choose whether this event is a draft or submit it for admin approval.'
            }
            badge={canPickAnyHost ? 'Publish' : 'Approval'}
          >
            <div className="space-y-2 sm:max-w-xs">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(value) =>
                  setForm({ ...form, status: value as 'DRAFT' | 'PUBLISHED' | 'PENDING' })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  {canPickAnyHost ? (
                    <>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="PUBLISHED">Published</SelectItem>
                    </>
                  ) : (
                    <SelectItem value="PENDING">Submit for review</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </EventFormSection>

          <div className="flex flex-col-reverse gap-3 rounded-2xl border border-purple-100 bg-white px-5 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-sm text-gray-500">
              Review each section above, then create the event.
            </p>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button asChild variant="outline" className="border-gray-200">
                <Link href="/admin/events">Cancel</Link>
              </Button>
              <Button type="submit" disabled={saving} className="btn-primary min-w-[140px]">
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Create event'
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </AdminDetailLayout>
  );
}
