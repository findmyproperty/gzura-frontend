'use client';

import { useRef, type ReactNode } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { toast } from '@/hooks/use-toast';

export type CloudinaryUploadedFile = {
  url: string;
  publicId: string;
  resourceType: string;
  format: string;
  originalFilename: string;
};

type CloudinaryResourceType = 'image' | 'video' | 'auto';

type CloudinaryUploadProps = {
  resourceType?: CloudinaryResourceType;
  multiple?: boolean;
  maxFiles?: number;
  folder?: string;
  maxFileSize?: number;
  onUploaded: (files: CloudinaryUploadedFile[]) => void;
  children: (helpers: { open: () => void; isUploading: boolean }) => ReactNode;
};

const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

function mapInfo(info: Record<string, unknown>): CloudinaryUploadedFile | null {
  const url = typeof info.secure_url === 'string' ? info.secure_url : null;
  if (!url) return null;

  return {
    url,
    publicId: typeof info.public_id === 'string' ? info.public_id : '',
    resourceType: typeof info.resource_type === 'string' ? info.resource_type : '',
    format: typeof info.format === 'string' ? info.format : '',
    originalFilename:
      typeof info.original_filename === 'string' ? info.original_filename : '',
  };
}

export function CloudinaryUpload({
  resourceType = 'image',
  multiple = false,
  maxFiles = 1,
  folder,
  maxFileSize,
  onUploaded,
  children,
}: CloudinaryUploadProps) {
  const collectedRef = useRef<CloudinaryUploadedFile[]>([]);
  const onUploadedRef = useRef(onUploaded);
  onUploadedRef.current = onUploaded;
  const preset = UPLOAD_PRESET;

  if (!preset) {
    return (
      <>
        {children({
          open: () => {
            toast({
              title: 'Upload not configured',
              description: 'Missing NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.',
              variant: 'destructive',
            });
          },
          isUploading: false,
        })}
      </>
    );
  }

  const flushCollected = () => {
    const files = collectedRef.current;
    collectedRef.current = [];
    if (files.length) onUploadedRef.current(files);
  };

  return (
    <CldUploadWidget
      uploadPreset={preset}
      options={{
        sources: ['local', 'url', 'camera'],
        multiple,
        maxFiles: multiple ? Math.max(maxFiles, 1) : 1,
        resourceType,
        folder,
        maxFileSize:
          maxFileSize ??
          (resourceType === 'image' ? 10 * 1024 * 1024 : 100 * 1024 * 1024),
      }}
      onSuccess={(result) => {
        if (result.event && result.event !== 'success') return;
        const info = result.info;
        if (!info || typeof info === 'string') return;
        const mapped = mapInfo(info as unknown as Record<string, unknown>);
        if (!mapped) return;
        collectedRef.current.push(mapped);
        flushCollected();
      }}
      onQueuesEnd={() => {
        flushCollected();
      }}
      onError={(error) => {
        collectedRef.current = [];
        const description =
          typeof error === 'string'
            ? error
            : error && typeof error === 'object' && 'status' in error
              ? String((error as { status?: string }).status)
              : 'Could not upload to Cloudinary';
        toast({
          title: 'Upload failed',
          description,
          variant: 'destructive',
        });
      }}
    >
      {({ open, isLoading }) => (
        <>
          {children({
            open: () => open(),
            isUploading: Boolean(isLoading),
          })}
        </>
      )}
    </CldUploadWidget>
  );
}
