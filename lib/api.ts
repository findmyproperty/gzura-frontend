const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

export interface User {
  id: string;
  email: string;
  role: 'MEMBER' | 'HOST' | 'ADMIN';
  status?: 'ACTIVE' | 'BLOCKED';
  lastLoginAt?: string | null;
  firstName: string;
  lastName: string;
  phone?: string | null;
  city?: string | null;
  profession?: string | null;
  onboardingGoal?: string | null;
  onboardingInterests?: string[] | null;
  onboardingCompletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: 'Online' | 'Offline';
  dateStart: string;
  dateEnd?: string | null;
  timeLabel?: string | null;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  meetingRoomId?: string | null;
  meetingUrl?: string | null;
  meetingStartedAt?: string | null;
  meetingLive?: boolean;
  seatsRemaining?: number | null;
  venue?: string | null;
  speakerName?: string | null;
  speakerBio?: string | null;
  hostId?: string | null;
  host?: User | null;
  courseOutline?: string | null;
  imageUrl?: string | null;
  galleryImages?: string[] | null;
  price: string | number;
  memberPrice?: string | number | null;
  maxAttendees?: number | null;
  featured: boolean;
  status: 'DRAFT' | 'PUBLISHED';
  _count?: { registrations: number };
}

export interface DashboardStats {
  totals: {
    ongoingEvents: number;
    registeredUsers: number;
    totalRevenue: number;
    newRegistrations: number;
    totalRegistrations: number;
  };
  registrationsByMonth: { month: string; label: string; count: number }[];
  revenueByMonth: { month: string; label: string; revenue: number }[];
  topEvents: { title: string; registrations: number }[];
}

export type PaymentStatus = 'FREE' | 'PENDING' | 'PAID';

export interface EventRegistration {
  id: string;
  eventId: string;
  fullName: string;
  email: string;
  phone?: string | null;
  city?: string | null;
  profession?: string | null;
  accessToken?: string;
  passUrl?: string;
  paymentStatus?: PaymentStatus;
  amountPaid?: number | null;
  checkedInAt?: string | null;
  createdAt: string;
  event?: Event;
}

export interface PassValidationResult {
  valid: boolean;
  status: 'enrolled' | 'checked_in' | 'invalid';
  message: string;
  attendee?: {
    fullName: string;
    email: string;
    eventTitle: string;
    venue: string;
    eventDate: string;
  };
  checkedInAt?: string | null;
}

export interface RazorpayOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  eventTitle: string;
  price: number;
}

export type EventContentType = 'TEXT' | 'PDF' | 'WORD' | 'EXCEL';

export interface EventContentItem {
  id: string;
  eventId: string;
  title: string;
  contentType: EventContentType;
  textContent?: string | null;
  fileUrl?: string | null;
  fileName?: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export type CommunityRegistrationStatus = 'pending' | 'approved' | 'rejected';

export interface CommunityRegistration {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  gender?: string | null;
  profession?: string | null;
  interest?: string | null;
  message?: string | null;
  status: CommunityRegistrationStatus;
  createdAt: string;
}

export type AdminRegistrationRow =
  | ({ kind: 'event' } & EventRegistration)
  | ({ kind: 'community' } & CommunityRegistration);

const TOKEN_KEY = 'gzura_token';
const TOKEN_MAX_AGE = 7 * 24 * 60 * 60;

function syncAuthCookie(token: string) {
  if (typeof document === 'undefined') return;
  const hasCookie = document.cookie.split(';').some((part) =>
    part.trim().startsWith(`${TOKEN_KEY}=`),
  );
  if (!hasCookie) {
    document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${TOKEN_MAX_AGE}; SameSite=Lax`;
  }
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;

  const fromStorage = localStorage.getItem(TOKEN_KEY);
  if (fromStorage) {
    // Middleware reads the cookie; keep it in sync with localStorage.
    syncAuthCookie(fromStorage);
    return fromStorage;
  }

  const match = document.cookie.match(/(?:^|;\s*)gzura_token=([^;]*)/);
  if (!match?.[1]) return null;

  try {
    const fromCookie = decodeURIComponent(match[1]);
    localStorage.setItem(TOKEN_KEY, fromCookie);
    return fromCookie;
  } catch {
    return match[1];
  }
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${TOKEN_MAX_AGE}; SameSite=Lax`;
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  document.cookie = 'gzura_token=; path=/; max-age=0';
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('gzura_user_cache');
  }
}

export async function fetchApi<T>(
  path: string,
  options: RequestInit = {},
  auth = false,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new Error(
      'Unable to reach the API. Make sure the backend is running on port 8001.',
    );
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Request failed' }));
    const message = Array.isArray(err.message)
      ? err.message.join(', ')
      : err.message || err.error || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return res.json();
}

export async function uploadFileApi<T>(
  path: string,
  file: File,
  fieldName = 'file',
): Promise<T> {
  const formData = new FormData();
  formData.append(fieldName, file);

  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers,
      body: formData,
    });
  } catch {
    throw new Error(
      'Unable to reach the API. Make sure the backend is running on port 8001.',
    );
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Upload failed' }));
    const message = Array.isArray(err.message)
      ? err.message.join(', ')
      : err.message || err.error || `Upload failed (${res.status})`;
    throw new Error(message);
  }

  return res.json();
}

export const api = {
  register: (data: Record<string, string>) =>
    fetchApi<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (email: string, password: string) =>
    fetchApi<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  loginWithGoogle: (credential: string) =>
    fetchApi<AuthResponse>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ credential }),
    }),

  adminLogin: (email: string, password: string) =>
    fetchApi<AuthResponse>('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  me: () => fetchApi<User>('/auth/me', {}, true),

  completeOnboarding: (goal: string, interests: string[]) =>
    fetchApi<User>(
      '/auth/onboarding',
      { method: 'POST', body: JSON.stringify({ goal, interests }) },
      true,
    ),

  getEvents: (all = false) =>
    fetchApi<Event[]>(`/events${all ? '?all=true' : ''}`),

  getEvent: (id: string, all = false) =>
    fetchApi<Event>(`/events/${id}${all ? '?all=true' : ''}`),

  createEvent: (data: Record<string, unknown>) =>
    fetchApi<Event>('/events', { method: 'POST', body: JSON.stringify(data) }, true),

  updateEvent: (id: string, data: Record<string, unknown>) =>
    fetchApi<Event>(`/events/${id}`, { method: 'PATCH', body: JSON.stringify(data) }, true),

  deleteEvent: (id: string) =>
    fetchApi<Event>(`/events/${id}`, { method: 'DELETE' }, true),

  uploadEventThumbnail: (file: File) =>
    uploadFileApi<{ url: string; filename: string }>(
      '/uploads/event-thumbnail',
      file,
    ),

  uploadEventContent: (file: File) =>
    uploadFileApi<{
      url: string;
      filename: string;
      originalName: string;
      contentType: EventContentType;
    }>('/uploads/event-content', file),

  getEventContent: (eventId: string) =>
    fetchApi<EventContentItem[]>(`/events/${eventId}/content`, {}, true),

  createEventContent: (
    eventId: string,
    data: {
      title: string;
      contentType: EventContentType;
      textContent?: string;
      fileUrl?: string;
      fileName?: string;
      sortOrder?: number;
    },
  ) =>
    fetchApi<EventContentItem>(
      `/events/${eventId}/content`,
      { method: 'POST', body: JSON.stringify(data) },
      true,
    ),

  deleteEventContent: (eventId: string, contentId: string) =>
    fetchApi<{ deleted: boolean }>(
      `/events/${eventId}/content/${contentId}`,
      { method: 'DELETE' },
      true,
    ),

  registerForEvent: (data: Record<string, string>) =>
    fetchApi<EventRegistration>(
      '/registrations',
      { method: 'POST', body: JSON.stringify(data) },
      true,
    ),

  joinEvent: (eventId: string) =>
    fetchApi<EventRegistration>(
      '/registrations/join',
      { method: 'POST', body: JSON.stringify({ eventId }) },
      true,
    ),

  validatePass: (accessToken: string) =>
    fetchApi<PassValidationResult>('/registrations/validate-pass', {
      method: 'POST',
      body: JSON.stringify({ accessToken }),
    }),

  checkInPass: (accessToken: string) =>
    fetchApi<PassValidationResult>(
      '/registrations/check-in',
      { method: 'POST', body: JSON.stringify({ accessToken }) },
      true,
    ),

  createRazorpayOrder: (eventId: string) =>
    fetchApi<RazorpayOrderResponse>(
      '/payments/razorpay/order',
      { method: 'POST', body: JSON.stringify({ eventId }) },
      true,
    ),

  verifyRazorpayPayment: (data: {
    eventId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) =>
    fetchApi<EventRegistration>(
      '/payments/razorpay/verify',
      { method: 'POST', body: JSON.stringify(data) },
      true,
    ),

  getMyRegistrations: () =>
    fetchApi<EventRegistration[]>('/registrations/my', {}, true),

  getRegistrations: (eventId?: string) =>
    fetchApi<EventRegistration[]>(
      `/registrations${eventId ? `?eventId=${eventId}` : ''}`,
      {},
      true,
    ),

  getRegistration: (id: string) =>
    fetchApi<EventRegistration>(`/registrations/${id}`, {}, true),

  submitCommunityRegistration: (data: Record<string, string>) =>
    fetchApi<CommunityRegistration>('/community-registrations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getCommunityRegistrations: () =>
    fetchApi<CommunityRegistration[]>('/community-registrations', {}, true),

  getCommunityRegistration: (id: string) =>
    fetchApi<CommunityRegistration>(`/community-registrations/${id}`, {}, true),

  createCommunityRegistration: (data: Record<string, string>) =>
    fetchApi<CommunityRegistration>(
      '/community-registrations',
      { method: 'POST', body: JSON.stringify(data) },
      true,
    ),

  updateCommunityRegistration: (id: string, data: Record<string, string>) =>
    fetchApi<CommunityRegistration>(
      `/community-registrations/${id}`,
      { method: 'PATCH', body: JSON.stringify(data) },
      true,
    ),

  deleteCommunityRegistration: (id: string) =>
    fetchApi<{ deleted: boolean }>(
      `/community-registrations/${id}`,
      { method: 'DELETE' },
      true,
    ),

  getDashboardStats: () =>
    fetchApi<DashboardStats>('/admin/stats', {}, true),

  getUsers: () => fetchApi<User[]>('/users', {}, true),

  getHostUsers: () => fetchApi<User[]>('/users/hosts', {}, true),

  getUser: (id: string) => fetchApi<User>(`/users/${id}`, {}, true),

  createUser: (data: Record<string, unknown>) =>
    fetchApi<User>('/users', { method: 'POST', body: JSON.stringify(data) }, true),

  updateUser: (id: string, data: Record<string, unknown>) =>
    fetchApi<User>(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) }, true),

  deleteUser: (id: string) =>
    fetchApi<{ deleted: boolean }>(`/users/${id}`, { method: 'DELETE' }, true),

  contact: (data: Record<string, string>) =>
    fetchApi('/contact', { method: 'POST', body: JSON.stringify(data) }),
};
