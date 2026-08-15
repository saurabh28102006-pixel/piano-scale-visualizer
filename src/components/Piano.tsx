import React, { useState, useEffect, useCallback } from "react";
import PianoKey, { LabelDisplayMode } from "./PianoKey";
import {
  generatePianoKeys,
  playNote,
  PianoKey as PianoKeyType,
  initAudio,
  keyShortcutsMap,
} from "@/utils/audio";
import { Note, ScaleType, generateScale, isNoteInScale } from "@/utils/scales";

interface PianoProps {
  rootNote: Note;
  scaleType: ScaleType;
  highlightedNotes?: Note[]; // Custom highlight override (e.g. for chords)
  activePlayingNotes?: string[]; // Currently playing note strings like "C4"
  labelMode?: LabelDisplayMode;
  useFlats?: boolean;
  octaveRange?: "2" | "3";
  onNotePlay?: (note: string) => void;
}

const Piano: React.FC<PianoProps> = ({
  rootNote,
  scaleType,
  highlightedNotes,
  activePlayingNotes = [],
  labelMode = "notes",
  useFlats = false,
  octaveRange = "2",
  onNotePlay,
}) => {
  const [keys, setKeys] = useState<PianoKeyType[]>([]);
  const [currentScale, setCurrentScale] = useState<Note[]>([]);
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());

  // Generate piano keys based on octave range
  useEffect(() => {
    setKeys(generatePianoKeys(octaveRange));
  }, [octaveRange]);

  // Update scale when root note or scale type changes
  useEffect(() => {
    if (highlightedNotes && highlightedNotes.length > 0) {
      setCurrentScale(highlightedNotes);
    } else {
      setCurrentScale(generateScale(rootNote, scaleType));
    }
  }, [rootNote, scaleType, highlightedNotes]);

  // Play a note handler
  const handlePlayNote = useCallback(
    (note: string) => {
      initAudio();
      playNote(note);
      if (onNotePlay) {
        onNotePlay(note);
      }

      // Briefly trigger active animation
      setActiveKeys((prev) => new Set(prev).add(note));
      setTimeout(() => {
        setActiveKeys((prev) => {
          const next = new Set(prev);
          next.delete(note);
          return next;
        });
      }, 300);
    },
    [onNotePlay]
  );

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      const key = e.key.toLowerCase();
      const mappedNote = keyShortcutsMap[key];
      if (mappedNote) {
        handlePlayNote(mappedNote);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePlayNote]);

  // Check if a note is in the current scale
  const checkIsInScale = (note: string): boolean => {
    const baseNote = note.replace(/\d+$/, "") as Note;
    return isNoteInScale(baseNote, currentScale);
  };

  // Check if a note is the root note
  const checkIsRootNote = (note: string): boolean => {
    const baseNote = note.replace(/\d+$/, "") as Note;
    return rootNote === baseNote;
  };

  // Split keys into white and black
  const whiteKeys = keys.filter((key) => !key.isBlack);
  const blackKeys = keys.filter((key) => key.isBlack);

  return (
    <div className="piano-container w-full max-w-4xl mx-auto px-2 select-none">
      <div className="piano-keyboard relative rounded-xl overflow-hidden border border-slate-700/60 bg-slate-950/80 shadow-2xl p-1.5 pb-2">
        {/* White keys layer */}
        <div className="flex h-[180px] md:h-[210px] w-full gap-[2px]">
          {whiteKeys.map((key) => {
            const isPlaying = activeKeys.has(key.note) || activePlayingNotes.includes(key.note);
            return (
              <div key={key.note} className="relative flex-1 h-full">
                <PianoKey
                  keyData={key}
                  isRootNote={checkIsRootNote(key.note)}
                  isInScale={checkIsInScale(key.note)}
                  isPlaying={isPlaying}
                  rootNote={rootNote}
                  scaleType={scaleType}
                  useFlats={useFlats}
                  labelMode={labelMode}
                  onPlay={handlePlayNote}
                />
              </div>
            );
          })}
        </div>

        {/* Black keys overlay layer */}
        <div className="absolute top-1.5 left-1.5 right-1.5 pointer-events-none">
          <div className="flex h-[115px] md:h-[135px] w-full gap-[2px]">
            {whiteKeys.map((whiteKey, index) => {
              // No black keys after E and B
              if (whiteKey.baseNote === "E" || whiteKey.baseNote === "B") {
                return <div key={`spacer-${index}`} className="flex-1" />;
              }

              // Find matching black key
              const blackKey = blackKeys.find((bk) => bk.position === whiteKey.position + 1);

              if (!blackKey) {
                return <div key={`spacer-${index}`} className="flex-1" />;
              }

              const isPlaying =
                activeKeys.has(blackKey.note) || activePlayingNotes.includes(blackKey.note);

              return (
                <div key={`black-key-slot-${index}`} className="flex-1 relative">
                  <div className="absolute w-[68%] right-0 transform translate-x-1/2 h-full pointer-events-auto z-10">
                    <PianoKey
                      keyData={blackKey}
                      isRootNote={checkIsRootNote(blackKey.note)}
                      isInScale={checkIsInScale(blackKey.note)}
                      isPlaying={isPlaying}
                      rootNote={rootNote}
                      scaleType={scaleType}
                      useFlats={useFlats}
                      labelMode={labelMode}
                      onPlay={handlePlayNote}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Piano;
