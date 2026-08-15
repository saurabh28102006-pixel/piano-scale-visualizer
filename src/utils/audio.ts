// Advanced Web Audio Synthesizer & Sequencer

export type InstrumentType = 'piano' | 'epiano' | 'synth' | 'marimba';

export interface PianoKey {
  note: string;
  baseNote: string;
  octave: number;
  isBlack: boolean;
  position: number;
  keyboardShortcut?: string;
}

// Frequency map (C2 to C6)
const noteFrequencies: Record<string, number> = {
  'C2': 65.41, 'C#2': 69.30, 'D2': 73.42, 'D#2': 77.78, 'E2': 82.41, 'F2': 87.31,
  'F#2': 92.50, 'G2': 98.00, 'G#2': 103.83, 'A2': 110.00, 'A#2': 116.54, 'B2': 123.47,
  'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'E3': 164.81, 'F3': 174.61,
  'F#3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'B3': 246.94,
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63, 'F4': 349.23,
  'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
  'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.25, 'F5': 698.46,
  'F#5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'B5': 987.77,
  'C6': 1046.50
};

// Computer Keyboard Shortcuts (Mapped to C3-C5 range)
export const keyShortcutsMap: Record<string, string> = {
  // Lower octave (C3 - B3)
  'z': 'C3', 's': 'C#3', 'x': 'D3', 'd': 'D#3', 'c': 'E3', 'v': 'F3',
  'g': 'F#3', 'b': 'G3', 'h': 'G#3', 'n': 'A3', 'j': 'A#3', 'm': 'B3',
  // Main octave (C4 - C5)
  'q': 'C4', '2': 'C#4', 'w': 'D4', '3': 'D#4', 'e': 'E4', 'r': 'F4',
  '5': 'F#4', 't': 'G4', '6': 'G#4', 'y': 'A4', '7': 'A#4', 'u': 'B4',
  'i': 'C5',
};

// Inverted map for display
export const noteToShortcut: Record<string, string> = Object.fromEntries(
  Object.entries(keyShortcutsMap).map(([k, v]) => [v, k.toUpperCase()])
);

class AudioManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private reverbNode: ConvolverNode | null = null;
  private instrument: InstrumentType = 'piano';
  private volume: number = 0.7;
  private isMuted: boolean = false;
  private isSustain: boolean = false;
  private activeOscillators: Map<string, { stop: () => void }> = new Map();

  public init(): AudioContext {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

      // Reverb simulation
      this.reverbNode = this.createReverb(this.ctx);

      this.masterGain.connect(this.ctx.destination);
      if (this.reverbNode) {
        this.masterGain.connect(this.reverbNode);
        this.reverbNode.connect(this.ctx.destination);
      }
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Create subtle synthetic acoustic reverb
  private createReverb(ctx: AudioContext): ConvolverNode {
    const convolver = ctx.createConvolver();
    const rate = ctx.sampleRate;
    const length = rate * 1.5; // 1.5 second decay
    const impulse = ctx.createBuffer(2, length, rate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      const decay = Math.exp(-i / (rate * 0.4));
      left[i] = (Math.random() * 2 - 1) * decay * 0.15;
      right[i] = (Math.random() * 2 - 1) * decay * 0.15;
    }

    convolver.buffer = impulse;
    return convolver;
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public setInstrument(inst: InstrumentType): void {
    this.instrument = inst;
  }

  public setSustain(sustain: boolean): void {
    this.isSustain = sustain;
  }

  public getInstrument(): InstrumentType {
    return this.instrument;
  }

  public getVolume(): number {
    return this.volume;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsSustain(): boolean {
    return this.isSustain;
  }

  // Play Note with Rich Sound Synthesis
  public playNote(note: string, customDuration?: number): void {
    const ctx = this.init();
    const freq = noteFrequencies[note];
    if (!freq || this.isMuted) return;

    const baseDuration = customDuration || (this.isSustain ? 1.8 : 0.8);
    const now = ctx.currentTime;

    switch (this.instrument) {
      case 'piano':
        this.synthAcousticPiano(ctx, freq, now, baseDuration);
        break;
      case 'epiano':
        this.synthElectricPiano(ctx, freq, now, baseDuration);
        break;
      case 'synth':
        this.synthPolyPad(ctx, freq, now, baseDuration);
        break;
      case 'marimba':
        this.synthMarimba(ctx, freq, now, baseDuration);
        break;
    }
  }

  // 1. Acoustic Piano Simulation (Multi-harmonic additive synth with hammer transient)
  private synthAcousticPiano(ctx: AudioContext, freq: number, now: number, duration: number): void {
    const harmonics = [
      { ratio: 1.0, gain: 0.6, type: 'triangle' as OscillatorType },
      { ratio: 2.0, gain: 0.25, type: 'sine' as OscillatorType },
      { ratio: 3.0, gain: 0.12, type: 'sine' as OscillatorType },
      { ratio: 4.0, gain: 0.05, type: 'sine' as OscillatorType },
    ];

    const noteGain = ctx.createGain();
    // Velocity curve
    noteGain.gain.setValueAtTime(0.001, now);
    noteGain.gain.linearRampToValueAtTime(0.5, now + 0.008); // Sharp hammer attack
    noteGain.gain.exponentialRampToValueAtTime(0.2, now + 0.15); // Initial drop
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    // Warm Low-pass filter
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(Math.min(freq * 6, 8000), now);
    filter.frequency.exponentialRampToValueAtTime(Math.min(freq * 2, 2500), now + duration * 0.8);

    harmonics.forEach(({ ratio, gain, type }) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq * ratio, now);
      // Slight detune for acoustic richness
      osc.detune.setValueAtTime((Math.random() - 0.5) * 4, now);

      oscGain.gain.setValueAtTime(gain, now);
      osc.connect(oscGain);
      oscGain.connect(filter);
      osc.start(now);
      osc.stop(now + duration + 0.05);
    });

    filter.connect(noteGain);
    noteGain.connect(this.masterGain!);
  }

  // 2. Electric Piano / Rhodes (Chime harmonics + warm vibe)
  private synthElectricPiano(ctx: AudioContext, freq: number, now: number, duration: number): void {
    const carrier = ctx.createOscillator();
    const modulator = ctx.createOscillator();
    const modGain = ctx.createGain();
    const noteGain = ctx.createGain();

    carrier.type = 'sine';
    carrier.frequency.setValueAtTime(freq, now);

    // Modulator for bell chime harmonics
    modulator.type = 'sine';
    modulator.frequency.setValueAtTime(freq * 3.5, now);
    modGain.gain.setValueAtTime(freq * 0.6, now);
    modGain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

    modulator.connect(modGain);
    modGain.connect(carrier.frequency);

    noteGain.gain.setValueAtTime(0.001, now);
    noteGain.gain.linearRampToValueAtTime(0.45, now + 0.006);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 1.2);

    carrier.connect(noteGain);
    noteGain.connect(this.masterGain!);

    modulator.start(now);
    carrier.start(now);
    modulator.stop(now + duration * 1.2);
    carrier.stop(now + duration * 1.2);
  }

  // 3. Poly Synth Lead / Pad
  private synthPolyPad(ctx: AudioContext, freq: number, now: number, duration: number): void {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const noteGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(freq, now);
    osc1.detune.setValueAtTime(-6, now);

    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(freq, now);
    osc2.detune.setValueAtTime(6, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 4, now);
    filter.frequency.exponentialRampToValueAtTime(freq * 1.5, now + duration);
    filter.Q.setValueAtTime(4, now);

    noteGain.gain.setValueAtTime(0.001, now);
    noteGain.gain.linearRampToValueAtTime(0.3, now + 0.03);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.masterGain!);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  }

  // 4. Marimba / Music Box
  private synthMarimba(ctx: AudioContext, freq: number, now: number, duration: number): void {
    const osc = ctx.createOscillator();
    const subOsc = ctx.createOscillator();
    const noteGain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(freq * 4, now);

    const subGain = ctx.createGain();
    subGain.gain.setValueAtTime(0.3, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06); // Fast strike chime

    subOsc.connect(subGain);
    subGain.connect(noteGain);

    noteGain.gain.setValueAtTime(0.001, now);
    noteGain.gain.linearRampToValueAtTime(0.6, now + 0.003);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + Math.min(duration, 0.7));

    osc.connect(noteGain);
    noteGain.connect(this.masterGain!);

    osc.start(now);
    subOsc.start(now);
    osc.stop(now + 0.7);
    subOsc.stop(now + 0.7);
  }

  // Play simultaneous Chord
  public playChord(notes: string[], duration = 1.2): void {
    notes.forEach((note) => this.playNote(note, duration));
  }
}

export const audio = new AudioManager();

// Export backwards-compatible helpers
export function initAudio(): AudioContext {
  return audio.init();
}

export function playNote(note: string, duration?: number): void {
  audio.playNote(note, duration);
}

export function playChord(notes: string[], duration?: number): void {
  audio.playChord(notes, duration);
}

// Generate Piano Keys (Option for 2 octaves C3-C5 or 3 octaves C2-C5)
export function generatePianoKeys(octaveRange: '2' | '3' = '2'): PianoKey[] {
  const keys: PianoKey[] = [];
  const baseNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const startOctave = octaveRange === '3' ? 2 : 3;
  const endOctave = 5;

  let position = 0;
  for (let octave = startOctave; octave <= endOctave; octave++) {
    for (let i = 0; i < baseNotes.length; i++) {
      if (octave === endOctave && i > 0) break; // Stop at C5

      const baseNote = baseNotes[i];
      const note = `${baseNote}${octave}`;
      const isBlack = baseNote.includes('#');

      keys.push({
        note,
        baseNote,
        octave,
        isBlack,
        position,
        keyboardShortcut: noteToShortcut[note],
      });

      position += 1;
    }
  }

  return keys;
}
