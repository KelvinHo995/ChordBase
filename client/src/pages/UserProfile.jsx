import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { PlaylistService, UserService, SongService } from '../services/BackendService'
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
  const { user, isLoggedIn, setUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [formData, setFormData] = useState({
    display_name: user?.display_name || '',
    bio: user?.bio || ''
  });

  const [stats, setStats] = useState({
    uploaded: 0,
    favorites: 0,
    playlists: 0
  });

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const results = await Promise.all([
          SongService.getAllChordSheets({ uploaded_id: user?.user_id }),
          PlaylistService.getFavoriteSongs(),
          PlaylistService.getAllPlaylists()
        ]);

        setStats({
          uploaded: results[0].data.length,
          favorites: results[1].data.length,
          playlists: results[2].data.length
        })
      } catch (error) {
        console.error("Failed to fetch user stats:", error);
      }
    };

    fetchUserStats();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id === 'displayName' ? 'display_name' : id]: value
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setShowSuccessMessage(false);

    try {
      const response = await UserService.updateProfile({
        display_name: formData.display_name,
        bio: formData.bio
      });

      // Update the user in auth context
      const updatedUser = { ...user, ...response.data.user };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Cập nhật hồ sơ thất bại. Vui lòng thử lại.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isLoggedIn || !user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Vui lòng đăng nhập để xem hồ sơ của bạn</h1>
        </div>
      </div>
    )
  }
  
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Hồ sơ của tôi</h1>
        <p className="mt-2 text-muted-foreground">Quản lý tài khoản và xem hoạt động của bạn.</p>
      </div>

      {/* Profile Overview */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <Avatar className="h-24 w-24">
              <AvatarImage src={"/placeholder.svg"} alt={user.display_name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {user.display_name[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-foreground">{user.display_name}</h2>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                  {user.role === "admin" ? "Quản trị viên" : "Người dùng"}
                </Badge>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  Tham gia {new Date(user.created_at).toLocaleDateString("vi-VN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric"})}
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
              <p className="text-sm text-muted-foreground">Đã tải lên</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-2xl font-bold text-foreground">
                <Heart className="h-5 w-5 text-destructive" />
                {stats.favorites}
              </div>
              <p className="text-sm text-muted-foreground">Yêu thích</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-2xl font-bold text-foreground">
                <ListMusic className="h-5 w-5 text-primary" />
                {stats.playlists}
              </div>
              <p className="text-sm text-muted-foreground">Danh sách phát</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Chỉnh sửa hồ sơ
          </CardTitle>
          <CardDescription>Cập nhật thông tin hồ sơ công khai của bạn.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            {showSuccessMessage && (
              <Alert className="border-success/50 bg-success/5">
                <CheckCircle className="h-4 w-4 text-success" />
                <AlertDescription className="text-success">Cập nhật hồ sơ thành công!</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="displayName">Tên hiển thị</Label>
              <Input
                id="displayName"
                value={formData.display_name}
                onChange={handleInputChange}
                placeholder="Tên hiển thị của bạn"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user.email} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">Email không thể thay đổi.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Tiểu sử</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Hãy kể cho chúng tôi về bản thân bạn..."
                rows={3}
              />
            </div>

            <Button type="submit" disabled={isSaving} className="gap-2">
              <Save className="h-4 w-4" />
              {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default UserProfile