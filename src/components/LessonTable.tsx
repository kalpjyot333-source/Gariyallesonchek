import React, { useState } from 'react';
import { Student, LessonStatus } from '../types';
import { 
  Search, 
  Check, 
  X, 
  Edit3, 
  Shuffle, 
  BarChart2, 
  MessageSquare,
  Award,
  Clock,
  Sparkles
} from 'lucide-react';

interface LessonTableProps {
  students: Student[];
  records: Record<string, LessonStatus>;
  getRecordKey: (studentId: string) => string;
  onToggleStatus: (studentId: string, currentStatus: boolean) => void;
  onSaveStudentName: (studentId: string, newName: string) => void;
  onSaveStudentNote?: (studentId: string, note: string) => void;
  onOpenScorecard: (student: Student) => void;
  chapterTitle: string;
  subjectName: string;
}

export const LessonTable: React.FC<LessonTableProps> = ({
  students,
  records,
  getRecordKey,
  onToggleStatus,
  onSaveStudentName,
  onSaveStudentNote,
  onOpenScorecard,
  chapterTitle,
  subjectName,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'done' | 'pending'>('all');
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [tempName, setTempName] = useState('');
  const [editingNoteStudentId, setEditingNoteStudentId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState('');
  const [randomStudent, setRandomStudent] = useState<Student | null>(null);
  const [showRandomModal, setShowRandomModal] = useState(false);

  // Compute metrics
  let doneCount = 0;
  students.forEach((s) => {
    const key = getRecordKey(s.id);
    if (records[key]?.completed) doneCount++;
  });
  const pendingCount = students.length - doneCount;
  const completionPercentage = students.length > 0 ? Math.round((doneCount / students.length) * 100) : 0;

  // Filter students
  const filteredStudents = students.filter((s) => {
    const key = getRecordKey(s.id);
    const isDone = !!records[key]?.completed;

    if (filterMode === 'done' && !isDone) return false;
    if (filterMode === 'pending' && isDone) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      const matchName = s.name.toLowerCase().includes(q);
      const matchRoll = s.rollNo.toString().includes(q);
      return matchName || matchRoll;
    }

    return true;
  });

  const handleStartEditName = (student: Student) => {
    setEditingStudentId(student.id);
    setTempName(student.name);
  };

  const handleFinishEditName = (studentId: string) => {
    if (tempName.trim()) {
      onSaveStudentName(studentId, tempName.trim());
    }
    setEditingStudentId(null);
  };

  const handleSaveNote = (studentId: string) => {
    if (onSaveStudentNote) {
      onSaveStudentNote(studentId, tempNote.trim());
    }
    setEditingNoteStudentId(null);
  };

  const handlePickRandom = () => {
    if (students.length === 0) return;
    const randomIndex = Math.floor(Math.random() * students.length);
    setRandomStudent(students[randomIndex]);
    setShowRandomModal(true);
  };

  return (
    <div className="space-y-4">
      {/* Stats Summary Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="grid grid-cols-3 gap-3 flex-1">
            {/* Total */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-center">
              <span className="text-xs font-semibold text-slate-500 block">કુલ વિદ્યાર્થી</span>
              <span className="text-xl sm:text-2xl font-black text-slate-800">{students.length}</span>
            </div>

            {/* Completed */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
              <span className="text-xs font-semibold text-emerald-700 block">લેસન પૂર્ણ</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-700">
                {doneCount}
              </span>
            </div>

            {/* Pending */}
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-center">
              <span className="text-xs font-semibold text-rose-700 block">બાકી લેસન</span>
              <span className="text-xl sm:text-2xl font-black text-rose-700">
                {pendingCount}
              </span>
            </div>
          </div>

          {/* Progress gauge and quick random button */}
          <div className="flex items-center gap-4 lg:border-l lg:border-slate-100 lg:pl-6">
            <div className="flex-1 lg:w-48">
              <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                <span className="text-slate-600">આ પાઠ પૂર્ણતા</span>
                <span className="text-blue-700 font-extrabold">{completionPercentage}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    completionPercentage === 100
                      ? 'bg-emerald-500'
                      : completionPercentage > 50
                      ? 'bg-blue-600'
                      : 'bg-amber-500'
                  }`}
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>

            <button
              onClick={handlePickRandom}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs sm:text-sm font-semibold transition active:scale-95 shrink-0 cursor-pointer shadow-xs"
              title="લેસન ચેક કરવા રેન્ડમ વિદ્યાર્થી પસંદ કરો"
            >
              <Shuffle className="w-4 h-4 text-purple-600" />
              <span className="hidden sm:inline">રેન્ડમ પૂછો</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="વિદ્યાર્થીનું નામ અથવા રોલ નંબર શોધો..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-slate-800"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl shrink-0 self-start sm:self-auto border border-slate-200">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              filterMode === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            બધા ({students.length})
          </button>
          <button
            onClick={() => setFilterMode('done')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
              filterMode === 'done'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Check className="w-3 h-3 text-emerald-600" />
            <span>પૂર્ણ ({doneCount})</span>
          </button>
          <button
            onClick={() => setFilterMode('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
              filterMode === 'pending'
                ? 'bg-white text-rose-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <X className="w-3 h-3 text-rose-600" />
            <span>બાકી ({pendingCount})</span>
          </button>
        </div>
      </div>

      {/* Main Student Register Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4 text-center w-16">રોલ</th>
                <th className="py-3.5 px-4 text-left">વિદ્યાર્થીનું નામ (સુધારવા ક્લિક કરો)</th>
                <th className="py-3.5 px-4 text-center w-36">સ્થિતિ</th>
                <th className="py-3.5 px-4 text-center w-28">ચેક કરો</th>
                <th className="py-3.5 px-4 text-left w-48 hidden md:table-cell">નોંધ / શેરો</th>
                <th className="py-3.5 px-4 text-center w-20">પ્રોફાઇલ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <p className="font-semibold text-base">કોઈ વિદ્યાર્થી મળ્યા નથી.</p>
                    <p className="text-xs mt-1">શોધ શબ્દ અથવા ફિલ્ટર બદલો.</p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const key = getRecordKey(student.id);
                  const record = records[key];
                  const isDone = !!record?.completed;

                  return (
                    <tr
                      key={student.id}
                      className={`group transition-colors ${
                        isDone
                          ? 'bg-emerald-50/30 hover:bg-emerald-50/60'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      {/* Roll Number */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold text-xs bg-slate-100 text-slate-700 group-hover:bg-blue-100 group-hover:text-blue-800 transition">
                          {student.rollNo}
                        </span>
                      </td>

                      {/* Student Name (Inline Editable) */}
                      <td className="py-3.5 px-4">
                        {editingStudentId === student.id ? (
                          <div className="flex items-center gap-1.5 max-w-sm">
                            <input
                              type="text"
                              value={tempName}
                              onChange={(e) => setTempName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleFinishEditName(student.id);
                                if (e.key === 'Escape') setEditingStudentId(null);
                              }}
                              autoFocus
                              className="px-2.5 py-1 text-sm border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-slate-900 w-full"
                            />
                            <button
                              onClick={() => handleFinishEditName(student.id)}
                              className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                              title="સેવ"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingStudentId(null)}
                              className="p-1 rounded bg-slate-200 text-slate-700 hover:bg-slate-300"
                              title="રદ"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between group/name max-w-md">
                            <button
                              onClick={() => handleStartEditName(student)}
                              className="text-left font-semibold text-slate-800 hover:text-blue-600 transition flex items-center gap-2 cursor-pointer"
                              title="નામ સુધારવા ક્લિક કરો"
                            >
                              <span>{student.name}</span>
                              <Edit3 className="w-3.5 h-3.5 opacity-0 group-hover/name:opacity-100 text-slate-400 hover:text-blue-600 transition" />
                            </button>

                            {record?.checkedAt && (
                              <span className="hidden xl:inline-flex items-center gap-1 text-[11px] text-slate-400">
                                <Clock className="w-3 h-3" />
                                {new Date(record.checkedAt).toLocaleTimeString('gu-IN', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition shadow-2xs ${
                            isDone
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-rose-100 text-rose-800 border border-rose-300'
                          }`}
                        >
                          {isDone ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>પૂર્ણ</span>
                            </>
                          ) : (
                            <>
                              <X className="w-3.5 h-3.5 stroke-[3]" />
                              <span>બાકી</span>
                            </>
                          )}
                        </span>
                      </td>

                      {/* Interactive Toggle Checkbox */}
                      <td className="py-3.5 px-4 text-center">
                        <label className="inline-flex items-center justify-center cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={isDone}
                            onChange={() => onToggleStatus(student.id, isDone)}
                            className="sr-only"
                          />
                          <div
                            className={`w-11 h-7 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out ${
                              isDone ? 'bg-emerald-600' : 'bg-slate-300'
                            }`}
                          >
                            <div
                              className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ease-in-out flex items-center justify-center ${
                                isDone ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            >
                              {isDone ? (
                                <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                              ) : (
                                <X className="w-3 h-3 text-slate-400" />
                              )}
                            </div>
                          </div>
                        </label>
                      </td>

                      {/* Remarks / Note */}
                      <td className="py-3.5 px-4 hidden md:table-cell">
                        {editingNoteStudentId === student.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              placeholder="શેરો લખો..."
                              value={tempNote}
                              onChange={(e) => setTempNote(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveNote(student.id);
                                if (e.key === 'Escape') setEditingNoteStudentId(null);
                              }}
                              autoFocus
                              className="px-2 py-0.5 text-xs border border-blue-400 rounded focus:outline-none bg-white w-full"
                            />
                            <button
                              onClick={() => handleSaveNote(student.id)}
                              className="p-1 rounded bg-blue-600 text-white text-xs"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingNoteStudentId(student.id);
                              setTempNote(record?.note || '');
                            }}
                            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 text-left max-w-[180px] truncate"
                            title="નોંધ ઉમેરો"
                          >
                            <MessageSquare className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className={record?.note ? 'font-medium text-slate-700' : 'text-slate-400 italic'}>
                              {record?.note || '+ નોંધ ઉમેરો'}
                            </span>
                          </button>
                        )}
                      </td>

                      {/* Student 7-Subject Scorecard */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => onOpenScorecard(student)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition cursor-pointer"
                          title="આ વિદ્યાર્થીનો ૭ વિષયનો રિપોર્ટ જુઓ"
                        >
                          <BarChart2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Random Student Modal / Celebration */}
      {showRandomModal && randomStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 text-center border border-purple-200">
            <div className="w-16 h-16 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-4 ring-8 ring-purple-50">
              <Sparkles className="w-8 h-8 text-purple-600 animate-bounce" />
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              રેન્ડમ પસંદ થયેલ વિદ્યાર્થી
            </span>

            <h3 className="text-2xl font-black text-slate-900 mt-3">
              {randomStudent.name}
            </h3>
            <p className="text-sm font-semibold text-slate-500 mt-1">
              રોલ નંબર: <strong className="text-purple-700 text-base">{randomStudent.rollNo}</strong>
            </p>

            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
              વિષય: <strong>{subjectName}</strong> • {chapterTitle}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  const key = getRecordKey(randomStudent.id);
                  const isDone = !!records[key]?.completed;
                  onToggleStatus(randomStudent.id, isDone);
                  setShowRandomModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition shadow-sm cursor-pointer"
              >
                લેસન 'પૂર્ણ' કરો
              </button>
              <button
                onClick={() => setShowRandomModal(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition cursor-pointer"
              >
                બંધ કરો
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
