import React, { useState } from "react";
import {
  Note,
  ChordType,
  allNotes,
  chordDefinitions,
  generateChordNotes,
  displayNote,
} from "@/utils/scales";
import { playChord, playNote } from "@/utils/audio";
import { Play, Volume2, Sparkles, Music } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChordVisualizerProps {
  useFlats?: boolean;
  onChordChange: (root: Note, notes: Note[]) => void;
}

const ChordVisualizer: React.FC<ChordVisualizerProps> = ({
  useFlats = false,
  onChordChange,
}) => {
  const [root, setRoot] = useState<Note>("C");
  const [chordType, setChordType] = useState<ChordType>("maj");

  const currentChord = chordDefinitions[chordType];
  const chordNotes = generateChordNotes(root, chordType);

  const handleRootSelect = (n: Note) => {
    setRoot(n);
    onChordChange(n, generateChordNotes(n, chordType));
  };

  const handleTypeSelect = (type: ChordType) => {
    setChordType(type);
    onChordChange(root, generateChordNotes(root, type));
  };

  const handlePlayChordStrum = () => {
    const octaved = chordNotes.map((n, i) => `${n}${4 + (i > 1 && n === 'C' ? 1 : 0)}`);
    playChord(octaved, 1.5);
  };

  const handlePlayArpeggio = () => {
    const octaved = chordNotes.map((n, i) => `${n}${4 + (i > 1 && n === 'C' ? 1 : 0)}`);
    octaved.forEach((note, idx) => {
      setTimeout(() => {
        playNote(note, 0.8);
      }, idx * 180);
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Root Note Selector */}
      <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-xl p-4 shadow-lg">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
          Select Chord Root Note:
        </div>
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
          {allNotes.map((note) => {
            const isSharp = note.includes("#");
            const isSelected = root === note;
            return (
              <button
                key={note}
                onClick={() => handleRootSelect(note)}
                className={cn(
                  "h-11 rounded-xl flex items-center justify-center font-bold text-sm transition-all",
                  isSelected
                    ? "bg-primary text-white shadow-[0_0_12px_rgba(59,130,246,0.6)] scale-105"
                    : isSharp
                    ? "bg-slate-800 text-slate-200 hover:bg-slate-700"
                    : "bg-slate-700/80 text-white hover:bg-slate-600"
                )}
              >
                {displayNote(note, useFlats)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chord Types Grid */}
      <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-xl p-4 shadow-lg">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
          Select Chord Quality / Type:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {(Object.keys(chordDefinitions) as ChordType[]).map((type) => {
            const def = chordDefinitions[type];
            const isSelected = chordType === type;
            return (
              <button
                key={type}
                onClick={() => handleTypeSelect(type)}
                className={cn(
                  "p-2.5 rounded-xl border text-left transition-all",
                  isSelected
                    ? "bg-primary/20 border-primary text-white shadow-[0_0_12px_rgba(59,130,246,0.3)]"
                    : "bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
              >
                <div className="font-bold text-sm">
                  {displayNote(root, useFlats)} {def.symbol}
                </div>
                <div className="text-[11px] text-slate-400">{def.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Chord Summary & Play Bar */}
      <div className="bg-gradient-to-r from-blue-900/40 via-slate-900 to-indigo-900/40 border border-blue-800/40 rounded-xl p-4 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl md:text-2xl font-black text-white">
              {displayNote(root, useFlats)} {currentChord.name} ({currentChord.symbol})
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-slate-300">
            <span>
              Formula: <strong className="text-cyan-400 font-mono">{currentChord.formula}</strong>
            </span>
            <span>•</span>
            <span>
              Notes:{" "}
              <strong className="text-amber-400">
                {chordNotes.map((n) => displayNote(n, useFlats)).join(" - ")}
              </strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePlayChordStrum}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Play Chord</span>
          </button>
          <button
            onClick={handlePlayArpeggio}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl border border-slate-700 transition-all text-xs"
          >
            <Music className="w-4 h-4 text-cyan-400" />
            <span>Arpeggiate</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChordVisualizer;
