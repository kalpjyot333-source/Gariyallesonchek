import React, { useState } from 'react';
import { Student } from '../types';
import { X, Plus, Trash2, Edit2, Check, Users, FileText, Sparkles } from 'lucide-react';

interface StudentManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  stdTitle: string;
  students: Student[];
  onUpdateStudents: (newStudents: Student[]) => void;
}

export const StudentManagerModal: React.FC<StudentManagerModalProps> = ({
  isOpen,
  onClose,
  stdTitle,
  students,
  onUpdateStudents,
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'batch'>('list');
  const [newStudentName, setNewStudentName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [batchText, setBatchText] = useState('');

  if (!isOpen) return null;

  const handleAddSingle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;
    const nextRoll = students.length > 0 ? Math.max(...students.map((s) => s.rollNo)) + 1 : 1;
    const newStudent: Student = {
      id: `custom_s_${Date.now()}`,
      rollNo: nextRoll,
      name: newStudentName.trim(),
    };
    onUpdateStudents([...students, newStudent]);
    setNewStudentName('');
  };

  const handleStartEdit = (student: Student) => {
    setEditingId(student.id);
    setEditName(student.name);
  };

  const handleSaveEdit = (studentId: string) => {
    if (!editName.trim()) return;
    const updated = students.map((s) =>
      s.id === studentId ? { ...s, name: editName.trim() } : s
    );
    onUpdateStudents(updated);
    setEditingId(null);
  };

  const handleDelete = (studentId: string, name: string) => {
    if (confirm(`શું તમે વિદ્યાર્થી '${name}' ને યાદીમાંથી કાઢી નાખવા માંગો છો?`)) {
      const filtered = students.filter((s) => s.id !== studentId);
      // Auto renumber
      const renumbered = filtered.map((s, idx) => ({
        ...s,
        rollNo: idx + 1,
      }));
      onUpdateStudents(renumbered);
    }
  };

  const handleBatchImport = () => {
    if (!batchText.trim()) return;
    const lines = batchText
      .split(/[\r\n,]+/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) return;

    if (confirm(`શું તમે આ ${lines.length} વિદ્યાર્થીઓની નવી યાદી સેટ કરવા માંગો છો?`)) {
      const newStudents: Student[] = lines.map((name, index) => ({
        id: `batch_s_${Date.now()}_${index + 1}`,
        rollNo: index + 1,
        name,
      }));
      onUpdateStudents(newStudents);
      setBatchText('');
      setActiveTab('list');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">વિદ્યાર્થીઓની યાદી વ્યવસ્થાપન</h3>
              <p className="text-xs text-slate-500">{stdTitle} • કુલ {students.length} વિદ્યાર્થીઓ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 bg-slate-100/60 p-1">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              activeTab === 'list'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            વિદ્યાર્થી યાદી ({students.length})
          </button>
          <button
            onClick={() => setActiveTab('batch')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
              activeTab === 'batch'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>એક સાથે યાદી ઉમેરો (Batch Import)</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'list' ? (
            <>
              {/* Add single student input */}
              <form onSubmit={handleAddSingle} className="flex gap-2">
                <input
                  type="text"
                  placeholder="નવા વિદ્યાર્થીનું નામ દાખલ કરો..."
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="flex-1 px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>ઉમેરો</span>
                </button>
              </form>

              {/* Student List */}
              <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 max-h-72 overflow-y-auto bg-white">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-2.5 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-2.5 flex-1 min-w-0 mr-2">
                      <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {student.rollNo}
                      </span>

                      {editingId === student.id ? (
                        <div className="flex items-center gap-1.5 flex-1">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEdit(student.id);
                              if (e.key === 'Escape') setEditingId(null);
                            }}
                            autoFocus
                            className="flex-1 px-2.5 py-1 text-sm border border-blue-400 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                          />
                          <button
                            onClick={() => handleSaveEdit(student.id)}
                            className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1 rounded bg-slate-200 text-slate-700 hover:bg-slate-300"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm font-semibold text-slate-800 truncate">
                          {student.name}
                        </span>
                      )}
                    </div>

                    {editingId !== student.id && (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleStartEdit(student)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg transition"
                          title="નામ સુધારો"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(student.id, student.name)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition"
                          title="કાઢી નાખો"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                <strong>સૂચના:</strong> નીચેના બોક્સમાં દરેક વિદ્યાર્થીનું નામ નવી લીટીમાં (New Line) પેસ્ટ કરો. રોલ નંબર ક્રમશઃ ૧, ૨, ૩... આપોઆપ આવી જશે.
              </div>
              <textarea
                rows={8}
                placeholder="પટેલ આયૂષ એમ.&#10;શાહ પ્રિયાંશી આર.&#10;જોષી દેવાંશી એસ.&#10;..."
                value={batchText}
                onChange={(e) => setBatchText(e.target.value)}
                className="w-full p-3 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 font-mono"
              />
              <button
                onClick={handleBatchImport}
                disabled={!batchText.trim()}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition shadow-sm cursor-pointer"
              >
                યાદી આયાત (Import) કરો
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
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
