import React from 'react';
import { Student, StandardConfig, LessonRecords } from '../types';
import { SUBJECTS } from '../data/defaultData';
import { X, Award, CheckCircle2, BookOpen, User, Sparkles } from 'lucide-react';

interface StudentScorecardModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  standard: StandardConfig;
  records: LessonRecords;
}

export const StudentScorecardModal: React.FC<StudentScorecardModalProps> = ({
  isOpen,
  onClose,
  student,
  standard,
  records,
}) => {
  if (!isOpen || !student) return null;

  let totalChaptersAllSubjects = 0;
  let totalDoneAllSubjects = 0;

  const subjectStats = SUBJECTS.map((sub) => {
    const chapters = standard.chapters[sub.id] || [];
    const count = chapters.length;
    let done = 0;

    chapters.forEach((chap) => {
      const recKey = `${standard.std}_${sub.id}_${chap.id}_${student.id}`;
      if (records[recKey]?.completed) {
        done++;
      }
    });

    totalChaptersAllSubjects += count;
    totalDoneAllSubjects += done;

    const pct = count > 0 ? Math.round((done / count) * 100) : 0;
    return {
      sub,
      count,
      done,
      pct,
    };
  });

  const overallPct =
    totalChaptersAllSubjects > 0
      ? Math.round((totalDoneAllSubjects / totalChaptersAllSubjects) * 100)
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-400 text-blue-950 font-black text-2xl flex items-center justify-center shadow-lg ring-4 ring-white/20">
              {student.rollNo}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold">{student.name}</h3>
                <span className="bg-white/20 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                  રોલ નં. {student.rollNo}
                </span>
              </div>
              <p className="text-blue-200 text-xs mt-1">
                {standard.title} • ૭ વિષય લેસન પ્રગતિ પત્રક
              </p>
            </div>
          </div>

          {/* Quick Summary Pill */}
          <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs">
            <span className="text-blue-200">કુલ લેસન પૂર્ણતા રેટિંગ:</span>
            <div className="flex items-center gap-2">
              <span className="text-amber-300 font-extrabold text-sm">{overallPct}% પૂર્ણ</span>
              <span className="text-white/80">({totalDoneAllSubjects}/{totalChaptersAllSubjects} પાઠ)</span>
            </div>
          </div>
        </div>

        {/* 7 Subjects Breakdown List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            વિષયવાર લેસન પ્રોગ્રેસ (૭ વિષયો)
          </h4>

          {subjectStats.map(({ sub, count, done, pct }) => (
            <div
              key={sub.id}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${sub.textColor} bg-current`} />
                  <span className="text-sm font-bold text-slate-800">{sub.name}</span>
                  <span className="text-xs text-slate-400">({sub.englishName})</span>
                </div>
                <div className="text-xs font-bold text-slate-700">
                  <span className="text-emerald-700 font-extrabold">{done}</span> / {count} પાઠ
                  <span className="ml-2 font-black text-blue-600">({pct}%)</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    pct === 100
                      ? 'bg-emerald-500'
                      : pct >= 50
                      ? 'bg-blue-600'
                      : 'bg-amber-500'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition shadow-sm cursor-pointer"
          >
            બંધ કરો
          </button>
        </div>
      </div>
    </div>
  );
};
