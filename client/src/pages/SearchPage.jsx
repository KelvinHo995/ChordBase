import { useMemo } from "react"
import { SongList } from "@/components/SongList"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Library, Filter, ArrowUpDown } from "lucide-react"

const SAMPLE_SONGS = [
  {
    id: "1",
    title: "Wonderwall",
    artist: "Oasis",
    genre: "Rock",
    rating: 4.8,
    views: 15420,
    tags: ["90s"],
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Let It Be",
    artist: "The Beatles",
    genre: "Rock",
    rating: 4.9,
    views: 12890,
    tags: ["classic"],
    createdAt: "2024-01-20",
  },
  {
    id: "3",
    title: "Shape of You",
    artist: "Ed Sheeran",
    genre: "Pop",
    rating: 4.7,
    views: 18350,
    tags: ["modern"],
    createdAt: "2024-02-01",
  },
  {
    id: "4",
    title: "Hallelujah",
    artist: "Leonard Cohen",
    genre: "Folk",
    rating: 5.0,
    views: 20120,
    tags: ["classic"],
    createdAt: "2024-01-10",
  },
]

const GENRES = ["Rock", "Pop", "Folk", "Country", "Jazz", "Blues"]

const SearchPage = () => {
  const searchQuery = ""
  const selectedGenre = "all"
  const sortBy = "rating"

  const filteredAndSortedSongs = useMemo(() => {
    let result = [...SAMPLE_SONGS]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (song) =>
          song.title.toLowerCase().includes(query) ||
          song.artist.toLowerCase().includes(query) ||
          song.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    if (selectedGenre !== "all") {
      result = result.filter((song) => song.genre === selectedGenre)
    }

    switch (sortBy) {
      case "rating":
        result.sort((a, b) => b.rating - a.rating)
        break
      case "latest":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
      case "views":
        result.sort((a, b) => b.views - a.views)
        break
      case "title":
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
    }

    return result
  }, [searchQuery, selectedGenre, sortBy])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <Library className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Songs Library</h1>
        </div>
        <p className="mt-2 text-muted-foreground">Browse and discover chord sheets from our collection.</p>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex gap-2">
            <Select value={selectedGenre} disabled>
              <SelectTrigger className="w-[140px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                {GENRES.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} disabled>
              <SelectTrigger className="w-[140px]">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Top Rated</SelectItem>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="views">Most Viewed</SelectItem>
                <SelectItem value="title">Title A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Showing {filteredAndSortedSongs.length} of {SAMPLE_SONGS.length} songs
        </p>
      </div>

      <SongList songs={filteredAndSortedSongs} emptyMessage="No songs found with the current filters." />
    </div>
  )
}

export default SearchPage