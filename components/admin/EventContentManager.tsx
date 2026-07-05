'use client';

import { useEffect, useState } from 'react';
import {
  FileSpreadsheet,
  FileText,
  FileType2,
  Loader2,
  Plus,
  Trash2,
  Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { api, EventContentItem, EventContentType } from '@/lib/api';

const FILE_ACCEPT =
  '.pdf,.doc,.docx,.xls,.xlsx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

function contentIcon(type: EventContentType) {
  if (type === 'PDF') return FileText;
  if (type === 'WORD') return FileType2;
  if (type === 'EXCEL') return FileSpreadsheet;
  return FileText;
}

export default function EventContentManager({ eventId }: { eventId: string }) {
  const [items, setItems] = useState<EventContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<'text' | 'file'>('text');
  const [title, setTitle] = useState('');
  const [textContent, setTextContent] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const loadContent = () => {
    setLoading(true);
    api
      .getEventContent(eventId)
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadContent();
  }, [eventId]);

  const resetForm = () => {
    setTitle('');
    setTextContent('');
    setFile(null);
  };

  const handleAddText = async () => {
    if (!title.trim() || !textContent.trim()) {
      toast({
        title: 'Missing fields',
        description: 'Add a title and text content.',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      await api.createEventContent(eventId, {
        title: title.trim(),
        contentType: 'TEXT',
        textContent: textContent.trim(),
        sortOrder: items.length,
      });
      resetForm();
      loadContent();
      toast({ title: 'Content added' });
    } catch (err) {
      toast({
        title: 'Could not add content',
        description: err instanceof Error ? err.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddFile = async () => {
    if (!title.trim() || !file) {
      toast({
        title: 'Missing fields',
        description: 'Add a title and choose a file.',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      const uploaded = await api.uploadEventContent(file);
      await api.createEventContent(eventId, {
        title: title.trim(),
        contentType: uploaded.contentType,
        fileUrl: uploaded.url,
        fileName: uploaded.originalName,
        sortOrder: items.length,
      });
      resetForm();
      loadContent();
      toast({ title: 'File uploaded' });
    } catch (err) {
      toast({
        title: 'Upload failed',
        description: err instanceof Error ? err.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (contentId: string) => {
    try {
      await api.deleteEventContent(eventId, contentId);
      setItems((current) => current.filter((item) => item.id !== contentId));
      toast({ title: 'Content removed' });
    } catch (err) {
      toast({
        title: 'Could not delete content',
        description: err instanceof Error ? err.message : 'Please try again',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant={mode === 'text' ? 'default' : 'outline'}
            onClick={() => setMode('text')}
          >
            <Plus className="mr-1 h-4 w-4" />
            Add text
          </Button>
          <Button
            type="button"
            size="sm"
            variant={mode === 'file' ? 'default' : 'outline'}
            onClick={() => setMode('file')}
          >
            <Upload className="mr-1 h-4 w-4" />
            Upload file
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="content-title">Title</Label>
            <Input
              id="content-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Lesson 1, Workbook, Slides..."
              className="mt-1.5"
            />
          </div>

          {mode === 'text' ? (
            <div>
              <Label htmlFor="content-text">Text content</Label>
              <Textarea
                id="content-text"
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Write notes, instructions, or lesson content..."
                rows={6}
                className="mt-1.5"
              />
              <Button
                type="button"
                className="mt-3 btn-primary"
                disabled={saving}
                onClick={handleAddText}
              >
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save text content
              </Button>
            </div>
          ) : (
            <div>
              <Label htmlFor="content-file">File (PDF, Word, Excel)</Label>
              <Input
                id="content-file"
                type="file"
                accept={FILE_ACCEPT}
                className="mt-1.5"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              <p className="mt-1 text-xs text-gray-500">Max 15 MB. PDF, .doc, .docx, .xls, .xlsx</p>
              <Button
                type="button"
                className="mt-3 btn-primary"
                disabled={saving}
                onClick={handleAddFile}
              >
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Upload file
              </Button>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading content...
        </div>
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-500">
          No course content yet. Add text or upload files for enrolled students.
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => {
            const Icon = contentIcon(item.contentType);
            return (
              <li
                key={item.id}
                className="flex items-start justify-between gap-3 rounded-lg border border-gray-200 bg-white p-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 shrink-0 text-purple-deep" />
                    <p className="font-medium text-gray-900">{item.title}</p>
                    <span className="rounded-full bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-deep">
                      {item.contentType}
                    </span>
                  </div>
                  {item.contentType === 'TEXT' ? (
                    <p className="mt-2 line-clamp-3 text-sm text-gray-600 whitespace-pre-line">
                      {item.textContent}
                    </p>
                  ) : (
                    <p className="mt-2 text-sm text-gray-600">{item.fileName}</p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
