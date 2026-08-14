import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import ProgramsSection from '@/components/sections/ProgramsSection';
import JoinSection from '@/components/sections/JoinSection';
import SuccessStoriesSection from '@/components/sections/SuccessStoriesSection';
import UpcomingEventsSection from '@/components/sections/UpcomingEventsSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import CTASection from '@/components/sections/CTASection';

export default function MarketingHome() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ProgramsSection />
      <JoinSection />
      <SuccessStoriesSection />
      <UpcomingEventsSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}