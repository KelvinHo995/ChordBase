import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Music, Clock, Check, X, Eye, ArrowLeft, Trash2, Search } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useState } from "react"
import { SongService } from "@/services/BackendService"
import { Input } from "@/components/ui/input"

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

  const handleDelete = async (chord_sheet_id) => {
    if (!confirm("Bạn có chắc chắn muốn xóa chord này? Hành động này không thể hoàn tác.")) {
      return;
    }
    try {
      await SongService.deleteChordSheet(chord_sheet_id);
      setApprovedChordSheets(prevSheets => prevSheets.filter(sheet => sheet.chord_sheet_id !== chord_sheet_id));
      setFilteredChordSheets(prevSheets => prevSheets.filter(sheet => sheet.chord_sheet_id !== chord_sheet_id));
    } catch (error) {
      console.error("Error deleting chord sheet with ID:", chord_sheet_id, error);
      alert("Xóa chord thất bại. Vui lòng thử lại.");
    }
  }

  const [allPendingSongs, setAllPendingSongs] = useState([]);
  const [approvedChordSheets, setApprovedChordSheets] = useState([]);
  const [filteredChordSheets, setFilteredChordSheets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
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

    const fetchApprovedChordSheets = async () => {
      try {
        const res = await SongService.getApproved();
        console.log("Approved chord sheets:", res);
        const sheets = res.data || [];
        setApprovedChordSheets(sheets);
        setFilteredChordSheets(sheets);
      } catch (err) {
        console.log("Error fetching approved chord sheets:", err);
      }
    };

    fetchPendingSongs();
    fetchApprovedChordSheets();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredChordSheets(approvedChordSheets);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = approvedChordSheets.filter(sheet => 
      sheet.song?.title.toLowerCase().includes(query) ||
      sheet.song?.artists?.some(artist => artist.name.toLowerCase().includes(query)) ||
      sheet.song?.genre?.name.toLowerCase().includes(query) ||
      sheet.uploader?.display_name.toLowerCase().includes(query)
    );
    setFilteredChordSheets(filtered);
  }, [searchQuery, approvedChordSheets]);

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
          <h1 className="text-3xl font-bold text-foreground">Quản lý bài hát</h1>
        </div>
        <p className="mt-2 text-muted-foreground">Xem xét và phê duyệt các bản hợp âm do người dùng gửi.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Chờ duyệt
          </CardTitle>
          <CardDescription>{allPendingSongs.length} bản hợp âm đang chờ phê duyệt</CardDescription>
        </CardHeader>
        <CardContent>
          {allPendingSongs.length === 0 ? (
            <div className="py-12 text-center">
              <Check className="mx-auto mb-4 h-12 w-12 text-success" />
              <p className="text-lg font-medium text-foreground">Đã xem hết!</p>
              <p className="text-muted-foreground">Không có chord sheet nào cần duyệt.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bài hát</TableHead>
                    <TableHead>Thể loại</TableHead>
                    <TableHead>Người tải lên</TableHead>
                    <TableHead>Ngày</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
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
                      <TableCell className="text-muted-foreground">{song.uploader ? song.uploader.display_name : "AI tạo"}</TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(song.created_at)}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/songs/${song.song_id}/${song.chord_sheet_id}`}>
                              <Eye className="mr-1 h-3 w-3" />
                              Xem trước
                            </Link>
                          </Button>
                          <Button onClick={() => handleApprove(song.chord_sheet_id)} size="sm" className="gap-1">
                            <Check className="h-3 w-3" />
                            Duyệt
                          </Button>
                          <Button variant="destructive" onClick={() => handleReject(song.chord_sheet_id)} size="sm" className="gap-1">
                            <X className="h-3 w-3" />
                            Từ chối
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

      {/* Approved Chord Versions Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Check className="h-5 w-5" />
            Chord đã duyệt
          </CardTitle>
          <CardDescription>Quản lý và xóa các chord đã được phê duyệt</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Tìm theo tên bài, nghệ sĩ, thể loại hoặc người tải..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          {filteredChordSheets.length === 0 ? (
            <div className="py-12 text-center">
              <Music className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium text-foreground">Không tìm thấy chord nào</p>
              <p className="text-muted-foreground">
                {searchQuery ? "Thử điều chỉnh tìm kiếm của bạn" : "Không có chord đã duyệt"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bài hát</TableHead>
                    <TableHead>Thể loại</TableHead>
                    <TableHead>Người gửi</TableHead>
                    <TableHead>Ngày</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredChordSheets.map((sheet) => (
                    <TableRow key={sheet.chord_sheet_id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{sheet.song?.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {sheet.song?.artists?.map(a => a.name).join(', ') || 'Unknown Artist'}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{sheet.song?.genre?.name || 'N/A'}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {sheet.uploader ? sheet.uploader.display_name : "AI tạo"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(sheet.created_at)}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/songs/${sheet.song?.song_id}/${sheet.chord_sheet_id}`}>
                              <Eye className="mr-1 h-3 w-3" />
                              Xem
                            </Link>
                          </Button>
                          <Button 
                            variant="destructive" 
                            onClick={() => handleDelete(sheet.chord_sheet_id)} 
                            size="sm" 
                            className="gap-1"
                          >
                            <Trash2 className="h-3 w-3" />
                            Xóa
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