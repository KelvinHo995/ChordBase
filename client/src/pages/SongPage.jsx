import React, { use, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import SongBody from '../components/SongBody'
import ChordList from '../components/ChordList'
import { CommentSection } from '../components/CommentSection'
import { PlaylistModal } from '../components/PlaylistModal'
import { SongInformation } from '../components/SongInformation'
import { useAuth } from '../context/AuthContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Heart, Share2, ListPlus, ArrowLeft } from 'lucide-react'
import { mockSongs } from '../lib/mock-data'
import { SongService } from '@/services/BackendService'

const SongPage = () => {
  const { songID } = useParams() // Get ID from URL
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()

  const [playlistModalOpen, setPlaylistModalOpen] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [favorite, setFavorite] = useState(false)
  const [transpose, setTranspose] = useState(0)

  // Find song by ID, or default to first one if not found/no ID (for testing)
  // In a real app, you'd fetch this or handle 404
  const song = SongService.getById(songID)

  if (!song) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-foreground">Song not found</h1>
        <p className="mt-2 text-muted-foreground">The song you're looking for doesn't exist.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={() => navigate(-1)} variant="outline">
            Go Back
          </Button>
          <Button onClick={() => navigate("/")}>Browse Songs</Button>
        </div>
      </div>
    )
  }

  const handleFavoriteClick = () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true)
      return
    }
    setFavorite(!favorite)
  }

  const handlePlaylistClick = () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true)
      return
    }
    setPlaylistModalOpen(true)
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800 border-green-200"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Advanced":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return ""
    }
  }

  // Extract unique chords from chordSheet
  const extractChords = (chordSheet) => {
    const chordRegex = /\[([A-G][#b]?m?(?:maj|min|dim|aug|sus|add)?\d*(?:\/[A-G][#b]?)?)\]/g
    const matches = chordSheet?.matchAll(chordRegex) || []
    const uniqueChords = [...new Set([...matches].map(match => match[1]))]
    return uniqueChords
  }

  const chords = extractChords(song.chordSheet)

  return (
    <main className="container mx-auto px-4 py-8 text-lg">
      {showLoginPrompt && !isLoggedIn && (
        <Card className="mb-6 border-yellow-500/50 bg-yellow-50">
          <CardContent className="flex items-center justify-between p-4">
            <p className="text-base text-foreground">Please log in to save favorites and create playlists.</p>
            <Button size="sm" onClick={() => navigate("/auth/login")}>
              Log in
            </Button>
          </CardContent>
        </Card>
      )}

      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-6 gap-2 text-lg -ml-4">
        <ArrowLeft className="h-5 w-5" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Song header with title, artist, and action buttons */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-5xl font-bold mb-2">{song.title}</h1>
                <p className="text-2xl text-muted-foreground">{song.artist}</p>
              </div>
              <div className="flex gap-2">
                <Button variant={favorite ? "default" : "outline"} size="icon" onClick={handleFavoriteClick}>
                  <Heart className={`h-5 w-5 ${favorite ? "fill-current" : ""}`} />
                </Button>
                <Button variant="outline" size="icon" onClick={handlePlaylistClick}>
                  <ListPlus className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary" className="text-base border border-gray-300">{song.genre}</Badge>
              <Badge variant="outline" className="text-base bg-gray-100">Rating: {song.rating?.toFixed(1)}</Badge>
              <Badge className={`${getDifficultyColor(song.difficulty)} text-base`} variant="outline">
                {song.difficulty}
              </Badge>
              {song.tags?.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-base border border-gray-300">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Chord Sheet with Controls */}
          <SongBody lyrics={song.chordSheet} songKey="G" showControl={true} />

          {/* Comments Section */}
          <div className="mt-8">
            <CommentSection songId={song.id} />
          </div>
        </div>

        {/* Right column - Sidebar */}
        <div className="space-y-6">
          {/* Chord Diagrams */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Chords Used</h3>
              <ChordList chords={chords} />
            </CardContent>
          </Card>

          {/* Song Information */}
          <SongInformation song={song} />
        </div>
      </div>

      {/* Playlist Modal */}
      <PlaylistModal open={playlistModalOpen} onOpenChange={setPlaylistModalOpen} songId={song.id} />
    </main>
  )
}

export default SongPage