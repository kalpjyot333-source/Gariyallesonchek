import React from 'react';
import { SchoolInfo, StandardConfig, Subject, Chapter, LessonRecords } from '../types';

interface PrintReportViewProps {
  schoolInfo: SchoolInfo;
  standard: StandardConfig;
  subject: Subject;
  chapter: Chapter;
  records: LessonRecords;
}

export const PrintReportView: React.FC<PrintReportViewProps> = ({
  schoolInfo,
  standard,
  subject,
  chapter,
  records,
}) => {
  let doneCount = 0;
  standard.students.forEach((s) => {
    const key = `${standard.std}_${subject.id}_${chapter.id}_${s.id}`;
    if (records[key]?.completed) doneCount++;
  });
  const pendingCount = standard.students.length - doneCount;

  return (
    <div className="hidden print:block p-8 bg-white text-black font-sans min-h-screen">
      {/* School Letterhead */}
      <div className="text-center border-b-2 border-black pb-4 mb-6">
        <h1 className="text-2xl font-black uppercase tracking-wider">{schoolInfo.schoolName}</h1>
        <p className="text-sm font-semibold mt-1">{schoolInfo.subTitle}</p>
        <p className="text-xs text-gray-600 mt-0.5">
          {schoolInfo.academicYear} • દૈનિક વિદ્યાર્થી લેસન ચકાસણી પત્રક
        </p>
      </div>

      {/* Meta details */}
      <div className="grid grid-cols-4 gap-2 text-xs border border-black p-3 mb-6 font-semibold bg-gray-50">
        <div>
          <span className="text-gray-600">ધોરણ:</span> {standard.title}
        </div>
        <div>
          <span className="text-gray-600">વિષય:</span> {subject.name} ({subject.englishName})
        </div>
        <div>
          <span className="text-gray-600">પાઠ:</span> {chapter.name}
        </div>
        <div>
          <span className="text-gray-600">તારીખ:</span> {new Date().toLocaleDateString('gu-IN')}
        </div>
      </div>

      {/* Summary Box */}
      <div className="flex justify-between items-center bg-gray-100 border border-gray-400 p-2 text-xs font-bold mb-4">
        <span>કુલ વિદ્યાર્થી: {standard.students.length}</span>
        <span>લેસન પૂર્ણ: {doneCount}</span>
        <span>બાકી લેસન: {pendingCount}</span>
        <span>
          ટકાવારી:{' '}
          {standard.students.length > 0
            ? Math.round((doneCount / standard.students.length) * 100)
            : 0}
          %
        </span>
      </div>

      {/* Table */}
      <table className="w-full border-collapse border border-black text-xs mb-10">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-black p-2 w-14 text-center">રોલ નં.</th>
            <th className="border border-black p-2 text-left">વિદ્યાર્થીનું નામ</th>
            <th className="border border-black p-2 w-28 text-center">લેસન સ્થિતિ</th>
            <th className="border border-black p-2 text-left">શિક્ષકનો શેરો / નોંધ</th>
          </tr>
        </thead>
        <tbody>
          {standard.students.map((student) => {
            const key = `${standard.std}_${subject.id}_${chapter.id}_${student.id}`;
            const rec = records[key];
            const isDone = !!rec?.completed;

            return (
              <tr key={student.id}>
                <td className="border border-black p-1.5 text-center font-bold">{student.rollNo}</td>
                <td className="border border-black p-1.5 font-medium">{student.name}</td>
                <td className="border border-black p-1.5 text-center font-bold">
                  {isDone ? '✔ પૂર્ણ' : '✖ બાકી'}
                </td>
                <td className="border border-black p-1.5 text-gray-700">{rec?.note || ''}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Signatures */}
      <div className="flex justify-between pt-16 text-xs font-bold">
        <div className="text-center w-48 border-t border-black pt-2">
          વર્ગ શિક્ષકની સહી<br />
          <span className="font-normal text-gray-600">({schoolInfo.teacherName})</span>
        </div>
        <div className="text-center w-48 border-t border-black pt-2">
          આચાર્યશ્રીની સહી અને સિક્કો
        </div>
      </div>
    </div>
  );
};
