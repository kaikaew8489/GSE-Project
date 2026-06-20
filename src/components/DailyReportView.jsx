import React, { useState, useEffect } from 'react';
import { 
  Sun, Sunset, AlertTriangle, Wrench, Users, FileText, 
  Map, MapPin, Camera, Video, X, Send, Activity, Monitor,
  Home, LogOut, Calendar, Clock, CheckCircle, RotateCcw
} from 'lucide-react';
import { db, storage } from '../lib/firebaseConfig';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ThaiDateFormatter } from './SharedUI';

export default function DailyReportView({ sysTime, currentUserRole, currentUserName, setActiveTab, onGoHome }) {
  const [activeTabState, setActiveTabState] = useState('write'); 

  const [timeSlot, setTimeSlot] = useState('morning'); 
  const [taskType, setTaskType] = useState(''); 
  const [details, setDetails] = useState('');
  const [locationDesc, setLocationDesc] = useState('');
  const [gpsCoords, setGpsCoords] = useState(null);
  
  const [evidenceFiles, setEvidenceFiles] = useState([]);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [realReports, setRealReports] = useState([]);

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
    const newFiles = files.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith('video/') ? 'video' : 'image',
      rawFile: file
    }));
    setEvidenceFiles(prev => [...prev, ...newFiles].slice(0, 5));
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
      const uploadedUrls = [];
      for (const fileObj of evidenceFiles) {
        if (fileObj.rawFile) {
          const fileRef = ref(storage, `daily_reports/${Date.now()}_${fileObj.rawFile.name}`);
          const snapshot = await uploadBytes(fileRef, fileObj.rawFile);
          const downloadUrl = await getDownloadURL(snapshot.ref);
          uploadedUrls.push(downloadUrl);
        }
      }

      await addDoc(collection(db, 'daily_reports'), {
        userName: currentUserName || 'Unknown',
        timestamp: serverTimestamp(),
        dateString: sysTime.toLocaleDateString('en-CA'),
        timeSlot, taskType, details, locationDesc, gpsCoords,
        hasEvidence: uploadedUrls.length > 0,
        attachedImages: uploadedUrls
      });

      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        setActiveTabState('timeline'); 
      }, 2500);

      setTimeSlot('morning'); setTaskType(''); setDetails(''); setLocationDesc(''); setGpsCoords(null); setEvidenceFiles([]);
    } catch (error) {
      console.error("Firebase Error: ", error);
      alert("❌ เกิดข้อผิดพลาดในการส่งข้อมูล ติดต่อแอดมินด่วนครับ");
    }
    setIsSubmitting(false);
  };

  const displayTimeline = realReports.filter(item => {
    if (currentUserRole === 'Commander') return true;
    return item.userName === currentUserName;
  });

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-28 pt-6 md:pt-10 relative z-10">
      
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

      {/* 🌟 ฟันธง 1: ลบกรอบ Header DAILY REPORT ที่ซ้ำซ้อนออกทั้งหมด (คลีนสุดๆ) 🌟 */}

      <div className="flex bg-slate-900/80 backdrop-blur-md rounded-[1rem] p-1.5 border-[2px] border-slate-700/80 shadow-lg">
        <button onClick={() => setActiveTabState('write')} className={`flex-1 py-3.5 rounded-[0.8rem] font-black text-[15px] md:text-[16px] transition-all duration-300 flex items-center justify-center gap-2 ${activeTabState === 'write' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.6)] border border-purple-400/50 scale-[1.02] z-10' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}><FileText size={18} /> เขียนรายงาน</button>
        <button onClick={() => setActiveTabState('timeline')} className={`flex-1 py-3.5 rounded-[0.8rem] font-black text-[15px] md:text-[16px] transition-all duration-300 flex items-center justify-center gap-2 ${activeTabState === 'timeline' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.6)] border border-cyan-400/50 scale-[1.02] z-10' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}><Activity size={18} /> ไทม์ไลน์ทีม (Feed)</button>
      </div>

      {activeTabState === 'write' && (
        <div className="bg-[#1e293b]/90 backdrop-blur-xl border-[2px] border-slate-700 rounded-3xl p-5 md:p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col gap-6">
          <div>
            <label className="block text-[14px] md:text-[16px] font-bold text-slate-300 mb-3">ช่วงเวลาปฏิบัติงาน (Time Slot)</label>
            <div className="grid grid-cols-3 gap-2 md:gap-4">
              {/* 🌟 ฟันธง 2: เพิ่ม hover effect ให้ปุ่มช่วงเวลาเรืองแสงตาม Theme 🌟 */}
              <button onClick={() => setTimeSlot('morning')} className={`py-3 md:py-4 rounded-xl font-bold flex flex-col items-center justify-center gap-1.5 border-[2px] transition-all duration-300 active:scale-95 ${timeSlot === 'morning' ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.4)]' : 'bg-slate-800/80 border-slate-600 text-slate-400 hover:border-cyan-400 hover:text-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] hover:-translate-y-1'}`}><Sun size={22}/> <span className="text-[12px] md:text-[14px] tracking-wide">งานช่วงเช้า</span></button>
              <button onClick={() => setTimeSlot('afternoon')} className={`py-3 md:py-4 rounded-xl font-bold flex flex-col items-center justify-center gap-1.5 border-[2px] transition-all duration-300 active:scale-95 ${timeSlot === 'afternoon' ? 'bg-orange-500/20 border-orange-400 text-orange-300 shadow-[0_0_20px_rgba(249,115,22,0.4)]' : 'bg-slate-800/80 border-slate-600 text-slate-400 hover:border-orange-400 hover:text-orange-300 hover:shadow-[0_0_15px_rgba(249,115,22,0.4)] hover:-translate-y-1'}`}><Sunset size={22}/> <span className="text-[12px] md:text-[14px] tracking-wide">งานช่วงบ่าย</span></button>
              <button onClick={() => setTimeSlot('urgent')} className={`py-3 md:py-4 rounded-xl font-bold flex flex-col items-center justify-center gap-1.5 border-[2px] transition-all duration-300 active:scale-95 ${timeSlot === 'urgent' ? 'bg-rose-500/20 border-rose-400 text-rose-300 shadow-[0_0_20px_rgba(225,29,72,0.4)]' : 'bg-slate-800/80 border-slate-600 text-slate-400 hover:border-rose-400 hover:text-rose-300 hover:shadow-[0_0_15px_rgba(225,29,72,0.4)] hover:-translate-y-1'}`}><AlertTriangle size={22}/> <span className="text-[12px] md:text-[14px] tracking-wide">ภารกิจด่วน!</span></button>
            </div>
          </div>

          <div>
            <label className="block text-[14px] md:text-[16px] font-bold text-slate-300 mb-3">หมวดหมู่งาน (Tags) <span className="text-rose-500">*</span></label>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {[
                { id: 'ma', icon: <Wrench size={16}/>, label: 'ซ่อมบำรุง (MA)' },
                { id: 'meeting', icon: <Users size={16}/>, label: 'ประชุม / พบปะ' },
                { id: 'doc', icon: <FileText size={16}/>, label: 'งานเอกสาร / จัดซื้อ' },
                { id: 'field', icon: <Map size={16}/>, label: 'ลงพื้นที่ / สำรวจ' },
                { id: 'other', icon: <Monitor size={16}/>, label: 'งานอื่นๆ' }
              ].map(tag => (
                <button key={tag.id} onClick={() => setTaskType(tag.id)} className={`px-4 py-2 md:py-2.5 rounded-full font-bold text-[13px] md:text-[14px] border-[2px] flex items-center gap-2 transition-all active:scale-95 ${taskType === tag.id ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'bg-slate-800/80 border-slate-600 text-slate-400 hover:border-slate-500 hover:bg-slate-800'}`}>
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
              <button onClick={handleGetLocation} className={`md:w-auto px-5 py-3 rounded-xl font-bold text-[13px] md:text-[15px] border-[2px] transition-all active:scale-95 flex items-center justify-center gap-2 ${gpsCoords ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-slate-800 border-cyan-500/80 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)]'}`}>
                {gpsCoords ? '📍 ล็อกพิกัดแล้ว' : '📍 กดดึงพิกัด GPS ปัจจุบัน'}
              </button>
              <input type="text" placeholder="ระบุชื่อสถานที่เพิ่มเติม (เช่น ห้อง Server, ตึกอำนวยการ)" value={locationDesc} onChange={(e) => setLocationDesc(e.target.value)} className="flex-1 bg-slate-800 border-[2px] border-slate-600 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] text-[14px] md:text-[15px] transition-all" />
            </div>
          </div>

          <div className="space-y-4 pt-4 mt-4 border-t-[2px] border-dashed border-purple-500/30">
            <div className="flex justify-between items-center ml-1 mb-2">
              <label className="text-[14px] md:text-[18px] font-black text-purple-300 uppercase tracking-wide flex items-center gap-1.5 md:gap-2">
                <Camera className="md:w-5 md:h-5" /> แนบรูปและวิดีโอ <span className="text-slate-500 font-normal text-[12px]">(โชว์ผลงาน)</span>
              </label>
              <div className="flex gap-2">
                <div className="bg-orange-950 border border-orange-500/80 text-orange-400 text-[10px] md:text-[12px] font-black px-2 py-1 rounded-lg shadow-[0_0_10px_rgba(249,115,22,0.8)] backdrop-blur-sm">รูป {evidenceFiles.filter(f => f.type === 'image').length}/4</div>
                <div className="bg-purple-950 border border-purple-500/80 text-purple-400 text-[10px] md:text-[12px] font-black px-2 py-1 rounded-lg shadow-[0_0_10px_rgba(168,85,247,0.8)] backdrop-blur-sm">คลิป {evidenceFiles.filter(f => f.type === 'video').length}/1</div>
              </div>
            </div>

            {evidenceFiles.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 md:gap-3 mb-3">
                {evidenceFiles.map((file, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border-[2px] border-purple-400/80 shadow-[0_0_15px_rgba(168,85,247,0.3)] group">
                    {file.type === 'video' ? <div className="w-full h-full flex items-center justify-center bg-slate-900 text-purple-400"><Video size={28}/></div> : <img src={file.url} alt="Evidence" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />}
                    <button onClick={() => removeFile(idx)} className="absolute top-1 right-1 bg-rose-500/90 backdrop-blur-sm text-white p-1 rounded-full shadow-lg transition-all active:scale-75 hover:bg-rose-600 border border-rose-400 z-10"><X size={12} className="stroke-[3px]" /></button>
                  </div>
                ))}
              </div>
            )}

            {evidenceFiles.length < 5 && (
              <button type="button" onClick={() => setShowImagePicker(true)} className="w-full h-24 md:h-32 border-[2px] border-dashed border-cyan-400/60 bg-cyan-950/20 hover:bg-purple-900/30 hover:border-purple-400 rounded-xl flex flex-col items-center justify-center transition-all duration-300 cursor-pointer shadow-[inset_0_0_20px_rgba(6,182,212,0.1)] hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] group">
                <div className="flex items-center gap-2 mb-1 transition-all">
                  <Camera size={32} className="text-cyan-300/70 group-hover:text-purple-400 transition-all md:w-10 md:h-10 drop-shadow-md" />
                  <span className="text-cyan-300/50 group-hover:text-white text-[24px] md:text-[30px] font-light font-mono mx-1 transition-colors">/</span>
                  <Video size={32} className="text-purple-300/70 group-hover:text-purple-300 transition-all md:w-10 md:h-10 drop-shadow-md" />
                </div>
                <span className="font-black tracking-widest text-cyan-300/80 group-hover:text-cyan-300 text-[14px] md:text-[18px]">คลิกแนบรูป/วิดีโอ (วิดีโอยาวไม่เกิน 8 วินาที)</span>
              </button>
            )}
          </div>

          <div className="pt-4 flex flex-col md:flex-row items-center gap-4 text-center mt-2">
            <button onClick={handleSubmitReport} disabled={isSubmitting || !taskType || !details} className={`group w-full md:flex-[2] py-4 md:py-5 rounded-[1.2rem] font-black text-[20px] md:text-[24px] transition-all duration-300 flex justify-center items-center gap-3 border-[2px] border-solid border-white/80 shadow-xl ${taskType && details ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-yellow-400 text-white shadow-[0_0_20px_rgba(249,115,22,0.5)] hover:shadow-[0_0_35px_rgba(249,115,22,0.8)] hover:-translate-y-1 active:scale-95' : 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'}`}>
              {isSubmitting ? <span className="animate-pulse">กำลังอัปโหลด...</span> : <><Send size={26} className="md:w-7 md:h-7 drop-shadow-md" /> <span className="tracking-wide drop-shadow-md">ส่งรายงานผลปฏิบัติงาน</span></>}
            </button>
            <button type="button" onClick={() => { setTimeSlot('morning'); setTaskType(''); setDetails(''); setLocationDesc(''); setGpsCoords(null); setEvidenceFiles([]); }} className="w-full md:flex-[1] bg-emerald-600/90 text-white hover:bg-rose-500 hover:shadow-[0_0_25px_rgba(244,63,94,0.6)] hover:-translate-y-1 hover:border-rose-300 font-bold text-[18px] md:text-[20px] py-4 md:py-5 rounded-[1.2rem] flex items-center justify-center gap-2 border-[2px] border-solid border-white/60 active:scale-95 shadow-md transition-all duration-300">
              <RotateCcw size={20} className="md:w-6 md:h-6" /> ล้างข้อมูล
            </button>
          </div>
        </div>
      )}

      {activeTabState === 'timeline' && (
        <div className="space-y-5 md:space-y-6">
          {displayTimeline.length === 0 ? (
            <div className="text-center text-slate-400 font-bold bg-slate-900/50 py-12 rounded-3xl border-[2px] border-slate-700 shadow-inner">ไม่มีประวัติการรายงานผลในขณะนี้</div>
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
                    <div className={`text-[22px] font-black ${style.text} drop-shadow-md`}>{timeStr}</div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase mt-1 tracking-wider">{item.timeSlot}</div>
                  </div>

                  <div className="flex-1 space-y-3 z-10">
                    <div className="flex flex-wrap justify-between items-start gap-2">
                      <h3 className="text-[18px] md:text-[20px] font-black text-white drop-shadow-sm">{item.userName}</h3>
                      <span className={`px-3 py-1.5 rounded-lg text-[12px] font-bold border-[2px] shadow-sm ${item.taskType === 'ma' ? 'bg-purple-500/20 text-purple-300 border-purple-500/50' : item.taskType === 'field' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' : item.taskType === 'meeting' ? 'bg-blue-500/20 text-blue-300 border-blue-500/50' : 'bg-slate-700/50 text-slate-300 border-slate-500/50'}`}>
                        {item.taskType === 'ma' ? 'ซ่อมบำรุง' : item.taskType === 'field' ? 'ลงพื้นที่' : item.taskType === 'meeting' ? 'ประชุม/พบปะ' : item.taskType === 'doc' ? 'เอกสาร/จัดซื้อ' : 'งานอื่นๆ'}
                      </span>
                    </div>
                    
                    <p className="text-slate-200 text-[15px] leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-700/50">{item.details}</p>

                    {item.attachedImages && item.attachedImages.length > 0 && (
                      <div className="flex gap-3 mt-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {item.attachedImages.map((imgUrl, idx) => (
                          <a key={idx} href={imgUrl} target="_blank" rel="noreferrer" className="shrink-0 group relative">
                            <div className="absolute inset-0 bg-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl z-10"></div>
                            <img src={imgUrl} alt="หลักฐาน" className="h-28 w-28 object-cover rounded-xl border-[2px] border-slate-600 group-hover:border-purple-400 transition-all duration-300 shadow-md group-hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] group-hover:scale-[1.02]" />
                          </a>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-slate-700/50">
                      <div className="flex items-center gap-2 text-slate-300 text-[13px] font-bold bg-slate-950/80 px-3 py-2 rounded-lg border border-slate-700 shadow-inner">
                        <MapPin size={16} className="text-cyan-400"/> {item.locationDesc || 'ไม่ได้ระบุสถานที่'}
                      </div>
                      {item.gpsCoords && item.gpsCoords.lat && (
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${item.gpsCoords.lat},${item.gpsCoords.lng}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center gap-2 text-[13px] font-black bg-emerald-500/20 text-emerald-400 border-[2px] border-emerald-500/50 px-4 py-2 rounded-lg hover:bg-emerald-500 hover:text-slate-900 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_20px_rgba(16,185,129,0.6)]"
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

      {/* 🌟 ฟันธง: ปุ่มควบคุมด้านล่าง (หดขอบซ้ายขวาในมือถือ px-4 ให้ตรงกับกรอบด้านบนเป๊ะๆ) 🌟 */}
      <div className="flex flex-row w-full px-4 md:px-0 gap-3 md:gap-4 mt-8 pt-6 border-t-[2px] border-dashed border-slate-700/50 relative z-[99]">
        <button 
          type="button"
          onClick={() => { if(setActiveTab) setActiveTab('hub'); }} 
          className="flex-1 bg-slate-900 border-[2px] border-cyan-600/50 hover:bg-cyan-900/40 hover:border-cyan-400 text-cyan-400 py-4 md:py-5 rounded-xl md:rounded-2xl flex items-center justify-center gap-2 font-black transition-all shadow-sm hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] active:scale-95 text-[14px] md:text-[18px]"
        >
          <Home size={20} className="md:w-6 md:h-6" /> หน้าหลัก (HOME)
        </button>
        
        <button 
          type="button"
          onClick={() => { if(onGoHome) onGoHome(); }} 
          className="flex-1 bg-slate-900 border-[2px] border-rose-600/50 hover:bg-rose-900/40 hover:border-rose-400 text-rose-400 py-4 md:py-5 rounded-xl md:rounded-2xl flex items-center justify-center gap-2 font-black transition-all shadow-sm hover:shadow-[0_0_15px_rgba(244,63,94,0.4)] active:scale-95 text-[14px] md:text-[18px]"
        >
          <LogOut size={20} className="md:w-6 md:h-6" /> ออกจากระบบ
        </button>
      </div>

      {showImagePicker && (
        <div className="fixed inset-0 z-[99999] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in" onClick={() => setShowImagePicker(false)}>
          <div className="bg-[#1e293b] border-[2px] border-purple-500 rounded-3xl p-6 w-full max-w-sm shadow-[0_0_60px_rgba(168,85,247,0.7)]" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-black text-white mb-6 text-center flex items-center justify-center gap-2">แนบหลักฐานการทำงาน</h3>
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => { document.getElementById('report-cam-img').click(); setShowImagePicker(false); }} className="bg-purple-600 hover:bg-purple-500 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 font-bold text-white shadow-lg transition-transform active:scale-95"><Camera size={28}/> ถ่ายรูป</button>
                <button onClick={() => { document.getElementById('report-cam-vid').click(); setShowImagePicker(false); }} className="bg-indigo-600 hover:bg-indigo-500 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 font-bold text-white shadow-lg transition-transform active:scale-95"><Video size={28}/> ถ่ายวิดีโอ</button>
              </div>
              <button onClick={() => { document.getElementById('report-gal').click(); setShowImagePicker(false); }} className="bg-slate-700 hover:bg-slate-600 p-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-white shadow-lg transition-transform active:scale-95"><Monitor size={20}/> เลือกจากคลังภาพ</button>
              <button onClick={() => setShowImagePicker(false)} className="w-full py-3 text-slate-400 font-bold mt-2 hover:text-white transition-colors">ยกเลิก</button>
            </div>
          </div>
        </div>
      )}

      <input type="file" id="report-cam-img" accept="image/*" capture="environment" onChange={handleFileSelect} className="hidden" />
      <input type="file" id="report-cam-vid" accept="video/*" capture="environment" onChange={handleFileSelect} className="hidden" />
      <input type="file" id="report-gal" accept="image/*,video/*" multiple onChange={handleFileSelect} className="hidden" />
      
    </div>
  );
}