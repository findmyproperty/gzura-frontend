'use client';

import { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';

export default function CourseCardImage({
  imageUrl,
  title,
}: {
  imageUrl?: string | null;
  title: string;
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [imageUrl]);

  const showFallback = !imageUrl || failed;

  return (
    <div className="aspect-[4/3] w-full shrink-0 overflow-hidden bg-purple-50">
      {showFallback ? (
        <div
          className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100/70"
          aria-label={`${title} image unavailable`}
          role="img"
        >
          <Calendar className="h-10 w-10 text-purple-deep opacity-40" />
        </div>
      ) : (
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
