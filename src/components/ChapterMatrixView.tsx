import React from 'react';
import { Student, Chapter, LessonRecords, Subject } from '../types';
import { Check, X, BookOpen, Layers } from 'lucide-react';

interface ChapterMatrixViewProps {
  students: Student[];
  chapters: Chapter[];
  subject: Subject;
  std: string;
  records: LessonRecords;
  onToggleMatrixCell: (studentId: string, chapterId: number, currentVal: boolean) => void;
  onSelectChapter: (chapterId: number) => void;
}

export const ChapterMatrixView: React.FC<ChapterMatrixViewProps> = ({
  students,
  chapters,
  subject,
  std,
  records,
  onToggleMatrixCell,
  onSelectChapter,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header Info */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl ${subject.bgLight} ${subject.textColor} border ${subject.borderCol}`}>
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">
              {subject.name} - સમગ્ર પાઠ પ્રોગ્રેસ મેટ્રિક્સ
            </h3>
            <p className="text-xs text-slate-500">
              કુલ {chapters.length} પાઠ • {students.length} વિદ્યાર્થીઓ • કોઈપણ ખાના પર ક્લિક કરી પૂર્ણ/બાકી બદલી શકો છો
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            <Check className="w-3.5 h-3.5 stroke-[3]" /> પૂર્ણ
          </span>
          <span className="flex items-center gap-1.5 text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
            <X className="w-3.5 h-3.5 stroke-[3]" /> બાકી
          </span>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="overflow-x-auto max-h-[650px]">
        <table className="w-full border-collapse text-xs">
          <thead className="sticky top-0 z-20 bg-slate-100/95 backdrop-blur-xs text-slate-700 font-bold border-b border-slate-300">
            <tr>
              <th className="p-3 text-center w-14 sticky left-0 z-30 bg-slate-100 border-r border-slate-300">
                રોલ
              </th>
              <th className="p-3 text-left min-w-[160px] sticky left-14 z-30 bg-slate-100 border-r border-slate-300">
                વિદ્યાર્થીનું નામ
              </th>
              {chapters.map((chap) => (
                <th
                  key={chap.id}
                  onClick={() => onSelectChapter(chap.id)}
                  className="p-2 text-center min-w-[50px] border-r border-slate-200 hover:bg-blue-100 transition cursor-pointer"
                  title={`${chap.name} (આ પાઠ પર જવા ક્લિક કરો)`}
                >
                  <div className="font-bold text-slate-900">પા.{chap.number}</div>
                </th>
              ))}
              <th className="p-3 text-center min-w-[70px] bg-slate-100 font-extrabold text-blue-900 border-l border-slate-300">
                કુલ પૂર્ણ
              </th>
              <th className="p-3 text-center min-w-[60px] bg-slate-100 font-extrabold text-slate-900">
                %
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {students.map((student) => {
              let studentDoneChapters = 0;

              return (
                <tr key={student.id} className="hover:bg-slate-50/80 transition">
                  {/* Roll No */}
                  <td className="p-2 text-center font-bold text-slate-700 sticky left-0 z-10 bg-white border-r border-slate-200">
                    {student.rollNo}
                  </td>

                  {/* Student Name */}
                  <td className="p-2 font-medium text-slate-900 sticky left-14 z-10 bg-white border-r border-slate-200 truncate max-w-[200px]">
                    {student.name}
                  </td>

                  {/* Chapter Cells */}
                  {chapters.map((chap) => {
                    const recKey = `${std}_${subject.id}_${chap.id}_${student.id}`;
                    const isDone = !!records[recKey]?.completed;
                    if (isDone) studentDoneChapters++;

                    return (
                      <td
                        key={chap.id}
                        onClick={() => onToggleMatrixCell(student.id, chap.id, isDone)}
                        className={`p-1.5 text-center border-r border-slate-200 cursor-pointer select-none transition ${
                          isDone
                            ? 'bg-emerald-50/70 hover:bg-emerald-100 text-emerald-700'
                            : 'bg-rose-50/40 hover:bg-rose-100 text-rose-600'
                        }`}
                        title={`${student.name} - ${chap.name}: ${isDone ? 'પૂર્ણ' : 'બાકી'}`}
                      >
                        <div className="flex items-center justify-center">
                          {isDone ? (
                            <Check className="w-4 h-4 stroke-[3]" />
                          ) : (
                            <span className="text-slate-300 font-bold">-</span>
                          )}
                        </div>
                      </td>
                    );
                  })}

                  {/* Total Done */}
                  <td className="p-2 text-center font-black text-blue-900 bg-slate-50 border-l border-slate-200">
                    {studentDoneChapters} / {chapters.length}
                  </td>

                  {/* Percentage */}
                  <td className="p-2 text-center font-bold bg-slate-50">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[11px] font-black ${
                        chapters.length > 0 && Math.round((studentDoneChapters / chapters.length) * 100) === 100
                          ? 'bg-emerald-100 text-emerald-800'
                          : chapters.length > 0 && Math.round((studentDoneChapters / chapters.length) * 100) >= 50
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {chapters.length > 0
                        ? Math.round((studentDoneChapters / chapters.length) * 100)
                        : 0}
                      %
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
