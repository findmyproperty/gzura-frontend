'use client';

import { useRef, useState } from 'react';
import { ImagePlus, Loader2, Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
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
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadingCount, setUploadingCount] = useState(0);

  const uploadFiles = async (files: FileList | File[]) => {
    const selected = Array.from(files).filter((file) => file.type.startsWith('image/'));
    if (!selected.length) {
      toast({
        title: 'Invalid file',
        description: 'Please choose image files only (JPEG, PNG, WebP, or GIF).',
        variant: 'destructive',
      });
      return;
    }

    const remaining = MAX_IMAGES - value.length;
    if (remaining <= 0) {
      toast({
        title: 'Image limit reached',
        description: `You can upload up to ${MAX_IMAGES} images per event.`,
        variant: 'destructive',
      });
      return;
    }

    const batch = selected.slice(0, remaining);
    if (selected.length > remaining) {
      toast({
        title: 'Some images skipped',
        description: `Only ${remaining} more image${remaining === 1 ? '' : 's'} can be added.`,
      });
    }

    setUploadingCount(batch.length);
    const uploaded: string[] = [];

    try {
      for (const file of batch) {
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: 'File too large',
            description: `${file.name} exceeds the 5 MB limit.`,
            variant: 'destructive',
          });
          continue;
        }

        const result = await api.uploadEventThumbnail(file);
        uploaded.push(result.url);
      }

      if (uploaded.length) {
        onChange([...value, ...uploaded]);
        toast({
          title: uploaded.length === 1 ? 'Image uploaded' : `${uploaded.length} images uploaded`,
        });
      }
    } catch (err) {
      toast({
        title: 'Upload failed',
        description: err instanceof Error ? err.message : 'Could not upload images',
        variant: 'destructive',
      });
    } finally {
      setUploadingCount(0);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

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
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <Label>Event images</Label>
        <span className="text-xs text-gray-500">
          {value.length}/{MAX_IMAGES} · first image is cover
        </span>
      </div>

      <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50/30 via-white to-gold-50/20 p-4">
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
                onClick={() => inputRef.current?.click()}
                disabled={uploadingCount > 0}
                className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-purple-200 bg-white/80 text-purple-deep transition-colors hover:border-purple-300 hover:bg-purple-50/60"
              >
                {uploadingCount > 0 ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <ImagePlus className="h-6 w-6" />
                )}
                <span className="text-xs font-medium">
                  {uploadingCount > 0 ? 'Uploading…' : 'Add more'}
                </span>
              </button>
            ) : null}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploadingCount > 0}
            className={cn(
              'flex min-h-[180px] w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-purple-200 bg-white/80 px-4 py-8 text-center transition-colors hover:border-purple-300 hover:bg-purple-50/50',
              uploadingCount > 0 && 'pointer-events-none opacity-70',
            )}
          >
            {uploadingCount > 0 ? (
              <Loader2 className="h-10 w-10 animate-spin text-purple-deep" />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-deep">
                <ImagePlus className="h-7 w-7" />
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-purple-deep">
                {uploadingCount > 0 ? 'Uploading images…' : 'Upload event images'}
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
            onClick={() => inputRef.current?.click()}
            disabled={uploadingCount > 0 || value.length >= MAX_IMAGES}
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
            disabled={uploadingCount > 0}
          >
            Remove all
          </Button>
        </div>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={(event) => {
          if (event.target.files?.length) {
            void uploadFiles(event.target.files);
          }
        }}
      />
    </div>
  );
}
