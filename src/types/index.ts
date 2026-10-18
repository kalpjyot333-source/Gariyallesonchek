export type SubjectId = 
  | 'ganit' 
  | 'vigyan' 
  | 'gujarati' 
  | 'hindi' 
  | 'angreji' 
  | 'samajik_vigyan' 
  | 'sanskrit';

export interface Subject {
  id: SubjectId;
  name: string;
  englishName: string;
  icon: string;
  badgeColor: string;
  bgLight: string;
  borderCol: string;
  textColor: string;
  activeColor: string;
}

export interface Chapter {
  id: number;
  number: number;
  name: string;
}

export interface Student {
  id: string;
  rollNo: number;
  name: string;
}

export interface LessonStatus {
  completed: boolean;
  checkedAt?: string;
  note?: string;
}

// Key structure: `record_${std}_${sub}_${chapId}_${studentId}`
export type LessonRecords = Record<string, LessonStatus>;

export interface SchoolInfo {
  schoolName: string;
  subTitle: string;
  taluka: string;
  district: string;
  teacherName: string;
  academicYear: string;
}

export interface StandardConfig {
  std: string;
  title: string;
  students: Student[];
  chapters: Record<SubjectId, Chapter[]>;
}

export type AppData = {
  schoolInfo: SchoolInfo;
  standards: Record<string, StandardConfig>;
  records: LessonRecords;
};
