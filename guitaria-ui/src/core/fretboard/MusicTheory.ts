import type { NoteSharp, ScaleType, ChordType, ArpeggioType, ScalePosition, ChordMatch, FretCell } from './types'

// ─── Chromatic Scale ─────────────────────────────────────────────────────────

export const SHARPS: NoteSharp[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
export const FLATS =               ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']

export const ENHARMONIC: Record<string, NoteSharp> = {
  'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#',
}

export function toSharp(note: string): NoteSharp {
  return (ENHARMONIC[note] ?? note) as NoteSharp
}

export function noteIndex(note: string): number {
  return SHARPS.indexOf(toSharp(note))
}

// ─── Scale Intervals ──────────────────────────────────────────────────────────

export const SCALE_INTERVALS: Record<ScaleType, number[]> = {
  major:            [0, 2, 4, 5, 7, 9, 11],
  minor:            [0, 2, 3, 5, 7, 8, 10],
  pentatonic_major: [0, 2, 4, 7, 9],
  pentatonic_minor: [0, 3, 5, 7, 10],
  blues:            [0, 3, 5, 6, 7, 10],
  dorian:           [0, 2, 3, 5, 7, 9, 10],
  phrygian:         [0, 1, 3, 5, 7, 8, 10],
  lydian:           [0, 2, 4, 6, 7, 9, 11],
  mixolydian:       [0, 2, 4, 5, 7, 9, 10],
  locrian:          [0, 1, 3, 5, 6, 8, 10],
  harmonic_minor:   [0, 2, 3, 5, 7, 8, 11],
  melodic_minor:    [0, 2, 3, 5, 7, 9, 11],
  chromatic:        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
}

// ─── Chord Intervals ──────────────────────────────────────────────────────────

export const CHORD_INTERVALS: Record<ChordType, number[]> = {
  maj:   [0, 4, 7],
  min:   [0, 3, 7],
  dim:   [0, 3, 6],
  aug:   [0, 4, 8],
  maj7:  [0, 4, 7, 11],
  min7:  [0, 3, 7, 10],
  dom7:  [0, 4, 7, 10],
  dim7:  [0, 3, 6, 9],
  m7b5:  [0, 3, 6, 10],
  maj9:  [0, 4, 7, 11, 14],
  min9:  [0, 3, 7, 10, 14],
  dom9:  [0, 4, 7, 10, 14],
  sus2:  [0, 2, 7],
  sus4:  [0, 5, 7],
  add9:  [0, 4, 7, 14],
  power: [0, 7],
}

// ─── Arpeggio Intervals ───────────────────────────────────────────────────────

export const ARPEGGIO_INTERVALS: Record<ArpeggioType, number[]> = {
  maj:  [0, 4, 7],
  min:  [0, 3, 7],
  maj7: [0, 4, 7, 11],
  min7: [0, 3, 7, 10],
  dom7: [0, 4, 7, 10],
  dim:  [0, 3, 6],
  aug:  [0, 4, 8],
  sus2: [0, 2, 7],
  sus4: [0, 5, 7],
}

// ─── Interval Names ───────────────────────────────────────────────────────────

export const INTERVAL_NAMES: Record<number, string> = {
  0: 'P1', 1: 'm2', 2: 'M2', 3: 'm3', 4: 'M3',
  5: 'P4', 6: 'TT', 7: 'P5', 8: 'm6', 9: 'M6',
  10: 'm7', 11: 'M7', 14: 'M9',
}

export function getIntervalName(semitones: number): string {
  return INTERVAL_NAMES[semitones % 12] ?? `+${semitones}`
}

// ─── Degree Names ─────────────────────────────────────────────────────────────

const DEGREE_NAMES: Record<number, Record<number, string>> = {
  // major scale degrees: interval → Roman numeral
  7: { 0: 'I', 2: 'II', 4: 'III', 5: 'IV', 7: 'V', 9: 'VI', 11: 'VII' },
}

export function getScaleDegree(interval: number, scaleType: ScaleType): string {
  const map = DEGREE_NAMES[SCALE_INTERVALS[scaleType]?.length ?? 7]
  return map?.[interval % 12] ?? getIntervalName(interval)
}

// ─── Core Functions ───────────────────────────────────────────────────────────

export function getNoteAtFret(openNote: NoteSharp, fret: number): NoteSharp {
  const base = noteIndex(openNote)
  return SHARPS[(base + fret) % 12]
}

export function getInterval(root: NoteSharp, note: NoteSharp): number {
  const rootIdx = noteIndex(root)
  const noteIdx = noteIndex(note)
  return (noteIdx - rootIdx + 12) % 12
}

export function getScaleNotes(root: NoteSharp, scaleType: ScaleType): NoteSharp[] {
  const rootIdx = noteIndex(root)
  return SCALE_INTERVALS[scaleType].map(i => SHARPS[(rootIdx + i) % 12])
}

export function getChordNotes(root: NoteSharp, chordType: ChordType): NoteSharp[] {
  const rootIdx = noteIndex(root)
  return CHORD_INTERVALS[chordType].map(i => SHARPS[(rootIdx + i % 12) % 12])
}

export function getArpeggioNotes(root: NoteSharp, arpeggioType: ArpeggioType): NoteSharp[] {
  const rootIdx = noteIndex(root)
  return ARPEGGIO_INTERVALS[arpeggioType].map(i => SHARPS[(rootIdx + i % 12) % 12])
}

// ─── Chord Identification ─────────────────────────────────────────────────────

export function identifyChord(selectedNotes: NoteSharp[]): ChordMatch[] {
  if (selectedNotes.length < 2) return []
  const selected = new Set(selectedNotes.map(n => noteIndex(n)))
  const results: ChordMatch[] = []

  for (const root of SHARPS) {
    const rootIdx = noteIndex(root)
    for (const [type, intervals] of Object.entries(CHORD_INTERVALS) as [ChordType, number[]][]) {
      const chordNoteIndices = intervals.map(i => (rootIdx + i % 12) % 12)
      // All chord notes must be in selection, selection must not have extra notes
      const chordSet = new Set(chordNoteIndices)
      const allMatch = [...chordSet].every(n => selected.has(n))
      const noExtra = [...selected].every(n => chordSet.has(n))
      if (allMatch && noExtra) {
        const bassNote = selectedNotes.reduce((lowest, note) => {
          return noteIndex(note) < noteIndex(lowest) ? note : lowest
        }, selectedNotes[0])
        const inversion = chordNoteIndices.indexOf(noteIndex(bassNote))
        results.push({
          root,
          type,
          name: `${root}${type === 'maj' ? '' : type}`,
          inversion: Math.max(0, inversion),
          bassNote,
        })
      }
    }
  }

  return results
}

// ─── CAGED Scale Positions ────────────────────────────────────────────────────

/**
 * Computes 5 CAGED positions for any scale.
 *
 * Algorithm:
 * 1. List all scale note frets on the low E string.
 * 2. Take the notes that fall in frets 0–11 (first octave of the neck).
 *    This ensures Position 1 always starts at the lowest possible fret,
 *    regardless of where the root falls on the low E string (fixes C major
 *    starting at fret 8 instead of open position).
 * 3. Pick 5 anchor frets by targeting evenly-spaced fret positions
 *    (0, 2.4, 4.8, 7.2, 9.6) and snapping each to the nearest scale note.
 * 4. Build each position's cell list from the window [anchor−1, anchor+W]
 *    where W = 3 for 5-note scales, 4 for 6-note, 5 for 7-note scales.
 */
export function getScalePositions(
  root: NoteSharp,
  scaleType: ScaleType,
  tuning: NoteSharp[] = ['E', 'A', 'D', 'G', 'B', 'E'],
  totalFrets: number = 22,
): ScalePosition[] {
  const intervals = SCALE_INTERVALS[scaleType]
  const rootIdx = noteIndex(root)
  const openIdx0 = noteIndex(tuning[0])

  // ── Step 1: all scale-note frets on low E ──────────────────────────────
  const lowEFrets: number[] = []
  for (let f = 0; f <= totalFrets; f++) {
    const interval = ((openIdx0 + f - rootIdx) % 12 + 12) % 12
    if (intervals.includes(interval)) lowEFrets.push(f)
  }

  // ── Step 2: scale notes in the first octave of the neck (frets 0–11) ──
  const octaveNotes = lowEFrets.filter(f => f < 12)
  if (octaveNotes.length === 0) return []

  const n = octaveNotes.length

  // ── Step 3: 5 anchor frets spaced by fret position (not note index) ───
  // Targets: 0, 2.4, 4.8, 7.2, 9.6  (12 frets / 5 positions)
  // Snap each target to the nearest scale note, avoiding duplicates.
  const spread = 12 / 5
  const seenAnchors = new Set<number>()
  const anchors: number[] = []
  for (let i = 0; i < 5; i++) {
    const targetFret = i * spread
    let best = -1
    let bestDist = Infinity
    for (const f of octaveNotes) {
      const dist = Math.abs(f - targetFret)
      if (dist < bestDist && !seenAnchors.has(f)) {
        bestDist = dist
        best = f
      }
    }
    if (best === -1) best = octaveNotes[Math.min(i, n - 1)]
    seenAnchors.add(best)
    anchors.push(best)
  }

  // ── Step 4: window size based on scale density ─────────────────────────
  // All non-chromatic scales: 5 frets wide [anchor-1, anchor+3]
  // Chromatic (12 notes): wider window to capture enough notes
  const windowRight = n >= 12 ? 5 : 3

  const CAGED_SHAPES = ['E', 'D', 'C', 'A', 'G'] as const

  return anchors.map((anchor, i) => {
    const winStart = Math.max(0, anchor - 1)
    const winEnd   = Math.min(totalFrets, anchor + windowRight)

    const cells: FretCell[] = []
    for (let s = 0; s < 6; s++) {
      const openNoteIdx = noteIndex(tuning[s])
      for (let f = winStart; f <= winEnd; f++) {
        const interval = ((openNoteIdx + f - rootIdx) % 12 + 12) % 12
        if (intervals.includes(interval)) cells.push({ string: s, fret: f })
      }
    }

    return {
      position: (i + 1) as 1 | 2 | 3 | 4 | 5,
      cagedShape: CAGED_SHAPES[i],
      lowestFret: winStart,
      highestFret: winEnd,
      cells,
    }
  })
}
