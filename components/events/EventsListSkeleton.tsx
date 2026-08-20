import { Skeleton } from '@/components/ui/skeleton';

export default function EventsListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg shadow-purple-500/5"
        >
          <Skeleton className="aspect-video w-full rounded-none bg-purple-100/80" />
          <div className="space-y-4 p-6">
            <Skeleton className="h-5 w-16 rounded-full bg-gold-100" />
            <Skeleton className="h-6 w-4/5 bg-purple-100" />
            <Skeleton className="h-4 w-full bg-gray-100" />
            <Skeleton className="h-4 w-2/3 bg-gray-100" />
            <div className="space-y-2 pt-1">
              <Skeleton className="h-4 w-40 bg-gray-100" />
              <Skeleton className="h-4 w-48 bg-gray-100" />
              <Skeleton className="h-4 w-36 bg-gray-100" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <Skeleton className="h-5 w-16 bg-purple-100" />
              <Skeleton className="h-9 w-28 rounded-md bg-purple-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
