import { Subject, StandardConfig, SchoolInfo, SubjectId } from '../types';

export const SUBJECTS: Subject[] = [
  {
    id: 'ganit',
    name: 'ગણિત',
    englishName: 'Mathematics',
    icon: 'Calculator',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    bgLight: 'bg-emerald-50 hover:bg-emerald-100/70',
    borderCol: 'border-emerald-500',
    textColor: 'text-emerald-700',
    activeColor: 'bg-emerald-600 text-white shadow-emerald-200 shadow-md',
  },
  {
    id: 'vigyan',
    name: 'વિજ્ઞાન',
    englishName: 'Science',
    icon: 'Atom',
    badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    bgLight: 'bg-cyan-50 hover:bg-cyan-100/70',
    borderCol: 'border-cyan-500',
    textColor: 'text-cyan-700',
    activeColor: 'bg-cyan-600 text-white shadow-cyan-200 shadow-md',
  },
  {
    id: 'gujarati',
    name: 'ગુજરાતી',
    englishName: 'Gujarati',
    icon: 'BookOpen',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    bgLight: 'bg-amber-50 hover:bg-amber-100/70',
    borderCol: 'border-amber-500',
    textColor: 'text-amber-700',
    activeColor: 'bg-amber-600 text-white shadow-amber-200 shadow-md',
  },
  {
    id: 'hindi',
    name: 'હિન્દી',
    englishName: 'Hindi',
    icon: 'Languages',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    bgLight: 'bg-rose-50 hover:bg-rose-100/70',
    borderCol: 'border-rose-500',
    textColor: 'text-rose-700',
    activeColor: 'bg-rose-600 text-white shadow-rose-200 shadow-md',
  },
  {
    id: 'angreji',
    name: 'અંગ્રેજી',
    englishName: 'English',
    icon: 'Globe',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    bgLight: 'bg-blue-50 hover:bg-blue-100/70',
    borderCol: 'border-blue-500',
    textColor: 'text-blue-700',
    activeColor: 'bg-blue-600 text-white shadow-blue-200 shadow-md',
  },
  {
    id: 'samajik_vigyan',
    name: 'સામાજિક વિજ્ઞાન',
    englishName: 'Social Science',
    icon: 'Compass',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    bgLight: 'bg-purple-50 hover:bg-purple-100/70',
    borderCol: 'border-purple-500',
    textColor: 'text-purple-700',
    activeColor: 'bg-purple-600 text-white shadow-purple-200 shadow-md',
  },
  {
    id: 'sanskrit',
    name: 'સંસ્કૃત',
    englishName: 'Sanskrit',
    icon: 'Scroll',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
    bgLight: 'bg-orange-50 hover:bg-orange-100/70',
    borderCol: 'border-orange-500',
    textColor: 'text-orange-700',
    activeColor: 'bg-orange-600 text-white shadow-orange-200 shadow-md',
  },
];

export const DEFAULT_SCHOOL_INFO: SchoolInfo = {
  schoolName: 'ગરીયાલ પ્રાથમિક શાળા',
  subTitle: 'વિદ્યાર્થી લેસન મોનિટરિંગ પોર્ટલ',
  taluka: '',
  district: '',
  teacherName: 'વર્ગ શિક્ષક',
  academicYear: '૨૦૨૫-૨૦૨૬',
};

// Helper to generate chapters array with custom or indexed titles
export function createDefaultChapters(count: number, names?: string[]): { id: number; number: number; name: string }[] {
  return Array.from({ length: count }, (_, i) => {
    const num = i + 1;
    const name = names && names[i] ? `પાઠ ${num}: ${names[i]}` : `પાઠ ${num}`;
    return {
      id: num,
      number: num,
      name,
    };
  });
}

const std8Students = [
  'પરમાર દર્શન કે.',
  'પટેલ આયૂષ એમ.',
  'શાહ પ્રિયાંશી આર.',
  'જોષી દેવાંશી એસ.',
  'રાઠોડ હાર્દિક બી.',
  'મકવાણા અંકિત જે.',
  'ચૌહાણ ખુશી એમ.',
  'સોલંકી રાહુલ ડી.',
  'પ્રજાપતિ વિશાલ વી.',
  'દવે હર્ષ ટી.',
  'ઠાકોર સુનિલ એન.',
  'પટેલ દિયા આર.',
  'ગોહિલ યશ એ.',
  'વાઘેલા રિયા સી.',
  'ઝાલા જયદીપ એમ.',
  'પંચાલ પ્રીત કે.',
  'વ્યાસ ક્રિષ્ના જે.',
  'મેવાડા અક્ષય પી.',
  'બારિયા પૂજા ડી.',
  'સુથાર માનવ આર.',
  'મિશ્રા ખુશ્બુ વી.',
  'યાદવ રોહન એસ.',
  'રાવલ શ્રેયા કે.',
  'સોની પાર્થ ડી.',
].map((name, index) => ({
  id: `std8_s${index + 1}`,
  rollNo: index + 1,
  name,
}));

const std7Students = [
  'ચાવડા મનન પી.',
  'પટેલ હેતલ એમ.',
  'ઠાકોર વિજય કે.',
  'દેસાઈ તનિષ્કા આર.',
  'વાઘેલા કરણ ડી.',
  'પટેલ કાવ્યા જે.',
  'મેહતા ક્રિશ એન.',
  'સોલંકી ભાવેશ સી.',
  'પરમાર સ્નેહા બી.',
  'રાઠોડ સાહિલ એમ.',
  'શાહ ધ્રુવિલ કે.',
  'જોષી રુદ્ર ટી.',
  'પ્રજાપતિ અપેક્ષા એસ.',
  'ચૌધરી મોહિત જે.',
  'દવે અંજલી વી.',
  'પંડ્યા દેવ આર.',
  'સોની નિરાલી એફ.',
  'નાયક સાગર પી.',
  'ભટ્ટ વિશ્વા એ.',
  'ગજ્જર મિલન એમ.',
  'ચૌહાણ પલ્લવી ડી.',
].map((name, index) => ({
  id: `std7_s${index + 1}`,
  rollNo: index + 1,
  name,
}));

const std6Students = [
  'પટેલ અંશ કે.',
  'શાહ ખુશાલી એમ.',
  'પરમાર રોહિત એસ.',
  'જોષી કુંજ આર.',
  'વાઘેલા મિત બી.',
  'સોલંકી પ્રિયા એન.',
  'ચૌહાણ ધૈર્ય ટી.',
  'દવે માહી જે.',
  'ઠાકોર અમિત સી.',
  'પ્રજાપતિ જીયા એમ.',
  'રાઠોડ આદિત્ય કે.',
  'પંચાલ નિયતિ ડી.',
  'મેહતા વંશ પી.',
  'ચાવડા શ્રુતિ એ.',
  'ગોહિલ કબીર વી.',
  'સુથાર ઇશિતા આર.',
  'રાવળ તીર્થ જે.',
].map((name, index) => ({
  id: `std6_s${index + 1}`,
  rollNo: index + 1,
  name,
}));

export const DEFAULT_CHAPTER_COUNTS: Record<string, Record<SubjectId, number>> = {
  '8': {
    ganit: 16,
    vigyan: 18,
    gujarati: 20,
    hindi: 14,
    angreji: 10,
    samajik_vigyan: 19,
    sanskrit: 12,
  },
  '7': {
    ganit: 15,
    vigyan: 18,
    gujarati: 20,
    hindi: 12,
    angreji: 10,
    samajik_vigyan: 18,
    sanskrit: 10,
  },
  '6': {
    ganit: 14,
    vigyan: 16,
    gujarati: 20,
    hindi: 12,
    angreji: 10,
    samajik_vigyan: 17,
    sanskrit: 10,
  },
};

export const INITIAL_STANDARDS: Record<string, StandardConfig> = {
  '8': {
    std: '8',
    title: 'ધોરણ ૮ (Standard 8)',
    students: std8Students,
    chapters: {
      ganit: createDefaultChapters(16),
      vigyan: createDefaultChapters(18),
      gujarati: createDefaultChapters(20),
      hindi: createDefaultChapters(14, [
        'तेरी है ज़मीं', 'ईदगाह', 'अंतरिक्ष परी सुनीता विलियम्स', 'उठो, धरा के अमर सपूतों', 
        'सवाल बालमन के, जवाब डॉ. कलाम के', 'भरत', 'हार की जीत', 'हँसना मना है', 
        'उलझन', 'ममता', 'सुभाषितानि', 'कबीर के दोहे', 'नीति के दोहे', 'प्राकृतिक सौन्दर्य'
      ]),
      angreji: createDefaultChapters(10),
      samajik_vigyan: createDefaultChapters(19),
      sanskrit: createDefaultChapters(12, [
        'ચિત્રપદાની ૧-૪', 'આકાશઃ પતતિ', 'આત્મશ્રદ્ધાયાઃ પ્રભાવઃ', 'એહી સુધીર!', 
        'શિલાયાઃ પ્રવાસઃ', 'વિનોદપદ્યાનિ', 'સંખ્યા', 'સુપ્રભાતમ', 'સમયઃ', 'સુક્તિભંડારમ્', 'સુધર્મા સભા', 'ભારતમસ્તુ સદા વિજયી'
      ]),
    },
  },
  '7': {
    std: '7',
    title: 'ધોરણ ૭ (Standard 7)',
    students: std7Students,
    chapters: {
      ganit: createDefaultChapters(15),
      vigyan: createDefaultChapters(18),
      gujarati: createDefaultChapters(20),
      hindi: createDefaultChapters(12, [
        'चित्र के संग-संग', 'तब याद तुम्हारी आती है', 'कुत्ते की वफ़ादारी', 'कथनी और करनी', 
        'जहाँ चाह वहाँ राह', 'डॉ. विक्रम साराभाई', 'ढूँढते रह जाओगे!', 'मुस्कान के मोती', 
        'समय सारिणी', 'अंदाज़ अपना अपना', 'नन्हा मुन्ना राही हूँ', 'प्रकृति का संदेश'
      ]),
      angreji: createDefaultChapters(10),
      samajik_vigyan: createDefaultChapters(18),
      sanskrit: createDefaultChapters(10, [
        'ચિત્રપદાની ૧-૩', 'મેઘો વર્ષતિ', 'કોઽરુક?', 'હાસ્યયોગઃ', 
        'ચટક! ચટક!', 'સંખ્યા', 'વિશ્વાસઃ નૈવ કર્તવ્યઃ', 'સમયઃ', 'આમ્રવૃક્ષઃ', 'શુભાષિતાનિ'
      ]),
    },
  },
  '6': {
    std: '6',
    title: 'ધોરણ ૬ (Standard 6)',
    students: std6Students,
    chapters: {
      ganit: createDefaultChapters(14),
      vigyan: createDefaultChapters(16),
      gujarati: createDefaultChapters(20),
      hindi: createDefaultChapters(12, [
        'दयालु शिकारी', 'एक जगत, एक लोक', 'समझदार नन्हीं', 'गिनती (५१ से १००)', 
        'धरती को महकाएँ', 'सुबह', 'सोच अपनी अपनी', 'राजा का धर्म', 
        'अनूठे इन्सान', 'इतनी शक्ति हमें देना दाता', 'सच्चा बालक', 'प्यारा भारत'
      ]),
      angreji: createDefaultChapters(10),
      samajik_vigyan: createDefaultChapters(17),
      sanskrit: createDefaultChapters(10, [
        'વંદના', 'ચિત્રપદાની ૧-૩', 'કરોતિ', 'સંખ્યા', 
        'હસ્તી હસ્તી હસ્તી', 'સપ્તવાસરાઃ', 'વિમાનયાનં રચયામ', 'અહમ્ ગચ્છામિ', 'સમયદર્શનમ્', 'સુભાષિતાનિ'
      ]),
    },
  },
};
