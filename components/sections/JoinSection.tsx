'use client';

import ScrollAnimate from '@/components/animations/ScrollAnimate';
import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  CheckCircle2,
  ArrowRight,
  Loader2,
  Clock,
  Users,
  Star,
  ShieldCheck,
  BadgeCheck,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

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

const highlightStats = [
  { value: '5K+', label: 'Members', icon: Users },
  { value: '50+', label: 'Events', icon: BadgeCheck },
  { value: '100+', label: 'Mentors', icon: Star },
];

const trustChips = [
  { label: 'Community Support', icon: ShieldCheck },
  { label: 'Leadership Growth', icon: BadgeCheck },
  { label: 'Entrepreneur Network', icon: Users },
];

const hostSteps = [
  { step: '01', title: 'Apply in minutes', detail: 'Share your background and the course you want to host.' },
  { step: '02', title: 'Reviewed in 48 hours', detail: 'We check fit and reply with clear next steps.' },
  { step: '03', title: 'Go live on GZURA', detail: 'Teach a community already looking to grow.' },
];

/** Darker seminar stage — left side stays readable under purple wash */
const HERO_IMAGE =
  'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1600';

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
    preferredDate: '',
    preferredTime: '',
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
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime.trim(),
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
          preferredDate: '',
          preferredTime: '',
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
        id="register"
        className="section-padding scroll-mt-20 bg-gray-50 relative overflow-hidden"
        aria-labelledby="success-heading"
      >
        <div className="container relative z-10">
          <div className="relative rounded md:rounded-[2rem] overflow-hidden min-h-[420px] shadow-2xl">
            <Image
              src={HERO_IMAGE}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
              aria-hidden
            />
            <div
              className="absolute inset-0 bg-gradient-to-br from-purple-deep/95 via-purple-800/90 to-purple-950/85"
              aria-hidden
            />
            <div className="relative z-10 flex items-center justify-center p-2 md:p-12 min-h-[420px]">
              <div className="bg-white rounded-xl p-2 md:p-12 shadow-2xl max-w-md w-full text-center animate-scale-in">
                <div
                  className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center"
                  aria-hidden="true"
                >
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <h3 id="success-heading" className="heading-md text-gray-900 mb-4">
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
        </div>
      </section>
    );
  }

  return (
    <section
      id="register"
      className="scroll-mt-20 section-padding bg-gray-50 relative overflow-hidden"
      aria-labelledby="join-heading"
    >
      <div className="container relative z-10">
        <ScrollAnimate animation="fade-up">
          <div className="relative rounded-xl md:rounded-[2rem] overflow-hidden shadow-2xl shadow-purple-900/20">
            {/* Background image */}
            <div className="absolute inset-0">
              <Image
                src={HERO_IMAGE}
                alt="Speaker presenting at a leadership conference"
                fill
                className="object-cover object-[70%_center]"
                sizes="(max-width: 1280px) 100vw, 1280px"
                priority={false}
              />
              {/* Heavy left wash so copy stays crisp; image shows on the right */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-purple-deep via-purple-deep/95 to-purple-deep/55"
                aria-hidden
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-purple-950/90 via-purple-deep/40 to-purple-deep/50"
                aria-hidden
              />
              {/* Extra solid panel behind left text on large screens */}
              <div
                className="absolute inset-y-0 left-0 hidden w-[55%] bg-gradient-to-r from-purple-deep via-purple-deep/90 to-transparent lg:block"
                aria-hidden
              />
            </div>

            <div className="relative z-10 grid items-stretch gap-6 p-5 sm:p-6 md:p-8 lg:grid-cols-2 lg:gap-8 lg:p-10">
              {/* Left: hero copy — stretches to match the form so the bottom is not empty */}
              <div className="order-2 flex h-full min-h-0 flex-col items-start text-left text-white lg:order-1 lg:pr-2">
                <div className="inline-flex items-start gap-2 rounded-full bg-black/25 backdrop-blur-md border border-white/25 px-3.5 py-1.5 mb-5 w-fit shadow-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" aria-hidden />
                  <span className="text-gold-300 text-xs sm:text-sm font-semibold tracking-wide">
                    Teach on GZURA
                  </span>
                </div>

                <h2
                  id="join-heading"
                  className="text-3xl sm:text-4xl md:text-5xl xl:text-[3.25rem] font-bold leading-[1.1] tracking-tight mb-4 max-w-xl text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]"
                >
                  Share Your Expertise.
                  <span className="block text-gold-400 mt-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
                    Host Your Dream Course
                  </span>
                </h2>

                <p className="text-white text-sm sm:text-base md:text-lg leading-relaxed max-w-md mb-6 drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
                  Whether you lead workshops, mentor entrepreneurs, or run leadership programs —
                  we help you teach a community ready to grow.
                </p>

                <div className="flex flex-wrap gap-2.5 mb-8">
                  {trustChips.map((chip) => {
                    const Icon = chip.icon;
                    return (
                      <div
                        key={chip.label}
                        className="inline-flex items-center gap-2 rounded-full bg-black/30 backdrop-blur-md border border-white/20 px-3 py-1.5 text-xs sm:text-sm text-white font-medium shadow-md"
                      >
                        <Icon className="w-3.5 h-3.5 text-gold-400 shrink-0" aria-hidden />
                        {chip.label}
                      </div>
                    );
                  })}
                </div>

                <ol className="w-full max-w-md space-y-3.5 mb-8">
                  {hostSteps.map((item) => (
                    <li key={item.step} className="flex items-start gap-3 text-left">
                      <span className="mt-0.5 shrink-0 text-sm font-bold tabular-nums text-gold-400">
                        {item.step}
                      </span>
                      <div>
                        <p className="text-sm sm:text-base font-semibold text-white leading-snug">
                          {item.title}
                        </p>
                        <p className="text-white/75 text-xs sm:text-sm mt-0.5 leading-relaxed">
                          {item.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>

                <div className="mt-auto flex w-full flex-wrap gap-6 sm:gap-10 pt-5 border-t border-white/25">
                  {highlightStats.map((stat) => (
                    <div key={stat.label}>
                      <p className="text-2xl sm:text-3xl font-bold text-gold-400 drop-shadow-md">
                        {stat.value}
                      </p>
                      <p className="text-white/90 text-xs sm:text-sm mt-0.5 font-medium">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: floating form card */}
              <div className="order-1 flex items-start lg:order-2">
                <div className="flex w-full flex-col rounded-xl border border-white/60 bg-white p-5 shadow-2xl sm:p-6 md:rounded-3xl md:p-7">
                  <div className="flex items-start justify-between gap-3 mb-5 md:mb-6">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                        Host application
                      </h3>
                      <p className="text-gray-500 text-sm mt-1.5 leading-relaxed">
                        Tell us about yourself and the course you&apos;d like to host.
                      </p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 rounded-xl bg-gold-50 border border-gold-100 px-3 py-2 shrink-0">
                      <Clock className="w-4 h-4 text-gold-600" aria-hidden="true" />
                      <div className="text-xs leading-tight">
                        <p className="font-semibold text-gold-700">Fast review</p>
                        <p className="text-gray-500">Within 48 hours</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 mb-4 sm:hidden">
                    Please fill in all required details.
                  </p>

                  <form
                    onSubmit={handleSubmit}
                    aria-label="Course host registration form"
                    className="flex flex-col flex-1"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label htmlFor="fullName" className="text-gray-500 font-medium text-xs uppercase tracking-wide">
                          Full Name *
                        </Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          placeholder="Enter your full name"
                          required
                          aria-required="true"
                          className="bg-gray-50/80 border-gray-200 h-11 rounded-xl focus-visible:ring-purple-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-gray-500 font-medium text-xs uppercase tracking-wide">
                          Email *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="your@email.com"
                          required
                          aria-required="true"
                          className="bg-gray-50/80 border-gray-200 h-11 rounded-xl focus-visible:ring-purple-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-gray-500 font-medium text-xs uppercase tracking-wide">
                          Phone *
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+1 (234) 567-890"
                          required
                          aria-required="true"
                          className="bg-gray-50/80 border-gray-200 h-11 rounded-xl focus-visible:ring-purple-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="gender" className="text-gray-500 font-medium text-xs uppercase tracking-wide">
                          Gender *
                        </Label>
                        <Select
                          value={formData.gender}
                          onValueChange={(value) => setFormData({ ...formData, gender: value })}
                        >
                          <SelectTrigger
                            id="gender"
                            className="bg-gray-50/80 border-gray-200 h-11 rounded-xl focus:ring-purple-500"
                            aria-required="true"
                          >
                            <SelectValue placeholder="Select gender" />
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

                      <div className="space-y-1.5">
                        <Label htmlFor="profession" className="text-gray-500 font-medium text-xs uppercase tracking-wide">
                          Profession *
                        </Label>
                        <Input
                          id="profession"
                          value={formData.profession}
                          onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                          placeholder="e.g., Marketing Manager"
                          required
                          aria-required="true"
                          className="bg-gray-50/80 border-gray-200 h-11 rounded-xl focus-visible:ring-purple-500"
                        />
                      </div>

                      <div className="space-y-1.5 sm:col-span-2">
                        <Label htmlFor="interest" className="text-gray-500 font-medium text-xs uppercase tracking-wide">
                          Course topic *
                        </Label>
                        <Select
                          value={formData.interest}
                          onValueChange={(value) => setFormData({ ...formData, interest: value })}
                          required
                        >
                          <SelectTrigger
                            id="interest"
                            className="bg-gray-50/80 border-gray-200 h-11 rounded-xl focus:ring-purple-500"
                            aria-required="true"
                          >
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

                      <div className="space-y-1.5">
                        <Label htmlFor="preferredDate" className="text-gray-500 font-medium text-xs uppercase tracking-wide">
                          Preferred Date <span className="normal-case tracking-normal font-normal text-gray-400">(optional)</span>
                        </Label>
                        <Input
                          id="preferredDate"
                          type="date"
                          value={formData.preferredDate}
                          onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                          className="bg-gray-50/80 border-gray-200 h-11 rounded-xl focus-visible:ring-purple-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="preferredTime" className="text-gray-500 font-medium text-xs uppercase tracking-wide">
                          Preferred Time <span className="normal-case tracking-normal font-normal text-gray-400">(optional)</span>
                        </Label>
                        <Input
                          id="preferredTime"
                          type="text"
                          value={formData.preferredTime}
                          onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                          placeholder="e.g., 5:00 PM - 7:00 PM IST"
                          className="bg-gray-50/80 border-gray-200 h-11 rounded-xl focus-visible:ring-purple-500"
                        />
                      </div>

                      <div className="space-y-1.5 sm:col-span-2">
                        <Label htmlFor="message" className="text-gray-500 font-medium text-xs uppercase tracking-wide">
                          Message <span className="normal-case tracking-normal font-normal text-gray-400">(optional)</span>
                        </Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Describe the course you want to host and your experience..."
                          rows={3}
                          className="bg-gray-50/80 border-gray-200 rounded-xl resize-none focus-visible:ring-purple-500"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full mt-6 h-12 rounded-full bg-purple-deep hover:bg-purple-800 text-white font-semibold text-base shadow-lg shadow-purple-900/25 transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" aria-hidden="true" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit host request
                          <ArrowRight
                            className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                            aria-hidden="true"
                          />
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </ScrollAnimate>
      </div>
    </section>
  );
}
