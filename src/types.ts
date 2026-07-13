export interface EducationEntry {
  level: string;
  schoolName: string;
  gradYear: string;
}

export interface KindergartenDevelopment {
  year: string;
  teacherName: string;
  physical: string; // ด้านร่างกาย (e.g., 3 - ดีเยี่ยม, 2 - ดี, 1 - พอใช้)
  emotional: string; // ด้านอารมณ์และจิตใจ
  social: string; // ด้านสังคม
  intellectual: string; // ด้านสติปัญญา
}

export interface PrimaryGradeEntry {
  year: string;
  teacherName: string;
  gpa: string; // ผลการเรียนเฉลี่ยสะสม (GPA)
}

export interface AcademicRecord {
  kindergartenDev?: KindergartenDevelopment;
  primaryGrades?: {
    [grade: string]: PrimaryGradeEntry; // keys can be "Prathom 1", "Prathom 2", etc.
  };
}

export interface ProudWork {
  id: string;
  term: "1" | "2";
  year: string;
  subjectArea: string; // 8 กลุ่มสาระ (เช่น ภาษาไทย, คณิตศาสตร์, วิทยาศาสตร์, etc.)
  title: string;
  description: string;
  driveFileId?: string;
  driveViewUrl?: string;
}

export interface Award {
  id: string;
  category: "academic" | "language_art_culture" | "leadership" | "sports" | "morals_ethics";
  title: string;
  year: string;
  driveFileId?: string;
  driveViewUrl?: string;
}

export interface ActivityCertificate {
  id: string;
  title: string;
  description: string;
  impression: string;
  benefit: string;
  year: string;
  driveFileId?: string;
  driveViewUrl?: string;
}

export interface SpecialTalent {
  id: string;
  title: string; // ด้านความเป็นผู้นำ ด้านกีฬา ด้านดนตรี การร้องเพลง ด้านศิลปะ ฯลฯ
  description: string;
  impression: string;
  benefit: string;
  year: string;
  driveFileId?: string;
  driveViewUrl?: string;
}

export interface EvaluationTerm {
  opinion: string; // ความคิดเห็นต่อความสามารถ
  suggestion: string; // แนวทางการสนับสนุน หรือข้อเสนอแนะ
  signature: string; // ลงชื่อ
  date: string; // วันที่ประเมิน
}

export interface Evaluations {
  parent?: {
    term1?: EvaluationTerm;
    term2?: EvaluationTerm;
  };
  teacher?: {
    term1?: EvaluationTerm;
    term2?: EvaluationTerm;
  };
}

export interface PersonalProfile {
  title: string; // เด็กชาย / เด็กหญิง
  firstName: string;
  lastName: string;
  gender: "Male" | "Female";
  nickname: string;
  birthDate: string;
  age: string;
  birthPlace: string;
  nationality: string;
  race: string;
  religion: string;
  idCardNumber: string;
  bloodGroup: string;
  birthDomicile: string; // ภูมิลำเนา
  
  // Address
  addressNo: string;
  moo: string;
  alley: string;
  road: string;
  subdistrict: string;
  district: string;
  province: string;
  zipCode: string;
  
  // Current Address (if same or different)
  currentAddressSame: boolean;
  currentAddressNo?: string;
  currentMoo?: string;
  currentAlley?: string;
  currentRoad?: string;
  currentSubdistrict?: string;
  currentDistrict?: string;
  currentProvince?: string;
  currentZipCode?: string;
  
  phone: string;
  email: string;
  
  // Siblings
  siblingsCount: string;
  siblingsBoyCount: string;
  siblingsGirlCount: string;
  childNumber: string;
  
  // Father
  fatherName: string;
  fatherSurname: string;
  fatherOccupation: string;
  fatherWorkplace: string;
  fatherPhone: string;
  
  // Mother
  motherName: string;
  motherSurname: string;
  motherOccupation: string;
  motherWorkplace: string;
  motherPhone: string;
  
  // Guardian
  guardianName: string;
  guardianSurname: string;
  guardianRelationship: string;
  guardianOccupation: string;
  guardianWorkplace: string;
  guardianPhone: string;
  
  // Talents / Hobbies / Personal Info
  talents: string;
  hobbies: string;
  specialInterest: string;
  selfImpression: string;
  futureDream: string;
  socialDesire: string; // ความต้องการอุทิศตนเพื่อสังคม
  
  // Image
  driveFileId?: string;
  driveViewUrl?: string;
}

export interface Student {
  id: string;
  teacherUid: string;
  firstName: string;
  lastName: string;
  gender: "Male" | "Female";
  currentGrade: 
    | "Kindergarten 1"
    | "Kindergarten 2"
    | "Kindergarten 3"
    | "Prathom 1"
    | "Prathom 2"
    | "Prathom 3"
    | "Prathom 4"
    | "Prathom 5"
    | "Prathom 6";
  profile: PersonalProfile;
  educationHistory: EducationEntry[];
  academicRecord: AcademicRecord;
  proudWorks: ProudWork[];
  awards: Award[];
  activityCertificates: ActivityCertificate[];
  specialTalents: SpecialTalent[];
  evaluations: Evaluations;
  createdAt: string;
  updatedAt: string;
}
