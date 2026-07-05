export const INTEREST_OPTIONS = [
  { value: 'entrepreneurship', label: 'Entrepreneurship' },
  { value: 'leadership', label: 'Leadership Development' },
  { value: 'networking', label: 'Networking Events' },
  { value: 'mentorship', label: 'Mentorship Programs' },
  { value: 'personal_growth', label: 'Personal Growth' },
] as const;

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
] as const;

export const REGISTRATION_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
] as const;

const STATUS_LABELS: Record<string, string> = Object.fromEntries(
  REGISTRATION_STATUS_OPTIONS.map((option) => [option.value, option.label]),
);

const INTEREST_LABELS: Record<string, string> = Object.fromEntries(
  INTEREST_OPTIONS.map((option) => [option.value, option.label]),
);

const GENDER_LABELS: Record<string, string> = Object.fromEntries(
  GENDER_OPTIONS.map((option) => [option.value, option.label]),
);

export function formatInterestLabel(value?: string | null) {
  if (!value) return '—';
  return INTEREST_LABELS[value] ?? value.replace(/_/g, ' ');
}

export function formatGenderLabel(value?: string | null) {
  if (!value) return '—';
  return GENDER_LABELS[value] ?? value;
}

export function formatRegistrationStatusLabel(
  value?: string | null,
) {
  if (!value) return 'Pending';
  return STATUS_LABELS[value] ?? value;
}

export function getRegistrationStatusTone(
  status?: string | null,
): 'success' | 'danger' | 'muted' {
  if (status === 'approved') return 'success';
  if (status === 'rejected') return 'danger';
  return 'muted';
}