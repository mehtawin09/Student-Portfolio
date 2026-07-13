import { Student } from "../types";
import { Printer, ArrowLeft, Award, BookOpen, User, GraduationCap, Calendar } from "lucide-react";

interface PrintPortfolioProps {
  student: Student;
  onBack: () => void;
}

export default function PrintPortfolio({ student, onBack }: PrintPortfolioProps) {
  const handlePrint = () => {
    window.print();
  };

  const gradeTh = student.currentGrade
    .replace("Kindergarten", "อนุบาล")
    .replace("Prathom", "ประถมศึกษาปีที่");

  return (
    <div className="space-y-6 max-w-4xl mx-auto" id="print-portfolio-wrapper">
      {/* Control Panel (Hidden during Print via CSS media print) */}
      <div className="flex items-center justify-between bg-white border border-gray-100 p-4 rounded-2xl shadow-sm print:hidden">
        <button
          onClick={onBack}
          className="px-3.5 py-1.5 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft size={14} /> กลับไปหน้าผู้ดูแล
        </button>
        <button
          onClick={handlePrint}
          className="px-5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
        >
          <Printer size={15} /> พิมพ์แฟ้มสะสมงาน (Print to PDF)
        </button>
      </div>

      {/* Styled Printable Booklet */}
      <div className="bg-white p-12 md:p-16 border border-gray-200 shadow-2xl rounded-2xl space-y-24 print:border-0 print:p-0 print:shadow-none font-sans text-gray-900" id="portfolio-printable-booklet">
        
        {/* PAGE 1: COVER PAGE */}
        <div className="min-h-[1050px] flex flex-col items-center justify-between text-center border-4 border-double border-indigo-900 p-8 relative page-break-after">
          <div className="space-y-4 w-full">
            <h1 className="text-4xl font-extrabold tracking-tight text-indigo-950 mt-10">แฟ้มสะสมผลงานนักเรียน</h1>
            <p className="text-xl font-bold text-gray-700">(Student Portfolio)</p>
          </div>

          <div className="border border-indigo-200 bg-indigo-50/20 px-8 py-4 rounded-xl space-y-1 max-w-md">
            <p className="text-xs font-semibold text-indigo-800 tracking-wider">ปรัชญาโรงเรียน</p>
            <p className="text-base font-bold text-gray-800">เรียนดี เก่งศึกษา รักษาวินัย</p>
          </div>

          <div className="space-y-2">
            <p className="text-base font-bold text-gray-700">ระดับชั้น {gradeTh}</p>
          </div>

          {/* Picture Box */}
          <div className="w-48 h-60 border-2 border-dashed border-gray-400 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center my-6 shadow-sm">
            {student.profile?.driveViewUrl ? (
              <img
                src={student.profile.driveViewUrl}
                alt="Student"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs text-gray-400">รูปภาพนักเรียน</span>
            )}
          </div>

          <div className="space-y-2 text-lg font-bold text-gray-800">
            <p>ชื่อ: {student.profile?.title || "เด็กชาย"} {student.firstName} {student.lastName}</p>
            <p className="text-sm font-medium text-gray-500">ชื่อเล่น: {student.profile?.nickname || "-"}</p>
          </div>

          <div className="space-y-1.5 text-sm font-bold text-gray-700 mb-6">
            <p className="text-indigo-950 text-base">โรงเรียนบ้านร้องกวาง (จันทิมาคม)</p>
            <p className="text-xs font-medium text-gray-500">ตำบลร้องกวาง อำเภอร้องกวาง จังหวัดแพร่</p>
          </div>
        </div>

        {/* PAGE 2: TABLE OF CONTENTS (สารบัญ) */}
        <div className="min-h-[1050px] border-4 border-double border-indigo-900 p-12 flex flex-col justify-between page-break-after">
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-center text-indigo-950 border-b-2 border-indigo-950 pb-3">สารบัญ</h2>
            
            <div className="space-y-6 text-sm">
              <div className="flex justify-between items-end border-b border-dashed border-gray-200 pb-1">
                <span className="font-bold text-gray-800">ส่วนที่ 1 ประวัติส่วนตัวและการศึกษา</span>
                <span className="font-semibold text-gray-500">หน้า 3</span>
              </div>
              <div className="pl-6 space-y-2 text-xs text-gray-600">
                <p>1.1 ประวัติส่วนตัว</p>
                <p>1.2 ประวัติครอบครัว</p>
                <p>1.3 ความสามารถพิเศษและความสนใจ</p>
                <p>1.4 ประวัติการศึกษา</p>
                <p>1.5 รายงานประวัติผลการเรียน</p>
              </div>

              <div className="flex justify-between items-end border-b border-dashed border-gray-200 pb-1 pt-2">
                <span className="font-bold text-gray-800">ส่วนที่ 2 ความภาคภูมิใจในผลงานการเรียนรู้ 8 กลุ่มสาระการเรียนรู้</span>
                <span className="font-semibold text-gray-500">หน้า 4</span>
              </div>

              <div className="flex justify-between items-end border-b border-dashed border-gray-200 pb-1 pt-2">
                <span className="font-bold text-gray-800">ส่วนที่ 3 ผลงานเด่นรางวัล การประกวด การแข่งขันที่ได้รับรางวัล</span>
                <span className="font-semibold text-gray-500">หน้า 5</span>
              </div>

              <div className="flex justify-between items-end border-b border-dashed border-gray-200 pb-1 pt-2">
                <span className="font-bold text-gray-800">ส่วนที่ 4 เกียรติบัตรการเข้าร่วมกิจกรรม การเข้าค่าย</span>
                <span className="font-semibold text-gray-500">หน้า 6</span>
              </div>

              <div className="flex justify-between items-end border-b border-dashed border-gray-200 pb-1 pt-2">
                <span className="font-bold text-gray-800">ส่วนที่ 5 กิจกรรมความสามารถพิเศษ หน้าที่ที่ได้รับมอบหมาย</span>
                <span className="font-semibold text-gray-500">หน้า 7</span>
              </div>

              <div className="flex justify-between items-end border-b border-dashed border-gray-200 pb-1 pt-2">
                <span className="font-bold text-gray-800">แบบประเมินผลแฟ้มสะสมงาน (ผู้ปกครอง / ครูประจำชั้น)</span>
                <span className="font-semibold text-gray-500">หน้า 8</span>
              </div>
            </div>
          </div>

          <div className="text-center text-xs text-gray-400">
            <p>งานวิชาการ โรงเรียนบ้านร้องกวาง (จันทิมาคม)</p>
          </div>
        </div>

        {/* PAGE 3: ส่วนที่ 1 ประวัติส่วนตัว */}
        <div className="min-h-[1050px] border-4 border-double border-indigo-900 p-12 space-y-8 page-break-after">
          <h2 className="text-2xl font-bold text-indigo-950 border-b border-indigo-100 pb-3 flex items-center gap-2">
            <User size={24} className="text-indigo-800" /> ส่วนที่ 1: ประวัติส่วนตัว (Profile)
          </h2>

          <div className="grid grid-cols-3 gap-6 text-xs">
            <div className="col-span-3 grid grid-cols-2 gap-4">
              <p><span className="font-bold text-gray-700">ชื่อ-สกุล:</span> {student.profile?.title || "เด็กชาย"} {student.firstName} {student.lastName}</p>
              <p><span className="font-bold text-gray-700">ชื่อเล่น:</span> {student.profile?.nickname || "-"}</p>
              <p><span className="font-bold text-gray-700">เพศ:</span> {student.gender === "Male" ? "ชาย" : "หญิง"}</p>
              <p><span className="font-bold text-gray-700">วัน/เดือน/ปีเกิด:</span> {student.profile?.birthDate || "-"}</p>
              <p><span className="font-bold text-gray-700">อายุ:</span> {student.profile?.age || "-"} ปี</p>
              <p><span className="font-bold text-gray-700">สัญชาติ/เชื้อชาติ:</span> {student.profile?.nationality || "-"}/{student.profile?.race || "-"}</p>
              <p><span className="font-bold text-gray-700">ศาสนา:</span> {student.profile?.religion || "-"}</p>
              <p><span className="font-bold text-gray-700">กลุ่มเลือด:</span> {student.profile?.bloodGroup || "-"}</p>
              <p className="col-span-2"><span className="font-bold text-gray-700">เลขประจำตัวประชาชน:</span> {student.profile?.idCardNumber || "-"}</p>
            </div>

            <div className="col-span-3 border-t border-gray-100 pt-4 space-y-2">
              <p className="font-bold text-sm text-indigo-950">ที่อยู่ตามทะเบียนบ้าน</p>
              <p className="text-gray-700">
                บ้านเลขที่ {student.profile?.addressNo || "-"} หมู่ที่ {student.profile?.moo || "-"} ตรอก/ซอย {student.profile?.alley || "-"} ถนน {student.profile?.road || "-"}
                <br />
                ตำบล {student.profile?.subdistrict || "-"} อำเภอ {student.profile?.district || "-"} จังหวัด {student.profile?.province || "-"} รหัสไปรษณีย์ {student.profile?.zipCode || "-"}
              </p>
            </div>

            <div className="col-span-3 border-t border-gray-100 pt-4 space-y-2">
              <p className="font-bold text-sm text-indigo-950">ข้อมูลครอบครัว</p>
              <p><span className="font-bold text-gray-700">บิดา:</span> {student.profile?.fatherName || "-"} อาชีพ: {student.profile?.fatherOccupation || "-"} โทร: {student.profile?.fatherPhone || "-"}</p>
              <p><span className="font-bold text-gray-700">มารดา:</span> {student.profile?.motherName || "-"} อาชีพ: {student.profile?.motherOccupation || "-"} โทร: {student.profile?.motherPhone || "-"}</p>
              <p><span className="font-bold text-gray-700">ผู้ปกครอง:</span> {student.profile?.guardianName || "-"} ({student.profile?.guardianRelationship || "-"}) โทร: {student.profile?.guardianPhone || "-"}</p>
            </div>

            <div className="col-span-3 border-t border-gray-100 pt-4 space-y-2">
              <p className="font-bold text-sm text-indigo-950">ความสามารถ ความสนใจ ความฝัน</p>
              <p><span className="font-bold text-gray-700">ความสามารถพิเศษ:</span> {student.profile?.talents || "-"}</p>
              <p><span className="font-bold text-gray-700">งานอดิเรก:</span> {student.profile?.hobbies || "-"}</p>
              <p><span className="font-bold text-gray-700">ความใฝ่ฝันในอนาคต:</span> {student.profile?.futureDream || "-"}</p>
              <p><span className="font-bold text-gray-700">อุดมการณ์เพื่อส่วนรวม:</span> {student.profile?.socialDesire || "-"}</p>
            </div>
          </div>
        </div>

        {/* PAGE 4: ประวัติการศึกษาและรายงานผลการเรียน */}
        <div className="min-h-[1050px] border-4 border-double border-indigo-900 p-12 space-y-8 page-break-after">
          <h2 className="text-2xl font-bold text-indigo-950 border-b border-indigo-100 pb-3 flex items-center gap-2">
            <GraduationCap size={24} className="text-indigo-800" /> ประวัติการศึกษาและผลการเรียน
          </h2>

          {/* Education History table */}
          <div className="space-y-2 text-xs">
            <p className="font-bold text-indigo-900">ประวัติการศึกษา</p>
            <table className="w-full text-left border-collapse border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-200 px-3 py-2 font-bold">ระดับชั้น</th>
                  <th className="border border-gray-200 px-3 py-2 font-bold">ชื่อสถานศึกษา</th>
                  <th className="border border-gray-200 px-3 py-2 font-bold">ปีการศึกษาที่จบ</th>
                </tr>
              </thead>
              <tbody>
                {student.educationHistory?.map((edu, idx) => (
                  <tr key={idx}>
                    <td className="border border-gray-200 px-3 py-2">{edu.level}</td>
                    <td className="border border-gray-200 px-3 py-2">{edu.schoolName || "-"}</td>
                    <td className="border border-gray-200 px-3 py-2">{edu.gradYear || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Kindergarten Development reports */}
          {student.academicRecord?.kindergartenDev?.year && (
            <div className="space-y-2 text-xs border-t border-gray-100 pt-4">
              <p className="font-bold text-indigo-900">รายงานผลการประเมินพัฒนาการระดับปฐมวัย (อนุบาล 3)</p>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                <p><span className="font-bold">ปีการศึกษา:</span> {student.academicRecord.kindergartenDev.year}</p>
                <p><span className="font-bold">ครูผู้ดูแล:</span> {student.academicRecord.kindergartenDev.teacherName || "-"}</p>
                <div className="col-span-2 grid grid-cols-4 gap-2 text-center mt-1">
                  <div className="bg-white p-2 rounded border">
                    <p className="text-[9px] text-gray-500">ด้านร่างกาย</p>
                    <p className="text-lg font-bold text-indigo-600">{student.academicRecord.kindergartenDev.physical}</p>
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <p className="text-[9px] text-gray-500">ด้านอารมณ์/จิตใจ</p>
                    <p className="text-lg font-bold text-indigo-600">{student.academicRecord.kindergartenDev.emotional}</p>
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <p className="text-[9px] text-gray-500">ด้านสังคม</p>
                    <p className="text-lg font-bold text-indigo-600">{student.academicRecord.kindergartenDev.social}</p>
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <p className="text-[9px] text-gray-500">ด้านสติปัญญา</p>
                    <p className="text-lg font-bold text-indigo-600">{student.academicRecord.kindergartenDev.intellectual}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Primary GPAs table */}
          <div className="space-y-2 text-xs border-t border-gray-100 pt-4">
            <p className="font-bold text-indigo-900">รายงานผลการเรียนระดับประถมศึกษา (ป.1 - ป.6)</p>
            <table className="w-full text-left border-collapse border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-200 px-3 py-2 font-bold">ระดับชั้น</th>
                  <th className="border border-gray-200 px-3 py-2 font-bold">ปีการศึกษา</th>
                  <th className="border border-gray-200 px-3 py-2 font-bold">ครูประจำชั้น</th>
                  <th className="border border-gray-200 px-3 py-2 font-bold">เกรดเฉลี่ยสะสม (GPA)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { key: "Prathom 1", label: "ป.1" },
                  { key: "Prathom 2", label: "ป.2" },
                  { key: "Prathom 3", label: "ป.3" },
                  { key: "Prathom 4", label: "ป.4" },
                  { key: "Prathom 5", label: "ป.5" },
                  { key: "Prathom 6", label: "ป.6" },
                ].map((grade) => {
                  const entry = student.academicRecord?.primaryGrades?.[grade.key];
                  return (
                    <tr key={grade.key}>
                      <td className="border border-gray-200 px-3 py-2 font-semibold">{grade.label}</td>
                      <td className="border border-gray-200 px-3 py-2">{entry?.year || "-"}</td>
                      <td className="border border-gray-200 px-3 py-2">{entry?.teacherName || "-"}</td>
                      <td className="border border-gray-200 px-3 py-2 font-bold text-indigo-700">{entry?.gpa || "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGE 5: ส่วนที่ 2 ผลงานภาคภูมิใจ 8 กลุ่มสาระ */}
        <div className="min-h-[1050px] border-4 border-double border-indigo-900 p-12 space-y-8 page-break-after">
          <h2 className="text-2xl font-bold text-indigo-950 border-b border-indigo-100 pb-3 flex items-center gap-2">
            <BookOpen size={24} className="text-indigo-800" /> ส่วนที่ 2: ความภาคภูมิใจในผลงานการเรียนรู้ 8 กลุ่มสาระ
          </h2>

          {student.proudWorks && student.proudWorks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {student.proudWorks.slice(0, 4).map((pw, idx) => (
                <div key={pw.id || idx} className="border border-gray-200 p-4 rounded-xl space-y-3 bg-gray-50/30 flex flex-col justify-between">
                  <div>
                    <span className="bg-indigo-100 text-indigo-800 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                      {pw.subjectArea}
                    </span>
                    <h3 className="font-bold text-sm text-gray-800 mt-2">{pw.title}</h3>
                    <p className="text-gray-500 text-[10px] mt-0.5">ปีการศึกษา {pw.year} • ภาคเรียนที่ {pw.term}</p>
                    <p className="text-gray-600 mt-2 italic">"{pw.description || "ไม่มีคำอธิบาย"}"</p>
                  </div>
                  {pw.driveViewUrl && (
                    <div className="w-full h-32 border border-gray-200 rounded-lg overflow-hidden bg-white flex items-center justify-center mt-3">
                      <img
                        src={pw.driveViewUrl}
                        alt={pw.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed rounded-xl text-gray-400 text-xs">
              ยังไม่มีการบันทึกข้อมูลผลงานความภูมิใจกลุ่มสาระการเรียนรู้
            </div>
          )}
        </div>

        {/* PAGE 6: ส่วนที่ 3-5 รางวัล เกียรติบัตร และกิจกรรมความสามารถพิเศษ */}
        <div className="min-h-[1050px] border-4 border-double border-indigo-900 p-12 space-y-8 page-break-after">
          <h2 className="text-2xl font-bold text-indigo-950 border-b border-indigo-100 pb-3 flex items-center gap-2">
            <Award size={24} className="text-indigo-800" /> ส่วนที่ 3-5: รางวัล ผลงานเด่น และกิจกรรมพิเศษ
          </h2>

          {/* Awards */}
          <div className="space-y-3 text-xs">
            <p className="font-bold text-indigo-900">รางวัลและการประกวดที่ได้รับ (ส่วนที่ 3)</p>
            {student.awards && student.awards.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {student.awards.slice(0, 4).map((aw) => (
                  <div key={aw.id} className="border border-gray-100 p-3 rounded-lg bg-gray-50 flex items-start gap-3">
                    {aw.driveViewUrl && (
                      <img
                        src={aw.driveViewUrl}
                        alt="Award"
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 object-cover rounded border"
                      />
                    )}
                    <div>
                      <p className="font-bold text-gray-800">{aw.title}</p>
                      <p className="text-[9px] text-indigo-600 font-medium">ด้าน{aw.category === "academic" ? "วิชาการ" : aw.category === "sports" ? "กีฬา" : "ศิลปวัฒนธรรม/ความประพฤติ"}</p>
                      <p className="text-[9px] text-gray-400">ปีการศึกษา {aw.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-[11px] italic">ไม่มีข้อมูลการบันทึกรางวัล</p>
            )}
          </div>

          {/* Activity Certificates */}
          <div className="space-y-3 text-xs border-t border-gray-100 pt-4">
            <p className="font-bold text-indigo-900">เกียรติบัตรการเข้าร่วมกิจกรรมและการเข้าค่าย (ส่วนที่ 4)</p>
            {student.activityCertificates && student.activityCertificates.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {student.activityCertificates.slice(0, 2).map((ac) => (
                  <div key={ac.id} className="border border-gray-100 p-3 rounded-lg bg-gray-50/50 flex gap-4">
                    {ac.driveViewUrl && (
                      <img
                        src={ac.driveViewUrl}
                        alt="Activity"
                        referrerPolicy="no-referrer"
                        className="w-20 h-20 object-cover rounded border flex-shrink-0"
                      />
                    )}
                    <div className="space-y-1">
                      <p className="font-bold text-gray-800">{ac.title} <span className="text-gray-400 font-normal">({ac.year})</span></p>
                      <p className="text-gray-600"><span className="font-bold">ความรู้สึก:</span> {ac.impression || "-"}</p>
                      <p className="text-gray-600"><span className="font-bold">คุณค่าที่ได้รับ:</span> {ac.benefit || "-"}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-[11px] italic">ไม่มีข้อมูลเกียรติบัตรเข้าร่วมกิจกรรม</p>
            )}
          </div>

          {/* Special Talents */}
          <div className="space-y-3 text-xs border-t border-gray-100 pt-4">
            <p className="font-bold text-indigo-900">กิจกรรมความสามารถพิเศษ หน้าที่ที่ได้รับมอบหมาย (ส่วนที่ 5)</p>
            {student.specialTalents && student.specialTalents.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {student.specialTalents.slice(0, 2).map((st) => (
                  <div key={st.id} className="border border-gray-100 p-3 rounded-lg bg-gray-50/50 flex gap-4">
                    {st.driveViewUrl && (
                      <img
                        src={st.driveViewUrl}
                        alt="Special Talent"
                        referrerPolicy="no-referrer"
                        className="w-20 h-20 object-cover rounded border flex-shrink-0"
                      />
                    )}
                    <div className="space-y-1">
                      <p className="font-bold text-gray-800">{st.title} <span className="text-gray-400 font-normal">({st.year})</span></p>
                      <p className="text-gray-600"><span className="font-bold">รายละเอียด:</span> {st.description || "-"}</p>
                      <p className="text-gray-600"><span className="font-bold">ความประทับใจ:</span> {st.impression || "-"}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-[11px] italic">ไม่มีข้อมูลความสามารถพิเศษหรือหน้าที่ที่ได้รับมอบหมาย</p>
            )}
          </div>
        </div>

        {/* PAGE 7: แบบประเมินผลสำหรับผู้ปกครองและครูประจำชั้น */}
        <div className="min-h-[1050px] border-4 border-double border-indigo-900 p-12 space-y-10">
          <h2 className="text-2xl font-bold text-indigo-950 border-b border-indigo-100 pb-3 flex items-center gap-2">
            <Calendar size={24} className="text-indigo-800" /> แบบประเมินผลแฟ้มสะสมผลงานนักเรียน
          </h2>

          {/* Parent evaluations */}
          <div className="space-y-3 text-xs border border-gray-200 p-4 rounded-xl bg-gray-50/20">
            <p className="font-bold text-sm text-indigo-900 border-b pb-1">สำหรับผู้ปกครอง</p>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="font-bold text-gray-800">ภาคเรียนที่ 1</p>
                <p><span className="font-semibold text-gray-600">ความเห็นผู้ปกครอง:</span> {student.evaluations?.parent?.term1?.opinion || "-"}</p>
                <p><span className="font-semibold text-gray-600">แนวทางสนับสนุน:</span> {student.evaluations?.parent?.term1?.suggestion || "-"}</p>
                <p className="text-right pt-2"><span className="font-semibold">ลงชื่อ:</span> {student.evaluations?.parent?.term1?.signature || "..........................."}</p>
                <p className="text-right"><span className="font-semibold">วันที่:</span> {student.evaluations?.parent?.term1?.date || "...../...../....."}</p>
              </div>
              <div className="space-y-2 border-l border-gray-200 pl-6">
                <p className="font-bold text-gray-800">ภาคเรียนที่ 2</p>
                <p><span className="font-semibold text-gray-600">ความเห็นผู้ปกครอง:</span> {student.evaluations?.parent?.term2?.opinion || "-"}</p>
                <p><span className="font-semibold text-gray-600">แนวทางสนับสนุน:</span> {student.evaluations?.parent?.term2?.suggestion || "-"}</p>
                <p className="text-right pt-2"><span className="font-semibold">ลงชื่อ:</span> {student.evaluations?.parent?.term2?.signature || "..........................."}</p>
                <p className="text-right"><span className="font-semibold">วันที่:</span> {student.evaluations?.parent?.term2?.date || "...../...../....."}</p>
              </div>
            </div>
          </div>

          {/* Teacher evaluations */}
          <div className="space-y-3 text-xs border border-gray-200 p-4 rounded-xl bg-gray-50/20">
            <p className="font-bold text-sm text-indigo-900 border-b pb-1">สำหรับครูประจำชั้น</p>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="font-bold text-gray-800">ภาคเรียนที่ 1</p>
                <p><span className="font-semibold text-gray-600">ความคิดเห็นต่อผลงาน:</span> {student.evaluations?.teacher?.term1?.opinion || "-"}</p>
                <p><span className="font-semibold text-gray-600">ข้อเสนอเพื่อพัฒนา:</span> {student.evaluations?.teacher?.term1?.suggestion || "-"}</p>
                <p className="text-right pt-2"><span className="font-semibold">ลงชื่อครูประจำชั้น:</span> {student.evaluations?.teacher?.term1?.signature || "..........................."}</p>
                <p className="text-right"><span className="font-semibold">วันที่:</span> {student.evaluations?.teacher?.term1?.date || "...../...../....."}</p>
              </div>
              <div className="space-y-2 border-l border-gray-200 pl-6">
                <p className="font-bold text-gray-800">ภาคเรียนที่ 2</p>
                <p><span className="font-semibold text-gray-600">ความคิดเห็นต่อผลงาน:</span> {student.evaluations?.teacher?.term2?.opinion || "-"}</p>
                <p><span className="font-semibold text-gray-600">ข้อเสนอเพื่อพัฒนา:</span> {student.evaluations?.teacher?.term2?.suggestion || "-"}</p>
                <p className="text-right pt-2"><span className="font-semibold">ลงชื่อครูประจำชั้น:</span> {student.evaluations?.teacher?.term2?.signature || "..........................."}</p>
                <p className="text-right"><span className="font-semibold">วันที่:</span> {student.evaluations?.teacher?.term2?.date || "...../...../....."}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
