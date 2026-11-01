'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { isValidIndianPhone, normalizeIndianPhone } from '@/lib/phone';

const DRAFT_KEY = 'gzura-contact-draft';

const subjects = [
  'General Inquiry',
  'Program Information',
  'Event Registration',
  'Partnership Opportunities',
  'Media Request',
  'Support',
];

type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const emptyForm: ContactFormData = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>(emptyForm);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<ContactFormData>;
        setFormData({ ...emptyForm, ...parsed });
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const hasContent = Object.values(formData).some((v) => v.trim());
    if (!hasContent) {
      sessionStorage.removeItem(DRAFT_KEY);
      return;
    }
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
  }, [formData, hydrated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.subject.trim()) {
      toast({
        title: 'Subject required',
        description: 'Please select a subject.',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      toast({
        title: 'Message too short',
        description: 'Please write at least 10 characters.',
        variant: 'destructive',
      });
      return;
    }

    if (!isValidIndianPhone(formData.phone)) {
      toast({
        title: 'Invalid phone number',
        description: 'Use a valid Indian mobile number (e.g. +91 98765 43210).',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { api } = await import('@/lib/api');
      const payload: Record<string, string> = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      };
      if (formData.phone.trim()) {
        payload.phone = normalizeIndianPhone(formData.phone);
      }
      await api.contact(payload);

      toast({
        title: 'Message Sent!',
        description: "We'll get back to you within 48 hours.",
      });

      setFormData(emptyForm);
      sessionStorage.removeItem(DRAFT_KEY);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Rahul Sharma"
            required
            className="bg-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="name@gmail.com"
            required
            className="bg-white"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+91 98765 43210"
            className="bg-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Subject *</Label>
          <Select
            value={formData.subject || undefined}
            onValueChange={(value) => setFormData({ ...formData, subject: value })}
            required
          >
            <SelectTrigger className="bg-white" id="subject">
              <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Tell us how we can help you..."
          required
          minLength={10}
          rows={6}
          className="bg-white resize-none"
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            Send Message
            <Send className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>
    </form>
  );
}
