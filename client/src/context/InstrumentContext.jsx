import { useContext, createContext, useState } from "react";
import guitarChords from '@tombatossals/chords-db/lib/guitar.json';
import ukuleleChords from '@tombatossals/chords-db/lib/ukulele.json';
import pianoChords from '@tombatossals/chords-db/lib/piano.json';

const InstrumentContext = createContext();

export const useInstrument = () => useContext(InstrumentContext);

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

export function InstrumentProvider({ children }) {
    const [instrument, setInstrument] = useState(instruments["guitar"])

    const handleInstrumentChange = (value) => {
        setInstrument(instrument => instruments[value])
        console.log(instrument)
    }

    return (
        <InstrumentContext.Provider value={{ instrument, setInstrument, handleInstrumentChange }}>
            {children}
        </InstrumentContext.Provider>
    )
}