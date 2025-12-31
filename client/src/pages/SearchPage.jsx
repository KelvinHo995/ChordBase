import { useMemo, useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { SongList } from "@/components/SongList"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Library, Filter, ArrowUpDown, Loader2, Music, User } from "lucide-react"
import { SongService, GenreService } from "@/services/BackendService"

const SearchPage = () => {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get("q") || ""
  const [searchType, setSearchType] = useState("all")
  const [selectedGenre, setSelectedGenre] = useState("all")
  const [sortBy, setSortBy] = useState("rating")
  const [genres, setGenres] = useState([])
  
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch genres on mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await GenreService.getAll();
        setGenres(response.data?.genres || []);
      } catch (error) {
        console.error('Error fetching genres:', error);
        setGenres([]);
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchSongs = async () => {
      setLoading(true)
      setError(null)
      try {
        const params = {}
        if (searchQuery) params.q = searchQuery
        if (searchType !== "all") params.type = searchType
        if (selectedGenre !== "all") params.genre_id = parseInt(selectedGenre)
        if (sortBy) params.sort_by = sortBy

        const res = await SongService.getAll(params)
        setSongs(res.data.songs || []);
        // Assuming the backend returns an array of songs directly or { data: [...] }
        // Adjust based on actual API response structure. 
        // SongService.getAll returns response.data. 
        // If response.data is the array, then:
        // setSongs(Array.isArray(data) ? data : data.songs || [])
      } catch (err) {
        console.error("Failed to fetch songs:", err)
        setError("Tải bài hát thất bại. Vui lòng thử lại sau.")
      } finally {
        setLoading(false)
      }
    }

    fetchSongs()
  }, [searchQuery, searchType, selectedGenre, sortBy])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <Library className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Thư viện bài hát</h1>
        </div>
        <p className="mt-2 text-muted-foreground">Duyệt và khám phá các bản hợp âm từ bộ sưu tập của chúng tôi.</p>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex gap-2 flex-wrap">
            <Select value={searchType} onValueChange={setSearchType}>
              <SelectTrigger className="w-[140px]">
                <Music className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Loại tìm kiếm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="song">Bài hát</SelectItem>
                <SelectItem value="artist">Nghệ sĩ</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger className="w-[140px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Thể loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả thể loại</SelectItem>
                {genres.map((genre) => (
                  <SelectItem key={genre.genre_id} value={genre.genre_id.toString()}>
                    {genre.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
                <SelectItem value="latest">Mới nhất</SelectItem>
                <SelectItem value="views">Xem nhiều nhất</SelectItem>
                <SelectItem value="title">Tiêu đề A-Z</SelectItem>
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
                <span>Đang tìm kiếm...</span>
             </div>
        ) : error ? (
            <div className="text-red-500">{error}</div>
        ) : (
            <p className="text-sm text-muted-foreground">
            Hiển thị {songs.length} bài hát
            </p>
        )}
      </div>

      {!loading && !error && (
        <SongList songs={songs} emptyMessage="Không tìm thấy bài hát nào với các bộ lọc hiện tại." />
      )}
    </div>
  )
}

export default SearchPage