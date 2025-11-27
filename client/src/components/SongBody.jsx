import React, { useState } from 'react';
import SongLine from './SongLine';
import { getTransposedKey, shouldUseSharps, transposeChord } from '../utils/TransposeUtils';
import { useInstrument } from '../context/InstrumentContext';

const songKey = "G";
const lyrics = "[G]I found a [Em]love for [C]me\nDarling just [G]dive right in";

const SongBody = () => {
    const { instrument, setInstrument, handleInstrumentChange } = useInstrument()
    const [semitones, setSemitones] = useState(0);

    const currentKey = getTransposedKey(songKey, semitones);
    const preferSharps = shouldUseSharps(currentKey);

    const handleTranspose = (delta) => setSemitones(s => {
        let next = s + delta;
        if (next > 6) next -= 12;
        else if (next < -5) next += 12;
        return next;
    })
    

    const lines = lyrics.split('\n');
    return (
        <div className="font-mono whitespace-pre-wrap">
            <div className="flex items-center">
                <button onClick={() => handleTranspose(-1)} className="px-2 py-1 bg-gray-200 rounded">-</button>
                <span>Transpose: {semitones > 0 ? `+${semitones}` : semitones}</span>
                <button onClick={() => handleTranspose(+1)} className="px-2 py-1 bg-gray-200 rounded">+</button>
                <select onChange={(e) => handleInstrumentChange(e.target.value)}>
                    <option value={"guitar"}>Guitar</option>
                    <option value={"ukulele"}>Ukelele</option>
                    <option value={"piano"}>Piano</option>
                </select>
            </div>

            {lines.map((line, i) => (
                <SongLine key={i} line={line} semitones={semitones} preferSharps={preferSharps}/>
            ))}
        </div>
    )
}

export default SongBody;