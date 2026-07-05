import { Event } from '@/lib/api';
import { MemberPreferences } from '@/lib/member-onboarding';

const GOAL_KEYWORDS: Record<string, string[]> = {
  leadership: ['leadership', 'leader', 'summit', 'executive', 'management'],
  entrepreneurship: ['entrepreneur', 'bootcamp', 'business', 'startup', 'founder'],
  networking: ['network', 'mixer', 'community', 'connect', 'meetup'],
  empowerment: ['empowerment', 'women', 'growth', 'personal', 'potential'],
};

const PROGRAM_KEYWORDS: Record<string, string[]> = {
  'entrepreneurship-workshops': ['entrepreneur', 'business', 'workshop', 'bootcamp', 'startup'],
  'leadership-development': ['leadership', 'leader', 'summit', 'development'],
  'networking-events': ['network', 'mixer', 'community', 'connect'],
  'business-mentorship': ['mentor', 'business', 'guidance'],
  'personal-growth': ['growth', 'personal', 'mindset', 'productivity'],
  'empowerment-initiatives': ['empowerment', 'women', 'men', 'potential'],
};

function eventSearchText(event: Event): string {
  return [
    event.title,
    event.description,
    event.speakerName,
    event.venue,
    event.location,
    event.type,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function matchesKeywords(text: string, keywords: string[]): number {
  let score = 0;
  for (const keyword of keywords) {
    if (text.includes(keyword)) score += 2;
  }
  return score;
}

export function scoreEventForPreferences(
  event: Event,
  preferences: MemberPreferences | null,
): number {
  if (!preferences) return 0;

  const text = eventSearchText(event);
  let score = 0;

  score += matchesKeywords(text, GOAL_KEYWORDS[preferences.goal] ?? []);
  for (const interest of preferences.interests) {
    score += matchesKeywords(text, PROGRAM_KEYWORDS[interest] ?? []);
  }

  if (event.featured) score += 1;

  return score;
}

export function getRecommendedEvents(
  events: Event[],
  preferences: MemberPreferences | null,
  limit = 6,
): Event[] {
  if (!preferences) {
    return events.filter((event) => event.featured).slice(0, limit);
  }

  const ranked = events
    .map((event) => ({ event, score: scoreEventForPreferences(event, preferences) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  if (ranked.length === 0) {
    return events.slice(0, limit);
  }

  return ranked.slice(0, limit).map((item) => item.event);
}