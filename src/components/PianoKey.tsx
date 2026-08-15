import React from "react";
import { cn } from "@/lib/utils";
import { PianoKey as PianoKeyType } from "@/utils/audio";
import { Note, ScaleType, displayNote, getScaleDegreeInfo } from "@/utils/scales";

export type LabelDisplayMode = "notes" | "degrees" | "solfege" | "shortcuts" | "none";

interface PianoKeyProps {
  keyData: PianoKeyType;
  isInScale: boolean;
  isRootNote: boolean;
  isPlaying?: boolean;
  rootNote: Note;
  scaleType: ScaleType;
  useFlats?: boolean;
  labelMode?: LabelDisplayMode;
  onPlay: (note: string) => void;
}

const PianoKey: React.FC<PianoKeyProps> = ({
  keyData,
  isInScale,
  isRootNote,
  isPlaying = false,
  rootNote,
  scaleType,
  useFlats = false,
  labelMode = "notes",
  onPlay,
}) => {
  const { note, baseNote, isBlack, keyboardShortcut } = keyData;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    onPlay(note);
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (e.buttons === 1) {
      // Left mouse button held down (drag glissando)
      onPlay(note);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    onPlay(note);
  };

  // Compute label text based on current label mode
  const degreeInfo = isInScale
    ? getScaleDegreeInfo(baseNote as Note, rootNote, scaleType)
    : null;

  let labelText = "";
  if (labelMode === "notes") {
    labelText = displayNote(baseNote, useFlats);
  } else if (labelMode === "degrees" && degreeInfo) {
    labelText = degreeInfo.degreeLabel;
  } else if (labelMode === "solfege" && degreeInfo) {
    labelText = degreeInfo.solfege;
  } else if (labelMode === "shortcuts" && keyboardShortcut) {
    labelText = keyboardShortcut;
  }

  return (
    <div
      className={cn(
        "select-none cursor-pointer flex flex-col justify-between items-center transition-all duration-150 relative",
        isBlack
          ? "piano-key-black text-xs font-semibold py-2"
          : "piano-key-white text-xs font-medium py-2",
        isInScale && "in-scale",
        isRootNote && "root-note",
        isPlaying && "key-playing"
      )}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onTouchStart={handleTouchStart}
      role="button"
      aria-label={`Piano key ${note}`}
      tabIndex={0}
    >
      {/* Top Root Indicator Tag */}
      {isRootNote && (
        <div className="absolute top-1 left-1/2 -translate-x-1/2 flex items-center justify-center z-20">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)] animate-pulse" />
        </div>
      )}

      {/* Degree Badge if in Scale and not in degrees mode */}
      {isInScale && labelMode !== "degrees" && labelMode !== "none" && degreeInfo && (
        <span
          className={cn(
            "text-[9px] font-bold px-1 rounded-sm z-20 transition-all",
            isRootNote
              ? "bg-amber-400 text-slate-950 shadow-sm"
              : isBlack
              ? "bg-cyan-500/30 text-cyan-200"
              : "bg-cyan-500/20 text-cyan-700 dark:text-cyan-300"
          )}
        >
          {degreeInfo.degreeLabel}
        </span>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom Label Badge */}
      {labelMode !== "none" && labelText && (
        <div
          className={cn(
            "z-20 text-[11px] font-bold transition-all px-1 rounded",
            isRootNote
              ? "text-amber-300 font-extrabold"
              : isBlack
              ? "text-slate-300"
              : "text-slate-700 dark:text-slate-200"
          )}
        >
          {labelText}
        </div>
      )}

      {/* Keyboard Shortcut Subscript */}
      {labelMode !== "shortcuts" && keyboardShortcut && (
        <span
          className={cn(
            "text-[8px] opacity-40 z-20 font-mono",
            isBlack ? "text-slate-400" : "text-slate-500"
          )}
        >
          [{keyboardShortcut}]
        </span>
      )}
    </div>
  );
};

export default PianoKey;
