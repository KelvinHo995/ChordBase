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
import { Heart, Share2, Printer, ListPlus, ArrowLeft } from 'lucide-react'
import { mockSongs } from '../lib/mock-data'
import { SongService, CommentService, RatingService, PlaylistService } from '@/services/BackendService'

const SongPage = () => {
  const { songID, versionID } = useParams() // Get ID from URL
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()

  const [isLoading, setIsLoading] = useState(false)
  const [playlistModalOpen, setPlaylistModalOpen] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [favorite, setFavorite] = useState(false)
  const [transpose, setTranspose] = useState(0)

  // Find song by ID, or default to first one if not found/no ID (for testing)
  // In a real app, you'd fetch this or handle 404
  // const song = mockSongs.find(s => s.id === songID) || mockSongs[0]
  const [song, setSong] = useState(null);
  const [version, setVersion] = useState(null);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [userRating, setUserRating] = useState(null);
  const [ratingStats, setRatingStats] = useState({ average: 0, count: 0 });
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  const handlePostComment = async (commentText, parentCommentId = null) => {
    if (!version?.chord_sheet_id) {
      console.error('No chord sheet ID available');
      return;
    }

    if (!commentText.trim()) {
      console.error('Comment text is empty');
      return;
    }

    setIsSubmittingComment(true);
    try {
      const commentData = {
        chord_sheet_id: version.chord_sheet_id,
        content: commentText.trim(),
        ...(parentCommentId && { parent_comment_id: parentCommentId })
      };

      const response = await CommentService.create(commentData);
      console.log('Comment posted successfully:', response);
      
      // Refresh comments after posting
      if (version?.chord_sheet_id) {
        await fetchComments(version.chord_sheet_id);
      }
      
      return response.data.comment;
    } catch (error) {
      console.error('Failed to post comment:', error);
      // You can add an error notification here
      throw error;
    } finally {
      setIsSubmittingComment(false);
    }
  }

  const handleUpdateComment = async (commentId, newContent) => {
    if (!newContent.trim()) {
      console.error('Comment content is empty');
      return;
    }

    try {
      const response = await CommentService.update(commentId, newContent.trim());
      console.log('Comment updated successfully:', response);
      
      // Refresh comments after updating
      if (version?.chord_sheet_id) {
        await fetchComments(version.chord_sheet_id);
      }
      
      return response.data.comment;
    } catch (error) {
      console.error('Failed to update comment:', error);
      throw error;
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bình luận này không?')) {
      return;
    }

    try {
      await CommentService.delete(commentId);
      console.log('Comment deleted successfully');
      
      // Refresh comments after deleting
      if (version?.chord_sheet_id) {
        await fetchComments(version.chord_sheet_id);
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
      throw error;
    }
  }

  useEffect(() => {
    const fetchSong = async () => {
      try {
        setIsLoading(true)
        const res = await SongService.getById(songID);
        console.log(res.data.song);

        setSong(res.data.song);
        setFavorite(Boolean(res.data.song.is_favorited ?? res.data.song.is_favourited));
        if (!versionID)
          setVersion(res.data.song.chord_versions[0]);
        else {
          const currentVersion = res.data.song.chord_versions.find(ver => ver.chord_sheet_id === versionID);
          setVersion(currentVersion);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false)
      }
    }

    fetchSong();
  }, [])

  const fetchComments = async (chordSheetId) => {
    if (!chordSheetId) return;
    
    setIsLoadingComments(true);
    try {
      const response = await CommentService.getByChordSheet(chordSheetId);
      console.log('Comments fetched:', response);
      setComments(response.data.comments || []);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      setComments([]);
    } finally {
      setIsLoadingComments(false);
    }
  }

  const fetchRating = async (chordSheetId) => {
    if (!chordSheetId) return;
    
    try {
      const response = await RatingService.getByChordSheet(chordSheetId);
      console.log('Rating fetched:', response);
      setRatingStats(response.data.rating);
      setUserRating(response.data.userRating);
    } catch (error) {
      console.error('Failed to fetch rating:', error);
      setRatingStats({ average: 0, count: 0 });
      setUserRating(null);
    }
  }

  const handleSubmitRating = async (score) => {
    if (!version?.chord_sheet_id || !isLoggedIn) return;

    setIsSubmittingRating(true);
    try {
      await RatingService.upsert({
        chord_sheet_id: version.chord_sheet_id,
        score
      });
      
      // Refresh rating after submitting
      await fetchRating(version.chord_sheet_id);
    } catch (error) {
      console.error('Failed to submit rating:', error);
    } finally {
      setIsSubmittingRating(false);
    }
  }

  useEffect(() => {
    if (version?.chord_sheet_id) {
      fetchComments(version.chord_sheet_id);
      fetchRating(version.chord_sheet_id);
    }
  }, [version?.chord_sheet_id])

  const handlePrint = () => {
    window.print();
  }

  if (isLoading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8"> 
        <h1 className="text-2xl font-bold text-foreground">Đang tải...</h1>
      </main>
    )
  }
  if (!song) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-foreground">Không tìm thấy bài hát</h1>
        <p className="mt-2 text-muted-foreground">Bài hát bạn đang tìm kiếm không tồn tại.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={() => navigate(-1)} variant="outline">
            Quay lại
          </Button>
          <Button onClick={() => navigate("/")}>Duyệt bài hát</Button>
        </div>
      </div>
    )
  }

  const handleFavoriteClick = async () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true)
      return
    }
    const next = !favorite;
    setFavorite(next);
    try {
      if (next) {
        await PlaylistService.addFavorite(song.song_id);
      } else {
        await PlaylistService.removeFavorite(song.song_id);
      }
    } catch (error) {
      console.error('Favorite toggle failed:', error);
      setFavorite(!next); // revert
      alert('Không thể cập nhật yêu thích. Vui lòng thử lại.');
    }
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

  const chords = extractChords(version.content)

  return (
    <main className="container mx-auto px-4 py-8 text-lg print:p-8 print:bg-white print:text-black">
      {showLoginPrompt && !isLoggedIn && (
        <Card className="mb-6 border-yellow-500/50 bg-yellow-50">
          <CardContent className="flex items-center justify-between p-4">
            <p className="text-base text-foreground">Vui lòng đăng nhập để lưu yêu thích và tạo danh sách phát.</p>
            <Button size="sm" onClick={() => navigate("/auth/login")}>
              Đăng nhập
            </Button>
          </CardContent>
        </Card>
      )}

      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-6 gap-2 text-lg -ml-4 print:hidden">
        <ArrowLeft className="h-5 w-5" />
        Quay lại
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Song header with title, artist, and action buttons */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-5xl font-bold mb-2">{song.title}</h1>
                <p className="text-2xl text-muted-foreground">{song.artists[0].name}</p>
              </div>
              <div className="flex gap-2 print:hidden">
                <Button variant={favorite ? "default" : "outline"} size="icon" onClick={handleFavoriteClick}>
                  <Heart className={`h-5 w-5 ${favorite ? "fill-current" : ""}`} />
                </Button>
                <Button variant="outline" size="icon" onClick={handlePlaylistClick}>
                  <ListPlus className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" onClick={handlePrint}>
                  <Printer className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Chord Sheet with Controls */}
          <SongBody 
            lyrics={version.content} 
            songKey={version.original_key} 
            showControl={true} 
            versions={song.chord_versions}
            currentVersionId={version.chord_sheet_id}
            onVersionChange={(versionId) => {
              const newVersion = song.chord_versions.find(v => v.chord_sheet_id === versionId);
              if (newVersion) {
                setVersion(newVersion);
                navigate(`/songs/${song.song_id}/${versionId}`);
              }
            }}
          />

          {/* Comments Section */}
          <div className="mt-8 print:hidden">
            <CommentSection 
              songId={song.song_id} 
              comments={comments}
              onPostComment={handlePostComment}
              onUpdateComment={handleUpdateComment}
              onDeleteComment={handleDeleteComment}
              isSubmitting={isSubmittingComment}
              isLoadingComments={isLoadingComments}
              userRating={userRating}
              ratingStats={ratingStats}
              onSubmitRating={handleSubmitRating}
              isSubmittingRating={isSubmittingRating}
            />
          </div>
        </div>

        {/* Right column - Sidebar */}
        <div className="space-y-6">
          {/* Chord Diagrams */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Hợp âm sử dụng</h3>
              <ChordList chords={chords} />
            </CardContent>
          </Card>

          {/* Song Information */}
          <SongInformation song={song} version={version} />
        </div>
      </div>

      {/* Playlist Modal */}
      <PlaylistModal open={playlistModalOpen} onOpenChange={setPlaylistModalOpen} songId={song?.song_id} />
    </main>
  )
}

export default SongPage