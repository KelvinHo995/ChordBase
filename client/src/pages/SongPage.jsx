import React, { useState } from 'react'
import SongBody from '../components/SongBody'
import ChordList from '../components/ChordList'

const SongPage = () => {
  return (
    <div className="w-full max-w-2xl space-y-6">
      <SongBody />
      <ChordList />
    </div>
  )
}

export default SongPage