import React, { useState, useEffect, useRef } from "react";
import { Note, ScaleType, generateScale, displayNote } from "@/utils/scales";
import { audio, playNote, playChord } from "@/utils/audio";
import { Play, Square, Repeat, Gauge, Music } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScalePlayerProps {
  rootNote: Note;
  scaleType: ScaleType;
  useFlats?: boolean;
  onActiveNotesChange: (notes: string[]) => void;
}

type PlayDirection = "ascending" | "descending" | "both" | "chord";

const ScalePlayer: React.FC<ScalePlayerProps> = ({
  rootNote,
  scaleType,
  useFlats = false,
  onActiveNotesChange,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [direction, setDirection] = useState<PlayDirection>("both");
  const [bpm, setBpm] = useState(120);
  const [isLooping, setIsLooping] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Stop playback when root or scale changes
  useEffect(() => {
    stopPlayback();
  }, [rootNote, scaleType]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopPlayback();
    };
  }, []);

  const stopPlayback = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPlaying(false);
    onActiveNotesChange([]);
  };

  // Build the list of notes with octave (e.g. C4, D4, E4...)
  const buildSequenceNotes = (): string[] => {
    const scaleNotes = generateScale(rootNote, scaleType);
    const startOctave = 4;
    const baseNotesOrder = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

    let currentOctave = startOctave;
    let prevIndex = -1;

    const sequence: string[] = [];

    scaleNotes.forEach((n) => {
      const idx = baseNotesOrder.indexOf(n);
      if (prevIndex !== -1 && idx < prevIndex) {
        currentOctave += 1;
      }
      prevIndex = idx;
      sequence.push(`${n}${currentOctave}`);
    });

    // Add resolving root octave note at the end (e.g. C5)
    sequence.push(`${rootNote}${currentOctave + (baseNotesOrder.indexOf(rootNote) <= prevIndex ? 1 : 0)}`);

    if (direction === "descending") {
      return [...sequence].reverse();
    } else if (direction === "both") {
      const reversed = [...sequence].reverse().slice(1);
      return [...sequence, ...reversed];
    }

    return sequence;
  };

  const startPlayback = () => {
    audio.init();
    setIsPlaying(true);

    if (direction === "chord") {
      const sequence = buildSequenceNotes().slice(0, 4);
      playChord(sequence, 1.5);
      onActiveNotesChange(sequence);
      setTimeout(() => {
        onActiveNotesChange([]);
        setIsPlaying(false);
      }, 1500);
      return;
    }

    const sequence = buildSequenceNotes();
    const intervalMs = (60 / bpm) * 1000;
    let step = 0;

    const playStep = () => {
      if (step >= sequence.length) {
        if (isLooping) {
          step = 0;
        } else {
          stopPlayback();
          return;
        }
      }

      const noteToPlay = sequence[step];
      playNote(noteToPlay, (intervalMs / 1000) * 0.9);
      onActiveNotesChange([noteToPlay]);

      step++;
    };

    playStep();
    timerRef.current = setInterval(playStep, intervalMs);
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900/80 backdrop-blur border border-slate-800 rounded-xl p-3 shadow-lg mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Play / Stop Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all shadow-md",
              isPlaying
                ? "bg-rose-600 hover:bg-rose-700 text-white shadow-[0_0_15px_rgba(225,29,72,0.4)]"
                : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]"
            )}
          >
            {isPlaying ? (
              <>
                <Square className="w-4 h-4 fill-white" />
                <span>Stop</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Play Scale</span>
              </>
            )}
          </button>

          {/* Loop Toggle */}
          <button
            onClick={() => setIsLooping(!isLooping)}
            className={cn(
              "p-2 rounded-xl border transition-all",
              isLooping
                ? "bg-primary/20 border-primary text-primary"
                : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"
            )}
            title="Toggle Loop Sequence"
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        {/* Direction Selectors */}
        <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl border border-slate-700">
          {(
            [
              { id: "both", label: "Up & Down" },
              { id: "ascending", label: "Ascending ↑" },
              { id: "descending", label: "Descending ↓" },
              { id: "chord", label: "Chord ♬" },
            ] as const
          ).map((dir) => (
            <button
              key={dir.id}
              onClick={() => {
                if (isPlaying) stopPlayback();
                setDirection(dir.id);
              }}
              className={cn(
                "px-2.5 py-1 text-xs font-semibold rounded-lg transition-all",
                direction === dir.id
                  ? "bg-primary text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/60"
              )}
            >
              {dir.label}
            </button>
          ))}
        </div>

        {/* Tempo (BPM) Slider */}
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <Gauge className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold w-16">{bpm} BPM</span>
          <input
            type="range"
            min="60"
            max="220"
            step="5"
            value={bpm}
            onChange={(e) => setBpm(parseInt(e.target.value))}
            className="w-24 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>
      </div>
    </div>
  );
};

export default ScalePlayer;
