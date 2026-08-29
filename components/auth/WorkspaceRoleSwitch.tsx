'use client';

import { ArrowLeftRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWorkspaceRoleSwitch } from '@/hooks/use-workspace-role-switch';
import { cn } from '@/lib/utils';

type WorkspaceRoleSwitchProps = {
  tone?: 'member' | 'admin';
};

export function WorkspaceRoleSwitch({ tone = 'member' }: WorkspaceRoleSwitchProps) {
  const { switching, switchTo, canSwitchToHost, canSwitchToMember } =
    useWorkspaceRoleSwitch();

  if (!canSwitchToHost && !canSwitchToMember) return null;

  const toHost = canSwitchToHost;
  const isAdminTone = tone === 'admin';

  return (
    <div
      className={cn(
        isAdminTone
          ? 'rounded-3xl border border-purple-100/80 bg-white p-6 shadow-[0_12px_40px_-24px_rgba(45,10,78,0.35)] sm:p-8'
          : 'mt-6 bg-white rounded-2xl border border-purple-100 p-6 md:p-8 shadow-sm',
      )}
    >
      <h2
        className={cn(
          'font-semibold text-purple-deep',
          isAdminTone ? 'text-base' : 'text-lg',
        )}
      >
        {toHost ? 'Host workspace' : 'Member workspace'}
      </h2>
      <p className="mt-1 text-sm text-gray-600">
        {toHost
          ? 'Your host request was approved. Switch anytime to create and manage events.'
          : 'Switch back to the member workspace to browse and join events as a learner. You can return to host anytime.'}
      </p>
      <Button
        type="button"
        className={cn('mt-4', isAdminTone ? 'btn-admin' : 'btn-primary')}
        disabled={switching}
        onClick={() => void switchTo(toHost ? 'HOST' : 'MEMBER')}
      >
        {switching ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <ArrowLeftRight className="mr-2 h-4 w-4" />
        )}
        {toHost ? 'Switch to host' : 'Switch to member'}
      </Button>
    </div>
  );
}
