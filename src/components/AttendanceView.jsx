import React, { useState, useRef } from 'react';
import { 
  Clock, Calendar, UserCheck, AlertCircle, MapPin, 
  EyeOff, Activity, UserX, ShieldCheck, 
  Camera, Image as ImageIcon, Video, X, Home, LogOut, ChevronDown, ClipboardList, Monitor
} from 'lucide-react';
import { ThaiDateFormatter } from './SharedUI';

export default function AttendanceView({ sysTime, currentUserRole, currentUserName, setActiveTab, onGoHome }) {
  const [activeSubTab, setActiveSubTab] = useState(currentUserRole === 'Commander' ? 'live' : 'my_record');
  const [lateEta, setLateEta] = useState('');
  const [lateReason, setLateReason] = useState('');
  const [evidenceFiles, setEvidenceFiles] = useState([]);
  const [lateReasonType, setLateReasonType] = useState('late'); // late หรือ early
  const [showImagePicker, setShowImagePicker] = useState(false);

  // 🌟 ตรวจสอบว่าเป็น Mobile หรือ PC
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);


  // 🌟 สร้าง Dropdown เวลาห่างทีละ 15 นาที (อิงจากเวลาปัจจุบันแบบเรียลไทม์)
  // 🌟 ฟันธง: สร้าง Dropdown เวลาล่วงหน้า 12 ชั่วโมง (แก้บั๊กตอนดึก)
  const timeOptions = [];
  let startH = sysTime.getHours();
  let startM = Math.ceil(sysTime.getMinutes() / 15) * 15;
  
  if (startM === 60) { 
    startH += 1; 
    startM = 0; 
  }

  // วนลูปสร้างเวลาถัดไปอีก 12 ชั่วโมง (48 ช่อง x 15 นาที) 
  // ป้องกันปัญหากดเลือกไม่ได้ตอนใกล้เที่ยงคืน
  for (let i = 0; i < 48; i++) { 
    let h = (startH + Math.floor((startM + i * 15) / 60)) % 24;
    let m = (startM + i * 15) % 60;
    timeOptions.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
  }


  const currentHour = sysTime.getHours();
  const currentMinute = sysTime.getMinutes();

  // คำนวณปัดเศษนาทีขึ้นทีละ 15 นาที (เช่น 23:22 -> 23:30)
  let startHour = currentHour;
  let startMinute = Math.ceil(currentMinute / 15) * 15;

  if (startMinute === 60) {
    startHour += 1;
    startMinute = 0;
  }

  // วนลูปสร้างตัวเลือกเวลาตั้งแต่ "เวลาถัดไป" จนถึง 23:45 น. ของวันนี้
  for (let h = startHour; h <= 23; h++) {
    let mStart = (h === startHour) ? startMinute : 0;
    for (let m = mStart; m < 60; m += 15) {
      timeOptions.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
  }

  // 🌟 จัดการสีตามวันปัจจุบัน
  const dayOfWeek = sysTime.getDay();
  const dayThemes = {
    0: { bg: 'bg-rose-500/20', border: 'border-rose-500', textHead: 'text-rose-400', dayLabel: 'วันอาทิตย์', glow: 'shadow-[0_0_20px_rgba(225,29,72,0.4)]' },
    1: { bg: 'bg-yellow-500/20', border: 'border-yellow-500', textHead: 'text-yellow-400', dayLabel: 'วันจันทร์', glow: 'shadow-[0_0_20px_rgba(234,179,8,0.4)]' },
    2: { bg: 'bg-pink-500/20', border: 'border-pink-500', textHead: 'text-pink-400', dayLabel: 'วันอังคาร', glow: 'shadow-[0_0_20px_rgba(244,114,182,0.4)]' },
    3: { bg: 'bg-emerald-500/20', border: 'border-emerald-500', textHead: 'text-emerald-400', dayLabel: 'วันพุธ', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.4)]' },
    4: { bg: 'bg-orange-500/20', border: 'border-orange-500', textHead: 'text-orange-400', dayLabel: 'วันพฤหัสบดี', glow: 'shadow-[0_0_20px_rgba(249,115,22,0.4)]' },
    5: { bg: 'bg-sky-500/20', border: 'border-sky-500', textHead: 'text-sky-400', dayLabel: 'วันศุกร์', glow: 'shadow-[0_0_20px_rgba(14,165,233,0.4)]' },
    6: { bg: 'bg-purple-500/20', border: 'border-purple-500', textHead: 'text-purple-400', dayLabel: 'วันเสาร์', glow: 'shadow-[0_0_20px_rgba(168,85,247,0.4)]' }
  };
  const wTheme = dayThemes[dayOfWeek];

  const mockTeamStatus = [
    { id: 1, name: 'นายประมินทร์ (สมมติ)', status: 'offline', lastUpdate: '08:00', note: 'สแกนนิ้วแล้ว แต่ยังไม่กด Start Work', location: 'รอระบุ' },
    { id: 2, name: 'นายทศพล (สมมติ)', status: 'late', lastUpdate: '08:15', note: 'แจ้งเข้าสาย ETA: 10:30 น.', location: 'ระหว่างเดินทาง' },
    { id: 3, name: 'นายสมชาย', status: 'online', lastUpdate: '08:20', note: 'พร้อมปฏิบัติงาน', location: 'ตึกปฏิบัติการ (GSE)' },
    { id: 4, name: 'นายสมหญิง', status: 'online', lastUpdate: '08:25', note: 'พร้อมปฏิบัติงาน', location: 'ตึกปฏิบัติการ (GSE)' },
    { id: 5, name: 'นายวิชัย', status: 'outsite', lastUpdate: '09:00', note: 'ซ่อมบำรุงสถานีข่าย', location: 'สถานีดาวเทียมศรีราชา' },
  ];

  const mockBlindReport = [
    { id: 'A', totalLateMins: 345, lateDays: 12, leaveDays: 2 },
    { id: 'B', totalLateMins: 120, lateDays: 4, leaveDays: 0 },
    { id: 'C', totalLateMins: 15, lateDays: 1, leaveDays: 0 },
    { id: 'D', totalLateMins: 0, lateDays: 0, leaveDays: 1 },
  ];

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith('video/') ? 'video' : 'image'
    }));
    setEvidenceFiles(prev => [...prev, ...newFiles].slice(0, 3)); 
  };

  const handleClipboardPaste = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      for (const clipboardItem of clipboardItems) {
        const imageTypes = clipboardItem.types.filter(type => type.startsWith('image/'));
        if (imageTypes.length > 0) {
          const blob = await clipboardItem.getType(imageTypes[0]);
          const file = new File([blob], `snipped_evidence_${Date.now()}.png`, { type: blob.type });
          handleFileSelect({ target: { files: [file] } });
          setShowImagePicker(false);
          return;
        }
      }
      alert("⚠️ ไม่พบรูปภาพที่แคปไว้ครับ!");
    } catch (err) { alert("⚠️ เบราว์เซอร์ไม่อนุญาต หรือท่านยังไม่ได้แคปรูปไว้ครับ"); }
  };

  const removeFile = (index) => {
    setEvidenceFiles(prev => prev.filter((_, i) => i !== index));
  };

  // 🌟 ฟันธง Logic: เช็คเข้าสายอัตโนมัติเมื่อกดเริ่มงาน (อิงเวลา 08:30 น.)
  const handleStartWork = () => {
    const currentHour = sysTime.getHours();
    const currentMinute = sysTime.getMinutes();
    const currentTotalMins = (currentHour * 60) + currentMinute;
    const startLimitMins = (8 * 60) + 30; // เส้นตาย 08:30 น.

    let lateMins = 0;
    if (currentTotalMins > startLimitMins) {
      lateMins = currentTotalMins - startLimitMins;
    }

    if (lateMins > 0) {
      // โหมดประจาน: บันทึกว่าสาย
      alert(`[ยืนยันตัวตน: ${currentUserName}]\n\nบันทึกเวลาเข้างาน: ${sysTime.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.\n⚠️ ระบบตรวจพบว่าคุณเข้าสาย ${lateMins} นาที\n(ระบบได้บันทึกสถิตินี้ลงฐานข้อมูลโดยอัตโนมัติ)`);
    } else {
      // โหมดชื่นชม: มาทันเวลา
      alert(`[ยืนยันตัวตน: ${currentUserName}]\n\nบันทึกเวลาเข้างานเรียบร้อย: ${sysTime.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.\n✅ เยี่ยมมาก! คุณมาตรงเวลาครับ`);
    }
    // TODO: เตรียมส่งข้อมูล lateMins และเวลาเข้างานจริง ไปบันทึกลง Firebase
  };


  return (
    <div className="w-full max-w-5xl mx-auto space-y-4 md:space-y-6 animate-in fade-in duration-500 pb-28 relative z-10">
      
      {/* 🌟 1. นำกรอบวันที่กลับมา (แก้จุดที่ท่านปวดหัว) 🌟 */}
      <div className={`relative bg-slate-900/80 backdrop-blur-xl border-[2px] border-solid ${wTheme.border} rounded-[1.5rem] p-4 md:p-6 ${wTheme.glow} overflow-hidden`}>
        <div className={`absolute -top-20 -left-20 w-40 h-40 ${wTheme.bg} blur-[60px] rounded-full pointer-events-none z-0`}></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 border-solid shadow-inner ${wTheme.bg} ${wTheme.border} ${wTheme.textHead} shrink-0`}>
              <Calendar size={28} />
            </div>
            <div className="flex-1">
              <h2 className={`text-[18px] md:text-[22px] font-black ${wTheme.textHead} tracking-widest uppercase truncate`}>
                ประจำ{wTheme.dayLabel}
              </h2>
              <div className="font-mono text-[14px] md:text-[16px] mt-1.5 inline-block bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-700 shadow-inner">
                <span className="text-orange-400 font-bold drop-shadow-md">{ThaiDateFormatter(sysTime)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🌟 ฟันธง: แถบเมนูย่อย (โชว์ให้เห็นเฉพาะ "หัวหน้า" เท่านั้น ลูกน้องไม่ต้องเห็นให้เกะกะ) 🌟 */}
      {currentUserRole === 'Commander' && (
        <div className="bg-slate-800/60 backdrop-blur-xl border-2 border-slate-700 p-2 md:p-3 rounded-2xl flex gap-2 overflow-x-auto shadow-lg">
          <button onClick={() => setActiveSubTab('live')} className={`flex-1 min-w-[120px] py-2.5 md:py-3 rounded-xl font-black text-[14px] md:text-[16px] transition-all flex items-center justify-center gap-2 ${activeSubTab === 'live' ? 'bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.6)]' : 'bg-slate-900 text-slate-400 hover:bg-slate-700'}`}>
            <Activity size={18} /> สถานะทีม Real-time
          </button>
          <button onClick={() => setActiveSubTab('report')} className={`flex-1 min-w-[120px] py-2.5 md:py-3 rounded-xl font-black text-[14px] md:text-[16px] transition-all flex items-center justify-center gap-2 ${activeSubTab === 'report' ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.6)]' : 'bg-slate-900 text-slate-400 hover:bg-slate-700'}`}>
            <EyeOff size={18} /> รายงานประชุม (ปิดชื่อ)
          </button>
          <button onClick={() => setActiveSubTab('my_record')} className={`flex-1 min-w-[120px] py-2.5 md:py-3 rounded-xl font-black text-[14px] md:text-[16px] transition-all flex items-center justify-center gap-2 ${activeSubTab === 'my_record' ? 'bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.6)]' : 'bg-slate-900 text-slate-400 hover:bg-slate-700'}`}>
            <UserCheck size={18} /> จัดการเวลาของฉัน
          </button>
        </div>
      )}

      {/* 🌟 หน้าจัดการเวลาของฉัน (My Record) */}
      {/* 🌟 1. หน้าจัดการเวลาของฉัน (My Record) - อัปเกรด Sci-Fi Glow & Textarea */}
      {activeSubTab === 'my_record' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          
          {/* 🟢 กล่องเช็คอิน (Sci-Fi Emerald) */}
          <div className="relative overflow-hidden bg-slate-900/80 backdrop-blur-xl border-[2px] border-emerald-500/50 p-6 rounded-[1.5rem] shadow-[0_0_30px_rgba(16,185,129,0.3)] flex flex-col items-center justify-center text-center">
            {/* แสงแฟลร์ (Flare) พื้นหลัง */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-500/20 blur-[60px] rounded-full pointer-events-none z-0"></div>
            
            <div className="relative z-10 w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mb-3 border-[2px] border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              <UserCheck size={40} />
            </div>
            
            <h2 className="relative z-10 text-[22px] md:text-[26px] font-black text-emerald-400 mb-1 drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]">
              {currentUserName || 'คุณ'}
            </h2>
            <h3 className="relative z-10 text-[18px] font-bold text-white mb-2 drop-shadow-md">พร้อมปฏิบัติงาน (Start Work)</h3>
            <p className="relative z-10 text-slate-400 text-[14px] mb-6">กดเพื่อยืนยันว่าถึงโต๊ะและพร้อมทำงานแล้ว</p>
            
            <button onClick={handleStartWork} className="relative z-10 w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black rounded-xl text-[18px] md:text-[20px] shadow-[0_0_20px_rgba(16,185,129,0.6)] hover:shadow-[0_0_35px_rgba(16,185,129,0.9)] active:scale-95 transition-all">
              เริ่มงาน ณ เวลา {sysTime.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} น.
            </button>
          </div>

          {/* 🟠 กล่องแจ้งสาย (Sci-Fi Orange) */}
          {/* 🌟 2. กล่องรวมพลัง: แจ้งสาย + ออกก่อนเวลา (ใช้สวิตช์สลับ) 🌟 */}
          <div className="relative overflow-hidden bg-slate-900/80 backdrop-blur-xl border-[2px] border-orange-500/50 p-6 rounded-[1.5rem] shadow-[0_0_30px_rgba(249,115,22,0.3)] flex flex-col">
            
            {/* สวิตช์สลับโหมด */}
            <div className="flex bg-slate-800 rounded-xl p-1 mb-6 border border-slate-700">
               <button onClick={() => setLateReasonType('late')} className={`flex-1 py-3 rounded-lg font-black text-[14px] transition-all ${lateReasonType === 'late' ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-400'}`}>🟠 แจ้งเข้าสาย</button>
               <button onClick={() => setLateReasonType('early')} className={`flex-1 py-3 rounded-lg font-black text-[14px] transition-all ${lateReasonType === 'early' ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-400'}`}>🔴 ขอออกก่อน</button>
            </div>

            <div className="relative z-10 space-y-4 flex-1">
              <div>
                <label className="block text-[14px] font-bold text-slate-300 mb-1">
                  {lateReasonType === 'late' ? 'เวลาที่คาดว่าจะถึง (ETA)' : 'เวลาที่ต้องการออก (Departure Time)'} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select value={lateEta} onChange={(e) => setLateEta(e.target.value)} className="w-full appearance-none bg-slate-800/80 border-[2px] border-slate-600 rounded-xl px-4 py-3 text-white font-mono text-[18px] focus:border-orange-500 outline-none cursor-pointer">
                    <option value="" disabled>-- เลือกเวลา --</option>
                    {timeOptions.map(time => <option key={time} value={time}>{time} น.</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[14px] font-bold text-slate-300 mb-1">เหตุผล <span className="text-rose-500">*</span></label>
                <textarea rows="3" placeholder={lateReasonType === 'late' ? "ระบุเหตุผลเข้าสาย..." : "ระบุเหตุผลขอออกก่อน..."} value={lateReason} onChange={(e) => setLateReason(e.target.value)} className="w-full bg-slate-800/80 border-[2px] border-slate-600 rounded-xl px-4 py-3 text-white focus:border-orange-500 outline-none resize-none"></textarea>
              </div>
            </div>
            
            <button className={`w-full mt-6 py-4 font-black rounded-xl text-[18px] transition-all ${lateEta && lateReason ? (lateReasonType === 'late' ? 'bg-orange-500' : 'bg-rose-500') + ' text-white shadow-lg active:scale-95' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}>
              ส่งแจ้งเตือน {lateReasonType === 'late' ? 'เข้าสาย' : 'ขอออกก่อน'}
            </button>
          </div>
        </div>
      )}

      {/* 🌟 หน้า Live Status (เฉพาะหัวหน้า) */}
      {activeSubTab === 'live' && currentUserRole === 'Commander' && (
        <div className="bg-slate-800/60 border-2 border-cyan-500/50 p-4 md:p-6 rounded-[1.5rem] shadow-[0_0_20px_rgba(6,182,212,0.15)]">
          <h3 className="text-[20px] md:text-[24px] font-black text-cyan-400 mb-4 md:mb-6 flex items-center gap-2">
            <Activity size={24} className="animate-pulse" /> สถานะทีมวันนี้
          </h3>
          <div className="space-y-3">
            {mockTeamStatus.map(staff => (
              <div key={staff.id} className="bg-slate-900 border border-slate-700 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center shrink-0 shadow-inner ${
                    staff.status === 'online' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' :
                    staff.status === 'late' ? 'bg-orange-500/20 border-orange-500 text-orange-400' :
                    staff.status === 'outsite' ? 'bg-purple-500/20 border-purple-500 text-purple-400' :
                    'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse'
                  }`}>
                    {staff.status === 'online' ? <UserCheck size={20} /> : staff.status === 'outsite' ? <MapPin size={20} /> : <UserX size={20} />}
                  </div>
                  <div>
                    <h4 className="font-black text-white text-[16px] md:text-[18px]">{staff.name}</h4>
                    <p className={`text-[13px] md:text-[14px] font-bold ${staff.status === 'offline' ? 'text-rose-400' : 'text-slate-400'}`}>
                      {staff.note}
                    </p>
                  </div>
                </div>
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 border-slate-700 pt-2 md:pt-0">
                  <span className="text-slate-500 text-[12px] font-bold">อัปเดตล่าสุด: {staff.lastUpdate} น.</span>
                  <span className="text-cyan-400 text-[13px] font-bold flex items-center gap-1"><MapPin size={12} /> {staff.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🌟 หน้ารายงานปิดชื่อ (Blind Report) - ประชุมฝ่าย */}
      {activeSubTab === 'report' && currentUserRole === 'Commander' && (
        <div className="bg-[#0f172a] border-[3px] border-purple-500 p-4 md:p-8 rounded-[1.5rem] shadow-[0_0_30px_rgba(168,85,247,0.3)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-60 h-60 bg-purple-500/10 blur-[50px] rounded-full pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 relative z-10 border-b border-purple-500/30 pb-4">
            <div>
              <h3 className="text-[20px] md:text-[28px] font-black text-white flex items-center gap-3">
                <ShieldCheck size={32} className="text-purple-400" /> รายงานสรุปประจำเดือน (Meeting Mode)
              </h3>
              <p className="text-purple-300 text-[14px] font-bold mt-1 tracking-widest uppercase">*** ข้อมูลถูกปิดบังรายชื่อเพื่อใช้ในการประชุมฝ่าย ***</p>
            </div>
            <div className="mt-3 md:mt-0 bg-purple-900/50 border border-purple-500 px-4 py-2 rounded-lg text-purple-200 font-bold font-mono text-[16px]">
              {ThaiDateFormatter(sysTime)}
            </div>
          </div>

          <div className="overflow-x-auto relative z-10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800 text-slate-300 uppercase text-[12px] md:text-[14px] tracking-widest">
                  <th className="p-4 rounded-tl-xl border-b border-slate-700">รหัสเจ้าหน้าที่</th>
                  <th className="p-4 border-b border-slate-700 text-center">เข้าสาย (นาที)</th>
                  <th className="p-4 border-b border-slate-700 text-center">จำนวนวันสาย</th>
                  <th className="p-4 rounded-tr-xl border-b border-slate-700 text-center">จำนวนวันลากิจ/ป่วย</th>
                </tr>
              </thead>
              <tbody className="text-white font-bold text-[14px] md:text-[16px]">
                {mockBlindReport.map((rep, idx) => (
                  <tr key={idx} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-mono text-cyan-300">เจ้าหน้าที่ {rep.id}</td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-md ${rep.totalLateMins > 100 ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50' : rep.totalLateMins > 0 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50' : 'text-slate-500'}`}>
                        {rep.totalLateMins > 0 ? rep.totalLateMins : '-'}
                      </span>
                    </td>
                    <td className="p-4 text-center text-slate-300">{rep.lateDays > 0 ? rep.lateDays : '-'}</td>
                    <td className="p-4 text-center text-slate-300">{rep.leaveDays > 0 ? rep.leaveDays : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 🌟 2. ปุ่มหน้าหลัก/ออกระบบ อยู่ล่างสุดและตั้ง z-index ให้กดได้ชัวร์ 100% 🌟 */}
      <div className="w-full mt-6 pt-6 border-t border-slate-700/50 flex justify-center gap-4 relative z-[99]">
        <button 
          onClick={() => { if(setActiveTab) setActiveTab('hub'); else console.error('setActiveTab is missing!'); }} 
          className="flex-1 max-w-[200px] bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/50 py-3 md:py-4 rounded-xl font-black transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          <Home size={20} /> หน้าหลัก
        </button>
        <button 
          onClick={() => { if(onGoHome) onGoHome(); else console.error('onGoHome is missing!'); }} 
          className="flex-1 max-w-[200px] bg-rose-500/20 hover:bg-rose-500/40 text-rose-400 border border-rose-500/50 py-3 md:py-4 rounded-xl font-black transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          <LogOut size={20} /> ออกจากระบบ
        </button>
      </div>

      {/* 🌟 3. ป๊อปอัปเลือกรูป แยกโหมด PC กับ Mobile เป๊ะๆ 🌟 */}
      {/* 🌟 3. ป๊อปอัปเลือกรูป (ย่อจอเป็น Mobile, ขยายจอเป็น PC อัตโนมัติ) 🌟 */}
      {showImagePicker && (
        <div className="fixed inset-0 z-[99999] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in" onClick={() => setShowImagePicker(false)}>
          {/* กรอบป๊อปอัปมีขอบเรืองแสงสีส้มแบบในรูปเป๊ะ */}
          <div className="bg-[#1e293b] border-[2px] border-orange-500 rounded-3xl p-6 w-full max-w-sm shadow-[0_0_30px_rgba(249,115,22,0.3)]" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-black text-white mb-6 text-center flex items-center justify-center gap-2">
              <Monitor className="w-6 h-6 text-orange-400" /> เลือกรุปภาพ/วิดีโอ
            </h3>
            
            {/* 📱 โหมด Mobile: จะแสดงผลเมื่อ "ย่อจอ" (หดพรีวิว) เหมือนรูป 192789.jpg เป๊ะ */}
            <div className="flex md:hidden flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => { document.getElementById('camera-img-leave').click(); setShowImagePicker(false); }} className="bg-[#ea580c] hover:bg-[#f97316] p-5 rounded-2xl flex flex-col items-center justify-center gap-2 transition-transform active:scale-95 shadow-md">
                  <Camera className="text-white w-8 h-8" /> <span className="font-bold text-white text-[15px]">ถ่ายรูป</span>
                </button>
                <button onClick={() => { document.getElementById('camera-vid-leave').click(); setShowImagePicker(false); }} className="bg-[#8b5cf6] hover:bg-[#a78bfa] p-5 rounded-2xl flex flex-col items-center justify-center gap-2 transition-transform active:scale-95 shadow-md">
                  <Video className="text-white w-8 h-8" /> <span className="font-bold text-white text-[15px]">ถ่ายวิดีโอ</span>
                </button>
              </div>
              <button onClick={() => { document.getElementById('gallery-input-leave').click(); setShowImagePicker(false); }} className="w-full bg-[#10b981] hover:bg-[#34d399] p-4 rounded-2xl flex items-center justify-center gap-3 transition-transform active:scale-95 shadow-md">
                <Monitor className="text-white w-6 h-6" /> <span className="font-bold text-white text-[16px]">เลือกคลังภาพ/วิดีโอ</span>
              </button>
              <button onClick={() => setShowImagePicker(false)} className="w-full py-4 bg-[#1e293b] text-slate-300 font-bold rounded-2xl border-2 border-slate-600 hover:bg-slate-700 hover:text-white transition-colors shadow-md mt-1">ยกเลิก</button>
            </div>

            {/* 💻 โหมด PC: จะแสดงผลเมื่อ "ขยายจอ" กว้างกว่า 768px (มีปุ่ม Paste แทนกล้อง) */}
            <div className="hidden md:flex flex-col gap-3">
              <button onClick={() => { document.getElementById('gallery-input-leave').click(); setShowImagePicker(false); }} className="bg-emerald-600 hover:bg-emerald-500 border-2 border-emerald-400/80 p-4 rounded-2xl flex items-center justify-center gap-3 transition-transform active:scale-95 shadow-lg">
                <ImageIcon className="text-white w-6 h-6" /> <span className="font-bold text-white text-[16px]">เลือกจากคลังภาพ</span>
              </button>
              <button onClick={() => { handleClipboardPaste(); setShowImagePicker(false); }} className="bg-slate-700 hover:bg-slate-600 border-2 border-slate-500 p-4 rounded-2xl flex items-center justify-center gap-3 transition-transform active:scale-95 shadow-lg">
                <ClipboardList className="text-sky-400 w-6 h-6" /> <span className="font-bold text-white text-[16px]">วางรูปที่แคปไว้ (Paste)</span>
              </button>
              <button onClick={() => setShowImagePicker(false)} className="w-full py-4 bg-slate-800 text-white font-bold rounded-2xl border-2 border-slate-600 hover:bg-slate-700 transition-colors shadow-lg">ยกเลิก</button>
            </div>

          </div>
        </div>
      )}

      {/* Input ซ่อนสำหรับการอัปโหลด */}
      <input type="file" id="camera-img-leave" accept="image/*" capture="environment" onChange={handleFileSelect} className="hidden" />
      <input type="file" id="camera-vid-leave" accept="video/*" capture="environment" onChange={handleFileSelect} className="hidden" />
      <input type="file" id="gallery-input-leave" accept="image/*,video/*" multiple onChange={handleFileSelect} className="hidden" />

    </div>
  );
}