'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Calendar,
  BookOpen,
  Loader2,
  MapPin,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
  Users,
  Video,
} from 'lucide-react';
import { api, Event, User } from '@/lib/api';
import { bioForHost, hostOptionLabel, labelForHost } from '@/lib/host-users';
import {
  AdminDataTable,
  AdminEmptyRow,
  AdminPageHeader,
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeaderCell,
  AdminTableRow,
  formatAdminDate,
  PillBadge,
  StatusBadge,
} from '@/components/admin/AdminDataTable';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { parseEventPrice } from '@/lib/price';
import { normalizeRichText } from '@/lib/rich-text';
import { slugify } from '@/lib/slug';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EventFormCard } from '@/components/admin/EventFormCard';
import { EventImageGalleryUpload } from '@/components/admin/EventImageGalleryUpload';
import { GoogleMeetFields } from '@/components/admin/GoogleMeetFields';
import { getEventImages } from '@/lib/event-images';
import TimeRangePicker from '@/components/admin/TimeRangePicker';
import { useAuth } from '@/components/providers/AuthProvider';
import { isFullAdmin } from '@/lib/user-roles';
import { toast } from '@/hooks/use-toast';

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
    <div className="min-h-[200px] animate-pulse rounded-md border border-input bg-muted/30" />
  ),
});

const emptyForm = {
  title: '',
  description: '',
  courseOutline: '',
  type: 'Offline' as 'Online' | 'Offline',
  dateStart: '',
  timeLabel: '',
  location: '',
  venue: '',
  latitude: '',
  longitude: '',
  speakerName: '',
  speakerBio: '',
  hostId: 'manual',
  imageUrls: [] as string[],
  price: '0',
  maxAttendees: '',
  meetingLink: '',
  status: 'DRAFT' as 'DRAFT' | 'PUBLISHED',
};

export default function AdminEventsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const canPickAnyHost = user ? isFullAdmin(user.role) : false;
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [hosts, setHosts] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [meetingMeta, setMeetingMeta] = useState<{
    meetLink?: string | null;
    totalSeats?: number | null;
    seatsRemaining?: number | null;
  }>({});
  const [eventToDelete, setEventToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadEvents = () => {
    setLoading(true);
    api
      .getEvents(true)
      .then(setEvents)
      .catch((err) =>
        toast({
          title: 'Failed to load events',
          description: err instanceof Error ? err.message : 'Request failed',
          variant: 'destructive',
        }),
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    api.getHostUsers().then(setHosts).catch(() => setHosts([]));
  }, []);

  useEffect(() => {
    const editId = searchParams.get('edit');
    if (!editId || events.length === 0) return;
    const event = events.find((item) => item.id === editId);
    if (event) {
      openEdit(event);
      router.replace('/admin/events');
    }
  }, [searchParams, events, router]);

  const handleHostChange = (hostId: string) => {
    const host = hosts.find((item) => item.id === hostId);
    setForm((prev) => ({
      ...prev,
      hostId,
      speakerName: host ? labelForHost(host) : prev.speakerName,
      speakerBio: host && !prev.speakerBio ? bioForHost(host) : prev.speakerBio,
    }));
  };

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();
    return events.filter((event) => {
      const matchesSearch =
        !query ||
        event.title.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query) ||
        event.type.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === 'all' || event.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [events, search, statusFilter]);

  const openEdit = (event: Event) => {
    const matchedHost =
      hosts.find((host) => host.id === event.hostId) ??
      hosts.find((host) => labelForHost(host) === event.speakerName);
    setEditingId(event.id);
    setMeetingMeta({
      meetLink: event.meetingUrl || event.meetingRoomId,
      totalSeats: event.maxAttendees,
      seatsRemaining: event.seatsRemaining,
    });
    setForm({
      title: event.title,
      description: event.description,
      type: event.type,
      dateStart: event.dateStart.split('T')[0],
      timeLabel: event.timeLabel || '',
      location: event.location,
      venue: event.venue || '',
      latitude: event.latitude != null ? String(event.latitude) : '',
      longitude: event.longitude != null ? String(event.longitude) : '',
      speakerName: event.speakerName || '',
      speakerBio: event.speakerBio || '',
      courseOutline: event.courseOutline || '',
      hostId: event.hostId || matchedHost?.id || 'manual',
      imageUrls: getEventImages(event),
      price: String(event.price),
      maxAttendees: event.maxAttendees ? String(event.maxAttendees) : '',
      meetingLink: event.meetingUrl || event.meetingRoomId || '',
      status: event.status,
    });
    setDialogOpen(true);
  };

  useEffect(() => {
    if (!dialogOpen || !editingId || form.hostId !== 'manual' || !form.speakerName) return;
    const matchedHost = hosts.find((host) => labelForHost(host) === form.speakerName);
    if (matchedHost) {
      setForm((prev) => ({ ...prev, hostId: matchedHost.id }));
    }
  }, [dialogOpen, editingId, form.hostId, form.speakerName, hosts]);

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
        hostId: hostId !== 'manual' ? hostId : undefined,
      };
      let saved: Event;
      if (editingId) {
        saved = await api.updateEvent(editingId, savePayload);
        toast({ title: 'Event updated' });
        setDialogOpen(false);
        loadEvents();
        return;
      }

      saved = await api.createEvent({
        ...savePayload,
        slug: slugify(form.title),
      });
      toast({ title: 'Event created' });

      if (saved?.id) {
        router.push(`/admin/events/${saved.id}`);
        return;
      }

      setDialogOpen(false);
      loadEvents();
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to save',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!eventToDelete) return;

    setDeleting(true);
    try {
      await api.deleteEvent(eventToDelete.id);
      toast({ title: 'Event deleted' });
      setEventToDelete(null);
      loadEvents();
    } catch {
      toast({ title: 'Delete failed', variant: 'destructive' });
    } finally {
      setDeleting(false);
    }
  };

  const togglePublish = async (event: Event) => {
    const next = event.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      await api.updateEvent(event.id, { status: next });
      toast({ title: next === 'PUBLISHED' ? 'Event published' : 'Event moved to draft' });
      loadEvents();
    } catch (err) {
      toast({
        title: 'Update failed',
        description: err instanceof Error ? err.message : 'Could not update status',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader breadcrumb="Admin / Events" title="Event Management" />

      <AdminDataTable
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search events"
        loading={loading}
        filters={
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] bg-gray-50 border-gray-200">
              <SelectValue placeholder="All status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
            </SelectContent>
          </Select>
        }
        actions={
          <Button asChild className="btn-primary">
            <Link href="/admin/events/new">
              <Plus className="w-4 h-4 mr-2" />
              Add event
            </Link>
          </Button>
        }
      >
        <AdminTable minWidth="860px">
          <AdminTableHead>
            <AdminTableHeaderCell>Event</AdminTableHeaderCell>
            <AdminTableHeaderCell>Date</AdminTableHeaderCell>
            <AdminTableHeaderCell>Type</AdminTableHeaderCell>
            <AdminTableHeaderCell>Status</AdminTableHeaderCell>
            <AdminTableHeaderCell>Registrations</AdminTableHeaderCell>
            <AdminTableHeaderCell className="w-12" />
          </AdminTableHead>
          <AdminTableBody>
            {filteredEvents.map((event) => (
              <AdminTableRow
                key={event.id}
                onClick={() => router.push(`/admin/events/${event.id}`)}
              >
                <AdminTableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5 text-purple-deep" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{event.title}</p>
                      <p className="text-gray-500 text-xs truncate">{event.location}</p>
                    </div>
                  </div>
                </AdminTableCell>
                <AdminTableCell className="text-gray-600 whitespace-nowrap">
                  {formatAdminDate(event.dateStart)}
                </AdminTableCell>
                <AdminTableCell>
                  <PillBadge>{event.type}</PillBadge>
                </AdminTableCell>
                <AdminTableCell>
                  <StatusBadge
                    label={event.status === 'PUBLISHED' ? 'Published' : 'Draft'}
                    tone={event.status === 'PUBLISHED' ? 'success' : 'muted'}
                  />
                </AdminTableCell>
                <AdminTableCell className="text-gray-600">
                  {event._count?.registrations ?? 0}
                </AdminTableCell>
                <AdminTableCell
                  className="px-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="p-2 rounded-lg text-gray-400 hover:text-purple-deep hover:bg-gray-100 transition-colors"
                        aria-label="Event actions"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem onClick={() => openEdit(event)}>
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit event
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => togglePublish(event)}>
                        {event.status === 'PUBLISHED' ? 'Move to draft' : 'Publish event'}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={() =>
                          setEventToDelete({ id: event.id, title: event.title })
                        }
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete event
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </AdminTableCell>
              </AdminTableRow>
            ))}
            {filteredEvents.length === 0 && (
              <AdminEmptyRow colSpan={6} message="No events match your filters" />
            )}
          </AdminTableBody>
        </AdminTable>
      </AdminDataTable>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-3xl max-h-[90vh] overflow-y-auto border-purple-100/80 p-0 gap-0">
          <div className="h-1 bg-gradient-to-r from-purple-deep via-purple-600 to-gold-400" />
          <div className="p-4 sm:p-6 pt-4 sm:pt-5">
          <DialogHeader className="mb-1">
            <DialogTitle className="font-display text-2xl text-purple-deep">
              {editingId ? 'Edit Event' : 'Add Event'}
            </DialogTitle>
            <p className="text-sm text-gray-500 pt-1">
              {form.type === 'Online'
                ? 'Set up your virtual session details'
                : 'Choose a venue and schedule for your in-person event'}
            </p>
          </DialogHeader>
          <form onSubmit={handleSave} className="min-w-0 space-y-5 pt-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) => {
                    const type = v as 'Online' | 'Offline';
                    setForm((prev) => {
                      if (type === 'Online') {
                        return {
                          ...prev,
                          type,
                          location: prev.location.trim() || 'Google Meet',
                          venue: '',
                          latitude: '',
                          longitude: '',
                        };
                      }

                      return {
                        ...prev,
                        type,
                        location:
                          prev.location === 'Google Meet' ? '' : prev.location,
                        meetingLink: '',
                        maxAttendees: '',
                      };
                    });
                  }}
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

            <EventImageGalleryUpload
              value={form.imageUrls}
              onChange={(imageUrls) => setForm((prev) => ({ ...prev, imageUrls }))}
            />

            <div className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
              <EventFormCard
                icon={<BookOpen className="h-3.5 w-3.5 text-purple-deep" />}
                title="Course details"
              >
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
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
                              hosts.length
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
                      {hosts.length === 0 && canPickAnyHost ? (
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
                        placeholder="Name shown on the course"
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
                    <Label>Course outline</Label>
                    <Textarea
                      value={form.courseOutline}
                      onChange={(e) => setForm({ ...form, courseOutline: e.target.value })}
                      placeholder={"Module 1 - ...\nModule 2 - ...\nModule 3 - ..."}
                      rows={6}
                    />
                  </div>
                </div>
              </EventFormCard>
            </div>

            {form.type === 'Online' ? (
              <div className="relative overflow-hidden rounded-2xl border border-purple-100 bg-gradient-to-br from-white via-purple-50/40 to-gold-50/30 p-5 shadow-sm shadow-purple-500/5 space-y-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-deep to-purple-700 shadow-lg shadow-purple-500/20">
                    <Video className="h-5 w-5 text-gold-300" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-lg font-semibold text-purple-deep">
                      Online event details
                    </p>
                    <p className="text-xs text-gray-500">Google Meet link and capacity</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-start">
                  <EventFormCard
                    icon={<Users className="h-3.5 w-3.5 text-purple-deep" />}
                    title="Capacity"
                  >
                    <div className="space-y-1">
                      <span className="text-[11px] font-medium text-gray-500">
                        Total seats
                      </span>
                      <Input
                        type="number"
                        min={1}
                        value={form.maxAttendees}
                        onChange={(e) =>
                          setForm({ ...form, maxAttendees: e.target.value })
                        }
                        placeholder="e.g. 50"
                        className="h-11 border-purple-100 bg-white/90 shadow-sm focus-visible:border-purple-300 focus-visible:ring-purple-deep/15"
                        required
                      />
                    </div>
                  </EventFormCard>
                  <TimeRangePicker
                    value={form.timeLabel}
                    onChange={(timeLabel) => setForm({ ...form, timeLabel })}
                  />
                </div>
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
                    onChange={(e) =>
                      setForm({ ...form, meetingLink: e.target.value })
                    }
                    placeholder="https://meet.google.com/abc-defg-hij"
                  />
                  <p className="text-[11px] text-gray-500">
                    Leave empty to auto-create via Google Calendar when credentials are configured.
                  </p>
                </div>
                <GoogleMeetFields
                  meetLink={meetingMeta.meetLink}
                  totalSeats={
                    form.maxAttendees
                      ? parseInt(form.maxAttendees, 10)
                      : meetingMeta.totalSeats
                  }
                  seatsRemaining={meetingMeta.seatsRemaining}
                />
              </div>
            ) : (
              <div className="relative overflow-hidden rounded-2xl border border-purple-100 bg-gradient-to-br from-white via-purple-50/30 to-gold-50/20 p-5 shadow-sm shadow-purple-500/5 space-y-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-deep to-purple-700 shadow-lg shadow-purple-500/20">
                    <MapPin className="h-5 w-5 text-gold-300" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-lg font-semibold text-purple-deep">
                      Offline event details
                    </p>
                    <p className="text-xs text-gray-500">
                      Enter venue details — map pin is optional
                    </p>
                  </div>
                </div>
                <LocationMapPicker
                  visible={dialogOpen}
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
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-start">
                  <TimeRangePicker
                    value={form.timeLabel}
                    onChange={(timeLabel) => setForm({ ...form, timeLabel })}
                  />
                  <EventFormCard
                    icon={<Users className="h-3.5 w-3.5 text-purple-deep" />}
                    title="Capacity"
                  >
                    <div className="space-y-1">
                      <span className="text-[11px] font-medium text-gray-500">
                        Max attendees (optional)
                      </span>
                      <Input
                        type="number"
                        min={1}
                        value={form.maxAttendees}
                        onChange={(e) =>
                          setForm({ ...form, maxAttendees: e.target.value })
                        }
                        placeholder="Leave empty for unlimited"
                        className="h-11 border-purple-100 bg-white/90 shadow-sm focus-visible:border-purple-300 focus-visible:ring-purple-deep/15"
                      />
                    </div>
                  </EventFormCard>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) =>
                  setForm({ ...form, status: v as 'DRAFT' | 'PUBLISHED' })
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
            <div className="space-y-2">
              <Label>
                Course summary <span className="text-gray-400 font-normal">(optional)</span>
              </Label>
              <RichTextEditor
                value={form.description}
                onChange={(description) => setForm({ ...form, description })}
                placeholder="Describe the course, the promise for learners, and what they will take away."
              />
            </div>
            <div className="flex flex-col-reverse gap-3 border-t border-purple-50 pt-4 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="border-purple-200 text-purple-deep hover:bg-purple-50"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="btn-primary min-w-[130px]">
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : editingId ? (
                  'Save changes'
                ) : (
                  'Add event'
                )}
              </Button>
            </div>
          </form>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!eventToDelete}
        onOpenChange={(open) => {
          if (!open && !deleting) setEventToDelete(null);
        }}
      >
        <AlertDialogContent className="border-purple-100">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-purple-deep">
              Delete event?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{' '}
              <span className="font-medium text-gray-900">
                {eventToDelete?.title}
              </span>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              onClick={(e) => {
                e.preventDefault();
                void confirmDelete();
              }}
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting…
                </>
              ) : (
                'Delete event'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
