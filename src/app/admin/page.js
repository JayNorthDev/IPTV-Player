"use client";
import { useState, useEffect } from 'react';
import { db } from '../../firebase/config'; // Import Firebase config
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Save, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [url, setUrl] = useState('');
  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: '' }
  const DB_SETTINGS_COLLECTION = "settings";
  const DB_PLAYLIST_DOCUMENT = "playlist";

  // 1. Get the previously saved URL from the Database
  useEffect(() => {
    async function fetchCurrentUrl() {
      try {
        const docRef = doc(db, DB_SETTINGS_COLLECTION, DB_PLAYLIST_DOCUMENT);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data().url) {
          setUrl(docSnap.data().url);
        }
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to load current URL.' });
      } finally {
        setIsFetching(false);
      }
    }
    fetchCurrentUrl();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000); // Clear message after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [message]);

  // 2. Save the new URL
  const handleSave = async (e) => {
    e.preventDefault();
    setMessage(null);
    setIsSaving(true);

    try {
      // Validation: Check if a link is provided
      if (!url.trim()) {
        throw new Error("Please enter a valid URL");
      }

      // Send to Firestore Database
      await setDoc(doc(db, DB_SETTINGS_COLLECTION, DB_PLAYLIST_DOCUMENT), {
        url: url.trim(),
        updatedAt: new Date().toISOString()
      });

      setMessage({ type: 'success', text: 'Playlist URL updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to save URL.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isFetching) {
    return (
        <div className="min-h-screen bg-[#0f0f0f] text-gray-200 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-[#1a1a1a] border border-[#333] rounded-2xl p-8 shadow-2xl">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-700 rounded w-1/2 mb-8"></div>
                    <div className="space-y-6">
                        <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
                        <div className="h-12 bg-gray-700 rounded"></div>
                        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    </div>
                    <div className="mt-8">
                        <div className="h-12 bg-gray-700 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-200 flex flex-col items-center justify-center p-4">
      
      <div className="w-full max-w-2xl bg-[#1a1a1a] border border-[#333] rounded-2xl p-8 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">Admin <span className="text-purple-500">Dashboard</span></h1>
          <Link href="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={16} /> Back to Player
          </Link>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              M3U Playlist URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/playlist.m3u"
              className="w-full bg-[#0a0a0a] text-white p-4 rounded-xl border border-[#333] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder-gray-600"
              disabled={isFetching}
            />
            <p className="text-xs text-gray-500 mt-2">
              Enter the direct link to your .m3u or .m3u8 file. This will update the player for all users.
            </p>
          </div>

          {/* Messages */}
          {message && (
            <div className={`p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-900/20 text-green-400 border border-green-900/50' : 'bg-red-900/20 text-red-400 border border-red-900/50'}`}>
              {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              <span>{message.text}</span>
            </div>
          )}

          {/* Save Button */}
          <button
            type="submit"
            disabled={isSaving || isFetching}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${isSaving || isFetching ? 'bg-gray-700 cursor-not-allowed opacity-50' : 'bg-purple-600 hover:bg-purple-700 hover:scale-[1.02] shadow-lg shadow-purple-900/20 text-white'}`}
          >
            {isFetching ? 'Loading...' : isSaving ? 'Saving...' : (
              <>
                <Save size={20} /> Save Playlist
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}