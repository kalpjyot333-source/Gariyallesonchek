import React from 'react';
import { SchoolInfo } from '../types';
import { 
  GraduationCap, 
  Settings, 
  Printer, 
  Download, 
  Users, 
  Calendar,
  Sparkles,
  BookCheck
} from 'lucide-react';

interface HeaderProps {
  schoolInfo: SchoolInfo;
  onOpenSchoolSettings: () => void;
  onOpenBackupModal: () => void;
  onOpenStudentManager: () => void;
  onPrint: () => void;
  currentStd: string;
  totalStudents: number;
  completedTodayCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  schoolInfo,
  onOpenSchoolSettings,
  onOpenBackupModal,
  onOpenStudentManager,
  onPrint,
  currentStd,
  totalStudents,
}) => {
  const todayDate = new Date().toLocaleDateString('gu-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-800 text-white shadow-xl mb-6 border border-blue-700/50">
      {/* Decorative background glow */}
      <div className="absolute -right-10 -top-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative p-5 sm:p-7">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-blue-700/60 pb-5">
          {/* School Brand */}
          <div className="flex items-center gap-3.5 text-center md:text-left">
            <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 flex items-center justify-center text-blue-950 shadow-lg shadow-amber-500/20 shrink-0 ring-4 ring-white/10">
              <GraduationCap className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
                  {schoolInfo.schoolName}
                </h1>
                <button
                  onClick={onOpenSchoolSettings}
                  title="શાળા માહિતી બદલો"
                  className="p-1 rounded-md text-blue-200 hover:text-white hover:bg-white/10 transition"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
              <p className="text-blue-200 text-xs sm:text-sm font-medium mt-0.5 flex items-center justify-center md:justify-start gap-2">
                <span>{schoolInfo.subTitle}</span>
                {schoolInfo.academicYear && (
                  <span className="bg-blue-800/80 px-2 py-0.5 rounded-full text-[11px] border border-blue-600/40 text-blue-200">
                    {schoolInfo.academicYear}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Quick Action Navigation */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={onOpenStudentManager}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs sm:text-sm font-medium transition backdrop-blur-sm border border-white/10 active:scale-95"
              title="વિદ્યાર્થીઓની યાદી વ્યવસ્થાપન"
            >
              <Users className="w-4 h-4 text-amber-300" />
              <span>વિદ્યાર્થી યાદી ({totalStudents})</span>
            </button>

            <button
              onClick={onPrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs sm:text-sm font-medium transition backdrop-blur-sm border border-white/10 active:scale-95"
              title="રિપોર્ટ પ્રિન્ટ કરો"
            >
              <Printer className="w-4 h-4 text-emerald-300" />
              <span>પ્રિન્ટ / PDF</span>
            </button>

            <button
              onClick={onOpenBackupModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs sm:text-sm font-medium transition backdrop-blur-sm border border-white/10 active:scale-95"
              title="ડેટા બેકઅપ અને સેવિંગ"
            >
              <Download className="w-4 h-4 text-sky-300" />
              <span>બેકઅપ / રિસ્ટોર</span>
            </button>
          </div>
        </div>

        {/* Sub-bar Info */}
        <div className="mt-3.5 flex flex-wrap items-center justify-between text-xs sm:text-sm text-blue-200 gap-2">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 bg-blue-950/60 px-2.5 py-1 rounded-md border border-blue-700/50">
              <Calendar className="w-3.5 h-3.5 text-blue-300" />
              <span>{todayDate}</span>
            </span>
            <span className="hidden sm:inline bg-blue-950/60 px-2.5 py-1 rounded-md border border-blue-700/50">
              {schoolInfo.teacherName}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 text-emerald-300 font-semibold bg-emerald-950/50 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" />
              ૭ વિષયો સક્રિય
            </span>
            <span className="flex items-center gap-1 text-blue-200 bg-blue-950/60 border border-blue-700/50 px-2 py-0.5 rounded-full">
              <BookCheck className="w-3 h-3 text-amber-300" />
              ધોરણ {currentStd} સક્રિય
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
