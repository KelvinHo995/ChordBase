import React, { useState } from "react"
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
  const [favorites, setFavorites] = useState(INITIAL_FAVORITES)
  const [playlists, setPlaylists] = useState(INITIAL_PLAYLISTS)
  const [selectedPlaylist, setSelectedPlaylist] = useState(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newPlaylistName, setNewPlaylistName] = useState("")

  // Helper functions
  const createPlaylist = (name) => {
    const newPlaylist = {
      id: `pl-${Date.now()}`,
      name: name,
      songs: [],
      createdAt: new Date(Date.now())
    }
    setPlaylists([...playlists, newPlaylist])
  }

  const removeFromFavorites = (songId) => {
    setFavorites(favorites.filter(id => id !== songId))
  }

  const removeFromPlaylist = (playlistId, songId) => {
    setPlaylists(playlists.map(pl => {
      if (pl.id === playlistId) {
        return { ...pl, songs: pl.songs.filter(id => id !== songId) }
      }
      return pl
    }))
    
    // Also update selected playlist view if it's the one being modified
    if (selectedPlaylist && selectedPlaylist.id === playlistId) {
      setSelectedPlaylist(prev => ({
        ...prev,
        songs: prev.songs.filter(id => id !== songId)
      }))
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="container py-20 text-center max-w-md mx-auto">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto mb-4">
          <Heart className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold mb-4">Login Required</h1>
        <p className="text-muted-foreground mb-6">Please log in to view your favorites and playlists.</p>
        <Link to="/login">
          <Button>Login</Button>
        </Link>
      </div>
    )
  }

  const favoriteSongs = mockSongs.filter((song) => favorites.includes(song.id))

  const handleCreatePlaylist = (e) => {
    e.preventDefault()
    if (!newPlaylistName.trim()) return
    createPlaylist(newPlaylistName)
    setNewPlaylistName("")
    setCreateDialogOpen(false)
  }

  const getPlaylistSongs = (playlist) => {
    return mockSongs.filter((song) => playlist.songs.includes(song.id))
  }

  return (
    <div className="container py-12 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">My Library</h1>
        <p className="text-muted-foreground">Your favorite songs and custom playlists</p>
      </div>

      <Tabs defaultValue="favorites" className="space-y-6">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="favorites" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Favorites
          </TabsTrigger>
          <TabsTrigger value="playlists" className="flex items-center gap-2">
            <ListMusic className="h-4 w-4" />
            Playlists
          </TabsTrigger>
        </TabsList>

        {/* Favorites Tab */}
        <TabsContent value="favorites">
          {favoriteSongs.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">{favoriteSongs.length} songs in favorites</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {favoriteSongs.map((song) => (
                  <div key={song.id} className="relative group">
                    <SongCard song={song} />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.preventDefault()
                        removeFromFavorites(song.id)
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
                <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
                <p className="text-muted-foreground mb-6">Start adding songs to your favorites to see them here.</p>
                <Link to="/">
                  <Button>Browse Songs</Button>
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
                Back to Playlists
              </Button>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <ListMusic className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{selectedPlaylist.name}</CardTitle>
                      <CardDescription>{selectedPlaylist.songs.length} songs</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {getPlaylistSongs(selectedPlaylist).length > 0 ? (
                    <div className="space-y-3">
                      {getPlaylistSongs(selectedPlaylist).map((song) => (
                        <div
                          key={song.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
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
                            <Link to={`/song/${song.id}`}>
                              <Button variant="ghost" size="icon">
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFromPlaylist(selectedPlaylist.id, song.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">This playlist is empty.</p>
                      <Link to="/">
                        <Button variant="outline">Add Songs</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">{playlists.length} playlists</p>
                <Button onClick={() => setCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Playlist
                </Button>
              </div>

              {playlists.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {playlists.map((playlist) => (
                    <Card
                      key={playlist.id}
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
                            <p className="text-sm text-muted-foreground">{playlist.songs.length} songs</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto mb-4">
                      <ListMusic className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No playlists yet</h3>
                    <p className="text-muted-foreground mb-6">Create your first playlist to organize your songs.</p>
                    <Button onClick={() => setCreateDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Playlist
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
            <DialogTitle>Create New Playlist</DialogTitle>
            <DialogDescription>Give your playlist a name to get started</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreatePlaylist} className="space-y-4 pt-4">
            <Input
              placeholder="Playlist name"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              autoFocus
            />
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="ghost" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!newPlaylistName.trim()}>
                Create
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Playlists