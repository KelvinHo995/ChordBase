import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Music, Clock, Check, X, Eye } from "lucide-react"
import { Link } from "react-router-dom"

const PENDING_SONGS = [
  {
    id: "5",
    title: "Blackbird",
    artist: "The Beatles",
    genre: "Folk",
    uploaderName: "Sarah Wilson",
    createdAt: "2024-02-10",
  },
  {
    id: "6",
    title: "Sweet Child O' Mine",
    artist: "Guns N' Roses",
    genre: "Rock",
    uploaderName: "Mike Johnson",
    createdAt: "2024-02-11",
  },
  {
    id: "7",
    title: "Thinking Out Loud",
    artist: "Ed Sheeran",
    genre: "Pop",
    uploaderName: "Emma Davis",
    createdAt: "2024-02-12",
  },
]

const SongManagement = () => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <Music className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Song Management</h1>
        </div>
        <p className="mt-2 text-muted-foreground">Review and approve user-submitted chord sheets.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Pending Review
          </CardTitle>
          <CardDescription>{PENDING_SONGS.length} chord sheets waiting for approval</CardDescription>
        </CardHeader>
        <CardContent>
          {PENDING_SONGS.length === 0 ? (
            <div className="py-12 text-center">
              <Check className="mx-auto mb-4 h-12 w-12 text-success" />
              <p className="text-lg font-medium text-foreground">All caught up!</p>
              <p className="text-muted-foreground">No pending chord sheets to review.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Song</TableHead>
                    <TableHead>Genre</TableHead>
                    <TableHead>Uploaded By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {PENDING_SONGS.map((song) => (
                    <TableRow key={song.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{song.title}</p>
                          <p className="text-sm text-muted-foreground">{song.artist}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{song.genre}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{song.uploaderName}</TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(song.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/song/${song.id}`}>
                              <Eye className="mr-1 h-3 w-3" />
                              Preview
                            </Link>
                          </Button>
                          <Button size="sm" className="gap-1">
                            <Check className="h-3 w-3" />
                            Approve
                          </Button>
                          <Button variant="destructive" size="sm" className="gap-1">
                            <X className="h-3 w-3" />
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
 
export default SongManagement