import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { SongCard } from "../components/SongCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Heart, ListMusic, Plus, Trash2, Music, ArrowLeft, ExternalLink } from "lucide-react"
import { mockSongs } from "../lib/mock-data"
import { PlaylistService } from "../services/BackendService"

// Mock initial data since it's not in context yet
const INITIAL_FAVORITES = ["song-1", "song-2", "song-4"]
const INITIAL_PLAYLISTS = [
  {
    id: "pl-1",
    name: "My Chill Mix",
    songs: ["song-1", "song-6"],
    createdAt: new Date("2024-01-15")
  },
  {
    id: "pl-2",
    name: "Rock Classics",
    songs: ["song-2", "song-5"],
    createdAt: new Date("2024-03-22")
  }
]

const Playlists = () => {
  const { isLoggedIn } = useAuth()

  // Local state to simulate data management
  const [favorites, setFavorites] = useState([])
  const [playlists, setPlaylists] = useState([])
  const [selectedPlaylist, setSelectedPlaylist] = useState(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newPlaylistName, setNewPlaylistName] = useState("")

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
          const res = await PlaylistService.getFavoriteSongs()
          const favSongs = res.data.map(fav => fav.song)
          setFavorites(favSongs)
      } catch (error) {
        console.error("Failed to fetch favorite songs:", error)
      }
    }

    const fetchPlaylists = async () => {
      try {
          const res = await PlaylistService.getAllPlaylists()
          setPlaylists(res.data)
          console.log("Fetched playlists:", res.data)
      } catch (error) {
        console.error("Failed to fetch playlists:", error)
      }
    }

    fetchFavorites()
    fetchPlaylists()
  }, [])

  // Helper functions
  const createPlaylist = async (name) => {
    try {
      const res = await PlaylistService.create({ name });
      if (res.success) {
        setPlaylists([...playlists, res.data]);
      }
    } catch (error) {
      console.error("Failed to create playlist:", error);
    }
  }

  const removeFromFavorites = async (songId) => {
    try {
      await PlaylistService.removeFavorite(songId);
      setFavorites(favorites.filter(song => song.song_id !== songId))
    } catch (err) {
      console.log('Error removing from favourites', err.message);
    }
  }

  const deletePlaylist = async (playlistId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa danh sách phát này không? Hành động này không thể hoàn tác.')) {
      return;
    }
    try {
      await PlaylistService.delete(playlistId);
      setPlaylists(playlists.filter(pl => pl.id !== playlistId));
      if (selectedPlaylist && selectedPlaylist.id === playlistId) {
        setSelectedPlaylist(null);
      }
    } catch (error) {
      console.error('Failed to delete playlist:', error);
      alert('Không thể xóa danh sách phát. Vui lòng thử lại.');
    }
  }

  const removeFromPlaylist = async (playlistId, songId) => {
    try {
      await PlaylistService.removeSong(playlistId, songId);
      
      setPlaylists(playlists.map(pl => {
        if (pl.id === playlistId) {
          return { ...pl, songs: pl.songs.filter(s => s.id !== songId) }
        }
        return pl
      }))
      
      // Also update selected playlist view if it's the one being modified
      if (selectedPlaylist && selectedPlaylist.id === playlistId) {
        setSelectedPlaylist(prev => ({
          ...prev,
          songs: prev.songs.filter(s => s.id !== songId)
        }))
      }
    } catch (error) {
      console.error("Failed to remove song from playlist:", error);
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="container py-20 text-center max-w-md mx-auto">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto mb-4">
          <Heart className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold mb-4">Yêu cầu đăng nhập</h1>
        <p className="text-muted-foreground mb-6">Vui lòng đăng nhập để xem danh sách yêu thích và danh sách phát của bạn.</p>
        <Link to="/auth/login">
          <Button>Đăng nhập</Button>
        </Link>
      </div>
    )
  }

  const handleCreatePlaylist = (e) => {
    e.preventDefault()
    if (!newPlaylistName.trim()) return
    createPlaylist(newPlaylistName)
    setNewPlaylistName("")
    setCreateDialogOpen(false)
  }

  const getPlaylistSongs = (playlist) => {
    return playlist.songs || [];
  }

  return (
    <div className="container py-12 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Thư viện của tôi</h1>
        <p className="text-muted-foreground">Bài hát yêu thích và danh sách phát tùy chỉnh của bạn</p>
      </div>

      <Tabs defaultValue="favorites" className="space-y-6">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="favorites" className="flex items-center gap-2 cursor-pointer">
            <Heart className="h-4 w-4" />
            Yêu thích
          </TabsTrigger>
          <TabsTrigger value="playlists" className="flex items-center gap-2 cursor-pointer">
            <ListMusic className="h-4 w-4" />
            Danh sách phát
          </TabsTrigger>
        </TabsList>

        {/* Favorites Tab */}
        <TabsContent value="favorites">
          {favorites.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">{favorites.length} bài hát trong mục yêu thích</p>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {favorites.map((song) => (
                  <div key={song.song_id} className="relative group">
                    <SongCard song={song} />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.preventDefault()
                        removeFromFavorites(song.song_id)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Chưa có bài hát yêu thích nào</h3>
                <p className="text-muted-foreground mb-6">Bắt đầu thêm bài hát vào mục yêu thích để xem chúng ở đây.</p>
                <Link to="/">
                  <Button>Duyệt bài hát</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Playlists Tab */}
        <TabsContent value="playlists">
          {selectedPlaylist ? (
            <div className="space-y-6">
              <Button variant="ghost" onClick={() => setSelectedPlaylist(null)} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Quay lại danh sách phát
              </Button>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <ListMusic className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle>{selectedPlaylist.name}</CardTitle>
                        <CardDescription>{selectedPlaylist.songs.length} bài hát</CardDescription>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deletePlaylist(selectedPlaylist.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {getPlaylistSongs(selectedPlaylist).length > 0 ? (
                    <div className="space-y-3 md:grid md:grid-cols-3 gap-4">
                      {getPlaylistSongs(selectedPlaylist).map((song) => (
                        <Link to={`/songs/${song.id}`} key={song.id} className="no-underline">
                          <div
                            key={song.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/100 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <Music className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">{song.title}</p>
                                <p className="text-sm text-muted-foreground">{song.artist}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFromPlaylist(selectedPlaylist.id, song.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">Danh sách phát này đang trống.</p>
                      <Link to="/">
                        <Button variant="outline">Thêm bài hát</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">{playlists.length} danh sách phát</p>
                <Button onClick={() => setCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo danh sách phát
                </Button>
              </div>

              {playlists.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {playlists.map((playlist) => (
                    <div key={playlist.id} className="relative group">
                      <Card
                        className="cursor-pointer hover:border-primary/50 transition-colors"
                        onClick={() => setSelectedPlaylist(playlist)}
                      >
                        <CardContent className="p-5">
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                              <ListMusic className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{playlist.name}</h3>
                              <p className="text-sm text-muted-foreground">{playlist.songs.length} bài hát</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePlaylist(playlist.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto mb-4">
                      <ListMusic className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Chưa có danh sách phát nào</h3>
                    <p className="text-muted-foreground mb-6">Tạo danh sách phát đầu tiên để sắp xếp các bài hát của bạn.</p>
                    <Button onClick={() => setCreateDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Tạo danh sách phát
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
        {/* Create Playlist Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Tạo danh sách phát mới</DialogTitle>
              <DialogDescription>Đặt tên cho danh sách phát của bạn để bắt đầu</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreatePlaylist} className="space-y-4 pt-4">
              <Input
                placeholder="Tên danh sách phát"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                autoFocus
              />
              <div className="flex gap-3 justify-end">
                <Button type="button" variant="ghost" onClick={() => setCreateDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit" disabled={!newPlaylistName.trim()}>
                  Tạo
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
    </div>
  )
}

export default Playlists