import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Clock, Calendar, UserCheck, AlertCircle, MapPin, 
  EyeOff, Activity, UserX, ShieldCheck, 
  Camera, Image as ImageIcon, Video, X, Home, LogOut, ChevronDown, ClipboardList, Monitor, Briefcase, FileText, CheckCircle, Eye
} from 'lucide-react';
import { ThaiDateFormatter } from './SharedUI';

import { db } from '../lib/firebaseConfig'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function AttendanceView({ sysTime, currentUserRole, currentUserName, setActiveTab, onGoHome, setLightboxImg, allRosters = [] }) {
  const [activeSubTab, setActiveSubTab] = useState(currentUserRole === 'Commander' ? 'live' : 'my_record');
  
  // State ควบคุมกล่อง Action (ฝั่งขวา)
  const [actionType, setActionType] = useState('late'); 
  const [lateEta, setLateEta] = useState('');
  const [lateReason, setLateReason] = useState('');
  const [leaveType, setLeaveType] = useState('sick');
  const [leaveStartDate, setLeaveStartDate] = useState('');
  const [leaveEndDate, setLeaveEndDate] = useState('');
  
  const [evidenceFiles, setEvidenceFiles] = useState([]);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  // State สำหรับ Custom Sci-Fi Pop-up Calendar
  const [calendarTarget, setCalendarTarget] = useState(null); 
  const [calMonth, setCalMonth] = useState(sysTime.getMonth());
  const [calYear, setCalYear] = useState(sysTime.getFullYear());

  // เปิด Popup สำหรับขอออกก่อนของเวร SSC
  const [showEarlyLeaveModal, setShowEarlyLeaveModal] = useState(false);

  // State สำหรับ Projector Mode ซ่อนชื่อตอนประชุม
  const [projectorMode, setProjectorMode] = useState(false);

  // State สำหรับดักจับการอยู่ดึก (Overtime Clock Out Modal)
  const [showOtModal, setShowOvertimeModal] = useState(false);
  const [otReason, setOvertimeReason] = useState('');

  const [alertConfig, setAlertConfig] = useState({ show: false, message: '', type: 'info' });

 // 🌟 จุดแก้ที่ 1: ดักจับการ Scroll ขั้นสุดยอด (รองรับหน้าเว็บแบบ Div Overflow)
 const [isNavVisible, setIsNavVisible] = useState(true);
 const lastScrollY = useRef(0);

 useEffect(() => {
   const handleScroll = (e) => {
     // ดึงระยะการเลื่อนจาก element ที่เกิดการเลื่อนจริงๆ ไม่ใช่แค่ window
     const currentScrollY = e.target === document ? window.scrollY : e.target.scrollTop;
     
     if (typeof currentScrollY !== 'number') return;

     if (currentScrollY > 50) {
       if (currentScrollY > lastScrollY.current + 5) {
         setIsNavVisible(false); // เลื่อนลง -> ซ่อน
       } else if (currentScrollY < lastScrollY.current - 5) {
         setIsNavVisible(true);  // เลื่อนขึ้น -> โชว์
       }
     } else {
       setIsNavVisible(true); // อยู่บนสุด -> โชว์
     }
     lastScrollY.current = currentScrollY;
   };
   
   window.addEventListener('scroll', handleScroll, true);
   return () => window.removeEventListener('scroll', handleScroll, true);
 }, []);

  // Logic เช็คว่าเป็นเวร SSC วันนี้หรือไม่
  const todayStr = sysTime.toLocaleDateString('en-CA'); 
  const todayRoster = allRosters.find(r => r.date === todayStr);
  const isSSCToday = todayRoster && todayRoster.techName === currentUserName;
  
  // โหลดสถานะการเริ่มงานวันปกติจาก LocalStorage เพื่อให้ค่าไม่หายเมื่อเปลี่ยนหน้า
  const [normalWorkStart, setNormalWorkStart] = useState(() => {
    return localStorage.getItem('gse_normal_work_start') || null;
  });

  const [sscShiftStart, setSscShiftStart] = useState(() => {
    const savedTime = localStorage.getItem('gse_ssc_shift_start');
    return savedTime ? new Date(savedTime) : null;
  });

  const [sscShiftCompletedDate, setSscShiftCompletedDate] = useState(() => {
    return localStorage.getItem('gse_ssc_shift_completed_date') || null;
  });

  const customAlert = (message, type = 'info') => {
    setAlertConfig({ show: true, message, type });
  };
  const closeAlert = () => setAlertConfig({ show: false, message: '', type: 'info' });

  const timeOptions = [];
  let startH = sysTime.getHours();
  let startM = Math.ceil(sysTime.getMinutes() / 15) * 15;
  if (startM === 60) { startH += 1; startM = 0; }
  for (let i = 0; i <= 10; i++) { 
    let h = (startH + Math.floor((startM + i * 15) / 60)) % 24;
    let m = (startM + i * 15) % 60;
    timeOptions.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
  }

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
    { id: 0, name: 'นวัตกรณ์ ไกแก้ว (หน.ฝวด.)', status: 'online', lastUpdate: '08:10', note: 'พร้อมปฏิบัติงาน (หัวหน้าฝ่าย)', location: 'ตึกปฏิบัติการ (GSE)' },
    { id: 1, name: 'นายประมินทร์ (สมมติ)', status: 'offline', lastUpdate: '08:00', note: 'สแกนนิ้วแล้ว แต่ยังไม่กด Start Work', location: 'รอระบุ' },
    { id: 2, name: 'นายทศพล (สมมติ)', status: 'late', lastUpdate: '08:15', note: 'แจ้งเข้าสาย ETA: 10:30 น.', location: 'ระหว่างเดินทาง' },
    { id: 3, name: 'นายสมชาย', status: 'online', lastUpdate: '08:20', note: 'พร้อมปฏิบัติงาน', location: 'ตึกปฏิบัติการ (GSE)' },
    { id: 4, name: 'นายสมหญิง', status: 'online', lastUpdate: '08:25', note: 'พร้อมปฏิบัติงาน', location: 'ตึกปฏิบัติการ (GSE)' },
    { id: 5, name: 'นายวิชัย', status: 'outsite', lastUpdate: '09:00', note: 'ซ่อมบำรุงสถานีข่าย', location: 'สถานีดาวเทียมศรีราชา' },
  ];

  const mockBlindReport = [
    { id: 'นวัตกรณ์ ไกแก้ว (หน.ฝวด.)', totalLateMins: 0, lateDays: 0, leaveDays: 0 },
    { id: 'นายประมินทร์ (สมมติ)', totalLateMins: 345, lateDays: 12, leaveDays: 2 },
    { id: 'นายทศพล (สมมติ)', totalLateMins: 120, lateDays: 4, leaveDays: 0 },
    { id: 'นายสมชาย', totalLateMins: 15, lateDays: 1, leaveDays: 0 },
    { id: 'นายสมหญิง', totalLateMins: 0, lateDays: 0, leaveDays: 1 },
  ];

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setEvidenceFiles(prev => {
      let currentImages = prev.filter(f => f.type === 'image');
      let currentVideos = prev.filter(f => f.type === 'video');
      files.forEach(file => {
        const isVideo = file.type.startsWith('video/');
        if (isVideo && currentVideos.length < 1) {
          currentVideos.push({ url: URL.createObjectURL(file), type: 'video', rawFile: file });
        } else if (!isVideo && currentImages.length < 6) {
          currentImages.push({ url: URL.createObjectURL(file), type: 'image', rawFile: file });
        }
      });
      return [...currentImages, ...currentVideos];
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
      customAlert("⚠️ ไม่พบรูปภาพในคลิปบอร์ดครับ โปรดแคปหน้าจอใหม่อีกครั้ง", "error");
    } catch (err) { customAlert("⚠️ เบราว์เซอร์ไม่อนุญาตให้ดึงรูปจากคลิปบอร์ดครับ", "error"); }
  };

  const removeFile = (index) => {
    setEvidenceFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; 
    const p1 = lat1 * Math.PI/180;
    const p2 = lat2 * Math.PI/180;
    const dp = (lat2-lat1) * Math.PI/180;
    const dl = (lon2-lon1) * Math.PI/180;
    const a = Math.sin(dp/2) * Math.sin(dp/2) + Math.cos(p1) * Math.cos(p2) * Math.sin(dl/2) * Math.sin(dl/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; 
  };

  const handleStartWorkClick = () => {
    document.getElementById('live-snap-checkin').click();
  };

  const handleLiveSnapSubmit = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      customAlert("⚠️ ท่านยกเลิกการถ่ายรูป กรุณาลองใหม่อีกครั้งครับ", "error");
      return; 
    }

    customAlert("🛰️ กำลังตรวจสอบพิกัดดาวเทียมเพื่อลงเวลา...\nกรุณารอสักครู่ครับ", "info");
    
    if (!navigator.geolocation) { 
      customAlert("⚠️ เบราว์เซอร์ของคุณไม่รองรับระบบ GPS", "error"); 
      return; 
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const targetLat = 13.102163; 
        const targetLng = 100.927813;
        const distance = getDistance(targetLat, targetLng, userLat, userLng);
        
        if (distance > 100) {
          customAlert(`❌ ปฏิเสธการลงเวลา!\nพิกัดของคุณอยู่ห่างจากศูนย์ปฏิบัติการ ${Math.round(distance)} เมตร\n\n(อนุญาตให้ลงเวลาในรัศมีไม่เกิน 100 เมตรเท่านั้น)`, "error");
        } else {
          const currentHour = sysTime.getHours();
          const currentMinute = sysTime.getMinutes();
          const currentTotalMins = (currentHour * 60) + currentMinute;
          const startLimitMins = (8 * 60) + 30; // 08:30
      
          let lateMins = 0;
          if (currentTotalMins > startLimitMins) {
            lateMins = currentTotalMins - startLimitMins;
          }
      
          try {
            await addDoc(collection(db, 'attendance_logs'), {
              type: 'check-in',
              userName: currentUserName || 'Unknown',
              role: currentUserRole,
              timestamp: serverTimestamp(),
              dateString: sysTime.toLocaleDateString('en-CA'),
              status: lateMins > 0 ? 'late' : 'on-time',
              lateMins: lateMins,
              checkInTime: `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`,
              hasLiveSnap: true
            });
      
            const timeNowStr = sysTime.toISOString();
            localStorage.setItem('gse_normal_work_start', timeNowStr);
            setNormalWorkStart(timeNowStr);
      
            if (lateMins > 0) {
              customAlert(`📸 บันทึกเวลาเข้างานเรียบร้อย: ${sysTime.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.\n\n⚠️ ระบบตรวจพบว่าคุณเข้าสาย ${lateMins} นาที`, "error");
            } else {
              customAlert(`📸 บันทึกเวลาเข้างานเรียบร้อย: ${sysTime.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.\n\n✅ พร้อมปฏิบัติงานตรงเวลาครับ`, "success");
            }
          } catch (error) {
            console.error("Firebase Error: ", error);
            customAlert("❌ เกิดข้อผิดพลาดในการบันทึกข้อมูล ติดต่อแอดมินด่วนครับ!", "error");
          }
        }
      },
      (error) => { customAlert("⚠️ ไม่สามารถอ่านพิกัด GPS ได้!\nกรุณาเปิดการอนุญาต Location Services ก่อนครับ", "error"); },
      { enableHighAccuracy: true } 
    );
  };

  const handleNormalClockOutCheck = () => {
    if (!navigator.geolocation) { customAlert("⚠️ เบราว์เซอร์ไม่รองรับ GPS", "error"); return; }
    customAlert("🛰️ กำลังตรวจสอบพิกัดจุดออกงาน...", "info");
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const targetLat = 13.102163; 
        const targetLng = 100.927813;
        const distance = getDistance(targetLat, targetLng, userLat, userLng);
        
        if (distance > 100) {
          customAlert(`❌ ปฏิเสธการออกงาน!\nพิกัดเซ็นเซอร์ระบุว่าท่านห่างจากศูนย์ปฏิบัติการ ${Math.round(distance)} เมตร\n\n(ระบบสากลกำหนดให้ออกงานในรัศมีไม่เกิน 100 เมตร)`, "error");
        } else {
          closeAlert();
          if (sysTime.getHours() >= 17) {
            setShowOvertimeModal(true);
          } else {
            executeNormalClockOut('');
          }
        }
      },
      (error) => { customAlert("⚠️ ไม่สามารถดึงพิกัด GPS ได้!", "error"); },
      { enableHighAccuracy: true }
    );
  };

  const executeNormalClockOut = async (reason) => {
    try {
      await addDoc(collection(db, 'attendance_logs'), {
        type: 'check-out',
        userName: currentUserName || 'Unknown',
        timestamp: serverTimestamp(),
        dateString: sysTime.toLocaleDateString('en-CA'),
        checkOutTime: `${String(sysTime.getHours()).padStart(2, '0')}:${String(sysTime.getMinutes()).padStart(2, '0')}`,
        overtimeReason: reason || 'เลิกงานตามเวลาปกติ'
      });
      localStorage.removeItem('gse_normal_work_start');
      setNormalWorkStart(null);
      setShowOvertimeModal(false);
      setOvertimeReason('');
      customAlert("✅ บันทึกเวลาเลิกงานสำเร็จ ขอบคุณสำหรับการปฏิบัติงานครับ!", "success");
    } catch (err) {
      customAlert("❌ เกิดข้อผิดพลาดหลังบ้าน: " + err.message, "error");
    }
  };

  const handleStartSSCShift = () => {
    const currentHour = sysTime.getHours();
    const currentMinute = sysTime.getMinutes();
    const isLate = currentHour >= 11 && currentMinute > 0;
    
    setSscShiftStart(sysTime);
    localStorage.setItem('gse_ssc_shift_start', sysTime.toISOString()); 

    if (isLate) {
      customAlert(`[เวร SSC: ${currentUserName}]\n📸 บันทึกเวลาเข้าเวร: ${sysTime.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.\n\n⚠️ คุณเข้าเวรล่าช้าเกินเวลา 11:00 น. ตามข้อกำหนดครับ`, "error");
    } else {
      customAlert(`[เวร SSC: ${currentUserName}]\n📸 บันทึกเวลาเข้าเวรเรียบร้อย: ${sysTime.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.\n\n✅ พร้อมสแตนด์บายประสานงานครับ`, "success");
    }
  };

  const handleEndSSCShift = (progressPct) => {
    if (progressPct < 100) {
      setActionType('early'); 
      setShowEarlyLeaveModal(true);
    } else {
      customAlert("✅ ออกเวร SSC เรียบร้อย!\nขอบคุณสำหรับการปฏิบัติหน้าที่อย่างเต็มกำลังครับ!", "success");
      setSscShiftStart(null); 
      localStorage.removeItem('gse_ssc_shift_start'); 
      const todayStrLocal = sysTime.toLocaleDateString('en-CA');
      setSscShiftCompletedDate(todayStrLocal); 
      localStorage.setItem('gse_ssc_shift_completed_date', todayStrLocal);
    }
  };

  const handleSubmitNotice = async () => {
    if (actionType === 'leave') {
      if (!leaveStartDate || !leaveEndDate || !lateReason) {
         customAlert("⚠️ กรุณาระบุวันที่ลา และเหตุผลให้ครบถ้วนครับ!", "error"); return;
      }
    } else {
      if (!lateEta || !lateReason) {
         customAlert("⚠️ กรุณาระบุเวลาและเหตุผลให้ครบถ้วนก่อนส่งข้อมูลครับ!", "error"); return;
      }
    }

    try {
      await addDoc(collection(db, 'attendance_logs'), {
        type: actionType === 'leave' ? 'leave_request' : (actionType === 'late' ? 'late_notice' : 'early_leave'),
        userName: currentUserName || 'Unknown',
        timestamp: serverTimestamp(),
        dateString: sysTime.toLocaleDateString('en-CA'),
        etaTime: lateEta,
        reason: lateReason,
        leaveDetails: actionType === 'leave' ? { type: leaveType, start: leaveStartDate, end: leaveEndDate } : null,
        hasEvidence: evidenceFiles.length > 0 
      });

      customAlert(`✅ ส่งข้อมูลแจ้ง${actionType === 'late' ? 'เข้าสาย' : actionType === 'early' ? 'ขอออกก่อน' : 'ลางาน/ไปราชการ'} ลงฐานข้อมูลเรียบร้อยแล้วครับ!`, "success");
      
      setLateEta(''); setLateReason(''); setEvidenceFiles([]); setLeaveStartDate(''); setLeaveEndDate('');
      
      if (isSSCToday && actionType === 'early') {
        setShowEarlyLeaveModal(false);
        setSscShiftStart(null); 
        localStorage.removeItem('gse_ssc_shift_start');
        
        const todayStrLocal = sysTime.toLocaleDateString('en-CA');
        setSscShiftCompletedDate(todayStrLocal); 
        localStorage.setItem('gse_ssc_shift_completed_date', todayStrLocal);
      }
    } catch (error) {
      console.error("Firebase Error: ", error);
      customAlert("❌ เกิดข้อผิดพลาดในการส่งข้อมูล: " + error.message, "error");
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4 md:space-y-6 animate-in fade-in duration-500 pb-32 relative z-10">
      
      {/* 🌟 กรอบแสดง วัน วันที่ เวลา มาตรฐานระดับโลก */}
      {(() => {
        const dayOfWeek = sysTime.getDay();
        const daysThai = ['วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'];
        const dayColors = ['text-rose-400', 'text-yellow-400', 'text-pink-400', 'text-emerald-400', 'text-orange-400', 'text-sky-400', 'text-purple-400'];
        const borderColors = ['border-rose-500/40', 'border-yellow-500/40', 'border-pink-500/40', 'border-emerald-500/40', 'border-orange-500/40', 'border-sky-500/40', 'border-purple-500/40'];
        const glowColors = ['shadow-[0_0_20px_rgba(225,29,72,0.2)]', 'shadow-[0_0_20px_rgba(234,179,8,0.2)]', 'shadow-[0_0_20px_rgba(244,114,182,0.2)]', 'shadow-[0_0_20px_rgba(16,185,129,0.2)]', 'shadow-[0_0_20px_rgba(249,115,22,0.2)]', 'shadow-[0_0_20px_rgba(14,165,233,0.2)]', 'shadow-[0_0_20px_rgba(168,85,247,0.2)]'];
        
        const currentDayColor = dayColors[dayOfWeek];
        const currentBorder = borderColors[dayOfWeek];
        const currentGlow = glowColors[dayOfWeek];
        
        const formatThaiDateClean = (dateObj) => {
          const thMonthsShort = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
          return `${dateObj.getDate()} ${thMonthsShort[dateObj.getMonth()]} ${dateObj.getFullYear() + 543}`;
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
                {sysTime.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} น.
              </span>
            </div>
          </div>
        );
      })()}

      {/* 🌟 แถบเมนูย่อย (เฉพาะ Commander) */}
      {currentUserRole === 'Commander' && (
        <div className="bg-slate-800/60 backdrop-blur-xl border-2 border-slate-700 p-2 md:p-3 rounded-2xl flex gap-2 overflow-x-auto shadow-lg">
          <button onClick={() => setActiveSubTab('live')} className={`flex-1 min-w-[120px] py-2.5 md:py-3 rounded-xl font-black text-[14px] md:text-[16px] transition-all flex items-center justify-center gap-2 ${activeSubTab === 'live' ? 'bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.6)]' : 'bg-slate-900 text-slate-400 hover:bg-slate-700'}`}>
            <Activity size={18} /> สถานะทีม Real-time
          </button>
          <button onClick={() => setActiveSubTab('report')} className={`flex-1 min-w-[120px] py-2.5 md:py-3 rounded-xl font-black text-[14px] md:text-[16px] transition-all flex items-center justify-center gap-2 ${activeSubTab === 'report' ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.6)]' : 'bg-slate-900 text-slate-400 hover:bg-slate-700'}`}>
            <EyeOff size={18} /> รายงานประชุม
          </button>
          <button onClick={() => setActiveSubTab('my_record')} className={`flex-1 min-w-[120px] py-2.5 md:py-3 rounded-xl font-black text-[14px] md:text-[16px] transition-all flex items-center justify-center gap-2 ${activeSubTab === 'my_record' ? 'bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.6)]' : 'bg-slate-900 text-slate-400 hover:bg-slate-700'}`}>
            <UserCheck size={18} /> จัดการเวลาของฉัน
          </button>
        </div>
      )}

      {/* 🌟 หน้าจัดการเวลาของฉัน (My Record) */}
      {activeSubTab === 'my_record' && (
        <div className={`grid grid-cols-1 ${!isSSCToday ? 'md:grid-cols-2' : 'w-full'} gap-4 md:gap-6 animate-in slide-in-from-bottom-4 duration-500`}>
          
          {/* 🟢 กล่องคุมการเช็คอิน/ออกงาน */}
          {!isSSCToday ? (
            !normalWorkStart ? (
              // 🔴 วันปกติ: ยังไม่เริ่มงาน (แสดงปุ่ม Start Work ที่กดแล้วเด้งกล้องทันที)
              <div className="relative overflow-hidden bg-slate-900/80 backdrop-blur-xl border-[2px] border-emerald-500/50 p-6 rounded-[1.5rem] shadow-[0_0_30px_rgba(16,185,129,0.3)] flex flex-col items-center justify-center text-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-500/20 blur-[60px] rounded-full pointer-events-none z-0"></div>
                <div className="relative z-10 w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mb-3 border-[2px] border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.4)]"><UserCheck size={40} /></div>
                <h2 className="relative z-10 text-[22px] md:text-[26px] font-black text-emerald-400 mb-1 drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]">{currentUserName || 'คุณ'}</h2>
                <h3 className="relative z-10 text-[18px] font-bold text-white mb-2 drop-shadow-md">พร้อมปฏิบัติงาน (Start Work)</h3>
                <p className="relative z-10 text-slate-400 text-[14px] mb-6">ระบบจะเปิดกล้องเพื่อถ่ายภาพสด แล้วถึงจะบันทึกพิกัด GPS</p>
                <button onClick={handleStartWorkClick} className="relative z-10 w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black rounded-xl text-[18px] md:text-[20px] shadow-[0_0_20px_rgba(16,185,129,0.6)] hover:shadow-[0_0_35px_rgba(16,185,129,0.9)] active:scale-95 transition-all">
                  เริ่มงาน ณ เวลา {sysTime.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} น.
                </button>
              </div>
            ) : (
              // 🔴 วันปกติ: เริ่มงานไปแล้ว (แสดงปุ่ม Clock Out)
              <div className="relative overflow-hidden bg-slate-900/80 backdrop-blur-xl border-[2px] border-cyan-500/50 p-6 rounded-[1.5rem] shadow-[0_0_30px_rgba(6,182,212,0.3)] flex flex-col items-center justify-center text-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cyan-500/20 blur-[60px] rounded-full pointer-events-none z-0"></div>
                <div className="relative z-10 w-20 h-20 bg-cyan-500/10 text-cyan-400 rounded-full flex items-center justify-center mb-4 border-[2px] border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.4)] animate-pulse"><ShieldCheck size={40} /></div>
                <h2 className="relative z-10 text-[22px] md:text-[26px] font-black text-white mb-1">{currentUserName || 'คุณ'}</h2>
                <div className="relative z-10 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-bold mb-4 tracking-wider shadow-inner flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div> กำลังปฏิบัติงานในเวลาราชการ
                </div>
                <p className="relative z-10 text-slate-400 text-[13px] mb-6">เวลาที่เข้างาน: <span className="font-mono text-cyan-400 font-bold">{new Date(normalWorkStart).toLocaleTimeString('th-TH', {hour:'2-digit', minute:'2-digit'})} น.</span></p>
                <button onClick={handleNormalClockOutCheck} className="relative z-10 w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:brightness-110 text-white font-black rounded-xl text-[16px] md:text-[18px] shadow-[0_0_20px_rgba(249,115,22,0.4)] active:scale-95 transition-all">
                  🔔 ลงเวลาออกงาน (Clock Out)
                </button>
              </div>
            )
          ) : (
            // --- 🔵 โหมดเวรปฏิบัติการ SSC ---
            sscShiftCompletedDate === todayStr ? (
              <div className="relative overflow-hidden bg-slate-900/90 backdrop-blur-xl border-[2px] border-emerald-500 p-6 rounded-[1.5rem] shadow-[0_0_40px_rgba(16,185,129,0.3)] flex flex-col items-center justify-center text-center h-full min-h-[350px]">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/20 blur-[80px] rounded-full pointer-events-none z-0"></div>
                <div className="relative z-10 w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mb-3 border-[2px] border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.6)]"><CheckCircle size={40} /></div>
                <h2 className="relative z-10 text-[22px] md:text-[26px] font-black text-emerald-400 mb-2">ปฏิบัติหน้าที่เสร็จสิ้น</h2>
                <p className="relative z-10 text-slate-300 text-[14px] md:text-[15px] mb-6">ท่านได้สิ้นสุดการปฏิบัติหน้าที่เวร SSC ประจำวันนี้เรียบร้อยแล้ว<br/>ขอบคุณสำหรับการทำงานอย่างทุ่มเทครับ</p>
                <div className="relative z-10 w-full max-w-sm bg-slate-800/80 border border-emerald-500/30 rounded-xl p-4 flex justify-center gap-6 shadow-inner"><div className="px-4 text-center"><span className="block text-[12px] text-slate-400 font-bold mb-1 uppercase">Status</span><span className="font-black text-[16px] text-emerald-400">Completed</span></div></div>
              </div>
            ) : (
              <div className="relative overflow-hidden bg-slate-900/90 backdrop-blur-xl border-[2px] border-blue-500 p-6 rounded-[1.5rem] shadow-[0_0_40px_rgba(59,130,246,0.3)] flex flex-col items-center text-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/20 blur-[80px] rounded-full pointer-events-none z-0"></div>
                <div className="w-full relative z-10 flex justify-between items-start mb-4">
                  <div className="bg-blue-900/50 border border-blue-400 px-3 py-1.5 rounded-lg text-blue-300 font-bold text-[12px] flex items-center gap-1.5"><Monitor size={14}/> โหมดเวรปฏิบัติการ</div>
                  <div className="bg-slate-800 border border-slate-600 px-3 py-1.5 rounded-lg text-slate-300 font-mono font-bold text-[12px]">เวลาครบกำหนด: 8 ชม.</div>
                </div>
                <div className="relative z-10 w-20 h-20 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center mb-3 border-[2px] border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.6)]"><ShieldCheck size={40} /></div>
                <h2 className="relative z-10 text-[22px] md:text-[26px] font-black text-blue-400 mb-1 uppercase">{currentUserName || 'คุณ'}</h2>
                <h3 className="relative z-10 text-[16px] font-bold text-slate-300 mb-6">เจ้าหน้าที่เวร SSC ประจำวันนี้</h3>
                {!sscShiftStart ? (
                  <>
                    <div className="relative z-10 bg-slate-800/80 border border-dashed border-slate-600 rounded-xl p-4 w-full mb-6 text-left shadow-inner">
                      <p className="text-rose-400 text-[13px] font-bold mb-1 flex items-center gap-1.5"><AlertCircle size={14}/> คำเตือนการเข้าเวร</p>
                      <p className="text-slate-300 text-[13px]">ท่านสามารถเข้าเวรเวลาใดก็ได้ แต่ต้อง <span className="text-blue-400 font-black">ไม่เกิน 11:00 น.</span> เพื่อ Standby การประสานงานกับสวีเดน</p>
                    </div>
                    <button onClick={handleStartSSCShift} className="relative z-10 w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-black rounded-xl text-[18px] shadow-[0_0_20px_rgba(59,130,246,0.6)] border border-blue-300 active:scale-95 transition-all">เริ่มเข้าเวรปฏิบัติการ (Start Shift)</button>
                  </>
                ) : (
                  <div className="relative z-10 w-full flex flex-col gap-4">
                    {(() => {
                      const elapsedMs = sysTime.getTime() - sscShiftStart.getTime();
                      const totalMs = 8 * 3600 * 1000;
                      let progressPct = (elapsedMs / totalMs) * 100;
                      if (progressPct > 100) progressPct = 100;
                      const remainMs = totalMs - elapsedMs;
                      const h = Math.floor(Math.abs(remainMs) / 3600000);
                      const m = Math.floor((Math.abs(remainMs) % 3600000) / 60000);
                      const s = Math.floor((Math.abs(remainMs) % 60000) / 1000);
                      const isDone = progressPct >= 100;
                      return (
                        <>
                          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-700 w-full">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-slate-400 font-bold text-[13px]">เวลาปฏิบัติการ (8 ชม.)</span>
                              <span className={`font-mono font-black text-[16px] ${isDone ? 'text-emerald-400' : 'text-blue-400 animate-pulse'}`}>{isDone ? 'ครบกำหนด' : `เหลือ ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`}</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden border border-slate-700 shadow-inner">
                              <div className={`h-full transition-all duration-1000 rounded-full relative overflow-hidden ${isDone ? 'bg-emerald-500' : 'bg-gradient-to-r from-blue-600 to-cyan-400'}`} style={{ width: `${progressPct}%` }}></div>
                            </div>
                          </div>
                          <button onClick={() => handleEndSSCShift(progressPct)} className={`w-full py-4 font-black rounded-xl text-[18px] transition-all border border-white/20 shadow-lg ${isDone ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]' : 'bg-orange-600 hover:bg-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.5)]'}`}>{isDone ? '✅ ออกเวร (ครบ 8 ชั่วโมง)' : '⚠️ ขอออกเวรก่อนกำหนด'}</button>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>
            )
          )}

          {/* 🌟 กล่องแจ้งลางาน/เข้าสาย/ออกก่อน */}
          {!isSSCToday && (
            <div className="relative overflow-hidden bg-slate-900/80 backdrop-blur-xl border-[2px] border-slate-600/50 p-6 rounded-[1.5rem] shadow-[0_0_30px_rgba(0,0,0,0.3)] flex flex-col animate-in fade-in">
              <div className="flex flex-wrap bg-slate-800 rounded-xl p-1 mb-5 border border-slate-700 relative z-10 gap-1">
                 <button onClick={() => setActionType('late')} className={`flex-1 min-w-[80px] py-2.5 rounded-lg font-black text-[13px] md:text-[14px] transition-all ${actionType === 'late' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}>🟠 เข้าสาย</button>
                 <button onClick={() => setActionType('early')} className={`flex-1 min-w-[80px] py-2.5 rounded-lg font-black text-[13px] md:text-[14px] transition-all ${actionType === 'early' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}>🔴 ออกก่อน</button>
                 <button onClick={() => setActionType('leave')} className={`w-full mt-1 py-2.5 rounded-lg font-black text-[13px] md:text-[14px] transition-all ${actionType === 'leave' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-900/50 text-slate-400 hover:text-slate-200'}`}>🔵 แจ้งลางาน / ไปปฏิบัติราชการ</button>
              </div>

              <div className="relative z-10 space-y-4 flex-1 animate-in fade-in">
                {actionType === 'leave' ? (
                  <>
                    <div className="flex flex-col gap-2">
                      <label className="block text-[14px] font-bold text-slate-300">ประเภทการลา <span className="text-rose-500">*</span></label>
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => setLeaveType('sick')} className={`py-2 rounded-lg text-[13px] font-bold border transition-all ${leaveType === 'sick' ? 'bg-blue-500/20 border-blue-400 text-blue-300' : 'bg-slate-800 border-slate-600 text-slate-400'}`}>🤒 ลาป่วย</button>
                        <button onClick={() => setLeaveType('personal')} className={`py-2 rounded-lg text-[13px] font-bold border transition-all ${leaveType === 'personal' ? 'bg-blue-500/20 border-blue-400 text-blue-300' : 'bg-slate-800 border-slate-600 text-slate-400'}`}>💼 ลากิจ</button>
                        <button onClick={() => setLeaveType('vacation')} className={`py-2 rounded-lg text-[13px] font-bold border transition-all ${leaveType === 'vacation' ? 'bg-blue-500/20 border-blue-400 text-blue-300' : 'bg-slate-800 border-slate-600 text-slate-400'}`}>🏖️ ลาพักผ่อน</button>
                        <button onClick={() => setLeaveType('offsite')} className={`py-2 rounded-lg text-[13px] font-bold border transition-all ${leaveType === 'offsite' ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-slate-800 border-slate-600 text-slate-400'}`}>✈️ ไปราชการ/สัมมนา</button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[12px] font-bold text-slate-400 mb-1">ตั้งแต่วันที่ <span className="text-rose-500">*</span></label>
                        <div 
                          onClick={() => { setCalendarTarget('start'); setCalMonth(leaveStartDate ? new Date(leaveStartDate).getMonth() : sysTime.getMonth()); setCalYear(leaveStartDate ? new Date(leaveStartDate).getFullYear() : sysTime.getFullYear()); }} 
                          className="w-full bg-slate-800/80 border-[2px] border-slate-600 rounded-xl px-3 py-2.5 text-white font-bold text-[14px] flex justify-between items-center cursor-pointer hover:border-blue-400 shadow-inner"
                        >
                          <span className={leaveStartDate ? "text-white font-mono" : "text-slate-400"}>
                            {leaveStartDate ? (() => {
                              const d = new Date(leaveStartDate);
                              const thMonthsShort = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
                              return `${d.getDate()} ${thMonthsShort[d.getMonth()]} ${d.getFullYear() + 543}`;
                            })() : '-- เลือกวัน --'}
                          </span>
                          <Calendar size={16} className="text-blue-400" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[12px] font-bold text-slate-400 mb-1">ถึงวันที่ <span className="text-rose-500">*</span></label>
                        <div 
                          onClick={() => { setCalendarTarget('end'); setCalMonth(leaveEndDate ? new Date(leaveEndDate).getMonth() : sysTime.getMonth()); setCalYear(leaveEndDate ? new Date(leaveEndDate).getFullYear() : sysTime.getFullYear()); }} 
                          className="w-full bg-slate-800/80 border-[2px] border-slate-600 rounded-xl px-3 py-2.5 text-white font-bold text-[14px] flex justify-between items-center cursor-pointer hover:border-blue-400 shadow-inner"
                        >
                          <span className={leaveEndDate ? "text-white font-mono" : "text-slate-400"}>
                            {leaveEndDate ? (() => {
                              const d = new Date(leaveEndDate);
                              const thMonthsShort = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
                              return `${d.getDate()} ${thMonthsShort[d.getMonth()]} ${d.getFullYear() + 543}`;
                            })() : '-- เลือกวัน --'}
                          </span>
                          <Calendar size={16} className="text-blue-400" />
                        </div>
                      </div>
                    </div>

                    {leaveStartDate && leaveEndDate && (
                      <div className="mt-3 bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 flex items-center justify-between shadow-inner animate-in fade-in">
                        <span className="text-slate-300 text-[13px] font-bold flex items-center gap-1.5"><Calendar size={14} className="text-blue-400"/> สรุปจำนวนวันลา:</span>
                        {(() => {
                          const start = new Date(leaveStartDate);
                          const end = new Date(leaveEndDate);
                          const diffTime = end.getTime() - start.getTime();
                          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                          if (diffDays > 0) return <span className="text-blue-400 font-black text-[16px] drop-shadow-md">{diffDays} วัน</span>;
                          else return <span className="text-rose-400 font-black text-[13px]">⚠️ ระบุวันที่ไม่ถูกต้อง</span>;
                        })()}
                      </div>
                    )}
                  </>
                ) : (
                  <div>
                    <label className="block text-[14px] font-bold text-slate-300 mb-1">
                      {actionType === 'late' ? 'เวลาที่คาดว่าจะถึง (ETA)' : 'เวลาที่ต้องการออก (Departure Time)'} <span className="text-rose-500">*</span>
                    </label>
                    <div onClick={() => setShowTimePicker(true)} className="w-full bg-slate-800/80 border-[2px] border-slate-600 rounded-xl px-4 py-3 text-white font-mono text-[18px] flex justify-between items-center cursor-pointer hover:border-orange-500 transition-all shadow-inner">
                      <span className={lateEta ? "text-white font-bold drop-shadow-md" : "text-slate-400"}>{lateEta ? `${lateEta} น.` : '-- เลือกเวลา --'}</span>
                      <ChevronDown size={20} className={actionType === 'late' ? "text-orange-400" : "text-rose-400"} />
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-[14px] font-bold text-slate-300 mb-1">เหตุผล <span className="text-rose-500">*</span></label>
                  <textarea rows="2" placeholder="ระบุเหตุผลแบบกระชับ..." value={lateReason} onChange={(e) => setLateReason(e.target.value)} className="w-full bg-slate-800/80 border-[2px] border-slate-600 rounded-xl px-4 py-3 text-white focus:border-cyan-400 outline-none resize-none text-[14px] shadow-inner"></textarea>
                </div>

                <div className="space-y-4 pt-3 mt-3 border-t-[2px] border-dashed border-slate-600/50">
                  <div className="flex justify-between items-center ml-1 mb-2">
                    <label className="text-[14px] font-black text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                      <Camera className="w-4 h-4" /> ภาพ/วิดีโอหลักฐาน <span className="text-slate-500 font-normal text-[11px]">(ถ้ามี)</span>
                    </label>
                    <div className="flex gap-1.5">
                      <div className="bg-orange-950 border border-orange-500/80 text-orange-400 text-[10px] font-black px-2 py-0.5 rounded-md shadow-[0_0_10px_rgba(249,115,22,0.8)]">รูป {evidenceFiles.filter(f => f.type === 'image').length}/6</div>
                      <div className="bg-purple-950 border border-purple-500/80 text-purple-400 text-[10px] font-black px-2 py-0.5 rounded-md shadow-[0_0_10px_rgba(168,85,247,0.8)]">คลิป {evidenceFiles.filter(f => f.type === 'video').length}/1</div>
                    </div>
                  </div>

                  {evidenceFiles.length > 0 && (
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mb-2">
                      {evidenceFiles.map((file, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border-[2px] border-cyan-500/60 shadow-[0_0_10px_rgba(6,182,212,0.3)] group cursor-pointer" onClick={() => setLightboxImg?.(file.url)}>
                          {file.type === 'video' ? (
                            <div className="w-full h-full flex items-center justify-center bg-slate-950 text-purple-400"><Video size={24}/></div>
                          ) : (
                            <img src={file.url} alt="Evidence" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          )}
                          <button type="button" onClick={(e) => { e.stopPropagation(); removeFile(idx); }} className="absolute top-1 right-1 bg-rose-500/90 backdrop-blur-sm text-white p-1 rounded-full shadow-lg transition-all active:scale-75 hover:bg-rose-600 border border-rose-400 z-10"><X size={10} className="stroke-[3px]" /></button>
                        </div>
                      ))}
                    </div>
                  )}

                  {(evidenceFiles.filter(f => f.type === 'image').length < 6 || evidenceFiles.filter(f => f.type === 'video').length < 1) && (
                    <button type="button" onClick={() => setShowImagePicker(true)} className="w-full h-20 border-[2px] border-dashed border-slate-500 bg-slate-800/40 hover:bg-cyan-900/30 hover:border-cyan-400 rounded-xl flex flex-col items-center justify-center transition-all duration-300 cursor-pointer shadow-[inset_0_0_15px_rgba(0,0,0,0.2)] hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] group">
                      <div className="flex items-center gap-2 mb-0.5 transition-all">
                        <Camera size={22} className="text-slate-500 group-hover:text-cyan-400 transition-all drop-shadow-md" />
                        <span className="text-slate-600 group-hover:text-white text-[18px] font-light font-mono mx-1 transition-colors">/</span>
                        <Video size={22} className="text-slate-500 group-hover:text-purple-400 transition-all drop-shadow-md" />
                      </div>
                      <span className="font-bold tracking-widest text-slate-500 group-hover:text-cyan-300 text-[11px] md:text-[13px]">คลิกแนบรูป/วิดีโอ (คลิปยาวไม่เกิน 8 วิ)</span>
                    </button>
                  )}
                </div>

              </div>
              
              <button onClick={handleSubmitNotice} className={`relative z-10 w-full mt-5 py-3.5 font-black rounded-xl text-[16px] md:text-[18px] transition-all duration-300 border shadow-lg ${
                (actionType === 'leave' && leaveStartDate && leaveEndDate && lateReason) || (actionType !== 'leave' && lateEta && lateReason)
                  ? (actionType === 'late' ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-300 shadow-orange-500/40 hover:shadow-orange-500/60' 
                    : actionType === 'early' ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white border-rose-300 shadow-rose-500/40 hover:shadow-rose-500/60'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-blue-300 shadow-blue-500/40 hover:shadow-blue-500/60') 
                  : 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
              }`}>
                {actionType === 'leave' ? 'ส่งคำขออนุมัติลางาน/ไปราชการ' : `ส่งแจ้งเตือน${actionType === 'late' ? 'เข้าสาย' : 'ขอออกก่อน'}`}
              </button>
            </div>
          )}
        </div>
      )}

      {/* 🌟 หน้า Live ส่วนของ Commander */}
      {activeSubTab === 'live' && currentUserRole === 'Commander' && (
        <div className="bg-slate-800/60 border-2 border-cyan-500/50 p-4 md:p-6 rounded-[1.5rem] shadow-[0_0_20px_rgba(6,182,212,0.15)]">
          <h3 className="text-[20px] md:text-[24px] font-black text-cyan-400 mb-4 md:mb-6 flex items-center gap-2">
            <Activity size={24} className="animate-pulse" /> สถานะทีมวันนี้
          </h3>
          <div className="space-y-3">
            {mockTeamStatus.map(staff => (
              <div key={staff.id} className="bg-slate-900 border border-slate-700 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center shrink-0 shadow-inner ${staff.id === 0 ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400' : staff.status === 'online' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : staff.status === 'late' ? 'bg-orange-500/20 border-orange-500 text-orange-400' : staff.status === 'outsite' ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse'}`}>
                    {staff.status === 'online' ? <UserCheck size={20} /> : staff.status === 'outsite' ? <MapPin size={20} /> : <UserX size={20} />}
                  </div>
                  <div>
                    <h4 className="font-black text-white text-[16px] md:text-[18px]">{staff.name}</h4>
                    <p className={`text-[13px] md:text-[14px] font-bold ${staff.status === 'offline' ? 'text-rose-400' : 'text-slate-400'}`}>{staff.note}</p>
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

      {/* 🌟 หน้า Report สรุปรายเดือน พร้อม Projector Mode */}
      {activeSubTab === 'report' && currentUserRole === 'Commander' && (
        <div className="bg-[#0f172a] border-[3px] border-purple-500 p-4 md:p-8 rounded-[1.5rem] shadow-[0_0_30px_rgba(168,85,247,0.3)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-60 h-60 bg-purple-500/10 blur-[50px] rounded-full pointer-events-none"></div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-purple-500/30 pb-4 relative z-10 gap-3">
            <div>
              <h3 className="text-[20px] md:text-[28px] font-black text-white flex items-center gap-3"><ShieldCheck size={32} className="text-purple-400" /> สถิติบุคลากรประจำเดือน</h3>
              <p className="text-purple-300 text-[14px] font-bold mt-1 tracking-widest uppercase">ระบบรายงานวิเคราะห์ประเมินผลประสิทธิภาพรายบุคคล</p>
            </div>
            <button onClick={() => setProjectorMode(!projectorMode)} className={`px-4 py-2.5 rounded-xl text-[14px] font-black flex items-center gap-2 border-[2px] transition-all active:scale-95 ${projectorMode ? 'bg-purple-600 text-white border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'bg-slate-900 text-purple-400 border-purple-500/50 hover:bg-slate-800'}`}>
              <EyeOff size={18}/> {projectorMode ? 'เปิดโหมดปกติ (แสดงชื่อ)' : 'เปิดโหมด Projector (ซ่อนชื่อ)'}
            </button>
          </div>

          <div className="overflow-x-auto relative z-10">
            <table className="w-full text-left border-collapse">
              <thead><tr className="bg-slate-800 text-slate-300 uppercase text-[12px] md:text-[14px] tracking-widest"><th className="p-4 rounded-tl-xl border-b border-slate-700">รายชื่อบุคลากร</th><th className="p-4 border-b border-slate-700 text-center">เข้าสาย (นาที)</th><th className="p-4 border-b border-slate-700 text-center">จำนวนวันสาย</th><th className="p-4 rounded-tr-xl border-b border-slate-700 text-center">จำนวนวันลากิจ/ป่วย</th></tr></thead>
              <tbody className="text-white font-bold text-[14px] md:text-[16px]">{mockBlindReport.map((rep, idx) => (
                  <tr key={idx} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-mono text-cyan-300">{projectorMode ? `เจ้าหน้าที่เวร ${String.fromCharCode(65 + idx)}` : rep.id}</td>
                    <td className="p-4 text-center"><span className={`px-3 py-1 rounded-md ${rep.totalLateMins > 0 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50' : 'text-slate-500'}`}>{rep.totalLateMins > 0 ? rep.totalLateMins : '-'}</span></td>
                    <td className="p-4 text-center text-slate-300">{rep.lateDays > 0 ? rep.lateDays : '-'}</td>
                    <td className="p-4 text-center text-slate-300">{rep.leaveDays > 0 ? rep.leaveDays : '-'}</td>
                  </tr>
                ))}</tbody>
            </table>
          </div>
        </div>
      )}


      {/* 🌟 Custom Alert Modal */}
      {alertConfig.show && typeof document !== 'undefined' ? createPortal(
        <div className="fixed inset-0 z-[999999] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in" onClick={closeAlert}>
          <div className={`bg-slate-800 border-2 rounded-3xl p-6 md:p-8 max-w-md w-full transform transition-all ${alertConfig.type === 'error' ? 'border-rose-500 shadow-[0_0_40px_rgba(225,29,72,0.4)]' : alertConfig.type === 'success' ? 'border-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.4)]' : 'border-cyan-500 shadow-[0_0_40px_rgba(6,182,212,0.4)]'}`} onClick={e => e.stopPropagation()}>
            <div className="flex flex-col items-center text-center gap-4">
              <div className={`p-4 rounded-full border-2 bg-slate-900 ${alertConfig.type === 'error' ? 'border-rose-500 text-rose-500 shadow-[0_0_20px_rgba(225,29,72,0.5)]' : alertConfig.type === 'success' ? 'border-emerald-500 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]' : 'border-cyan-500 text-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.5)]'}`}>
                {alertConfig.type === 'error' && <AlertCircle size={48} className="animate-pulse" />}
                {alertConfig.type === 'success' && <ShieldCheck size={48} />}
                {alertConfig.type === 'info' && <MapPin size={48} className="animate-bounce" />}
              </div>
              <h3 className={`text-[20px] font-black mb-1 ${alertConfig.type === 'error' ? 'text-rose-400' : alertConfig.type === 'success' ? 'text-emerald-400' : 'text-cyan-400'}`}>{alertConfig.type === 'error' ? 'ข้อความแจ้งเตือน' : alertConfig.type === 'success' ? 'ดำเนินการสำเร็จ' : 'ระบบกำลังทำงาน'}</h3>
              <p className="text-white text-[15px] md:text-[16px] font-bold whitespace-pre-line leading-relaxed text-slate-300">{alertConfig.message}</p>
              <button onClick={closeAlert} className={`mt-6 w-full py-3 md:py-4 font-black rounded-xl text-white text-[18px] transition-all active:scale-95 shadow-lg ${alertConfig.type === 'error' ? 'bg-rose-500 hover:bg-rose-600' : alertConfig.type === 'success' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-cyan-500 hover:bg-cyan-600'}`}>รับทราบ / ตกลง</button>
            </div>
          </div>
        </div>, document.body
      ) : null}

      {/* 🌟 Custom Time Picker Modal */}
      {showTimePicker && typeof document !== 'undefined' ? createPortal(
        <div className="fixed inset-0 z-[9999999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setShowTimePicker(false)}>
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full blur-[100px] pointer-events-none z-0 ${actionType === 'early' ? 'bg-rose-500/10' : 'bg-orange-500/10'}`}></div>
          <div className={`bg-[#0f172a] border-[2px] border-solid rounded-[2rem] p-6 w-full max-w-sm relative flex flex-col animate-in zoom-in-95 duration-200 ${actionType === 'early' ? 'border-rose-500 shadow-[0_0_40px_rgba(244,63,94,0.4),inset_0_0_15px_rgba(244,63,94,0.1)]' : 'border-orange-500 shadow-[0_0_40px_rgba(249,115,22,0.4),inset_0_0_15px_rgba(249,115,22,0.1)]'}`} onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className={`text-[18px] md:text-[20px] font-black flex items-center gap-2 ${actionType === 'early' ? 'text-rose-400' : 'text-orange-400'}`}>
                <Clock size={24} className="animate-pulse" /> ระบุเวลา (ETA)
              </h3>
              <button onClick={() => setShowTimePicker(false)} className="text-slate-400 hover:text-white bg-slate-800/50 border border-slate-700 p-2 rounded-xl transition-all active:scale-95 hover:bg-slate-700">
                <X size={20} />
              </button>
            </div>
            
            <div className="w-full max-h-[50vh] overflow-y-auto space-y-2.5 mb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {timeOptions.map(time => {
                const isSelected = lateEta === time;
                return (
                  <button 
                    key={time} 
                    onClick={() => { setLateEta(time); setShowTimePicker(false); }} 
                    className={`w-full py-3.5 rounded-xl font-mono text-[16px] md:text-[18px] font-bold transition-all active:scale-95 border ${
                      isSelected 
                        ? (actionType === 'early' ? 'bg-rose-500 text-white border-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.6)]' : 'bg-orange-500 text-white border-orange-300 shadow-[0_0_15px_rgba(249,115,22,0.6)]') 
                        : `bg-slate-800/40 border-slate-700/80 text-slate-300 hover:bg-slate-700 ${actionType === 'early' ? 'hover:border-rose-400/50 hover:text-rose-300' : 'hover:border-orange-400/50 hover:text-orange-300'}`
                    }`}
                  >
                    {time} น.
                  </button>
                );
              })}
            </div>

            <button type="button" onClick={() => setShowTimePicker(false)} className={`w-full py-3.5 border-[2px] border-solid bg-transparent rounded-2xl font-black text-[16px] tracking-widest transition-all active:scale-95 shadow-sm ${actionType === 'early' ? 'border-rose-500/80 text-rose-400 hover:bg-rose-600 hover:text-white' : 'border-orange-500/80 text-orange-400 hover:bg-orange-600 hover:text-white'}`}>
              ยกเลิก
            </button>
          </div>
        </div>, document.body
      ) : null}

      {/* 🌟 Modal แจ้งขอออกเวรก่อนกำหนด */}
      {showEarlyLeaveModal && typeof document !== 'undefined' ? createPortal(
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowEarlyLeaveModal(false)}>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-rose-600/20 blur-[80px] rounded-full pointer-events-none z-0"></div>
           <div className="relative z-10 bg-slate-900/95 border-[2px] border-rose-500 rounded-[1.5rem] p-6 w-full max-w-lg shadow-[0_0_50px_rgba(244,63,94,0.4)] flex flex-col animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
             <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
                <h3 className="text-[18px] md:text-[20px] font-black text-rose-400 flex items-center gap-2">
                  <AlertCircle size={24} /> ฟอร์มแจ้งขอออกเวรก่อนกำหนด
                </h3>
                <button onClick={() => setShowEarlyLeaveModal(false)} className="text-slate-400 hover:text-white bg-slate-800 p-2 rounded-full transition-all active:scale-95"><X size={20} /></button>
             </div>

             <div className="space-y-4">
                <div>
                  <label className="block text-[14px] font-bold text-slate-300 mb-1">เวลาที่ต้องการออก (Departure Time) <span className="text-rose-500">*</span></label>
                  <div onClick={() => setShowTimePicker(true)} className="w-full bg-slate-800/80 border-[2px] border-slate-600 rounded-xl px-4 py-3 text-white font-mono text-[18px] flex justify-between items-center cursor-pointer hover:border-rose-500 transition-all shadow-inner">
                    <span className={lateEta ? "text-white font-bold" : "text-slate-400"}>{lateEta ? `${lateEta} น.` : '-- เลือกเวลา --'}</span>
                    <ChevronDown size={20} className="text-rose-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-[14px] font-bold text-slate-300 mb-1">เหตุผล <span className="text-rose-500">*</span></label>
                  <textarea rows="3" placeholder="ระบุเหตุผลแบบกระชับ..." value={lateReason} onChange={(e) => setLateReason(e.target.value)} className="w-full bg-slate-800/80 border-[2px] border-slate-600 rounded-xl px-4 py-3 text-white focus:border-rose-400 outline-none resize-none text-[14px] shadow-inner"></textarea>
                </div>
                
                <div className="pt-2 border-t border-dashed border-slate-600/50 mt-4">
                  <div className="flex justify-between items-center mb-3 mt-3">
                    <label className="text-[14px] font-black text-slate-300 uppercase tracking-wide flex items-center gap-1.5"><Camera size={16}/> ภาพหลักฐาน <span className="text-slate-500 font-normal text-[11px]">(ถ้ามี)</span></label>
                  </div>
                  
                  {evidenceFiles.length > 0 && (
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mb-3">
                      {evidenceFiles.map((file, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border-[2px] border-rose-500/60 shadow-[0_0_10px_rgba(244,63,94,0.3)] group cursor-pointer" onClick={() => setLightboxImg?.(file.url)}>
                          {file.type === 'video' ? <div className="w-full h-full flex items-center justify-center bg-slate-950 text-purple-400"><Video size={24}/></div> : <img src={file.url} alt="Evidence" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />}
                          <button type="button" onClick={(e) => { e.stopPropagation(); removeFile(idx); }} className="absolute top-1 right-1 bg-rose-500/90 backdrop-blur-sm text-white p-1 rounded-full shadow-lg transition-all active:scale-75 hover:bg-rose-600 border border-white/50 z-10"><X size={10} className="stroke-[3px]" /></button>
                        </div>
                      ))}
                    </div>
                  )}

                  {(evidenceFiles.filter(f => f.type === 'image').length < 6 || evidenceFiles.filter(f => f.type === 'video').length < 1) && (
                    <button type="button" onClick={() => setShowImagePicker(true)} className="w-full h-16 border-[2px] border-dashed border-slate-500 bg-slate-800/40 hover:bg-rose-900/30 hover:border-rose-400 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 cursor-pointer shadow-inner">
                      <Camera size={20} className="text-slate-500" />
                      <span className="font-bold tracking-widest text-slate-400 text-[13px]">คลิกแนบรูป/วิดีโอหลักฐาน</span>
                    </button>
                  )}
                </div>

                <button onClick={handleSubmitNotice} className={`w-full mt-6 py-4 font-black rounded-xl text-[18px] transition-all duration-300 border shadow-lg ${lateEta && lateReason ? 'bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white border-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.5)]' : 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'}`}>
                  ยืนยันส่งแจ้งเตือนขอออกก่อน
                </button>
             </div>
           </div>
        </div>, document.body
      ) : null}

      {/* 🌟 Date Picker Modal 🌟 */}
      {calendarTarget && typeof document !== 'undefined' ? createPortal(
        <div className="fixed inset-0 z-[9999999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setCalendarTarget(null)}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
          
          <div className="bg-[#0f172a] border-[2px] border-solid border-cyan-400 rounded-[2rem] p-6 w-full max-w-sm shadow-[0_0_40px_rgba(34,211,238,0.4),inset_0_0_15px_rgba(34,211,238,0.1)] relative flex flex-col items-center animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            
            <div className="w-full flex justify-between items-center mb-6">
              <button 
                type="button"
                onClick={() => {
                  if (calMonth === 0) { setCalMonth(11); setCalYear(prev => prev - 1); } 
                  else { setCalMonth(prev => prev - 1); }
                }}
                className="w-10 h-10 border border-slate-700 rounded-xl bg-slate-800/50 flex items-center justify-center text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition-all active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              
              <div className="text-center flex flex-col">
                <span className="text-slate-400 font-bold text-[11px] tracking-widest uppercase mb-0.5">เลือกวันที่</span>
                <span className="text-cyan-400 font-black text-[18px] tracking-wide drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
                  {(() => {
                    const thMonths = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
                    return `${thMonths[calMonth]} ${calYear + 543}`;
                  })()}
                </span>
              </div>
              
              <button 
                type="button"
                onClick={() => {
                  if (calMonth === 11) { setCalMonth(0); setCalYear(prev => prev + 1); } 
                  else { setCalMonth(prev => prev + 1); }
                }}
                className="w-10 h-10 border border-slate-700 rounded-xl bg-slate-800/50 flex items-center justify-center text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition-all active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2 w-full text-center mb-3 text-[13px] font-black tracking-wide">
              <div className="text-rose-400">อา</div>
              <div className="text-slate-400">จ</div>
              <div className="text-slate-400">อ</div>
              <div className="text-slate-400">พ</div>
              <div className="text-slate-400">พฤ</div>
              <div className="text-slate-400">ศ</div>
              <div className="text-sky-400">ส</div>
            </div>

            <div className="grid grid-cols-7 gap-2 w-full text-center mb-6">
              {(() => {
                const firstDayIndex = new Date(calYear, calMonth, 1).getDay();
                const totalDays = new Date(calYear, calMonth + 1, 0).getDate();
                const cells = [];
                
                for (let i = 0; i < firstDayIndex; i++) {
                  cells.push(<div key={`blank-${i}`} className="w-10 h-10"></div>);
                }
                
                for (let day = 1; day <= totalDays; day++) {
                  const currentString = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const isSelected = calendarTarget === 'start' ? leaveStartDate === currentString : leaveEndDate === currentString;
                  const dayOfWeekIndex = (firstDayIndex + day - 1) % 7;
                  
                  let textColor = 'text-white';
                  if (dayOfWeekIndex === 0) textColor = 'text-rose-400';
                  if (dayOfWeekIndex === 6) textColor = 'text-sky-400';

                  const isTodayCell = sysTime.getFullYear() === calYear && sysTime.getMonth() === calMonth && sysTime.getDate() === day;

                  cells.push(
                    <button
                      key={`day-${day}`}
                      type="button"
                      onClick={() => {
                        if (calendarTarget === 'start') setLeaveStartDate(currentString);
                        else setLeaveEndDate(currentString);
                        setCalendarTarget(null);
                      }}
                      className={`w-10 h-10 mx-auto rounded-full font-mono font-bold text-[15px] flex items-center justify-center transition-all active:scale-95 border ${
                        isSelected 
                          ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.8)] scale-110' 
                          : isTodayCell 
                            ? `bg-orange-500/20 border-orange-500/60 ${textColor} shadow-[0_0_10px_rgba(249,115,22,0.4)]`
                            : `bg-slate-800/40 border-slate-700/80 ${textColor} hover:bg-slate-700 hover:border-cyan-400/50`
                      }`}
                    >
                      {day}
                    </button>
                  );
                }
                return cells;
              })()}
            </div>

            <button
              type="button"
              onClick={() => setCalendarTarget(null)}
              className="w-full py-3.5 border-[2px] border-solid border-cyan-500/80 text-cyan-400 bg-transparent rounded-2xl hover:bg-cyan-600 hover:text-white font-black text-[16px] tracking-widest transition-all active:scale-95 shadow-sm"
            >
              ยกเลิก
            </button>

          </div>
        </div>, document.body
      ) : null}

      {/* 🌟 แยกโหมด PC และ Mobile สำหรับป๊อบอัพเลือกรูปภาพ 🌟 */}
      {showImagePicker && typeof document !== 'undefined' ? createPortal(
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-800/80 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowImagePicker(false)}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-cyan-600/30 rounded-full blur-[100px] animate-pulse pointer-events-none z-0"></div>
          <div className="relative z-10 bg-slate-900/90 backdrop-blur-sm border-[3px] border-solid border-cyan-500 rounded-[1.5rem] p-6 w-full max-w-sm shadow-[0_0_60px_rgba(6,182,212,0.5)] text-center animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-black text-cyan-100 mb-6 tracking-widest flex items-center justify-center gap-2 drop-shadow-[0_0_10px_rgba(6,182,212,1)]"><Monitor size={22} className="text-cyan-400" /> เลือกรูปภาพ/วิดีโอ</h3>
            
            {/* 📱 โหมดมือถือ (Mobile View) */}
            <div className="flex md:hidden flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => { document.getElementById('camera-img-leave').click(); setShowImagePicker(false); }} className="bg-gradient-to-b from-blue-500 to-blue-700 p-4 rounded-[1rem] flex flex-col items-center justify-center gap-2 border-[2px] border-white/60 shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-transform active:scale-95">
                  <Camera className="text-white w-8 h-8 drop-shadow-md" /> <span className="font-black text-white text-[14px] drop-shadow-md">ถ่ายรูป</span>
                </button>
                <button onClick={() => { document.getElementById('camera-vid-leave').click(); setShowImagePicker(false); }} className="bg-gradient-to-b from-purple-500 to-purple-700 p-4 rounded-[1rem] flex flex-col items-center justify-center gap-2 border-[2px] border-white/60 shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-transform active:scale-95">
                  <Video className="text-white w-8 h-8 drop-shadow-md" /> <span className="font-black text-white text-[14px] drop-shadow-md">ถ่ายวิดีโอ</span>
                </button>
              </div>
              <button onClick={() => { document.getElementById('gallery-input-leave').click(); setShowImagePicker(false); }} className="w-full bg-gradient-to-b from-emerald-500 to-emerald-700 p-4 rounded-[1rem] flex items-center justify-center gap-3 border-[2px] border-white/60 shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-transform active:scale-95 mt-1">
                <Monitor className="text-white w-6 h-6 drop-shadow-md" /> <span className="font-black text-white text-[16px] drop-shadow-md">เลือกคลังภาพ/วิดีโอ</span>
              </button>
            </div>

            {/* 💻 โหมดคอมพิวเตอร์ (PC View) */}
            <div className="hidden md:flex flex-col gap-4">
              <button onClick={() => { document.getElementById('gallery-input-leave').click(); setShowImagePicker(false); }} className="flex flex-col items-center justify-center bg-gradient-to-b from-emerald-500 to-emerald-700 p-8 rounded-xl border-[2px] border-white/60 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-105 group transition-all">
                <div className="flex gap-4 mb-3"><Camera size={40} className="text-white drop-shadow-md group-hover:scale-110 transition-all" /><Video size={40} className="text-white drop-shadow-md group-hover:scale-110 transition-all" /></div>
                <span className="text-white font-black text-lg drop-shadow-lg group-hover:scale-105 transition-all">เลือกรูปภาพ/วิดีโอ</span>
                <span className="text-emerald-100 text-sm mt-1 font-bold group-hover:text-white">คลิกเพื่ออัปโหลดจากคอมพิวเตอร์</span>
              </button>
              <button type="button" onClick={handleClipboardPaste} className="flex items-center justify-center gap-3 bg-slate-900 border-[2px] border-cyan-500/60 p-4 rounded-xl cursor-pointer transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:bg-slate-800 hover:border-cyan-400 hover:scale-[1.02] active:scale-95 group">
                <ClipboardList className="text-cyan-400 w-6 h-6 drop-shadow-md group-hover:scale-110 group-hover:text-cyan-300 transition-all" />
                <div className="flex flex-col items-start text-left"><span className="text-cyan-400 font-black text-[16px] tracking-wide group-hover:text-cyan-300">แคปหน้าจอเสร็จแล้วกดปุ่มนี้</span><span className="text-slate-400 text-[13px] font-bold mt-0.5">กด Win + Shift + S หรือ PRT SC</span></div>
              </button>
            </div>
            
            <button onClick={() => setShowImagePicker(false)} className="w-full mt-6 py-4 bg-slate-800 text-slate-200 font-bold rounded-xl border-[2px] border-white/40 transition-all duration-300 shadow-[0_0_10px_rgba(244,63,94,0.3)] hover:bg-rose-700 hover:text-white active:scale-95 uppercase tracking-widest">ยกเลิก</button>
          </div>
        </div>, document.body
      ) : null}

      {/* 🌟 Popup ฟอร์มอยู่ดึก/ล่วงเวลา (Overtime Clock Out Modal) */}
      {showOtModal && typeof document !== 'undefined' ? createPortal(
        <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in" onClick={() => setShowOvertimeModal(false)}>
          <div className="bg-[#0f172a] border-[3px] border-orange-500 rounded-[2rem] p-6 w-full max-w-md shadow-[0_0_40px_rgba(249,115,22,0.4)] relative flex flex-col animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5 border-b border-slate-700 pb-3">
              <h3 className="text-orange-400 text-[18px] md:text-[20px] font-black flex items-center gap-2"><AlertCircle className="animate-pulse"/> ชี้แจงการปฏิบัติงานล่าช้า</h3>
              <button onClick={() => setShowOvertimeModal(false)} className="text-slate-400 hover:text-white bg-slate-800 p-2 rounded-full"><X size={20}/></button>
            </div>
            <p className="text-slate-300 text-sm mb-4 font-bold">⚠️ ตรวจพบการลงเวลาออกงานหลังเวลา 17:00 น. กรุณาระบุภารกิจหรือเหตุผลความจำเป็นในการอยู่ปฏิบัติงานล่วงเวลาเพื่อบันทึกลงระบบ:</p>
            <textarea rows="3" required placeholder="ระบุเหตุผล เช่น ตรวจเช็คสัญญาณ THEOS ขัดข้องตอนเย็น, แลกเปลี่ยนบอร์ดดาวเทียมสถานีข่าย..." className="w-full bg-slate-900 border-[2px] border-slate-600 rounded-xl p-3 text-white outline-none focus:border-orange-400 text-sm resize-none" value={otReason} onChange={e => setOvertimeReason(e.target.value)}></textarea>
            <button onClick={() => executeNormalClockOut(otReason)} disabled={!otReason.trim()} className={`w-full mt-5 py-3.5 font-black text-white rounded-xl border shadow-lg transition-all ${otReason.trim() ? 'bg-gradient-to-r from-orange-500 to-amber-500 border-orange-400 shadow-md active:scale-95' : 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'}`}>ยืนยันลงเวลาออกงาน (Clock Out)</button>
          </div>
        </div>, document.body
      ) : null}

      {/* 🌟 กล้องลับ */}
      <input type="file" id="live-snap-checkin" accept="image/*" capture="user" onChange={handleLiveSnapSubmit} className="hidden" />
      <input type="file" id="camera-img-leave" accept="image/*" capture="environment" onChange={handleFileSelect} className="hidden" />
      <input type="file" id="camera-vid-leave" accept="video/*" capture="environment" onChange={handleFileSelect} className="hidden" />
      <input type="file" id="gallery-input-leave" accept="image/*,video/*" multiple onChange={handleFileSelect} className="hidden" />
    </div>
  );
}