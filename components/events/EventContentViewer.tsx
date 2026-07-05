'use client';

import { useEffect, useState } from 'react';
import {
  BookOpen,
  Download,
  FileSpreadsheet,
  FileText,
  FileType2,
  Loader2,
  Lock,
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { api, EventContentItem, EventContentType } from '@/lib/api';

function contentIcon(type: EventContentType) {
  if (type === 'PDF') return FileText;
  if (type === 'WORD') return FileType2;
  if (type === 'EXCEL') return FileSpreadsheet;
  return FileText;
}

export default function EventContentViewer({ eventId }: { eventId: string }) {
  const { user, loading: authLoading } = useAuth();
  const [checkingEnrollment, setCheckingEnrollment] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [items, setItems] = useState<EventContentItem[]>([]);
  const [loadingContent, setLoadingContent] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsEnrolled(false);
      return;
    }

    setCheckingEnrollment(true);
    api
      .getMyRegistrations()
      .then((registrations) =>
        setIsEnrolled(registrations.some((registration) => registration.eventId === eventId)),
      )
      .catch(() => setIsEnrolled(false))
      .finally(() => setCheckingEnrollment(false));
  }, [user, eventId]);

  useEffect(() => {
    if (!user || !isEnrolled) {
      setItems([]);
      return;
    }

    setLoadingContent(true);
    setAccessDenied(false);
    api
      .getEventContent(eventId)
      .then(setItems)
      .catch(() => {
        setItems([]);
        setAccessDenied(true);
      })
      .finally(() => setLoadingContent(false));
  }, [user, isEnrolled, eventId]);

  if (authLoading || checkingEnrollment) {
    return null;
  }

  if (!user || !isEnrolled) {
    return (
      <div className="rounded-2xl border border-dashed border-purple-200 bg-purple-50/50 p-6">
        <div className="flex items-start gap-3">
          <Lock className="mt-0.5 h-5 w-5 shrink-0 text-purple-deep" />
          <div>
            <h3 className="font-semibold text-purple-deep">Course content</h3>
            <p className="mt-1 text-sm text-gray-600">
              Join this course to unlock lesson materials, PDFs, Word docs, and Excel files.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loadingContent) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500 py-4">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading course content...
      </div>
    );
  }

  if (accessDenied) {
    return null;
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
        <div className="flex items-start gap-3">
          <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-purple-deep" />
          <div>
            <h3 className="font-semibold text-purple-deep">Course content</h3>
            <p className="mt-1 text-sm text-gray-600">
              No materials have been added yet. Check back later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="heading-md mb-4 text-purple-deep">Course Content</h2>
      <div className="space-y-4">
        {items.map((item) => {
          const Icon = contentIcon(item.contentType);

          return (
            <article
              key={item.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-3 flex items-center gap-2">
                <Icon className="h-5 w-5 text-purple-deep" />
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <span className="rounded-full bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-deep">
                  {item.contentType}
                </span>
              </div>

              {item.contentType === 'TEXT' ? (
                <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700">
                  {item.textContent}
                </p>
              ) : item.fileUrl ? (
                <a
                  href={item.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-purple-50 px-4 py-2 text-sm font-medium text-purple-deep hover:bg-purple-100"
                >
                  <Download className="h-4 w-4" />
                  Download {item.fileName || 'file'}
                </a>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}
