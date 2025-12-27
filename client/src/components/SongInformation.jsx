"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Eye, Star, User, Music2, TrendingUp } from "lucide-react"

export function SongInformation({ song, version }) {
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
    <Card className="print:hidden">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Music2 className="h-5 w-5 text-primary" />
          Song Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Artist */}
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-primary/10 p-2">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Artist</p>
            <p className="text-base font-semibold text-foreground">{song.artist}</p>
          </div>
        </div>

        <Separator />

        {/* Genre & Difficulty */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Genre</span>
            <Badge variant="secondary" className="text-sm">
              {song.genre.name}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Difficulty</span>
            <Badge className={`${getDifficultyColor(song.difficulty)} text-sm`}>{song.difficulty || "Beginner"}</Badge>
          </div>
        </div>

        <Separator />

        {/* Stats */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Star className="h-4 w-4" />
              <span className="text-sm font-medium">Rating</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-base font-bold text-foreground">{version.rating.avg.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">/ 5.0</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Eye className="h-4 w-4" />
              <span className="text-sm font-medium">Views</span>
            </div>
            <span className="text-base font-bold text-foreground">{song.stats.total_views.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">Popularity</span>
            </div>
            <Badge variant="outline" className="text-sm">
              {song.views > 20000 ? "Trending" : song.views > 10000 ? "Popular" : "Rising"}
            </Badge>
          </div>
        </div>

        <Separator />

        {/* Upload Info */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Uploaded by</span>
            <span className="text-base font-semibold text-foreground">{version.uploader?.display_name || "AI Generator"}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-medium">Upload Date</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {new Date(version.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Tags */}
        {song.tags && song.tags.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Tags</span>
              <div className="flex flex-wrap gap-1.5">
                {song.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

