import { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { toast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { getDashboardPath } from '@/lib/auth-utils';

export function useWorkspaceRoleSwitch() {
  const { user, login } = useAuth();
  const [switching, setSwitching] = useState(false);

  const switchTo = async (role: 'MEMBER' | 'HOST') => {
    if (!user || switching || user.role === role) return;

    setSwitching(true);
    try {
      const result = await api.switchRole(role);
      login(result.accessToken, result.user);
      toast({
        title: role === 'HOST' ? 'Switched to host' : 'Switched to member',
        description:
          role === 'HOST'
            ? 'Opening the host workspace.'
            : 'Opening the member workspace.',
      });
      window.location.assign(getDashboardPath(result.user.role));
    } catch (err) {
      toast({
        title: 'Could not switch workspace',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'destructive',
      });
      setSwitching(false);
    }
  };

  return {
    user,
    switching,
    switchTo,
    canSwitchToHost: user?.role === 'MEMBER' && Boolean(user.canHost),
    canSwitchToMember: user?.role === 'HOST',
  };
}
