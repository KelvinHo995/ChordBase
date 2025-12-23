import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ListMusic, Plus } from "lucide-react"

export function PlaylistModal({ open, onOpenChange }) {
  const [newPlaylistName, setNewPlaylistName] = useState("")
  const [showNewPlaylistInput, setShowNewPlaylistInput] = useState(false)

  // Mock playlists for UI display only
  const userPlaylists = [
    { id: "1", name: "My Favorites" },
    { id: "2", name: "Acoustic Songs" },
    { id: "3", name: "Party Playlist" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add to Playlist</DialogTitle>
          <DialogDescription className="text-base">Select a playlist or create a new one.</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[300px]">
          <div className="space-y-2">
            {userPlaylists.map((playlist) => (
              <Button
                key={playlist.id}
                variant="outline"
                className="w-full justify-start gap-2 bg-transparent text-lg h-12"
                onClick={() => onOpenChange(false)}>
                <ListMusic className="h-5 w-5" />
                {playlist.name}
              </Button>
            ))}
          </div>
        </ScrollArea>

        <div className="border-t border-border pt-4">
          {showNewPlaylistInput ? (
            <div className="space-y-3">
              <Label htmlFor="new-playlist" className="text-base">New Playlist Name</Label>
              <Input
                id="new-playlist"
                placeholder="My Playlist"
                className="text-base h-12"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)} />
              <div className="flex gap-2">
                <Button onClick={() => setShowNewPlaylistInput(false)} className="text-lg h-12">
                  Create & Add
                </Button>
                <Button variant="outline" onClick={() => setShowNewPlaylistInput(false)} className="text-lg h-12">
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full gap-2 bg-transparent text-lg h-12"
              onClick={() => setShowNewPlaylistInput(true)}>
              <Plus className="h-5 w-5" />
              Create New Playlist
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
