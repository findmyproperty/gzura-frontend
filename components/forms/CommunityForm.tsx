'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const interests = [
  'Leadership Development',
  'Entrepreneurship',
  'Mentorship',
  'Networking',
  'Career Growth',
  'Skill Development',
];

const hearAboutUs = [
  'Search Engine',
  'Social Media',
  'Friend/Colleague',
  'Event',
  'Advertisement',
  'Other',
];

export default function CommunityForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    profession: '',
    interests: [] as string[],
    hearAbout: '',
    termsAccepted: false,
    newsletterOptIn: true,
  });

  const handleInterestChange = (interest: string, checked: boolean) => {
    setFormData({
      ...formData,
      interests: checked
        ? [...formData.interests, interest]
        : formData.interests.filter((i) => i !== interest),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.termsAccepted) {
      toast({
        title: 'Terms Required',
        description: 'Please accept the terms and conditions to continue.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    const params = new URLSearchParams({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
    });
    router.push(`/signup?${params.toString()}`);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            placeholder="John"
            required
            className="bg-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            placeholder="Doe"
            required
            className="bg-white"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="john@example.com"
            required
            className="bg-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            placeholder="+1 (234) 567-890"
            className="bg-white"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) =>
              setFormData({ ...formData, city: e.target.value })
            }
            placeholder="New York"
            className="bg-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            value={formData.country}
            onChange={(e) =>
              setFormData({ ...formData, country: e.target.value })
            }
            placeholder="United States"
            className="bg-white"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="profession">Profession / Industry</Label>
        <Input
          id="profession"
          value={formData.profession}
          onChange={(e) =>
            setFormData({ ...formData, profession: e.target.value })
          }
          placeholder="Marketing Manager | Technology"
          className="bg-white"
        />
      </div>

      <div className="space-y-3">
        <Label>Areas of Interest</Label>
        <div className="grid grid-cols-2 gap-3">
          {interests.map((interest) => (
            <div key={interest} className="flex items-center space-x-2">
              <Checkbox
                id={interest}
                checked={formData.interests.includes(interest)}
                onCheckedChange={(checked) =>
                  handleInterestChange(interest, checked as boolean)
                }
              />
              <label
                htmlFor={interest}
                className="text-sm text-gray-700 cursor-pointer"
              >
                {interest}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>How did you hear about us?</Label>
        <Select
          value={formData.hearAbout}
          onValueChange={(value) =>
            setFormData({ ...formData, hearAbout: value })
          }
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {hearAboutUs.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4 pt-4 border-t border-gray-200">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            checked={formData.termsAccepted}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, termsAccepted: checked as boolean })
            }
          />
          <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
            I accept the{' '}
            <a href="/terms" className="text-purple-700 hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-purple-700 hover:underline">
              Privacy Policy
            </a>
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="newsletter"
            checked={formData.newsletterOptIn}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, newsletterOptIn: checked as boolean })
            }
          />
          <label
            htmlFor="newsletter"
            className="text-sm text-gray-600 cursor-pointer"
          >
            Subscribe to our newsletter for updates and insights
          </label>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="btn-secondary w-full"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Registering...
          </>
        ) : (
          <>
            Join GZURA
            <ArrowRight className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>
    </form>
  );
}
