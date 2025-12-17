import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Music, Users, Clock, Sparkles, TrendingUp, Eye, Heart, ChevronRight } from "lucide-react"

const STATS = [
  { label: "Total Songs", value: 156, icon: Music, color: "text-primary", bgColor: "bg-primary/10" },
  { label: "Total Users", value: 342, icon: Users, color: "text-success", bgColor: "bg-success/10" },
  { label: "Pending Review", value: 8, icon: Clock, color: "text-warning", bgColor: "bg-warning/10" },
  { label: "AI Generates Today", value: 47, icon: Sparkles, color: "text-primary", bgColor: "bg-primary/10" },
]

const TOP_SONGS = [
  { id: "1", title: "Wonderwall", artist: "Oasis", views: 15420, rating: 4.8 },
  { id: "2", title: "Let It Be", artist: "The Beatles", views: 12890, rating: 4.9 },
  { id: "3", title: "Shape of You", artist: "Ed Sheeran", views: 18350, rating: 4.7 },
  { id: "4", title: "Hallelujah", artist: "Leonard Cohen", views: 20120, rating: 5.0 },
  { id: "5", title: "Hotel California", artist: "Eagles", views: 16780, rating: 4.9 },
]

const AdminDashboard = () => {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            </div>
            <p className="mt-2 text-muted-foreground">Overview of ChordBase statistics and pending actions.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4 p-6">
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions & Top Songs */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common admin tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild variant="outline" className="w-full justify-between bg-transparent">
                <Link to="/admin/song-management">
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Review Pending Songs
                    <span className="ml-2 rounded-full bg-warning/10 px-2 py-0.5 text-xs font-medium text-warning">
                      8
                    </span>
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-between bg-transparent">
                <Link to="/admin/user-management">
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Manage Users
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Top Songs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Top Songs
              </CardTitle>
              <CardDescription>Most popular songs by engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {TOP_SONGS.map((song, index) => (
                  <div key={song.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-foreground">{song.title}</p>
                      <p className="text-sm text-muted-foreground">{song.artist}</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {song.views.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {song.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  )
}

export default AdminDashboard