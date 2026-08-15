import React from "react";
import { Note, ScaleType, circleOfFifthsData, displayNote } from "@/utils/scales";
import { Sparkles, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface CircleOfFifthsProps {
  selectedRoot: Note;
  selectedScale: ScaleType;
  useFlats?: boolean;
  onSelectKey: (root: Note, scale: ScaleType) => void;
}

const CircleOfFifths: React.FC<CircleOfFifthsProps> = ({
  selectedRoot,
  selectedScale,
  useFlats = false,
  onSelectKey,
}) => {
  const isMinorMode =
    selectedScale === "minor" ||
    selectedScale === "harmonicMinor" ||
    selectedScale === "melodicMinor" ||
    selectedScale === "aeolian";

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900/80 backdrop-blur border border-slate-800 rounded-xl p-4 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" /> Interactive Circle of Fifths
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Click any Major key (outer ring) or Relative Minor key (inner ring) to visualize its scale.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* SVG Circle of Fifths Wheel */}
        <div className="md:col-span-7 flex justify-center py-2">
          <div className="relative w-72 h-72 sm:w-80 sm:h-80">
            <svg viewBox="-160 -160 320 320" className="w-full h-full transform -rotate-90">
              {/* Outer circle ring */}
              <circle r="150" fill="#0f172a" stroke="#334155" strokeWidth="2" />
              <circle r="100" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
              <circle r="55" fill="#090d16" stroke="#475569" strokeWidth="1" />

              {/* Slices */}
              {circleOfFifthsData.map((item, index) => {
                const angle = index * 30; // 360 / 12 = 30 deg
                const startAngle = (angle - 15) * (Math.PI / 180);
                const endAngle = (angle + 15) * (Math.PI / 180);

                // Outer sector (Major)
                const isSelectedMajor = selectedRoot === item.major && !isMinorMode;
                const isSelectedMinor = selectedRoot === item.minor && isMinorMode;

                // Center position for text
                const textAngle = angle * (Math.PI / 180);
                const majorX = Math.cos(textAngle) * 125;
                const majorY = Math.sin(textAngle) * 125;

                const minorX = Math.cos(textAngle) * 78;
                const minorY = Math.sin(textAngle) * 78;

                return (
                  <g key={item.major}>
                    {/* Outer Slice for Major */}
                    <path
                      d={`M ${Math.cos(startAngle) * 100} ${Math.sin(startAngle) * 100} 
                          L ${Math.cos(startAngle) * 150} ${Math.sin(startAngle) * 150} 
                          A 150 150 0 0 1 ${Math.cos(endAngle) * 150} ${Math.sin(endAngle) * 150} 
                          L ${Math.cos(endAngle) * 100} ${Math.sin(endAngle) * 100} 
                          A 100 100 0 0 0 ${Math.cos(startAngle) * 100} ${Math.sin(startAngle) * 100} Z`}
                      fill={isSelectedMajor ? "#3b82f6" : index % 2 === 0 ? "#1e293b" : "#172033"}
                      stroke="#334155"
                      strokeWidth="1"
                      className="cursor-pointer hover:fill-blue-500/80 transition-colors"
                      onClick={() => onSelectKey(item.major, "major")}
                    />

                    {/* Inner Slice for Relative Minor */}
                    <path
                      d={`M ${Math.cos(startAngle) * 55} ${Math.sin(startAngle) * 55} 
                          L ${Math.cos(startAngle) * 100} ${Math.sin(startAngle) * 100} 
                          A 100 100 0 0 1 ${Math.cos(endAngle) * 100} ${Math.sin(endAngle) * 100} 
                          L ${Math.cos(endAngle) * 55} ${Math.sin(endAngle) * 55} 
                          A 55 55 0 0 0 ${Math.cos(startAngle) * 55} ${Math.sin(startAngle) * 55} Z`}
                      fill={isSelectedMinor ? "#8b5cf6" : index % 2 === 0 ? "#0f172a" : "#131c2e"}
                      stroke="#334155"
                      strokeWidth="1"
                      className="cursor-pointer hover:fill-purple-600/80 transition-colors"
                      onClick={() => onSelectKey(item.minor, "minor")}
                    />

                    {/* Major Key Text */}
                    <text
                      x={majorX}
                      y={majorY}
                      fill={isSelectedMajor ? "#ffffff" : "#f1f5f9"}
                      fontSize="13"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="central"
                      transform={`rotate(90, ${majorX}, ${majorY})`}
                      className="pointer-events-none select-none font-sans"
                    >
                      {displayNote(item.major, useFlats)}
                    </text>

                    {/* Minor Key Text */}
                    <text
                      x={minorX}
                      y={minorY}
                      fill={isSelectedMinor ? "#ffffff" : "#94a3b8"}
                      fontSize="10"
                      fontWeight="semibold"
                      textAnchor="middle"
                      dominantBaseline="central"
                      transform={`rotate(90, ${minorX}, ${minorY})`}
                      className="pointer-events-none select-none font-sans"
                    >
                      {displayNote(item.minor, useFlats)}m
                    </text>
                  </g>
                );
              })}

              {/* Center Hub */}
              <circle r="40" fill="#090d16" stroke="#475569" strokeWidth="1" />
              <text
                x="0"
                y="0"
                fill="#38bdf8"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="central"
                transform="rotate(90)"
                className="pointer-events-none select-none font-mono"
              >
                Key of {displayNote(selectedRoot, useFlats)}
              </text>
            </svg>
          </div>
        </div>

        {/* Key Signature Details Card */}
        <div className="md:col-span-5 space-y-3">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
              Active Key Signature
            </div>
            <div className="text-xl font-bold text-white">
              {displayNote(selectedRoot, useFlats)} {isMinorMode ? "Minor" : "Major"}
            </div>

            {(() => {
              const matched = circleOfFifthsData.find(
                (k) => (isMinorMode ? k.minor : k.major) === selectedRoot
              );
              return (
                <div className="mt-3 space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400">Relative Key:</span>
                    <span className="font-bold text-purple-400">
                      {matched
                        ? isMinorMode
                          ? `${displayNote(matched.major, useFlats)} Major`
                          : `${displayNote(matched.minor, useFlats)} Minor`
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400">Accidentals:</span>
                    <span className="font-bold text-cyan-400">
                      {matched?.accidentals || "None"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Scale Type:</span>
                    <span className="font-bold text-amber-400">{selectedScale}</span>
                  </div>
                </div>
              );
            })()}
          </div>

          <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/60 text-xs text-slate-400 flex items-start gap-2">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              Moving <strong>clockwise</strong> adds 1 Sharp (♯). Moving <strong>counter-clockwise</strong> adds 1 Flat (♭).
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircleOfFifths;
