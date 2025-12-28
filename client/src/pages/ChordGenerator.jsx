import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Link2, FileAudio } from "lucide-react"

const ChordGenerator = () => {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
            <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">AI Tạo Bản Hợp Âm</h1>
            </div>
            <p className="mt-2 text-muted-foreground">Để AI tạo bản hợp âm cho bạn dựa trên nguồn âm thanh.</p>
        </div>

        {/* Usage Counter */}
        <Card className="mb-6">
            <CardContent className="flex items-center justify-between p-4">
            <div>
                <p className="font-medium text-foreground">Số lần tạo AI còn lại</p>
                <p className="text-sm text-muted-foreground">Đặt lại hàng ngày</p>
            </div>
            <Badge variant="default" className="text-lg">
                5 / 5
            </Badge>
            </CardContent>
        </Card>

        <Card className="mb-6">
            <CardHeader>
            <CardTitle>Thông tin bài hát</CardTitle>
            <CardDescription>Cung cấp chi tiết bài hát và nguồn âm thanh để AI phân tích.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                <Label htmlFor="songName">Tên bài hát *</Label>
                <Input id="songName" placeholder="Ví dụ: Wonderwall" />
                </div>

                <div className="space-y-2">
                <Label htmlFor="artistName">Tên nghệ sĩ *</Label>
                <Input id="artistName" placeholder="Ví dụ: Oasis" />
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                <Label htmlFor="audioLink" className="flex items-center gap-2">
                    <Link2 className="h-4 w-4" />
                    Liên kết âm thanh
                </Label>
                <Input id="audioLink" type="url" placeholder="https://youtube.com/watch?v=... hoặc liên kết Spotify" />
                </div>

                <div className="relative flex items-center">
                <div className="flex-grow border-t border-border" />
                <span className="mx-4 flex-shrink text-sm text-muted-foreground">HOẶC</span>
                <div className="flex-grow border-t border-border" />
                </div>

                <div className="space-y-2">
                <Label className="flex items-center gap-2">
                    <FileAudio className="h-4 w-4" />
                    Tải lên tệp âm thanh
                </Label>
                <div className="flex items-center gap-2">
                    <Input id="audioFile" type="file" accept="audio/*" className="hidden" />
                    <Button type="button" variant="outline" className="gap-2 bg-transparent">
                    <FileAudio className="h-4 w-4" />
                    Chọn tệp âm thanh
                    </Button>
                </div>
                </div>
            </div>

            <Button className="w-full gap-2">
                <Sparkles className="h-4 w-4" />
                Tạo bản hợp âm
            </Button>
            </CardContent>
        </Card>
    </div>
  )
}

export default ChordGenerator