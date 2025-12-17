import React, { useState, useRef, useEffect } from 'react';
import SongLine from './SongLine';
import { getTransposedKey, shouldUseSharps, transposeChord } from '../utils/TransposeUtils';
import { useInstrument } from '../context/InstrumentContext';

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
        <div className="flex flex-col gap-3 font-mono whitespace-pre-wrap">
            {showControl &&
                <div className="flex items-center bg-white border-white rounded-xl gap-x-5 p-2">
                    <div className="flex items-center rounded-full gap-x-3">
                        <button onClick={() => handleTranspose(-1)} className="p-2 w-12 h-10 bg-gray-200 border-white rounded-full">-</button>
                        <span>Transpose: {semitones > 0 ? `+${semitones}` : semitones}</span>
                        <button onClick={() => handleTranspose(+1)} className="p-2 w-12 h-10 bg-gray-200 border-white rounded-full">+</button>
                    </div>
                    
                    <select onChange={(e) => handleInstrumentChange(e.target.value)}>
                        <option value={"guitar"}>Guitar</option>
                        <option value={"ukulele"}>Ukelele</option>
                        <option value={"piano"}>Piano</option>
                    </select>

                    <button className='p-2 rounded-full' onClick={() => setIsAutoscroll(isAutoscroll => !isAutoscroll)}>
                        {isAutoscroll ? "Stop" : "Autoscroll"}
                    </button>

                    {isAutoscroll && 
                        <input
                            name='scrollspeed'
                            type='range' 
                            min={1}
                            max={10} 
                            value={srcollSpeed} 
                            onChange={(e) => setScrollSpeed(e.target.value)}
                        />
                    }
                </div>  
            }
            {/* Song line */}
            <div 
                className={`flex flex-col bg-white rounded-xl border-white ${isAutoscroll ? "h-screen overflow-y-auto" : ""}`}
                ref={lyricRef}
            >
                {lines.map((line, i) => (
                    <SongLine key={i} line={line} semitones={semitones} preferSharps={preferSharps}/>
                ))}
            </div>
        </div>
    )
}

export default SongBody;