import React from 'react'
import HoverChord from './HoverChord'
import { cn } from "@/lib/utils"
import { Music } from 'lucide-react'

export function ChordList({ 
  chords = [], 
  orientation = "wrap",
  className
}) {
  
  if (!chords || chords.length === 0) {
    return (
      <div className="text-lg text-muted-foreground flex items-center gap-2 italic">
        <Music className="h-5 w-5" /> Không có hợp âm nào
      </div>
    )
  }

  return (
    <div 
      className="w-full grid grid-cols-2 items-center justify-around wrap rounded-2xl"
    >
      {chords.map((name, index) => (
        <HoverChord key={`${name}-${index}`} chordName={name} hoverable={false}/>
      ))}
    </div>
  )
}

export default ChordList