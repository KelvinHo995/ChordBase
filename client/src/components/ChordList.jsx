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
      <div className="text-sm text-muted-foreground flex items-center gap-2 italic">
        <Music className="h-4 w-4" /> No chords listed
      </div>
    )
  }

  return (
    <div 
      className="w-full flex flex-row justify-around rounded-2xl"
    >
      {chords.map((name, index) => (
        <HoverChord key={`${name}-${index}`} chordName={name} hoverable={false}/>
      ))}
    </div>
  )
}

export default ChordList