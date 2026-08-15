import React from "react";
import { audio, InstrumentType } from "@/utils/audio";
import { LabelDisplayMode } from "./PianoKey";
import { Volume2, VolumeX, Piano, Sparkles, Music2, Disc3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AudioControlsProps {
  instrument: InstrumentType;
  volume: number;
  isMuted: boolean;
  isSustain: boolean;
  useFlats: boolean;
  labelMode: LabelDisplayMode;
  octaveRange: "2" | "3";
  onInstrumentChange: (inst: InstrumentType) => void;
  onVolumeChange: (vol: number) => void;
  onMuteToggle: () => void;
  onSustainToggle: () => void;
  onFlatsToggle: (flats: boolean) => void;
  onLabelModeChange: (mode: LabelDisplayMode) => void;
  onOctaveRangeChange: (octaves: "2" | "3") => void;
}

const instruments: { id: InstrumentType; label: string; icon: React.ReactNode }[] = [
  { id: "piano", label: "Grand Piano", icon: <Piano className="w-3.5 h-3.5" /> },
  { id: "epiano", label: "E-Piano", icon: <Disc3 className="w-3.5 h-3.5" /> },
  { id: "synth", label: "Poly Synth", icon: <Sparkles className="w-3.5 h-3.5" /> },
  { id: "marimba", label: "Marimba", icon: <Music2 className="w-3.5 h-3.5" /> },
];

const labelModes: { id: LabelDisplayMode; label: string }[] = [
  { id: "notes", label: "Notes" },
  { id: "degrees", label: "Degrees (1-7)" },
  { id: "solfege", label: "Solfège" },
  { id: "shortcuts", label: "PC Keys" },
  { id: "none", label: "Clean" },
];

const AudioControls: React.FC<AudioControlsProps> = ({
  instrument,
  volume,
  isMuted,
  isSustain,
  useFlats,
  labelMode,
  octaveRange,
  onInstrumentChange,
  onVolumeChange,
  onMuteToggle,
  onSustainToggle,
  onFlatsToggle,
  onLabelModeChange,
  onOctaveRangeChange,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900/70 backdrop-blur-md border border-slate-800 rounded-xl p-3 shadow-lg mb-4 text-xs text-slate-200">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Instrument Selector */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-400 font-medium mr-1">Sound:</span>
          {instruments.map((inst) => (
            <button
              key={inst.id}
              onClick={() => {
                audio.setInstrument(inst.id);
                onInstrumentChange(inst.id);
              }}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-medium transition-all",
                instrument === inst.id
                  ? "bg-primary text-white shadow-[0_0_12px_rgba(59,130,246,0.5)]"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white"
              )}
            >
              {inst.icon}
              <span>{inst.label}</span>
            </button>
          ))}
        </div>

        {/* Sustain & Octaves & Sharps/Flats */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Sustain Pedal */}
          <button
            onClick={() => {
              audio.setSustain(!isSustain);
              onSustainToggle();
            }}
            className={cn(
              "px-2.5 py-1.5 rounded-lg font-medium transition-all",
              isSustain
                ? "bg-amber-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                : "bg-slate-800/80 text-slate-300 hover:bg-slate-700"
            )}
            title="Hold notes longer like a piano sustain pedal"
          >
            Sustain {isSustain ? "ON" : "OFF"}
          </button>

          {/* Sharp / Flat toggle */}
          <div className="bg-slate-800/90 rounded-lg p-0.5 flex items-center border border-slate-700">
            <button
              onClick={() => onFlatsToggle(false)}
              className={cn(
                "px-2 py-1 rounded font-bold transition-colors",
                !useFlats ? "bg-primary text-white" : "text-slate-400 hover:text-white"
              )}
            >
              ♯ Sharps
            </button>
            <button
              onClick={() => onFlatsToggle(true)}
              className={cn(
                "px-2 py-1 rounded font-bold transition-colors",
                useFlats ? "bg-primary text-white" : "text-slate-400 hover:text-white"
              )}
            >
              ♭ Flats
            </button>
          </div>

          {/* 2 vs 3 Octave view */}
          <div className="bg-slate-800/90 rounded-lg p-0.5 flex items-center border border-slate-700">
            <button
              onClick={() => onOctaveRangeChange("2")}
              className={cn(
                "px-2 py-1 rounded font-bold transition-colors",
                octaveRange === "2" ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-white"
              )}
            >
              2 Octaves
            </button>
            <button
              onClick={() => onOctaveRangeChange("3")}
              className={cn(
                "px-2 py-1 rounded font-bold transition-colors",
                octaveRange === "3" ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-white"
              )}
            >
              3 Octaves
            </button>
          </div>
        </div>

        {/* Volume Slider & Mute */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              audio.toggleMute();
              onMuteToggle();
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              audio.setVolume(val);
              onVolumeChange(val);
            }}
            className="w-20 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
            title="Volume"
          />
        </div>
      </div>

      {/* Secondary Bar: Key Labels Selector */}
      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-800/80 flex-wrap">
        <span className="text-slate-400 font-medium">Key Labels:</span>
        <div className="flex items-center gap-1 flex-wrap">
          {labelModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => onLabelModeChange(mode.id)}
              className={cn(
                "px-2 py-1 rounded-md text-[11px] font-medium transition-colors",
                labelMode === mode.id
                  ? "bg-slate-200 text-slate-900 font-semibold"
                  : "bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700"
              )}
            >
              {mode.label}
            </button>
          ))}
        </div>
        <span className="text-slate-500 text-[11px] ml-auto hidden sm:inline">
          Tip: You can also play keys with your computer keyboard!
        </span>
      </div>
    </div>
  );
};

export default AudioControls;
