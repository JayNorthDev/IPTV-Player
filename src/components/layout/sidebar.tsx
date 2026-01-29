
"use client";
import { Search, Tv, X } from 'lucide-react';
import { Channel } from '@/lib/m3u-parser';
import { Skeleton } from '@/components/ui/skeleton';

type SidebarProps = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  displayChannels: Channel[];
  selectedChannel: Channel | null;
  handleChannelClick: (channel: Channel) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
  loading: boolean;
};

export default function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  displayChannels,
  selectedChannel,
  handleChannelClick,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  categories,
  loading,
}: SidebarProps) {
  return (
    <aside className={`absolute md:relative z-20 h-full bg-sidebar transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-80' : 'w-0 md:w-20'} overflow-hidden flex flex-col`}>
      <div className="flex items-center justify-between p-4 h-16 border-b border-sidebar-border shrink-0">
        <div className={`flex items-center gap-2 ${!isSidebarOpen && 'md:hidden'}`}>
          <Tv className="w-8 h-8 text-primary" />
          <h1 className="text-xl font-bold">GTNPlay</h1>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-full hover:bg-sidebar-accent md:hidden">
          {isSidebarOpen ? <X /> : null}
        </button>
      </div>

      <div className={`p-4 shrink-0 ${!isSidebarOpen && 'md:p-2 md:flex md:justify-center'}`}>
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground ${!isSidebarOpen && 'md:hidden'}`} />
          <button className={`p-2 rounded-full hover:bg-sidebar-accent ${isSidebarOpen && 'md:hidden'} hidden md:block`} onClick={() => !isSidebarOpen && setIsSidebarOpen(true)}>
            <Search className="w-5 h-5 text-muted-foreground" />
          </button>
          <input
            type="text"
            placeholder="Search channels..."
            className={`w-full bg-card border border-input rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary ${!isSidebarOpen && 'md:hidden'}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className={`px-4 pb-2 ${!isSidebarOpen && 'md:hidden'}`}>
        <p className="text-sm text-muted-foreground font-semibold mb-2">Categories</p>
        <select
          onChange={(e) => setSelectedCategory(e.target.value)}
          value={selectedCategory}
          className="w-full bg-card border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        <h3 className={`text-lg font-semibold mb-4 ${!isSidebarOpen && 'md:hidden'}`}>{selectedCategory} Channels</h3>
        {loading ? (
          <div className="space-y-2">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg">
                <Skeleton className="w-10 h-10 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {displayChannels.map((channel, index) => (
              <button
                key={`${channel.url}-${index}`}
                onClick={() => handleChannelClick(channel)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${selectedChannel?.url === channel.url ? 'bg-sidebar-accent shadow-lg' : 'hover:bg-secondary'}`}
              >
                {channel.tvg.logo && <img src={channel.tvg.logo} alt={channel.name} className="w-10 h-10 object-contain rounded-md bg-black shrink-0" />}
                {!channel.tvg.logo && <div className="w-10 h-10 flex items-center justify-center bg-card rounded-md shrink-0"><Tv className="w-5 h-5 text-muted-foreground" /></div>}
                <div className={`flex-1 overflow-hidden ${!isSidebarOpen && 'md:hidden'}`}>
                  <p className="font-semibold truncate">{channel.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{channel.group.title || "No Group"}</p>
                </div>
              </button>
            ))}
            {displayChannels.length === 0 && searchTerm && (
              <div className={`text-center py-8 text-muted-foreground ${!isSidebarOpen && 'md:hidden'}`}>
                <p>No channels found for "{searchTerm}".</p>
              </div>
            )}
          </>
        )}
      </nav>
    </aside>
  );
}
