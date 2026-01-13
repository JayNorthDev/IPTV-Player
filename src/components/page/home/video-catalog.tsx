'use client';

import { useState, useMemo } from 'react';
import { channels as allChannels } from '@/lib/data';
import { ChannelCard } from './channel-card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export function VideoCatalog() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChannels = useMemo(() => {
    if (!searchQuery) return allChannels;
    return allChannels.filter(
      channel =>
        channel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        channel.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <section className="py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h2 className="font-headline text-3xl font-bold tracking-tight">Live Channels</h2>
        <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Search channels..."
                className="pl-10"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
            />
        </div>
      </div>
      
      {filteredChannels.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredChannels.map(channel => (
            <ChannelCard key={channel.id} channel={channel} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
            <h3 className="font-headline text-xl">No Channels Found</h3>
            <p className="text-muted-foreground mt-2">Try adjusting your search query.</p>
        </div>
      )}
    </section>
  );
}
