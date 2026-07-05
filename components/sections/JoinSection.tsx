'use client';

import ScrollAnimate from '@/components/animations/ScrollAnimate';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, Users, ArrowRight, Loader2, Star, ShieldCheck, Users2, BadgeCheck } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];

const interestOptions = [
  { value: 'leadership', label: 'Leadership & Management' },
  { value: 'entrepreneurship', label: 'Entrepreneurship & Business' },
  { value: 'mentorship', label: 'Mentorship & Coaching' },
  { value: 'networking', label: 'Community & Networking' },
  { value: 'personal_growth', label: 'Personal Development' },
];

const trustPoints = [
  { name: 'Community Support', description: 'Connect with like-minded individuals' },
  { name: 'Leadership Opportunities', description: 'Develop skills that drive success' },
  { name: 'Entrepreneur Network', description: 'Build valuable business relationships' },
  { name: 'Personal Growth', description: 'Transform your personal and professional life' },
];

const highlightStats = [
  { value: '5K+', label: 'Members' },
  { value: '50+', label: 'Events' },
  { value: '100+', label: 'Mentors' },
];

const formLabelClass = 'text-gray-900 font-semibold text-sm';
const formFieldClass =
  'h-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 shadow-sm focus-visible:border-purple-deep focus-visible:ring-2 focus-visible:ring-purple-deep/20 focus-visible:ring-offset-0';
const formSelectClass =
  'h-10 bg-white border-gray-300 text-gray-900 shadow-sm focus:border-purple-deep focus:ring-2 focus:ring-purple-deep/20 focus:ring-offset-0 [&>span]:text-gray-900 [&>span[data-placeholder]]:text-gray-500';
const formTextareaClass =
  'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 shadow-sm resize-none min-h-[4.5rem] focus-visible:border-purple-deep focus-visible:ring-2 focus-visible:ring-purple-deep/20 focus-visible:ring-offset-0';

export default function JoinSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    profession: '',
    interest: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.gender || !formData.interest) {
      toast({
        title: 'Missing required fields',
        description: 'Please complete gender and area of interest.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await api.submitCommunityRegistration({
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        gender: formData.gender,
        profession: formData.profession.trim(),
        interest: formData.interest,
        message: formData.message.trim(),
      });

      setIsSuccess(true);

      setTimeout(() => {
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          gender: '',
          profession: '',
          interest: '',
          message: '',
        });
      }, 2000);
    } catch (err) {
      toast({
        title: 'Registration failed',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <section
        className="min-h-screen scroll-mt-20 flex flex-col justify-center py-12 md:py-16 gradient-bg relative overflow-hidden"
        aria-labelledby="success-heading"
      >
        <div className="absolute inset-0 opacity-5" aria-hidden="true">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRoLTJ2Mmgydi0yem0tMTAgMGgtMnYyaDJ2LTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] bg-repeat" />
        </div>
        <div className="container-custom relative z-10">
          <div className="max-w-xl mx-auto text-center">
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-2xl animate-scale-in">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center" aria-hidden="true">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h3 id="success-heading" className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Host application received!
              </h3>
              <p className="text-gray-600 mb-6">
                Our team will review your request and reach out about hosting on GZURA.
              </p>
              <Button
                onClick={() => setIsSuccess(false)}
                className="btn-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
              >
                Submit another request
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="register"
      className="scroll-mt-20 relative overflow-hidden bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.10),transparent_28%),linear-gradient(180deg,#2a064a_0%,#17051f_100%)] min-h-[calc(100vh-5rem)] lg:h-[calc(100vh-5rem)] flex flex-col"
      aria-labelledby="join-heading"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-[0.06]" aria-hidden="true">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRoLTJ2Mmgydi0yem0tMTAgMGgtMnYyaDJ2LTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] bg-repeat" />
      </div>
      <div className="absolute -top-24 right-[-6rem] h-[26rem] w-[26rem] rounded-full bg-gold-400/10 blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-[-8rem] left-[-5rem] h-[28rem] w-[28rem] rounded-full bg-fuchsia-400/10 blur-3xl" aria-hidden="true" />

      <div className="container-custom relative z-10 w-full flex-1 flex flex-col min-h-0 py-5 sm:py-6 lg:py-8">
        <ScrollAnimate animation="fade-up" className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 min-h-0 w-full overflow-hidden rounded-[1.75rem] border border-white/20 bg-white/5 shadow-[0_30px_90px_rgba(25,5,40,0.45)] backdrop-blur-xl">
            <div className="grid h-full lg:grid-cols-2 lg:items-stretch lg:min-h-0">
              {/* Left panel */}
              <div className="relative flex h-full min-h-0 flex-col bg-[linear-gradient(145deg,rgba(63,14,102,0.96),rgba(24,5,36,0.98))] p-6 sm:p-8 lg:p-9 xl:p-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.20),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.16),transparent_46%)]" aria-hidden="true" />
                <div className="absolute inset-y-0 right-0 hidden w-px bg-white/10 lg:block" aria-hidden="true" />

                <header className="relative shrink-0 max-w-xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/35 bg-white/8 px-3.5 py-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
                    <Users className="h-4 w-4 text-gold-300" aria-hidden="true" />
                    <span className="text-sm font-semibold tracking-wide text-gold-200">
                      Teach on GZURA
                    </span>
                  </div>

                  <h2
                    id="join-heading"
                    className="mt-4 text-3xl font-semibold leading-[0.95] tracking-[-0.03em] text-white sm:text-4xl xl:text-[3.25rem]"
                  >
                    Host a <span className="text-gold-300">Course</span> with GZURA
                  </h2>
                  <p className="mt-3 max-w-lg text-sm leading-6 text-purple-100/90 sm:text-base">
                    Share your expertise with our community. Apply to host workshops, programs, or courses on a platform that feels polished, premium, and made for serious teaching.
                  </p>
                </header>

                <div className="relative mt-6 flex-1 min-h-0 grid content-center gap-3 sm:grid-cols-2 lg:mt-5">
                  {trustPoints.map((point, index) => {
                    const icon = [ShieldCheck, BadgeCheck, Users2, Star][index] ?? CheckCircle2;
                    const Icon = icon;
                    return (
                      <div
                        key={point.name}
                        className="group rounded-xl border border-white/12 bg-white/6 p-3.5 shadow-[0_16px_40px_rgba(0,0,0,0.16)] backdrop-blur-sm transition-transform duration-300 hover:-translate-y-0.5 hover:border-gold-300/30 hover:bg-white/10"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-gold-300 to-gold-500 text-purple-950 shadow-lg shadow-gold-500/20">
                            <Icon className="h-4 w-4" aria-hidden="true" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white">{point.name}</p>
                            <p className="mt-0.5 text-xs leading-5 text-purple-100/75 sm:text-sm sm:leading-6">
                              {point.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="relative mt-5 shrink-0 grid grid-cols-3 gap-3 rounded-xl border border-white/10 bg-white/6 p-3.5 sm:p-4">
                  {highlightStats.map((stat, index) => (
                    <div
                      key={stat.label}
                      className={cn(
                        'text-center sm:text-left',
                        index !== 0 && 'border-l border-white/10 pl-3 sm:pl-4',
                      )}
                    >
                      <p className="text-xl font-semibold tracking-[-0.03em] text-gold-300 sm:text-2xl">
                        {stat.value}
                      </p>
                      <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-purple-100/70 sm:text-xs">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right panel */}
              <div className="flex h-full min-h-0 flex-col bg-[#fbfafc] p-5 sm:p-7 lg:p-8 xl:p-9">
                <div className="mb-5 shrink-0 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-purple-deep/45">
                      Application
                    </p>
                    <h3 className="mt-1.5 text-xl font-semibold tracking-[-0.03em] text-purple-deep sm:text-2xl">
                      Host application
                    </h3>
                    <p className="mt-1.5 max-w-lg text-sm leading-6 text-gray-600">
                      Tell us about yourself and the course you&apos;d like to host.
                    </p>
                  </div>
                  <div className="hidden shrink-0 rounded-xl border border-gold-100 bg-gold-50 px-3.5 py-2.5 text-right shadow-sm md:block">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-royal">
                      Fast review
                    </p>
                    <p className="mt-0.5 text-xs font-medium text-purple-deep sm:text-sm">Usually within 48 hours</p>
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="flex flex-1 min-h-0 flex-col"
                  aria-label="Course host registration form"
                >
                <div className="grid flex-1 content-start gap-x-4 gap-y-3.5 sm:grid-cols-2">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className={formLabelClass}>
                    Full Name <span className="text-red-600" aria-label="required">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    placeholder="Enter your full name"
                    required
                    aria-required="true"
                    className={formFieldClass}
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <Label htmlFor="email" className={formLabelClass}>
                    Email Address <span className="text-red-600" aria-label="required">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="your@email.com"
                    required
                    aria-required="true"
                    className={formFieldClass}
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className={formLabelClass}>
                    Phone Number <span className="text-red-600" aria-label="required">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+1 (234) 567-890"
                    required
                    aria-required="true"
                    className={formFieldClass}
                  />
                </div>

                {/* Gender */}
                <div className="space-y-1.5">
                  <Label htmlFor="gender" className={formLabelClass}>
                    Gender <span className="text-red-600" aria-label="required">*</span>
                  </Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) =>
                      setFormData({ ...formData, gender: value })
                    }
                  >
                    <SelectTrigger id="gender" className={formSelectClass} aria-required="true">
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {genderOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Profession */}
                <div className="space-y-1.5">
                  <Label htmlFor="profession" className={formLabelClass}>
                    Profession <span className="text-red-600" aria-label="required">*</span>
                  </Label>
                  <Input
                    id="profession"
                    value={formData.profession}
                    onChange={(e) =>
                      setFormData({ ...formData, profession: e.target.value })
                    }
                    placeholder="e.g., Marketing Manager, Entrepreneur"
                    required
                    aria-required="true"
                    className={formFieldClass}
                  />
                </div>

                {/* Area of Interest */}
                <div className="space-y-1.5">
                  <Label htmlFor="interest" className={formLabelClass}>
                    Course topic <span className="text-red-600" aria-label="required">*</span>
                  </Label>
                  <Select
                    value={formData.interest}
                    onValueChange={(value) =>
                      setFormData({ ...formData, interest: value })
                    }
                    required
                  >
                    <SelectTrigger id="interest" className={formSelectClass} aria-required="true">
                      <SelectValue placeholder="Select your course topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {interestOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Message */}
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="message" className={formLabelClass}>
                    Message <span className="text-gray-500 text-xs font-normal">(Optional)</span>
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Describe the course you want to host and your experience..."
                    rows={2}
                    className={formTextareaClass}
                  />
                </div>

                {/* Submit Button */}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-secondary mt-4 w-full shrink-0 py-3 text-base font-bold text-purple-950 group focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-600 focus-visible:ring-offset-2 shadow-[0_16px_30px_rgba(212,175,55,0.28)] hover:shadow-[0_20px_36px_rgba(212,175,55,0.34)]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" aria-hidden="true" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit host request
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                    </>
                  )}
                </Button>
              </form>
              </div>
            </div>
          </div>
        </ScrollAnimate>
      </div>
    </section>
  );
}
