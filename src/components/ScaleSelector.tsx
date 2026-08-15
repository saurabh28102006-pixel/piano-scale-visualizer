import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Note,
  ScaleType,
  ScaleCategory,
  allNotes,
  scaleCategories,
  scaleDefinitions,
  displayNote,
} from "@/utils/scales";
import { Search, Sparkles, SlidersHorizontal } from "lucide-react";

interface ScaleSelectorProps {
  selectedRoot: Note;
  selectedScale: ScaleType;
  useFlats?: boolean;
  onRootChange: (root: Note) => void;
  onScaleChange: (scale: ScaleType) => void;
}

const ScaleSelector: React.FC<ScaleSelectorProps> = ({
  selectedRoot,
  selectedScale,
  useFlats = false,
  onRootChange,
  onScaleChange,
}) => {
  const [activeCategory, setActiveCategory] = useState<ScaleCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories: { id: ScaleCategory | "all"; label: string }[] = [
    { id: "all", label: "All Scales" },
    { id: "standard", label: "Standard (4)" },
    { id: "pentatonic", label: "Pentatonic & Blues (4)" },
    { id: "modes", label: "Modes (7)" },
    { id: "jazz_exotic", label: "Jazz & Exotic (9)" },
  ];

  // Filter scales based on category and search query
  const filteredScaleKeys = (Object.keys(scaleDefinitions) as ScaleType[]).filter((key) => {
    const def = scaleDefinitions[key];
    const matchesCategory = activeCategory === "all" || def.category === activeCategory;
    const matchesSearch =
      def.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      def.mood.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Root Note Selector */}
      <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Select Root Key:
          </label>
          <span className="text-xs text-slate-400">
            Current: <strong className="text-cyan-400 font-bold">{displayNote(selectedRoot, useFlats)}</strong>
          </span>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
          {allNotes.map((note) => {
            const isSharp = note.includes("#");
            const isSelected = selectedRoot === note;

            return (
              <button
                key={note}
                onClick={() => onRootChange(note)}
                className={cn(
                  "h-12 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-200",
                  isSelected
                    ? "bg-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.7)] scale-105"
                    : isSharp
                    ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    : "bg-slate-700/70 text-white hover:bg-slate-600"
                )}
              >
                {displayNote(note, useFlats)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scale Type Selector & Search */}
      <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-xl p-4 shadow-lg">
        {/* Category Tabs and Search */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                  activeCategory === cat.id
                    ? "bg-primary text-white shadow-sm"
                    : "bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[180px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search scales..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Scales Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
          {filteredScaleKeys.map((key) => {
            const def = scaleDefinitions[key];
            const isSelected = selectedScale === key;

            return (
              <button
                key={key}
                onClick={() => onScaleChange(key)}
                className={cn(
                  "p-3 rounded-xl border text-left transition-all relative overflow-hidden group",
                  isSelected
                    ? "bg-primary/20 border-primary shadow-[0_0_15px_rgba(59,130,246,0.3)] text-white"
                    : "bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">{def.name}</span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_#3b82f6]" />
                  )}
                </div>

                <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                  <span className="text-cyan-400 font-mono text-[10px]">{def.stepPattern}</span>
                  <span className="text-amber-400/90 text-[10px] font-medium">{def.mood}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ScaleSelector;
