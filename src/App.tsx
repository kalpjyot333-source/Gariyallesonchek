import React, { useState, useEffect, useMemo } from 'react';
import { AppData, SubjectId, Student, Chapter, LessonRecords, SchoolInfo } from './types';
import { SUBJECTS, INITIAL_STANDARDS, DEFAULT_SCHOOL_INFO } from './data/defaultData';
import { loadAppData, saveAppData, getRecordKey, exportRegisterToCSV } from './utils/storage';

import { Header } from './components/Header';
import { SubjectBar } from './components/SubjectBar';
import { ChapterControls } from './components/ChapterControls';
import { LessonTable } from './components/LessonTable';
import { ChapterMatrixView } from './components/ChapterMatrixView';
import { ChapterManagerModal } from './components/ChapterManagerModal';
import { StudentScorecardModal } from './components/StudentScorecardModal';
import { StudentManagerModal } from './components/StudentManagerModal';
import { SchoolSettingsModal } from './components/SchoolSettingsModal';
import { BackupModal } from './components/BackupModal';
import { PrintReportView } from './components/PrintReportView';

export default function App() {
  const [appData, setAppData] = useState<AppData>(() => loadAppData());
  const [currentStd, setCurrentStd] = useState<string>('8');
  const [selectedSubjectId, setSelectedSubjectId] = useState<SubjectId>('gujarati');
  const [currentChapterId, setCurrentChapterId] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'table' | 'matrix'>('table');

  // Modals state
  const [isChapterManagerOpen, setIsChapterManagerOpen] = useState(false);
  const [isStudentManagerOpen, setIsStudentManagerOpen] = useState(false);
  const [isSchoolSettingsOpen, setIsSchoolSettingsOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [scorecardStudent, setScorecardStudent] = useState<Student | null>(null);

  // Auto-save on any appData changes
  useEffect(() => {
    saveAppData(appData);
  }, [appData]);

  // Current Standard Config
  const standardConfig = appData.standards[currentStd] || appData.standards['8'];
  const currentSubject = SUBJECTS.find((s) => s.id === selectedSubjectId) || SUBJECTS[0];
  const chapters: Chapter[] = standardConfig?.chapters?.[selectedSubjectId] || [];

  // Ensure currentChapterId is valid when switching standard or subject
  useEffect(() => {
    if (chapters.length > 0) {
      const exists = chapters.some((c) => c.id === currentChapterId);
      if (!exists) {
        setCurrentChapterId(chapters[0].id);
      }
    }
  }, [selectedSubjectId, currentStd, chapters, currentChapterId]);

  const currentChapter = chapters.find((c) => c.id === currentChapterId) || chapters[0] || {
    id: 1,
    number: 1,
    name: 'પાઠ ૧',
  };

  // Chapter counts per subject
  const chapterCounts = useMemo(() => {
    const counts: Record<SubjectId, number> = {} as any;
    SUBJECTS.forEach((sub) => {
      counts[sub.id] = standardConfig?.chapters?.[sub.id]?.length || 0;
    });
    return counts;
  }, [standardConfig]);

  // Completion rates per subject for current standard
  const completionRates = useMemo(() => {
    const rates: Record<SubjectId, number> = {} as any;
    const students = standardConfig?.students || [];
    const totalStudents = students.length;

    SUBJECTS.forEach((sub) => {
      const subChapters = standardConfig?.chapters?.[sub.id] || [];
      const totalPossible = totalStudents * subChapters.length;
      if (totalPossible === 0) {
        rates[sub.id] = 0;
        return;
      }

      let done = 0;
      subChapters.forEach((ch) => {
        students.forEach((st) => {
          const key = getRecordKey(currentStd, sub.id, ch.id, st.id);
          if (appData.records[key]?.completed) done++;
        });
      });

      rates[sub.id] = Math.round((done / totalPossible) * 100);
    });

    return rates;
  }, [standardConfig, currentStd, appData.records]);

  // Helper key generator for current view
  const currentRecordKey = (studentId: string) =>
    getRecordKey(currentStd, selectedSubjectId, currentChapter.id, studentId);

  // Toggle single status
  const handleToggleStatus = (studentId: string, currentVal: boolean) => {
    const key = currentRecordKey(studentId);
    setAppData((prev) => {
      const updated = { ...prev.records };
      updated[key] = {
        completed: !currentVal,
        checkedAt: !currentVal ? new Date().toISOString() : undefined,
        note: prev.records[key]?.note,
      };
      return { ...prev, records: updated };
    });
  };

  // Toggle in matrix view
  const handleToggleMatrixCell = (studentId: string, chapterId: number, currentVal: boolean) => {
    const key = getRecordKey(currentStd, selectedSubjectId, chapterId, studentId);
    setAppData((prev) => {
      const updated = { ...prev.records };
      updated[key] = {
        completed: !currentVal,
        checkedAt: !currentVal ? new Date().toISOString() : undefined,
        note: prev.records[key]?.note,
      };
      return { ...prev, records: updated };
    });
  };

  // Save student name
  const handleSaveStudentName = (studentId: string, newName: string) => {
    setAppData((prev) => {
      const stdObj = prev.standards[currentStd];
      if (!stdObj) return prev;
      const updatedStudents = stdObj.students.map((s) =>
        s.id === studentId ? { ...s, name: newName } : s
      );
      return {
        ...prev,
        standards: {
          ...prev.standards,
          [currentStd]: {
            ...stdObj,
            students: updatedStudents,
          },
        },
      };
    });
  };

  // Save note for student on current chapter
  const handleSaveStudentNote = (studentId: string, note: string) => {
    const key = currentRecordKey(studentId);
    setAppData((prev) => ({
      ...prev,
      records: {
        ...prev.records,
        [key]: {
          ...prev.records[key],
          completed: prev.records[key]?.completed ?? false,
          note,
        },
      },
    }));
  };

  // Mark all completed
  const handleMarkAllDone = () => {
    const students = standardConfig.students;
    setAppData((prev) => {
      const updated = { ...prev.records };
      const now = new Date().toISOString();
      students.forEach((s) => {
        const key = getRecordKey(currentStd, selectedSubjectId, currentChapter.id, s.id);
        updated[key] = {
          completed: true,
          checkedAt: now,
          note: prev.records[key]?.note,
        };
      });
      return { ...prev, records: updated };
    });
  };

  // Mark all pending
  const handleMarkAllPending = () => {
    const students = standardConfig.students;
    setAppData((prev) => {
      const updated = { ...prev.records };
      students.forEach((s) => {
        const key = getRecordKey(currentStd, selectedSubjectId, currentChapter.id, s.id);
        updated[key] = {
          completed: false,
          checkedAt: undefined,
          note: prev.records[key]?.note,
        };
      });
      return { ...prev, records: updated };
    });
  };

  // Reset current chapter records
  const handleResetChapter = () => {
    if (!confirm(`શું તમે '${currentChapter.name}' પાઠની તમામ એન્ટ્રી સાફ (Reset) કરવા માંગો છો?`)) return;
    const students = standardConfig.students;
    setAppData((prev) => {
      const updated = { ...prev.records };
      students.forEach((s) => {
        const key = getRecordKey(currentStd, selectedSubjectId, currentChapter.id, s.id);
        delete updated[key];
      });
      return { ...prev, records: updated };
    });
  };

  // Quick Add Chapter (+)
  const handleUpdateCurrentChapterName = (newName: string) => {
    const updatedChapters = chapters.map((c) =>
      c.id === currentChapter.id ? { ...c, name: newName } : c
    );
    setAppData((prev) => ({
      ...prev,
      standards: {
        ...prev.standards,
        [currentStd]: {
          ...prev.standards[currentStd],
          chapters: {
            ...prev.standards[currentStd].chapters,
            [selectedSubjectId]: updatedChapters,
          },
        },
      },
    }));
  };

  const handleQuickAddChapter = () => {
    const nextNum = chapters.length > 0 ? Math.max(...chapters.map((c) => c.number)) + 1 : 1;
    const nextId = chapters.length > 0 ? Math.max(...chapters.map((c) => c.id)) + 1 : 1;
    const newChap: Chapter = {
      id: nextId,
      number: nextNum,
      name: `પાઠ ${nextNum}`,
    };

    const updatedChapters = [...chapters, newChap];
    setAppData((prev) => ({
      ...prev,
      standards: {
        ...prev.standards,
        [currentStd]: {
          ...prev.standards[currentStd],
          chapters: {
            ...prev.standards[currentStd].chapters,
            [selectedSubjectId]: updatedChapters,
          },
        },
      },
    }));
    setCurrentChapterId(nextId);
  };

  // Quick Remove Chapter (-)
  const handleQuickRemoveChapter = () => {
    if (chapters.length <= 1) {
      alert('ઓછામાં ઓછો ૧ પાઠ રાખવો જરૂરી છે.');
      return;
    }
    const last = chapters[chapters.length - 1];
    if (confirm(`શું તમે છેલ્લો '${last.name}' દૂર કરવા માંગો છો?`)) {
      const updatedChapters = chapters.slice(0, -1);
      setAppData((prev) => ({
        ...prev,
        standards: {
          ...prev.standards,
          [currentStd]: {
            ...prev.standards[currentStd],
            chapters: {
              ...prev.standards[currentStd].chapters,
              [selectedSubjectId]: updatedChapters,
            },
          },
        },
      }));
      if (currentChapterId === last.id) {
        setCurrentChapterId(updatedChapters[updatedChapters.length - 1].id);
      }
    }
  };

  // Update chapters from Modal
  const handleUpdateChapters = (newChapters: Chapter[]) => {
    setAppData((prev) => ({
      ...prev,
      standards: {
        ...prev.standards,
        [currentStd]: {
          ...prev.standards[currentStd],
          chapters: {
            ...prev.standards[currentStd].chapters,
            [selectedSubjectId]: newChapters,
          },
        },
      },
    }));
    if (newChapters.length > 0 && !newChapters.some((c) => c.id === currentChapterId)) {
      setCurrentChapterId(newChapters[0].id);
    }
  };

  // Reset chapters to standard Gujarat syllabus defaults
  const handleResetChaptersToDefault = () => {
    const fallback = INITIAL_STANDARDS[currentStd]?.chapters[selectedSubjectId] || [];
    handleUpdateChapters(fallback);
  };

  // Update students list
  const handleUpdateStudents = (newStudents: Student[]) => {
    setAppData((prev) => ({
      ...prev,
      standards: {
        ...prev.standards,
        [currentStd]: {
          ...prev.standards[currentStd],
          students: newStudents,
        },
      },
    }));
  };

  // Save school info
  const handleSaveSchoolInfo = (updated: SchoolInfo) => {
    setAppData((prev) => ({
      ...prev,
      schoolInfo: updated,
    }));
  };

  // Restore backup
  const handleRestoreData = (restored: AppData) => {
    setAppData(restored);
  };

  // Full reset
  const handleFullReset = () => {
    localStorage.clear();
    const freshData: AppData = {
      schoolInfo: DEFAULT_SCHOOL_INFO,
      standards: JSON.parse(JSON.stringify(INITIAL_STANDARDS)),
      records: {},
    };
    setAppData(freshData);
  };

  // Export CSV
  const handleExportCSV = () => {
    exportRegisterToCSV(
      appData.schoolInfo,
      standardConfig,
      selectedSubjectId,
      currentSubject.name,
      currentChapter,
      appData.records
    );
  };

  return (
    <div className="min-h-screen bg-slate-100/70 p-3 sm:p-6 lg:p-8 font-sans">
      {/* Printable Sheet (visible on print only) */}
      <PrintReportView
        schoolInfo={appData.schoolInfo}
        standard={standardConfig}
        subject={currentSubject}
        chapter={currentChapter}
        records={appData.records}
      />

      {/* Main Interactive App Container */}
      <div className="max-w-7xl mx-auto no-print">
        {/* Header */}
        <Header
          schoolInfo={appData.schoolInfo}
          onOpenSchoolSettings={() => setIsSchoolSettingsOpen(true)}
          onOpenBackupModal={() => setIsBackupModalOpen(true)}
          onOpenStudentManager={() => setIsStudentManagerOpen(true)}
          onPrint={() => window.print()}
          currentStd={currentStd}
          totalStudents={standardConfig.students.length}
          completedTodayCount={0}
        />

        {/* 7 Subjects Bar */}
        <SubjectBar
          subjects={SUBJECTS}
          selectedSubject={selectedSubjectId}
          onSelectSubject={(id) => setSelectedSubjectId(id)}
          chapterCounts={chapterCounts}
          completionRates={completionRates}
        />

        {/* Chapter Controls & Filter Bar */}
        <ChapterControls
          standards={appData.standards}
          currentStd={currentStd}
          onChangeStd={(std) => setCurrentStd(std)}
          currentSubject={currentSubject}
          chapters={chapters}
          currentChapterId={currentChapterId}
          onChangeChapter={(id) => setCurrentChapterId(id)}
          onQuickAddChapter={handleQuickAddChapter}
          onQuickRemoveChapter={handleQuickRemoveChapter}
          onOpenChapterManager={() => setIsChapterManagerOpen(true)}
          onUpdateCurrentChapterName={handleUpdateCurrentChapterName}
          onMarkAllDone={handleMarkAllDone}
          onMarkAllPending={handleMarkAllPending}
          onResetChapter={handleResetChapter}
          onExportCSV={handleExportCSV}
          viewMode={viewMode}
          onToggleViewMode={(mode) => setViewMode(mode)}
        />

        {/* Main Content Area */}
        {viewMode === 'table' ? (
          <LessonTable
            students={standardConfig.students}
            records={appData.records}
            getRecordKey={currentRecordKey}
            onToggleStatus={handleToggleStatus}
            onSaveStudentName={handleSaveStudentName}
            onSaveStudentNote={handleSaveStudentNote}
            onOpenScorecard={(student) => setScorecardStudent(student)}
            chapterTitle={currentChapter.name}
            subjectName={currentSubject.name}
          />
        ) : (
          <ChapterMatrixView
            students={standardConfig.students}
            chapters={chapters}
            subject={currentSubject}
            std={currentStd}
            records={appData.records}
            onToggleMatrixCell={handleToggleMatrixCell}
            onSelectChapter={(chapId) => {
              setCurrentChapterId(chapId);
              setViewMode('table');
            }}
          />
        )}
      </div>

      {/* Chapter Manager Modal (Add, Remove, Rename chapters) */}
      <ChapterManagerModal
        isOpen={isChapterManagerOpen}
        onClose={() => setIsChapterManagerOpen(false)}
        stdTitle={standardConfig.title}
        subject={currentSubject}
        chapters={chapters}
        onUpdateChapters={handleUpdateChapters}
        onResetToDefaults={handleResetChaptersToDefault}
      />

      {/* Student 7-Subject Scorecard Modal */}
      <StudentScorecardModal
        isOpen={!!scorecardStudent}
        onClose={() => setScorecardStudent(null)}
        student={scorecardStudent}
        standard={standardConfig}
        records={appData.records}
      />

      {/* Student List Manager Modal */}
      <StudentManagerModal
        isOpen={isStudentManagerOpen}
        onClose={() => setIsStudentManagerOpen(false)}
        stdTitle={standardConfig.title}
        students={standardConfig.students}
        onUpdateStudents={handleUpdateStudents}
      />

      {/* School Settings Modal */}
      <SchoolSettingsModal
        isOpen={isSchoolSettingsOpen}
        onClose={() => setIsSchoolSettingsOpen(false)}
        schoolInfo={appData.schoolInfo}
        onSave={handleSaveSchoolInfo}
      />

      {/* Backup & Restore Modal */}
      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        appData={appData}
        onRestoreData={handleRestoreData}
        onFullReset={handleFullReset}
      />
    </div>
  );
}
