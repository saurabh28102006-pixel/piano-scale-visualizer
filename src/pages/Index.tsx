import { useState } from "react";
import Piano from "@/components/Piano";
import { LabelDisplayMode } from "@/components/PianoKey";
import ScaleSelector from "@/components/ScaleSelector";
import ScalePlayer from "@/components/ScalePlayer";
import ScaleInfoCard from "@/components/ScaleInfoCard";
import ChordVisualizer from "@/components/ChordVisualizer";
import CircleOfFifths from "@/components/CircleOfFifths";
import ScaleQuiz from "@/components/ScaleQuiz";
import AudioControls from "@/components/AudioControls";
import {
  Note,
  ScaleType,
  scaleNames,
  displayNote,
  generateScale,
} from "@/utils/scales";
import { audio, InstrumentType } from "@/utils/audio";
import { Music, Layers, Disc3, Trophy, Sparkles, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

type ActiveTab = "scales" | "chords" | "circle" | "quiz";

const Index = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("scales");
  const [rootNote, setRootNote] = useState<Note>("C");
  const [scaleType, setScaleType] = useState<ScaleType>("major");

  // Audio & Display Controls State
  const [instrument, setInstrument] = useState<InstrumentType>("piano");
  const [volume, setVolume] = useState<number>(0.7);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSustain, setIsSustain] = useState<boolean>(false);
  const [useFlats, setUseFlats] = useState<boolean>(false);
  const [labelMode, setLabelMode] = useState<LabelDisplayMode>("notes");
  const [octaveRange, setOctaveRange] = useState<"2" | "3">("2");

  // Highlight overrides (e.g. for sequencer or chord exploration)
  const [activePlayingNotes, setActivePlayingNotes] = useState<string[]>([]);
  const [chordHighlightedNotes, setChordHighlightedNotes] = useState<Note[] | null>(null);

  const handleRootChange = (note: Note) => {
    setRootNote(note);
    setChordHighlightedNotes(null);
  };

  const handleScaleChange = (scale: ScaleType) => {
    setScaleType(scale);
    setChordHighlightedNotes(null);
  };

  const handleChordChange = (root: Note, notes: Note[]) => {
    setRootNote(root);
    setChordHighlightedNotes(notes);
  };

  const handleCircleKeySelect = (key: Note, scale: ScaleType) => {
    setRootNote(key);
    setScaleType(scale);
    setChordHighlightedNotes(null);
    setActiveTab("scales");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between py-6 px-3 md:px-6 select-none">
      {/* Header Section */}
      <header className="text-center mb-6 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 border border-blue-500/30 text-sky-400 text-xs font-bold rounded-full mb-3 shadow-[0_0_15px_rgba(56,189,248,0.15)]">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> HARMONIX • PIANO & MUSIC STUDIO
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white bg-clip-text bg-gradient-to-r from-white via-sky-200 to-indigo-200">
          Harmonix Piano Studio
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-2">
          Visualize, hear, and master scales, modes, chord progressions, and the Circle of Fifths.
        </p>
      </header>

      {/* Main Navigation Tabs */}
      <div className="w-full max-w-4xl mx-auto mb-4">
        <div className="flex items-center justify-center gap-1.5 sm:gap-3 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-md">
          <button
            onClick={() => {
              setActiveTab("scales");
              setChordHighlightedNotes(null);
            }}
            className={cn(
              "flex items-center gap-2 px-3 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all",
              activeTab === "scales"
                ? "bg-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            )}
          >
            <Music className="w-4 h-4" />
            <span>Scales & Modes</span>
          </button>

          <button
            onClick={() => setActiveTab("chords")}
            className={cn(
              "flex items-center gap-2 px-3 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all",
              activeTab === "chords"
                ? "bg-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            )}
          >
            <Layers className="w-4 h-4" />
            <span>Chord Explorer</span>
          </button>

          <button
            onClick={() => setActiveTab("circle")}
            className={cn(
              "flex items-center gap-2 px-3 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all",
              activeTab === "circle"
                ? "bg-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            )}
          >
            <Disc3 className="w-4 h-4" />
            <span>Circle of Fifths</span>
          </button>

          <button
            onClick={() => setActiveTab("quiz")}
            className={cn(
              "flex items-center gap-2 px-3 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all",
              activeTab === "quiz"
                ? "bg-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            )}
          >
            <Trophy className="w-4 h-4" />
            <span>Ear & Scale Quiz</span>
          </button>
        </div>
      </div>

      {/* Audio Controls Bar */}
      <AudioControls
        instrument={instrument}
        volume={volume}
        isMuted={isMuted}
        isSustain={isSustain}
        useFlats={useFlats}
        labelMode={labelMode}
        octaveRange={octaveRange}
        onInstrumentChange={setInstrument}
        onVolumeChange={setVolume}
        onMuteToggle={() => setIsMuted(!isMuted)}
        onSustainToggle={() => setIsSustain(!isSustain)}
        onFlatsToggle={setUseFlats}
        onLabelModeChange={setLabelMode}
        onOctaveRangeChange={setOctaveRange}
      />

      {/* Central Piano Viewport */}
      <div className="w-full max-w-4xl mx-auto my-3">
        <Piano
          rootNote={rootNote}
          scaleType={scaleType}
          highlightedNotes={chordHighlightedNotes || undefined}
          activePlayingNotes={activePlayingNotes}
          labelMode={labelMode}
          useFlats={useFlats}
          octaveRange={octaveRange}
        />
      </div>

      {/* Dynamic Tab Content Area */}
      <main className="w-full max-w-4xl mx-auto mt-4 space-y-6">
        {/* Tab 1: Scales & Modes */}
        {activeTab === "scales" && (
          <>
            <ScalePlayer
              rootNote={rootNote}
              scaleType={scaleType}
              useFlats={useFlats}
              onActiveNotesChange={setActivePlayingNotes}
            />

            <ScaleInfoCard
              rootNote={rootNote}
              scaleType={scaleType}
              useFlats={useFlats}
              onSelectChordNotes={(notes) => setChordHighlightedNotes(notes)}
            />

            <ScaleSelector
              selectedRoot={rootNote}
              selectedScale={scaleType}
              useFlats={useFlats}
              onRootChange={handleRootChange}
              onScaleChange={handleScaleChange}
            />
          </>
        )}

        {/* Tab 2: Chords Explorer */}
        {activeTab === "chords" && (
          <ChordVisualizer
            useFlats={useFlats}
            onChordChange={handleChordChange}
          />
        )}

        {/* Tab 3: Circle of Fifths */}
        {activeTab === "circle" && (
          <CircleOfFifths
            selectedRoot={rootNote}
            selectedScale={scaleType}
            useFlats={useFlats}
            onSelectKey={handleCircleKeySelect}
          />
        )}

        {/* Tab 4: Ear & Scale Quiz */}
        {activeTab === "quiz" && (
          <ScaleQuiz useFlats={useFlats} />
        )}
      </main>

      {/* Footer with Saurabh Kumar attribution */}
      <footer className="w-full max-w-4xl mx-auto mt-12 pt-6 border-t border-slate-800/80 text-center">
        <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
          Designed by <span className="font-bold text-slate-200">Saurabh Kumar</span>
        </p>
        <p className="text-[11px] text-slate-500 mt-1">
          Crafted with React, Tailwind CSS, TypeScript, and Web Audio API.
        </p>
      </footer>
    </div>
  );
};

export default Index;
