// --- Notes and key logic ---
export const sharpNotes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
export const flatNotes  = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

export const sharpKeys = ["C", "G", "D", "A", "E", "B", "F#"];
export const flatKeys  = ["F", "Bb", "Eb", "Ab", "Db", "Gb"];

// --- Decide notation ---
export function shouldUseSharps(key) {
    if (sharpKeys.includes(key)) return true;
    if (flatKeys.includes(key)) return false;
    return true; // fallback
}

// --- Transpose a single chord ---
export function transposeChord(chord, semitones, preferSharps = true) {
    const match = chord.match(/^([A-G][b#]?)(.*)$/);
    if (!match) return chord;

    const [, root, suffix] = match;
    const index = sharpNotes.indexOf(root) !== -1 ? sharpNotes.indexOf(root) : flatNotes.indexOf(root);

    if (index === -1) return chord;

    const newIndex = (index + semitones + 12) % 12;
    const note = preferSharps ? sharpNotes[newIndex] : flatNotes[newIndex];
    return note + suffix;
}

export function getTransposedKey(key, semitones) {
    const baseIndex = sharpNotes.indexOf(key) !== -1 ? sharpNotes.indexOf(key) : flatNotes.indexOf(key);
    if (baseIndex === -1) return key;

    const newIndex = (baseIndex + semitones + 12) % 12;
    const preferSharps = shouldUseSharps(key);
    return preferSharps ? sharpNotes[newIndex] : flatNotes[newIndex];
}
