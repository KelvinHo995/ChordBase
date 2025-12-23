import React, { useEffect, useState } from 'react'
import SongBody from '../components/SongBody'
import ChordList from '../components/ChordList'
import { useParams } from 'react-router-dom'
import { SongService } from '@/services/BackendService'
const chords = ["G", "Em", "C"]

const SongPage = () => {
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(false);
  const { songID, userID } = useParams();
  console.log(songID);
  console.log(userID);
  useEffect(() => {
    const fetchSong = async () => {
      try {
        setLoading(true);
        const res = await SongService.getById(songID);
        console.log(res);
        if (!userID)
          setSong(res.versions[0]);
        // else
        //   setSong(res.versions.find(version => version.uploaderID == userID));
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    fetchSong();
  }, [songID])
  return (
    <div className="w-full flex flex-col max-w-2xl space-y-6">
      <SongBody song={song} />
      <ChordList chords={chords}/>
    </div>
  )
}

export default SongPage