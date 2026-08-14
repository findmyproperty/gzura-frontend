'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Calendar,
  BookOpen,
  History,
  Loader2,
  MapPin,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
  Users,
  Video,
  AlertCircle,
} from 'lucide-react';
import { api, Event, User, eventForEditor, getEventRejectionReason, hasPendingEdits } from '@/lib/api';
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
  AdminTablePagination,
  AdminTableRow,
  formatAdminDate,
  getAvatarColor,
  getInitialsFromFullName,
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
import { EventActivityLogDialog } from '@/components/admin/EventActivityLogDialog';
import { EventImageGalleryUpload } from '@/components/admin/EventImageGalleryUpload';
import { GoogleMeetFields } from '@/components/admin/GoogleMeetFields';
import { getEventImages } from '@/lib/event-images';
import { cn } from '@/lib/utils';
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
  hostId: '',
  imageUrls: [] as string[],
  price: '0',
  maxAttendees: '',
  meetingLink: '',
  status: 'DRAFT' as
    | 'DRAFT'
    | 'PENDING_APPROVAL'
    | 'APPROVED'
    | 'REJECTED'
    | 'RESUBMITTED'
    | 'PUBLISHED'
    | 'PENDING',
  rejectionReason: '',
  resubmissionComment: '',
};

const PAGE_SIZE = 10;

export default function AdminEventsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const isAdmin = user ? isFullAdmin(user.role) : false;
  const canPickAnyHost = isAdmin;
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [hosts, setHosts] = useState<User[]>([]);
  const [loadingHosts, setLoadingHosts] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
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
  const [logEvent, setLogEvent] = useState<Event | null>(null);
  const [rejectedListOpen, setRejectedListOpen] = useState(false);

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
    api.getHostUsers().then(setHosts).catch(() => setHosts([])).finally(() => setLoadingHosts(false));
  }, []);

  useEffect(() => {
    const status = searchParams.get('status');
    if (status === 'PENDING' || status === 'APPROVAL') {
      setStatusFilter('APPROVAL');
    } else if (
      status === 'PUBLISHED' ||
      status === 'REJECTED' ||
      status === 'DRAFT'
    ) {
      setStatusFilter(status);
    }
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
        statusFilter === 'all' ||
        (statusFilter === 'APPROVAL' &&
          (event.status === 'PENDING' || hasPendingEdits(event))) ||
        event.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [events, search, statusFilter]);

  const rejectedEvents = useMemo(
    () => events.filter((event) => event.status === 'REJECTED'),
    [events],
  );
  const approvalRequests = useMemo(
    () =>
      events.filter(
        (event) => event.status === 'PENDING' || hasPendingEdits(event),
      ),
    [events],
  );

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / PAGE_SIZE));

  const paginatedEvents = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredEvents.slice(start, start + PAGE_SIZE);
  }, [filteredEvents, page]);

  // Reset to first page when filters change or current page is out of range
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const openEdit = async (event: Event) => {
    const matchedHost =
      hosts.find((host) => host.id === event.hostId) ??
      hosts.find((host) => labelForHost(host) === event.speakerName);
    setEditingId(event.id);
    setMeetingMeta({
      meetLink: event.meetingUrl || event.meetingRoomId,
      totalSeats: event.maxAttendees,
      seatsRemaining: event.seatsRemaining,
    });

    let source = event;
    try {
      source = await api.getEvent(event.id, true);
      setEvents((prev) =>
        prev.map((item) => (item.id === source.id ? { ...item, ...source } : item)),
      );
    } catch {
      source = event;
    }

    source = eventForEditor(source);

    setForm({
      title: source.title,
      description: source.description,
      type: source.type,
      dateStart: source.dateStart.split('T')[0],
      timeLabel: source.timeLabel || '',
      location: source.location,
      venue: source.venue || '',
      latitude: source.latitude != null ? String(source.latitude) : '',
      longitude: source.longitude != null ? String(source.longitude) : '',
      speakerName: source.speakerName || '',
      speakerBio: source.speakerBio || '',
      courseOutline: source.courseOutline || '',
      hostId: source.hostId || matchedHost?.id || '',
      rejectionReason: getEventRejectionReason(source),
      resubmissionComment: '',
      imageUrls: getEventImages(source),
      price: String(source.price),
      maxAttendees: source.maxAttendees ? String(source.maxAttendees) : '',
      meetingLink: source.meetingUrl || source.meetingRoomId || '',
      status: source.status,
    });
    setDialogOpen(true);
  };

  useEffect(() => {
    if (!dialogOpen || !editingId || !form.speakerName) return;
    const matchedHost = hosts.find((host) => labelForHost(host) === form.speakerName);
    if (matchedHost) {
      setForm((prev) => ({ ...prev, hostId: matchedHost.id }));
    }
  }, [dialogOpen, editingId, form.speakerName, hosts]);

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
      const { imageUrls, hostId, rejectionReason, resubmissionComment, ...rest } =
        payload;
      const resubmitting = form.status === 'REJECTED';
      const submittingPublishedEdits =
        !canPickAnyHost && form.status === 'PUBLISHED';
      const savePayload = {
        ...rest,
        hostId: hostId,
        ...(resubmitting
          ? {
              status: 'PENDING' as const,
              ...(resubmissionComment.trim()
                ? { resubmissionComment: resubmissionComment.trim() }
                : {}),
            }
          : submittingPublishedEdits
            ? {
                status: 'PUBLISHED' as const,
                ...(resubmissionComment.trim()
                  ? { resubmissionComment: resubmissionComment.trim() }
                  : {}),
              }
            : canPickAnyHost && rejectionReason.trim()
              ? { rejectionReason: rejectionReason.trim() }
              : {}),
      };
      let saved: Event;
      if (editingId) {
        saved = await api.updateEvent(editingId, savePayload);
        toast({
          title: resubmitting
            ? 'Event resubmitted for review'
            : submittingPublishedEdits
              ? 'Changes submitted for admin approval'
              : 'Event updated',
        });
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
    <div className="flex min-h-0 flex-1 flex-col">
      <AdminPageHeader breadcrumb="Admin / Events" title="Event Management" />

      <AdminDataTable
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search events"
        loading={loading}
        filters={
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-10 w-[150px] rounded-full border-gray-200 bg-white shadow-none focus:border-gray-200 focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-1 focus-visible:ring-purple-200 focus-visible:ring-offset-0">
              <SelectValue placeholder="All status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
            </SelectContent>
          </Select>
        }
        actions={
          <div className="flex items-center gap-2">
            {isAdmin && approvalRequests.length > 0 && (
              <Button
                variant="outline"
                className="relative border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800"
                onClick={() => setStatusFilter('APPROVAL')}
              >
                Approval Requests
                <span className="ml-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white">
                  {approvalRequests.length}
                </span>
              </Button>
            )}
            {!isAdmin && rejectedEvents.length > 0 && (
              <Button
                variant="outline"
                className="relative border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800"
                onClick={() => setRejectedListOpen(true)}
              >
                Rejected list
                <span className="ml-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {rejectedEvents.length}
                </span>
              </Button>
            )}
            <Button asChild className="btn-admin">
              <Link href="/admin/events/new">
                <Plus className="w-4 h-4 mr-2" />
                Add event
              </Link>
            </Button>
          </div>
        }
        footer={
          filteredEvents.length > 0 ? (
            <AdminTablePagination
              page={page}
              totalPages={totalPages}
              totalItems={filteredEvents.length}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
              itemLabel="events"
            />
          ) : null
        }
      >
        <AdminTable minWidth="860px">
          <AdminTableHead>
            <AdminTableHeaderCell className={isAdmin ? 'w-[28%]' : 'w-[38%]'}>
              Event
            </AdminTableHeaderCell>
            {isAdmin && <AdminTableHeaderCell className="w-[16%]">Host</AdminTableHeaderCell>}
            <AdminTableHeaderCell className="w-[16%]">Date</AdminTableHeaderCell>
            <AdminTableHeaderCell className="w-[12%]">Type</AdminTableHeaderCell>
            <AdminTableHeaderCell className="w-[14%]">Status</AdminTableHeaderCell>
            <AdminTableHeaderCell className="w-[12%]">Registrations</AdminTableHeaderCell>
            <AdminTableHeaderCell className="w-14" />
          </AdminTableHead>
          <AdminTableBody>
            {paginatedEvents.map((event) => (
              <AdminTableRow
                key={event.id}
                onClick={() => router.push(`/admin/events/${event.id}`)}
              >
                <AdminTableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-[#F4F3F1] flex items-center justify-center shrink-0">
                      <Calendar className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{event.title}</p>
                      <p className="mt-1 text-gray-500 text-xs truncate">{event.location}</p>
                    </div>
                  </div>
                </AdminTableCell>
                {isAdmin && (
                  <AdminTableCell>
                    {event.host ? (
                      <div className="min-w-0 max-w-[150px] lg:max-w-[200px]">
                        <p className="font-medium text-gray-900 truncate">
                          {event.host.firstName} {event.host.lastName}
                        </p>
                        <p className="text-gray-500 text-xs truncate">
                          {event.host.email}
                        </p>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">No host</span>
                    )}
                  </AdminTableCell>
                )}
                <AdminTableCell className="text-gray-600 whitespace-nowrap">
                  {formatAdminDate(event.dateStart)}
                </AdminTableCell>
                <AdminTableCell>
                  <PillBadge>{event.type}</PillBadge>
                </AdminTableCell>
                <AdminTableCell>
                  <div className="flex flex-col gap-1">
                    {event.status === 'PUBLISHED' || event.status === 'APPROVED' ? (
                      <StatusBadge label="Approved & Live" tone="success" />
                    ) : event.status === 'PENDING_APPROVAL' || event.status === 'PENDING' ? (
                      <StatusBadge label="Pending Approval" tone="warning" />
                    ) : event.status === 'RESUBMITTED' ? (
                      <StatusBadge label="Resubmitted" tone="warning" />
                    ) : event.status === 'REJECTED' ? (
                      <StatusBadge label="Rejected" tone="danger" />
                    ) : (
                      <StatusBadge label="Draft" tone="muted" />
                    )}
                    {hasPendingEdits(event) ? (
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                        Edits pending
                      </span>
                    ) : event.pendingChanges?.status === 'REJECTED' ? (
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-red-600">
                        Edits rejected
                      </span>
                    ) : null}
                  </div>
                </AdminTableCell>
                <AdminTableCell className="tabular-nums font-medium text-gray-700">
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
                      <DropdownMenuItem onClick={() => setLogEvent(event)}>
                        <History className="w-4 h-4 mr-2" />
                        Show log
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
              <AdminEmptyRow colSpan={isAdmin ? 7 : 6} message="No events match your filters" />
            )}
          </AdminTableBody>
        </AdminTable>
      </AdminDataTable>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-3xl max-h-[90vh] overflow-y-auto border-purple-100/80 p-0 gap-0 [&>button]:right-5 [&>button]:top-5 [&>button]:z-20 [&>button]:flex [&>button]:h-8 [&>button]:w-8 [&>button]:items-center [&>button]:justify-center [&>button]:rounded-full [&>button]:border [&>button]:border-purple-100 [&>button]:bg-white [&>button]:opacity-100 [&>button]:shadow-sm [&>button]:hover:bg-purple-50 [&>button]:hover:opacity-100">
          <div className="h-1 bg-gradient-to-r from-purple-deep via-purple-600 to-gold-400" />
          <div className="p-4 sm:p-6 pt-4 sm:pt-5">
          <DialogHeader className="mb-1 pr-10">
            <div className="flex items-start justify-between gap-3">
              <div>
                <DialogTitle className="font-display text-2xl text-purple-deep">
                  {editingId ? 'Edit Event' : 'Add Event'}
                </DialogTitle>
                <p className="text-sm text-gray-500 pt-1">
                  {form.type === 'Online'
                    ? 'Set up your virtual session details'
                    : 'Choose a venue and schedule for your in-person event'}
                </p>
              </div>
              {editingId ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="shrink-0 border-purple-200 text-purple-deep hover:bg-purple-50"
                  onClick={() =>
                    setLogEvent(events.find((item) => item.id === editingId) ?? null)
                  }
                >
                  <History className="w-4 h-4 mr-2" />
                  Show log
                </Button>
              ) : null}
            </div>
          </DialogHeader>
          <form onSubmit={handleSave} className="min-w-0 space-y-5 pt-4">
            {!canPickAnyHost && editingId && form.status === 'PUBLISHED' ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-3">
                <p className="text-sm font-semibold text-amber-900">
                  {events.find((item) => item.id === editingId)?.pendingChanges?.status === 'REJECTED'
                    ? 'Your latest edits were rejected'
                    : hasPendingEdits(events.find((item) => item.id === editingId) ?? null)
                      ? 'Edits waiting for admin approval'
                      : 'This event is live'}
                </p>
                <p className="text-sm text-amber-800">
                  {events.find((item) => item.id === editingId)?.pendingChanges?.status === 'REJECTED'
                    ? events.find((item) => item.id === editingId)?.pendingChanges?.rejectionReason ||
                      'An admin rejected these edits. The published event is unchanged. Update and submit again.'
                    : 'Your changes will not appear on the live event until an admin approves them.'}
                </p>
                <div className="space-y-2">
                  <Label className="text-amber-900">Comments for admin</Label>
                  <Textarea
                    value={form.resubmissionComment}
                    onChange={(e) =>
                      setForm({ ...form, resubmissionComment: e.target.value })
                    }
                    placeholder="Describe what you changed."
                    className="border-amber-200 bg-white"
                    rows={3}
                  />
                </div>
              </div>
            ) : null}
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

            <div className="relative overflow-hidden rounded-2xl border border-purple-100 bg-gradient-to-br from-white via-purple-50/40 to-gold-50/20 p-5 shadow-sm shadow-purple-500/5 space-y-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-deep to-purple-700 shadow-lg shadow-purple-500/20">
                  <BookOpen className="h-5 w-5 text-gold-300" />
                </div>
                <div className="min-w-0">
                  <p className="font-display text-lg font-semibold text-purple-deep">
                    Course details
                  </p>
                  <p className="text-xs text-gray-500">
                    Instructor profile and how the course is structured
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-purple-100/90 bg-white/90 p-4 space-y-4">
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
                      {hosts.length === 0 && canPickAnyHost ? (
                        <p className="text-xs text-gray-500">
                          Add users with the Host role in{' '}
                          <Link href="/admin/users" className="font-medium text-purple-deep underline">
                            Users
                          </Link>
                          .
                        </p>
                      ) : null}
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

                <div className="rounded-xl border border-purple-100/90 bg-white/90 p-4 space-y-3">
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

            {form.status !== 'REJECTED' &&
              !(!canPickAnyHost && form.status === 'PUBLISHED') && (
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) =>
                    setForm({ ...form, status: v as 'DRAFT' | 'PUBLISHED' | 'PENDING' | 'REJECTED' })
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
                        <SelectItem value="REJECTED">Rejected</SelectItem>
                      </>
                    ) : (
                      <SelectItem value="PENDING">Submit for review</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            {form.status === 'REJECTED' && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-red-900">
                      Rejection reason
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-red-800">
                      {form.rejectionReason ||
                        'No rejection reason was recorded. Check the activity log for details.'}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-red-800">Resubmission comments</Label>
                  <p className="text-xs text-red-700/80">
                    Describe what you changed. This is saved in the activity log with the resubmit date and time.
                  </p>
                  <Textarea
                    value={form.resubmissionComment}
                    onChange={(e) =>
                      setForm({ ...form, resubmissionComment: e.target.value })
                    }
                    placeholder="e.g. Updated the course outline and corrected the schedule."
                    className="border-red-200 focus-visible:ring-red-500 bg-white"
                    rows={3}
                  />
                </div>
              </div>
            )}
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
                ) : editingId && form.status === 'REJECTED' ? (
                  'Resubmit for review'
                ) : editingId && !canPickAnyHost && form.status === 'PUBLISHED' ? (
                  'Submit for approval'
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

      <EventActivityLogDialog
        event={logEvent}
        open={!!logEvent}
        onOpenChange={(open) => {
          if (!open) setLogEvent(null);
        }}
      />

      <Dialog open={rejectedListOpen} onOpenChange={setRejectedListOpen}>
        <DialogContent className="max-w-lg gap-0 p-0 overflow-hidden">
          <DialogHeader className="border-b border-red-100 bg-red-50 px-6 py-4">
            <DialogTitle className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              Rejected list
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto p-4 space-y-3">
            {rejectedEvents.map((event) => {
              const reason = getEventRejectionReason(event);
              return (
                <div
                  key={event.id}
                  className="rounded-xl border border-red-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-red-900 truncate">{event.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {formatAdminDate(event.dateStart)}
                      </p>
                    </div>
                    <StatusBadge label="Rejected" tone="danger" />
                  </div>
                  <p className="mt-2 text-sm text-red-800 whitespace-pre-wrap line-clamp-3">
                    {reason || 'No rejection reason was recorded.'}
                  </p>
                  <div className="mt-3 flex justify-end">
                    <Button
                      size="sm"
                      className="btn-primary"
                      onClick={() => {
                        setRejectedListOpen(false);
                        void openEdit(event);
                      }}
                    >
                      <Pencil className="w-3.5 h-3.5 mr-2" />
                      Fix & resubmit
                    </Button>
                  </div>
                </div>
              );
            })}
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
