import { AppData, LessonRecords, SchoolInfo, StandardConfig, SubjectId, Chapter, Student } from '../types';
import { DEFAULT_SCHOOL_INFO, INITIAL_STANDARDS, SUBJECTS } from '../data/defaultData';

const STORAGE_KEY = 'gariyal_school_lesson_tracker_v3';

export function loadAppData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AppData;
      // Ensure all 7 subjects exist in each standard
      Object.keys(parsed.standards).forEach((stdKey) => {
        const stdConfig = parsed.standards[stdKey];
        if (!stdConfig.chapters) stdConfig.chapters = {} as Record<SubjectId, Chapter[]>;
        SUBJECTS.forEach((sub) => {
          if (!stdConfig.chapters[sub.id] || stdConfig.chapters[sub.id].length === 0) {
            const fallback = INITIAL_STANDARDS[stdKey]?.chapters[sub.id] || [];
            stdConfig.chapters[sub.id] = fallback.length > 0 ? fallback : [
              { id: 1, number: 1, name: 'પાઠ ૧' },
              { id: 2, number: 2, name: 'પાઠ ૨' }
            ];
          }
        });
      });
      return parsed;
    }
  } catch (e) {
    console.error('Error reading localStorage v3:', e);
  }

  // Check for previous v2 storage to migrate
  try {
    const rawV2 = localStorage.getItem('gariyal_school_lesson_tracker_v2');
    if (rawV2) {
      const parsedV2 = JSON.parse(rawV2) as AppData;
      const standardsCopy = JSON.parse(JSON.stringify(INITIAL_STANDARDS)) as Record<string, StandardConfig>;

      // Migrate student names from v2
      Object.keys(parsedV2.standards || {}).forEach((stdKey) => {
        if (standardsCopy[stdKey] && parsedV2.standards[stdKey]?.students) {
          standardsCopy[stdKey].students = parsedV2.standards[stdKey].students;
        }
      });

      const migratedData: AppData = {
        schoolInfo: parsedV2.schoolInfo || DEFAULT_SCHOOL_INFO,
        standards: standardsCopy,
        records: parsedV2.records || {},
      };

      saveAppData(migratedData);
      return migratedData;
    }
  } catch (e) {
    console.warn('v2 migration skipped:', e);
  }

  // Check for legacy v1 storage from the initial HTML snippet
  const migratedRecords: LessonRecords = {};
  const standardsCopy = JSON.parse(JSON.stringify(INITIAL_STANDARDS)) as Record<string, StandardConfig>;

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('gariyal_std')) {
        const val = localStorage.getItem(key);
        // format: gariyal_std{std}_{sub}_ch{chap}_r{roll}
        const match = key.match(/^gariyal_std(\d+)_([a-zA-Z_]+)_ch(\d+)_r(\d+)$/);
        if (match) {
          const [, std, sub, chap, roll] = match;
          const studentId = `std${std}_s${roll}`;
          const recKey = `${std}_${sub}_${chap}_${studentId}`;
          migratedRecords[recKey] = {
            completed: val === '1',
            checkedAt: new Date().toISOString(),
          };
        }
      }
      // legacy student name keys: gariyal_name_std{std}_r{roll}
      if (key && key.startsWith('gariyal_name_std')) {
        const match = key.match(/^gariyal_name_std(\d+)_r(\d+)$/);
        if (match) {
          const [, std, roll] = match;
          const customName = localStorage.getItem(key);
          if (customName && standardsCopy[std]) {
            const sIndex = parseInt(roll, 10) - 1;
            if (standardsCopy[std].students[sIndex]) {
              standardsCopy[std].students[sIndex].name = customName;
            }
          }
        }
      }
    }
  } catch (err) {
    console.warn('Legacy migration ended:', err);
  }

  const initialData: AppData = {
    schoolInfo: DEFAULT_SCHOOL_INFO,
    standards: standardsCopy,
    records: migratedRecords,
  };

  saveAppData(initialData);
  return initialData;
}

export function saveAppData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export function getRecordKey(std: string, sub: SubjectId, chapId: number, studentId: string): string {
  return `${std}_${sub}_${chapId}_${studentId}`;
}

export function exportDataAsJSON(data: AppData): void {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  const dateStr = new Date().toISOString().slice(0, 10);
  downloadAnchor.setAttribute('download', `Gariyal_School_Lesson_Backup_${dateStr}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function exportRegisterToCSV(
  schoolInfo: SchoolInfo,
  standard: StandardConfig,
  subject: SubjectId,
  subjectName: string,
  chapter: Chapter,
  records: LessonRecords
): void {
  let csvContent = '\uFEFF'; // BOM for Excel Gujarati UTF-8 rendering
  csvContent += `શાળાનું નામ: "${schoolInfo.schoolName}"\n`;
  csvContent += `ધોરણ: "${standard.title}", વિષય: "${subjectName}", પાઠ: "${chapter.name}"\n`;
  csvContent += `તારીખ: "${new Date().toLocaleDateString('gu-IN')}"\n\n`;
  csvContent += `"રોલ નં.","વિદ્યાર્થીનું નામ","લેસન સ્થિતિ","નોંધ/શેરો"\n`;

  standard.students.forEach((student) => {
    const key = getRecordKey(standard.std, subject, chapter.id, student.id);
    const rec = records[key];
    const status = rec?.completed ? 'પૂર્ણ (Done)' : 'બાકી (Pending)';
    const note = rec?.note ? rec.note.replace(/"/g, '""') : '';
    csvContent += `"${student.rollNo}","${student.name.replace(/"/g, '""')}","${status}","${note}"\n`;
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const cleanSub = subjectName.replace(/\s+/g, '_');
  link.setAttribute('download', `Lesson_Std${standard.std}_${cleanSub}_Ch${chapter.number}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
