import type { EventContentType } from '@/lib/api';
import type { CloudinaryUploadedFile } from './CloudinaryUpload';

const VIDEO_FORMATS = new Set(['mp4', 'mov', 'webm', 'mkv', 'avi', 'm4v']);

export function mapCloudinaryToContentType(
  file: CloudinaryUploadedFile,
): Exclude<EventContentType, 'TEXT'> {
  const format = file.format.toLowerCase();
  const resourceType = file.resourceType.toLowerCase();

  if (resourceType === 'video' || VIDEO_FORMATS.has(format)) {
    return 'VIDEO';
  }
  if (format === 'pdf') return 'PDF';
  if (format === 'doc' || format === 'docx') return 'WORD';
  if (format === 'xls' || format === 'xlsx' || format === 'csv') return 'EXCEL';
  return 'FILE';
}
