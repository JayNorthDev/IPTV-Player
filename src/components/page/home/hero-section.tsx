import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-pier');

  return (
    <section className="relative w-full h-[50vh] min-h-[400px] max-h-[600px] flex items-center justify-center text-center text-white rounded-lg overflow-hidden">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          data-ai-hint={heroImage.imageHint}
          priority
        />
      )}
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 p-4 max-w-4xl mx-auto">
        <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
          Unlock a World of Entertainment with Webkul
        </h1>
        <p className="mt-4 text-lg md:text-xl text-foreground/80">
          Stream your favorite TV channels from across the globe, right here, right now. Endless content awaits.
        </p>
        <div className="mt-8 flex justify-center">
            <Button size="lg" className="font-bold">Start Watching</Button>
        </div>
      </div>
    </section>
  );
}
