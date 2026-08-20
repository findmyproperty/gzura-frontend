import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export default function EventDetailSkeleton({
  shell = 'public',
}: {
  shell?: 'public' | 'member';
}) {
  const isMemberShell = shell === 'member';

  return (
    <>
      <section
        className={cn(
          'gradient-bg pb-12',
          isMemberShell ? 'pt-8 sm:pt-10' : 'pt-32',
        )}
      >
        <div className="container space-y-4">
          <Skeleton className="h-4 w-28 bg-white/20" />
          <Skeleton className="h-6 w-20 rounded-full bg-white/20" />
          <Skeleton className="h-10 w-full max-w-xl bg-white/25 sm:h-12" />
          <div className="flex flex-wrap gap-4">
            <Skeleton className="h-5 w-48 bg-white/20" />
            <Skeleton className="h-5 w-36 bg-white/20" />
            <Skeleton className="h-5 w-40 bg-white/20" />
          </div>
        </div>
      </section>

      <section className={cn('bg-white', isMemberShell ? 'py-10 sm:py-12' : 'section-padding')}>
        <div className="container grid gap-8 lg:grid-cols-3 lg:gap-12">
          <div className="space-y-8 lg:col-span-2">
            <Skeleton className="aspect-[16/9] w-full rounded-2xl bg-purple-100/80" />
            <div className="space-y-4 rounded-2xl border border-gray-200 p-6">
              <Skeleton className="h-7 w-48 bg-purple-100" />
              <Skeleton className="h-4 w-full bg-gray-100" />
              <Skeleton className="h-4 w-full bg-gray-100" />
              <Skeleton className="h-4 w-3/4 bg-gray-100" />
            </div>
          </div>
          <div>
            <div className="space-y-4 rounded-2xl border border-gray-100 p-6 shadow-xl sm:p-8">
              <Skeleton className="h-4 w-24 bg-gray-100" />
              <Skeleton className="h-9 w-28 bg-purple-100" />
              <Skeleton className="h-11 w-full rounded-md bg-purple-100" />
              <Skeleton className="h-11 w-full rounded-md bg-gray-100" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
