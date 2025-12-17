import { useState } from "react"
import { Star, MessageSquare } from "lucide-react"

export function CommentSection({ isLoggedIn = false, comments = [], onSubmitComment = () => {} }) {
  const [newComment, setNewComment] = useState("")
  const [rating, setRating] = useState(5)
  const [hoveredRating, setHoveredRating] = useState(0)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    onSubmitComment({
      text: newComment.trim(),
      rating: rating
    })
    setNewComment("")
    setRating(5)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-950 mb-6">
        <MessageSquare className="h-5 w-5" />
        Comments ({comments.length})
      </h3>

      <div className="space-y-6">
        {isLoggedIn ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-950 mb-2">Your Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-0.5 transition-transform hover:scale-110">
                    <Star
                      className={`h-5 w-5 transition-colors ${
                        star <= (hoveredRating || rating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-zinc-500"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <textarea
              placeholder="Write your comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-gray-950 placeholder:text-zinc-500 focus:outline-none focus:ring-0 focus:border-slate-200 transition-all"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all">
              Post Comment
            </button>
          </form>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center">
            <p className="mb-3 text-zinc-500">Log in to leave a comment</p>
            <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all">
              Log in
            </button>
          </div>
        )}

        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="py-4 text-center text-zinc-500">No comments yet. Be the first to comment!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 border-b border-slate-200 pb-4 last:border-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
                  {comment.username[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-950">{comment.username}</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3 w-3 ${
                            star <= comment.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-zinc-500"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-zinc-500">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-950">{comment.text}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

