export type Time24 = `${string}:${string}`;

export function generateTimeOptions(intervalMinutes = 30): string[] {
  const options: string[] = [];
  for (let minutes = 0; minutes < 24 * 60; minutes += intervalMinutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    options.push(
      `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`,
    );
  }
  return options;
}

export function to12HourLabel(time24: string): string {
  if (!time24) return '';
  const match = time24.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return time24;

  const hours = parseInt(match[1], 10);
  const minutes = match[2];
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${minutes} ${period}`;
}

export function parse12HourLabel(label: string): string {
  const match = label.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return '';

  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const period = match[3].toUpperCase();

  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  return `${String(hours).padStart(2, '0')}:${minutes}`;
}

export function parseTimeLabel(
  label: string,
): { start: string; end: string } {
  if (!label?.trim()) {
    return { start: '', end: '' };
  }

  const parts = label.split(/\s*-\s*/).map((part) => part.trim());
  if (parts.length >= 2) {
    return {
      start: parse12HourLabel(parts[0]) || parts[0],
      end: parse12HourLabel(parts[1]) || parts[1],
    };
  }

  const single = parse12HourLabel(parts[0]) || parts[0];
  return { start: single, end: '' };
}

export function formatTimeLabel(start: string, end: string): string {
  if (!start && !end) return '';
  if (start && end) {
    return `${to12HourLabel(start)} - ${to12HourLabel(end)}`;
  }
  return to12HourLabel(start || end);
}