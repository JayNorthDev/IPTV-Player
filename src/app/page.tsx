import { HeroSection } from '@/components/page/home/hero-section';
import { VideoCatalog } from '@/components/page/home/video-catalog';

export default function Home() {
  return (
    <div className="space-y-8">
      <HeroSection />
      <VideoCatalog />
    </div>
  );
}
