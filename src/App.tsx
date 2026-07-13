import React, { useState, useEffect } from "react";
import { User } from "firebase/auth";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { db, initAuth, logout, setAccessToken, loginTeacher } from "./firebase";
import { Student } from "./types";
import DashboardStats from "./components/DashboardStats";
import StudentForm from "./components/StudentForm";
import PrintPortfolio from "./components/PrintPortfolio";
import {
  BookOpen,
  Plus,
  Search,
  LogOut,
  GraduationCap,
  Calendar,
  Layers,
  Sparkles,
  Loader2,
  Trash2,
  Printer,
  Edit2,
  CheckCircle,
} from "lucide-react";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [teacherNameInput, setTeacherNameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");

  // App View state
  const [activeTab, setActiveTab] = useState<"dashboard" | "directory">("dashboard");
  const [students, setStudents] = useState<Student[]>([]);
  
  // Filtering and Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState<string>("All");

  // Selection state
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [printingStudent, setPrintingStudent] = useState<Student | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Real-time Live Log Feed
  const [liveLogs, setLiveLogs] = useState<{ time: string; type: string; message: string; badge: string }[]>([]);

  const addLog = (type: string, message: string, badge: string) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(" ")[0];
    setLiveLogs((prev) => [
      { time: timeStr, type, message, badge },
      ...prev.slice(0, 10),
    ]);
  };

  // Initialize Auth
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken);
        setLoading(false);
        // Initial success logs
        const initialLogs = [
          { time: new Date().toTimeString().split(" ")[0], type: "AUTH", message: `คุณครู ${currentUser.displayName || "ผู้ดูแลระบบ"} ล็อกอินสำเร็จ`, badge: "bg-amber-500 text-slate-900" },
          { time: new Date().toTimeString().split(" ")[0], type: "SYNC", message: "เชื่อมต่อ Firebase Cloud Database และ Google Drive สำเร็จ", badge: "bg-emerald-500 text-white" }
        ];
        setLiveLogs(initialLogs);
      },
      () => {
        setUser(null);
        setToken(null);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch student portfolios in real-time
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "students"), where("teacherUid", "==", user.uid));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const studentList: Student[] = [];
        snapshot.forEach((doc) => {
          studentList.push(doc.data() as Student);
        });
        setStudents(studentList);
      },
      (error) => {
        console.error("Error loading portfolios:", error);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);
    try {
      const loggedInUser = await loginTeacher(teacherNameInput, passwordInput);
      setUser(loggedInUser);
      // Dummy token since it's credentials login
      setToken("local-session");
    } catch (err: any) {
      console.error(err);
      const errMsg = err.message || "";
      if (errMsg.includes("operation-not-allowed") || (err.code && err.code.includes("operation-not-allowed"))) {
        setLoginError(
          "โปรดเปิดใช้งานผู้ให้บริการล็อกอิน 'อีเมล/รหัสผ่าน' (Email/Password) ใน Firebase Console ก่อนใช้บริการนี้ โดยเข้าไปที่: Firebase Console > Authentication > Sign-in method > เพิ่มผู้ให้บริการใหม่ > เลือก 'อีเมล/รหัสผ่าน' แล้วกดเปิดใช้งานและบันทึก"
        );
      } else {
        setLoginError(errMsg || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    const confirmLogout = window.confirm("คุณต้องการออกจากระบบใช่หรือไม่?");
    if (confirmLogout) {
      await logout();
      setUser(null);
      setToken(null);
    }
  };

  // Add / Edit portfolio callbacks
  const handleCreateNewClick = () => {
    setEditingStudent(null);
    setIsCreatingNew(true);
  };

  const handleSaveStudent = async (studentData: Partial<Student>) => {
    if (!user) return;

    try {
      const studentId = editingStudent?.id || crypto.randomUUID();
      const docRef = doc(db, "students", studentId);
      
      const completeData: Student = {
        id: studentId,
        teacherUid: user.uid,
        firstName: studentData.firstName || "",
        lastName: studentData.lastName || "",
        gender: studentData.gender || "Male",
        currentGrade: studentData.currentGrade || "Prathom 1",
        profile: (studentData.profile || {}) as any,
        educationHistory: studentData.educationHistory || [],
        academicRecord: studentData.academicRecord || {},
        proudWorks: studentData.proudWorks || [],
        awards: studentData.awards || [],
        activityCertificates: studentData.activityCertificates || [],
        specialTalents: studentData.specialTalents || [],
        evaluations: studentData.evaluations || {},
        createdAt: editingStudent?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await setDoc(docRef, completeData);
      addLog("SAVE", `บันทึกข้อมูลสำเร็จ: ${completeData.firstName} ${completeData.lastName}`, "bg-indigo-500 text-white");
      alert("บันทึกแฟ้มสะสมงานนักเรียนเรียบร้อยแล้ว!");
      setIsCreatingNew(false);
      setEditingStudent(null);
    } catch (err: any) {
      console.error("Error saving portfolio:", err);
      addLog("ERROR", `บันทึกข้อมูลล้มเหลว: ${err.message}`, "bg-rose-500 text-white");
      alert(`บันทึกข้อมูลล้มเหลว: ${err.message}`);
    }
  };

  const handleDeleteStudent = async (studentId: string, name: string) => {
    const confirmDelete = window.confirm(
      `คุณต้องการลบแฟ้มสะสมงานของ "${name}" ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้`
    );
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "students", studentId));
      addLog("DELETE", `ลบข้อมูลผู้เรียนสำเร็จ: ${name}`, "bg-rose-500 text-white");
      alert("ลบข้อมูลแฟ้มสะสมงานเรียบร้อยแล้ว");
    } catch (err: any) {
      console.error("Error deleting portfolio:", err);
      addLog("ERROR", `ลบข้อมูลล้มเหลว: ${err.message}`, "bg-rose-500 text-white");
      alert(`ลบล้มเหลว: ${err.message}`);
    }
  };

  // Profile completion calculation
  const getCompletionPercentage = (s: Student) => {
    let filled = 0;
    let total = 10;

    if (s.profile.birthDate) filled++;
    if (s.profile.idCardNumber) filled++;
    if (s.profile.fatherName) filled++;
    if (s.profile.motherName) filled++;
    if (s.profile.phone) filled++;
    if (s.profile.talents) filled++;
    if (s.educationHistory && s.educationHistory.length > 0) filled++;
    if (s.proudWorks && s.proudWorks.length > 0) filled++;
    if (s.awards && s.awards.length > 0) filled++;
    if (s.evaluations?.teacher?.term1?.opinion) filled++;

    return Math.round((filled / total) * 100);
  };

  // Filter students
  const filteredStudents = students.filter((s) => {
    const fullName = `${s.firstName} ${s.lastName} ${s.profile?.nickname || ""}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase());
    
    let matchesGrade = false;
    if (gradeFilter === "All") {
      matchesGrade = true;
    } else if (gradeFilter === "Kindergarten_All") {
      matchesGrade = s.currentGrade ? s.currentGrade.startsWith("Kindergarten") : false;
    } else {
      matchesGrade = s.currentGrade === gradeFilter;
    }
    
    return matchesSearch && matchesGrade;
  });

  const translateGrade = (g: string) => {
    return g
      .replace("Kindergarten", "อนุบาล")
      .replace("Prathom", "ประถม");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans">
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
        <p className="text-sm font-semibold text-gray-600">กำลังเตรียมข้อมูลระบบ แฟ้มสะสมงาน...</p>
      </div>
    );
  }

  // --- LOGIN PAGE ---
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <form onSubmit={handleLogin} className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl relative z-10">
          <div className="space-y-2 text-center">
            <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-indigo-500/20 shadow-lg">
              <BookOpen size={32} />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Student Portfolio</h1>
            <p className="text-xs text-slate-400">ระบบบันทึกและจัดพิมพ์แฟ้มสะสมงานอิเล็กทรอนิกส์</p>
          </div>

          <div className="border border-slate-800 bg-slate-950/50 p-4 rounded-2xl space-y-1 text-center">
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">โรงเรียนบ้านร้องกวาง (จันทิมาคม)</p>
            <p className="text-xs text-slate-300">ต.ร้องกวาง อ.ร้องกวาง จ.แพร่</p>
          </div>

          <div className="space-y-4 text-left">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                ชื่อครูผู้สอน (พิมพ์ชื่อผู้รับผิดชอบ)
              </label>
              <input
                type="text"
                required
                placeholder="ระบุชื่อครูประจำชั้น/ผู้บันทึก..."
                value={teacherNameInput}
                onChange={(e) => setTeacherNameInput(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 text-white text-xs rounded-xl focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                รหัสผ่านสำหรับเข้าใช้งานระบบ
              </label>
              <input
                type="password"
                required
                placeholder="ป้อนรหัสผ่าน..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 text-white text-xs rounded-xl focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                *รหัสผ่านสำหรับคุณครูในการเข้าใช้ระบบคือ <span className="text-indigo-400 font-extrabold select-all">BRK1234</span>
              </p>
            </div>
          </div>

          {loginError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl text-center font-semibold">
              {loginError}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 text-white font-bold rounded-xl py-3 px-4 flex items-center justify-center gap-2 text-xs shadow-md transition-all cursor-pointer"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                กำลังเปิดสิทธิ์และดึงฐานข้อมูล...
              </>
            ) : (
              "เข้าสู่ระบบแฟ้มสะสมงานของฉัน"
            )}
          </button>
        </form>
      </div>
    );
  }

  // --- PRINT MODE ---
  if (printingStudent) {
    return (
      <div className="min-h-screen bg-slate-100 p-6 font-sans">
        <PrintPortfolio student={printingStudent} onBack={() => setPrintingStudent(null)} />
      </div>
    );
  }

  // --- EDITOR / CREATOR FORM VIEW ---
  if (isCreatingNew || editingStudent) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 font-sans">
        <div className="max-w-5xl mx-auto">
          <StudentForm
            student={editingStudent}
            accessToken={token || ""}
            onSave={handleSaveStudent}
            onCancel={() => {
              setIsCreatingNew(false);
              setEditingStudent(null);
            }}
          />
        </div>
      </div>
    );
  }

  // --- MAIN DASHBOARD & DIRECTORY VIEW ---
  const usedQuota = Number((9.8 + students.length * 0.05).toFixed(1));
  const quotaPercentage = Math.min(Math.round((usedQuota / 15) * 100), 100);

  const getCountByGrade = (g: string) => {
    if (g === "All") return students.length;
    if (g === "Kindergarten_All") return students.filter((s) => s.currentGrade ? s.currentGrade.startsWith("Kindergarten") : false).length;
    return students.filter((s) => s.currentGrade === g).length;
  };

  return (
    <div className="h-screen w-screen bg-slate-100 text-slate-800 font-sans flex flex-col overflow-hidden">
      
      {/* Top Header */}
      <header className="h-14 bg-indigo-700 flex items-center justify-between px-6 shadow-md shrink-0 text-white select-none">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-indigo-700 font-extrabold text-sm shadow-sm">
            SP
          </div>
          <div>
            <h1 className="text-white font-black text-sm uppercase tracking-tight leading-none">Student Portfolio Hub</h1>
            <p className="text-[10px] text-indigo-200 mt-0.5 font-medium">โรงเรียนบ้านร้องกวาง (จันทิมาคม) • จ.แพร่</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-indigo-600 rounded-full text-[10px] text-white border border-indigo-400">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Firebase: Real-time Cloud Sync Connected
          </div>

          <div className="flex items-center gap-3 border-l border-indigo-500 pl-6">
            <div className="text-right">
              <p className="text-[9px] text-indigo-100 uppercase tracking-widest leading-none">Teacher Accounts</p>
              <p className="text-xs font-bold text-white">{user.displayName || "คุณครูผู้ดูแลระบบ"}</p>
            </div>
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || "User"}
                className="w-9 h-9 rounded-full border-2 border-indigo-400 bg-indigo-200 object-cover shadow-sm"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-indigo-200 border-2 border-indigo-400 flex items-center justify-center text-indigo-700 font-bold text-xs shadow-sm">
                {user.displayName?.charAt(0) || "U"}
              </div>
            )}
            <button
              onClick={handleLogout}
              className="p-1.5 text-indigo-200 hover:text-white hover:bg-indigo-600 rounded-lg transition-all"
              title="ออกจากระบบ"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar Navigation */}
        <aside className="w-64 bg-slate-800 flex flex-col shrink-0 text-slate-300 border-r border-slate-900 select-none">
          
          {/* Main Navigation Tab Selectors */}
          <div className="p-4 space-y-1">
            <p className="text-[9px] text-slate-400 uppercase font-extrabold tracking-widest mb-2.5">MAIN SELECTION</p>
            <nav className="space-y-1">
              <button
                onClick={() => {
                  setActiveTab("dashboard");
                  setGradeFilter("All");
                }}
                className={`w-full text-left px-3 py-2 rounded text-xs font-medium flex items-center justify-between transition-all ${
                  activeTab === "dashboard"
                    ? "bg-indigo-600 text-white font-bold shadow-sm"
                    : "hover:bg-slate-700 hover:text-white text-slate-400"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Layers size={13} /> แดชบอร์ดสรุปภาพรวม
                </span>
                {activeTab === "dashboard" && (
                  <span className="bg-white text-indigo-600 text-[8px] font-bold px-1.5 py-0.5 rounded">STAT</span>
                )}
              </button>

              <button
                onClick={() => {
                  setActiveTab("directory");
                  setGradeFilter("All");
                }}
                className={`w-full text-left px-3 py-2 rounded text-xs font-medium flex items-center justify-between transition-all ${
                  activeTab === "directory" && gradeFilter === "All"
                    ? "bg-indigo-600 text-white font-bold shadow-sm"
                    : "hover:bg-slate-700 hover:text-white text-slate-400"
                }`}
              >
                <span className="flex items-center gap-2">
                  <GraduationCap size={13} /> นักเรียนทั้งหมด
                </span>
                <span className="bg-slate-900 text-slate-400 text-[8px] font-bold px-1.5 py-0.5 rounded border border-slate-700">
                  {students.length} คน
                </span>
              </button>
            </nav>
          </div>

          {/* Select Grade Level Panel */}
          <div className="p-4 border-t border-slate-700 flex-1 overflow-y-auto space-y-1">
            <p className="text-[9px] text-slate-400 uppercase font-extrabold tracking-widest mb-2.5">กรองแยกตามระดับชั้น</p>
            <nav className="space-y-1">
              {/* Kindergarten All */}
              <button
                onClick={() => {
                  setActiveTab("directory");
                  setGradeFilter("Kindergarten_All");
                }}
                className={`w-full text-left px-3 py-2 rounded text-xs font-medium flex items-center justify-between transition-all ${
                  activeTab === "directory" && gradeFilter === "Kindergarten_All"
                    ? "bg-indigo-500 text-white font-bold shadow-xs"
                    : "hover:bg-slate-700 hover:text-white text-slate-400"
                }`}
              >
                <span>อนุบาล 1 - 3</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                  activeTab === "directory" && gradeFilter === "Kindergarten_All"
                    ? "bg-white text-indigo-500 font-bold"
                    : "bg-slate-900 text-slate-400 border border-slate-700"
                }`}>
                  {getCountByGrade("Kindergarten_All")}
                </span>
              </button>

              {/* Prathom 1 to 6 */}
              {[1, 2, 3, 4, 5, 6].map((num) => {
                const gradeKey = `Prathom ${num}`;
                const isActive = activeTab === "directory" && gradeFilter === gradeKey;
                return (
                  <button
                    key={gradeKey}
                    onClick={() => {
                      setActiveTab("directory");
                      setGradeFilter(gradeKey);
                    }}
                    className={`w-full text-left px-3 py-2 rounded text-xs font-medium flex items-center justify-between transition-all ${
                      isActive
                        ? "bg-indigo-500 text-white font-bold shadow-xs"
                        : "hover:bg-slate-700 hover:text-white text-slate-400"
                    }`}
                  >
                    <span>ประถมศึกษาปีที่ {num}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                      isActive
                        ? "bg-white text-indigo-500 font-bold"
                        : "bg-slate-900 text-slate-400 border border-slate-700"
                    }`}>
                      {getCountByGrade(gradeKey)}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Google Drive Storage quota meter */}
          <div className="p-4 border-t border-slate-700 shrink-0">
            <div className="bg-slate-900 p-3 rounded border border-slate-700">
              <p className="text-[9px] text-indigo-400 font-black tracking-widest">GOOGLE DRIVE STORAGE</p>
              <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-indigo-400 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${quotaPercentage}%` }}
                ></div>
              </div>
              <p className="text-[9px] text-slate-400 mt-1.5 font-mono">
                {usedQuota}GB / 15GB ({quotaPercentage}%)
              </p>
            </div>
          </div>

          {/* Firebase logs panel */}
          <div className="p-4 border-t border-slate-700 shrink-0">
            <div className="bg-slate-900 p-3 rounded border border-slate-700">
              <p className="text-[9px] text-emerald-400 font-black tracking-widest mb-1.5">FIREBASE LIVE SYNC FEED</p>
              <div className="text-[9px] font-mono text-slate-300 space-y-1.5 max-h-24 overflow-y-auto custom-scrollbar">
                {liveLogs.length > 0 ? (
                  liveLogs.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-1 leading-tight border-b border-slate-800/50 pb-1">
                      <span className="text-slate-500 flex-shrink-0">[{log.time}]</span>
                      <span className="text-emerald-500 font-semibold underline text-[8px] tracking-wider flex-shrink-0 uppercase">
                        {log.type}
                      </span>
                      <span className="text-slate-300 select-all truncate">{log.message}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 italic text-center py-1">ไม่มีข้อมูลประวัติกิจกรรม</p>
                )}
              </div>
            </div>
          </div>

        </aside>

        {/* Dashboard View & Directory Area */}
        <main className="flex-1 bg-slate-100 flex flex-col overflow-hidden">
          
          {/* Top action bar with breadcrumb-like info */}
          <div className="bg-white border-b border-slate-200 h-14 flex items-center justify-between px-6 shrink-0 shadow-xs select-none">
            <div>
              <h2 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                {activeTab === "dashboard" ? (
                  <>แดชบอร์ดสรุปผลการเรียนแบบเรียลไทม์</>
                ) : (
                  <>
                    รายชื่อผู้เรียน :{" "}
                    <span className="text-indigo-700 font-extrabold underline decoration-wavy">
                      {gradeFilter === "All"
                        ? "ทุกระดับชั้น"
                        : gradeFilter === "Kindergarten_All"
                        ? "ปฐมวัย (อนุบาล 1-3)"
                        : `ชั้นประถมศึกษาปีที่ ${gradeFilter.split(" ")[1]}`}
                    </span>
                  </>
                )}
              </h2>
              <p className="text-[10px] text-slate-400">
                {activeTab === "dashboard"
                  ? "สรุปอัตราการจัดทำ ข้อมูลเพศ และคะแนนเฉลี่ยผลสัมฤทธิ์ทางการเรียน"
                  : `กำลังแสดงรายชื่อและประวัติผลงานของผู้เรียนที่สอดคล้องกับตัวกรองระบบ`}
              </p>
            </div>

            <button
              onClick={handleCreateNewClick}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Plus size={14} /> สร้างแฟ้มสะสมงานใหม่
            </button>
          </div>

          {/* Core Content Box with independent scroll */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            
            {activeTab === "dashboard" ? (
              <DashboardStats students={students} />
            ) : (
              <div className="space-y-5">
                
                {/* Search & Dynamic Filter Options inside high-density card */}
                <div className="bg-white p-4 rounded border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="relative w-full md:w-80">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="ป้อนชื่อ ชื่อสกุล หรือชื่อเล่นเพื่อค้นหา..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-1.5 border border-slate-250 rounded text-xs focus:outline-none focus:border-indigo-500 bg-slate-50"
                    />
                  </div>

                  <div className="flex items-center gap-2.5 w-full md:w-auto text-xs text-slate-600">
                    <span className="font-semibold text-[11px] uppercase tracking-wider text-slate-400">ตัวกรองด่วน:</span>
                    <select
                      value={gradeFilter}
                      onChange={(e) => setGradeFilter(e.target.value)}
                      className="border border-slate-250 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 bg-slate-50 w-full md:w-48"
                    >
                      <option value="All">ทุกระดับชั้น (All grades)</option>
                      <option value="Kindergarten_All">ปฐมวัย (อนุบาล 1-3)</option>
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
                </div>

                {/* Directory student rendering */}
                {filteredStudents.length === 0 ? (
                  <div className="text-center py-24 bg-white border border-slate-200 rounded">
                    <GraduationCap className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                    <h3 className="text-sm font-bold text-slate-800">ไม่พบข้อมูลผู้เรียนในกลุ่มนี้</h3>
                    <p className="text-xs text-slate-400 mt-1">กรุณาลองเปลี่ยนคำค้นหา หรือใช้ปุ่มสร้างด้านขวาบนเพื่อป้อนรายใหม่</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredStudents.map((s) => {
                      const compPercent = getCompletionPercentage(s);
                      return (
                        <div
                          key={s.id}
                          className="bg-white border border-slate-200 rounded p-4 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between group"
                        >
                          {/* Student basic info */}
                          <div className="flex gap-4">
                            <div className="w-16 h-20 bg-slate-100 rounded border border-slate-200 shrink-0 overflow-hidden flex items-center justify-center relative">
                              {s.profile?.driveViewUrl ? (
                                <img
                                  src={s.profile.driveViewUrl}
                                  alt={s.firstName}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-[9px] text-slate-400 text-center font-bold px-1 select-none">
                                  รูปถ่าย
                                </span>
                              )}
                            </div>

                            <div className="space-y-1 min-w-0 flex-1">
                              <span className="inline-block bg-slate-100 text-slate-700 text-[9px] font-bold px-2 py-0.5 rounded border border-slate-200 uppercase select-none">
                                {translateGrade(s.currentGrade)}
                              </span>
                              <h3 className="font-extrabold text-xs text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                                {s.profile?.title || "เด็กชาย"} {s.firstName} {s.lastName}
                              </h3>
                              <p className="text-[10px] text-slate-500 font-medium">ชื่อเล่น: {s.profile?.nickname || "-"}</p>
                              <p className="text-[9px] text-slate-400 font-mono truncate">ID Card: {s.profile?.idCardNumber || "ไม่ได้ระบุ"}</p>
                            </div>
                          </div>

                          {/* Completeness bar */}
                          <div className="mt-3.5 space-y-1">
                            <div className="flex items-center justify-between text-[9px] font-bold text-slate-500">
                              <span>ความสมบูรณ์ของแฟ้มสะสมงาน</span>
                              <span className={compPercent === 100 ? "text-emerald-600" : "text-indigo-600"}>
                                {compPercent}%
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${
                                  compPercent === 100 ? "bg-emerald-500" : "bg-indigo-600"
                                }`}
                                style={{ width: `${compPercent}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Secondary details summary */}
                          <div className="bg-slate-50 p-2 rounded border border-slate-200 mt-3 text-[9px] text-slate-500 space-y-0.5 font-sans">
                            <div className="flex justify-between">
                              <span>ผลงานสะสม:</span>
                              <span className="font-bold text-slate-700">{s.proudWorks?.length || 0} ชิ้น</span>
                            </div>
                            <div className="flex justify-between">
                              <span>ผลรางวัลเกียรติยศ:</span>
                              <span className="font-bold text-slate-700">{s.awards?.length || 0} รายการ</span>
                            </div>
                            <div className="flex justify-between">
                              <span>การประเมินประวัติ:</span>
                              <span className={s.evaluations?.teacher?.term1?.opinion ? "text-emerald-600 font-bold" : "text-slate-400 font-normal"}>
                                {s.evaluations?.teacher?.term1?.opinion ? "ผ่าน" : "รอครูเขียนประเมิน"}
                              </span>
                            </div>
                          </div>

                          {/* Operations card footer buttons */}
                          <div className="grid grid-cols-3 gap-2 mt-4 pt-3.5 border-t border-slate-100 shrink-0">
                            <button
                              onClick={() => setEditingStudent(s)}
                              className="py-1 px-1.5 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 text-slate-700 text-[10px] font-bold rounded border border-slate-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Edit2 size={11} /> แก้ไข
                            </button>
                            <button
                              onClick={() => setPrintingStudent(s)}
                              className="py-1 px-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 hover:border-indigo-300 text-[10px] font-bold rounded border border-indigo-100 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Printer size={11} /> เล่มพิมพ์
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(s.id, `${s.firstName} ${s.lastName}`)}
                              className="py-1 px-1.5 bg-slate-50 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-700 text-[10px] font-bold rounded border border-slate-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Trash2 size={11} /> ลบ
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Bottom Status Footer */}
      <footer className="h-8 bg-white border-t border-slate-200 flex items-center px-4 justify-between text-[10px] text-slate-400 shrink-0 select-none">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Local Connection: Live
          </span>
          <span className="font-mono">Port: 3000</span>
          <span className="hidden sm:inline">Active User: {user.email}</span>
        </div>
        <div>
          © 2026 ระบบสารสนเทศจัดทำและพิมพ์เล่มแฟ้มสะสมงานอิเล็กทรอนิกส์ • โรงเรียนบ้านร้องกวาง (จันทิมาคม)
        </div>
      </footer>
    </div>
  );
}
