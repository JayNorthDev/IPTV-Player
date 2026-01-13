"use client";
import { useState, useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { Search, Tv, Menu, MonitorPlay, X, Signal } from 'lucide-react';
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
  
  const videoNode = useRef<HTMLVideoElement>(null);
  const player = useRef<any>(null);
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
        
        // Initially display a subset of channels to avoid performance issues
        setDisplayChannels(validChannels.slice(0, 100)); 

        const uniqueCategories = ["All", ...new Set(validChannels.map(item => item.group.title || "Other"))];
        setCategories(uniqueCategories.sort());
      } catch (error) {
        console.error("Error loading playlist:", error);
      }
    }
    fetchChannels();
  }, [firestore]);

  useEffect(() => {
    const videoElement = videoNode.current;
    if (videoElement && !player.current) {
      player.current = videojs(videoElement, {
        autoplay: true,
        controls: true,
        fluid: true,
        liveui: true,
      });
    }

    return () => {
      if (player.current) {
        player.current.dispose();
        player.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (selectedChannel && player.current) {
      player.current.src({
        src: selectedChannel.url,
        type: selectedChannel.http?.['content-type'] || 'application/x-mpegURL',
      });
      player.current.play();
    }
  }, [selectedChannel]);

  useEffect(() => {
    let channels = allChannels;
    if (selectedCategory !== "All") {
      channels = channels.filter(c => (c.group.title || "Other") === selectedCategory);
    }
    if (searchTerm) {
      channels = channels.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setDisplayChannels(channels.slice(0, 100)); // Limit displayed results for performance
  }, [searchTerm, selectedCategory, allChannels]);

  const handleChannelClick = (channel: any) => {
    setSelectedChannel(channel);
    if (window.innerWidth < 768) { // md breakpoint
        setIsSidebarOpen(false);
    }
  };
  
  const categoriesToShow = categories.slice(0, 15);

  return (
    <div className="flex h-screen bg-[#0f0f0f] text-gray-200 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className={`absolute md:relative z-20 h-full bg-[#1a1a1a] transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-0 md:w-16'} overflow-hidden`}>
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 h-16 border-b border-gray-700">
              <div className={`flex items-center gap-2 ${!isSidebarOpen && 'md:hidden'}`}>
                <Tv className="w-8 h-8 text-red-500" />
                <h1 className="text-xl font-bold">IPTV Player</h1>
              </div>
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-full hover:bg-gray-700 md:hidden">
                {isSidebarOpen ? <X/> : <Menu/>}
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                <div className={`p-4 ${!isSidebarOpen && 'md:hidden'}`}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search channels..."
                      className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <p className={`text-sm text-gray-400 font-semibold mb-2 ${!isSidebarOpen && 'md:hidden'}`}>Categories</p>
                {categoriesToShow.map(category => (
                    <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-3 transition-colors ${selectedCategory === category ? 'bg-red-500/20 text-red-400' : 'hover:bg-gray-700'}`}
                    >
                        <Signal className="w-4 h-4"/>
                        <span className={`${!isSidebarOpen && 'md:hidden'}`}>{category}</span>
                    </button>
                ))}
            </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between h-16 px-6 bg-[#1a1a1a] border-b border-gray-700">
            <div className="flex items-center gap-4">
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-full hover:bg-gray-700 hidden md:block">
                    <Menu/>
                </button>
                {selectedChannel && (
                    <div>
                        <h2 className="font-semibold text-lg">{selectedChannel.name}</h2>
                        <p className="text-sm text-gray-400">{selectedChannel.group.title}</p>
                    </div>
                )}
            </div>
            <div className="flex items-center gap-4">
               {/* Could add more header items here */}
            </div>
        </header>

        {/* Player and Channel List */}
        <main className="flex-1 flex overflow-hidden">
          {/* Player */}
          <div className="flex-1 flex flex-col bg-black">
            {selectedChannel ? (
              <div data-vjs-player className="w-full h-full">
                <video ref={videoNode} className="video-js vjs-big-play-centered w-full h-full" />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <MonitorPlay className="w-24 h-24 mb-4" />
                <h2 className="text-2xl font-semibold">Select a channel to start watching</h2>
                <p>Choose from the list on the right</p>
              </div>
            )}
          </div>

          {/* Channel List */}
          <div className="w-full md:w-96 bg-[#1a1a1a] overflow-y-auto p-4 border-l border-gray-700">
            <h3 className="text-lg font-semibold mb-4">{selectedCategory} Channels</h3>
            <div className="space-y-2">
              {displayChannels.map((channel, index) => (
                <button
                  key={`${channel.url}-${index}`}
                  onClick={() => handleChannelClick(channel)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${selectedChannel?.url === channel.url ? 'bg-gray-700 shadow-lg' : 'hover:bg-gray-800'}`}
                >
                  {channel.tvg.logo && <img src={channel.tvg.logo} alt={channel.name} className="w-12 h-12 object-contain rounded-md bg-black" />}
                  {!channel.tvg.logo && <div className="w-12 h-12 flex items-center justify-center bg-gray-800 rounded-md"><Tv className="w-6 h-6 text-gray-500"/></div>}
                  <div className="flex-1 overflow-hidden">
                    <p className="font-semibold truncate">{channel.name}</p>
                    <p className="text-xs text-gray-400 truncate">{channel.group.title || "No Group"}</p>
                  </div>
                </button>
              ))}
               {displayChannels.length === 0 && searchTerm && (
                <div className="text-center py-8 text-gray-500">
                    <p>No channels found for "{searchTerm}".</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
