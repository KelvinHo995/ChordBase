import HoverChord from "./HoverChord";
import { transposeChord } from "../utils/TransposeUtils";

const SongLine = ({ line, semitones, preferSharps, compact = false }) => {
//   const tokens = parseChordLyrics(line);
    const parts = line.split(/(\[[^\]]+\])/g);

    return (
        <div className={`leading-relaxed break-words ${compact ? 'text-base py-1 px-0' : 'text-xl py-2 px-5'}`}>
            {parts.map((part, i) => {
                if (part.startsWith("[") && part.endsWith("]")) {
                    const rawChord = part.slice(1, -1);
                    const transposed = transposeChord(rawChord, semitones, preferSharps);
                    return <HoverChord key={i} chordName={transposed} />;
                } 
                else {
                    return <span key={i}>{part}</span>;
                }
            })}
        </div>
    );
}

export default SongLine;