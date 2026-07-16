'use client';

import ScrollAnimate from '@/components/animations/ScrollAnimate';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  CheckCircle2,
  Users,
  ArrowRight,
  Loader2,
  Star,
  ShieldCheck,
  Users2,
  BadgeCheck,
  Clock,
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

const trustPoints = [
  { name: 'Community Support', description: 'Connect with like-minded individuals', icon: ShieldCheck },
  { name: 'Leadership Opportunities', description: 'Develop skills that drive success', icon: BadgeCheck },
  { name: 'Entrepreneur Network', description: 'Build valuable business relationships', icon: Users2 },
  { name: 'Personal Growth', description: 'Transform your personal and professional life', icon: Star },
];

const highlightStats = [
  { value: '5K+', label: 'Members' },
  { value: '50+', label: 'Events' },
  { value: '100+', label: 'Mentors' },
];

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
        className="section-padding scroll-mt-20 bg-gray-50 relative overflow-hidden"
        aria-labelledby="success-heading"
      >
        <div className="container-custom relative z-10">
          <div className="max-w-xl mx-auto text-center">
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-gray-100 animate-scale-in">
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
      </section>
    );
  }

  return (
    <section
      id="register"
      className="scroll-mt-20 section-padding bg-gray-50 relative overflow-hidden"
      aria-labelledby="join-heading"
    >
      <div
        className="absolute inset-0 bg-gradient-to-br from-purple-deep/5 to-gold-500/5"
        aria-hidden="true"
      />
      <div
        className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-full blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-gold-500/10 to-transparent rounded-full blur-3xl"
        aria-hidden="true"
      />

      <div className="container-custom relative z-10">
        <ScrollAnimate animation="fade-up">
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-100 rounded-full px-4 py-2 mb-6">
              <Users className="w-4 h-4 text-purple-700" aria-hidden="true" />
              <span className="text-purple-700 text-sm font-semibold">Teach on GZURA</span>
            </div>
            <h2 id="join-heading" className="heading-lg text-gray-900 mb-4">
              Host a <span className="gradient-text">Course</span> with GZURA
            </h2>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
              Share your expertise with our community. Apply to host workshops, programs, or courses
              on a platform built for serious teaching.
            </p>
          </div>
        </ScrollAnimate>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
          <ScrollAnimate animation="slide-left" className="lg:col-span-1">
            <h3 className="heading-md text-gray-900 mb-6">Why teach here</h3>
            <div className="space-y-5">
              {trustPoints.map((point) => {
                const Icon = point.icon;
                return (
                  <div key={point.name} className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-purple-deep to-purple-700 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-gray-900 font-semibold">{point.name}</p>
                      <p className="text-gray-500 text-sm mt-0.5 leading-relaxed">{point.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-4">
                {highlightStats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-xl font-bold text-purple-deep">{stat.value}</p>
                    <p className="text-gray-500 text-xs mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollAnimate>

          <ScrollAnimate animation="slide-right" className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-lg border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
                <div>
                  <h3 className="heading-md text-gray-900">Host application</h3>
                  <p className="text-gray-500 mt-2">
                    Tell us about yourself and the course you&apos;d like to host.
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-gold-50 px-4 py-2.5 shrink-0">
                  <Clock className="w-4 h-4 text-gold-600" aria-hidden="true" />
                  <div className="text-sm">
                    <p className="font-semibold text-gold-700">Fast review</p>
                    <p className="text-gray-500">Within 48 hours</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} aria-label="Course host registration form">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Enter your full name"
                      required
                      aria-required="true"
                      className="bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                      required
                      aria-required="true"
                      className="bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (234) 567-890"
                      required
                      aria-required="true"
                      className="bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => setFormData({ ...formData, gender: value })}
                    >
                      <SelectTrigger id="gender" className="bg-white" aria-required="true">
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

                  <div className="space-y-2">
                    <Label htmlFor="profession">Profession *</Label>
                    <Input
                      id="profession"
                      value={formData.profession}
                      onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                      placeholder="e.g., Marketing Manager"
                      required
                      aria-required="true"
                      className="bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interest">Course topic *</Label>
                    <Select
                      value={formData.interest}
                      onValueChange={(value) => setFormData({ ...formData, interest: value })}
                      required
                    >
                      <SelectTrigger id="interest" className="bg-white" aria-required="true">
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

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="message">
                      Message <span className="text-gray-400 font-normal">(optional)</span>
                    </Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Describe the course you want to host and your experience..."
                      rows={4}
                      className="bg-white resize-none"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-secondary w-full mt-8 py-3.5 text-base group focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-600 focus-visible:ring-offset-2"
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
          </ScrollAnimate>
        </div>
      </div>
    </section>
  );
}