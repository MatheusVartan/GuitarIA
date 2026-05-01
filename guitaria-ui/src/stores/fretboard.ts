import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { FretboardEngine, TUNING_PRESETS } from '@/core/fretboard/FretboardEngine'
import { playMidi } from '@/audio/NotePlayer'
import type {
  NoteSharp, PatternMode, DisplayMode, ScaleType,
  ChordType, ArpeggioType, Handedness, FretCell,
} from '@/core/fretboard/types'

export const useFretboardStore = defineStore('fretboard', () => {
  const engine = new FretboardEngine()

  // Reactive state that mirrors engine fields (for Vue reactivity)
  const root        = ref<NoteSharp>(engine.root)
  const patternMode = ref<PatternMode>(engine.patternMode)
  const scaleType   = ref<ScaleType>(engine.scaleType)
  const chordType   = ref<ChordType>(engine.chordType)
  const arpeggioType= ref<ArpeggioType>(engine.arpeggioType)
  const displayMode = ref<DisplayMode>(engine.displayMode)
  const position    = ref<1|2|3|4|5|'all'>(engine.position)
  const capo        = ref<number>(engine.capo)
  const tuning      = ref<NoteSharp[]>([...engine.tuning])
  const handedness  = ref<Handedness>(engine.handedness)
  const selectedCount = ref(0)  // trigger reactivity when selection changes

  // ─── Sync helpers ──────────────────────────────────────────────────────────

  function syncEngine() {
    engine.root         = root.value
    engine.patternMode  = patternMode.value
    engine.scaleType    = scaleType.value
    engine.chordType    = chordType.value
    engine.arpeggioType = arpeggioType.value
    engine.displayMode  = displayMode.value
    engine.position     = position.value
    engine.capo         = capo.value
    engine.tuning       = [...tuning.value]
    engine.handedness   = handedness.value
  }

  // ─── Computed ──────────────────────────────────────────────────────────────

  const noteGrid = computed(() => {
    syncEngine()
    // selectedCount is read to make this reactive to selection changes
    void selectedCount.value
    return engine.computeGrid()
  })

  const scalePositions = computed(() => {
    syncEngine()
    return engine.getScalePositions()
  })

  const chordMatches = computed(() => {
    syncEngine()
    void selectedCount.value
    return engine.getChordMatches()
  })

  const tuningPresets = TUNING_PRESETS

  // ─── Actions ───────────────────────────────────────────────────────────────

  function setRoot(note: NoteSharp) { root.value = note }
  function setPatternMode(mode: PatternMode) {
    patternMode.value = mode
    engine.clearUserSelected()
    selectedCount.value = 0
  }
  function setScaleType(scale: ScaleType) { scaleType.value = scale }
  function setChordType(chord: ChordType) { chordType.value = chord }
  function setArpeggioType(arp: ArpeggioType) { arpeggioType.value = arp }
  function setDisplayMode(mode: DisplayMode) { displayMode.value = mode }
  function setPosition(pos: 1|2|3|4|5|'all') { position.value = pos }
  function setCapo(fret: number) { capo.value = fret }
  function setTuning(notes: NoteSharp[]) { tuning.value = [...notes] }
  function setTuningPreset(idx: number) {
    if (TUNING_PRESETS[idx]) setTuning(TUNING_PRESETS[idx].notes)
  }
  function setHandedness(h: Handedness) { handedness.value = h }

  function tapCell(cell: FretCell) {
    syncEngine()

    // Only toggle selection (for chord identification) in 'identify' mode.
    // In all other modes, tapping just plays the note.
    if (patternMode.value === 'identify') {
      engine.toggleUserSelected(cell)
      selectedCount.value = engine.userSelectedCells.size
    }

    // Always play the note on tap
    const { midi } = engine.getNoteForCell(cell)
    playMidi(midi)
  }

  function clearSelection() {
    engine.clearUserSelected()
    selectedCount.value = 0
  }

  return {
    // state
    root, patternMode, scaleType, chordType, arpeggioType,
    displayMode, position, capo, tuning, handedness,
    // computed
    noteGrid, scalePositions, chordMatches, tuningPresets,
    // actions
    setRoot, setPatternMode, setScaleType, setChordType, setArpeggioType,
    setDisplayMode, setPosition, setCapo, setTuning, setTuningPreset,
    setHandedness, tapCell, clearSelection,
  }
})
