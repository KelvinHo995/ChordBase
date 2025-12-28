import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Star, MessageSquare, Reply, Edit2, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"

// Move CommentItem outside to prevent re-creation on every render
const CommentItem = ({ 
  comment, 
  depth = 0, 
  isReplying, 
  replyText, 
  setReplyText, 
  setReplyingTo, 
  handleReply, 
  isSubmitting, 
  isLoggedIn, 
  formatDate,
  currentUserId,
  editingCommentId,
  setEditingCommentId,
  editText,
  setEditText,
  onUpdateComment,
  onDeleteComment
}) => {
  const isEditing = editingCommentId === comment.comment_id
  const isOwner = currentUserId && comment.user?.user_id === currentUserId

  return (
    <div className={`${depth > 0 ? 'ml-12 mt-3' : ''}`}>
      <div className="flex gap-3 border-b border-border pb-4 last:border-0">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarFallback className="bg-primary/10 text-primary text-base">
            {comment.user?.display_name ? comment.user.display_name[0].toUpperCase() : "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-foreground text-base">
              {comment.user?.display_name || "Người dùng ẩn danh"}
            </span>
            <span className="text-sm text-muted-foreground">
              {formatDate(comment.created_at)}
            </span>
            {comment.updated_at !== comment.created_at && (
              <span className="text-xs text-muted-foreground italic">(đã chỉnh sửa)</span>
            )}
          </div>
          
          {/* Comment content or edit form */}
          {isEditing ? (
            <div className="mt-2 space-y-2">
              <Textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={2}
                className="text-base"
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={async () => {
                    await onUpdateComment(comment.comment_id, editText)
                    setEditingCommentId(null)
                    setEditText("")
                  }}
                  disabled={!editText.trim() || isSubmitting}
                  className="text-sm"
                >
                  Lưu
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingCommentId(null)
                    setEditText("")
                  }}
                  className="text-sm"
                >
                  Hủy
                </Button>
              </div>
            </div>
          ) : (
            <p className="mt-1 text-base text-foreground wrap-break-words">{comment.content}</p>
          )}
          
          {/* Action buttons */}
          {!isEditing && (
            <div className="flex gap-2 mt-2">
              {isLoggedIn && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyingTo(isReplying ? null : comment.comment_id)}
                  className="h-7 px-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <Reply className="h-3 w-3 mr-1" />
                  {isReplying ? 'Hủy' : 'Trả lời'}
                </Button>
              )}
              
              {isOwner && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingCommentId(comment.comment_id)
                      setEditText(comment.content)
                    }}
                    className="h-7 px-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <Edit2 className="h-3 w-3 mr-1" />
                    Chỉnh sửa
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteComment(comment.comment_id)}
                    className="h-7 px-2 text-sm text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Xóa
                  </Button>
                </>
              )}
            </div>
          )}

          {/* Reply form */}
          {isReplying && (
            <div className="mt-3 space-y-2">
              <Textarea
                placeholder={`Trả lời ${comment.user?.display_name || "bình luận này"}...`}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={2}
                className="text-base"
                disabled={isSubmitting}
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleReply(comment.comment_id)}
                  disabled={!replyText.trim() || isSubmitting}
                  className="text-sm"
                >
                  {isSubmitting ? 'Đang đăng...' : 'Đăng trả lời'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setReplyingTo(null)
                    setReplyText("")
                  }}
                  className="text-sm"
                >
                  Hủy
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Render nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3">
          {comment.replies.map(reply => (
            <CommentItem 
              key={reply.comment_id} 
              comment={reply} 
              depth={depth + 1}
              isReplying={isReplying}
              replyText={replyText}
              setReplyText={setReplyText}
              setReplyingTo={setReplyingTo}
              handleReply={handleReply}
              isSubmitting={isSubmitting}
              isLoggedIn={isLoggedIn}
              formatDate={formatDate}
              currentUserId={currentUserId}
              editingCommentId={editingCommentId}
              setEditingCommentId={setEditingCommentId}
              editText={editText}
              setEditText={setEditText}
              onUpdateComment={onUpdateComment}
              onDeleteComment={onDeleteComment}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function CommentSection({ 
  songId, 
  comments: propComments = [], 
  onPostComment, 
  onUpdateComment,
  onDeleteComment,
  isSubmitting = false, 
  isLoadingComments = false,
  userRating = null,
  ratingStats = { average: 0, count: 0 },
  onSubmitRating,
  isSubmittingRating = false
}) {
  const { user, isLoggedIn } = useAuth()
  const [newComment, setNewComment] = useState("")
  const [rating, setRating] = useState(userRating || 0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [replyingTo, setReplyingTo] = useState(null) // Track which comment is being replied to
  const [replyText, setReplyText] = useState("")
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editText, setEditText] = useState("")

  // Update rating when userRating changes
  useEffect(() => {
    if (userRating !== null) {
      setRating(userRating);
    }
  }, [userRating]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Organize comments into a nested structure
  const organizeComments = (comments) => {
    const commentMap = {}
    const rootComments = []

    // First, create a map of all comments
    comments.forEach(comment => {
      commentMap[comment.comment_id] = { ...comment, replies: [] }
    })

    // Then, organize them into a tree structure
    comments.forEach(comment => {
      if (comment.parent_comment_id) {
        // This is a reply
        const parent = commentMap[comment.parent_comment_id]
        if (parent) {
          parent.replies.push(commentMap[comment.comment_id])
        }
      } else {
        // This is a root comment
        rootComments.push(commentMap[comment.comment_id])
      }
    })

    return rootComments
  }

  const organizedComments = organizeComments(propComments)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim() || !isLoggedIn) return

    try {
      if (onPostComment) {
        await onPostComment(newComment)
        // Clear the form on success
        setNewComment("")
      } else {
        console.log("Submit comment:", { songId, text: newComment, rating })
        setNewComment("")
      }
    } catch (error) {
      console.error('Failed to submit comment:', error)
      // Error is already logged in SongPage, you can add UI notification here
    }
  }

  const handleRatingClick = async (star) => {
    if (!isLoggedIn || isSubmittingRating) return;
    
    setRating(star);
    
    if (onSubmitRating) {
      await onSubmitRating(star);
    }
  }

  const handleReply = async (parentCommentId) => {
    if (!replyText.trim() || !isLoggedIn) return

    try {
      if (onPostComment) {
        await onPostComment(replyText, parentCommentId)
        // Clear the reply form on success
        setReplyText("")
        setReplyingTo(null)
      }
    } catch (error) {
      console.error('Failed to post reply:', error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <MessageSquare className="h-5 w-5" />
          Bình luận & Đánh giá
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rating Section */}
        <div className="border-b border-border pb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Đánh giá</h3>
              {ratingStats.count > 0 && (
                <p className="text-sm text-muted-foreground">
                  {ratingStats.average.toFixed(1)} sao ({ratingStats.count} {ratingStats.count === 1 ? 'đánh giá' : 'đánh giá'})
                </p>
              )}
            </div>
          </div>
          
          {isLoggedIn ? (
            <div>
              <Label className="mb-2 block text-base">{userRating ? 'Đánh giá của bạn' : 'Đánh giá bản hợp âm này'}</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-0.5 transition-transform hover:scale-110"
                    disabled={isSubmittingRating}
                  >
                    <Star
                      className={`h-7 w-7 transition-colors ${
                        star <= (hoveredRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {userRating && (
                <p className="text-sm text-muted-foreground mt-2">
                  Bạn đã đánh giá {userRating} {userRating === 1 ? 'sao' : 'sao'}
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground text-base mb-2">Đăng nhập để đánh giá bản hợp âm này</p>
            </div>
          )}
        </div>

        {/* Comment Form */}
        {isLoggedIn ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder="Viết bình luận của bạn..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              className="text-base"
              disabled={isSubmitting}
            />
            <Button type="submit" disabled={!newComment.trim() || isSubmitting} className="text-base">
              {isSubmitting ? 'Đang đăng...' : 'Đăng bình luận'}
            </Button>
          </form>
        ) : (
          <div className="rounded-lg border border-border bg-muted/50 p-4 text-center">
            <p className="mb-3 text-muted-foreground text-base">Đăng nhập để để lại bình luận</p>
            <Button asChild className="text-base">
              <Link to="/auth/login">Đăng nhập</Link>
            </Button>
          </div>
        )}

        <div className="space-y-4">
          {isLoadingComments ? (
            <p className="py-4 text-center text-muted-foreground text-base">Đang tải bình luận...</p>
          ) : organizedComments.length === 0 ? (
            <p className="py-4 text-center text-muted-foreground text-base">Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
          ) : (
            organizedComments.map((comment) => (
              <CommentItem 
                key={comment.comment_id} 
                comment={comment} 
                depth={0}
                isReplying={replyingTo === comment.comment_id}
                replyText={replyText}
                setReplyText={setReplyText}
                setReplyingTo={setReplyingTo}
                handleReply={handleReply}
                isSubmitting={isSubmitting}
                isLoggedIn={isLoggedIn}
                formatDate={formatDate}
                currentUserId={user?.user_id}
                editingCommentId={editingCommentId}
                setEditingCommentId={setEditingCommentId}
                editText={editText}
                setEditText={setEditText}
                onUpdateComment={onUpdateComment}
                onDeleteComment={onDeleteComment}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default CommentSection

