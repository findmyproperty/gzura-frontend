'use client';

import { ImagePlus, Loader2, Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CloudinaryUpload } from '@/components/cloudinary/CloudinaryUpload';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const MAX_IMAGES = 10;

type EventImageGalleryUploadProps = {
  value: string[];
  onChange: (urls: string[]) => void;
};

export function EventImageGalleryUpload({
  value,
  onChange,
}: EventImageGalleryUploadProps) {
  const remaining = Math.max(MAX_IMAGES - value.length, 0);

  const removeAt = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const setCover = (index: number) => {
    if (index === 0) return;
    const next = [...value];
    const [cover] = next.splice(index, 1);
    onChange([cover, ...next]);
  };

  return (
    <CloudinaryUpload
      resourceType="image"
      multiple
      maxFiles={remaining || 1}
      folder="gzura/events"
      maxFileSize={5 * 1024 * 1024}
      onUploaded={(files) => {
        const urls = files.map((file) => file.url).slice(0, remaining);
        if (!urls.length) return;
        onChange([...value, ...urls]);
        toast({
          title: urls.length === 1 ? 'Image uploaded' : `${urls.length} images uploaded`,
        });
      }}
    >
      {({ open, isUploading }) => {
        const triggerUpload = () => {
          if (remaining <= 0) {
            toast({
              title: 'Image limit reached',
              description: `You can upload up to ${MAX_IMAGES} images per event.`,
              variant: 'destructive',
            });
            return;
          }
          open();
        };

        return (
          <div className="space-y-3">
            <div className="flex items-center justify-end gap-3">
              <span className="text-xs font-medium text-gray-500">
                {value.length}/{MAX_IMAGES} · first image is cover
              </span>
            </div>

            <div className="rounded-2xl border border-dashed border-purple-200 bg-gradient-to-br from-purple-50/40 via-white to-gold-50/25 p-4 sm:p-5">
              {value.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {value.map((url, index) => (
                    <div
                      key={`${url}-${index}`}
                      className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-purple-100 bg-white shadow-sm"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={`Event image ${index + 1}`}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      {index === 0 ? (
                        <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-purple-deep/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                          <Star className="h-3 w-3 fill-current" />
                          Cover
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setCover(index)}
                          className="absolute left-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          Set cover
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => removeAt(index)}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-red-600 shadow opacity-0 transition-opacity group-hover:opacity-100"
                        aria-label="Remove image"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                  {value.length < MAX_IMAGES ? (
                    <button
                      type="button"
                      onClick={triggerUpload}
                      disabled={isUploading}
                      className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-purple-200 bg-white/80 text-purple-deep transition-colors hover:border-purple-300 hover:bg-purple-50/60"
                    >
                      {isUploading ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (
                        <ImagePlus className="h-6 w-6" />
                      )}
                      <span className="text-xs font-medium">
                        {isUploading ? 'Uploading…' : 'Add more'}
                      </span>
                    </button>
                  ) : null}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={triggerUpload}
                  disabled={isUploading}
                  className={cn(
                    'flex min-h-[180px] w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-purple-200 bg-white/80 px-4 py-8 text-center transition-colors hover:border-purple-300 hover:bg-purple-50/50',
                    isUploading && 'pointer-events-none opacity-70',
                  )}
                >
                  {isUploading ? (
                    <Loader2 className="h-10 w-10 animate-spin text-purple-deep" />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-deep">
                      <ImagePlus className="h-7 w-7" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-purple-deep">
                      {isUploading ? 'Uploading images…' : 'Upload event images'}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Drag-quality gallery · up to {MAX_IMAGES} images · 5 MB each
                    </p>
                  </div>
                </button>
              )}
            </div>

            {value.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={triggerUpload}
                  disabled={isUploading || value.length >= MAX_IMAGES}
                >
                  <ImagePlus className="mr-1 h-4 w-4" />
                  Add images
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => onChange([])}
                  disabled={isUploading}
                >
                  Remove all
                </Button>
              </div>
            ) : null}
          </div>
        );
      }}
    </CloudinaryUpload>
  );
}
