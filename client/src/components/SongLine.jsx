import HoverChord from "./HoverChord";
import { transposeChord } from "../utils/TransposeUtils";

function parseChordLyrics(line) {
  const regex = /\[([A-G][#b]?m?(?:maj|min|dim|aug|sus|add)?\d*(?:\/[A-G][#b]?)?)\]/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", value: line.slice(lastIndex, match.index) });
    }
    parts.push({ type: "chord", value: match[1] });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < line.length) {
    parts.push({ type: "text", value: line.slice(lastIndex) });
  }

  return parts;
}

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