import React, { useState } from 'react';
import { 
  Sun, Sunset, AlertTriangle, Wrench, Users, FileText, 
  Map, MapPin, Camera, Video, X, Send, Activity, Monitor,
  Home, LogOut, Calendar, Clock
} from 'lucide-react';
import { db } from '../lib/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ThaiDateFormatter } from './SharedUI';

// 🌟 ฟันธง: เพิ่ม props setActiveTab และ onGoHome เข้ามาเพื่อใช้กับปุ่มด้านล่าง
export default function ReportView({ sysTime, currentUserRole, currentUserName, setActiveTab, onGoHome }) {
  const [activeTab, setActiveTabState] = useState('write'); 

  const [timeSlot, setTimeSlot] = useState('morning'); 
  const [taskType, setTaskType] = useState(''); 
  const [details, setDetails] = useState('');
  const [locationDesc, setLocationDesc] = useState('');
  const [gpsCoords, setGpsCoords] = useState(null);
  
  const [evidenceFiles, setEvidenceFiles] = useState([]);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("⚠️ เบราว์เซอร์ไม่รองรับ GPS ครับ");
      return;
    }
    alert("🛰️ กำลังดึงพิกัดดาวเทียม...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        alert(`✅ ดึงพิกัดสำเร็จ: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
      },
      (err) => alert("❌ ไม่สามารถดึงพิกัดได้ กรุณาเปิด GPS"),
      { enableHighAccuracy: true }
    );
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith('video/') ? 'video' : 'image',
      rawFile: file
    }));
    setEvidenceFiles(prev => [...prev, ...newFiles].slice(0, 4));
    setShowImagePicker(false);
  };

  const removeFile = (index) => setEvidenceFiles(prev => prev.filter((_, i) => i !== index));

  const handleSubmitReport = async () => {
    if (!taskType || !details) {
      alert("⚠️ กรุณาเลือก 'หมวดหมู่งาน' และระบุ 'รายละเอียด' ให้ครบถ้วนครับ!");
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'daily_reports'), {
        userName: currentUserName || 'Unknown',
        timestamp: serverTimestamp(),
        dateString: sysTime.toLocaleDateString('en-CA'),
        timeSlot, taskType, details, locationDesc, gpsCoords,
        hasEvidence: evidenceFiles.length > 0
      });

      alert("✅ ส่งรายงานผลปฏิบัติงานเรียบร้อยแล้วครับ ยอดเยี่ยมมาก!");
      setTaskType(''); setDetails(''); setLocationDesc(''); setGpsCoords(null); setEvidenceFiles([]);
    } catch (error) {
      console.error("Firebase Error: ", error);
      alert("❌ เกิดข้อผิดพลาดในการส่งข้อมูล ติดต่อแอดมินด่วนครับ");
    }
    setIsSubmitting(false);
  };

  const mockTimeline = [
    { id: 1, name: 'นายสมชาย', time: '14:30 น.', slot: 'afternoon', type: 'ma', detail: 'ซ่อมบำรุงแอร์ห้อง Server 2 เสร็จสิ้น', loc: 'ตึกปฏิบัติการ (GSE)' },
    { id: 2, name: 'นายประมินทร์ (สมมติ)', time: '11:15 น.', slot: 'urgent', type: 'field', detail: 'ลงพื้นที่ตรวจเช็คสาย Fiber Optic ขาด', loc: 'หน้าป้อมยาม ทางเข้า 1' }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-28 relative z-10">
      
      {/* 🌟 1. Header (แก้เวลาเบิ้ลซ้อนกันแล้ว) */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900/80 backdrop-blur-xl border-2 border-purple-500/50 p-4 md:p-6 rounded-3xl shadow-[0_0_30px_rgba(168,85,247,0.3)]">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/50 shadow-inner shrink-0">
            <FileText size={32} />
          </div>
          <div>
            <h2 className="text-[20px] md:text-[26px] font-black text-white tracking-widest leading-tight">DAILY REPORT</h2>
            <p className="text-purple-400 font-bold text-[13px] md:text-[14px]">รายงานผลปฏิบัติงาน</p>
          </div>
        </div>
        {/* ใช้ ThaiDateFormatter อย่างเดียวจบ ไม่เบิ้ลเวลาแน่นอน */}
        <div className="w-full md:w-auto text-center text-slate-300 font-mono text-[13px] md:text-[14px] font-bold bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-700 shadow-inner flex items-center justify-center gap-2">
          <Calendar size={16} className="text-purple-400"/> {ThaiDateFormatter(sysTime)}
        </div>
      </div>

      {currentUserRole === 'Commander' && (
        <div className="flex bg-slate-800/80 rounded-2xl p-1.5 border border-slate-700">
          <button onClick={() => setActiveTabState('write')} className={`flex-1 py-3 rounded-xl font-black text-[15px] transition-all flex items-center justify-center gap-2 ${activeTab === 'write' ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'text-slate-400 hover:text-white'}`}><FileText size={18} /> เขียนรายงาน</button>
          <button onClick={() => setActiveTabState('timeline')} className={`flex-1 py-3 rounded-xl font-black text-[15px] transition-all flex items-center justify-center gap-2 ${activeTab === 'timeline' ? 'bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'text-slate-400 hover:text-white'}`}><Activity size={18} /> ไทม์ไลน์ทีม (Feed)</button>
        </div>
      )}

      {/* 🌟 หน้าจอ 1: ฟอร์มเขียนรายงาน */}
      {activeTab === 'write' && (
        <div className="bg-[#1e293b] border-2 border-slate-700 rounded-3xl p-5 md:p-8 shadow-2xl flex flex-col gap-6">
          
          <div>
            <label className="block text-[14px] font-bold text-slate-300 mb-3">ช่วงเวลาปฏิบัติงาน (Time Slot)</label>
            <div className="grid grid-cols-3 gap-2 md:gap-4">
              <button onClick={() => setTimeSlot('morning')} className={`py-3 rounded-xl font-bold flex flex-col items-center justify-center gap-1 border-2 transition-all active:scale-95 ${timeSlot === 'morning' ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'bg-slate-800 border-slate-600 text-slate-400'}`}><Sun size={20}/> <span className="text-[12px] md:text-[14px]">งานช่วงเช้า</span></button>
              <button onClick={() => setTimeSlot('afternoon')} className={`py-3 rounded-xl font-bold flex flex-col items-center justify-center gap-1 border-2 transition-all active:scale-95 ${timeSlot === 'afternoon' ? 'bg-orange-500/20 border-orange-500 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.3)]' : 'bg-slate-800 border-slate-600 text-slate-400'}`}><Sunset size={20}/> <span className="text-[12px] md:text-[14px]">งานช่วงบ่าย</span></button>
              <button onClick={() => setTimeSlot('urgent')} className={`py-3 rounded-xl font-bold flex flex-col items-center justify-center gap-1 border-2 transition-all active:scale-95 ${timeSlot === 'urgent' ? 'bg-rose-500/20 border-rose-500 text-rose-400 shadow-[0_0_15px_rgba(225,29,72,0.3)]' : 'bg-slate-800 border-slate-600 text-slate-400'}`}><AlertTriangle size={20}/> <span className="text-[12px] md:text-[14px]">ภารกิจด่วน!</span></button>
            </div>
          </div>

          <div>
            <label className="block text-[14px] font-bold text-slate-300 mb-3">หมวดหมู่งาน (Tags) <span className="text-rose-500">*</span></label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'ma', icon: <Wrench size={16}/>, label: 'ซ่อมบำรุง (MA)' },
                { id: 'meeting', icon: <Users size={16}/>, label: 'ประชุม / พบปะ' },
                { id: 'doc', icon: <FileText size={16}/>, label: 'งานเอกสาร / จัดซื้อ' },
                { id: 'field', icon: <Map size={16}/>, label: 'ลงพื้นที่ / สำรวจ' },
                { id: 'other', icon: <Monitor size={16}/>, label: 'งานอื่นๆ' }
              ].map(tag => (
                <button key={tag.id} onClick={() => setTaskType(tag.id)} className={`px-4 py-2 rounded-full font-bold text-[13px] border-2 flex items-center gap-2 transition-all active:scale-95 ${taskType === tag.id ? 'bg-purple-500/20 border-purple-500 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)]' : 'bg-slate-800 border-slate-600 text-slate-400 hover:border-slate-500'}`}>
                  {tag.icon} {tag.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[14px] font-bold text-slate-300 mb-2">รายละเอียดงาน / ผลลัพธ์ <span className="text-rose-500">*</span></label>
            <textarea rows="4" placeholder="ระบุสิ่งที่ทำ และผลลัพธ์ที่ได้แบบกระชับ..." value={details} onChange={(e) => setDetails(e.target.value)} className="w-full bg-slate-900 border-[2px] border-slate-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none resize-none shadow-inner"></textarea>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
            <label className="block text-[14px] font-bold text-slate-300 mb-2 flex items-center gap-2"><MapPin size={16} className="text-cyan-400"/> สถานที่ปฏิบัติงาน</label>
            <div className="flex flex-col md:flex-row gap-3">
              <button onClick={handleGetLocation} className={`md:w-auto px-4 py-3 rounded-lg font-bold text-[13px] border-2 transition-all active:scale-95 flex items-center justify-center gap-2 ${gpsCoords ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-800 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-slate-900'}`}>
                {gpsCoords ? '📍 ล็อกพิกัดแล้ว' : '📍 กดดึงพิกัด GPS ปัจจุบัน'}
              </button>
              <input type="text" placeholder="ระบุชื่อสถานที่เพิ่มเติม (เช่น ห้อง Server, ตึกอำนวยการ)" value={locationDesc} onChange={(e) => setLocationDesc(e.target.value)} className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white outline-none focus:border-cyan-500 text-[14px]" />
            </div>
          </div>

          <div>
             <label className="block text-[14px] font-bold text-slate-300 mb-2">แนบภาพ/วิดีโอหลักฐาน <span className="text-slate-500 font-normal">(โชว์ผลงาน)</span></label>
             <div className="flex flex-wrap gap-3">
                {evidenceFiles.map((file, idx) => (
                  <div key={idx} className="relative w-20 h-20 rounded-xl border-2 border-purple-500/50 overflow-hidden bg-slate-900 group shadow-md">
                     {file.type === 'video' ? <div className="w-full h-full flex items-center justify-center text-purple-400"><Video size={28}/></div> : <img src={file.url} alt="Evidence" className="w-full h-full object-cover opacity-80" />}
                     <button onClick={() => removeFile(idx)} className="absolute top-1 right-1 bg-rose-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"><X size={14} /></button>
                  </div>
                ))}
                {evidenceFiles.length < 4 && (
                  <button onClick={() => setShowImagePicker(true)} className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-500 hover:border-purple-500 hover:bg-purple-500/20 flex flex-col items-center justify-center text-slate-400 hover:text-purple-400 transition-all">
                    <Camera size={24} /> <span className="text-[10px] font-bold mt-1">เพิ่มรูป</span>
                  </button>
                )}
             </div>
          </div>

          <button onClick={handleSubmitReport} disabled={isSubmitting} className={`w-full mt-4 py-4 font-black rounded-xl text-[18px] transition-all flex items-center justify-center gap-2 ${taskType && details ? 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] active:scale-95' : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'}`}>
            <Send size={20} /> ส่งรายงานผลปฏิบัติงาน
          </button>
        </div>
      )}

      {/* 🌟 หน้าจอ 2: ไทม์ไลน์ (Feed) สำหรับหัวหน้า */}
      {activeTab === 'timeline' && currentUserRole === 'Commander' && (
        <div className="space-y-4">
          {mockTimeline.map((item) => (
            <div key={item.id} className="bg-[#1e293b] border border-slate-700 rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col md:flex-row gap-4">
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${item.slot === 'morning' ? 'bg-cyan-500' : item.slot === 'afternoon' ? 'bg-orange-500' : 'bg-rose-500'}`}></div>
              <div className="flex flex-col items-center justify-center bg-slate-900 border border-slate-700 rounded-xl p-3 min-w-[100px] shrink-0">
                <div className={`text-[20px] font-black ${item.slot === 'morning' ? 'text-cyan-400' : item.slot === 'afternoon' ? 'text-orange-400' : 'text-rose-400'}`}>{item.time}</div>
                <div className="text-[11px] font-bold text-slate-400 uppercase mt-1">{item.slot}</div>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-[18px] font-black text-white">{item.name}</h3>
                </div>
                <p className="text-slate-300 text-[14px] leading-relaxed">{item.detail}</p>
                <div className="flex items-center gap-2 text-slate-400 text-[12px] font-bold mt-3 bg-slate-900/50 p-2 rounded-lg inline-flex">
                  <MapPin size={14} className="text-cyan-400"/> พิกัด: {item.loc}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🌟 2. ปุ่มหน้าหลัก/ออกระบบ (ดึงให้เหมือนหน้า Attendance เป๊ะๆ) */}
      <div className="w-full mt-6 pt-6 border-t border-slate-700/50 flex justify-center gap-4 relative z-[99]">
        <button onClick={() => { if(setActiveTab) setActiveTab('hub'); }} className="flex-1 max-w-[200px] bg-slate-800 hover:bg-slate-700 text-purple-400 border border-purple-500/50 py-3 md:py-4 rounded-xl font-black transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2 cursor-pointer">
          <Home size={20} /> หน้าหลัก
        </button>
        <button onClick={() => { if(onGoHome) onGoHome(); }} className="flex-1 max-w-[200px] bg-rose-500/20 hover:bg-rose-500/40 text-rose-400 border border-rose-500/50 py-3 md:py-4 rounded-xl font-black transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2 cursor-pointer">
          <LogOut size={20} /> ออกจากระบบ
        </button>
      </div>

      {/* 🌟 3. ป๊อปอัปเลือกรูป (แยกปุ่ม + กรอบเรืองแสง Glow อลังการ) */}
      {showImagePicker && (
        <div className="fixed inset-0 z-[99999] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in" onClick={() => setShowImagePicker(false)}>
          <div className="bg-[#1e293b] border-[2px] border-purple-500 rounded-3xl p-6 w-full max-w-sm shadow-[0_0_60px_rgba(168,85,247,0.7)]" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-black text-white mb-6 text-center flex items-center justify-center gap-2">แนบหลักฐานการทำงาน</h3>
            <div className="flex flex-col gap-3">
              {/* แยกปุ่มถ่ายรูป กับ ถ่ายวิดีโอ */}
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => { document.getElementById('report-cam-img').click(); setShowImagePicker(false); }} className="bg-purple-600 hover:bg-purple-500 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 font-bold text-white shadow-lg transition-transform active:scale-95">
                  <Camera size={28}/> ถ่ายรูป
                </button>
                <button onClick={() => { document.getElementById('report-cam-vid').click(); setShowImagePicker(false); }} className="bg-indigo-600 hover:bg-indigo-500 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 font-bold text-white shadow-lg transition-transform active:scale-95">
                  <Video size={28}/> ถ่ายวิดีโอ
                </button>
              </div>
              <button onClick={() => { document.getElementById('report-gal').click(); setShowImagePicker(false); }} className="bg-slate-700 hover:bg-slate-600 p-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-white shadow-lg transition-transform active:scale-95">
                <Monitor size={20}/> เลือกจากคลังภาพ
              </button>
              <button onClick={() => setShowImagePicker(false)} className="w-full py-3 text-slate-400 font-bold mt-2 hover:text-white transition-colors">ยกเลิก</button>
            </div>
          </div>
        </div>
      )}

      {/* กล้องลับแบบแยกประเภท */}
      <input type="file" id="report-cam-img" accept="image/*" capture="environment" onChange={handleFileSelect} className="hidden" />
      <input type="file" id="report-cam-vid" accept="video/*" capture="environment" onChange={handleFileSelect} className="hidden" />
      <input type="file" id="report-gal" accept="image/*,video/*" multiple onChange={handleFileSelect} className="hidden" />
      
    </div>
  );
}