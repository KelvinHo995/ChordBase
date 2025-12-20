import { SongCard } from "./SongCard"

export function SongList({ songs = [], emptyMessage = "No songs found" }) {
  if (songs.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-zinc-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {songs.map((song) => (
        <SongCard key={song.song_id} song={song} />
      ))}
    </div>
  );
}

