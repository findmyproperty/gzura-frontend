import { api, User } from '@/lib/api';

const ONBOARDING_KEY = 'gzura_onboarding_complete';
const PREFERENCES_KEY = 'gzura_member_preferences';

export interface MemberPreferences {
  goal: string;
  interests: string[];
  completedAt: string;
}

export function preferencesFromUser(user?: User | null): MemberPreferences | null {
  if (!user?.onboardingCompletedAt || !user.onboardingGoal) return null;

  return {
    goal: user.onboardingGoal,
    interests: user.onboardingInterests ?? [],
    completedAt: user.onboardingCompletedAt,
  };
}

export function isOnboardingComplete(user?: User | null): boolean {
  if (user?.onboardingCompletedAt) return true;
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(ONBOARDING_KEY) === 'true';
}

export function getMemberPreferences(user?: User | null): MemberPreferences | null {
  const fromUser = preferencesFromUser(user);
  if (fromUser) return fromUser;

  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(PREFERENCES_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as MemberPreferences;
  } catch {
    return null;
  }
}

function cachePreferencesLocally(goal: string, interests: string[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ONBOARDING_KEY, 'true');
  localStorage.setItem(
    PREFERENCES_KEY,
    JSON.stringify({
      goal,
      interests,
      completedAt: new Date().toISOString(),
    } satisfies MemberPreferences),
  );
}

export async function completeOnboarding(
  goal: string,
  interests: string[],
  refreshUser?: () => Promise<void>,
) {
  const profile = await api.completeOnboarding(goal, interests);
  cachePreferencesLocally(goal, interests);
  await refreshUser?.();
  return profile;
}

export function clearOnboarding() {
  localStorage.removeItem(ONBOARDING_KEY);
  localStorage.removeItem(PREFERENCES_KEY);
}

/** Step 1 — aligned with GZURA mission: leaders, entrepreneurs, community */
export const MEMBER_GOALS = [
  {
    id: 'leadership',
    label: 'Develop Leadership Skills',
    description:
      'Build confidence, communication, and leadership through GZURA programs.',
    icon: 'users',
  },
  {
    id: 'entrepreneurship',
    label: 'Start or Grow My Business',
    description:
      'Learn business planning, marketing, and growth strategies with our community.',
    icon: 'briefcase',
  },
  {
    id: 'networking',
    label: 'Expand My Network',
    description:
      'Connect with entrepreneurs, mentors, and industry professionals in our community.',
    icon: 'target',
  },
  {
    id: 'empowerment',
    label: 'Personal Growth & Empowerment',
    description:
      'Develop mindset, productivity, and reach your full potential.',
    icon: 'heart',
  },
] as const;

/** Step 2 — matches Programs section on the GZURA website */
export const GZURA_PROGRAMS = [
  {
    id: 'entrepreneurship-workshops',
    label: 'Entrepreneurship Workshops',
    description: 'Business planning, marketing, sales, and growth strategies.',
    color: 'bg-purple-600',
    icon: 'briefcase',
  },
  {
    id: 'leadership-development',
    label: 'Leadership Development',
    description: 'Confidence, communication, and leadership skills.',
    color: 'bg-gold-500',
    icon: 'users',
  },
  {
    id: 'networking-events',
    label: 'Networking Events',
    description: 'Meet entrepreneurs, mentors, and professionals.',
    color: 'bg-purple-deep',
    icon: 'target',
  },
  {
    id: 'business-mentorship',
    label: 'Business Mentorship',
    description: 'Guidance from experienced entrepreneurs and leaders.',
    color: 'bg-gold-royal',
    icon: 'sparkles',
  },
  {
    id: 'personal-growth',
    label: 'Personal Growth Programs',
    description: 'Mindset, productivity, and self-improvement.',
    color: 'bg-purple-600',
    icon: 'heart',
  },
  {
    id: 'empowerment-initiatives',
    label: 'Women & Men Empowerment Initiatives',
    description: 'Programs empowering individuals to achieve their potential.',
    color: 'bg-gold-500',
    icon: 'graduation',
  },
] as const;

export function getGoalLabel(goalId: string) {
  return MEMBER_GOALS.find((g) => g.id === goalId)?.label ?? null;
}

export function getProgramLabel(programId: string) {
  return GZURA_PROGRAMS.find((p) => p.id === programId)?.label ?? programId;
}

export const LEARNING_GOALS = MEMBER_GOALS;
export const INTEREST_OPTIONS = GZURA_PROGRAMS;