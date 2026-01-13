"use client";
import { useState, useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { Search, Tv, Menu, MonitorPlay, X } from 'lucide-react';
import { getFirebase } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

// Manual M3U parser to replace iptv-playlist-parser
const manualParse = (m3u: string) => {
  const lines = m3u.split('\n');
  const items: any[] = [];
  let currentItem: any = { tvg: {}, group: {}, http: {} };

  for (const line of lines) {
    if (line.startsWith('#EXTINF:')) {
      const info = line.substring(8).trim();
      const tvgIdMatch = info.match(/tvg-id="([^"]*)"/);
      const tvgNameMatch = info.match(/tvg-name="([^"]*)"/);
      const tvgLogoMatch = info.match(/tvg-logo="([^"]*)"/);
      const groupTitleMatch = info.match(/group-title="([^"]*)"/);
      const nameMatch = info.match(/,(.*)$/);

      currentItem.tvg.id = tvgIdMatch ? tvgIdMatch[1] : '';
      currentItem.tvg.name = tvgNameMatch ? tvgNameMatch[1] : '';
      currentItem.tvg.logo = tvgLogoMatch ? tvgLogoMatch[1] : '';
      currentItem.group.title = groupTitleMatch ? groupTitleMatch[1] : '';
      currentItem.name = nameMatch ? nameMatch[1].trim() : '';

    } else if (line.startsWith('http')) {
      currentItem.url = line.trim();
      items.push(currentItem);
      currentItem = { tvg: {}, group: {}, http: {} };
    }
  }
  return { items };
};


export default function Home() {
  const [allChannels, setAllChannels] = useState<any[]>([]);
  const [displayChannels, setDisplayChannels] = useState<any[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);
  const { firestore } = getFirebase();

  useEffect(() => {
    async function fetchChannels() {
      const defaultUrl = 'https://iptv-org.github.io/iptv/index.m3u';
      let playlistUrl = defaultUrl;

      try {
        const playlistDocRef = doc(firestore, "settings", "playlist");
        const docSnap = await getDoc(playlistDocRef);

        if (docSnap.exists() && docSnap.data().url) {
          playlistUrl = docSnap.data().url;
          console.log("Using custom playlist URL from Firebase:", playlistUrl);
        } else {
          console.log("Custom playlist URL not found in Firebase, using default.");
        }
      } catch (error) {
        console.error("Error fetching playlist URL from Firebase, using default:", error);
      }

      try {
        const response = await fetch(playlistUrl);
        const text = await response.text();
        const playlist = manualParse(text);
        
        const validChannels = playlist.items.filter(item => item.url);
        setAllChannels(validChannels);
        
        setDisplayChannels(validChannels.slice(0, 200)); 

        const uniqueCategories = ["All", ...new Set(validChannels.map(item => item.group.title || "Other").filter(Boolean))];
        setCategories(uniqueCategories.sort());
      } catch (error) {
        console.error("Error loading playlist:", error);
      }
    }
    fetchChannels();
  }, [firestore]);

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current && videoRef.current) {
      const videoElement = videoRef.current;
      playerRef.current = videojs(videoElement, {
        autoplay: true,
        controls: true,
        fluid: true,
        liveui: true,
      });
    }
    
    // Update player source when selectedChannel changes
    if (playerRef.current && selectedChannel) {
        playerRef.current.src({
            src: selectedChannel.url,
            type: selectedChannel.http?.['content-type'] || 'application/x-mpegURL',
        });
        playerRef.current.play();
    }

    // Dispose the player on component unmount
    return () => {
      if (playerRef.current) {
        // playerRef.current.dispose();
        // playerRef.current = null;
      }
    };
  }, [selectedChannel]);


  useEffect(() => {
    let channels = allChannels;
    if (selectedCategory !== "All") {
      channels = channels.filter(c => (c.group.title || "Other") === selectedCategory);
    }
    if (searchTerm) {
      channels = channels.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setDisplayChannels(channels.slice(0, 200)); // Limit displayed results for performance
  }, [searchTerm, selectedCategory, allChannels]);

  const handleChannelClick = (channel: any) => {
    setSelectedChannel(channel);
    if (window.innerWidth < 768) { // md breakpoint
        setIsSidebarOpen(false);
    }
  };
  
  const categoriesToShow = categories; // Show all categories

  return (
    <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden">
      {/* Sidebar / Channel & Category List */}
      <aside className={`absolute md:relative z-20 h-full bg-sidebar transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-80' : 'w-0 md:w-20'} overflow-hidden flex flex-col`}>
        <div className="flex items-center justify-between p-4 h-16 border-b border-sidebar-border shrink-0">
          <div className={`flex items-center gap-2 ${!isSidebarOpen && 'md:hidden'}`}>
            <Tv className="w-8 h-8 text-primary" />
            <h1 className="text-xl font-bold">IPTV Player</h1>
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-full hover:bg-sidebar-accent md:hidden">
            {isSidebarOpen ? <X/> : <Menu/>}
          </button>
        </div>

        <div className={`p-4 shrink-0 ${!isSidebarOpen && 'md:p-2 md:flex md:justify-center'}`}>
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground ${!isSidebarOpen && 'md:hidden'}`} />
             <button className={`p-2 rounded-full hover:bg-sidebar-accent ${isSidebarOpen && 'md:hidden'} hidden md:block`} onClick={() => isSidebarOpen ? null : setIsSidebarOpen(true)}>
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
                {categoriesToShow.map(category => (
                    <option key={category} value={category}>{category}</option>
                ))}
            </select>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            <h3 className={`text-lg font-semibold mb-4 ${!isSidebarOpen && 'md:hidden'}`}>{selectedCategory} Channels</h3>
            {displayChannels.map((channel, index) => (
            <button
                key={`${channel.url}-${index}`}
                onClick={() => handleChannelClick(channel)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${selectedChannel?.url === channel.url ? 'bg-sidebar-accent shadow-lg' : 'hover:bg-secondary'}`}
            >
                {channel.tvg.logo && <img src={channel.tvg.logo} alt={channel.name} className="w-10 h-10 object-contain rounded-md bg-black shrink-0" />}
                {!channel.tvg.logo && <div className="w-10 h-10 flex items-center justify-center bg-card rounded-md shrink-0"><Tv className="w-5 h-5 text-muted-foreground"/></div>}
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
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between h-16 px-6 bg-card border-b border-border shrink-0">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-full hover:bg-secondary block md:hidden">
                <Menu/>
            </button>
            <div className="flex items-center gap-4">
                {selectedChannel && (
                    <div>
                        <h2 className="font-semibold text-lg">{selectedChannel.name}</h2>
                        <p className="text-sm text-muted-foreground">{selectedChannel.group.title}</p>
                    </div>
                )}
                 {!selectedChannel && (
                    <div />
                )}
            </div>
            <div />
        </header>

        {/* Player */}
        <main className="flex-1 flex flex-col bg-black">
          {selectedChannel ? (
            <div data-vjs-player className="w-full h-full">
              <video ref={videoRef} className="video-js vjs-big-play-centered w-full h-full" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-black">
              <MonitorPlay className="w-24 h-24 mb-4" />
              <h2 className="text-2xl font-semibold">Select a channel to start watching</h2>
              <p>Choose from the list on the left</p>
            </div>
          )}
           {!selectedChannel && (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-black">
                  <MonitorPlay className="w-24 h-24 mb-4" />
                  <h2 className="text-2xl font-semibold">Select a channel to start watching</h2>
                  <p>Choose from the list on the left</p>
                </div>
            )}
             {selectedChannel && (
                <div data-vjs-player className="w-full h-full">
                    <video ref={videoRef} className="video-js vjs-big-play-centered w-full h-full" />
                </div>
            )}
        </main>
      </div>
    </div>
  );
}
