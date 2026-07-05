export function isOnlineEvent(event: { type: string }) {
  return event.type === 'Online';
}

export function isGoogleMeetLink(value?: string | null) {
  return !!value && value.includes('meet.google.com');
}

export function getScheduledMeetingStart(dateStart: string) {
  return new Date(dateStart);
}

export function formatMeetingSchedule(dateStart: string, timeLabel?: string | null) {
  const date = getScheduledMeetingStart(dateStart);
  const dateText = date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const timeText =
    timeLabel?.trim() ||
    date.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    });
  return `${dateText} at ${timeText}`;
}