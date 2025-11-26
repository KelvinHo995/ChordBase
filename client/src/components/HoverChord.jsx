import React, { useState } from "react";
import Chord from "./Chord";
import guitarDb from "@tombatossals/chords-db/lib/guitar.json";
console.log(guitarDb);
// import instrument from "@tombatossals/chords-db/lib/guitar.json";

const getChordPositions = (chordName) => {
    // const normalized = chordName.replace("/", "_");
    
    const rootMatch = chordName.match(/^([A-G][b#]?)/);
    if (!rootMatch) return null;

    let root = rootMatch[1];
    let suffix = chordName.slice(root.length); // the rest (like "m_C#")

    console.log(root, suffix);

    switch (root) {
        case "G#":
            root = "Ab";
            break;
        case "A#":
            root = "Bb";
            break;
        case "Db":
            root = "Csharp";
            break;
        case "C#":
            root = "Csharp";
            break;
        case "D#":
            root = "Eb";
            break;
        case "Gb":
            root = "Fsharp";
            break;
        case "F#":
            root = "Fsharp";
            break;
        default:
            break;
    }
    
    if (suffix === "m") suffix = "minor";
    if (suffix === "") suffix = "major";
    console.log(root, suffix);
    const chordGroup = guitarDb.chords[root];
    console.log(chordGroup);
    if (!chordGroup) return null;

    const chordData = chordGroup.find(c => c.suffix === suffix);

    return chordData ? chordData.positions : null;
}

const HoverChord = ({ chordName }) => {
    const [hovered, setHovered] = useState(false)
    const [voicingIndex, setVoicingIndex] = useState(0);

    const chordPositions = getChordPositions(chordName);

    console.log(chordPositions);

    const getNextVoicing = () => {
        setVoicingIndex((voicingIndex + 1) % chordPositions.length);
    }

    const getPrevVoicing = () => {
        setVoicingIndex((voicingIndex - 1 + chordPositions.length) % chordPositions.length);
    }

    const instrument = {
        strings: 6,
        fretsOnChord: 4,
        name: 'Guitar',
        keys: [],
        tunings: {
        standard: ['E', 'A', 'D', 'G', 'B', 'E']
        }
    }

    return (
        <span
            className="relative inline-block"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <span className="text-red-500 font-semibold">[{chordName}]</span>
            {
                hovered && (
                <div className="w-55 h-60 absolute left-1/2 -translate-x-1/2 mb-1
                                bg-white border-white rounded-xl shadow-md p-1
                                flex flex-col justify-center items-center z-50"
                >
                    <div>
                        <span></span>
                    </div>
                    <div>
                        <Chord chord={chordPositions[voicingIndex]} instrument={instrument} />
                    </div>
                    <div className="flex justify-center items-center gap-3 mt-1 text-sm">
                        <button 
                            onClick={getPrevVoicing}
                            className="p-1 bg-gray-100 rounded hover:bg-gray-200"
                        >
                            ◀
                        </button>
                        <span>
                            {voicingIndex + 1}/{chordPositions.length}
                        </span>
                        <button
                            onClick={getNextVoicing}
                            className="p-1 bg-gray-100 rounded hover:bg-gray-200"
                        >
                            ▶
                        </button>
                    </div>
                </div>
                )
            }
        </span>
    )
}

export default HoverChord;