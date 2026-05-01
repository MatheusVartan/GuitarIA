import {
  SHARPS, SCALE_INTERVALS, CHORD_INTERVALS, ARPEGGIO_INTERVALS,
  noteIndex, getScalePositions, identifyChord, getIntervalName, getScaleDegree,
} from './MusicTheory'
import type {
  NoteSharp, CellData, FretGrid, PatternMode, DisplayMode,
  ScaleType, ChordType, ArpeggioType, Handedness, FretCell,
  ScalePosition, ChordMatch, TuningPreset,
} from './types'

export const TUNING_PRESETS: TuningPreset[] = [
  { name: 'Standard (EADGBe)',     notes: ['E', 'A', 'D', 'G', 'B', 'E'] },
  { name: 'Drop D (DADGBe)',        notes: ['D', 'A', 'D', 'G', 'B', 'E'] },
  { name: 'Open G (DGDGBd)',        notes: ['D', 'G', 'D', 'G', 'B', 'D'] },
  { name: 'Open D (DADf#Ad)',       notes: ['D', 'A', 'D', 'F#', 'A', 'D'] },
  { name: 'Open E (EBE G#Be)',      notes: ['E', 'B', 'E', 'G#', 'B', 'E'] },
  { name: 'DADGAD',                 notes: ['D', 'A', 'D', 'G', 'A', 'D'] },
  { name: 'Half-step down (Eb)',    notes: ['D#', 'G#', 'C#', 'F#', 'A#', 'D#'] },
  { name: 'Full-step down (D)',     notes: ['D', 'G', 'C', 'F', 'A', 'D'] },
]

const TOTAL_FRETS = 22

export class FretboardEngine {
  root: NoteSharp = 'A'
  patternMode: PatternMode = 'scale'
  scaleType: ScaleType = 'pentatonic_minor'
  chordType: ChordType = 'min'
  arpeggioType: ArpeggioType = 'min'
  displayMode: DisplayMode = 'note_names'
  position: 1 | 2 | 3 | 4 | 5 | 'all' = 'all'
  capo: number = 0
  tuning: NoteSharp[] = [...TUNING_PRESETS[0].notes]
  handedness: Handedness = 'right'
  userSelectedCells: Set<string> = new Set()

  // ─── Grid Computation ──────────────────────────────────────────────────────

  computeGrid(): FretGrid {
    const patternNoteIndices = this._getPatternNoteIndices()
    const rootIdx = noteIndex(this.root)
    const positions = this._getActivePositionCells()

    const grid: FretGrid = []

    for (let s = 0; s < 6; s++) {
      const row: CellData[] = []
      const openNoteIdx = noteIndex(this.tuning[s])

      for (let f = 0; f <= TOTAL_FRETS; f++) {
        const actualFret = f + this.capo
        const noteIdx = (openNoteIdx + actualFret) % 12
        const noteName = SHARPS[noteIdx]
        const interval = (noteIdx - rootIdx + 12) % 12
        const isRoot = noteIdx === rootIdx
        const key = `${s}-${f}`
        const userSelected = this.userSelectedCells.has(key)
        const inPattern = patternNoteIndices.has(noteIdx)
        const inPosition = positions === null || positions.has(key)

        let category: CellData['category'] = 'none'
        if (userSelected) {
          category = 'user_selected'
        } else if (inPattern && inPosition) {
          category = isRoot ? 'root' : 'in_pattern'
        }

        const displayLabel = this._getDisplayLabel(noteName, interval, s, f)

        row.push({ string: s, fret: f, noteIndex: noteIdx, noteName, displayLabel, category, isRoot })
      }
      grid.push(row)
    }

    return grid
  }

  private _getPatternNoteIndices(): Set<number> {
    const rootIdx = noteIndex(this.root)
    let intervals: number[] = []

    if (this.patternMode === 'scale') {
      intervals = SCALE_INTERVALS[this.scaleType] ?? []
    } else if (this.patternMode === 'chord') {
      intervals = CHORD_INTERVALS[this.chordType] ?? []
    } else if (this.patternMode === 'arpeggio') {
      intervals = ARPEGGIO_INTERVALS[this.arpeggioType] ?? []
    } else if (this.patternMode === 'free') {
      // free mode — show every note on the neck
      return new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
    } else {
      // identify mode — blank fretboard, user taps to select
      return new Set()
    }

    return new Set(intervals.map(i => (rootIdx + i % 12) % 12))
  }

  private _getActivePositionCells(): Set<string> | null {
    if (this.position === 'all' || this.patternMode !== 'scale') return null

    const positions = getScalePositions(this.root, this.scaleType, this.tuning, TOTAL_FRETS)
    const pos = positions.find(p => p.position === this.position)
    if (!pos) return null

    return new Set(pos.cells.map(c => `${c.string}-${c.fret}`))
  }

  private _getDisplayLabel(noteName: NoteSharp, interval: number, _s: number, f: number): string {
    switch (this.displayMode) {
      case 'note_names': return noteName
      case 'intervals':  return getIntervalName(interval)
      case 'degrees':    return getScaleDegree(interval, this.scaleType)
      case 'numbers':    return String(f)
      default:           return noteName
    }
  }

  // ─── Position Info ────────────────────────────────────────────────────────

  getScalePositions(): ScalePosition[] {
    if (this.patternMode !== 'scale') return []
    return getScalePositions(this.root, this.scaleType, this.tuning, TOTAL_FRETS)
  }

  // ─── Chord Finder (from user-selected cells) ──────────────────────────────

  getChordMatches(): ChordMatch[] {
    if (this.userSelectedCells.size < 2) return []

    const notes = new Set<NoteSharp>()
    for (const key of this.userSelectedCells) {
      const [s, f] = key.split('-').map(Number)
      const openNoteIdx = noteIndex(this.tuning[s])
      const noteIdx = (openNoteIdx + f + this.capo) % 12
      notes.add(SHARPS[noteIdx])
    }

    return identifyChord([...notes])
  }

  // ─── Interaction ──────────────────────────────────────────────────────────

  toggleUserSelected(cell: FretCell): void {
    const key = `${cell.string}-${cell.fret}`
    if (this.userSelectedCells.has(key)) {
      this.userSelectedCells.delete(key)
    } else {
      this.userSelectedCells.add(key)
    }
  }

  clearUserSelected(): void {
    this.userSelectedCells.clear()
  }

  // ─── Note lookup (for audio) ──────────────────────────────────────────────

  getNoteForCell(cell: FretCell): { name: NoteSharp; octave: number; midi: number } {
    // MIDI base values for standard open strings (low to high)
    const MIDI_OPEN = [40, 45, 50, 55, 59, 64] // E2, A2, D3, G3, B3, E4

    // Adjust for tuning
    const standardOpen: NoteSharp[] = ['E', 'A', 'D', 'G', 'B', 'E']
    const tuningOffset = noteIndex(this.tuning[cell.string]) - noteIndex(standardOpen[cell.string])
    const midiNote = MIDI_OPEN[cell.string] + tuningOffset + cell.fret + this.capo

    const noteIdx = midiNote % 12
    const octave = Math.floor(midiNote / 12) - 1

    return { name: SHARPS[noteIdx], octave, midi: midiNote }
  }
}
