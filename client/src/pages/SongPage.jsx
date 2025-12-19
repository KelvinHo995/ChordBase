import React, { useState } from 'react'
import SongBody from '../components/SongBody'
import ChordList from '../components/ChordList'

const chords = ["G", "Em", "C"]

const SongPage = () => {
  return (
    <div className="w-full flex flex-col max-w-2xl space-y-6">
      <SongBody />
      <ChordList chords={chords}/>
    </div>
  )
}

export default SongPage