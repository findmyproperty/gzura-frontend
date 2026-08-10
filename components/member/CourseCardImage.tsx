'use client';

import { useEffect, useState } from 'react';
import { Calendar, Sparkles } from 'lucide-react';

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
];

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

  const hash = title ? title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
  const fallbackUrl = FALLBACK_IMAGES[hash % FALLBACK_IMAGES.length];
  const finalSrc = imageUrl && !failed ? imageUrl : fallbackUrl;

  return (
    <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-slate-950">
      <img
        src={finalSrc}
        alt={title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
        onError={() => setFailed(true)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-purple-950/80 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-40" />
      {(!imageUrl || failed) && (
        <div className="absolute top-2.5 right-2.5 rounded-full bg-black/40 backdrop-blur-md px-2 py-1 flex items-center gap-1 border border-white/20 text-[10px] text-amber-300 font-medium">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>GZURA Event</span>
        </div>
      )}
    </div>
  );
}
