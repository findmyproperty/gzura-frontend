'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Check, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AdminDetailLayout,
  DetailCard,
  DetailField,
} from '@/components/admin/AdminDetailLayout';
import {
  formatAdminDate,
  getAvatarColor,
  getInitialsFromFullName,
  PillBadge,
  StatusBadge,
} from '@/components/admin/AdminDataTable';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { api, CommunityRegistration, CommunityRegistrationStatus } from '@/lib/api';
import {
  formatGenderLabel,
  formatInterestLabel,
  formatRegistrationStatusLabel,
  getRegistrationStatusTone,
} from '@/lib/registration-labels';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function AdminRegistrationViewPage() {
  const params = useParams();
  const id = params.id as string;
  const [registration, setRegistration] = useState<CommunityRegistration | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    api
      .getCommunityRegistration(id)
      .then(setRegistration)
      .catch(() => setRegistration(null))
      .finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (
    status: Exclude<CommunityRegistrationStatus, 'pending'>,
  ) => {
    if (!registration) return;

    setUpdating(true);
    try {
      const updated = await api.updateCommunityRegistration(registration.id, { status });
      setRegistration(updated);
      toast({
        title: status === 'approved' ? 'Request approved' : 'Request rejected',
        description: `${registration.fullName}'s host request has been ${status}.`,
      });
    } catch (err) {
      toast({
        title: 'Update failed',
        description: err instanceof Error ? err.message : 'Request failed',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Loading host request...
      </div>
    );
  }

  if (!registration) {
    return (
      <AdminDetailLayout
        backHref="/admin/registrations"
        backLabel="Back to host requests"
        title="Request not found"
      >
        <p className="text-gray-500">This host registration may have been removed.</p>
      </AdminDetailLayout>
    );
  }

  return (
    <AdminDetailLayout
      backHref="/admin/registrations"
      backLabel="Back to host requests"
      title={registration.fullName}
      subtitle={registration.email}
      actions={
        registration.status === 'pending' ? (
          <div className="flex items-center gap-2">
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={updating}
              onClick={() => updateStatus('approved')}
            >
              {updating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Approve
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
              disabled={updating}
              onClick={() => updateStatus('rejected')}
            >
              <X className="w-4 h-4 mr-2" />
              Reject
            </Button>
          </div>
        ) : null
      }
    >
      <DetailCard>
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="h-16 w-16">
            <AvatarFallback
              className={cn(
                getAvatarColor(registration.id),
                'text-white text-xl font-semibold',
              )}
            >
              {getInitialsFromFullName(registration.fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-wrap items-center gap-2">
            <PillBadge className="bg-gold-100 text-gold-800 border-gold-200">
              Course Host Request
            </PillBadge>
            <StatusBadge
              label={formatRegistrationStatusLabel(registration.status)}
              tone={getRegistrationStatusTone(registration.status)}
            />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <DetailField label="Email" value={registration.email} />
          <DetailField label="Phone" value={registration.phone} />
          <DetailField
            label="Gender"
            value={formatGenderLabel(registration.gender)}
          />
          <DetailField label="Profession" value={registration.profession} />
          <DetailField
            label="Course Interest"
            value={formatInterestLabel(registration.interest)}
          />
          <DetailField
            label="Status"
            value={formatRegistrationStatusLabel(registration.status)}
          />
          <DetailField
            label="Submitted"
            value={formatAdminDate(registration.createdAt)}
          />
          <DetailField
            label="Message"
            value={registration.message || '—'}
            className="sm:col-span-2 lg:col-span-3"
          />
        </div>
      </DetailCard>
    </AdminDetailLayout>
  );
}