import React, { useState, useRef, useEffect } from 'react';
import SongLine from './SongLine';
import { getTransposedKey, shouldUseSharps, transposeChord } from '../utils/TransposeUtils';
import { useInstrument } from '../context/InstrumentContext';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Plus, Minus, Play, Pause, Download, RotateCcw, Music2 } from "lucide-react"

const songKeyTemp = "G";
const lyricsTemp = "[G]I found a [Em]love for [C]me\nDarling just [G]dive right in\n[G]I found a [Em]love for [C]me\nDarling just [G]dive right in\n[G]I found a [Em]love for [C]me\nDarling just [G]dive right in\n[G]I found a [Em]love for [C]me\nDarling just [G]dive right in\n[G]I found a [Em]love for [C]me\nDarling just [G]dive right in\n[G]I found a [Em]love for [C]me\nDarling just [G]dive right in\n[G]I found a [Em]love for [C]me\nDarling just [G]dive right in\n[G]I found a [Em]love for [C]me\nDarling just [G]dive right in\n[G]I found a [Em]love for [C]me\nDarling just [G]dive right in\n[G]I found a [Em]love for [C]me\nDarling just [G]dive right in\n";

const SongBody = ({ lyrics=null, songKey=null, showControl=true, versions=[], currentVersionId=null, onVersionChange=null }) => {
    if (lyrics == null)
        lyrics = lyricsTemp;
    if (songKey == null) 
        songKey = songKeyTemp;

    const { instrument, setInstrument, handleInstrumentChange } = useInstrument()
    const [semitones, setSemitones] = useState(0);
    const [transposeInput, setTransposeInput] = useState('0');
    const [inputError, setInputError] = useState('');
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
        setTransposeInput(next.toString());
        setInputError('');
        return next;
    })

    const handleTransposeInputChange = (e) => {
        const value = e.target.value;
        setTransposeInput(value);

        // Allow empty input for editing
        if (value === '' || value === '-') {
            setInputError('');
            return;
        }

        // Check if it's a valid number
        const num = parseInt(value, 10);
        
        if (isNaN(num)) {
            setInputError('Vui lòng nhập số hợp lệ');
            return;
        }

        // Check range (-5 to +6)
        if (num < -5 || num > 6) {
            setInputError('Giá trị phải từ -5 đến +6');
            return;
        }

        // Valid input
        setInputError('');
        setSemitones(num);
    }

    const handleTransposeInputBlur = () => {
        // On blur, if input is empty or invalid, reset to current semitones
        if (transposeInput === '' || transposeInput === '-' || inputError) {
            setTransposeInput(semitones.toString());
            setInputError('');
        }
    }
    
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
                        <CardTitle className="text-xl">Hợp âm</CardTitle>
                        <div className="flex flex-wrap items-center gap-2">
                            {/* Version Selector */}
                            {versions && versions.length > 1 && (
                                <Select 
                                    value={currentVersionId?.toString()} 
                                    onValueChange={(value) => onVersionChange && onVersionChange(value)}
                                >
                                    <SelectTrigger className="h-10 w-[140px] text-base">
                                        <Music2 className="mr-2 h-4 w-4" />
                                        <SelectValue placeholder="Chọn phiên bản" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {versions.map((version, index) => (
                                            <SelectItem key={version.chord_sheet_id} value={version.chord_sheet_id.toString()} className="text-base">
                                                Version {index + 1}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                            
                            {/* Transpose Controls */}
                            <div className="relative">
                                <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/50 p-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleTranspose(-1)}>
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <Input 
                                        type="text" 
                                        value={transposeInput}
                                        onChange={handleTransposeInputChange}
                                        onBlur={handleTransposeInputBlur}
                                        className={`h-8 w-[60px] text-center text-base font-medium border-0 bg-transparent focus-visible:ring-1 ${inputError ? 'text-red-500' : ''}`}
                                        placeholder="0"
                                        title={inputError || ''}
                                    />
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleTranspose(1)}>
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
                                        setSemitones(0);
                                        setTransposeInput('0');
                                        setInputError('');
                                    }}>
                                        <RotateCcw className="h-4 w-4" />
                                    </Button>
                                </div>
                                {inputError && (
                                    <span className="absolute left-0 top-full mt-1 text-xs text-red-500 whitespace-nowrap z-10 bg-white px-2 py-1 rounded shadow-sm border border-red-200">
                                        {inputError}
                                    </span>
                                )}
                            </div>

                            {/* Instrument Selector */}
                            <Select onValueChange={handleInstrumentChange} defaultValue="guitar">
                                <SelectTrigger className="h-10 w-[120px] text-base">
                                    <SelectValue placeholder="Nhạc cụ" />
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
                                        <Pause className="mr-2 h-4 w-4" /> Dừng
                                    </>
                                ) : (
                                    <>
                                        <Play className="mr-2 h-4 w-4" /> Cuộn
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