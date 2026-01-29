
"use client";
import { Menu } from 'lucide-react';
import { Channel } from '@/lib/m3u-parser';

type HeaderProps = {
  selectedChannel: Channel | null;
  setIsSidebarOpen: (isOpen: boolean) => void;
};

export default function Header({ selectedChannel, setIsSidebarOpen }: HeaderProps) {
  return (
    <header className="flex items-center justify-between h-16 px-6 bg-card border-b border-border shrink-0">
      <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-full hover:bg-secondary block md:hidden">
        <Menu />
      </button>
      <div className="flex items-center gap-4">
        {selectedChannel ? (
          <div>
            <h2 className="font-semibold text-lg">{selectedChannel.name}</h2>
            <p className="text-sm text-muted-foreground">{selectedChannel.group.title}</p>
          </div>
        ) : (
          <div />
        )}
      </div>
      <div />
    </header>
  );
}
