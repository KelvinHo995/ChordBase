import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Eye, Star, Music2 } from "lucide-react"

export function SongCard({ song }) {
  const isLoggedIn = true
  const favorite = true

  const handleFavoriteClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    // if (!isLoggedIn) return
    // if (favorite) {
    //   removeFromFavorites(song.id)
    // } else {
    //   addToFavorites(song.id)
    // }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-success/10 text-success border-success/20"
      case "Intermediate":
        return "bg-warning/10 text-warning border-warning/20"
      case "Advanced":
        return "bg-destructive/10 text-destructive border-destructive/20"
      default:
        return ""
    }
  }

  return (
    <Link to={`/song/${song.id}`}>
      <Card
        className="group cursor-pointer transition-all hover:shadow-lg hover:border-primary/30">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Music2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3
                  className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {song.title}
                </h3>
                <p className="text-sm text-muted-foreground">{song.artist}</p>
              </div>
            </div>
            {isLoggedIn && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={handleFavoriteClick}>
                <Heart
                  className={`h-4 w-4 ${favorite ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
              </Button>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {song.genre}
            </Badge>
            <Badge
              className={`text-xs ${getDifficultyColor(song.difficulty)}`}
              variant="outline">
              {song.difficulty}
            </Badge>
          </div>

          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-warning text-warning" />
              {song.rating.toFixed(1)}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {song.views.toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
