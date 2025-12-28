import React, { useState, useRef, useEffect } from 'react';
import SongLine from './SongLine';
import { getTransposedKey, shouldUseSharps, transposeChord } from '../utils/TransposeUtils';
import { useInstrument } from '../context/InstrumentContext';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Minus, Play, Pause, Download, RotateCcw } from "lucide-react"

const songKeyTemp = "G";
const lyricsTemp = "[G]I found a [Em]love for [C]me\nDarling just [G]dive right in\n[G]I found a [Em]love for [C]me\nDarling just [G]dive right in\n[G]I found a [Em]love for [C]me\nDarling just [G]dive right in\n[G]I found a [Em]love for [C]me\nDarling just [G]dive right in\n[G]I found a [Em]love for [C]me\nDarling just [G]dive right in\n[G]I found a [Em]love for [C]me\nDarling just [G]dive right in\n[G]I found a [Em]love for [C]me\nDarling just [G]dive right in\n[G]I found a [Em]love for [C]me\nDarling just [G]dive right in\n[G]I found a [Em]love for [C]me\nDarling just [G]dive right in\n[G]I found a [Em]love for [C]me\nDarling just [G]dive right in\n";

const SongBody = ({ lyrics=null, songKey=null, showControl=true }) => {
    if (lyrics == null)
        lyrics = lyricsTemp;
    if (songKey == null) 
        songKey = songKeyTemp;

    const { instrument, setInstrument, handleInstrumentChange } = useInstrument()
    const [semitones, setSemitones] = useState(0);
    const [isAutoscroll, setIsAutoscroll] = useState(false);
    const [srcollSpeed, setScrollSpeed] = useState(1);
    const lyricRef = useRef();

    const currentKey = getTransposedKey(songKey, semitones);
    const preferSharps = shouldUseSharps(currentKey);
    const lines = lyrics.split('\n');

    const handleTranspose = (delta) => setSemitones(s => {
        let next = s + delta;
        if (next > 6) next -= 12;
        else if (next < -5) next += 12;
        return next;
    })
    
    useEffect(() => {
        if (!isAutoscroll) return;

        const el = lyricRef.current;
        
        const pxPerStep = srcollSpeed * 0.5;

        const interval = setInterval(() => {
            el.scrollTop += pxPerStep

            if (el.scrollTop + el.clientHeight >= el.scrollHeight - 2) 
                el.scrollTop = 0;
        }, 30)

        return () => {
            clearInterval(interval)
        }
    }, [srcollSpeed, isAutoscroll])

    return (
        <Card>
            {showControl && (
                <CardHeader className="pb-3 print:hidden">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <CardTitle className="text-xl">Chord Sheet</CardTitle>
                        <div className="flex flex-wrap items-center gap-2">
                            {/* Transpose Controls */}
                            <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/50 p-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleTranspose(-1)}>
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <span className="min-w-[60px] text-center text-base font-medium">
                                    {semitones > 0 ? `+${semitones}` : semitones}
                                </span>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleTranspose(1)}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSemitones(0)}>
                                    <RotateCcw className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Instrument Selector */}
                            <Select onValueChange={handleInstrumentChange} defaultValue="guitar">
                                <SelectTrigger className="h-10 w-[120px] text-base">
                                    <SelectValue placeholder="Instrument" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="guitar" className="text-base">Guitar</SelectItem>
                                    <SelectItem value="ukulele" className="text-base">Ukulele</SelectItem>
                                    <SelectItem value="piano" className="text-base">Piano</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Autoscroll Controls */}
                            <Button
                                variant={isAutoscroll ? "default" : "outline"}
                                size="sm"
                                onClick={() => setIsAutoscroll(!isAutoscroll)}
                                className="text-base h-10 px-4"
                            >
                                {isAutoscroll ? (
                                    <>
                                        <Pause className="mr-2 h-4 w-4" /> Stop
                                    </>
                                ) : (
                                    <>
                                        <Play className="mr-2 h-4 w-4" /> Scroll
                                    </>
                                )}
                            </Button>

                            {isAutoscroll && (
                                <input
                                    name='scrollspeed'
                                    type='range' 
                                    min={1}
                                    max={10} 
                                    value={srcollSpeed} 
                                    onChange={(e) => setScrollSpeed(e.target.value)}
                                    className="w-24"
                                />
                            )}
                        </div>
                    </div>
                </CardHeader>
            )}
            
            <CardContent className={`py-6 ${showControl ? 'px-2 m-6' : 'px-4 m-0'} bg-gray-100 rounded-2xl`}>
                <div 
                    className={`flex flex-col font-mono whitespace-pre-wrap break-words overflow-hidden ${isAutoscroll ? "h-[500px] overflow-y-auto" : ""}`}
                    ref={lyricRef}
                >
                    {lines.map((line, i) => (
                        <SongLine key={i} line={line} semitones={semitones} preferSharps={preferSharps} compact={!showControl}/>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default SongBody;