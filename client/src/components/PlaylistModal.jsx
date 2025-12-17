import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ListMusic, Plus, Check } from "lucide-react"

export function PlaylistModal({ open, onOpenChange, songId }) {
  const { user } = useAuth()
  const { getUserPlaylists, createPlaylist, addToPlaylist, playlists } = useApp()
  const [newPlaylistName, setNewPlaylistName] = useState("")
  const [showNewPlaylistInput, setShowNewPlaylistInput] = useState(false)

  const userPlaylists = user ? getUserPlaylists(user.id) : []

  const handleAddToPlaylist = (playlistId) => {
    addToPlaylist(playlistId, songId)
    onOpenChange(false)
  }

  const handleCreatePlaylist = () => {
    if (!newPlaylistName.trim() || !user) return
    const newPlaylist = createPlaylist(newPlaylistName.trim(), user.id)
    addToPlaylist(newPlaylist.id, songId)
    setNewPlaylistName("")
    setShowNewPlaylistInput(false)
    onOpenChange(false)
  }

  const isSongInPlaylist = (playlistId) => {
    const playlist = playlists.find((p) => p.id === playlistId)
    return playlist?.songIds.includes(songId);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Playlist</DialogTitle>
          <DialogDescription>Select a playlist or create a new one.</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[300px]">
          <div className="space-y-2">
            {userPlaylists.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">You don't have any playlists yet.</p>
            ) : (
              userPlaylists.map((playlist) => (
                <Button
                  key={playlist.id}
                  variant="outline"
                  className="w-full justify-start gap-2 bg-transparent"
                  onClick={() => handleAddToPlaylist(playlist.id)}
                  disabled={isSongInPlaylist(playlist.id)}>
                  <ListMusic className="h-4 w-4" />
                  {playlist.name}
                  {isSongInPlaylist(playlist.id) && <Check className="ml-auto h-4 w-4 text-success" />}
                </Button>
              ))
            )}
          </div>
        </ScrollArea>

        <div className="border-t border-border pt-4">
          {showNewPlaylistInput ? (
            <div className="space-y-3">
              <Label htmlFor="new-playlist">New Playlist Name</Label>
              <Input
                id="new-playlist"
                placeholder="My Playlist"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)} />
              <div className="flex gap-2">
                <Button onClick={handleCreatePlaylist} disabled={!newPlaylistName.trim()}>
                  Create & Add
                </Button>
                <Button variant="outline" onClick={() => setShowNewPlaylistInput(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full gap-2 bg-transparent"
              onClick={() => setShowNewPlaylistInput(true)}>
              <Plus className="h-4 w-4" />
              Create New Playlist
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
