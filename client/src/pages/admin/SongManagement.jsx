import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Music, Clock, Check, X, Eye, ArrowLeft } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useState } from "react"
import { SongService } from "@/services/BackendService"

const SongManagement = () => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleApprove = async (chord_sheet_id) => {
    try {
      const res = await SongService.approve(chord_sheet_id);
      setAllPendingSongs(prevSongs => prevSongs.filter(song => song.chord_sheet_id !== chord_sheet_id));
    } catch (error) {
      console.error("Error approving song with ID:", chord_sheet_id, error);
    }
    console.log("Approved song with ID:", chord_sheet_id)
  }

  const handleReject = async (chord_sheet_id) => {
    try {
      const res = await SongService.reject(chord_sheet_id);
      setAllPendingSongs(prevSongs => prevSongs.filter(song => song.chord_sheet_id !== chord_sheet_id));
    } catch (error) {
      console.error("Error rejecting song with ID:", chord_sheet_id, error);
    }
    console.log("Rejected song with ID:", chord_sheet_id)
  }

  const [allPendingSongs, setAllPendingSongs] = useState([]);
  useEffect(() => {
    const fetchPendingSongs = async () => {
      try {
        const res = await SongService.getPending();
        console.log(res);
        setAllPendingSongs(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPendingSongs();
  }, []);

  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="cursor-pointer mb-6 gap-2 text-lg -ml-4 print:hidden">
        <ArrowLeft className="h-5 w-5" />
        Back
      </Button>
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
          <CardDescription>{allPendingSongs.length} chord sheets waiting for approval</CardDescription>
        </CardHeader>
        <CardContent>
          {allPendingSongs.length === 0 ? (
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
                  {allPendingSongs.map((song) => (
                    <TableRow key={song.chord_sheet_id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{song.song.title}</p>
                          <p className="text-sm text-muted-foreground">{song.song.artists[0].name}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{song.song.genre.name}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{song.uploader ? song.uploader.display_name : "AI Generator"}</TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(song.created_at)}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/songs/${song.song_id}/${song.chord_sheet_id}`}>
                              <Eye className="mr-1 h-3 w-3" />
                              Preview
                            </Link>
                          </Button>
                          <Button onClick={() => handleApprove(song.chord_sheet_id)} size="sm" className="gap-1">
                            <Check className="h-3 w-3" />
                            Approve
                          </Button>
                          <Button variant="destructive" onClick={() => handleReject(song.chord_sheet_id)} size="sm" className="gap-1">
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