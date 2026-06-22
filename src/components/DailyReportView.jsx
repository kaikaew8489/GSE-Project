import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  Sun, Sunset, AlertTriangle, Wrench, Users, FileText, 
  Map, MapPin, Camera, Video, X, Send, Activity, Monitor,
  Home, LogOut, Calendar, Clock, CheckCircle, RotateCcw,
  ImageIcon, ClipboardList, FileSpreadsheet, File, Search, ChevronLeft, ChevronRight
} from 'lucide-react';
import { db, storage } from '../lib/firebaseConfig';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function DailyReportView({ sysTime, currentUserRole, currentUserName, setActiveTab, onGoHome }) {
  const [activeTabState, setActiveTabState] = useState('write'); 

  // Form States
  const [timeSlot, setTimeSlot] = useState('morning'); 
  const [taskType, setTaskType] = useState([]); 
  const [details, setDetails] = useState('');
  const [locationDesc, setLocationDesc] = useState('');
  const [gpsCoords, setGpsCoords] = useState(null);
  const [evidenceFiles, setEvidenceFiles] = useState([]);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [realReports, setRealReports] = useState([]);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDateType, setFilterDateType] = useState('all'); // 'all', 'date', 'month'
  const [filterDate, setFilterDate] = useState('');
  const [filterMonth, setFilterMonth] = useState('');

  // 🌟 ฟันธง: เพิ่ม State สำหรับ Custom Calendar & Month Picker Modal
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);
  const [showMonthPickerModal, setShowMonthPickerModal] = useState(false);
  const [calendarViewDate, setCalendarViewDate] = useState(sysTime || new Date());

  useEffect(() => {
    const q = query(collection(db, 'daily_reports'), orderBy('timestamp', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRealReports(data);
    });
    return () => unsub();
  }, []);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("⚠️ เบราว์เซอร์ไม่รองรับ GPS ครับ");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setGpsCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => alert("❌ ไม่สามารถดึงพิกัดได้ กรุณาเปิด GPS"),
      { enableHighAccuracy: true }
    );
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setEvidenceFiles(prev => {
      let currentImages = prev.filter(f => f.fileGroup === 'image');
      let currentVideos = prev.filter(f => f.fileGroup === 'video');
      let currentDocs = prev.filter(f => f.fileGroup === 'doc');

      files.forEach(file => {
        const mime = file.type;
        if (mime.startsWith('video/') && currentVideos.length < 1) {
          currentVideos.push({ url: URL.createObjectURL(file), fileGroup: 'video', name: file.name, type: mime, rawFile: file });
        } else if (mime.startsWith('image/')) {
          if (currentImages.length < 6) {
            currentImages.push({ url: URL.createObjectURL(file), fileGroup: 'image', name: file.name, type: mime, rawFile: file });
          }
        } else {
          if (currentDocs.length < 5) {
            currentDocs.push({ url: URL.createObjectURL(file), fileGroup: 'doc', name: file.name, type: mime, rawFile: file });
          }
        }
      });
      return [...currentImages, ...currentVideos, ...currentDocs];
    });
    setShowImagePicker(false);
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
      alert("⚠️ ไม่พบรูปภาพในคลิปบอร์ดครับ โปรดแคปหน้าจอใหม่อีกครั้ง");
    } catch (err) { alert("⚠️ เบราว์เซอร์ไม่อนุญาตให้ดึงรูปจากคลิปบอร์ดครับ"); }
  };

  const removeFile = (index) => setEvidenceFiles(prev => prev.filter((_, i) => i !== index));

  const handleSubmitReport = async () => {
    if (taskType.length === 0 || !details) {
      alert("⚠️ กรุณาเลือก 'หมวดหมู่งาน' และระบุ 'รายละเอียด' ให้ครบถ้วนครับ!");
      return;
    }

    setIsSubmitting(true);
    try {
      const uploadedFiles = [];
      for (const fileObj of evidenceFiles) {
        if (fileObj.rawFile) {
          const fileRef = ref(storage, `daily_reports/${Date.now()}_${fileObj.rawFile.name}`);
          const snapshot = await uploadBytes(fileRef, fileObj.rawFile);
          const downloadUrl = await getDownloadURL(snapshot.ref);
          uploadedFiles.push({
            name: fileObj.name,
            url: downloadUrl,
            fileGroup: fileObj.fileGroup,
            type: fileObj.type
          });
        }
      }

      const dateObj = sysTime || new Date();
      await addDoc(collection(db, 'daily_reports'), {
        userName: currentUserName || 'Unknown',
        timestamp: serverTimestamp(),
        dateString: dateObj.toLocaleDateString('en-CA'), 
        monthString: dateObj.toLocaleDateString('en-CA').slice(0, 7), 
        timeSlot, taskType, details, locationDesc, gpsCoords,
        attachedFiles: uploadedFiles
      });

      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        setActiveTabState('timeline'); 
      }, 2500);

      setTimeSlot('morning'); setTaskType([]); setDetails(''); setLocationDesc(''); setGpsCoords(null); setEvidenceFiles([]);
    } catch (error) {
      console.error("Firebase Error: ", error);
      alert("❌ เกิดข้อผิดพลาดในการส่งข้อมูล ติดต่อแอดมินด่วนครับ");
    }
    setIsSubmitting(false);
  };

  const displayTimeline = useMemo(() => {
    return realReports.filter(item => {
      const matchRole = currentUserRole === 'Commander' || item.userName === currentUserName;
      if (!matchRole) return false;

      const matchSearch = !searchTerm || 
        item.userName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.details?.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchSearch) return false;

      if (filterDateType === 'date' && filterDate) {
        return item.dateString === filterDate;
      }
      if (filterDateType === 'month' && filterMonth) {
        return item.monthString === filterMonth || item.dateString?.startsWith(filterMonth);
      }
      return true;
    });
  }, [realReports, currentUserRole, currentUserName, searchTerm, filterDateType, filterDate, filterMonth]);

  const renderDocIcon = (type) => {
    if (type?.includes('pdf')) return <FileText size={24} className="text-rose-500" />;
    if (type?.includes('sheet') || type?.includes('excel') || type?.includes('csv')) return <FileSpreadsheet size={24} className="text-emerald-500" />;
    return <File size={24} className="text-blue-500" />;
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-0 space-y-6 animate-in fade-in duration-500 pb-28 pt-6 md:pt-10 relative z-10">
      
      {showSuccessModal && (
        <div className="fixed inset-0 z-[99999] bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in duration-500">
          <div className="absolute w-[300px] h-[300px] bg-purple-500/40 rounded-full blur-[100px] animate-pulse pointer-events-none z-0"></div>
          <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-sm">
            <div className="relative mb-8 mt-4">
              <div className="absolute inset-0 border-[6px] border-purple-400 rounded-full animate-ping opacity-30"></div>
              <div className="relative w-28 h-28 bg-gradient-to-tr from-purple-500 to-fuchsia-400 text-white rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(168,85,247,0.8)] border-[3px] border-white/50">
                <CheckCircle size={60} className="drop-shadow-md" />
              </div>
            </div>
            <div className="bg-slate-900 border-[3px] border-purple-500/80 p-8 rounded-3xl shadow-[0_0_40px_rgba(168,85,247,0.4)] w-full text-center">
              <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-b from-purple-300 to-purple-600 mb-4 tracking-wide">ส่งรายงานสำเร็จ!</h2>
              <p className="text-slate-300 font-bold text-[16px]">บันทึกผลการปฏิบัติงานลงใน<br/><span className="text-cyan-400">ระบบศูนย์ปฏิบัติการ</span> เรียบร้อยแล้ว</p>
            </div>
          </div>
        </div>
      )}

      {(() => {
        const dayOfWeek = sysTime ? sysTime.getDay() : new Date().getDay();
        const daysThai = ['วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'];
        const dayColors = ['text-rose-400', 'text-yellow-400', 'text-pink-400', 'text-emerald-400', 'text-orange-400', 'text-sky-400', 'text-purple-400'];
        const borderColors = ['border-rose-500/40', 'border-yellow-500/40', 'border-pink-500/40', 'border-emerald-500/40', 'border-orange-500/40', 'border-sky-500/40', 'border-purple-500/40'];
        const glowColors = ['shadow-[0_0_20px_rgba(225,29,72,0.2)]', 'shadow-[0_0_20px_rgba(234,179,8,0.2)]', 'shadow-[0_0_20px_rgba(244,114,182,0.2)]', 'shadow-[0_0_20px_rgba(16,185,129,0.2)]', 'shadow-[0_0_20px_rgba(249,115,22,0.2)]', 'shadow-[0_0_20px_rgba(14,165,233,0.2)]', 'shadow-[0_0_20px_rgba(168,85,247,0.2)]'];
        
        const currentDayColor = dayColors[dayOfWeek];
        const currentBorder = borderColors[dayOfWeek];
        const currentGlow = glowColors[dayOfWeek];
        
        const formatThaiDateClean = (dateObj) => {
          const target = dateObj || new Date();
          const thMonthsShort = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
          return `${target.getDate()} ${thMonthsShort[target.getMonth()]} ${target.getFullYear() + 543}`;
        };

        return (
          <div className={`w-full bg-slate-900/80 backdrop-blur-xl border-[2px] border-solid ${currentBorder} rounded-[1rem] p-3 md:p-4 ${currentGlow} flex flex-col md:flex-row items-center justify-center gap-2 md:gap-5 relative overflow-hidden mb-6 z-10 transition-all duration-500`}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-700/10 to-transparent opacity-50 pointer-events-none"></div>
            <div className="relative z-10 flex items-center gap-2 md:gap-3">
              <div className={`p-1.5 rounded-lg bg-slate-950/50 border border-slate-700/50 ${currentDayColor} shadow-inner`}>
                <Calendar size={18} />
              </div>
              <span className={`font-black tracking-widest text-[14px] md:text-[16px] ${currentDayColor} drop-shadow-md`}>
                ประจำ{daysThai[dayOfWeek]}ที่ {formatThaiDateClean(sysTime)}
              </span>
            </div>
            <div className="relative z-10 hidden md:block w-[2px] h-5 bg-slate-600/50 rounded-full"></div>
            <div className="relative z-10 md:hidden w-3/4 h-[1px] bg-slate-700/50 my-0.5 rounded-full"></div>
            <div className="relative z-10 flex items-center gap-2 md:gap-3">
              <div className="p-1.5 rounded-lg bg-slate-950/50 border border-slate-700/50 text-orange-400 shadow-inner">
                <Clock size={18} />
              </div>
              <span className="font-black font-mono tracking-widest text-[14px] md:text-[16px] text-orange-400 drop-shadow-md">
                {(sysTime || new Date()).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} น.
              </span>
            </div>
          </div>
        );
      })()}

      <div className="flex bg-slate-900/80 backdrop-blur-md rounded-[1rem] p-1.5 border-[2px] border-slate-700/80 shadow-lg">
        <button onClick={() => setActiveTabState('write')} className={`flex-1 py-3.5 rounded-[0.8rem] font-black text-[15px] md:text-[16px] transition-all duration-300 flex items-center justify-center gap-2 ${activeTabState === 'write' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.6)] border border-purple-400/50 scale-[1.02] z-10' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
          <FileText size={18} /> เขียนรายงาน
        </button>
        <button onClick={() => setActiveTabState('timeline')} className={`flex-1 py-3.5 rounded-[0.8rem] font-black text-[15px] md:text-[16px] transition-all duration-300 flex items-center justify-center gap-2 ${activeTabState === 'timeline' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.6)] border border-cyan-400/50 scale-[1.02] z-10' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
          <ClipboardList size={18} /> กระดานปฏิบัติการ
        </button>
      </div>

      {activeTabState === 'write' && (
        <div className="bg-[#1e293b]/90 backdrop-blur-xl border-[2px] border-slate-700 rounded-3xl p-5 md:p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col gap-6">
          <div>
            <label className="block text-[14px] md:text-[16px] font-bold text-slate-300 mb-3">ช่วงเวลาปฏิบัติงาน (Time Slot)</label>
            <div className="grid grid-cols-3 gap-2 md:gap-4">
              <button onClick={() => setTimeSlot('morning')} className={`py-3 md:py-4 rounded-xl font-bold flex flex-col items-center justify-center gap-1.5 border-[2px] transition-all duration-300 active:scale-95 ${timeSlot === 'morning' ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.4)]' : 'bg-slate-800/80 border-slate-600 text-slate-400 hover:border-cyan-400 hover:text-cyan-300 shadow-sm'}`}><Sun size={22}/> <span className="text-[12px] md:text-[14px] tracking-wide">งานช่วงเช้า</span></button>
              <button onClick={() => setTimeSlot('afternoon')} className={`py-3 md:py-4 rounded-xl font-bold flex flex-col items-center justify-center gap-1.5 border-[2px] transition-all duration-300 active:scale-95 ${timeSlot === 'afternoon' ? 'bg-orange-500/20 border-orange-400 text-orange-300 shadow-[0_0_20px_rgba(249,115,22,0.4)]' : 'bg-slate-800/80 border-slate-600 text-slate-400 hover:border-orange-400 hover:text-orange-300 shadow-sm'}`}><Sunset size={22}/> <span className="text-[12px] md:text-[14px] tracking-wide">งานช่วงบ่าย</span></button>
              <button onClick={() => setTimeSlot('urgent')} className={`py-3 md:py-4 rounded-xl font-bold flex flex-col items-center justify-center gap-1.5 border-[2px] transition-all duration-300 active:scale-95 ${timeSlot === 'urgent' ? 'bg-rose-500/20 border-rose-400 text-rose-300 shadow-[0_0_20px_rgba(225,29,72,0.4)]' : 'bg-slate-800/80 border-slate-600 text-slate-400 hover:border-rose-400 hover:text-rose-300 shadow-sm'}`}><AlertTriangle size={22}/> <span className="text-[12px] md:text-[14px] tracking-wide">ภารกิจด่วน!</span></button>
            </div>
          </div>

          <div>
            <label className="block text-[14px] md:text-[16px] font-bold text-slate-300 mb-3">หมวดหมู่งาน (Tags) <span className="text-slate-500 text-[12px] font-normal tracking-wider">- เลือกได้หลายข้อ</span> <span className="text-rose-500">*</span></label>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {[
                { id: 'ma', icon: <Wrench size={16}/>, label: 'ซ่อมบำรุง (MA)' },
                { id: 'meeting', icon: <Users size={16}/>, label: 'ประชุม / พบปะ' },
                { id: 'doc', icon: <FileText size={16}/>, label: 'งานเอกสาร / จัดซื้อ' },
                { id: 'field', icon: <Map size={16}/>, label: 'ลงพื้นที่ / สำรวจ' },
                { id: 'other', icon: <Monitor size={16}/>, label: 'งานอื่นๆ' }
              ].map(tag => (
                <button 
                  key={tag.id} 
                  onClick={() => setTaskType(prev => prev.includes(tag.id) ? prev.filter(t => t !== tag.id) : [...prev, tag.id])} 
                  className={`px-4 py-2 md:py-2.5 rounded-full font-bold text-[13px] md:text-[14px] border-[2px] flex items-center gap-2 transition-all active:scale-95 ${taskType.includes(tag.id) ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'bg-slate-800/80 border-slate-600 text-slate-400 hover:border-slate-500'}`}>
                  {tag.icon} {tag.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[14px] md:text-[16px] font-bold text-slate-300 mb-2">รายละเอียดงาน / ผลลัพธ์ <span className="text-rose-500">*</span></label>
            <textarea rows="4" placeholder="ระบุสิ่งที่ทำ และผลลัพธ์ที่ได้แบบกระชับ..." value={details} onChange={(e) => setDetails(e.target.value)} className="w-full bg-slate-900 border-[2px] border-slate-600 rounded-xl px-4 py-3 text-white focus:border-purple-400 focus:shadow-[0_0_15px_rgba(168,85,247,0.2)] outline-none resize-none shadow-inner transition-all"></textarea>
          </div>

          <div className="bg-slate-900 p-4 md:p-5 rounded-[1rem] border-[2px] border-slate-700 shadow-inner">
            <label className="block text-[14px] md:text-[16px] font-bold text-slate-300 mb-3 flex items-center gap-2"><MapPin size={18} className="text-cyan-400"/> สถานที่ปฏิบัติงาน</label>
            <div className="flex flex-col md:flex-row gap-3">
              <button onClick={handleGetLocation} className={`md:w-auto px-5 py-3 rounded-xl font-bold text-[13px] md:text-[15px] border-[2px] transition-all active:scale-95 flex items-center justify-center gap-2 ${gpsCoords ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-slate-800 border-cyan-500/80 text-cyan-400 hover:border-cyan-400 shadow-sm'}`}>
                {gpsCoords ? '✅ ล็อกพิกัดสำเร็จ' : '📍 กดดึงพิกัด GPS ปัจจุบัน'}
              </button>
              <input type="text" placeholder="ระบุชื่อสถานที่เพิ่มเติม (เช่น ห้อง Server, ตึกอำนวยการ)" value={locationDesc} onChange={(e) => setLocationDesc(e.target.value)} className="flex-1 bg-slate-800 border-[2px] border-slate-600 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] text-[14px] md:text-[15px] transition-all" />
            </div>
          </div>

          <div className="space-y-4 pt-4 mt-4 border-t-[2px] border-dashed border-purple-500/30">
            <div className="flex justify-between items-center ml-1 mb-2">
              <label className="text-[14px] md:text-[18px] font-black text-purple-300 uppercase tracking-wide flex items-center gap-1.5 md:gap-2">
                <Camera className="md:w-5 md:h-5" /> แนบรูป วิดีโอ และเอกสาร
              </label>
              <div className="flex gap-1.5 md:gap-2">
                <div className="bg-orange-950 border border-orange-500/80 text-orange-400 text-[10px] font-black px-2 py-1 rounded-lg shadow-sm">รูป {evidenceFiles.filter(f => f.fileGroup === 'image').length}/6</div>
                <div className="bg-purple-950 border border-purple-500/80 text-purple-400 text-[10px] font-black px-2 py-1 rounded-lg shadow-sm">คลิป {evidenceFiles.filter(f => f.fileGroup === 'video').length}/1</div>
                <div className="bg-blue-950 border border-blue-500/80 text-blue-400 text-[10px] font-black px-2 py-1 rounded-lg shadow-sm">ไฟล์ {evidenceFiles.filter(f => f.fileGroup === 'doc').length}/5</div>
              </div>
            </div>

            {evidenceFiles.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 md:gap-3 mb-3">
                {evidenceFiles.map((file, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-slate-950 border-[2px] border-purple-400/80 shadow-md group cursor-pointer" onClick={() => window.open(file.url, '_blank')}>
                    {file.fileGroup === 'video' ? (
                      <div className="w-full h-full flex flex-col items-center justify-center text-purple-400 p-2 text-center">
                        <Video size={28}/> <span className="text-[10px] text-slate-400 mt-1 truncate w-full">{file.name}</span>
                      </div>
                    ) : file.fileGroup === 'image' ? (
                      <img src={file.url} alt="Evidence" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center">
                        {renderDocIcon(file.type)}
                        <span className="text-[11px] font-bold text-slate-200 mt-2 line-clamp-2 break-all px-1">{file.name}</span>
                      </div>
                    )}
                    <button type="button" onClick={(e) => { e.stopPropagation(); removeFile(idx); }} className="absolute top-1.5 right-1.5 bg-rose-500 text-white p-1 rounded-full shadow-md hover:bg-rose-600 border border-rose-400 z-10"><X size={12} className="stroke-[3px]" /></button>
                  </div>
                ))}
              </div>
            )}

            <button type="button" onClick={() => setShowImagePicker(true)} className="w-full h-24 md:h-32 border-[2px] border-dashed border-cyan-400/60 bg-cyan-950/20 hover:bg-purple-900/30 hover:border-purple-400 rounded-xl flex flex-col items-center justify-center transition-all duration-300 cursor-pointer shadow-inner group">
              <div className="flex items-center gap-2 mb-1">
                <Camera size={30} className="text-cyan-300/70 group-hover:text-purple-400 transition-all" />
                <span className="text-cyan-300/50 text-[24px] font-light font-mono">/</span>
                <FileText size={26} className="text-purple-300/70 group-hover:text-purple-400 transition-all" />
              </div>
              <span className="font-black tracking-widest text-cyan-300/80 group-hover:text-cyan-300 text-[13px] md:text-[16px]">คลิกแนบ รูปภาพ / วิดีโอ / เอกสาร</span>
            </button>
          </div>

          <div className="pt-4 flex flex-col md:flex-row items-center gap-4 text-center mt-2">
            <button onClick={handleSubmitReport} disabled={isSubmitting || taskType.length === 0 || !details} className={`group w-full md:flex-[2] py-4 md:py-5 rounded-[1.2rem] font-black text-[20px] md:text-[24px] transition-all duration-300 flex justify-center items-center gap-3 border-[2px] border-solid border-white/80 shadow-xl ${taskType.length > 0 && details ? 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:-translate-y-1 active:scale-95' : 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'}`}>
              {isSubmitting ? <span className="animate-pulse">กำลังอัปโหลด...</span> : <><Send size={26} className="drop-shadow-md" /> <span className="tracking-wide drop-shadow-md">ส่งรายงานผลปฏิบัติงาน</span></>}
            </button>
            <button type="button" onClick={() => { setTimeSlot('morning'); setTaskType([]); setDetails(''); setLocationDesc(''); setGpsCoords(null); setEvidenceFiles([]); }} className="w-full md:flex-[1] bg-emerald-600/90 text-white hover:bg-emerald-500 hover:-translate-y-1 font-bold text-[18px] md:text-[20px] py-4 md:py-5 rounded-[1.2rem] flex items-center justify-center gap-2 border-[2px] border-solid border-white/60 active:scale-95 shadow-md transition-all duration-300">
              <RotateCcw size={20} /> ล้างข้อมูล
            </button>
          </div>
        </div>
      )}

      {activeTabState === 'timeline' && (
        <div className="space-y-6">
          <div className="bg-[#1e293b]/90 border-[2px] border-slate-700 p-4 md:p-5 rounded-2xl shadow-xl space-y-3 relative z-20">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder={currentUserRole === 'Commander' ? "ค้นหาชื่อลูกน้อง หรือ ข้อความรายละเอียดรายงาน..." : "ค้นหารายละเอียดรายงานผลงาน..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border-[2px] border-slate-600 rounded-xl py-3 pl-11 pr-4 text-white placeholder-slate-500 font-bold text-[14px] focus:border-cyan-500 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 w-full">
              <button 
                onClick={() => { setFilterDateType('all'); setFilterDate(''); setFilterMonth(''); }} 
                className={`w-full py-2.5 rounded-xl font-black text-[12px] md:text-[14px] transition-all border-[2px] active:scale-95 flex items-center justify-center ${filterDateType === 'all' ? 'bg-gradient-to-b from-cyan-500 to-blue-600 text-white border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-cyan-400'}`}
              >
                ทุกวัน
              </button>
              
              {/* 🌟 ฟันธง: ปุ่มเรียก Custom Calendar Modal ของวันที่ */}
              <button 
                onClick={() => { setCalendarViewDate(sysTime || new Date()); setShowDatePickerModal(true); }}
                className={`w-full py-2.5 rounded-xl font-black text-[12px] md:text-[14px] transition-all border-[2px] active:scale-95 flex items-center justify-center gap-1.5 ${filterDateType === 'date' ? 'bg-gradient-to-b from-cyan-500 to-blue-600 text-white border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-cyan-400'}`}
              >
                 <Calendar size={15} className={filterDateType === 'date' ? 'text-white' : ''}/> ระบุวัน
              </button>

              {/* 🌟 ฟันธง: ปุ่มเรียก Custom Month Modal ของเดือน */}
              <button 
                onClick={() => { setCalendarViewDate(sysTime || new Date()); setShowMonthPickerModal(true); }}
                className={`w-full py-2.5 rounded-xl font-black text-[12px] md:text-[14px] transition-all border-[2px] active:scale-95 flex items-center justify-center gap-1.5 ${filterDateType === 'month' ? 'bg-gradient-to-b from-cyan-500 to-blue-600 text-white border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-cyan-400'}`}
              >
                 <Calendar size={15} className={filterDateType === 'month' ? 'text-white' : ''}/> ระบุเดือน
              </button>
            </div>
          </div>

          {displayTimeline.length === 0 ? (
            <div className="text-center text-slate-400 font-bold bg-slate-900/50 py-12 rounded-3xl border-[2px] border-slate-700 shadow-inner">ไม่พบประวัติผลงานตามเงื่อนไขการค้นหา</div>
          ) : (
            displayTimeline.map((item) => {
              const timeStr = item.timestamp && item.timestamp.toDate 
                ? new Date(item.timestamp.toDate()).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.' 
                : 'กำลังบันทึก...';

              const getCardStyle = (slot) => {
                switch(slot) {
                  case 'urgent': return { border: 'border-rose-500/60', shadow: 'shadow-[0_0_25px_rgba(225,29,72,0.25)]', glow: 'bg-rose-500/15', text: 'text-rose-400' };
                  case 'afternoon': return { border: 'border-orange-500/60', shadow: 'shadow-[0_0_25px_rgba(249,115,22,0.25)]', glow: 'bg-orange-500/15', text: 'text-orange-400' };
                  default: return { border: 'border-cyan-500/60', shadow: 'shadow-[0_0_25px_rgba(6,182,212,0.25)]', glow: 'bg-cyan-500/15', text: 'text-cyan-400' };
                }
              };
              const style = getCardStyle(item.timeSlot);

              return (
                <div key={item.id} className={`bg-slate-900/90 backdrop-blur-xl border-[2px] ${style.border} rounded-[1.5rem] p-5 shadow-lg relative overflow-hidden flex flex-col md:flex-row gap-4 transition-all duration-300 hover:scale-[1.01] hover:${style.shadow}`}>
                  <div className={`absolute -left-10 -top-10 w-32 h-32 ${style.glow} blur-[40px] rounded-full pointer-events-none z-0`}></div>
                  <div className={`absolute left-0 top-0 bottom-0 w-2 ${style.glow.replace('/15', '/80')} shadow-[0_0_15px_currentColor]`}></div>

                  <div className="flex flex-col items-center justify-center bg-slate-950/80 border-[2px] border-slate-700/80 rounded-xl p-3 min-w-[120px] shrink-0 h-max z-10 shadow-inner">
                    <div className={`text-[20px] md:text-[22px] font-black ${style.text} drop-shadow-md`}>{timeStr}</div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase mt-1 tracking-wider">{item.timeSlot === 'morning' ? 'ช่วงเช้า' : item.timeSlot === 'afternoon' ? 'ช่วงบ่าย' : 'ภารกิจด่วน!'}</div>
                  </div>

                  <div className="flex-1 space-y-3 z-10">
                    <div className="flex flex-wrap justify-between items-start gap-2">
                      <h3 className="text-[18px] md:text-[20px] font-black text-white drop-shadow-sm">{item.userName}</h3>
                      <div className="flex flex-wrap gap-1.5 justify-end">
                        {(Array.isArray(item.taskType) ? item.taskType : [item.taskType]).map(tType => {
                          const tagProps = {
                            'ma': { label: 'ซ่อมบำรุง', bg: 'bg-purple-500/20 text-purple-300 border-purple-500/50' },
                            'field': { label: 'ลงพื้นที่', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' },
                            'meeting': { label: 'ประชุม/พบปะ', bg: 'bg-blue-500/20 text-blue-300 border-blue-500/50' },
                            'doc': { label: 'เอกสาร/จัดซื้อ', bg: 'bg-orange-500/20 text-orange-300 border-orange-500/50' },
                            'other': { label: 'งานอื่นๆ', bg: 'bg-slate-700/50 text-slate-300 border-slate-500/50' }
                          };
                          const props = tagProps[tType] || tagProps['other'];
                          return (
                            <span key={tType} className={`px-3 py-1.5 rounded-lg text-[11px] md:text-[12px] font-bold border-[2px] shadow-sm ${props.bg}`}>
                              {props.label}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    
                    <p className="text-slate-200 text-[15px] leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-700/50 whitespace-pre-wrap">{item.details}</p>

                    {((item.attachedFiles && item.attachedFiles.length > 0) || (item.attachedImages && item.attachedImages.length > 0)) && (
                      <div className="space-y-2 mt-3">
                        {item.attachedImages && item.attachedImages.length > 0 && !item.attachedFiles && (
                          <div className="flex gap-3 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            {item.attachedImages.map((imgUrl, idx) => (
                              <a key={`old-${idx}`} href={imgUrl} target="_blank" rel="noreferrer" className="shrink-0 group relative">
                                <div className="absolute inset-0 bg-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl z-10"></div>
                                <img src={imgUrl} alt="หลักฐาน" className="h-24 w-24 object-cover rounded-xl border-[2px] border-slate-600 group-hover:border-purple-400 transition-all duration-300 shadow-sm" />
                              </a>
                            ))}
                          </div>
                        )}

                        {item.attachedFiles && item.attachedFiles.filter(f => f.fileGroup !== 'doc').length > 0 && (
                          <div className="flex gap-3 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            {item.attachedFiles.filter(f => f.fileGroup !== 'doc').map((file, idx) => (
                              <a key={idx} href={file.url} target="_blank" rel="noreferrer" className="shrink-0 group relative">
                                <div className="absolute inset-0 bg-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl z-10"></div>
                                {file.fileGroup === 'video' ? (
                                  <div className="h-24 w-24 bg-slate-950 border-[2px] border-slate-600 rounded-xl flex flex-col items-center justify-center text-purple-400 font-bold text-[10px] p-1 text-center">
                                    <Video size={20}/> <span className="truncate w-full text-slate-400 mt-1">{file.name}</span>
                                  </div>
                                ) : (
                                  <img src={file.url} alt="หลักฐาน" className="h-24 w-24 object-cover rounded-xl border-[2px] border-slate-600 group-hover:border-purple-400 transition-all duration-300 shadow-sm" />
                                )}
                              </a>
                            ))}
                          </div>
                        )}

                        {item.attachedFiles && item.attachedFiles.filter(f => f.fileGroup === 'doc').length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {item.attachedFiles.filter(f => f.fileGroup === 'doc').map((file, idx) => (
                              <a 
                                key={idx} 
                                href={file.url} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="flex items-center gap-2 bg-slate-950 border border-slate-700 hover:border-purple-500 px-3 py-2 rounded-xl text-xs text-slate-200 transition-all font-bold shadow-inner"
                              >
                                {renderDocIcon(file.type)}
                                <span className="max-w-[180px] truncate text-slate-300 hover:text-white">{file.name}</span>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-slate-700/50">
                      <div className="flex items-center gap-2 text-slate-300 text-[13px] font-bold bg-slate-950/80 px-3 py-2 rounded-lg border border-slate-700 shadow-inner">
                        <MapPin size={16} className="text-cyan-400"/> {item.locationDesc || 'ไม่ได้ระบุสถานที่'}
                      </div>
                      {item.gpsCoords && item.gpsCoords.lat && (
                        <a 
                          href={`https://maps.google.com/?q=${item.gpsCoords.lat},${item.gpsCoords.lng}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center gap-2 text-[13px] font-black bg-emerald-500/20 text-emerald-400 border-[2px] border-emerald-500/50 px-4 py-2 rounded-lg hover:bg-emerald-500 hover:text-slate-900 transition-all shadow-sm"
                        >
                          <Map size={16} /> ดูพิกัดบนแผนที่
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div className="text-center text-slate-500 font-bold text-[14px] pt-6 pb-2 tracking-widest">-- สิ้นสุดรายงาน --</div>
        </div>
      )}

      {/* Image / File Picker Portal Modal */}
      {showImagePicker && typeof document !== 'undefined' ? createPortal(
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-800/80 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowImagePicker(false)}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-purple-600/30 rounded-full blur-[100px] animate-pulse pointer-events-none z-0"></div>
          <div className="relative z-10 bg-slate-900/90 backdrop-blur-sm border-[3px] border-solid border-purple-500 rounded-[1.5rem] p-6 w-full max-w-sm shadow-2xl text-center" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-black text-purple-100 mb-6 tracking-widest flex items-center justify-center gap-2"><Monitor size={22} className="text-purple-400" /> เลือกคลังรูปภาพ/ไฟล์</h3>
            <div className="flex md:hidden flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => { document.getElementById('report-cam-img').click(); setShowImagePicker(false); }} className="bg-gradient-to-b from-blue-500 to-blue-700 p-4 rounded-[1rem] flex flex-col items-center justify-center gap-2 border-[2px] border-white/60 shadow-md">
                  <Camera className="text-white w-8 h-8 drop-shadow-md" /> <span className="font-black text-white text-[14px]">ถ่ายรูป</span>
                </button>
                <button onClick={() => { document.getElementById('report-cam-vid').click(); setShowImagePicker(false); }} className="bg-gradient-to-b from-rose-500 to-rose-700 p-4 rounded-[1rem] flex flex-col items-center justify-center gap-2 border-[2px] border-white/60 shadow-md">
                  <Video className="text-white w-8 h-8 drop-shadow-md" /> <span className="font-black text-white text-[14px]">ถ่ายวิดีโอ</span>
                </button>
              </div>
              <button onClick={() => { document.getElementById('report-gal').click(); setShowImagePicker(false); }} className="w-full bg-gradient-to-b from-emerald-500 to-emerald-700 p-4 rounded-[1rem] flex items-center justify-center gap-3 border-[2px] border-white/60 shadow-md mt-1">
                <Monitor className="text-white w-6 h-6 drop-shadow-md" /> <span className="font-black text-white text-[16px]">คลังรูป/วิดีโอ/เอกสาร</span>
              </button>
            </div>
            <div className="hidden md:flex flex-col gap-4">
              <button onClick={() => { document.getElementById('report-gal').click(); setShowImagePicker(false); }} className="flex flex-col items-center justify-center bg-gradient-to-b from-emerald-500 to-emerald-700 p-7 rounded-xl border-[2px] border-white/60 shadow-md hover:scale-105 group transition-all">
                <div className="flex gap-4 mb-2"><Camera size={36} className="text-white" /><FileText size={36} className="text-white" /></div>
                <span className="text-white font-black text-lg">เลือกคลังสื่อและเอกสาร</span>
                <span className="text-emerald-100 text-[12px] font-bold">รองรับรูปภาพ, วิดีโอ, PDF, Word, Excel, PPT</span>
              </button>
              <button type="button" onClick={handleClipboardPaste} className="flex items-center justify-center gap-3 bg-slate-900 border-[2px] border-purple-500/60 p-4 rounded-xl shadow-sm hover:bg-slate-800 transition-all group">
                <ClipboardList className="text-purple-400 w-6 h-6 group-hover:scale-110 transition-all" />
                <div className="flex flex-col items-start text-left"><span className="text-purple-400 font-black text-[15px] tracking-wide">ดึงภาพจากคลิปบอร์ด (Paste)</span><span className="text-slate-400 text-[12px] font-bold">แคปหน้าจอแล้วกดปุ่มนี้ได้เลย</span></div>
              </button>
            </div>
            <button onClick={() => setShowImagePicker(false)} className="w-full mt-6 py-3.5 bg-slate-800 text-slate-200 font-bold rounded-xl border-[2px] border-white/40 shadow-sm hover:bg-rose-700 hover:text-white transition-all uppercase tracking-widest text-[14px]">ยกเลิก</button>
          </div>
        </div>, document.body
      ) : null}

      {/* 🌟 ฟันธง: Custom Calendar Modal (สำหรับเลือกวัน) ถอดแบบจากหน้ามอบหมายงานเป๊ะ 100% */}
      {showDatePickerModal && typeof document !== 'undefined' ? createPortal(
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowDatePickerModal(false)}>
          <div className="relative bg-[#0f172a] border-[2px] border-cyan-500/50 shadow-[0_0_40px_rgba(6,182,212,0.3)] rounded-3xl p-5 w-[340px] max-w-full text-white animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
             
             <div className="flex justify-between items-center mb-6">
               <button onClick={() => setCalendarViewDate(new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth() - 1, 1))} className="w-10 h-10 bg-[#1e293b] rounded-xl flex items-center justify-center hover:bg-slate-700 transition-all border border-slate-600 active:scale-95"><ChevronLeft size={20} className="text-slate-300"/></button>
               <div className="text-center">
                 <div className="text-slate-300 text-sm font-bold mb-1">เลือกวันที่</div>
                 <div className="text-cyan-400 text-xl font-black tracking-wide">
                   {['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'][calendarViewDate.getMonth()]} {calendarViewDate.getFullYear() + 543}
                 </div>
               </div>
               <button onClick={() => setCalendarViewDate(new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth() + 1, 1))} className="w-10 h-10 bg-[#1e293b] rounded-xl flex items-center justify-center hover:bg-slate-700 transition-all border border-slate-600 active:scale-95"><ChevronRight size={20} className="text-slate-300"/></button>
             </div>

             <div className="grid grid-cols-7 gap-2 mb-2 text-center text-sm font-black">
               <div className="text-rose-400">อา</div>
               <div className="text-slate-200">จ</div>
               <div className="text-slate-200">อ</div>
               <div className="text-slate-200">พ</div>
               <div className="text-slate-200">พฤ</div>
               <div className="text-slate-200">ศ</div>
               <div className="text-cyan-400">ส</div>
             </div>

             <div className="grid grid-cols-7 gap-2">
               {Array.from({ length: new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth(), 1).getDay() }).map((_, i) => <div key={`blank-${i}`} />)}
               
               {Array.from({ length: new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth() + 1, 0).getDate() }).map((_, i) => {
                 const day = i + 1;
                 const y = calendarViewDate.getFullYear();
                 const m = calendarViewDate.getMonth();
                 
                 // เช็คว่า วันไหนคือวันที่ถูกเลือกไว้
                 let isSelected = false;
                 if (filterDateType === 'date' && filterDate) {
                    const parts = filterDate.split('-');
                    if (parts.length === 3 && parseInt(parts[0]) === y && parseInt(parts[1]) - 1 === m && parseInt(parts[2]) === day) {
                      isSelected = true;
                    }
                 }

                 // เช็คว่า วันไหนคือวันที่ปัจจุบัน (วันนี้)
                 const today = sysTime || new Date();
                 const isToday = today.getFullYear() === y && today.getMonth() === m && today.getDate() === day;

                 // Logic การให้สี: ถ้าถูกเลือกให้เป็นสีส้ม, ถ้าไม่ถูกเลือกแต่มันคือ "วันนี้" ให้เป็นสีส้มเรืองแสงด้วย
                 let btnClass = "w-full aspect-square flex items-center justify-center rounded-xl text-sm font-bold transition-all ";
                 if (isSelected) {
                   btnClass += "bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-[0_0_15px_rgba(249,115,22,0.8)] border border-orange-300 scale-110 z-10";
                 } else if (isToday) {
                   btnClass += "bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-[0_0_15px_rgba(249,115,22,0.8)] border border-orange-300";
                 } else {
                   btnClass += "border border-slate-700 hover:border-cyan-400 hover:bg-slate-800 text-slate-300";
                 }

                 return (
                   <button
                     key={day}
                     onClick={() => {
                       const fmtM = String(m + 1).padStart(2, '0');
                       const fmtD = String(day).padStart(2, '0');
                       setFilterDate(`${y}-${fmtM}-${fmtD}`);
                       setFilterDateType('date');
                       setShowDatePickerModal(false);
                     }}
                     className={btnClass}
                   >
                     {day}
                   </button>
                 );
               })}
             </div>

             <button onClick={() => setShowDatePickerModal(false)} className="w-full mt-6 bg-[#06b6d4] hover:bg-cyan-500 text-white font-bold py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] active:scale-95 tracking-widest text-[15px]">ยกเลิก</button>
          </div>
        </div>, document.body
      ) : null}

      {/* 🌟 ฟันธง: Custom Month Picker Modal (สำหรับเลือกเดือน) */}
      {showMonthPickerModal && typeof document !== 'undefined' ? createPortal(
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowMonthPickerModal(false)}>
          <div className="relative bg-[#0f172a] border-[2px] border-cyan-500/50 shadow-[0_0_40px_rgba(6,182,212,0.3)] rounded-3xl p-5 w-[340px] max-w-full text-white animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
             
             <div className="flex justify-between items-center mb-6">
               <button onClick={() => setCalendarViewDate(new Date(calendarViewDate.getFullYear() - 1, 0, 1))} className="w-10 h-10 bg-[#1e293b] rounded-xl flex items-center justify-center hover:bg-slate-700 transition-all border border-slate-600 active:scale-95"><ChevronLeft size={20} className="text-slate-300"/></button>
               <div className="text-center">
                 <div className="text-slate-300 text-sm font-bold mb-1">เลือกเดือน</div>
                 <div className="text-cyan-400 text-2xl font-black tracking-wide">{calendarViewDate.getFullYear() + 543}</div>
               </div>
               <button onClick={() => setCalendarViewDate(new Date(calendarViewDate.getFullYear() + 1, 0, 1))} className="w-10 h-10 bg-[#1e293b] rounded-xl flex items-center justify-center hover:bg-slate-700 transition-all border border-slate-600 active:scale-95"><ChevronRight size={20} className="text-slate-300"/></button>
             </div>

             <div className="grid grid-cols-3 gap-3">
               {['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'].map((mName, m) => {
                 const y = calendarViewDate.getFullYear();
                 
                 let isSelected = false;
                 if (filterDateType === 'month' && filterMonth) {
                    const parts = filterMonth.split('-');
                    if (parts.length === 2 && parseInt(parts[0]) === y && parseInt(parts[1]) - 1 === m) {
                      isSelected = true;
                    }
                 }

                 const today = sysTime || new Date();
                 const isTodayMonth = today.getFullYear() === y && today.getMonth() === m;

                 let btnClass = "py-4 rounded-xl text-sm font-bold transition-all ";
                 if (isSelected) {
                   btnClass += "bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-[0_0_15px_rgba(249,115,22,0.8)] border border-orange-300 scale-105 z-10";
                 } else if (isTodayMonth) {
                   btnClass += "bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-[0_0_15px_rgba(249,115,22,0.8)] border border-orange-300";
                 } else {
                   btnClass += "border border-slate-700 hover:border-cyan-400 hover:bg-[#1e293b] text-slate-300";
                 }

                 return (
                   <button
                     key={m}
                     onClick={() => {
                       const fmtM = String(m + 1).padStart(2, '0');
                       setFilterMonth(`${y}-${fmtM}`);
                       setFilterDateType('month');
                       setShowMonthPickerModal(false);
                     }}
                     className={btnClass}
                   >
                     {mName}
                   </button>
                 );
               })}
             </div>

             <button onClick={() => setShowMonthPickerModal(false)} className="w-full mt-6 bg-[#06b6d4] hover:bg-cyan-500 text-white font-bold py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] active:scale-95 tracking-widest text-[15px]">ยกเลิก</button>
          </div>
        </div>, document.body
      ) : null}

      <input type="file" id="report-cam-img" accept="image/*" capture="environment" onChange={handleFileSelect} className="hidden" />
      <input type="file" id="report-cam-vid" accept="video/*" capture="environment" onChange={handleFileSelect} className="hidden" />
      <input type="file" id="report-gal" accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx" multiple onChange={handleFileSelect} className="hidden" />
      
    </div>
  );
}