// Comprehensive Scale, Mode, and Chord Music Theory Engine

export type Note = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

export type ScaleCategory = 'standard' | 'pentatonic' | 'modes' | 'jazz_exotic';

export type ScaleType =
  // Standard
  | 'major'
  | 'minor'
  | 'harmonicMinor'
  | 'melodicMinor'
  // Pentatonic & Blues
  | 'majorPentatonic'
  | 'minorPentatonic'
  | 'blues'
  | 'majorBlues'
  // Modes of Major Scale
  | 'ionian'
  | 'dorian'
  | 'phrygian'
  | 'lydian'
  | 'mixolydian'
  | 'aeolian'
  | 'locrian'
  // Jazz & Exotic
  | 'bebop'
  | 'bebopMajor'
  | 'wholeTone'
  | 'diminishedHalfWhole'
  | 'diminishedWholeHalf'
  | 'hungarianMinor'
  | 'phrygianDominant'
  | 'japanese'
  | 'doubleHarmonic';

export interface ScaleDefinition {
  name: string;
  category: ScaleCategory;
  intervals: number[]; // semitones from root
  formula: string[]; // 1, b3, 5, etc.
  stepPattern: string; // W-W-H...
  description: string;
  mood: string;
}

export const scaleDefinitions: Record<ScaleType, ScaleDefinition> = {
  // Standard
  major: {
    name: 'Major (Ionian)',
    category: 'standard',
    intervals: [0, 2, 4, 5, 7, 9, 11],
    formula: ['1', '2', '3', '4', '5', '6', '7'],
    stepPattern: 'W-W-H-W-W-W-H',
    description: 'The foundation of Western music theory. Bright, joyful, and stable.',
    mood: 'Happy & Triumphant',
  },
  minor: {
    name: 'Natural Minor (Aeolian)',
    category: 'standard',
    intervals: [0, 2, 3, 5, 7, 8, 10],
    formula: ['1', '2', '♭3', '4', '5', '♭6', '♭7'],
    stepPattern: 'W-H-W-W-H-W-W',
    description: 'The primary minor scale. Melancholic, emotional, and contemplative.',
    mood: 'Sad & Reflective',
  },
  harmonicMinor: {
    name: 'Harmonic Minor',
    category: 'standard',
    intervals: [0, 2, 3, 5, 7, 8, 11],
    formula: ['1', '2', '♭3', '4', '5', '♭6', '7'],
    stepPattern: 'W-H-W-W-H-(W+H)-H',
    description: 'Minor scale with a raised 7th degree, creating a dramatic, classical tension.',
    mood: 'Dramatic & Classical',
  },
  melodicMinor: {
    name: 'Melodic Minor',
    category: 'standard',
    intervals: [0, 2, 3, 5, 7, 9, 11],
    formula: ['1', '2', '♭3', '4', '5', '6', '7'],
    stepPattern: 'W-H-W-W-W-W-H',
    description: 'Minor scale with raised 6th and 7th degrees. Smooth and jazzy.',
    mood: 'Sophisticated & Fluid',
  },

  // Pentatonic & Blues
  majorPentatonic: {
    name: 'Major Pentatonic',
    category: 'pentatonic',
    intervals: [0, 2, 4, 7, 9],
    formula: ['1', '2', '3', '5', '6'],
    stepPattern: 'W-W-(W+H)-W-(W+H)',
    description: '5-note scale without half-step dissonance. Universal in folk, pop, and country.',
    mood: 'Uplifting & Sweet',
  },
  minorPentatonic: {
    name: 'Minor Pentatonic',
    category: 'pentatonic',
    intervals: [0, 3, 5, 7, 10],
    formula: ['1', '♭3', '4', '5', '♭7'],
    stepPattern: '(W+H)-W-W-(W+H)-W',
    description: 'Essential rock and blues scale. Very powerful and easy to solo with.',
    mood: 'Soulful & Energetic',
  },
  blues: {
    name: 'Blues Scale',
    category: 'pentatonic',
    intervals: [0, 3, 5, 6, 7, 10],
    formula: ['1', '♭3', '4', '♭5', '5', '♭7'],
    stepPattern: '(W+H)-W-H-H-(W+H)-W',
    description: 'Minor pentatonic with added diminished fifth ("blue note"). Authentic blues feel.',
    mood: 'Gritty & Expressive',
  },
  majorBlues: {
    name: 'Major Blues',
    category: 'pentatonic',
    intervals: [0, 2, 3, 4, 7, 9],
    formula: ['1', '2', '♭3', '3', '5', '6'],
    stepPattern: 'W-H-H-(W+H)-W-(W+H)',
    description: 'Major pentatonic with passing flat 3rd. Upbeat blues and gospel vibe.',
    mood: 'Joyful & Country Blues',
  },

  // Modes
  ionian: {
    name: 'Ionian (1st Mode)',
    category: 'modes',
    intervals: [0, 2, 4, 5, 7, 9, 11],
    formula: ['1', '2', '3', '4', '5', '6', '7'],
    stepPattern: 'W-W-H-W-W-W-H',
    description: 'First mode of the major scale. Clear, bright, resolved.',
    mood: 'Bright & Open',
  },
  dorian: {
    name: 'Dorian (2nd Mode)',
    category: 'modes',
    intervals: [0, 2, 3, 5, 7, 9, 10],
    formula: ['1', '2', '♭3', '4', '5', '6', '♭7'],
    stepPattern: 'W-H-W-W-W-H-W',
    description: 'Minor scale with a raised 6th. Famous in funk, jazz (Miles Davis), and rock.',
    mood: 'Groovy & Hopeful Minor',
  },
  phrygian: {
    name: 'Phrygian (3rd Mode)',
    category: 'modes',
    intervals: [0, 1, 3, 5, 7, 8, 10],
    formula: ['1', '♭2', '♭3', '4', '5', '♭6', '♭7'],
    stepPattern: 'H-W-W-W-H-W-W',
    description: 'Minor scale with a flat 2nd. Distinctive Spanish flamenco and heavy metal sound.',
    mood: 'Dark & Exotic',
  },
  lydian: {
    name: 'Lydian (4th Mode)',
    category: 'modes',
    intervals: [0, 2, 4, 6, 7, 9, 11],
    formula: ['1', '2', '3', '♯4', '5', '6', '7'],
    stepPattern: 'W-W-W-H-W-W-H',
    description: 'Major scale with a sharp 4th. Dreamy, magical, sci-fi and film score favorite.',
    mood: 'Dreamy & Ethereal',
  },
  mixolydian: {
    name: 'Mixolydian (5th Mode)',
    category: 'modes',
    intervals: [0, 2, 4, 5, 7, 9, 10],
    formula: ['1', '2', '3', '4', '5', '6', '♭7'],
    stepPattern: 'W-W-H-W-W-H-W',
    description: 'Major scale with flat 7th. The quintessential classic rock and dominant 7th scale.',
    mood: 'Heroic & Bluesy Major',
  },
  aeolian: {
    name: 'Aeolian (6th Mode)',
    category: 'modes',
    intervals: [0, 2, 3, 5, 7, 8, 10],
    formula: ['1', '2', '♭3', '4', '5', '♭6', '♭7'],
    stepPattern: 'W-H-W-W-H-W-W',
    description: 'Natural minor scale. The foundation of rock and pop ballads.',
    mood: 'Moody & Nostalgic',
  },
  locrian: {
    name: 'Locrian (7th Mode)',
    category: 'modes',
    intervals: [0, 1, 3, 5, 6, 8, 10],
    formula: ['1', '♭2', '♭3', '4', '♭5', '♭6', '♭7'],
    stepPattern: 'H-W-W-H-W-W-W',
    description: 'Contains diminished 5th. Highly unstable and tense, used in intense metal and jazz.',
    mood: 'Tense & Unresolved',
  },

  // Jazz & Exotic
  bebop: {
    name: 'Bebop Dominant',
    category: 'jazz_exotic',
    intervals: [0, 2, 4, 5, 7, 9, 10, 11],
    formula: ['1', '2', '3', '4', '5', '6', '♭7', '7'],
    stepPattern: 'W-W-H-W-W-H-H-H',
    description: 'Mixolydian with added natural 7th chromatic passing tone for smooth jazz runs.',
    mood: 'Fast & Jazzy',
  },
  bebopMajor: {
    name: 'Bebop Major',
    category: 'jazz_exotic',
    intervals: [0, 2, 4, 5, 7, 8, 9, 11],
    formula: ['1', '2', '3', '4', '5', '♯5', '6', '7'],
    stepPattern: 'W-W-H-W-H-H-W-H',
    description: 'Major scale with an added chromatic passing tone between 5th and 6th degrees.',
    mood: 'Swinging & Sophisticated',
  },
  wholeTone: {
    name: 'Whole Tone',
    category: 'jazz_exotic',
    intervals: [0, 2, 4, 6, 8, 10],
    formula: ['1', '2', '3', '♯4', '♯5', '♭7'],
    stepPattern: 'W-W-W-W-W-W',
    description: 'Constructed entirely of whole steps. Impressionistic, dream sequence sound.',
    mood: 'Floating & Mysterious',
  },
  diminishedHalfWhole: {
    name: 'Diminished (Half-Whole)',
    category: 'jazz_exotic',
    intervals: [0, 1, 3, 4, 6, 7, 9, 10],
    formula: ['1', '♭2', '♭3', '3', '♯4', '5', '6', '♭7'],
    stepPattern: 'H-W-H-W-H-W-H-W',
    description: 'Octatonic symmetrical scale for dominant 7th flat 9 chords in jazz.',
    mood: 'Intricate & Complex',
  },
  diminishedWholeHalf: {
    name: 'Diminished (Whole-Half)',
    category: 'jazz_exotic',
    intervals: [0, 2, 3, 5, 6, 8, 9, 11],
    formula: ['1', '2', '♭3', '4', '♭5', '♭6', '6', '7'],
    stepPattern: 'W-H-W-H-W-H-W-H',
    description: 'Octatonic symmetrical scale played over diminished chords.',
    mood: 'Dark & Symmetrical',
  },
  hungarianMinor: {
    name: 'Hungarian Minor',
    category: 'jazz_exotic',
    intervals: [0, 2, 3, 6, 7, 8, 11],
    formula: ['1', '2', '♭3', '♯4', '5', '♭6', '7'],
    stepPattern: 'W-H-(W+H)-H-H-(W+H)-H',
    description: 'Double harmonic minor with raised 4th and 7th. Intense gypsy violin flavor.',
    mood: 'Mystical & Fiery',
  },
  phrygianDominant: {
    name: 'Phrygian Dominant (Spanish Gypsy)',
    category: 'jazz_exotic',
    intervals: [0, 1, 4, 5, 7, 8, 10],
    formula: ['1', '♭2', '3', '4', '5', '♭6', '♭7'],
    stepPattern: 'H-(W+H)-H-W-H-W-W',
    description: '5th mode of harmonic minor. Traditional in flamenco, Middle Eastern, and metal.',
    mood: 'Flamenco & Middle Eastern',
  },
  japanese: {
    name: 'Japanese (Hirajoshi)',
    category: 'jazz_exotic',
    intervals: [0, 2, 3, 7, 8],
    formula: ['1', '2', '♭3', '5', '♭6'],
    stepPattern: 'W-H-(2W)-H-(2W)',
    description: 'Traditional Japanese pentatonic scale with serene and tranquil qualities.',
    mood: 'Serene & Oriental',
  },
  doubleHarmonic: {
    name: 'Double Harmonic (Arabic / Byzantine)',
    category: 'jazz_exotic',
    intervals: [0, 1, 4, 5, 7, 8, 11],
    formula: ['1', '♭2', '3', '4', '5', '♭6', '7'],
    stepPattern: 'H-(W+H)-H-W-H-(W+H)-H',
    description: 'Major scale with flat 2nd and flat 6th. Deep Arabic & Mediterranean sound.',
    mood: 'Hypnotic & Cinematic',
  },
};

export const allNotes: Note[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const flatEquivalents: Record<string, string> = {
  'C#': 'D♭',
  'D#': 'E♭',
  'F#': 'G♭',
  'G#': 'A♭',
  'A#': 'B♭',
};

export const sharpEquivalents: Record<string, string> = {
  'Db': 'C#',
  'Eb': 'D#',
  'Gb': 'F#',
  'Ab': 'G#',
  'Bb': 'A#',
};

export const solfegeMap: Record<number, string> = {
  0: 'Do',
  1: 'Ra',
  2: 'Re',
  3: 'Me',
  4: 'Mi',
  5: 'Fa',
  6: 'Se',
  7: 'Sol',
  8: 'Le',
  9: 'La',
  10: 'Te',
  11: 'Ti',
};

// Scale names map
export const scaleNames: Record<ScaleType, string> = Object.fromEntries(
  Object.entries(scaleDefinitions).map(([k, v]) => [k, v.name])
) as Record<ScaleType, string>;

// Scale categories grouping
export const scaleCategories: Record<ScaleCategory, { label: string; scales: ScaleType[] }> = {
  standard: {
    label: 'Standard Scales',
    scales: ['major', 'minor', 'harmonicMinor', 'melodicMinor'],
  },
  pentatonic: {
    label: 'Pentatonic & Blues',
    scales: ['majorPentatonic', 'minorPentatonic', 'blues', 'majorBlues'],
  },
  modes: {
    label: 'Modes of Major Scale',
    scales: ['ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian'],
  },
  jazz_exotic: {
    label: 'Jazz & Exotic Scales',
    scales: [
      'bebop',
      'bebopMajor',
      'phrygianDominant',
      'hungarianMinor',
      'doubleHarmonic',
      'japanese',
      'wholeTone',
      'diminishedHalfWhole',
      'diminishedWholeHalf',
    ],
  },
};

// Display note helper (supports flat/sharp preference)
export function displayNote(note: string, useFlats = false): string {
  if (note.includes('#')) {
    if (useFlats) {
      return flatEquivalents[note] || note;
    }
    return note.replace('#', '♯');
  }
  return note;
}

// Generate notes in a scale
export function generateScale(rootNote: Note, scaleType: ScaleType): Note[] {
  const rootIndex = allNotes.indexOf(rootNote);
  const intervals = scaleDefinitions[scaleType]?.intervals || [0, 2, 4, 5, 7, 9, 11];

  return intervals.map((interval) => {
    const noteIndex = (rootIndex + interval) % 12;
    return allNotes[noteIndex];
  });
}

// Check if note is in scale
export function isNoteInScale(note: Note, scale: Note[]): boolean {
  return scale.includes(note);
}

// Get scale degree of a note in the scale
export function getScaleDegreeInfo(note: Note, rootNote: Note, scaleType: ScaleType): {
  degreeIndex: number;
  degreeLabel: string;
  solfege: string;
  intervalSemitones: number;
} | null {
  const rootIndex = allNotes.indexOf(rootNote);
  const noteIndex = allNotes.indexOf(note);
  if (rootIndex === -1 || noteIndex === -1) return null;

  const semitones = (noteIndex - rootIndex + 12) % 12;
  const def = scaleDefinitions[scaleType];
  if (!def) return null;
  const idx = def.intervals.indexOf(semitones);

  if (idx === -1) return null;

  return {
    degreeIndex: idx + 1,
    degreeLabel: def.formula[idx] || `${idx + 1}`,
    solfege: solfegeMap[semitones] || '',
    intervalSemitones: semitones,
  };
}

// Format note with musical sharp symbol
export function formatNote(note: Note): string {
  return note.replace('#', '♯');
}

// ----------------------------------------------------
// Chords & Diatonic Harmony
// ----------------------------------------------------

export type ChordType =
  | 'maj'
  | 'min'
  | 'dim'
  | 'aug'
  | 'sus2'
  | 'sus4'
  | '7'
  | 'maj7'
  | 'min7'
  | 'min7b5'
  | 'dim7'
  | 'add9'
  | '9';

export interface ChordDefinition {
  name: string;
  symbol: string;
  intervals: number[];
  formula: string;
}

export const chordDefinitions: Record<ChordType, ChordDefinition> = {
  maj: { name: 'Major', symbol: 'maj', intervals: [0, 4, 7], formula: '1 - 3 - 5' },
  min: { name: 'Minor', symbol: 'm', intervals: [0, 3, 7], formula: '1 - ♭3 - 5' },
  dim: { name: 'Diminished', symbol: 'dim', intervals: [0, 3, 6], formula: '1 - ♭3 - ♭5' },
  aug: { name: 'Augmented', symbol: 'aug', intervals: [0, 4, 8], formula: '1 - 3 - ♯5' },
  sus2: { name: 'Suspended 2nd', symbol: 'sus2', intervals: [0, 2, 7], formula: '1 - 2 - 5' },
  sus4: { name: 'Suspended 4th', symbol: 'sus4', intervals: [0, 5, 7], formula: '1 - 4 - 5' },
  '7': { name: 'Dominant 7th', symbol: '7', intervals: [0, 4, 7, 10], formula: '1 - 3 - 5 - ♭7' },
  maj7: { name: 'Major 7th', symbol: 'maj7', intervals: [0, 4, 7, 11], formula: '1 - 3 - 5 - 7' },
  min7: { name: 'Minor 7th', symbol: 'm7', intervals: [0, 3, 7, 10], formula: '1 - ♭3 - 5 - ♭7' },
  min7b5: { name: 'Half-Diminished', symbol: 'm7♭5', intervals: [0, 3, 6, 10], formula: '1 - ♭3 - ♭5 - ♭7' },
  dim7: { name: 'Diminished 7th', symbol: 'dim7', intervals: [0, 3, 6, 9], formula: '1 - ♭3 - ♭5 - 𝄫7' },
  add9: { name: 'Add 9', symbol: 'add9', intervals: [0, 4, 7, 14], formula: '1 - 3 - 5 - 9' },
  '9': { name: 'Dominant 9th', symbol: '9', intervals: [0, 4, 7, 10, 14], formula: '1 - 3 - 5 - ♭7 - 9' },
};

export function generateChordNotes(rootNote: Note, chordType: ChordType): Note[] {
  const rootIndex = allNotes.indexOf(rootNote);
  const intervals = chordDefinitions[chordType].intervals;

  return intervals.map((interval) => {
    const noteIndex = (rootIndex + interval) % 12;
    return allNotes[noteIndex];
  });
}

// Diatonic Chords for Major and Natural Minor
export interface DiatonicChord {
  roman: string;
  degreeName: string;
  root: Note;
  chordType: ChordType;
  fullName: string;
  notes: Note[];
}

export function getDiatonicChords(rootNote: Note, scaleType: ScaleType): DiatonicChord[] {
  const scaleNotes = generateScale(rootNote, scaleType);
  if (scaleNotes.length < 7) return [];

  // Diatonic triads for Major and Minor
  const isMajor = scaleType === 'major' || scaleType === 'ionian' || scaleType === 'lydian' || scaleType === 'mixolydian';
  
  const majorNumerals = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];
  const majorTypes: ChordType[] = ['maj', 'min', 'min', 'maj', 'maj', 'min', 'dim'];
  const degreeNames = ['Tonic', 'Supertonic', 'Mediant', 'Subdominant', 'Dominant', 'Submediant', 'Leading Tone'];

  const minorNumerals = ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'];
  const minorTypes: ChordType[] = ['min', 'dim', 'maj', 'min', 'min', 'maj', 'maj'];

  const numerals = isMajor ? majorNumerals : minorNumerals;
  const types = isMajor ? majorTypes : minorTypes;

  return scaleNotes.slice(0, 7).map((note, index) => {
    const type = types[index] || 'maj';
    return {
      roman: numerals[index] || `${index + 1}`,
      degreeName: degreeNames[index] || `Degree ${index + 1}`,
      root: note,
      chordType: type,
      fullName: `${displayNote(note)} ${chordDefinitions[type].symbol}`,
      notes: generateChordNotes(note, type),
    };
  });
}

// ----------------------------------------------------
// Circle of Fifths Data
// ----------------------------------------------------

export interface CircleKey {
  major: Note;
  minor: Note;
  accidentals: string;
  accidentalCount: number;
  isSharp: boolean;
  angleDeg: number;
}

export const circleOfFifthsData: CircleKey[] = [
  { major: 'C', minor: 'A', accidentals: 'Natural (0)', accidentalCount: 0, isSharp: true, angleDeg: 0 },
  { major: 'G', minor: 'E', accidentals: '1♯ (F♯)', accidentalCount: 1, isSharp: true, angleDeg: 30 },
  { major: 'D', minor: 'B', accidentals: '2♯ (F♯, C♯)', accidentalCount: 2, isSharp: true, angleDeg: 60 },
  { major: 'A', minor: 'F#', accidentals: '3♯ (F♯, C♯, G♯)', accidentalCount: 3, isSharp: true, angleDeg: 90 },
  { major: 'E', minor: 'C#', accidentals: '4♯ (F♯, C♯, G♯, D♯)', accidentalCount: 4, isSharp: true, angleDeg: 120 },
  { major: 'B', minor: 'G#', accidentals: '5♯ (F♯, C♯, G♯, D♯, A♯)', accidentalCount: 5, isSharp: true, angleDeg: 150 },
  { major: 'F#', minor: 'D#', accidentals: '6♯ (F♯, C♯, G♯, D♯, A♯, E♯)', accidentalCount: 6, isSharp: true, angleDeg: 180 },
  { major: 'C#', minor: 'A#', accidentals: '7♯ / 5♭', accidentalCount: 7, isSharp: true, angleDeg: 210 },
  { major: 'G#', minor: 'F', accidentals: '4♭ (B♭, E♭, A♭, D♭)', accidentalCount: 4, isSharp: false, angleDeg: 240 },
  { major: 'D#', minor: 'C', accidentals: '3♭ (B♭, E♭, A♭)', accidentalCount: 3, isSharp: false, angleDeg: 270 },
  { major: 'A#', minor: 'G', accidentals: '2♭ (B♭, E♭)', accidentalCount: 2, isSharp: false, angleDeg: 300 },
  { major: 'F', minor: 'D', accidentals: '1♭ (B♭)', accidentalCount: 1, isSharp: false, angleDeg: 330 },
];
