"use client";
import { useState, useEffect } from 'react';
import { useChannels } from '@/hooks/useChannels';
import Sidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';
import VideoPlayer from '@/components/player/VideoPlayer';
import { Channel } from '@/lib/m3u-parser';
import { AlertTriangle } from 'lucide-react';

export default function Home() {
  const { displayChannels, categories, loading, error, filterChannels } = useChannels();
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    filterChannels(searchTerm, selectedCategory);
  }, [searchTerm, selectedCategory, filterChannels]);

  const handleChannelClick = (channel: Channel) => {
    setSelectedChannel(channel);
    if (window.innerWidth < 768) { // md breakpoint
      setIsSidebarOpen(false);
    }
  };

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-4">
          <AlertTriangle className="w-16 h-16 text-destructive" />
          <h2 className="text-2xl font-semibold">Failed to load playlist</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        displayChannels={displayChannels}
        selectedChannel={selectedChannel}
        handleChannelClick={handleChannelClick}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        loading={loading}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header selectedChannel={selectedChannel} setIsSidebarOpen={setIsSidebarOpen} />
        <VideoPlayer channel={selectedChannel} />
      </div>
    </div>
  );
}

