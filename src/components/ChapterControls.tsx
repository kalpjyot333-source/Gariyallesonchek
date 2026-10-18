import React from 'react';
import { Chapter, Subject, StandardConfig } from '../types';
import { 
  Plus, 
  Minus, 
  Settings2, 
  CheckCheck, 
  XCircle, 
  RotateCcw, 
  BookMarked,
  FileSpreadsheet,
  Grid,
  PenLine,
  Check
} from 'lucide-react';

interface ChapterControlsProps {
  standards: Record<string, StandardConfig>;
  currentStd: string;
  onChangeStd: (std: string) => void;
  currentSubject: Subject;
  chapters: Chapter[];
  currentChapterId: number;
  onChangeChapter: (id: number) => void;
  onQuickAddChapter: () => void;
  onQuickRemoveChapter: () => void;
  onOpenChapterManager: () => void;
  onUpdateCurrentChapterName: (newName: string) => void;
  onMarkAllDone: () => void;
  onMarkAllPending: () => void;
  onResetChapter: () => void;
  onExportCSV: () => void;
  viewMode: 'table' | 'matrix';
  onToggleViewMode: (mode: 'table' | 'matrix') => void;
}

export const ChapterControls: React.FC<ChapterControlsProps> = ({
  standards,
  currentStd,
  onChangeStd,
  currentSubject,
  chapters,
  currentChapterId,
  onChangeChapter,
  onQuickAddChapter,
  onQuickRemoveChapter,
  onOpenChapterManager,
  onUpdateCurrentChapterName,
  onMarkAllDone,
  onMarkAllPending,
  onResetChapter,
  onExportCSV,
  viewMode,
  onToggleViewMode,
}) => {
  const currentChapter = chapters.find((c) => c.id === currentChapterId) || chapters[0] || {
    id: 1,
    number: 1,
    name: 'પાઠ ૧',
  };

  const isSelfWrittenSubject = currentSubject.id !== 'hindi' && currentSubject.id !== 'sanskrit';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5 mb-6">
      {/* Primary Selection Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end pb-4 border-b border-slate-100">
        
        {/* Standard Select */}
        <div className="md:col-span-4 flex flex-col">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>ધોરણ પસંદ કરો:</span>
            <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
              {standards[currentStd]?.students.length || 0} વિદ્યાર્થીઓ
            </span>
          </label>
          <div className="relative">
            <select
              value={currentStd}
              onChange={(e) => onChangeStd(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 cursor-pointer transition shadow-xs"
            >
              {Object.keys(standards).map((key) => (
                <option key={key} value={key}>
                  {standards[key].title} ({standards[key].students.length} વિદ્યાર્થીઓ)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Chapter Select with Quick + and - buttons */}
        <div className="md:col-span-5 flex flex-col">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <BookMarked className="w-3.5 h-3.5 text-blue-600" />
              <span>પાઠ નંબર પસંદ કરો:</span>
            </label>
            <span className="text-[11px] font-medium text-slate-500">
              કુલ {chapters.length} પાઠ
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <select
              value={currentChapterId}
              onChange={(e) => onChangeChapter(Number(e.target.value))}
              disabled={chapters.length === 0}
              className="flex-1 min-w-0 bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 cursor-pointer transition truncate shadow-xs"
            >
              {chapters.map((chap) => (
                <option key={chap.id} value={chap.id}>
                  {chap.name}
                </option>
              ))}
            </select>

            {/* Quick Decrease Chapter (-) */}
            <button
              onClick={onQuickRemoveChapter}
              disabled={chapters.length <= 1}
              className="px-2.5 py-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 disabled:opacity-40 disabled:hover:bg-red-50 disabled:cursor-not-allowed transition font-bold flex items-center justify-center shrink-0 shadow-xs cursor-pointer"
              title="પાઠ ઘટાડો (- ૧ પાઠ)"
            >
              <Minus className="w-4 h-4" />
            </button>

            {/* Quick Increase Chapter (+) */}
            <button
              onClick={onQuickAddChapter}
              className="px-2.5 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition font-bold flex items-center justify-center shrink-0 shadow-xs cursor-pointer"
              title="પાઠ વધારો (+ ૧ પાઠ)"
            >
              <Plus className="w-4 h-4" />
            </button>

            {/* Detail Chapter Manager */}
            <button
              onClick={onOpenChapterManager}
              className="px-3 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition text-xs font-bold flex items-center gap-1 shrink-0 shadow-xs cursor-pointer"
              title="પાઠ વ્યવસ્થાપન (નામ અને સંખ્યા બદલો)"
            >
              <Settings2 className="w-4 h-4" />
              <span className="hidden sm:inline">બધા પાઠ મેનેજર</span>
            </button>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="md:col-span-3 flex flex-col justify-end">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <span>દૃશ્ય મોડ:</span>
          </label>
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => onToggleViewMode('table')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>દૈનિક ચેક</span>
            </button>
            <button
              onClick={() => onToggleViewMode('matrix')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                viewMode === 'matrix'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>બધા પાઠ મેટ્રિક્સ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Direct In-Place Chapter Name Writer Field */}
      <div className={`mt-3.5 p-3 rounded-xl border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 ${
        isSelfWrittenSubject 
          ? 'bg-amber-50/70 border-amber-200/90' 
          : 'bg-indigo-50/60 border-indigo-200/80'
      }`}>
        <div className="flex items-center gap-2 shrink-0">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isSelfWrittenSubject ? 'bg-amber-500 text-white' : 'bg-indigo-600 text-white'
          }`}>
            <PenLine className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <label className="text-xs font-black text-slate-800">
                પાઠ {currentChapter.number} નું નામ (અહીં જાતે લખો):
              </label>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                isSelfWrittenSubject
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-indigo-100 text-indigo-800 border-indigo-200'
              }`}>
                {isSelfWrittenSubject ? '✍️ શિક્ષક જાતે લખી શકે' : '📖 પાઠ્યપુસ્તક સિલેબસ'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              અહીં પાઠનું જે નામ લખશો તે રજિસ્ટર, મેટ્રિક્સ અને પ્રિન્ટમાં આપોઆપ આવી જશે.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-1 max-w-lg">
          <input
            type="text"
            value={currentChapter.name}
            onChange={(e) => onUpdateCurrentChapterName(e.target.value)}
            placeholder={`પાઠ ${currentChapter.number} નું નામ અહીં લખો (દા.ત. સંમેય સંખ્યાઓ)...`}
            className="w-full bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 rounded-xl px-3.5 py-1.5 text-sm font-semibold text-slate-900 shadow-xs placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          {/* Mark All Complete */}
          <button
            onClick={onMarkAllDone}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition active:scale-95 cursor-pointer"
          >
            <CheckCheck className="w-4 h-4" />
            <span>બધાને 'પૂર્ણ' માર્ક કરો</span>
          </button>

          {/* Mark All Pending */}
          <button
            onClick={onMarkAllPending}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition active:scale-95 cursor-pointer"
          >
            <XCircle className="w-4 h-4" />
            <span>બધાને 'બાકી' માર્ક કરો</span>
          </button>

          {/* Reset Lesson */}
          <button
            onClick={onResetChapter}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-xs sm:text-sm transition active:scale-95 cursor-pointer"
            title="આ પાઠનું સ્ટેટસ ડિલીટ કરો"
          >
            <RotateCcw className="w-4 h-4" />
            <span>આ પાઠ સાફ (Reset)</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* CSV Export */}
          <button
            onClick={onExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-medium text-xs sm:text-sm transition active:scale-95 cursor-pointer"
            title="આ પાઠનો ડેટા એક્સેલ/CSV ફાઇલમાં ડાઉનલોડ કરો"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>CSV એક્સપોર્ટ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
