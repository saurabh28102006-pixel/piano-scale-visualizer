import React from "react";
import {
  Note,
  ScaleType,
  scaleDefinitions,
  generateScale,
  displayNote,
  getDiatonicChords,
} from "@/utils/scales";
import { playNote, playChord } from "@/utils/audio";
import { Info, Music, Sparkles, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScaleInfoCardProps {
  rootNote: Note;
  scaleType: ScaleType;
  useFlats?: boolean;
  onSelectChordNotes?: (notes: Note[]) => void;
}

const ScaleInfoCard: React.FC<ScaleInfoCardProps> = ({
  rootNote,
  scaleType,
  useFlats = false,
  onSelectChordNotes,
}) => {
  const def = scaleDefinitions[scaleType];
  const scaleNotes = generateScale(rootNote, scaleType);
  const diatonicChords = getDiatonicChords(rootNote, scaleType);

  const handlePlayScaleNote = (n: Note) => {
    playNote(`${n}4`);
  };

  const handlePlayDiatonicChord = (chordNotes: Note[]) => {
    const octaved = chordNotes.map((n, i) => `${n}${4 + (i > 1 && n === 'C' ? 1 : 0)}`);
    playChord(octaved, 1.2);
    if (onSelectChordNotes) {
      onSelectChordNotes(chordNotes);
    }
  };

  if (!def) return null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Primary Scale Overview */}
      <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-xl p-4 shadow-lg">
        <div className="flex flex-wrap items-start justify-between gap-4 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/20 text-primary border border-primary/30">
                {def.category.toUpperCase()}
              </span>
              <span className="text-xs text-amber-400 font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> {def.mood}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white mt-1">
              {displayNote(rootNote, useFlats)} {def.name}
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">{def.description}</p>
          </div>

          {/* Step Formula Pill */}
          <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 text-right">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
              Step Formula
            </div>
            <div className="text-sm font-mono font-bold text-cyan-400">{def.stepPattern}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">W = Whole (2) • H = Half (1)</div>
          </div>
        </div>

        {/* Notes in Scale Cards */}
        <div className="mt-4">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
            Notes in this Scale (Click to hear):
          </div>
          <div className="flex flex-wrap gap-2">
            {scaleNotes.map((note, idx) => {
              const isRoot = note === rootNote;
              const formulaDeg = def.formula[idx] || `${idx + 1}`;
              return (
                <button
                  key={`${note}-${idx}`}
                  onClick={() => handlePlayScaleNote(note)}
                  className={cn(
                    "flex flex-col items-center justify-center min-w-[50px] py-2 px-3 rounded-xl border transition-all transform hover:-translate-y-0.5 shadow-sm",
                    isRoot
                      ? "bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold hover:bg-amber-500/30"
                      : "bg-slate-800/80 border-slate-700/80 text-slate-200 hover:bg-slate-700 hover:border-slate-600"
                  )}
                >
                  <span className="text-sm font-bold">{displayNote(note, useFlats)}</span>
                  <span
                    className={cn(
                      "text-[10px] font-mono mt-0.5",
                      isRoot ? "text-amber-400 font-bold" : "text-cyan-400"
                    )}
                  >
                    {formulaDeg}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Diatonic Chords Section (if applicable) */}
      {diatonicChords.length > 0 && (
        <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Music className="w-4 h-4 text-primary" /> Diatonic Chords in this Key
            </h3>
            <span className="text-xs text-slate-400">Click any chord to play harmony</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {diatonicChords.map((chord, i) => (
              <button
                key={`${chord.roman}-${i}`}
                onClick={() => handlePlayDiatonicChord(chord.notes)}
                className="bg-slate-800/70 hover:bg-primary/20 border border-slate-700 hover:border-primary/50 p-2.5 rounded-xl text-center transition-all group"
              >
                <div className="text-xs font-mono font-bold text-primary group-hover:text-cyan-300">
                  {chord.roman}
                </div>
                <div className="text-sm font-bold text-slate-100 mt-0.5">{chord.fullName}</div>
                <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-center gap-0.5">
                  {chord.notes.map((n) => displayNote(n, useFlats)).join(" - ")}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScaleInfoCard;
