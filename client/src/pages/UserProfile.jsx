import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Calendar, Music, Heart, ListMusic, Save, CheckCircle } from "lucide-react"

const UserProfile = () => {
    const user = {
        displayName: "Alice Smith",
        username: "alicesmith",
        email: "alice@example.com",
        bio: "Passionate about electronic music and synthesizers.",
        role: "admin",
        joinDate: "October 24, 2023",
        avatar: "/placeholder.svg"
    }

    const stats = {
        uploaded: 12,
        favorites: 84,
        playlists: 5
    }

    const isSaving = false
    const showSuccessMessage = true
    const { isLoggedIn } = useAuth()

    // if (!isLoggedIn)
    //     return (
    //         <div>UserProfile</div>
    //     )
    
    return (
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
          <p className="mt-2 text-muted-foreground">Manage your account and view your activity.</p>
        </div>

        {/* Profile Overview */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar} alt={user.displayName} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {user.displayName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-foreground">{user.displayName}</h2>
                <p className="text-muted-foreground">@{user.username}</p>
                <div className="mt-2 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                  <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                    {user.role === "admin" ? "Admin" : "User"}
                  </Badge>
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    Joined {user.joinDate}
                  </span>
                </div>
                {user.bio && <p className="mt-3 text-sm text-foreground">{user.bio}</p>}
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-3 gap-4 border-t border-border pt-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-2xl font-bold text-foreground">
                  <Music className="h-5 w-5 text-primary" />
                  {stats.uploaded}
                </div>
                <p className="text-sm text-muted-foreground">Uploaded</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-2xl font-bold text-foreground">
                  <Heart className="h-5 w-5 text-destructive" />
                  {stats.favorites}
                </div>
                <p className="text-sm text-muted-foreground">Favorites</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-2xl font-bold text-foreground">
                  <ListMusic className="h-5 w-5 text-primary" />
                  {stats.playlists}
                </div>
                <p className="text-sm text-muted-foreground">Playlists</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Edit Profile
            </CardTitle>
            <CardDescription>Update your public profile information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {showSuccessMessage && (
              <Alert className="border-success/50 bg-success/5">
                <CheckCircle className="h-4 w-4 text-success" />
                <AlertDescription className="text-success">Profile updated successfully!</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                defaultValue={user.displayName}
                placeholder="Your display name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" defaultValue={user.email} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                defaultValue={user.bio}
                placeholder="Tell us about yourself..."
                rows={3}
              />
            </div>

            <Button disabled={isSaving} className="gap-2">
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
}

export default UserProfile