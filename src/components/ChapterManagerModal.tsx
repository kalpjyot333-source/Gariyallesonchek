import React, { useState } from 'react';
import { Chapter, Subject } from '../types';
import { 
  X, 
  Plus, 
  Trash2, 
  RotateCcw, 
  BookOpen, 
  AlertCircle,
  Hash,
  PenLine,
  FileText,
  Eraser
} from 'lucide-react';

interface ChapterManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  stdTitle: string;
  subject: Subject;
  chapters: Chapter[];
  onUpdateChapters: (newChapters: Chapter[]) => void;
  onResetToDefaults: () => void;
}

export const ChapterManagerModal: React.FC<ChapterManagerModalProps> = ({
  isOpen,
  onClose,
  stdTitle,
  subject,
  chapters,
  onUpdateChapters,
  onResetToDefaults,
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'batch'>('list');
  const [newChapterName, setNewChapterName] = useState('');
  const [targetCount, setTargetCount] = useState<number>(chapters.length);
  const [batchText, setBatchText] = useState('');

  if (!isOpen) return null;

  const isSelfWrittenSubject = subject.id !== 'hindi' && subject.id !== 'sanskrit';

  const handleUpdateSingleName = (chapId: number, newName: string) => {
    const updated = chapters.map((c) =>
      c.id === chapId ? { ...c, name: newName } : c
    );
    onUpdateChapters(updated);
  };

  const handleAddChapter = (e: React.FormEvent) => {
    e.preventDefault();
    const nextNum = chapters.length > 0 ? Math.max(...chapters.map((c) => c.number)) + 1 : 1;
    const name = newChapterName.trim() ? newChapterName.trim() : `પાઠ ${nextNum}`;
    const nextId = chapters.length > 0 ? Math.max(...chapters.map((c) => c.id)) + 1 : 1;

    const updated = [...chapters, { id: nextId, number: nextNum, name }];
    onUpdateChapters(updated);
    setNewChapterName('');
    setTargetCount(updated.length);
  };

  const handleDeleteChapter = (chapId: number) => {
    if (chapters.length <= 1) {
      alert('ઓછામાં ઓછો ૧ પાઠ હોવો જરૂરી છે.');
      return;
    }
    const toDelete = chapters.find((c) => c.id === chapId);
    if (confirm(`શું તમે '${toDelete?.name}' પાઠ કાઢી નાખવા માંગો છો?`)) {
      const filtered = chapters.filter((c) => c.id !== chapId);
      // Re-number chapters sequentially
      const renumbered = filtered.map((c, idx) => ({
        ...c,
        number: idx + 1,
      }));
      onUpdateChapters(renumbered);
      setTargetCount(renumbered.length);
    }
  };

  const handleApplyCount = () => {
    const count = Math.max(1, Math.min(50, Number(targetCount)));
    if (count === chapters.length) return;

    if (count > chapters.length) {
      // Increase chapters
      const additional: Chapter[] = [];
      const currentMaxId = chapters.length > 0 ? Math.max(...chapters.map((c) => c.id)) : 0;
      for (let i = chapters.length + 1; i <= count; i++) {
        additional.push({
          id: currentMaxId + (i - chapters.length),
          number: i,
          name: `પાઠ ${i}`,
        });
      }
      const updated = [...chapters, ...additional];
      onUpdateChapters(updated);
    } else {
      // Decrease chapters
      if (confirm(`શું તમે પાઠની સંખ્યા ${chapters.length} થી ઘટાડીને ${count} કરવા માંગો છો? છેલ્લેથી ${chapters.length - count} પાઠ દૂર થશે.`)) {
        const updated = chapters.slice(0, count);
        onUpdateChapters(updated);
      } else {
        setTargetCount(chapters.length);
      }
    }
  };

  const handleBatchImport = () => {
    if (!batchText.trim()) return;
    const lines = batchText
      .split(/[\r\n]+/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) return;

    if (confirm(`શું તમે આ ${lines.length} પાઠના નામ સેટ કરવા માંગો છો?`)) {
      const newChapters: Chapter[] = lines.map((name, index) => {
        const num = index + 1;
        // If teacher typed just the name without "પાઠ X:", we can leave it as they wrote
        return {
          id: num,
          number: num,
          name: name.startsWith('પાઠ') ? name : `પાઠ ${num}: ${name}`,
        };
      });
      onUpdateChapters(newChapters);
      setTargetCount(newChapters.length);
      setBatchText('');
      setActiveTab('list');
    }
  };

  const handleClearAllToNumbered = () => {
    if (confirm('શું તમે બધા પાઠના નામ મૂળ સાદા "પાઠ ૧, પાઠ ૨..." કરવા માંગો છો?')) {
      const resetList: Chapter[] = chapters.map((c, i) => ({
        ...c,
        name: `પાઠ ${i + 1}`,
      }));
      onUpdateChapters(resetList);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${subject.bgLight} ${subject.textColor} flex items-center justify-center border ${subject.borderCol}`}>
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  પાઠ વધ-ઘટ અને નામાવલી વ્યવસ્થાપન
                </h3>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                  isSelfWrittenSubject
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-indigo-100 text-indigo-800 border-indigo-200'
                }`}>
                  {isSelfWrittenSubject ? '✍️ જાતે લખાય છે' : '📖 પાઠ્યપુસ્તક આધારિત'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {stdTitle} • વિષય: <span className="font-semibold text-slate-800">{subject.name}</span> ({subject.englishName})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 bg-slate-100/70 p-1">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              activeTab === 'list'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            પાઠ સૂચિ અને નામ સુધારો ({chapters.length} પાઠ)
          </button>
          <button
            onClick={() => setActiveTab('batch')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'batch'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>એક સાથે બધા પાઠના નામ પેસ્ટ કરો (Batch Paste)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Quick chapter count batch adjustment */}
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-blue-900 flex items-center gap-1.5">
                <Hash className="w-4 h-4 text-blue-700" />
                <span>કુલ પાઠ સંખ્યા વધારો / ઘટાડો</span>
              </h4>
              <p className="text-xs text-blue-700/80">
                હાલમાં કુલ <strong className="text-blue-950 font-bold">{chapters.length}</strong> પાઠ છે. સંખ્યા બદલી 'લાગુ કરો' દબાવો.
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="number"
                min={1}
                max={50}
                value={targetCount}
                onChange={(e) => setTargetCount(Number(e.target.value))}
                className="w-20 px-3 py-1.5 rounded-lg border border-blue-300 bg-white text-center font-bold text-blue-950 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleApplyCount}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition cursor-pointer shrink-0 shadow-sm"
              >
                સંખ્યા બદલો
              </button>
            </div>
          </div>

          {activeTab === 'list' ? (
            <>
              {/* Add a single new chapter */}
              <form onSubmit={handleAddChapter} className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder={`નવા પાઠનું નામ જાતે લખો (દા.ત. પાઠ ${chapters.length + 1}: નવો એકમ)...`}
                  value={newChapterName}
                  onChange={(e) => setNewChapterName(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                />
                <button
                  type="submit"
                  className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition shadow-sm cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>પાઠ ઉમેરો</span>
                </button>
              </form>

              {/* Chapters List with DIRECT inline inputs */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <PenLine className="w-3.5 h-3.5 text-blue-600" />
                    <span>દરેક પાઠનું નામ સીધું અહીં લખો / બદલો:</span>
                  </span>
                  {isSelfWrittenSubject && (
                    <button
                      onClick={handleClearAllToNumbered}
                      className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 transition"
                      title="બધા નામો સાફ કરી પાઠ ૧, ૨... કરો"
                    >
                      <Eraser className="w-3.5 h-3.5" />
                      <span>નામ સાફ કરો</span>
                    </button>
                  )}
                </div>

                <div className="border border-slate-200 rounded-2xl divide-y divide-slate-100 max-h-80 overflow-y-auto bg-white p-1">
                  {chapters.map((chap, idx) => (
                    <div
                      key={chap.id}
                      className="flex items-center justify-between p-2 hover:bg-slate-50/80 transition rounded-xl gap-2"
                    >
                      <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>

                      {/* Direct Editable Input */}
                      <input
                        type="text"
                        value={chap.name}
                        onChange={(e) => handleUpdateSingleName(chap.id, e.target.value)}
                        placeholder={`પાઠ ${idx + 1} નું નામ અહીં લખો...`}
                        className="flex-1 px-3 py-1.5 text-sm font-semibold text-slate-900 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg bg-white"
                      />

                      <button
                        onClick={() => handleDeleteChapter(chap.id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition shrink-0 cursor-pointer"
                        title="આ પાઠ કાઢી નાખો"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Batch import tab */
            <div className="space-y-3">
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                <p className="font-bold mb-1">💡 સરળ સુવિધા:</p>
                તમારા વિષયના તમામ પાઠના નામ નીચે લાઇનવાર પેસ્ટ કરો (દરેક લાઇન પર ૧ પાઠનું નામ). આખી અનુક્રમણિકા આપોઆપ સેટ થઈ જશે!
              </div>

              <textarea
                rows={9}
                placeholder="સંમેય સંખ્યાઓ&#10;એકચલ સુરેખ સમીકરણ&#10;ચતુષ્કોણની સમજ&#10;પ્રાયોગિક ભૂમિતિ&#10;..."
                value={batchText}
                onChange={(e) => setBatchText(e.target.value)}
                className="w-full p-3.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 font-medium"
              />

              <button
                onClick={handleBatchImport}
                disabled={!batchText.trim()}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition shadow-sm cursor-pointer"
              >
                પાઠ નામો લાગુ કરો (Apply Batch Names)
              </button>
            </div>
          )}

          {/* Reset to defaults notice */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-200">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
              <span>
                {isSelfWrittenSubject 
                  ? 'મૂળ સંખ્યા (પાઠ ૧, ૨...) પર લાવવા:' 
                  : 'મૂળ પાઠ્યપુસ્તક સિલેબસ રિસેટ કરવા:'}
              </span>
            </div>
            <button
              onClick={() => {
                if (confirm('શું તમે આ વિષયના પાઠ મૂળ સ્થિતિ મુજબ રીસેટ કરવા માંગો છો?')) {
                  onResetToDefaults();
                }
              }}
              className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-800 font-semibold px-2 py-1 rounded hover:bg-rose-50 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>મૂળ પાઠ રીસેટ કરો</span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition shadow-sm cursor-pointer"
          >
            પૂર્ણ થયું
          </button>
        </div>
      </div>
    </div>
  );
};
