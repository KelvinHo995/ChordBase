import { TrendingUp, Clock, Music2 } from "lucide-react"
import { SongList } from "../components/SongList"

import { mockSongs } from "@/lib/mock-data";
import { useEffect, useState } from "react";
import { SongService } from "@/services/BackendService";

export default function HomePage() {
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [recentSongs, setRecentSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const filteredSongs = [];

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setIsLoading(true)
        const resTrending = await SongService.getTrending();
        console.log(resTrending.data);
        setTrendingSongs(resTrending.data);

        const resRecent = await SongService.getRecent();
        console.log(resRecent.data);
        setRecentSongs(resRecent.data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSongs();
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5">
          <Music2 className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-600">Your Chord Sheet Library</span>
        </div>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl">
          Find chords for any song
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-zinc-500">
          Browse thousands of chord sheets, transpose to any key, and auto-scroll while you play.
        </p>
      </div>
      
      <section className="mb-12">
        <div className="mb-6 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-950">Trending Songs</h2>
        </div>
        {isLoading ? <h>Loading...</h> : <SongList songs={trendingSongs} />}
      </section>

      {/* Recently Added */}
      <section>
        <div className="mb-6 flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-950">Recently Added</h2>
        </div>
        {isLoading ? <h>Loading...</h> : <SongList songs={recentSongs} />}
      </section>
        
    </div>
  );
}
