import React, { useState, useEffect } from "react";
import {
  Note,
  ScaleType,
  allNotes,
  scaleDefinitions,
  generateScale,
  displayNote,
} from "@/utils/scales";
import { playNote, playChord } from "@/utils/audio";
import { Trophy, Flame, HelpCircle, CheckCircle2, XCircle, RotateCcw, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Question {
  prompt: string;
  type: "in-scale" | "degree" | "formula";
  root: Note;
  scale: ScaleType;
  correctAnswer: string;
  options: string[];
  explanation: string;
}

interface ScaleQuizProps {
  useFlats?: boolean;
}

const ScaleQuiz: React.FC<ScaleQuizProps> = ({ useFlats = false }) => {
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Generate a random question
  const generateNewQuestion = () => {
    setIsAnswered(false);
    setSelectedAnswer(null);

    const randomRoot = allNotes[Math.floor(Math.random() * allNotes.length)];
    const scaleKeys = Object.keys(scaleDefinitions) as ScaleType[];
    const randomScale = scaleKeys[Math.floor(Math.random() * scaleKeys.length)];
    const scaleNotes = generateScale(randomRoot, randomScale);
    const def = scaleDefinitions[randomScale];

    const qTypes: ("in-scale" | "degree" | "formula")[] = ["in-scale", "degree", "formula"];
    const chosenType = qTypes[Math.floor(Math.random() * qTypes.length)];

    let prompt = "";
    let correctAnswer = "";
    let options: string[] = [];
    let explanation = "";

    if (chosenType === "in-scale") {
      const isPositive = Math.random() > 0.5;
      if (isPositive) {
        // Find note that IS in scale
        correctAnswer = displayNote(scaleNotes[Math.floor(Math.random() * scaleNotes.length)], useFlats);
        prompt = `Which note IS part of the ${displayNote(randomRoot, useFlats)} ${def.name} scale?`;

        // Generate wrong options (notes NOT in scale)
        const wrongNotes = allNotes
          .filter((n) => !scaleNotes.includes(n))
          .map((n) => displayNote(n, useFlats));
        const shuffledWrongs = wrongNotes.sort(() => 0.5 - Math.random()).slice(0, 3);
        options = [correctAnswer, ...shuffledWrongs].sort(() => 0.5 - Math.random());
        explanation = `The notes in ${displayNote(randomRoot, useFlats)} ${def.name} are: ${scaleNotes
          .map((n) => displayNote(n, useFlats))
          .join(", ")}.`;
      } else {
        // Find note that is NOT in scale
        const wrongNotes = allNotes.filter((n) => !scaleNotes.includes(n));
        correctAnswer = displayNote(wrongNotes[Math.floor(Math.random() * wrongNotes.length)], useFlats);
        prompt = `Which note is NOT in the ${displayNote(randomRoot, useFlats)} ${def.name} scale?`;

        // 3 correct notes as decoys
        const decoys = scaleNotes
          .map((n) => displayNote(n, useFlats))
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
        options = [correctAnswer, ...decoys].sort(() => 0.5 - Math.random());
        explanation = `${correctAnswer} is not in ${displayNote(randomRoot, useFlats)} ${
          def.name
        }. Scale notes are: ${scaleNotes.map((n) => displayNote(n, useFlats)).join(", ")}.`;
      }
    } else if (chosenType === "degree") {
      const degreeIdx = Math.floor(Math.random() * Math.min(scaleNotes.length, 7));
      const targetNote = scaleNotes[degreeIdx];
      correctAnswer = displayNote(targetNote, useFlats);
      prompt = `What is the ${degreeIdx + 1}${
        degreeIdx === 0 ? "st" : degreeIdx === 1 ? "nd" : degreeIdx === 2 ? "rd" : "th"
      } note (degree ${def.formula[degreeIdx] || degreeIdx + 1}) of ${displayNote(
        randomRoot,
        useFlats
      )} ${def.name}?`;

      const wrongNotes = allNotes
        .filter((n) => n !== targetNote)
        .map((n) => displayNote(n, useFlats))
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      options = [correctAnswer, ...wrongNotes].sort(() => 0.5 - Math.random());
      explanation = `The ${degreeIdx + 1} degree is ${correctAnswer}. Full scale: ${scaleNotes
        .map((n) => displayNote(n, useFlats))
        .join(" - ")}.`;
    } else {
      // Step pattern formula question
      prompt = `What is the step pattern for the ${def.name}?`;
      correctAnswer = def.stepPattern;

      const otherPatterns = Array.from(new Set(Object.values(scaleDefinitions).map((s) => s.stepPattern)))
        .filter((p) => p !== correctAnswer)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      options = [correctAnswer, ...otherPatterns].sort(() => 0.5 - Math.random());
      explanation = `${def.name} follows the pattern: ${correctAnswer}. (${def.description})`;
    }

    setCurrentQuestion({
      prompt,
      type: chosenType,
      root: randomRoot,
      scale: randomScale,
      correctAnswer,
      options,
      explanation,
    });
  };

  useEffect(() => {
    generateNewQuestion();
  }, []);

  const handleSelectAnswer = (option: string) => {
    if (isAnswered || !currentQuestion) return;

    setSelectedAnswer(option);
    setIsAnswered(true);

    if (option === currentQuestion.correctAnswer) {
      setScore((s) => s + 10);
      setStreak((st) => {
        const next = st + 1;
        if (next > bestStreak) setBestStreak(next);
        return next;
      });
      // Play cheerful chord
      playChord(["C4", "E4", "G4", "C5"], 0.6);
    } else {
      setStreak(0);
      // Play low flat note
      playNote("C3", 0.5);
    }
  };

  if (!currentQuestion) return null;

  return (
    <div className="w-full max-w-3xl mx-auto bg-slate-900/80 backdrop-blur border border-slate-800 rounded-xl p-5 shadow-lg">
      {/* Header & Stats */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <span className="font-bold text-base text-white">Music Theory & Ear Quiz</span>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1 text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
            <Flame className="w-4 h-4" /> Streak: {streak} (Best: {bestStreak})
          </div>
          <div className="bg-primary/20 text-primary px-3 py-1 rounded-lg border border-primary/30">
            Score: {score}
          </div>
        </div>
      </div>

      {/* Question Prompt */}
      <div className="my-6 text-center">
        <span className="text-xs uppercase tracking-widest font-semibold text-cyan-400 block mb-2">
          Question
        </span>
        <h3 className="text-lg md:text-xl font-bold text-white max-w-xl mx-auto">
          {currentQuestion.prompt}
        </h3>
      </div>

      {/* Answer Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {currentQuestion.options.map((opt, i) => {
          const isCorrect = opt === currentQuestion.correctAnswer;
          const isSelected = opt === selectedAnswer;

          let btnStyle = "bg-slate-800/80 border-slate-700 text-white hover:bg-slate-700";
          if (isAnswered) {
            if (isCorrect) {
              btnStyle = "bg-emerald-600/30 border-emerald-500 text-emerald-300 font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]";
            } else if (isSelected) {
              btnStyle = "bg-rose-600/30 border-rose-500 text-rose-300 font-bold";
            } else {
              btnStyle = "bg-slate-900/60 border-slate-800 text-slate-500 opacity-60";
            }
          }

          return (
            <button
              key={`${opt}-${i}`}
              onClick={() => handleSelectAnswer(opt)}
              disabled={isAnswered}
              className={cn(
                "p-4 rounded-xl border flex items-center justify-between text-base font-semibold transition-all transform active:scale-98",
                btnStyle
              )}
            >
              <span>{opt}</span>
              {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-400" />}
            </button>
          );
        })}
      </div>

      {/* Feedback & Next Button */}
      {isAnswered && (
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 animate-fade-in">
          <div className="text-xs text-slate-300 max-w-md">
            <strong className="block text-white mb-0.5">
              {selectedAnswer === currentQuestion.correctAnswer ? "🎉 Correct!" : "❌ Incorrect"}
            </strong>
            {currentQuestion.explanation}
          </div>

          <button
            onClick={generateNewQuestion}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg transition-all ml-auto"
          >
            <span>Next Question</span>
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ScaleQuiz;
