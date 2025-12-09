import React, { useState } from 'react'
import SongBody from '../components/SongBody'
import ChordList from '../components/ChordList'
import guitarChords from '@tombatossals/chords-db/lib/guitar.json';
import ukuleleChords from '@tombatossals/chords-db/lib/ukulele.json';
import pianoChords from '@tombatossals/chords-db/lib/piano.json';
import { InstrumentProvider } from '../context/InstrumentContext'

const instruments = {
    guitar: {
        name: 'Guitar',
        chords: guitarChords,
        strings: 6,
        fretsOnChord: 4,
        name: 'Guitar',
        keys: [],
        tunings: {
            standard: ['E', 'A', 'D', 'G', 'B', 'E']
        }
    },
    ukulele: {
        name: 'Ukulele',
        chords: ukuleleChords,
        strings: 4,
        fretsOnChord: 4,
        name: 'Ukulele',
        keys: [],
        tunings: {
            standard: ['G', 'C', 'E', 'A']
        }
    },
    piano: {
        name: 'Piano',
        chords: pianoChords,
        strings: 0,
        fretsOnChord: 24,
        name: 'Piano',
        keys: [],
        tunings: {
            standard: []
        }
    }
};

const SongPage = () => {
  const [instrument, setInstrument] = useState(instruments["guitar"])

  const handleInstrumentChange = (value) => {
    setInstrument(instrument => instruments[value])
    console.log(instrument)
  }

  return (
    <InstrumentProvider value = {{ instrument, setInstrument, handleInstrumentChange }}>
      <div className="w-full max-w-2xl space-y-6">
        <SongBody />
        <ChordList />
      </div>
    </InstrumentProvider> 
  )
}

export default SongPage