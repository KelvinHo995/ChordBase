import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Star, MessageSquare } from "lucide-react"
import { Link } from "react-router-dom"

export function CommentSection({ songId, comments: propComments = [] }) {
  const { user, isLoggedIn } = useAuth()
  const [newComment, setNewComment] = useState("")
  const [rating, setRating] = useState(5)
  const [hoveredRating, setHoveredRating] = useState(0)

  // Mock comments for UI demonstration
  const comments = propComments.length > 0 ? propComments : [
    {
      id: 1,
      username: "guitar_hero",
      rating: 5,
      createdAt: "2023-10-15T10:00:00Z",
      text: "Great song! The chords are accurate."
    },
    {
      id: 2,
      username: "music_lover",
      rating: 4,
      createdAt: "2023-10-16T14:30:00Z",
      text: "Fun to play, but the bridge is tricky."
    }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!newComment.trim() || !isLoggedIn) return

    console.log("Submit comment:", { songId, text: newComment, rating })
    setNewComment("")
    setRating(5)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <MessageSquare className="h-5 w-5" />
          Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoggedIn ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="mb-2 block text-base">Your Rating</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-0.5"
                  >
                    <Star
                      className={`h-6 w-6 transition-colors ${
                        star <= (hoveredRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <Textarea
              placeholder="Write your comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              className="text-base"
            />
            <Button type="submit" disabled={!newComment.trim()} className="text-base">
              Post Comment
            </Button>
          </form>
        ) : (
          <div className="rounded-lg border border-border bg-muted/50 p-4 text-center">
            <p className="mb-3 text-muted-foreground text-base">Log in to leave a comment</p>
            <Button asChild className="text-base">
              <Link to="/auth/login">Log in</Link>
            </Button>
          </div>
        )}

        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="py-4 text-center text-muted-foreground text-base">No comments yet. Be the first to comment!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 border-b border-border pb-4 last:border-0">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary text-base">
                    {comment.username ? comment.username[0].toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground text-base">{comment.username}</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= comment.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="mt-1 text-base text-foreground">{comment.text}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default CommentSection

