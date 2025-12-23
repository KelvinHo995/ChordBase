import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Music, FileText, Users, Sparkles, TrendingUp, Heart, BarChart3, Settings, UserCog, Clock } from "lucide-react"

const AdminDashboard = () => {
  // Mock data for UI demonstration
  const stats = [
    {
      title: "Total Songs",
      value: 156,
      icon: Music,
    },
    {
      title: "Total Users",
      value: 342,
      icon: Users,
    },
    {
      title: "Pending Review",
      value: 8,
      icon: Clock,
    },
    {
      title: "AI Generates Today",
      value: 47,
      icon: Sparkles,
    },
  ]

  const topSongs = [
    { title: "Wonderwall", favorites: 1240 },
    { title: "Let It Be", favorites: 1100 },
    { title: "Shape of You", favorites: 980 },
    { title: "Hallelujah", favorites: 850 },
    { title: "Hotel California", favorites: 720 },
  ]

  return (
    <div className="container py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of ChordBase statistics and management</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/user-management">
            <Button variant="outline">
              <UserCog className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
          </Link>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-bold leading-none">{stat.value}</p>
                  <p className="mt-1 text-sm font-medium text-muted-foreground">{stat.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Top Songs */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Activity Chart (Mock) */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Weekly Activity
                </CardTitle>
                <CardDescription>Song views and uploads this week</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => {
                const percentage = [65, 80, 45, 90, 75, 55, 70][index]
                return (
                  <div key={day} className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground w-8">{day}</span>
                    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-12 text-right">{Math.round(percentage * 10)}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top Songs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Favorited Songs
            </CardTitle>
            <CardDescription>Most popular songs by favorites</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topSongs.map((song, index) => (
                <div
                  key={song.title}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{song.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Heart className="h-4 w-4" />
                    <span className="text-sm font-medium">{song.favorites}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <Link to="/admin/user-management">
              <Button variant="outline" className="w-full justify-start h-auto py-4 bg-transparent">
                <UserCog className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <p className="font-medium">Manage Users</p>
                  <p className="text-xs text-muted-foreground">View and edit user accounts</p>
                </div>
              </Button>
            </Link>
            <Link to="/admin/song-management">
              <Button variant="outline" className="w-full justify-start h-auto py-4 bg-transparent">
                <FileText className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <p className="font-medium">Review Uploads</p>
                  <p className="text-xs text-muted-foreground">Approve pending chord sheets</p>
                </div>
              </Button>
            </Link>
            <Button variant="outline" className="w-full justify-start h-auto py-4 bg-transparent">
              <Settings className="h-5 w-5 mr-3" />
              <div className="text-left">
                <p className="font-medium">Site Settings</p>
                <p className="text-xs text-muted-foreground">Configure app settings</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminDashboard