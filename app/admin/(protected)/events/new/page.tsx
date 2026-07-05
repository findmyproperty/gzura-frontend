'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { AdminDetailLayout } from '@/components/admin/AdminDetailLayout';
import { EventImageGalleryUpload } from '@/components/admin/EventImageGalleryUpload';
import TimeRangePicker from '@/components/admin/TimeRangePicker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { api, Event } from '@/lib/api';
import { bioForHost, hostOptionLabel, labelForHost } from '@/lib/host-users';
import { normalizeRichText } from '@/lib/rich-text';
import { parseEventPrice } from '@/lib/price';
import { slugify } from '@/lib/slug';

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
  status: 'DRAFT' | 'PUBLISHED';
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
  hostId: 'manual',
  imageUrls: [],
  price: '0',
  maxAttendees: '',
  meetingLink: '',
  status: 'DRAFT',
};

export default function CreateEventPage() {
  const router = useRouter();
  const [hosts, setHosts] = useState<Awaited<ReturnType<typeof api.getHostUsers>>>([]);
  const [loadingHosts, setLoadingHosts] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<EventFormState>(emptyForm);

  useEffect(() => {
    api
      .getHostUsers()
      .then(setHosts)
      .catch(() => setHosts([]))
      .finally(() => setLoadingHosts(false));
  }, []);

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

    if (form.type === 'Offline' && !form.location.trim()) {
      toast({
        title: 'Location required',
        description: 'Pick a location on the map for offline events.',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
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
        hostId: hostId !== 'manual' ? hostId : undefined,
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
        <div className="space-y-6">
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between gap-3">
                <h2 className="text-base font-semibold text-purple-deep">Core event info</h2>
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-purple-deep/40">
                  Basics
                </p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Leadership Summit 2026"
                    required
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={form.type} onValueChange={(value) => handleTypeChange(value as 'Online' | 'Offline')}>
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
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-base font-semibold text-purple-deep">Event images</h2>
              <EventImageGalleryUpload
                value={form.imageUrls}
                onChange={(imageUrls) => setForm((prev) => ({ ...prev, imageUrls }))}
              />
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-base font-semibold text-purple-deep">
                Instructor, summary, and outline
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Instructor</Label>
                  <Select
                    value={form.hostId}
                    onValueChange={(value) => {
                      if (value === 'manual') {
                        setForm((prev) => ({ ...prev, hostId: 'manual' }));
                        return;
                      }
                      handleHostChange(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          loadingHosts
                            ? 'Loading instructors…'
                            : hosts.length
                              ? 'Select an instructor from users'
                              : 'No instructor users found'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual instructor</SelectItem>
                      {hosts.map((host) => (
                        <SelectItem key={host.id} value={host.id}>
                          {hostOptionLabel(host)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!loadingHosts && hosts.length === 0 ? (
                    <p className="text-xs text-gray-500">
                      Add users with the Instructor role in{' '}
                      <Link href="/admin/users" className="font-medium text-purple-deep underline">
                        Users
                      </Link>{' '}
                      to populate this list.
                    </p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label>Instructor name</Label>
                  <Input
                    value={form.speakerName}
                    onChange={(e) => setForm({ ...form, speakerName: e.target.value })}
                    placeholder="Dr. Angela Okonkwo"
                    readOnly={form.hostId !== 'manual'}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Instructor details</Label>
                <Textarea
                  value={form.speakerBio}
                  onChange={(e) => setForm({ ...form, speakerBio: e.target.value })}
                  placeholder="Short bio, expertise, teaching background, or speaking experience."
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>Course summary</Label>
                <RichTextEditor
                  value={form.description}
                  onChange={(description) => setForm({ ...form, description })}
                  placeholder="Describe the course, the promise for learners, and what they will take away."
                />
              </div>
              <div className="space-y-2">
                <Label>Course outline</Label>
                <Textarea
                  value={form.courseOutline}
                  onChange={(e) => setForm({ ...form, courseOutline: e.target.value })}
                  placeholder={"Module 1 - ...\nModule 2 - ...\nModule 3 - ..."}
                  rows={6}
                />
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-base font-semibold text-purple-deep">
                {form.type === 'Online' ? 'Online session details' : 'Offline venue details'}
              </h2>
              {form.type === 'Online' ? (
                <div className="space-y-4 rounded-2xl border border-purple-100 bg-gradient-to-br from-white via-purple-50/40 to-gold-50/30 p-5">
                  <div className="grid gap-4 lg:grid-cols-2">
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
                  <div className="grid gap-4 lg:grid-cols-2">
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
                <div className="space-y-4 rounded-2xl border border-purple-100 bg-gradient-to-br from-white via-purple-50/30 to-gold-50/20 p-5">
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
                    onVenueChange={(venue) => setForm((prev) => ({ ...prev, venue }))}
                  />
                  <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
                    <div className="space-y-2">
                      <Label>Venue</Label>
                      <Input
                        value={form.venue}
                        onChange={(e) => setForm({ ...form, venue: e.target.value })}
                        placeholder="Grand Convention Center"
                      />
                    </div>
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
                  </div>
                  <TimeRangePicker
                    value={form.timeLabel}
                    onChange={(timeLabel) => setForm({ ...form, timeLabel })}
                    variant="bare"
                  />
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-base font-semibold text-purple-deep">Visibility</h2>
              <div className="space-y-2 sm:max-w-xs">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(value) =>
                    setForm({ ...form, status: value as 'DRAFT' | 'PUBLISHED' })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </section>

          <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end">
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
      </form>
    </AdminDetailLayout>
  );
}
