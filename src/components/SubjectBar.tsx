import React from 'react';
import { Subject, SubjectId } from '../types';
import { 
  Calculator, 
  Atom, 
  BookOpen, 
  Languages, 
  Globe, 
  Compass, 
  Scroll,
  LucideIcon
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Calculator,
  Atom,
  BookOpen,
  Languages,
  Globe,
  Compass,
  Scroll,
};

interface SubjectBarProps {
  subjects: Subject[];
  selectedSubject: SubjectId;
  onSelectSubject: (id: SubjectId) => void;
  chapterCounts: Record<SubjectId, number>;
  completionRates?: Record<SubjectId, number>;
}

export const SubjectBar: React.FC<SubjectBarProps> = ({
  subjects,
  selectedSubject,
  onSelectSubject,
  chapterCounts,
  completionRates = {},
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="text-sm font-bold tracking-wide uppercase text-slate-600 flex items-center gap-2">
          <span>વિષય પસંદ કરો (કુલ ૭ વિષય)</span>
          <span className="text-xs font-normal text-slate-400">| કોઈપણ વિષય પર ક્લિક કરો</span>
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {subjects.map((sub) => {
          const IconComponent = ICON_MAP[sub.icon] || BookOpen;
          const isSelected = selectedSubject === sub.id;
          const count = chapterCounts[sub.id] || 0;
          const completion = completionRates[sub.id] ?? 0;

          return (
            <button
              key={sub.id}
              onClick={() => onSelectSubject(sub.id)}
              className={`group relative flex flex-col p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                isSelected
                  ? `${sub.activeColor} ring-2 ring-offset-2 ring-blue-500 scale-[1.02]`
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 shadow-sm'
              }`}
            >
              {/* Header inside card */}
              <div className="flex items-center justify-between w-full mb-1.5">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : `${sub.bgLight} ${sub.textColor}`
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                </div>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-black/20 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {count} પાઠ
                </span>
              </div>

              {/* Subject Title */}
              <span
                className={`text-sm sm:text-base font-bold leading-tight ${
                  isSelected ? 'text-white' : 'text-slate-900'
                }`}
              >
                {sub.name}
              </span>
              <span
                className={`text-[11px] font-medium leading-none mt-0.5 truncate ${
                  isSelected ? 'text-white/80' : 'text-slate-500'
                }`}
              >
                {sub.englishName}
              </span>

              {/* Completion Progress Bar */}
              <div className="mt-2.5 w-full">
                <div className="flex justify-between text-[10px] mb-1 font-semibold">
                  <span className={isSelected ? 'text-white/80' : 'text-slate-500'}>
                    પૂર્ણતા
                  </span>
                  <span className={isSelected ? 'text-white' : 'text-slate-700'}>
                    {completion}%
                  </span>
                </div>
                <div
                  className={`w-full h-1.5 rounded-full overflow-hidden ${
                    isSelected ? 'bg-black/20' : 'bg-slate-100'
                  }`}
                >
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isSelected
                        ? 'bg-white'
                        : completion > 75
                        ? 'bg-emerald-500'
                        : completion > 40
                        ? 'bg-amber-500'
                        : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(0, completion))}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
