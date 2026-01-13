import Link from 'next/link';
import Image from 'next/image';
import type { Channel } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

type ChannelCardProps = {
  channel: Channel;
};

export function ChannelCard({ channel }: ChannelCardProps) {
  const placeholder = PlaceHolderImages.find(p => p.id === channel.image);

  return (
    <Link href={`/watch/${channel.id}`} className="group block">
      <Card className="h-full overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-accent/10 hover:-translate-y-1 border-transparent hover:border-accent/20 bg-card">
        <CardHeader className="p-0">
          <div className="relative aspect-video">
            {placeholder ? (
              <Image
                src={placeholder.imageUrl}
                alt={channel.title}
                width={600}
                height={400}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={placeholder.imageHint}
              />
            ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">No Image</span>
                </div>
            )}
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
             <div className="absolute bottom-4 right-4 p-2 bg-background/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowRight className="w-5 h-5 text-accent" />
             </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="font-headline text-lg leading-tight">{channel.title}</CardTitle>
          <CardDescription className="mt-2 text-sm line-clamp-2">{channel.description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}
