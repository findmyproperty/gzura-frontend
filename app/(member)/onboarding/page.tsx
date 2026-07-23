'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  GraduationCap,
  Heart,
  Loader2,
  Plus,
  Search,
  Sparkles,
  Target,
  Users2,
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  completeOnboarding,
  GZURA_PROGRAMS,
  isOnboardingComplete,
  MEMBER_GOALS,
} from '@/lib/member-onboarding';
import { cn } from '@/lib/utils';

const GOAL_ICONS = {
  briefcase: Briefcase,
  users: Users2,
  target: Target,
  heart: Heart,
} as const;

const PROGRAM_ICONS = {
  briefcase: Briefcase,
  users: Users2,
  target: Target,
  sparkles: Sparkles,
  heart: Heart,
  graduation: GraduationCap,
} as const;

const PROGRAM_ICON_BOX: Record<string, string> = {
  'entrepreneurship-workshops': 'bg-purple-600',
  'leadership-development': 'bg-gold-500',
  'networking-events': 'bg-purple-deep',
  'business-mentorship': 'bg-gold-royal',
  'personal-growth': 'bg-purple-600',
  'empowerment-initiatives': 'bg-gold-500',
};

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading, refreshUser } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState('');
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [programSearch, setProgramSearch] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login?redirect=/onboarding');
      return;
    }
    if (!loading && (user?.role === 'ADMIN' || user?.role === 'HOST')) {
      router.replace('/admin');
      return;
    }
    if (!loading && user && isOnboardingComplete(user)) {
      router.replace('/home');
    }
  }, [user, loading, router]);

  const filteredPrograms = useMemo(() => {
    const query = programSearch.trim().toLowerCase();
    if (!query) return GZURA_PROGRAMS;
    return GZURA_PROGRAMS.filter(
      (item) =>
        item.label.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query),
    );
  }, [programSearch]);

  const toggleProgram = (id: string) => {
    setSelectedPrograms((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const finishOnboarding = async () => {
    if (!selectedGoal || selectedPrograms.length === 0) return;
    setSaving(true);
    try {
      await completeOnboarding(selectedGoal, selectedPrograms, refreshUser);
      router.push('/home');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 text-purple-deep animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-gray-100 px-4 sm:px-8 h-16 flex items-center justify-between">
        <Link href="/home" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold-royal to-gold-400 flex items-center justify-center">
            <span className="text-purple-deep font-bold text-lg font-display">G</span>
          </div>
          <span className="text-xl font-bold font-display text-purple-deep">GZURA</span>
        </Link>
        <Link
          href="/home"
          className="text-sm font-medium text-gray-600 hover:text-purple-deep"
        >
          Exit
        </Link>
      </header>

      <div className="flex-1 flex flex-col items-center px-4 py-10 sm:py-16">
        {step === 1 ? (
          <div className="w-full max-w-5xl text-center">
            <p className="text-sm font-semibold text-purple-deep mb-3">
              Welcome to GZURA
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Hello {user.firstName}!
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto mb-10 text-lg">
              We empower individuals through learning, leadership, and opportunities.
              What brings you to our community?
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
              {MEMBER_GOALS.map((goal) => {
                const Icon = GOAL_ICONS[goal.icon];
                const active = selectedGoal === goal.id;
                return (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => setSelectedGoal(goal.id)}
                    className={cn(
                      'flex flex-col h-full w-full text-left rounded-xl border-2 overflow-hidden transition-all hover:shadow-md',
                      active
                        ? 'border-purple-deep shadow-md ring-2 ring-purple-deep/20'
                        : 'border-gray-200 hover:border-purple-200',
                    )}
                  >
                    <div className="bg-purple-deep h-28 flex items-center justify-center shrink-0">
                      <div className="w-12 h-12 flex items-center justify-center">
                        <Icon className="w-9 h-9 text-white shrink-0" strokeWidth={1.75} />
                      </div>
                    </div>
                    <div className="flex flex-col flex-1 p-4 bg-white min-h-[7.5rem]">
                      <p className="font-semibold text-gray-900 text-sm leading-snug min-h-[2.75rem] mb-2">
                        {goal.label}
                      </p>
                      <p className="text-xs text-gray-500 leading-relaxed mt-auto">
                        {goal.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="w-full max-w-4xl">
            <p className="text-center text-gray-600 font-medium mb-2">Step 2 of 2</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-3">
              Which GZURA programs interest you?
            </h1>
            <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
              Select the programs you&apos;d like to explore. We&apos;ll recommend
              events, workshops, and community opportunities for you.
            </p>
            <div className="relative max-w-md mx-auto mb-8">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={programSearch}
                onChange={(e) => setProgramSearch(e.target.value)}
                placeholder="Find a program"
                className="pl-9 h-11"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {filteredPrograms.map((program) => {
                const selected = selectedPrograms.includes(program.id);
                const Icon = PROGRAM_ICONS[program.icon];
                return (
                  <button
                    key={program.id}
                    type="button"
                    onClick={() => toggleProgram(program.id)}
                    className={cn(
                      'flex items-start gap-3 p-4 rounded-lg border text-left transition-all',
                      selected
                        ? 'border-purple-deep bg-purple-50'
                        : 'border-gray-200 hover:border-purple-200 hover:bg-gray-50',
                    )}
                  >
                    <div
                      className={cn(
                        'w-11 h-11 rounded-lg flex items-center justify-center shrink-0 shadow-sm',
                        PROGRAM_ICON_BOX[program.id] ?? program.color,
                      )}
                    >
                      {Icon ? (
                        <Icon className="w-5 h-5 text-white shrink-0" strokeWidth={1.75} />
                      ) : null}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">
                        {program.label}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {program.description}
                      </p>
                    </div>
                    <Plus
                      className={cn(
                        'w-4 h-4 shrink-0 mt-1',
                        selected ? 'text-purple-deep rotate-45' : 'text-gray-400',
                      )}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <footer className="border-t border-gray-100 px-4 sm:px-8 py-6 flex items-center justify-center gap-4">
        {step === 2 && (
          <Button variant="outline" onClick={() => setStep(1)} className="min-w-[120px]">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        )}
        {step === 1 ? (
          <Button
            className="btn-primary min-w-[140px]"
            disabled={!selectedGoal}
            onClick={() => setStep(2)}
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            className="btn-primary min-w-[140px]"
            disabled={saving || selectedPrograms.length === 0}
            onClick={finishOnboarding}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Join the community'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </footer>
    </div>
  );
}