export type NoteSharp = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B'

export type Accidental = 'sharp' | 'flat'
export type Handedness = 'right' | 'left'
export type PatternMode = 'scale' | 'chord' | 'arpeggio' | 'free' | 'identify'
export type DisplayMode = 'note_names' | 'intervals' | 'degrees' | 'numbers'

export type ScaleType =
  | 'major' | 'minor'
  | 'pentatonic_major' | 'pentatonic_minor'
  | 'blues'
  | 'dorian' | 'phrygian' | 'lydian' | 'mixolydian' | 'locrian'
  | 'harmonic_minor' | 'melodic_minor'
  | 'chromatic'

export type ChordType =
  | 'maj' | 'min' | 'dim' | 'aug'
  | 'maj7' | 'min7' | 'dom7' | 'dim7' | 'm7b5'
  | 'maj9' | 'min9' | 'dom9'
  | 'sus2' | 'sus4' | 'add9' | 'power'

export type ArpeggioType =
  | 'maj' | 'min' | 'maj7' | 'min7' | 'dom7' | 'dim' | 'aug' | 'sus2' | 'sus4'

export interface FretCell {
  string: number  // 0 = low E
  fret: number    // 0 = open
}

export type CellCategory = 'root' | 'in_pattern' | 'user_selected' | 'none'

export interface CellData extends FretCell {
  noteIndex: number
  noteName: NoteSharp
  displayLabel: string
  category: CellCategory
  isRoot: boolean
}

export type FretGrid = CellData[][]  // [string][fret]

export interface TuningPreset {
  name: string
  notes: NoteSharp[]
}

export interface ScalePosition {
  position: 1 | 2 | 3 | 4 | 5
  cagedShape: 'C' | 'A' | 'G' | 'E' | 'D'
  lowestFret: number
  highestFret: number
  cells: FretCell[]
}

export interface ChordMatch {
  root: NoteSharp
  type: ChordType
  name: string
  inversion: number
  bassNote: NoteSharp
}
