import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ListMusic, Plus, Check } from "lucide-react"
import { PlaylistService } from "@/services/BackendService"

export function PlaylistModal({ open, onOpenChange, songId }) {
  const [newPlaylistName, setNewPlaylistName] = useState("")
  const [showNewPlaylistInput, setShowNewPlaylistInput] = useState(false)
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(false)
  const [addedToPlaylistIds, setAddedToPlaylistIds] = useState(new Set())
  const [isAdding, setIsAdding] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    if (open) {
      fetchPlaylists()
    }
  }, [open])

  const fetchPlaylists = async () => {
    setLoading(true)
    try {
      const res = await PlaylistService.getAllPlaylists()
      const fetchedPlaylists = res.data || []
      setPlaylists(fetchedPlaylists)
      
      // Mark playlists that already contain this song
      const alreadyAdded = new Set(
        fetchedPlaylists
          .filter(pl => pl.songs?.some(s => s.song_id === songId || s.id === songId))
          .map(pl => pl.id)
      )
      setAddedToPlaylistIds(alreadyAdded)
    } catch (error) {
      console.error('Failed to fetch playlists:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToPlaylist = async (playlistId) => {
    if (addedToPlaylistIds.has(playlistId)) return
    
    setIsAdding(true)
    try {
      await PlaylistService.addSong(playlistId, songId)
      setAddedToPlaylistIds(prev => new Set([...prev, playlistId]))
      alert('Đã thêm bài hát vào danh sách phát!')
    } catch (error) {
      console.error('Failed to add song to playlist:', error)
      alert('Thêm bài hát thất bại. Vui lòng thử lại.')
    } finally {
      setIsAdding(false)
    }
  }

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return
    
    setIsCreating(true)
    try {
      await PlaylistService.create({ name: newPlaylistName })
      setNewPlaylistName('')
      setShowNewPlaylistInput(false)
      alert('Đã tạo danh sách phát!')
      await fetchPlaylists()
    } catch (error) {
      console.error('Failed to create playlist:', error)
      alert('Tạo danh sách phát thất bại. Vui lòng thử lại.')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Thêm vào danh sách phát</DialogTitle>
          <DialogDescription className="text-base">Chọn danh sách phát hoặc tạo mới.</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[300px]">
          {loading ? (
            <div className="py-4 text-center text-muted-foreground">Đang tải danh sách phát...</div>
          ) : playlists.length === 0 ? (
            <div className="py-4 text-center text-muted-foreground">Chưa có danh sách phát nào. Hãy tạo mới bên dưới!</div>
          ) : (
            <div className="space-y-2">
              {playlists.map((playlist) => {
                const isAlreadyAdded = addedToPlaylistIds.has(playlist.id)
                return (
                  <Button
                    key={playlist.id}
                    variant={isAlreadyAdded ? "default" : "outline"}
                    className="w-full justify-between gap-2 bg-transparent text-lg h-12"
                    onClick={() => handleAddToPlaylist(playlist.id)}
                    disabled={isAdding || isAlreadyAdded}
                  >
                    <span className="flex items-center gap-2">
                      <ListMusic className="h-5 w-5" />
                      {playlist.name}
                    </span>
                    {isAlreadyAdded && <Check className="h-5 w-5" />}
                  </Button>
                )
              })}
            </div>
          )}
        </ScrollArea>

        <div className="border-t border-border pt-4">
          {showNewPlaylistInput ? (
            <div className="space-y-3">
              <Label htmlFor="new-playlist" className="text-base">Tên danh sách phát mới</Label>
              <Input
                id="new-playlist"
                placeholder="Danh sách phát của tôi"
                className="text-base h-12"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreatePlaylist()}
              />
              <div className="flex gap-2">
                <Button 
                  onClick={handleCreatePlaylist} 
                  className="text-lg h-12"
                  disabled={isCreating || !newPlaylistName.trim()}
                >
                  Tạo
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowNewPlaylistInput(false)
                    setNewPlaylistName('')
                  }} 
                  className="text-lg h-12"
                  disabled={isCreating}
                >
                  Hủy
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full gap-2 bg-transparent text-lg h-12"
              onClick={() => setShowNewPlaylistInput(true)}
              disabled={isCreating}
            >
              <Plus className="h-5 w-5" />
              Tạo danh sách phát mới
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
