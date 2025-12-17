import HoverChord from "./HoverChord";
import { transposeChord } from "../utils/TransposeUtils";

const SongLine = ({ line, semitones, preferSharps }) => {
//   const tokens = parseChordLyrics(line);
    const parts = line.split(/(\[[^\]]+\])/g);

    return (
        <div className="leading-relaxed text-lg py-2 px-5">
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