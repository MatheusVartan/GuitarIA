import * as Tone from 'tone'

let synth: Tone.PolySynth | null = null

function getSynth(): Tone.PolySynth {
  if (!synth) {
    synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.004, decay: 1.2, sustain: 0.1, release: 1.0 },
      volume: -6,
    }).toDestination()
  }
  return synth
}

export async function playNote(name: string, octave: number): Promise<void> {
  await Tone.start()
  const note = `${name}${octave}` as Tone.Unit.Frequency
  getSynth().triggerAttackRelease(note, '8n')
}

export async function playMidi(midi: number): Promise<void> {
  await Tone.start()
  const freq = Tone.Frequency(midi, 'midi').toFrequency()
  getSynth().triggerAttackRelease(freq, '8n')
}

export async function playChord(midis: number[]): Promise<void> {
  await Tone.start()
  const freqs = midis.map(m => Tone.Frequency(m, 'midi').toFrequency())
  getSynth().triggerAttackRelease(freqs, '4n')
}
