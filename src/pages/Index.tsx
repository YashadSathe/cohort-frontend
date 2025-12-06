import { HeroSection } from '@/components/home/HeroSection';
import { CoursesPreview } from '@/components/home/CoursesPreview';
import { HowItWorks } from '@/components/home/HowItWorks';
import { MentorsSection } from '@/components/home/MentorsSection';
import { CTASection } from '@/components/home/CTASection';

const Index = () => {
  return (
    <>
      <HeroSection />
      <CoursesPreview />
      <HowItWorks />
      <MentorsSection />
      <CTASection />
    </>
  );
};

export default Index;
