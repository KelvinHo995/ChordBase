import React, { useEffect, useState, useRef } from "react";
import Chord from "@tombatossals/react-chords/lib/Chord";
import ChordBlock from '@tombatossals/react-chords/lib/Chord/ChordBlock'
import { useInstrument } from "../context/InstrumentContext";


const getChordPositions = (chordName, instrument) => {    
    const rootMatch = chordName.match(/^([A-G][b#]?)/);
    if (!rootMatch) return null;

    let root = rootMatch[1];
    let suffix = chordName.slice(root.length); // the rest (like "m_C#")

    // console.log(root, suffix);

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
    
    if (suffix === "m" && instrument.name != "Piano") suffix = "minor";
    if (suffix === "") suffix = "major";
    // console.log(root, suffix);
    const chordGroup = instrument.chords.chords[root];
    // console.log(chordGroup);
    if (!chordGroup) return null;

    const chordData = chordGroup.find(c => c.suffix === suffix);

    return chordData ? chordData.positions : null;
}

const HoverChord = ({ chordName, hoverable=true }) => {
    const { instrument } = useInstrument()
    const [hovered, setHovered] = useState(false)
    const [voicingIndex, setVoicingIndex] = useState(0);
    const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
    const chordRef = useRef(null);
    const hoverTimeout = useRef(null);
    const leaveTimeout = useRef(null);

    const chordPositions = getChordPositions(chordName, instrument);

    const getNextVoicing = () => {
        setVoicingIndex((voicingIndex + 1) % chordPositions.length);
    }

    const getPrevVoicing = () => {
        setVoicingIndex((voicingIndex - 1 + chordPositions.length) % chordPositions.length);
    }

    useEffect(() => {
        setVoicingIndex(0);
    }, [instrument])

    useEffect(() => {
        if (hovered && chordRef.current) {
            const rect = chordRef.current.getBoundingClientRect();
            setPopupPosition({
                top: rect.top - 10, // 10px gap above the chord
                left: rect.left + rect.width / 2
            });
        }
    }, [hovered]);

    const handleMouseEnter = () => {
        // Clear any pending leave timeout
        if (leaveTimeout.current) {
            clearTimeout(leaveTimeout.current);
            leaveTimeout.current = null;
        }
        
        hoverTimeout.current = setTimeout(() => {
            setHovered(true);
        }, 500);
    };

    const handleMouseLeave = () => {
        if (hoverTimeout.current) {
            clearTimeout(hoverTimeout.current);
            hoverTimeout.current = null;
        }
        
        // Add delay before closing to allow mouse to reach popup
        leaveTimeout.current = setTimeout(() => {
            setHovered(false);
        }, 200);
    };

    const handlePopupMouseEnter = () => {
        // Clear the leave timeout when mouse enters popup
        if (leaveTimeout.current) {
            clearTimeout(leaveTimeout.current);
            leaveTimeout.current = null;
        }
        setHovered(true);
    };

    const handlePopupMouseLeave = () => {
        // Close immediately when leaving popup
        setHovered(false);
    };

    if (!hoverable)
        return (
            <div className="w-full h-full min-w-20 min-h-20
                bg-white border-white rounded-xl shadow-md p-1
                flex flex-col justify-center items-center"
            >
                {chordPositions != null ? (
                    <div className="flex flex-col items-center w-full h-full">
                        <span className="text-xl font-bold">{chordName}</span>
                        <Chord
                            chord={chordPositions[voicingIndex]} 
                            instrument={instrument} 
                            // name={chordName} 
                            // isPiano={instrument.name == "Piano"}
                        />
                        <div className="flex justify-center gap-3 mt-1 text-base">
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
                ) : (<span className="flex justify-center text-base">Hợp âm không được hỗ trợ!</span>)}
                
            </div>
        )
    return (
        <span
            ref={chordRef}
            className="relative inline-block cursor-pointer"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <span className="text-red-500 font-semibold hover:text-red-600 transition-colors">[{chordName}]</span>
            {
                hovered && (
                <div 
                    className="w-56 bg-white border-2 border-gray-200 rounded-lg shadow-xl p-3
                    flex flex-col justify-center items-center z-[9999]
                    animate-in fade-in slide-in-from-bottom-2 duration-200"
                    style={{ 
                        position: 'fixed',
                        top: `${popupPosition.top}px`,
                        left: `${popupPosition.left}px`,
                        transform: 'translate(-50%, -100%)'
                    }}
                    onMouseEnter={handlePopupMouseEnter}
                    onMouseLeave={handlePopupMouseLeave}
                >
                    {chordPositions != null ? (
                        <div className="flex flex-col items-center w-full">
                            <span className="text-base font-bold text-gray-800 mb-2">{chordName}</span>
                            <div className="mb-2">
                                <Chord
                                    chord={chordPositions[voicingIndex]} 
                                    instrument={instrument} 
                                    lite={false}
                                />
                            </div>
                            <div className="flex justify-center items-center gap-3 w-full bg-gray-50 rounded px-2 py-1.5">
                                <button 
                                    onClick={getPrevVoicing}
                                    className="px-2.5 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-100 hover:border-gray-400 transition-colors"
                                    disabled={chordPositions.length <= 1}
                                >
                                    ◀
                                </button>
                                <span className="text-sm font-medium text-gray-600 min-w-[2.5rem] text-center">
                                    {voicingIndex + 1}/{chordPositions.length}
                                </span>
                                <button
                                    onClick={getNextVoicing}
                                    className="px-2.5 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-100 hover:border-gray-400 transition-colors"
                                    disabled={chordPositions.length <= 1}
                                >
                                    ▶
                                </button>
                            </div>
                        </div>
                    ) : (
                        <span className="flex justify-center text-sm text-gray-600 py-3">Hợp âm không được hỗ trợ!</span>
                    )}
                    {/* Triangle pointer */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
                        <div className="w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent border-t-gray-200"></div>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[1px] w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-transparent border-t-white"></div>
                    </div>
                </div>
                )
            }
        </span>
    )
}

export default HoverChord;