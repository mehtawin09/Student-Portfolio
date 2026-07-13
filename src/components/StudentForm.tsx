import React, { useState } from "react";
import { Student, PersonalProfile, EducationEntry, AcademicRecord, ProudWork, Award, ActivityCertificate, SpecialTalent, Evaluations, PrimaryGradeEntry, KindergartenDevelopment, EvaluationTerm } from "../types";
import { uploadFileToDrive, getOrCreateMainFolder } from "../firebase";
import { Save, X, Plus, Trash2, Upload, Loader2 } from "lucide-react";

interface StudentFormProps {
  student: Student | null;
  onSave: (studentData: Partial<Student>) => void;
  onCancel: () => void;
  accessToken: string;
}

export default function StudentForm({ student, onSave, onCancel, accessToken }: StudentFormProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "education" | "proud" | "awards" | "evals">("profile");
  
  // Basic states
  const [firstName, setFirstName] = useState(student?.firstName || "");
  const [lastName, setLastName] = useState(student?.lastName || "");
  const [gender, setGender] = useState<"Male" | "Female">(student?.gender || "Male");
  const [currentGrade, setCurrentGrade] = useState<Student["currentGrade"]>(student?.currentGrade || "Prathom 1");

  // Profile details state
  const [profile, setProfile] = useState<PersonalProfile>({
    title: student?.profile?.title || "เด็กชาย",
    firstName: student?.profile?.firstName || "",
    lastName: student?.profile?.lastName || "",
    gender: student?.profile?.gender || "Male",
    nickname: student?.profile?.nickname || "",
    birthDate: student?.profile?.birthDate || "",
    age: student?.profile?.age || "",
    birthPlace: student?.profile?.birthPlace || "",
    nationality: student?.profile?.nationality || "ไทย",
    race: student?.profile?.race || "ไทย",
    religion: student?.profile?.religion || "พุทธ",
    idCardNumber: student?.profile?.idCardNumber || "",
    bloodGroup: student?.profile?.bloodGroup || "",
    birthDomicile: student?.profile?.birthDomicile || "",
    addressNo: student?.profile?.addressNo || "",
    moo: student?.profile?.moo || "",
    alley: student?.profile?.alley || "",
    road: student?.profile?.road || "",
    subdistrict: student?.profile?.subdistrict || "",
    district: student?.profile?.district || "",
    province: student?.profile?.province || "",
    zipCode: student?.profile?.zipCode || "",
    currentAddressSame: student?.profile?.currentAddressSame !== undefined ? student?.profile?.currentAddressSame : true,
    currentAddressNo: student?.profile?.currentAddressNo || "",
    currentMoo: student?.profile?.currentMoo || "",
    currentAlley: student?.profile?.currentAlley || "",
    currentRoad: student?.profile?.currentRoad || "",
    currentSubdistrict: student?.profile?.currentSubdistrict || "",
    currentDistrict: student?.profile?.currentDistrict || "",
    currentProvince: student?.profile?.currentProvince || "",
    currentZipCode: student?.profile?.currentZipCode || "",
    phone: student?.profile?.phone || "",
    email: student?.profile?.email || "",
    siblingsCount: student?.profile?.siblingsCount || "",
    siblingsBoyCount: student?.profile?.siblingsBoyCount || "",
    siblingsGirlCount: student?.profile?.siblingsGirlCount || "",
    childNumber: student?.profile?.childNumber || "",
    fatherName: student?.profile?.fatherName || "",
    fatherSurname: student?.profile?.fatherSurname || "",
    fatherOccupation: student?.profile?.fatherOccupation || "",
    fatherWorkplace: student?.profile?.fatherWorkplace || "",
    fatherPhone: student?.profile?.fatherPhone || "",
    motherName: student?.profile?.motherName || "",
    motherSurname: student?.profile?.motherSurname || "",
    motherOccupation: student?.profile?.motherOccupation || "",
    motherWorkplace: student?.profile?.motherWorkplace || "",
    motherPhone: student?.profile?.motherPhone || "",
    guardianName: student?.profile?.guardianName || "",
    guardianSurname: student?.profile?.guardianSurname || "",
    guardianRelationship: student?.profile?.guardianRelationship || "",
    guardianOccupation: student?.profile?.guardianOccupation || "",
    guardianWorkplace: student?.profile?.guardianWorkplace || "",
    guardianPhone: student?.profile?.guardianPhone || "",
    talents: student?.profile?.talents || "",
    hobbies: student?.profile?.hobbies || "",
    specialInterest: student?.profile?.specialInterest || "",
    selfImpression: student?.profile?.selfImpression || "",
    futureDream: student?.profile?.futureDream || "",
    socialDesire: student?.profile?.socialDesire || "",
    driveFileId: student?.profile?.driveFileId || "",
    driveViewUrl: student?.profile?.driveViewUrl || "",
  });

  // Education entries
  const [eduHistory, setEduHistory] = useState<EducationEntry[]>(
    student?.educationHistory || [
      { level: "อนุบาล (Kindergarten)", schoolName: "", gradYear: "" },
      { level: "ประถมศึกษา (Primary)", schoolName: "", gradYear: "" },
    ]
  );

  // Academic record
  const [academicRecord, setAcademicRecord] = useState<AcademicRecord>(
    student?.academicRecord || {
      kindergartenDev: {
        year: "",
        teacherName: "",
        physical: "3",
        emotional: "3",
        social: "3",
        intellectual: "3",
      },
      primaryGrades: {
        "Prathom 1": { year: "", teacherName: "", gpa: "" },
        "Prathom 2": { year: "", teacherName: "", gpa: "" },
        "Prathom 3": { year: "", teacherName: "", gpa: "" },
        "Prathom 4": { year: "", teacherName: "", gpa: "" },
        "Prathom 5": { year: "", teacherName: "", gpa: "" },
        "Prathom 6": { year: "", teacherName: "", gpa: "" },
      },
    }
  );

  // Proud works state
  const [proudWorks, setProudWorks] = useState<ProudWork[]>(student?.proudWorks || []);
  
  // Awards state
  const [awards, setAwards] = useState<Award[]>(student?.awards || []);

  // Activity certificates state
  const [activityCertificates, setActivityCertificates] = useState<ActivityCertificate[]>(
    student?.activityCertificates || []
  );

  // Special talents state
  const [specialTalents, setSpecialTalents] = useState<SpecialTalent[]>(student?.specialTalents || []);

  // Evaluations state
  const [evaluations, setEvaluations] = useState<Evaluations>(
    student?.evaluations || {
      parent: {
        term1: { opinion: "", suggestion: "", signature: "", date: "" },
        term2: { opinion: "", suggestion: "", signature: "", date: "" },
      },
      teacher: {
        term1: { opinion: "", suggestion: "", signature: "", date: "" },
        term2: { opinion: "", suggestion: "", signature: "", date: "" },
      },
    }
  );

  // Upload state management
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  // Handlers
  const handleProfileChange = (field: keyof PersonalProfile, value: any) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    if (field === "firstName") setFirstName(value);
    if (field === "lastName") setLastName(value);
    if (field === "gender") setGender(value);
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldKey: string,
    callback: (fileId: string, url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(fieldKey);
    try {
      const parentFolderId = await getOrCreateMainFolder(accessToken);
      const cleanFileName = `${firstName}_${lastName}_${fieldKey}_${file.name}`;
      const result = await uploadFileToDrive(file, cleanFileName, parentFolderId, accessToken);
      
      callback(result.id, result.webViewLink);
      alert("อัปโหลดไฟล์ไปที่ Google Drive เรียบร้อยแล้ว!");
    } catch (err: any) {
      console.error(err);
      alert(`อัปโหลดล้มเหลว: ${err.message}`);
    } finally {
      setUploadingField(null);
    }
  };

  // Education Hist handlers
  const handleEduChange = (index: number, field: keyof EducationEntry, val: string) => {
    const updated = [...eduHistory];
    updated[index][field] = val;
    setEduHistory(updated);
  };

  const addEduEntry = () => {
    setEduHistory((prev) => [...prev, { level: "", schoolName: "", gradYear: "" }]);
  };

  const removeEduEntry = (index: number) => {
    setEduHistory((prev) => prev.filter((_, i) => i !== index));
  };

  // Primary grades GPA handler
  const handleGpaChange = (grade: string, field: keyof PrimaryGradeEntry, val: string) => {
    setAcademicRecord((prev) => {
      const copy = { ...prev };
      if (!copy.primaryGrades) copy.primaryGrades = {};
      if (!copy.primaryGrades[grade]) {
        copy.primaryGrades[grade] = { year: "", teacherName: "", gpa: "" };
      }
      copy.primaryGrades[grade][field] = val;
      return copy;
    });
  };

  const handleKDevChange = (field: keyof KindergartenDevelopment, val: string) => {
    setAcademicRecord((prev) => {
      const copy = { ...prev };
      if (!copy.kindergartenDev) {
        copy.kindergartenDev = { year: "", teacherName: "", physical: "3", emotional: "3", social: "3", intellectual: "3" };
      }
      copy.kindergartenDev = { ...copy.kindergartenDev, [field]: val };
      return copy;
    });
  };

  // Proud works handlers
  const addProudWork = () => {
    const newWork: ProudWork = {
      id: crypto.randomUUID(),
      term: "1",
      year: new Date().getFullYear().toString(),
      subjectArea: "ภาษาไทย",
      title: "",
      description: "",
    };
    setProudWorks((prev) => [...prev, newWork]);
  };

  const handleProudWorkChange = (id: string, field: keyof ProudWork, val: any) => {
    setProudWorks((prev) =>
      prev.map((pw) => (pw.id === id ? { ...pw, [field]: val } : pw))
    );
  };

  const removeProudWork = (id: string) => {
    setProudWorks((prev) => prev.filter((pw) => pw.id !== id));
  };

  // Awards handlers
  const addAward = () => {
    const newAward: Award = {
      id: crypto.randomUUID(),
      category: "academic",
      title: "",
      year: new Date().getFullYear().toString(),
    };
    setAwards((prev) => [...prev, newAward]);
  };

  const handleAwardChange = (id: string, field: keyof Award, val: any) => {
    setAwards((prev) =>
      prev.map((aw) => (aw.id === id ? { ...aw, [field]: val } : aw))
    );
  };

  const removeAward = (id: string) => {
    setAwards((prev) => prev.filter((aw) => aw.id !== id));
  };

  // Activity certs handlers
  const addActivityCert = () => {
    const newCert: ActivityCertificate = {
      id: crypto.randomUUID(),
      title: "",
      description: "",
      impression: "",
      benefit: "",
      year: new Date().getFullYear().toString(),
    };
    setActivityCertificates((prev) => [...prev, newCert]);
  };

  const handleActivityCertChange = (id: string, field: keyof ActivityCertificate, val: any) => {
    setActivityCertificates((prev) =>
      prev.map((ac) => (ac.id === id ? { ...ac, [field]: val } : ac))
    );
  };

  const removeActivityCert = (id: string) => {
    setActivityCertificates((prev) => prev.filter((ac) => ac.id !== id));
  };

  // Special talents handlers
  const addSpecialTalent = () => {
    const newTalent: SpecialTalent = {
      id: crypto.randomUUID(),
      title: "",
      description: "",
      impression: "",
      benefit: "",
      year: new Date().getFullYear().toString(),
    };
    setSpecialTalents((prev) => [...prev, newTalent]);
  };

  const handleSpecialTalentChange = (id: string, field: keyof SpecialTalent, val: any) => {
    setSpecialTalents((prev) =>
      prev.map((st) => (st.id === id ? { ...st, [field]: val } : st))
    );
  };

  const removeSpecialTalent = (id: string) => {
    setSpecialTalents((prev) => prev.filter((st) => st.id !== id));
  };

  // Evaluations handlers
  const handleEvalChange = (
    party: "parent" | "teacher",
    term: "term1" | "term2",
    field: keyof EvaluationTerm,
    val: string
  ) => {
    setEvaluations((prev) => {
      const copy = { ...prev };
      if (!copy[party]) copy[party] = {};
      if (!copy[party][term]) {
        copy[party][term] = { opinion: "", suggestion: "", signature: "", date: "" };
      }
      copy[party][term][field] = val;
      return copy;
    });
  };

  // Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      alert("กรุณากรอกชื่อและนามสกุลนักเรียน");
      return;
    }

    const payload: Partial<Student> = {
      firstName,
      lastName,
      gender,
      currentGrade,
      profile,
      educationHistory: eduHistory,
      academicRecord,
      proudWorks,
      awards,
      activityCertificates,
      specialTalents,
      evaluations,
    };
    onSave(payload);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden" id="student-form-container">
      {/* Form Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            {student ? "แก้ไขแฟ้มสะสมผลงานนักเรียน" : "สร้างแฟ้มสะสมผลงานใหม่"}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {student ? `${student.firstName} ${student.lastName}` : "ป้อนประวัตินักเรียนและอัปโหลดผลงานเก็บใน Google Drive"}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="p-1.5 hover:bg-gray-200 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-gray-100 bg-gray-50/50 overflow-x-auto scroller-hidden">
        {[
          { id: "profile", label: "ประวัติส่วนตัว (ส่วนที่ 1)" },
          { id: "education", label: "ประวัติการเรียน" },
          { id: "proud", label: "ผลงานดีเด่น 8 สาระ (ส่วนที่ 2)" },
          { id: "awards", label: "รางวัล/กิจกรรม (ส่วนที่ 3-5)" },
          { id: "evals", label: "แบบประเมินผู้ปกครอง/ครู" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-3 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "border-indigo-600 text-indigo-600 bg-white"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* TAB 1: Profile */}
        {activeTab === "profile" && (
          <div className="space-y-6" id="tab-profile-section">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile image upload */}
              <div className="flex-shrink-0 flex flex-col items-center space-y-3">
                <div className="w-36 h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center overflow-hidden bg-gray-50 relative">
                  {profile.driveViewUrl ? (
                    <img
                      src={profile.driveViewUrl}
                      alt="Student"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-3">
                      <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                      <span className="text-[10px] text-gray-400">ภาพนักเรียน</span>
                    </div>
                  )}
                  {uploadingField === "profile-pic" && (
                    <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                      <Loader2 className="animate-spin text-white" size={24} />
                    </div>
                  )}
                </div>
                <label className="cursor-pointer bg-white border border-gray-300 rounded-md px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-xs flex items-center gap-1.5">
                  <Upload size={14} />
                  {profile.driveFileId ? "เปลี่ยนภาพ" : "อัปโหลดภาพ"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileUpload(e, "profile-pic", (fileId, url) => {
                        handleProfileChange("driveFileId", fileId);
                        handleProfileChange("driveViewUrl", url);
                      })
                    }
                    className="hidden"
                  />
                </label>
              </div>

              {/* Basic Profile data */}
              <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">คำนำหน้าชื่อ</label>
                  <select
                    value={profile.title}
                    onChange={(e) => handleProfileChange("title", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="เด็กชาย">เด็กชาย</option>
                    <option value="เด็กหญิง">เด็กหญิง</option>
                    <option value="นาย">นาย</option>
                    <option value="นางสาว">นางสาว</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">ชื่อจริง *</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => handleProfileChange("firstName", e.target.value)}
                    placeholder="เช่น สมชาย"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">นามสกุล *</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => handleProfileChange("lastName", e.target.value)}
                    placeholder="เช่น รักดี"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">ชื่อเล่น</label>
                  <input
                    type="text"
                    value={profile.nickname}
                    onChange={(e) => handleProfileChange("nickname", e.target.value)}
                    placeholder="เช่น ต้น"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">เพศ</label>
                  <select
                    value={gender}
                    onChange={(e) => handleProfileChange("gender", e.target.value as any)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Male">ชาย</option>
                    <option value="Female">หญิง</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">ระดับชั้นปัจจุบัน *</label>
                  <select
                    value={currentGrade}
                    onChange={(e) => setCurrentGrade(e.target.value as any)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Kindergarten 1">อนุบาล 1</option>
                    <option value="Kindergarten 2">อนุบาล 2</option>
                    <option value="Kindergarten 3">อนุบาล 3</option>
                    <option value="Prathom 1">ประถมศึกษาปีที่ 1</option>
                    <option value="Prathom 2">ประถมศึกษาปีที่ 2</option>
                    <option value="Prathom 3">ประถมศึกษาปีที่ 3</option>
                    <option value="Prathom 4">ประถมศึกษาปีที่ 4</option>
                    <option value="Prathom 5">ประถมศึกษาปีที่ 5</option>
                    <option value="Prathom 6">ประถมศึกษาปีที่ 6</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">วัน/เดือน/ปี เกิด (พ.ศ.)</label>
                  <input
                    type="text"
                    value={profile.birthDate}
                    onChange={(e) => handleProfileChange("birthDate", e.target.value)}
                    placeholder="เช่น 1 มกราคม 2555"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">อายุ (ปี)</label>
                  <input
                    type="text"
                    value={profile.age}
                    onChange={(e) => handleProfileChange("age", e.target.value)}
                    placeholder="เช่น 10"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">สถานที่เกิด</label>
                  <input
                    type="text"
                    value={profile.birthPlace}
                    onChange={(e) => handleProfileChange("birthPlace", e.target.value)}
                    placeholder="เช่น รพ.แพร่"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">สัญชาติ</label>
                  <input
                    type="text"
                    value={profile.nationality}
                    onChange={(e) => handleProfileChange("nationality", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">เชื้อชาติ</label>
                  <input
                    type="text"
                    value={profile.race}
                    onChange={(e) => handleProfileChange("race", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">ศาสนา</label>
                  <input
                    type="text"
                    value={profile.religion}
                    onChange={(e) => handleProfileChange("religion", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">เลขบัตรประจำตัวประชาชน</label>
                  <input
                    type="text"
                    value={profile.idCardNumber}
                    onChange={(e) => handleProfileChange("idCardNumber", e.target.value)}
                    placeholder="13 หลัก"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">กลุ่มเลือด</label>
                  <input
                    type="text"
                    value={profile.bloodGroup}
                    onChange={(e) => handleProfileChange("bloodGroup", e.target.value)}
                    placeholder="A, B, AB, O"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">ภูมิลำเนา</label>
                  <input
                    type="text"
                    value={profile.birthDomicile}
                    onChange={(e) => handleProfileChange("birthDomicile", e.target.value)}
                    placeholder="เช่น จ.แพร่"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="border-t border-gray-100 pt-5">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">ที่อยู่ตามทะเบียนบ้าน</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">บ้านเลขที่</label>
                  <input
                    type="text"
                    value={profile.addressNo}
                    onChange={(e) => handleProfileChange("addressNo", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">หมู่ที่</label>
                  <input
                    type="text"
                    value={profile.moo}
                    onChange={(e) => handleProfileChange("moo", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">ตรอก/ซอย</label>
                  <input
                    type="text"
                    value={profile.alley}
                    onChange={(e) => handleProfileChange("alley", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">ถนน</label>
                  <input
                    type="text"
                    value={profile.road}
                    onChange={(e) => handleProfileChange("road", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">ตำบล/แขวง</label>
                  <input
                    type="text"
                    value={profile.subdistrict}
                    onChange={(e) => handleProfileChange("subdistrict", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">อำเภอ/เขต</label>
                  <input
                    type="text"
                    value={profile.district}
                    onChange={(e) => handleProfileChange("district", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">จังหวัด</label>
                  <input
                    type="text"
                    value={profile.province}
                    onChange={(e) => handleProfileChange("province", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">รหัสไปรษณีย์</label>
                  <input
                    type="text"
                    value={profile.zipCode}
                    onChange={(e) => handleProfileChange("zipCode", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Siblings */}
            <div className="border-t border-gray-100 pt-5">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">ข้อมูลพี่น้อง</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">จำนวนพี่น้องทั้งหมด</label>
                  <input
                    type="text"
                    value={profile.siblingsCount}
                    onChange={(e) => handleProfileChange("siblingsCount", e.target.value)}
                    placeholder="เช่น 2 คน"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">จำนวนพี่น้อง ชาย</label>
                  <input
                    type="text"
                    value={profile.siblingsBoyCount}
                    onChange={(e) => handleProfileChange("siblingsBoyCount", e.target.value)}
                    placeholder="คน"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">จำนวนพี่น้อง หญิง</label>
                  <input
                    type="text"
                    value={profile.siblingsGirlCount}
                    onChange={(e) => handleProfileChange("siblingsGirlCount", e.target.value)}
                    placeholder="คน"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">เป็นบุตรคนที่</label>
                  <input
                    type="text"
                    value={profile.childNumber}
                    onChange={(e) => handleProfileChange("childNumber", e.target.value)}
                    placeholder="เช่น 1"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Parents */}
            <div className="border-t border-gray-100 pt-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Father Info */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">ข้อมูลบิดา</h4>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">ชื่อ-สกุล บิดา</label>
                    <input
                      type="text"
                      value={profile.fatherName}
                      onChange={(e) => handleProfileChange("fatherName", e.target.value)}
                      placeholder="ชื่อและนามสกุล"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">อาชีพ</label>
                    <input
                      type="text"
                      value={profile.fatherOccupation}
                      onChange={(e) => handleProfileChange("fatherOccupation", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">สถานที่ทำงาน</label>
                    <input
                      type="text"
                      value={profile.fatherWorkplace}
                      onChange={(e) => handleProfileChange("fatherWorkplace", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">เบอร์โทรศัพท์</label>
                    <input
                      type="text"
                      value={profile.fatherPhone}
                      onChange={(e) => handleProfileChange("fatherPhone", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                {/* Mother Info */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">ข้อมูลมารดา</h4>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">ชื่อ-สกุล มารดา</label>
                    <input
                      type="text"
                      value={profile.motherName}
                      onChange={(e) => handleProfileChange("motherName", e.target.value)}
                      placeholder="ชื่อและนามสกุล"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">อาชีพ</label>
                    <input
                      type="text"
                      value={profile.motherOccupation}
                      onChange={(e) => handleProfileChange("motherOccupation", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">สถานที่ทำงาน</label>
                    <input
                      type="text"
                      value={profile.motherWorkplace}
                      onChange={(e) => handleProfileChange("motherWorkplace", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">เบอร์โทรศัพท์</label>
                    <input
                      type="text"
                      value={profile.motherPhone}
                      onChange={(e) => handleProfileChange("motherPhone", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Talents and dreams */}
            <div className="border-t border-gray-100 pt-5 space-y-4">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">ทักษะ ความสนใจ และความใฝ่ฝัน</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">ความสามารถพิเศษและความสนใจ</label>
                  <textarea
                    value={profile.talents}
                    onChange={(e) => handleProfileChange("talents", e.target.value)}
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs"
                    placeholder="เช่น เล่นดนตรี วาดรูป คอมพิวเตอร์"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">งานอดิเรกต่างๆ</label>
                  <textarea
                    value={profile.hobbies}
                    onChange={(e) => handleProfileChange("hobbies", e.target.value)}
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs"
                    placeholder="เช่น อ่านหนังสือ ต่อจิ๊กซอว์"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">ความประทับใจต่อตนเอง</label>
                  <textarea
                    value={profile.selfImpression}
                    onChange={(e) => handleProfileChange("selfImpression", e.target.value)}
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs"
                    placeholder="บรรยายความประทับใจ..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">ความใฝ่ฝันในอนาคต</label>
                  <textarea
                    value={profile.futureDream}
                    onChange={(e) => handleProfileChange("futureDream", e.target.value)}
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs"
                    placeholder="เช่น คุณหมอ วิศวกร คุณครู"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">ความต้องการที่จะอุทิศตนเองเพื่อส่วนรวม/สังคม/ประเทศชาติ</label>
                  <textarea
                    value={profile.socialDesire}
                    onChange={(e) => handleProfileChange("socialDesire", e.target.value)}
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs"
                    placeholder="เขียนระบุแนวทาง..."
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Education & Grades */}
        {activeTab === "education" && (
          <div className="space-y-6" id="tab-education-section">
            {/* Education History table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-800">1.4 ประวัติการศึกษา</h3>
                <button
                  type="button"
                  onClick={addEduEntry}
                  className="px-2.5 py-1 text-[10px] font-semibold text-indigo-600 border border-indigo-200 hover:bg-indigo-50 rounded-lg flex items-center gap-1"
                >
                  <Plus size={12} /> เพิ่มประวัติ
                </button>
              </div>
              <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50/50">
                <table className="w-full text-xs text-left">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="px-4 py-2 font-semibold">ระดับชั้น</th>
                      <th className="px-4 py-2 font-semibold">ชื่อสถานศึกษา</th>
                      <th className="px-4 py-2 font-semibold">ปีการศึกษาที่จบ</th>
                      <th className="px-4 py-2 w-16"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {eduHistory.map((edu, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={edu.level}
                            onChange={(e) => handleEduChange(index, "level", e.target.value)}
                            className="w-full border-0 focus:ring-0 p-0 text-xs"
                            placeholder="ระดับชั้น"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={edu.schoolName}
                            onChange={(e) => handleEduChange(index, "schoolName", e.target.value)}
                            className="w-full border-0 focus:ring-0 p-0 text-xs"
                            placeholder="ชื่อโรงเรียน"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={edu.gradYear}
                            onChange={(e) => handleEduChange(index, "gradYear", e.target.value)}
                            className="w-full border-0 focus:ring-0 p-0 text-xs"
                            placeholder="ปีการศึกษา พ.ศ."
                          />
                        </td>
                        <td className="px-4 py-2 text-right">
                          <button
                            type="button"
                            onClick={() => removeEduEntry(index)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Kindergarten Evaluation (for Anuban) */}
            <div className="border-t border-gray-100 pt-5 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-800">รายงานประวัติผลการประเมินพัฒนาการ (ระดับชั้นอนุบาล)</h3>
                <p className="text-xs text-gray-400 mt-0.5">แบบประเมินผลพัฒนาการ 4 ด้าน สำหรับชั้นอนุบาล 3</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">ปีการศึกษาที่ประเมิน</label>
                  <input
                    type="text"
                    value={academicRecord.kindergartenDev?.year || ""}
                    onChange={(e) => handleKDevChange("year", e.target.value)}
                    placeholder="เช่น 2565"
                    className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">ชื่อครูประจำชั้นอนุบาล</label>
                  <input
                    type="text"
                    value={academicRecord.kindergartenDev?.teacherName || ""}
                    onChange={(e) => handleKDevChange("teacherName", e.target.value)}
                    placeholder="เช่น ครูวิภา ใจดี"
                    className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 text-xs"
                  />
                </div>

                {/* Developer Levels */}
                <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  {[
                    { id: "physical", label: "ด้านร่างกาย" },
                    { id: "emotional", label: "ด้านอารมณ์และจิตใจ" },
                    { id: "social", label: "ด้านสังคม" },
                    { id: "intellectual", label: "ด้านสติปัญญา" },
                  ].map((dev) => (
                    <div key={dev.id}>
                      <label className="block text-xs font-medium text-gray-600 mb-1">{dev.label}</label>
                      <select
                        value={(academicRecord.kindergartenDev as any)?.[dev.id] || "3"}
                        onChange={(e) => handleKDevChange(dev.id as any, e.target.value)}
                        className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 text-xs"
                      >
                        <option value="3">3 (ดีเยี่ยม)</option>
                        <option value="2">2 (ดี)</option>
                        <option value="1">1 (พอใช้)</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* GPA records (for Primary Prathom 1 - 6) */}
            <div className="border-t border-gray-100 pt-5 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-800">รายงานประวัติผลการเรียน (ระดับชั้นประถมศึกษา ป.1 - ป.6)</h3>
                <p className="text-xs text-gray-400 mt-0.5">ระบุผลการเรียนเฉลี่ยสะสม (GPA) และปีการศึกษาสำหรับประถมศึกษาแต่ละชั้นปี</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: "Prathom 1", label: "ประถมศึกษาปีที่ 1 (ป.1)" },
                  { key: "Prathom 2", label: "ประถมศึกษาปีที่ 2 (ป.2)" },
                  { key: "Prathom 3", label: "ประถมศึกษาปีที่ 3 (ป.3)" },
                  { key: "Prathom 4", label: "ประถมศึกษาปีที่ 4 (ป.4)" },
                  { key: "Prathom 5", label: "ประถมศึกษาปีที่ 5 (ป.5)" },
                  { key: "Prathom 6", label: "ประถมศึกษาปีที่ 6 (ป.6)" },
                ].map((grade) => {
                  const entry = academicRecord.primaryGrades?.[grade.key] || { year: "", teacherName: "", gpa: "" };
                  return (
                    <div key={grade.key} className="bg-gray-50/50 p-3.5 rounded-xl border border-gray-200 grid grid-cols-3 gap-2 items-end">
                      <div className="col-span-3">
                        <span className="text-xs font-bold text-gray-800">{grade.label}</span>
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-500 mb-0.5">ปีการศึกษา</label>
                        <input
                          type="text"
                          value={entry.year}
                          onChange={(e) => handleGpaChange(grade.key, "year", e.target.value)}
                          placeholder="พ.ศ."
                          className="w-full border border-gray-300 bg-white rounded-lg px-2 py-1 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-500 mb-0.5">ครูประจำชั้น</label>
                        <input
                          type="text"
                          value={entry.teacherName}
                          onChange={(e) => handleGpaChange(grade.key, "teacherName", e.target.value)}
                          placeholder="ชื่อครู"
                          className="w-full border border-gray-300 bg-white rounded-lg px-2 py-1 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-500 mb-0.5">เกรดเฉลี่ย (GPA)</label>
                        <input
                          type="text"
                          value={entry.gpa}
                          onChange={(e) => handleGpaChange(grade.key, "gpa", e.target.value)}
                          placeholder="4.00"
                          className="w-full border border-gray-300 bg-white rounded-lg px-2 py-1 text-xs"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Proud Works (ส่วนที่ 2) */}
        {activeTab === "proud" && (
          <div className="space-y-6" id="tab-proudworks-section">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-800">ความภาคภูมิใจในผลงานการเรียนรู้ 8 กลุ่มสาระการเรียนรู้</h3>
                <p className="text-xs text-gray-400 mt-0.5">เลือกผลงานที่ภาคภูมิใจในแต่ละภาคเรียน (ภาคเรียนละ 1 - 3 ชิ้น)</p>
              </div>
              <button
                type="button"
                onClick={addProudWork}
                className="px-3 py-1.5 text-xs font-semibold text-indigo-600 border border-indigo-200 hover:bg-indigo-50 rounded-lg flex items-center gap-1.5 shadow-xs"
              >
                <Plus size={14} /> เพิ่มผลงานชิ้นงาน
              </button>
            </div>

            {proudWorks.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-xs text-gray-400">ยังไม่มีการเพิ่มผลงาน 8 กลุ่มสาระการเรียนรู้</p>
                <button
                  type="button"
                  onClick={addProudWork}
                  className="mt-2 text-xs font-bold text-indigo-600 hover:underline"
                >
                  คลิกที่นี่เพื่อเพิ่มผลงานแรก
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {proudWorks.map((pw, i) => (
                  <div key={pw.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Position Label / Delete Button */}
                    <div className="md:col-span-4 flex items-center justify-between border-b border-gray-200 pb-2">
                      <span className="text-xs font-bold text-gray-800">ผลงานลำดับที่ {i + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeProudWork(pw.id)}
                        className="text-gray-400 hover:text-red-500 p-1 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Image Upload for Work */}
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-full h-32 bg-white border border-gray-300 rounded-lg overflow-hidden flex items-center justify-center relative">
                        {pw.driveViewUrl ? (
                          <img
                            src={pw.driveViewUrl}
                            alt="Proud Work"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center p-3 text-gray-400">
                            <Upload className="mx-auto mb-1.5" size={18} />
                            <span className="text-[10px]">รูปภาพชิ้นงาน</span>
                          </div>
                        )}
                        {uploadingField === `proud-${pw.id}` && (
                          <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                            <Loader2 className="animate-spin text-white" size={18} />
                          </div>
                        )}
                      </div>
                      <label className="cursor-pointer bg-white border border-gray-300 rounded px-2.5 py-1 text-[10px] font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1">
                        <Upload size={12} />
                        อัปโหลดไปไดรฟ์
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleFileUpload(e, `proud-${pw.id}`, (fileId, url) => {
                              handleProudWorkChange(pw.id, "driveFileId", fileId);
                              handleProudWorkChange(pw.id, "driveViewUrl", url);
                            })
                          }
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Form Fields for Work */}
                    <div className="md:col-span-3 space-y-3">
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-[10px] text-gray-500 mb-0.5">ปีการศึกษา *</label>
                          <input
                            type="text"
                            required
                            value={pw.year}
                            onChange={(e) => handleProudWorkChange(pw.id, "year", e.target.value)}
                            placeholder="เช่น 2566"
                            className="w-full border border-gray-300 bg-white rounded-lg px-2.5 py-1.5 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-500 mb-0.5">ภาคเรียน *</label>
                          <select
                            value={pw.term}
                            onChange={(e) => handleProudWorkChange(pw.id, "term", e.target.value)}
                            className="w-full border border-gray-300 bg-white rounded-lg px-2.5 py-1.5 text-xs"
                          >
                            <option value="1">ภาคเรียนที่ 1</option>
                            <option value="2">ภาคเรียนที่ 2</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-500 mb-0.5">กลุ่มสาระการเรียนรู้ *</label>
                          <select
                            value={pw.subjectArea}
                            onChange={(e) => handleProudWorkChange(pw.id, "subjectArea", e.target.value)}
                            className="w-full border border-gray-300 bg-white rounded-lg px-2.5 py-1.5 text-xs"
                          >
                            <option value="ภาษาไทย">ภาษาไทย</option>
                            <option value="คณิตศาสตร์">คณิตศาสตร์</option>
                            <option value="วิทยาศาสตร์และเทคโนโลยี">วิทยาศาสตร์และเทคโนโลยี</option>
                            <option value="สังคมศึกษา ศาสนา และวัฒนธรรม">สังคมศึกษาฯ</option>
                            <option value="สุขศึกษาและพลศึกษา">สุขศึกษาและพลศึกษา</option>
                            <option value="ศิลปะ">ศิลปะ</option>
                            <option value="การงานอาชีพ">การงานอาชีพ</option>
                            <option value="ภาษาต่างประเทศ">ภาษาต่างประเทศ</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] text-gray-500 mb-0.5">หัวข้อชิ้นงาน/ชื่อผลงาน *</label>
                        <input
                          type="text"
                          required
                          value={pw.title}
                          onChange={(e) => handleProudWorkChange(pw.id, "title", e.target.value)}
                          placeholder="ระบุหัวข้อ เช่น ภาพวาดวันแม่, คัดลายมือภาษาไทย"
                          className="w-full border border-gray-300 bg-white rounded-lg px-2.5 py-1.5 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-gray-500 mb-0.5">คำอธิบาย/แนวทางการพัฒนาและการนำไปใช้</label>
                        <textarea
                          value={pw.description}
                          onChange={(e) => handleProudWorkChange(pw.id, "description", e.target.value)}
                          placeholder="อธิบายว่าผลงานนี้คืออะไร มีประโยชน์อย่างไร หรือความรู้สึกทักษะที่ได้เรียนรู้..."
                          rows={2}
                          className="w-full border border-gray-300 bg-white rounded-lg px-2.5 py-1.5 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: Awards & Certificates & Activities (ส่วนที่ 3-5) */}
        {activeTab === "awards" && (
          <div className="space-y-8" id="tab-awards-section">
            {/* 1. Awards (ส่วนที่ 3) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">ส่วนที่ 3: ผลงานเด่นรางวัล การประกวด การแข่งขัน</h3>
                  <p className="text-xs text-gray-400 mt-0.5">รางวัลดีเด่นแยกตามด้านต่างๆ เช่น วิชาการ กีฬา ศิลปะ ความเป็นผู้นำ และคุณธรรม</p>
                </div>
                <button
                  type="button"
                  onClick={addAward}
                  className="px-2.5 py-1 text-[11px] font-semibold text-indigo-600 border border-indigo-200 hover:bg-indigo-50 rounded-lg flex items-center gap-1"
                >
                  <Plus size={12} /> เพิ่มรางวัล
                </button>
              </div>

              {awards.length === 0 ? (
                <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <p className="text-xs text-gray-400">ยังไม่มีการเพิ่มรางวัล</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {awards.map((aw, i) => (
                    <div key={aw.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative flex gap-4">
                      {/* Left Column: Image Certificate Upload */}
                      <div className="flex flex-col items-center space-y-1.5 flex-shrink-0">
                        <div className="w-24 h-24 bg-white border border-gray-300 rounded overflow-hidden flex items-center justify-center relative">
                          {aw.driveViewUrl ? (
                            <img
                              src={aw.driveViewUrl}
                              alt="Award Certificate"
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-[9px] text-gray-400 text-center px-1">รูปเกียรติบัตร/ภาพรางวัล</span>
                          )}
                          {uploadingField === `award-${aw.id}` && (
                            <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                              <Loader2 className="animate-spin text-white" size={14} />
                            </div>
                          )}
                        </div>
                        <label className="cursor-pointer bg-white border border-gray-300 rounded px-1.5 py-0.5 text-[9px] font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1">
                          <Upload size={10} />
                          อัปโหลด
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleFileUpload(e, `award-${aw.id}`, (fileId, url) => {
                                handleAwardChange(aw.id, "driveFileId", fileId);
                                handleAwardChange(aw.id, "driveViewUrl", url);
                              })
                            }
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Right Column: Fields */}
                      <div className="flex-grow space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-gray-500">รางวัล #{i+1}</span>
                          <button
                            type="button"
                            onClick={() => removeAward(aw.id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[9px] text-gray-500 mb-0.5">ด้านหลักรางวัล</label>
                            <select
                              value={aw.category}
                              onChange={(e) => handleAwardChange(aw.id, "category", e.target.value)}
                              className="w-full border border-gray-300 bg-white rounded-lg px-1.5 py-1 text-[10px]"
                            >
                              <option value="academic">ด้านวิชาการ</option>
                              <option value="language_art_culture">ด้านภาษา ศิลปวัฒนธรรม</option>
                              <option value="leadership">ด้านความเป็นผู้นำ</option>
                              <option value="sports">ด้านกีฬา</option>
                              <option value="morals_ethics">ด้านศีลธรรม/จริยธรรม</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[9px] text-gray-500 mb-0.5">ปีการศึกษา (พ.ศ.)</label>
                            <input
                              type="text"
                              value={aw.year}
                              onChange={(e) => handleAwardChange(aw.id, "year", e.target.value)}
                              className="w-full border border-gray-300 bg-white rounded-lg px-1.5 py-1 text-[10px]"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[9px] text-gray-500 mb-0.5">ชื่อรางวัลที่ได้รับ *</label>
                          <input
                            type="text"
                            required
                            value={aw.title}
                            onChange={(e) => handleAwardChange(aw.id, "title", e.target.value)}
                            placeholder="เช่น ชนะเลิศ คัดลายมือระดับเขต"
                            className="w-full border border-gray-300 bg-white rounded-lg px-1.5 py-1 text-[10px]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Activities (ส่วนที่ 4) */}
            <div className="border-t border-gray-100 pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">ส่วนที่ 4: เกียรติบัตรการเข้าร่วมกิจกรรม การเข้าค่าย</h3>
                  <p className="text-xs text-gray-400 mt-0.5">การเข้าร่วมกิจกรรมสัปดาห์ต่างๆ ค่ายทักษะวิชาการ และกิจกรรมจิตอาสา</p>
                </div>
                <button
                  type="button"
                  onClick={addActivityCert}
                  className="px-2.5 py-1 text-[11px] font-semibold text-indigo-600 border border-indigo-200 hover:bg-indigo-50 rounded-lg flex items-center gap-1"
                >
                  <Plus size={12} /> เพิ่มกิจกรรม
                </button>
              </div>

              {activityCertificates.length === 0 ? (
                <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <p className="text-xs text-gray-400">ยังไม่มีประวัติกิจกรรม</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activityCertificates.map((ac, i) => (
                    <div key={ac.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Pos label / Trash */}
                      <div className="md:col-span-4 flex items-center justify-between border-b border-gray-200 pb-1.5">
                        <span className="text-xs font-bold text-gray-700">กิจกรรมที่ {i + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeActivityCert(ac.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      {/* Image cert */}
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-full h-24 bg-white border border-gray-300 rounded overflow-hidden flex items-center justify-center relative">
                          {ac.driveViewUrl ? (
                            <img
                              src={ac.driveViewUrl}
                              alt="Activity"
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-[10px] text-gray-400">รูปเกียรติบัตร/ภาพเข้าร่วม</span>
                          )}
                          {uploadingField === `cert-${ac.id}` && (
                            <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                              <Loader2 className="animate-spin text-white" size={14} />
                            </div>
                          )}
                        </div>
                        <label className="cursor-pointer bg-white border border-gray-300 rounded px-2 py-0.5 text-[9px] font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1">
                          <Upload size={10} /> Up
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleFileUpload(e, `cert-${ac.id}`, (fileId, url) => {
                                handleActivityCertChange(ac.id, "driveFileId", fileId);
                                handleActivityCertChange(ac.id, "driveViewUrl", url);
                              })
                            }
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Form inputs */}
                      <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] text-gray-500 mb-0.5">ปีการศึกษา (พ.ศ.)</label>
                          <input
                            type="text"
                            value={ac.year}
                            onChange={(e) => handleActivityCertChange(ac.id, "year", e.target.value)}
                            className="w-full border border-gray-300 bg-white rounded-lg px-2 py-1 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-500 mb-0.5">ชื่อกิจกรรม/ค่าย *</label>
                          <input
                            type="text"
                            required
                            value={ac.title}
                            onChange={(e) => handleActivityCertChange(ac.id, "title", e.target.value)}
                            placeholder="เช่น ค่ายธรรมะพุทโธปัญญา"
                            className="w-full border border-gray-300 bg-white rounded-lg px-2 py-1 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-500 mb-0.5">ความประทับใจ</label>
                          <textarea
                            value={ac.impression}
                            onChange={(e) => handleActivityCertChange(ac.id, "impression", e.target.value)}
                            className="w-full border border-gray-300 bg-white rounded-lg px-2 py-1 text-xs"
                            rows={2}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-500 mb-0.5">คุณค่า / ประโยชน์ที่ได้รับ</label>
                          <textarea
                            value={ac.benefit}
                            onChange={(e) => handleActivityCertChange(ac.id, "benefit", e.target.value)}
                            className="w-full border border-gray-300 bg-white rounded-lg px-2 py-1 text-xs"
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Special Talents (ส่วนที่ 5) */}
            <div className="border-t border-gray-100 pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">ส่วนที่ 5: กิจกรรมความสามารถพิเศษ หน้าที่ที่ได้รับมอบหมาย</h3>
                  <p className="text-xs text-gray-400 mt-0.5">หน้าที่ผู้นำสภานักเรียน กองดนตรี ทักษะการฟ้อนรำ ศิลปะคอมพิวเตอร์</p>
                </div>
                <button
                  type="button"
                  onClick={addSpecialTalent}
                  className="px-2.5 py-1 text-[11px] font-semibold text-indigo-600 border border-indigo-200 hover:bg-indigo-50 rounded-lg flex items-center gap-1"
                >
                  <Plus size={12} /> เพิ่มความสามารถพิเศษ
                </button>
              </div>

              {specialTalents.length === 0 ? (
                <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <p className="text-xs text-gray-400">ยังไม่มีประวัติความสามารถพิเศษ</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {specialTalents.map((st, i) => (
                    <div key={st.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Pos label / Trash */}
                      <div className="md:col-span-4 flex items-center justify-between border-b border-gray-200 pb-1.5">
                        <span className="text-xs font-bold text-gray-700">ลำดับที่ {i + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeSpecialTalent(st.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      {/* Image cert */}
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-full h-24 bg-white border border-gray-300 rounded overflow-hidden flex items-center justify-center relative">
                          {st.driveViewUrl ? (
                            <img
                              src={st.driveViewUrl}
                              alt="Special Talent"
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-[10px] text-gray-400">ภาพประกอบกิจกรรม</span>
                          )}
                          {uploadingField === `talent-${st.id}` && (
                            <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                              <Loader2 className="animate-spin text-white" size={14} />
                            </div>
                          )}
                        </div>
                        <label className="cursor-pointer bg-white border border-gray-300 rounded px-2 py-0.5 text-[9px] font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1">
                          <Upload size={10} /> Up
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleFileUpload(e, `talent-${st.id}`, (fileId, url) => {
                                handleSpecialTalentChange(st.id, "driveFileId", fileId);
                                handleSpecialTalentChange(st.id, "driveViewUrl", url);
                              })
                            }
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Form inputs */}
                      <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] text-gray-500 mb-0.5">ปีการศึกษา (พ.ศ.)</label>
                          <input
                            type="text"
                            value={st.year}
                            onChange={(e) => handleSpecialTalentChange(st.id, "year", e.target.value)}
                            className="w-full border border-gray-300 bg-white rounded-lg px-2 py-1 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-500 mb-0.5">ความสามารถพิเศษ / หน้าที่รับมอบหมาย *</label>
                          <input
                            type="text"
                            required
                            value={st.title}
                            onChange={(e) => handleSpecialTalentChange(st.id, "title", e.target.value)}
                            placeholder="เช่น หัวหน้าทีมกลองยาวโรงเรียน"
                            className="w-full border border-gray-300 bg-white rounded-lg px-2 py-1 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-500 mb-0.5">รายละเอียดผลงาน</label>
                          <textarea
                            value={st.description}
                            onChange={(e) => handleSpecialTalentChange(st.id, "description", e.target.value)}
                            className="w-full border border-gray-300 bg-white rounded-lg px-2 py-1 text-xs"
                            rows={2}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-500 mb-0.5">ความรู้สึก / ความภาคภูมิใจ</label>
                          <textarea
                            value={st.impression}
                            onChange={(e) => handleSpecialTalentChange(st.id, "impression", e.target.value)}
                            className="w-full border border-gray-300 bg-white rounded-lg px-2 py-1 text-xs"
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: Evaluations */}
        {activeTab === "evals" && (
          <div className="space-y-6" id="tab-evaluations-section">
            {/* Parent Evaluation */}
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
              <h3 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-2">สำหรับผู้ปกครอง</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Term 1 */}
                <div className="bg-white p-4 rounded-xl border border-gray-100 space-y-3">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">ภาคเรียนที่ 1</span>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-0.5">ความคิดเห็นของผู้ปกครอง</label>
                    <textarea
                      value={evaluations.parent?.term1?.opinion || ""}
                      onChange={(e) => handleEvalChange("parent", "term1", "opinion", e.target.value)}
                      placeholder="ความสามารถ ความสนใจ หรือผลงานที่โดดเด่น..."
                      rows={2}
                      className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-0.5">แนวทางในการสนับสนุนพัฒนา</label>
                    <textarea
                      value={evaluations.parent?.term1?.suggestion || ""}
                      onChange={(e) => handleEvalChange("parent", "term1", "suggestion", e.target.value)}
                      placeholder="แนวทางการดูแลร่วมกับทางโรงเรียน..."
                      rows={2}
                      className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-0.5">ลงชื่อผู้ปกครอง</label>
                      <input
                        type="text"
                        value={evaluations.parent?.term1?.signature || ""}
                        onChange={(e) => handleEvalChange("parent", "term1", "signature", e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-2.5 py-1 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-0.5">วันที่ประเมิน</label>
                      <input
                        type="text"
                        value={evaluations.parent?.term1?.date || ""}
                        onChange={(e) => handleEvalChange("parent", "term1", "date", e.target.value)}
                        placeholder="วว/ดด/ปปปป"
                        className="w-full border border-gray-300 rounded-lg px-2.5 py-1 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Term 2 */}
                <div className="bg-white p-4 rounded-xl border border-gray-100 space-y-3">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">ภาคเรียนที่ 2</span>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-0.5">ความคิดเห็นของผู้ปกครอง</label>
                    <textarea
                      value={evaluations.parent?.term2?.opinion || ""}
                      onChange={(e) => handleEvalChange("parent", "term2", "opinion", e.target.value)}
                      placeholder="ความสามารถ ความสนใจ หรือผลงานที่โดดเด่น..."
                      rows={2}
                      className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-0.5">แนวทางในการสนับสนุนพัฒนา</label>
                    <textarea
                      value={evaluations.parent?.term2?.suggestion || ""}
                      onChange={(e) => handleEvalChange("parent", "term2", "suggestion", e.target.value)}
                      placeholder="แนวทางการดูแลร่วมกับทางโรงเรียน..."
                      rows={2}
                      className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-0.5">ลงชื่อผู้ปกครอง</label>
                      <input
                        type="text"
                        value={evaluations.parent?.term2?.signature || ""}
                        onChange={(e) => handleEvalChange("parent", "term2", "signature", e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-2.5 py-1 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-0.5">วันที่ประเมิน</label>
                      <input
                        type="text"
                        value={evaluations.parent?.term2?.date || ""}
                        onChange={(e) => handleEvalChange("parent", "term2", "date", e.target.value)}
                        placeholder="วว/ดด/ปปปป"
                        className="w-full border border-gray-300 rounded-lg px-2.5 py-1 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Teacher Evaluation */}
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
              <h3 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-2">สำหรับครูประจำชั้น</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Term 1 */}
                <div className="bg-white p-4 rounded-xl border border-gray-100 space-y-3">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">ภาคเรียนที่ 1</span>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-0.5">ความคิดเห็นของครู</label>
                    <textarea
                      value={evaluations.teacher?.term1?.opinion || ""}
                      onChange={(e) => handleEvalChange("teacher", "term1", "opinion", e.target.value)}
                      placeholder="ความคิดเห็นต่อทักษะ พัฒนาการ พฤติกรรม..."
                      rows={2}
                      className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-0.5">ข้อเสนอแนะเพื่อการพัฒนา</label>
                    <textarea
                      value={evaluations.teacher?.term1?.suggestion || ""}
                      onChange={(e) => handleEvalChange("teacher", "term1", "suggestion", e.target.value)}
                      placeholder="สิ่งที่ควรฝึกฝนเพิ่มเติมหรือสนับสนุนอย่างต่อเนื่อง..."
                      rows={2}
                      className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-0.5">ลงชื่อครูประจำชั้น</label>
                      <input
                        type="text"
                        value={evaluations.teacher?.term1?.signature || ""}
                        onChange={(e) => handleEvalChange("teacher", "term1", "signature", e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-2.5 py-1 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-0.5">วันที่ประเมิน</label>
                      <input
                        type="text"
                        value={evaluations.teacher?.term1?.date || ""}
                        onChange={(e) => handleEvalChange("teacher", "term1", "date", e.target.value)}
                        placeholder="วว/ดด/ปปปป"
                        className="w-full border border-gray-300 rounded-lg px-2.5 py-1 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Term 2 */}
                <div className="bg-white p-4 rounded-xl border border-gray-100 space-y-3">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">ภาคเรียนที่ 2</span>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-0.5">ความคิดเห็นของครู</label>
                    <textarea
                      value={evaluations.teacher?.term2?.opinion || ""}
                      onChange={(e) => handleEvalChange("teacher", "term2", "opinion", e.target.value)}
                      placeholder="ความคิดเห็นต่อทักษะ พัฒนาการ พฤติกรรม..."
                      rows={2}
                      className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-0.5">ข้อเสนอแนะเพื่อการพัฒนา</label>
                    <textarea
                      value={evaluations.teacher?.term2?.suggestion || ""}
                      onChange={(e) => handleEvalChange("teacher", "term2", "suggestion", e.target.value)}
                      placeholder="สิ่งที่ควรฝึกฝนเพิ่มเติมหรือสนับสนุนอย่างต่อเนื่อง..."
                      rows={2}
                      className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-0.5">ลงชื่อครูประจำชั้น</label>
                      <input
                        type="text"
                        value={evaluations.teacher?.term2?.signature || ""}
                        onChange={(e) => handleEvalChange("teacher", "term2", "signature", e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-2.5 py-1 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-0.5">วันที่ประเมิน</label>
                      <input
                        type="text"
                        value={evaluations.teacher?.term2?.date || ""}
                        onChange={(e) => handleEvalChange("teacher", "term2", "date", e.target.value)}
                        placeholder="วว/ดด/ปปปป"
                        className="w-full border border-gray-300 rounded-lg px-2.5 py-1 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 text-xs transition-colors"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm flex items-center gap-1.5 text-xs transition-colors"
          >
            <Save size={14} />
            บันทึกแฟ้มสะสมผลงาน
          </button>
        </div>
      </form>
    </div>
  );
}
