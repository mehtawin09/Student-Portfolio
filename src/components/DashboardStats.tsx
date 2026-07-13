import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Student } from "../types";
import { Users, GraduationCap, Award, BookOpen } from "lucide-react";

interface DashboardStatsProps {
  students: Student[];
}

export default function DashboardStats({ students }: DashboardStatsProps) {
  // Calculations
  const totalStudents = students.length;
  
  const maleCount = students.filter((s) => s.gender === "Male").length;
  const femaleCount = students.filter((s) => s.gender === "Female").length;

  // Grade breakdown
  const grades = [
    "Kindergarten 1",
    "Kindergarten 2",
    "Kindergarten 3",
    "Prathom 1",
    "Prathom 2",
    "Prathom 3",
    "Prathom 4",
    "Prathom 5",
    "Prathom 6",
  ];

  const gradeCounts = grades.map((g) => {
    const thName = g
      .replace("Kindergarten", "อนุบาล")
      .replace("Prathom", "ประถม");
    return {
      name: thName,
      engName: g,
      count: students.filter((s) => s.currentGrade === g).length,
    };
  });

  // Calculate GPAs per grade
  const gradeGpas = grades
    .filter((g) => g.startsWith("Prathom"))
    .map((g) => {
      const thName = g.replace("Prathom", "ป.");
      const studentsInGrade = students.filter((s) => s.currentGrade === g);
      
      let sumGpa = 0;
      let count = 0;
      
      studentsInGrade.forEach((s) => {
        const gradeKey = g; // Current grade level
        if (s.academicRecord?.primaryGrades?.[gradeKey]?.gpa) {
          const val = parseFloat(s.academicRecord.primaryGrades[gradeKey].gpa);
          if (!isNaN(val)) {
            sumGpa += val;
            count++;
          }
        }
      });
      
      const avg = count > 0 ? Number((sumGpa / count).toFixed(2)) : 0;
      return {
        name: thName,
        "คะแนนเฉลี่ย GPA": avg,
      };
    });

  // Total awards and works
  let totalAwards = 0;
  let totalProudWorks = 0;
  let completedProfiles = 0;

  students.forEach((s) => {
    totalAwards += s.awards?.length || 0;
    totalProudWorks += s.proudWorks?.length || 0;
    
    // Simple completion checker
    let isComplete = true;
    if (!s.profile.birthDate || !s.profile.idCardNumber || !s.profile.fatherName) {
      isComplete = false;
    }
    if (isComplete) completedProfiles++;
  });

  const completionRate = totalStudents > 0 ? Math.round((completedProfiles / totalStudents) * 100) : 0;

  const genderData = [
    { name: "ชาย (Male)", value: maleCount, color: "#3B82F6" },
    { name: "หญิง (Female)", value: femaleCount, color: "#EC4899" },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-6" id="dashboard-stats-section">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded border border-slate-200 shadow-xs border-l-4 border-emerald-500 flex items-center justify-between" id="stat-card-students">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">นักเรียนทั้งหมด (Students)</p>
            <p className="text-2xl font-black text-slate-850 mt-1">{totalStudents} คน</p>
            <p className="text-[10px] text-slate-500 mt-1">
              ชาย {maleCount} คน • หญิง {femaleCount} คน
            </p>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded">
            <Users size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded border border-slate-200 shadow-xs border-l-4 border-amber-500 flex items-center justify-between" id="stat-card-gpa">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ผลงานในสาระเรียนรู้ (Drive Files)</p>
            <p className="text-2xl font-black text-slate-850 mt-1">{totalProudWorks} ชิ้น</p>
            <p className="text-[10px] text-slate-500 mt-1">อัปโหลดเข้าเซิร์ฟเวอร์คลาวด์</p>
          </div>
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded">
            <BookOpen size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded border border-slate-200 shadow-xs border-l-4 border-indigo-500 flex items-center justify-between" id="stat-card-awards">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">เกียรติบัตรและรางวัล (Awards)</p>
            <p className="text-2xl font-black text-slate-850 mt-1">{totalAwards} รายการ</p>
            <p className="text-[10px] text-slate-500 mt-1">สถิติความดีและเกียรติยศผู้เรียน</p>
          </div>
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded">
            <Award size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded border border-slate-200 shadow-xs border-l-4 border-rose-500 flex items-center justify-between" id="stat-card-completion">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ความสมบูรณ์เฉลี่ย (Completeness)</p>
            <p className="text-2xl font-black text-slate-850 mt-1">{completionRate}%</p>
            <p className="text-[10px] text-slate-500 mt-1">
              สมบูรณ์ {completedProfiles} จาก {totalStudents} คน
            </p>
          </div>
          <div className="p-2.5 bg-rose-50 text-rose-600 rounded">
            <GraduationCap size={20} />
          </div>
        </div>
      </div>

      {/* Charts Row */}
      {totalStudents > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Grade Distribution */}
          <div className="bg-white p-5 rounded-xl shadow-xs border border-gray-100 lg:col-span-2">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">จำนวนนักเรียนแยกตามระดับชั้น</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeCounts} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#FFFFFF", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "12px" }}
                    labelClassName="font-semibold text-gray-700"
                  />
                  <Bar dataKey="count" fill="#4F46E5" radius={[4, 4, 0, 0]} name="จำนวนนักเรียน" maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gender Ratio */}
          <div className="bg-white p-5 rounded-xl shadow-xs border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">สัดส่วนเพศนักเรียน</h3>
            <div className="h-48 relative flex items-center justify-center">
              {genderData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genderData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "6px" }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-xs text-gray-400">ไม่มีข้อมูลเพศ</p>
              )}
              <div className="absolute text-center">
                <p className="text-xs text-gray-400 font-medium">รวมทั้งหมด</p>
                <p className="text-xl font-semibold text-gray-900">{totalStudents} คน</p>
              </div>
            </div>
            {/* Legend */}
            <div className="flex justify-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-xs text-gray-600">ชาย ({maleCount})</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                <span className="text-xs text-gray-600">หญิง ({femaleCount})</span>
              </div>
            </div>
          </div>

          {/* GPA Trends */}
          <div className="bg-white p-5 rounded-xl shadow-xs border border-gray-100 lg:col-span-3">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">แนวโน้มผลการเรียนเฉลี่ยรายชั้น (ประถมศึกษา)</h3>
            <p className="text-xs text-gray-400 mb-4">แสดงเกรดเฉลี่ย GPA ภาพรวมของคุณครูประถมศึกษาในระดับชั้น ป.1 - ป.6</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={gradeGpas} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 4]} tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#FFFFFF", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "12px" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="คะแนนเฉลี่ย GPA"
                    stroke="#D97706"
                    strokeWidth={3}
                    activeDot={{ r: 8 }}
                    name="เกรดเฉลี่ย (GPA)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 text-center rounded-xl border border-dashed border-gray-200">
          <Users className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <h3 className="text-sm font-semibold text-gray-900">ยังไม่มีข้อมูลนักเรียนในระบบ</h3>
          <p className="text-xs text-gray-400 mt-1">เริ่มต้นโดยการเพิ่มข้อมูลนักเรียนคนแรกที่ปุ่มด้านล่าง</p>
        </div>
      )}
    </div>
  );
}
