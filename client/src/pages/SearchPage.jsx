import { useMemo, useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { SongList } from "@/components/SongList"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Library, Filter, ArrowUpDown, Loader2 } from "lucide-react"
import { SongService } from "@/services/BackendService"

const GENRES = ["Rock", "Pop", "Folk", "Country", "Jazz", "Blues"]

const SearchPage = () => {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get("q") || ""
  console.log(searchQuery)
  const [selectedGenre, setSelectedGenre] = useState("all")
  const [sortBy, setSortBy] = useState("rating")
  
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSongs = async () => {
      setLoading(true)
      setError(null)
      try {
        const params = {}
        if (searchQuery) params.q = searchQuery
        if (selectedGenre !== "all") params.genre = selectedGenre
        if (sortBy) params.sort = sortBy

        const res = await SongService.getAll(params)
        console.log(res);
        setSongs(res.data.songs);
        // Assuming the backend returns an array of songs directly or { data: [...] }
        // Adjust based on actual API response structure. 
        // SongService.getAll returns response.data. 
        // If response.data is the array, then:
        // setSongs(Array.isArray(data) ? data : data.songs || [])
      } catch (err) {
        console.error("Failed to fetch songs:", err)
        setError("Failed to load songs. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchSongs()
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
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
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

            <Select value={sortBy} onValueChange={setSortBy}>
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
        {loading ? (
             <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Searching...</span>
             </div>
        ) : error ? (
            <div className="text-red-500">{error}</div>
        ) : (
            <p className="text-sm text-muted-foreground">
            Showing {songs.length} songs
            </p>
        )}
      </div>

      {!loading && !error && (
        <SongList songs={songs} emptyMessage="No songs found with the current filters." />
      )}
    </div>
  )
}

export default SearchPage