import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom'; // 🌟 ฟันธง: พิมพ์เพิ่มบรรทัดนี้เข้าไปครับ!
import {
  Home,
  PlusCircle,
  CheckCircle,
  AlertCircle,
  Wrench,
  MapPin,
  User,
  Camera,
  X,
  Monitor,
  Activity,
  Phone,
  CheckSquare,
  ThumbsUp,
  Search,
  PieChart,
  LayoutDashboard,
  ClipboardCheck,
  Mail,
  AlertTriangle,
  FileText,
  PauseCircle,
  Send,
  Loader2,
  ChevronRight,
  ChevronDown,
  XCircle,
  RotateCcw,
  Hash,
  DoorOpen,
  Building,
  Clock,
  TrendingUp,
  Calendar,
  PhoneCall,
  Flame,
  Settings,
  Star,
  Briefcase, 
  Users, 
  Landmark, 
  Maximize2,
  Save,           // 🌟 ฟันธง: พิมพ์เพิ่มคำนี้!
  ShieldAlert,    // 🌟 ฟันธง: พิมพ์เพิ่มคำนี้!
  CheckCircle2,   // 🌟 ฟันธง: พิมพ์เพิ่มคำนี้!
  ClipboardList,
  Moon,
  ShieldCheck,
  Lock,
  LogOut,
  Eye,
  EyeOff,
} from 'lucide-react';


// ==========================================
// 🔥 1. เชื่อมต่อ Firebase
// ==========================================
import { initializeApp, getApps, getApp } from 'firebase/app';

import { getAuth, signInAnonymously, onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

// 🌟 ฟันธง: คำสั่งฐานข้อมูลครบทุกตัวเหมือนเดิม 100% แค่รวบให้อยู่ในบรรทัดเดียวกันเฉยๆ ครับ
import { getFirestore, collection, addDoc, onSnapshot, doc, updateDoc, query, orderBy, limit, writeBatch, getDocs, where, getDoc } from 'firebase/firestore';

// ✅ เปลี่ยนมาใช้ฐานข้อมูลตัวทดสอบ (UAT Phase 2)
const firebaseConfig = {
  apiKey: "AIzaSyD3440oEO-8MvilWbHd5DUHVnlHSjiH1rk",
  authDomain: "gse-project-phase-2.firebaseapp.com",
  projectId: "gse-project-phase-2",
  storageBucket: "gse-project-phase-2.firebasestorage.app",
  messagingSenderId: "729534573275",
  appId: "1:729534573275:web:ff7c87bce93afc9852bafe",
  measurementId: "G-7XWJ5SHYWC"
};

const appInstance = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(appInstance);
const db = getFirestore(appInstance);

// ==========================================
// 🌟 คลังข้อมูลวันหยุด GISTDA (สมองกลอัตโนมัติ)
// ==========================================
const fixedHolidays = {
  "01-01": "วันขึ้นปีใหม่", "04-06": "วันจักรี", "04-13": "วันสงกรานต์", "04-14": "วันสงกรานต์",
  "04-15": "วันสงกรานต์", "05-04": "วันฉัตรมงคล", "06-03": "วันเฉลิมฯ พระบรมราชินี",
  "07-28": "วันเฉลิมฯ ร.10", "08-12": "วันแม่แห่งชาติ", "10-13": "วันนวมินทรมหาราช",
  "10-23": "วันปิยมหาราช", "12-05": "วันพ่อแห่งชาติ", "12-10": "วันรัฐธรรมนูญ", "12-31": "วันสิ้นปี"
};

const dynamicHolidays = {
  "2026": { 
    "01-02": "วันหยุดพิเศษ", "03-03": "วันมาฆบูชา", "05-13": "วันพืชมงคล",
    "06-01": "ชดเชยวันวิสาขบูชา", "07-29": "วันอาสาฬหบูชา", "07-30": "วันเข้าพรรษา", "12-07": "ชดเชยวันพ่อ"
  }
};

const getHolidayName = (year, month, day) => {
  const mmdd = `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  if (fixedHolidays[mmdd]) return fixedHolidays[mmdd];
  if (dynamicHolidays[year] && dynamicHolidays[year][mmdd]) return dynamicHolidays[year][mmdd];
  return ""; 
};

// ==========================================
// 🌟 Component: จัดการและดูตารางเวร (อัปเกรด UX ขั้นสุด)
// ==========================================
function AdminRosterSettings({ onClose }) {
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState(5); 
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [rosterData, setRosterData] = useState({}); 
  const [loading, setLoading] = useState(false);

  const [isMonthModalOpen, setIsMonthModalOpen] = useState(false);
  const [isYearModalOpen, setIsYearModalOpen] = useState(false);
  const [selectingTechForDate, setSelectingTechForDate] = useState(null);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: null });
  
  // ตัวแปรสลับหน้า: false = หน้าดูสรุปเวร | true = หน้าจัดเวรยาวๆ
  const [isEditMode, setIsEditMode] = useState(false);

  const monthsThai = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
  const yearsList = [2026, 2027, 2028, 2029, 2030 ];

  useEffect(() => {
    generateMonthDays();
    fetchCurrentMonthRoster();
  }, [selectedYear, selectedMonth]);

  const generateMonthDays = () => {
    const numDays = new Date(selectedYear, selectedMonth, 0).getDate();
    const daysArray = [];
    for (let i = 1; i <= numDays; i++) {
      const day = String(i).padStart(2, '0');
      const month = String(selectedMonth).padStart(2, '0');
      const dateStr = `${selectedYear}-${month}-${day}`;
      const dayOfWeek = new Date(selectedYear, selectedMonth - 1, i).getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      const autoHolidayName = getHolidayName(selectedYear, selectedMonth, i);
      const isHoliday = autoHolidayName !== "";

      daysArray.push({ dateStr, dayNum: i, dayOfWeek, isWeekend, isHoliday, holidayName: autoHolidayName });
    }
    setDaysInMonth(daysArray);
  };

  const fetchCurrentMonthRoster = async () => {
    setLoading(true);
    try {
      const monthStr = String(selectedMonth).padStart(2, '0');
      const prefix = `${selectedYear}-${monthStr}`;
      const q = query(collection(db, 'rosters'), where('dateStr', '>=', `${prefix}-01`), where('dateStr', '<=', `${prefix}-31`));
      const snap = await getDocs(q);
      const existingData = {};
      snap.forEach((docSnap) => { existingData[docSnap.id] = docSnap.data(); });
      setRosterData(existingData);
    } catch (err) { console.error("Error: ", err); }
    setLoading(false);
  };

  const handleTechChange = (dateStr, techName) => {
    const [yyyy, mm, dd] = dateStr.split('-');
    const autoHol = getHolidayName(yyyy, mm, dd);
    
    setRosterData(prev => ({
      ...prev,
      [dateStr]: {
        ...(prev[dateStr] || {}),
        dateStr: dateStr, 
        techName: techName,
        holidayName: prev[dateStr]?.holidayName || autoHol,
        isHoliday: prev[dateStr]?.isHoliday || (autoHol !== "")
      }
    }));
  };

  const handleHolidayNameChange = (dateStr, val) => {
    setRosterData(prev => ({
      ...prev,
      [dateStr]: {
        ...(prev[dateStr] || {}),
        dateStr: dateStr, 
        holidayName: val,
        isHoliday: val.trim() !== ""
      }
    }));
  };

  const executeClear = () => {
    setRosterData({});
    setModalConfig({ isOpen: false, type: null });
  };

  const executeSave = async () => {
    setLoading(true);
    try {
      const batch = writeBatch(db);
      
      daysInMonth.forEach(d => {
        const info = rosterData[d.dateStr] || {};
        const autoHol = getHolidayName(selectedYear, selectedMonth, d.dayNum);
        const docRef = doc(db, 'rosters', d.dateStr); 
        
        if ((info.techName && info.techName.trim() !== '') || info.isHoliday || autoHol !== '') {
          batch.set(docRef, {
            dateStr: d.dateStr,
            techName: info.techName || "",
            holidayName: info.holidayName || autoHol, 
            isHoliday: info.isHoliday || (autoHol !== ""),
            updatedAt: new Date().toISOString()
          }, { merge: true });
        } 
        else {
          batch.delete(docRef); 
        }
      });

      await batch.commit(); 
      setModalConfig({ isOpen: false, type: null });
      fetchCurrentMonthRoster(); 
      
      // บันทึกเสร็จให้พากลับหน้าสรุปเวร
      setIsEditMode(false);
      
    } catch (err) {
      alert("เกิดข้อผิดพลาด: " + err.message);
    }
    setLoading(false);
  };

  const getDateBadgeClass = (dayOfWeek, isHoliday, techName) => {
    if (isHoliday) return 'border-orange-500 text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.8)] bg-orange-500/20';
    if (dayOfWeek === 0) return 'border-rose-500 text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.8)] bg-rose-500/20'; 
    if (dayOfWeek === 6) return 'border-sky-500 text-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.8)] bg-sky-500/20'; 
    return 'border-cyan-500/50 text-cyan-400 bg-slate-900/50'; 
  };

  const getSelectColorClass = (dayOfWeek, isHoliday, techName) => {
    if (techName && techName.trim() !== '') {
      if (isHoliday) return 'text-orange-400 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)] bg-orange-900/40';
      return 'text-emerald-400 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)] bg-emerald-900/30';
    }
    if (isHoliday) return 'text-orange-300/50 border-orange-500/40 bg-orange-950/20 hover:border-orange-400';
    if (dayOfWeek === 0) return 'text-rose-300/50 border-rose-500/40 bg-rose-950/20 hover:border-rose-400';
    if (dayOfWeek === 6) return 'text-sky-300/50 border-sky-500/40 bg-sky-950/20 hover:border-sky-400';
    return 'text-cyan-300/50 border-cyan-500/30 bg-slate-900/80 hover:border-cyan-400';
  };

  const activeRecordsCount = Object.values(rosterData).filter(info => (info.techName && info.techName.trim() !== '') || info.isHoliday).length;

  return (
    <div className="min-h-[100dvh] bg-slate-950 text-slate-100 p-3 pb-24 md:p-8 font-sans flex flex-col justify-start md:justify-center relative overflow-y-auto overscroll-none">
      
      {!isEditMode ? (
        
        /* ======================================================= */
        /* 📱 โหมดที่ 1: หน้าจอ "ดูสรุปเวร" (หน้าแรกที่เด้งขึ้นมา) */
        /* ======================================================= */
        <div className="max-w-md md:max-w-xl mx-auto bg-slate-900/90 backdrop-blur-xl rounded-3xl md:rounded-[2.5rem] border-[3px] border-solid border-orange-500 p-5 md:p-8 shadow-[0_0_90px_rgba(249,115,22,0.6),inset_0_0_20px_rgba(249,115,22,0.5)] relative w-full mt-10 md:mt-0 mb-10 md:mb-0 my-auto flex flex-col max-h-[85vh]">
          
          <button onClick={() => { if(onClose) onClose(); }} className="absolute top-4 right-4 md:top-6 md:right-6 text-rose-500 hover:text-white animate-pulse bg-slate-900 hover:bg-rose-600 p-1.5 md:p-2 rounded-full transition-all duration-300 border-[2px] border-rose-500 shadow-[0_0_20px_rgba(225,29,72,0.8)] hover:shadow-[0_0_35px_rgba(225,29,72,1)] z-20 cursor-pointer">
            <XCircle className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          <div className="flex justify-between items-center mb-5 border-b-[2px] border-orange-500/40 pb-4 pr-10">
            <h3 className="text-[18px] md:text-2xl font-black text-orange-400 flex items-center gap-2 drop-shadow-[0_0_15px_rgba(249,115,22,1)]">
              <ClipboardList className="w-6 h-6 md:w-8 md:h-8" /> 
              ตารางเวร: {monthsThai[selectedMonth - 1]} พ.ศ. {selectedYear + 543}
            </h3>
          </div>

          <div className="grid grid-cols-2 md:flex md:justify-center gap-2 w-full md:w-auto mt-2 mb-4 md:mt-0">
            <button onClick={() => setIsMonthModalOpen(true)} className="w-full md:w-44 bg-slate-800 text-orange-400 font-black px-3 py-3 md:py-3.5 rounded-xl border-[2px] border-solid border-orange-500/50 text-[16px] md:text-[18px] flex justify-between items-center hover:bg-slate-700 hover:border-orange-400 transition-all shadow-[0_0_15px_rgba(249,115,22,0.5)] outline-none">
              <span className="flex-1 text-center">{monthsThai[selectedMonth - 1]}</span>
              <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            <button onClick={() => setIsYearModalOpen(true)} className="w-full md:w-36 bg-slate-800 text-orange-400 font-black px-3 py-3 md:py-3.5 rounded-xl border-[2px] border-solid border-orange-500/50 text-[16px] md:text-[18px] flex justify-between items-center hover:bg-slate-700 hover:border-orange-400 transition-all shadow-[0_0_15px_rgba(249,115,22,0.5)] outline-none">
              <span className="flex-1 text-center">พ.ศ. {selectedYear + 543}</span>
              <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
            </button>
          </div>

          <div className="overflow-y-auto px-1 space-y-4 pb-4 pt-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex-1 border-y-2 border-orange-500/20 my-2">
            {(() => {
              const activeRosters = Object.values(rosterData)
                .filter(info => info.techName && info.techName.trim() !== '')
                .sort((a, b) => a.dateStr.localeCompare(b.dateStr));

              if (activeRosters.length === 0) {
                return (
                  <div className="text-center py-10 bg-slate-800 border-[2px] border-dashed border-orange-500/50 rounded-2xl animate-pulse mt-4">
                    <AlertTriangle className="w-14 h-14 text-orange-500 mx-auto mb-3 drop-shadow-[0_0_15px_rgba(249,115,22,0.8)]" />
                    <h4 className="text-orange-400 font-black text-[18px]">ยังไม่มีข้อมูลการจัดเวรในเดือนนี้</h4>
                  </div>
                );
              }

              return activeRosters.map((info, idx) => {
                const [yyyy, mm, dd] = info.dateStr.split('-');
                const dateObj = new Date(parseInt(yyyy, 10), parseInt(mm, 10) - 1, parseInt(dd, 10));
                const dayOfWeek = dateObj.getDay();
                const dayNum = parseInt(dd, 10);

                let rowClass, nameColor, subText, subTextColor, dotColor;

                if (info.isHoliday) {
                  rowClass = "border-orange-500/80 shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:shadow-[0_0_25px_rgba(249,115,22,0.6)]";
                  nameColor = "text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]";
                  subText = info.holidayName || "วันหยุดพิเศษ";
                  subTextColor = "text-orange-400 drop-shadow-[0_0_5px_rgba(249,115,22,0.8)]";
                  dotColor = "bg-orange-500";
                } else if (dayOfWeek === 0) { 
                  rowClass = "border-rose-500/80 shadow-[0_0_15px_rgba(225,29,72,0.3)] hover:shadow-[0_0_25px_rgba(225,29,72,0.6)]";
                  nameColor = "text-rose-400 drop-shadow-[0_0_8px_rgba(225,29,72,0.8)]";
                  subText = "วันอาทิตย์";
                  subTextColor = "text-rose-400 drop-shadow-[0_0_5px_rgba(225,29,72,0.8)]";
                  dotColor = "bg-rose-500";
                } else if (dayOfWeek === 6) { 
                  rowClass = "border-sky-500/80 shadow-[0_0_15px_rgba(14,165,233,0.3)] hover:shadow-[0_0_25px_rgba(14,165,233,0.6)]";
                  nameColor = "text-sky-400 drop-shadow-[0_0_8px_rgba(14,165,233,0.8)]";
                  subText = "วันเสาร์";
                  subTextColor = "text-sky-400 drop-shadow-[0_0_5px_rgba(14,165,233,0.8)]";
                  dotColor = "bg-sky-500";
                } else { 
                  rowClass = "border-cyan-500/80 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)]";
                  nameColor = "text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]";
                  subText = ""; 
                }

                return (
                  <div key={idx} className={`flex items-center justify-between p-4 rounded-xl border-[2px] bg-slate-800 transition-all ${rowClass}`}>
                    <div className="flex items-center gap-4">
                      <span className={`flex items-center justify-center w-12 h-12 rounded-xl border-[2px] font-black text-[18px] transition-all duration-300 ${getDateBadgeClass(dayOfWeek, info.isHoliday, true)}`}>
                        {dayNum}
                      </span>
                      <div className="flex flex-col justify-center">
                        <p className={`font-black text-[15px] md:text-[17px] ${nameColor}`}>
                          {info.techName}
                        </p>
                        {subText && (
                          <p className={`text-[12px] md:text-[13px] font-bold mt-0.5 flex items-center gap-1.5 ${subTextColor}`}>
                            <span className={`w-2 h-2 rounded-full animate-pulse ${dotColor}`}></span>
                            {subText}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }); 
            })()}
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => { if(onClose) onClose(); }} className="flex-1 py-3.5 rounded-xl font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 transition-all border border-slate-600 shadow-sm hover:shadow-md">
              ยกเลิก
            </button>
            <button onClick={() => setIsEditMode(true)} className="flex-[1.5] py-3.5 rounded-xl font-black text-white bg-gradient-to-r from-orange-400 to-amber-400 border-2 border-solid border-white scale-105 shadow-[0_0_20px_rgba(249,115,22,0.6)] active:scale-95 transition-all duration-300 hover:from-orange-500 hover:to-orange-600">
              จัดตารางเวร ✏️
            </button>
          </div>
        </div>

      ) : (

        /* ======================================================= */
        /* 📱 โหมดที่ 2: หน้าจอ "จัดตารางเวร" (หน้าแก้ไขตารางยาวๆ) */
        /* ======================================================= */
        <div className="max-w-4xl mx-auto bg-slate-900/80 backdrop-blur-xl rounded-2xl md:rounded-[2rem] border-[3px] border-solid border-orange-500 p-4 pb-6 md:p-8 shadow-[0_0_90px_rgba(249,115,22,0.5)] relative w-full mt-10 md:mt-0 mb-10 md:mb-0 my-auto animate-in slide-in-from-right-4 duration-300">
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pr-10 md:pr-14 md:items-center mb-3">
            <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-start">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 p-2.5 md:p-3 rounded-xl md:rounded-2xl shadow-[0_0_20px_rgba(249,115,22,0.5)]">
                <Wrench className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400 drop-shadow-sm">จัดการตารางเวร</h1>
                <p className="text-[14px] md:text-[16px] font-bold text-slate-400 mt-0.5 hidden md:block">ระบบบริหารจัดการวันหยุดประจำเดือน</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:flex md:justify-center gap-2 w-full md:w-auto mt-2 md:mt-0">
              <button 
                onClick={() => setIsMonthModalOpen(true)}
                className="w-full md:w-44 bg-slate-800 text-orange-400 font-black px-3 py-3 md:py-3.5 rounded-xl border-[2px] border-solid border-orange-500/50 text-[16px] md:text-[18px] flex justify-between items-center hover:bg-slate-700 hover:border-orange-400 transition-all shadow-[0_0_15px_rgba(249,115,22,0.2)] outline-none"
              >
                <span className="flex-1 text-center">{monthsThai[selectedMonth - 1]}</span>
                <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              
              <button 
                onClick={() => setIsYearModalOpen(true)}
                className="w-full md:w-36 bg-slate-800 text-orange-400 font-black px-3 py-3 md:py-3.5 rounded-xl border-[2px] border-solid border-orange-500/50 text-[16px] md:text-[18px] flex justify-between items-center hover:bg-slate-700 hover:border-orange-400 transition-all shadow-[0_0_15px_rgba(249,115,22,0.2)] outline-none"
              >
                <span className="flex-1 text-center">พ.ศ. {selectedYear + 543}</span>
                <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border-[2px] border-solid border-cyan-400 mb-3 bg-slate-950/60 shadow-[0_0_40px_rgba(6,182,212,0.4)] mt-4">
            <div className="max-h-[55vh] overflow-y-auto overflow-x-hidden pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-cyan-900/20 hover:[&::-webkit-scrollbar-thumb]:bg-cyan-500/60 [&::-webkit-scrollbar-thumb]:rounded-full transition-all duration-300 overscroll-contain">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/90 backdrop-blur-md text-cyan-400 text-[14px] md:text-[16px] font-black uppercase tracking-wider sticky top-0 z-10 border-b-[2px] border-solid border-cyan-400 shadow-[0_5px_15px_rgba(6,182,212,0.2)]">
                    <th className="py-4 pl-2 pr-1 md:px-4 text-center w-12 md:w-20">วันที่</th>
                    <th className="py-4 px-2 md:px-4 w-[75%] md:w-[40%]">เจ้าหน้าที่อยู่เวร (SSC)</th>
                    <th className="hidden md:table-cell py-4 px-4">ระบุชื่อวันหยุดพิเศษ (ถ้ามี)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-solid divide-cyan-900/40 text-[14px]">
                  {daysInMonth.map((d) => {
                    const currentInfo = rosterData[d.dateStr] || {};
                    const displayHolidayName = currentInfo.holidayName || d.holidayName || '';
                    const isHol = currentInfo.isHoliday || d.isHoliday;
                    const dateBadgeClass = getDateBadgeClass(d.dayOfWeek, isHol, currentInfo.techName);
                    const selectColorClass = getSelectColorClass(d.dayOfWeek, isHol, currentInfo.techName);

                    return (
                      <tr key={d.dateStr} className="transition-all duration-300 hover:bg-cyan-950/30">
                        <td className="py-3 pl-1 pr-1 md:px-4 text-center font-mono align-top md:align-middle pt-4 md:pt-3 w-14 md:w-24">
                          <span className={`inline-flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-xl border-[2px] transition-all duration-300 text-[16px] md:text-[20px] font-black ${dateBadgeClass}`}>
                           {d.dayNum}
                          </span>
                        </td>
                        <td className="py-3 pr-2 pl-2 md:px-4 flex flex-col md:table-cell gap-2">
                          <button onClick={() => setSelectingTechForDate(d.dateStr)} className={`w-full font-bold px-4 py-3 md:py-3.5 rounded-xl border border-solid transition-all text-left flex justify-between items-center outline-none text-[13px] md:text-[15px] ${selectColorClass}`}>
                            <span className="truncate">{currentInfo.techName || '-- โปรดเลือกผู้ปฏิบัติงาน --'}</span>
                            <svg className="w-4 h-4 ml-2 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                          </button>
                          {!d.isWeekend && (
                            <input type="text" value={displayHolidayName} onChange={(e) => handleHolidayNameChange(d.dateStr, e.target.value)} placeholder="ระบุวันหยุด (เช่น วันสงกรานต์)" className="md:hidden w-full bg-slate-900/80 text-cyan-100 px-3 py-2.5 rounded-xl border border-solid border-cyan-500/30 focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.3)] text-[12px] font-bold outline-none transition-all mt-2" />
                          )}
                        </td>
                        <td className="hidden md:table-cell py-3 px-4">
                          <input type="text" disabled={d.isWeekend} value={d.isWeekend ? (d.dayOfWeek === 0 ? 'วันอาทิตย์' : 'วันเสาร์') : displayHolidayName} onChange={(e) => handleHolidayNameChange(d.dateStr, e.target.value)} placeholder="เช่น วันสงกรานต์, มติ ครม." className={`w-full px-4 py-3 rounded-xl border border-solid border-cyan-500/30 focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(6,182,212,0.3)] text-[14px] font-bold outline-none transition-all ${d.isWeekend ? (d.dayOfWeek === 0 ? 'text-rose-400/60 bg-rose-950/20 border-rose-500/20' : 'text-blue-400/60 bg-blue-950/20 border-blue-500/20') : 'text-cyan-100 bg-slate-900/80'}`} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 🌟 ฟันธง: อัปเกรดแผงปุ่มด้านล่าง (ย้อนกลับ | ล้างข้อมูล | บันทึกเวร) */}
          <div className="flex flex-row justify-between items-stretch gap-2 md:gap-4 pt-3 mt-2 w-full">
            
            {/* 1. ปุ่มย้อนกลับ (กลับไปหน้าสรุปเวร) - สีฟ้าเรืองแสง */}
            <button
              onClick={() => setIsEditMode(false)}
              className="flex-[0.8] md:flex-[1] bg-slate-900 text-cyan-400 hover:text-white hover:bg-cyan-900/60 font-black py-2.5 md:py-3.5 rounded-xl border-[2px] border-solid border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] active:scale-95 transition-all duration-300 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2"
            >
              <ChevronRight className="w-5 h-5 md:w-5 md:h-5 rotate-180" />
              <span className="text-[11px] md:text-[14px] leading-none md:leading-normal">ย้อนกลับ</span>
            </button>

            {/* 2. ปุ่มล้างข้อมูลทั้งหมด (สีแดงเรืองแสง) */}
            <button
              onClick={() => setModalConfig({ isOpen: true, type: 'clear' })}
              className="flex-[0.8] md:flex-[1] bg-slate-900 text-rose-500 hover:text-white hover:bg-rose-600 font-black py-2.5 md:py-3.5 rounded-xl border-[2px] border-solid border-rose-500/50 shadow-[0_0_15px_rgba(225,29,72,0.3)] hover:shadow-[0_0_25px_rgba(225,29,72,0.6)] active:scale-95 transition-all duration-300 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2"
            >
              <RotateCcw className="w-5 h-5 md:w-5 md:h-5" />
              <span className="text-[11px] md:text-[14px] leading-none md:leading-normal">ล้างข้อมูล</span>
            </button>

            {/* 3. ปุ่มบันทึกตารางเวร (สีส้มเรืองแสง - ให้พื้นที่กว้างกว่าเพื่อนนิดนึง flex-[1.5]) */}
            <button
              onClick={() => setModalConfig({ isOpen: true, type: 'save' })}
              disabled={activeRecordsCount === 0} 
              className={`flex-[1.5] font-black py-2.5 md:py-3.5 rounded-xl transition-all duration-300 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2
                ${activeRecordsCount === 0 
                  ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed grayscale' 
                  : 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.5)] hover:shadow-[0_0_40px_rgba(249,115,22,0.8)] active:scale-95 border-2 border-white' 
                }`}
            >
              <Save className="w-5 h-5 md:w-5 md:h-5" />
              <span className="text-[11px] md:text-[15px] leading-none md:leading-normal text-center">
                {activeRecordsCount === 0 ? 'ไม่มีข้อมูล' : 'บันทึกเวร'}
              </span>
            </button>
            
          </div>
        </div>
      )}

      {/* ======================= 🌟 โซน Pop-up ทั้งหมด 🌟 ======================= */}

      {isMonthModalOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overscroll-none">
          <div className="relative bg-slate-900 border-[3px] border-orange-500 rounded-3xl w-full max-w-sm p-6 shadow-[0_0_90px_rgba(249,115,22,0.6)] flex flex-col">
            <div className="flex justify-between items-center mb-5 border-b border-orange-500/30 pb-3">
              <h3 className="text-lg font-black text-orange-400 flex items-center gap-2">
                <Calendar className="w-5 h-5" /> เลือกเดือน
              </h3>
              <button 
                onClick={() => setIsMonthModalOpen(false)} 
                className="text-orange-500 hover:text-white bg-slate-900 animate-pulse p-1.5 md:p-2 rounded-full transition-all border border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.7)] hover:shadow-[0_0_20px_rgba(249,115,22,1)] cursor-pointer"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {monthsThai.map((m, idx) => {
                const isSelected = selectedMonth === idx + 1;
                return (
                  <button
                    key={idx}
                    onClick={() => { setSelectedMonth(idx + 1); setIsMonthModalOpen(false); }}
                    className={`py-3.5 rounded-2xl font-black border-[2px] transition-all duration-200 text-[13px] md:text-[14px] active:scale-95
                      ${isSelected
                        ? 'bg-gradient-to-br from-orange-500 to-red-600 text-white border-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.5)]'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-orange-500/60 hover:bg-slate-700 hover:text-orange-400'
                      }`}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {isYearModalOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overscroll-none">
          <div className="relative bg-slate-900 border-[3px] border-orange-500 rounded-3xl w-full max-w-xs p-6 shadow-[0_0_90px_rgba(249,115,22,0.6)] flex flex-col">
            <div className="flex justify-between items-center mb-5 border-b border-orange-500/30 pb-3">
              <h3 className="text-lg font-black text-orange-400 flex items-center gap-2">
                <Calendar className="w-5 h-5" /> เลือกปี พ.ศ.
              </h3>
              <button 
                onClick={() => setIsYearModalOpen(false)} 
                className="text-orange-500 hover:text-white bg-slate-900 animate-pulse p-1.5 md:p-2 rounded-full transition-all border border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.7)] hover:shadow-[0_0_20px_rgba(249,115,22,1)] cursor-pointer"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {yearsList.map((y) => {
                const isSelected = selectedYear === y;
                return (
                  <button
                    key={y}
                    onClick={() => { setSelectedYear(y); setIsYearModalOpen(false); }}
                    className={`w-full relative py-4 rounded-2xl font-black border-[2px] transition-all duration-200 text-[15px] active:scale-95
                      ${isSelected
                        ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white border-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.5)]'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-orange-500/60 hover:bg-slate-700 hover:text-orange-400'
                      }`}
                  >
                    <span className="flex-1 text-center">พ.ศ. {y + 543}</span>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-white absolute right-5 top-1/2 -translate-y-1/2" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {modalConfig.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 overscroll-none">
          <div className={`relative bg-slate-900 border-[3px] border-solid rounded-3xl w-full max-w-sm p-6 text-center shadow-2xl ${modalConfig.type === 'save' ? 'border-orange-500 shadow-[0_0_50px_rgba(249,115,22,0.4)]' : 'border-rose-500 shadow-[0_0_50px_rgba(225,29,72,0.4)]'}`}>
            
            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 border-[3px] border-solid animate-pulse ${modalConfig.type === 'save' ? 'bg-orange-500/20 border-orange-500 text-orange-400' : 'bg-rose-500/20 border-rose-500 text-rose-400'}`}>
              {modalConfig.type === 'save' ? <Save className="w-10 h-10" /> : <AlertTriangle className="w-10 h-10" />}
            </div>

            <h3 className="text-2xl font-black text-white mb-2">
              {modalConfig.type === 'save' ? 'ยืนยันการบันทึก?' : 'ยืนยันการล้างข้อมูล?'}
            </h3>
            
            <p className="text-slate-400 text-[14px] font-bold mb-6">
              {modalConfig.type === 'save' 
                ? `ระบบจะทำการบันทึกตารางเวร ประจำเดือนนี้ และอัปเดตข้อมูลทั้งหมดทันที` 
                : 'ข้อมูลบนหน้าจอนี้จะถูกล้างออก เพื่อให้คุณเริ่มต้นจัดเวรใหม่ (ข้อมูลในระบบจะยังไม่หายไปจนกว่าจะกดบันทึก)'}
            </p>

            <div className="flex gap-3">
              <button 
                onClick={() => setModalConfig({ isOpen: false, type: null })}
                className="flex-1 py-3 rounded-xl font-black text-slate-300 bg-slate-800 hover:bg-slate-700 transition-all border border-slate-600"
              >
                ยกเลิก
              </button>
              <button 
                onClick={modalConfig.type === 'save' ? executeSave : executeClear}
                disabled={loading}
                className={`flex-1 py-3 rounded-xl font-black text-white transition-all shadow-lg active:scale-95 ${modalConfig.type === 'save' ? 'bg-orange-600 hover:bg-orange-500 shadow-orange-500/40' : 'bg-rose-600 hover:bg-rose-500 shadow-rose-500/40'}`}
              >
                {loading ? 'รอสักครู่...' : modalConfig.type === 'save' ? 'ยืนยันบันทึก' : 'ล้างข้อมูล'}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectingTechForDate && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overscroll-none">
          <div className="relative bg-slate-900 border-[3px] border-solid border-cyan-400 rounded-3xl w-full max-w-sm p-6 shadow-[0_0_60px_rgba(34,211,238,0.7),inset_0_0_20px_rgba(34,211,238,0.3)] flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center mb-5 border-b-[2px] border-cyan-500/40 pb-4">
              <h3 className="text-[16px] md:text-lg font-black text-cyan-300 flex items-center gap-2 drop-shadow-[0_0_15px_rgba(34,211,238,0.9)]">
                <User className="w-5 h-5" /> เลือกผู้ปฏิบัติงาน
              </h3>
              <button 
                onClick={() => setSelectingTechForDate(null)} 
                className="text-rose-500 hover:text-white animate-pulse bg-slate-900 hover:bg-rose-600 p-1.5 md:p-2 rounded-full transition-all duration-300 border-[2px] border-rose-500 shadow-[0_0_20px_rgba(225,29,72,0.8)] hover:shadow-[0_0_35px_rgba(225,29,72,1)] cursor-pointer"
              >
                <XCircle className="w-6 h-6 md:w-7 md:h-7" />
              </button>
            </div>

            <div className="overflow-y-auto pr-1 space-y-3 pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pt-1">
              <button 
                onClick={() => { handleTechChange(selectingTechForDate, ''); setSelectingTechForDate(null); }}
                className="w-full text-center px-4 py-3.5 rounded-xl font-black border-[2px] transition-all duration-300 bg-slate-900/50 text-rose-400 border-rose-500/60 shadow-[0_0_15px_rgba(225,29,72,0.3)] hover:border-rose-400 hover:text-white hover:bg-rose-900/60 hover:shadow-[0_0_35px_rgba(225,29,72,0.9)]"
              >
                -- ยกเลิกเวร / ไม่ระบุ --
              </button>

              {technicianList.map((t, idx) => {
                const isSelected = rosterData[selectingTechForDate]?.techName === t.name;
                return (
                  <button 
                    key={idx}
                    onClick={() => { handleTechChange(selectingTechForDate, t.name); setSelectingTechForDate(null); }}
                    className={`w-full text-left px-4 py-4 rounded-xl font-black border-[2px] transition-all duration-300 flex justify-between items-center active:scale-95
                      ${isSelected 
                        ? 'bg-orange-900/40 text-orange-400 border-orange-400 shadow-[0_0_30px_rgba(249,115,22,0.8),inset_0_0_15px_rgba(249,115,22,0.4)]' 
                        : 'bg-slate-900/80 text-cyan-100 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:bg-emerald-500/20 hover:border-emerald-400 hover:text-white hover:shadow-[0_0_35px_rgba(16,185,129,1)]'
                      }`}
                  >
                    <span className="text-[14px] md:text-[15px]">{t.name}</span>
                    {isSelected && <CheckCircle2 className="w-6 h-6 text-orange-400 drop-shadow-[0_0_10px_rgba(249,115,22,1)]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}


// ==========================================
// 🌟 2. ข้อมูลระบบ (System Data)
// ==========================================
const employeeList = [
  // ฝ่ายวิศวกรรมระบบปฏฺิบัติการดาวเทียม (ฝวด.)
  { name: 'นายนวัตกรณ์ ไก่แก้ว', position: 'หัวหน้าฝ่าย', department: 'ฝวด.' },
  { name: 'นายทศพล ชินนิวัฒน์', position: 'วิศวกรชำนาญการ', department: 'ฝวด.', },
  { name: 'นายประมินทร์ พิชิตการค้า', position: 'วิศวกร', department: 'ฝวด.' },
  { name: 'นายนรัตว์ ศรีสวัสดิ์พงษ์', position: 'วิศวกร', department: 'ฝวด.' },
  { name: 'นายธนกาญจน์ ไตรปิฎก', position: 'นักเทคโนโลยีอวกาศ', department: 'ฝวด.', },
  { name: 'นายชุติพงษ์ ลาวงศ์เกิด', position: 'นักเทคโนโลยีอวกาศ', department: 'ฝวด.', },
  { name: 'น.ส.จินวะรา สุรัตนกุล', position: 'วิศวกร', department: 'ฝวด.' },
  { name: 'น.ส.พิชชาภรณ์ อัมพรายน์', position: 'วิศวกร', department: 'ฝวด.' },
  { name: 'น.ส.ฐิตาภรณ์ ทองคำภา', position: 'เจ้าหน้าที่พัฒนาธุรกิจ', department: 'ฝวด.', },

  // ฝ่ายปฏิบัติการควบคุมดาวเทียม (ฝปค.)
  { name: 'นายเสกสรร จัตุรัส', position: 'หัวหน้าฝ่าย', department: 'ฝปค.' },
  { name: 'นายอัฐราวุฒิ เดชผล', position: 'วิศวกรชำนาญการ', department: 'ฝปค.', },
  { name: 'น.ส.จารุณี ขุนจันทร์', position: 'วิศวกรชำนาญการ', department: 'ฝปค.', },
  { name: 'น.ส.พันทิพย์ภา บุญสมพงษ์', position: 'วิศวกร', department: 'ฝปค.' },
  { name: 'นายอาทิตย์ ศิริขันธ์', position: 'นักเทคโนโลยีอวกาศ', department: 'ฝปค.', },
  { name: 'นายประกาศิต อุดมธนะธีระ', position: 'วิศวกร', department: 'สปท.' },
  { name: 'นายโกวิทย์ พุ่มกิ่ง', position: 'วิศวกร', department: 'สปท.' },
  { name: 'น.ส.รพิรัตน์ ฤทธิ์รณศักดิ์', position: 'วิศวกร', department: 'ฝปค.', },

  // ฝา่ยปฏิบัติการข้อมูลดาวเทียม (ฝปด.)
  { name: 'ว่าที่ ร.ต. วรธันย์ วิชาคุณ', position: 'หัวหน้าฝ่าย', department: 'ฝปด.', },
  { name: 'นายประสิทธิ์ มากสิน', position: 'นักเทคโนโลยีอวกาศชำนาญการ', department: 'ฝปด.', },
  { name: 'นายวิชญ์ภาส ดรบัณฑิต', position: 'นักเทคโนโลยีอวกาศ', department: 'ฝปด.', },
  { name: 'น.ส.เข็มทราย ปีกสันเทียะ', position: 'นักเทคโนโลยีอวกาศ', department: 'ฝปด.', },
  { name: 'น.ส.กนกวรรณ กัณหะกิติ', position: 'นักเทคโนโลยีอวกาศ', department: 'ฝปด.', },
  { name: 'น.ส.ศิรินทรา อินทร์ถนอม', position: 'นักเทคโนโลยีอวกาศ', department: 'ฝปด.', },
  { name: 'นายประโยชน์ ปวงจักร์ทา', position: 'นักเทคโนโลยีอวกาศชำนาญการ', department: 'ฝปด.', },
  { name: 'น.ส.ภาวรินทร์ คูหา', position: 'นักเทคโนโลยีอวกาศ', department: 'ฝปด.', },
  { name: 'นายประวุฒิ ดิษาภิรมย์', position: 'วิศวกร', department: 'ฝปด.' },
 
  // ฝ่ายบริการทดสอบและประกอบดาวเทียม
  { name: 'น.ส.บุษยมาศ เพชรทอง', position: 'หัวหน้าฝ่าย', department: 'ฝบท.' },
  { name: 'นายจิโรจ ทองตา', position: 'วิศวกร', department: 'ฝบท.' },
  { name: 'นายศรัณย์ นันทะชมภู', position: 'วิศวกร', department: 'ฝบท.' },
  { name: 'นายปิยภัทร เขียวเจริญ', position: 'วิศวกร', department: 'ฝบท.' },
  { name: 'น.ส.อโณทัย นิ่มน้อย', position: 'นักพัฒนานวัตกรรม', department: 'สปท.', },
];

// 🌟 ฟันธง: ฐานข้อมูลสมองกล จับคู่อุปกรณ์ -> ช่างรับผิดชอบ

const techMapping = {
  "ภารกิจด้านจานสายอากาศ": { name: "นายทศพล ชินนิวัฒน์", phone: "08-1513-7854" },
  "ภารกิจด้านคอมพิวเตอร์แม่ข่าย-THEOS-2": { name: "นายธนกาญจน์ ไตรปิฎก", phone: "06-2463-5544" },
  "ภารกิจด้านคอมพิวเตอร์แม่ข่าย-THEOS": { name: 'นายชุติพงษ์ ลาวงศ์เกิด', phone: '09-8938-9839',},
  "ภารกิจด้านโครงสร้างพื้นฐานไฟฟ้า": { name: "นายประมินทร์ พิชิตการค้า", phone: "08-1135-1599" },
  "ภารกิจด้านการให้บริการโครงการ SSC": { name: "นายนรัตว์ ศรีสวัสดิ์พงษ์", phone: "08-6361-4399" },

};

// 🌟 ฟันธงจัดกลุ่มใหม่ ตาม KPI 3 ภารกิจหลักของ ฝวด.
const equipmentCategories = {
  'ภารกิจด้านจานสายอากาศ': [
    'Antenna-KRATOS',
    'Antenna-VIASAT',
    'Antenna-Comtech',
    'Antenna-Orbital',
    'Antenna-7.3m.',
    'Satellites Receiving System'
  ],
  'ภารกิจด้านคอมพิวเตอร์แม่ข่าย-THEOS': [
    'THEOS-DPF',
    'THEOS-STORNEXT',
    'THEOS-CGS',
    'THEOS-FDS',
    'THEOS-MPC',
    'RS2-AMS/PGS/CUDOS',
    'RS2-DAS/NSART/FTD',
    'JPSS/MODIS',
    'Cosmo-SkyMED'
  ],

  'ภารกิจด้านคอมพิวเตอร์แม่ข่าย-THEOS-2': [
    'THEOS2-IGS',
    'THEOS2-MGS',
    'THEOS2-CGS',
    'THEOS2-FDS',
    'THEOS2-GIPS',
  ],

  'ภารกิจด้านโครงสร้างพื้นฐานไฟฟ้า': [
    'UPS-120kVA-VIASAT',
    'UPS-120kVA-Building-1',
    'UPS-120kVA-Building-2',
    'UPS-250kVA-KRATOS',
    'Precision-AIR/HVAC-1',
    'Precision-AIR/HVAC-2',
    'Generator-650kVA',
    'Generator-350kVA',
    'FM-200-Building-1',
    'FM-200-Building-2',
    'Grounding-Lightning'
  ],
  "ภารกิจด้านการให้บริการโครงการ SSC": [
    "Antenna-7.3m",
    "Antenan-QZSS",
    "S3EE-SKP Station",
    "S3EE-CMI Station",
    "S3EE-UBN Station",
    "S3EE-UDN Station"
  ]
};

const buildingList = [
  'อาคาร สถานีดาวเทียม',
  'อาคาร Centrarium',
  'อาคาร AIT',
  'อาคาร SI',
  'ฐานจาน-VIASAT',
  'ฐานจาน-KRATOS',
  'ฐานจาน-Orbital',
  'ฐานจาน-CGC',
  'Shellter-7.3m',

];

const technicianList = [
  { name: 'นายนวัตกรณ์ ไก่แก้ว', phone: '08-3529-3836', photo: '/korn.webp' },
  { name: 'นายทศพล ชินนิวัฒน์', phone: '08-1513-7854', photo: '/tos.webp' },
  { name: 'นายนรัตว์ ศรีสวัสดิ์พงษ์', phone: '08-6361-4399', photo: '/narat.webp' },
  { name: 'นายประมินทร์ พิชิตการค้า', phone: '08-1135-1599', photo: '/pramin.webp' },
  { name: 'นายธนกาญจน์ ไตรปิฎก', phone: '06-2463-5544', photo: '/karn.webp' },
  { name: 'นายชุติพงษ์ ลาวงศ์เกิด', phone: '09-8938-9839', photo: '/neng.webp' },
  { name: 'น.ส.จินวะรา สุรัตนกุล', phone: '08-2480-2280', photo: '/jun.webp' },
  { name: 'น.ส.พิชชาภรณ์ อัมพรายน์', phone: '08-6351-3420', photo: '/่jun.webp' },
  { name: 'น.ส.ฐิตาภรณ์ ทองคำภา', phone: '09-4232-6437', photo: '/่jun.webp' },
  { name: 'นายวิชญ์ภาส ดรบัณฑิต', phone: '09-1415-5194', photo: '/top.webp' },
];

// ==========================================
// 🌟 3. Utility Functions
// ==========================================
const ThaiDateFormatter = (date) => {
  const months = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
  ];
  const d = new Date(date);
  const dayOfWeek = d.getDay();

  // 🌟 สมองกลกำหนดสีตามวัน สำหรับตัวหนังสือและไอคอน (พร้อมเอฟเฟกต์เรืองแสง)
  const dayColors = {
    0: 'text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.8)]',    // อาทิตย์ (แดง)
    1: 'text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]', // จันทร์ (เหลือง)
    2: 'text-pink-400 drop-shadow-[0_0_10px_rgba(244,114,182,0.8)]',  // อังคาร (ชมพู)
    3: 'text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]',// พุธ (เขียว)
    4: 'text-orange-400 drop-shadow-[0_0_10px_rgba(251,146,60,0.8)]', // พฤหัส (ส้ม)
    5: 'text-sky-400 drop-shadow-[0_0_10px_rgba(56,189,248,0.8)]',    // ศุกร์ (ฟ้า)
    6: 'text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]'  // เสาร์ (ม่วง)
  };

  // 🌟 สมองกลสร้างแสงเฟลอร์ (Flare) ฟุ้งๆ ด้านหลัง
  const flareColors = {
    0: 'bg-rose-500/20',
    1: 'bg-yellow-500/20',
    2: 'bg-pink-500/20',
    3: 'bg-emerald-500/20',
    4: 'bg-orange-500/20',
    5: 'bg-sky-500/20',
    6: 'bg-purple-500/20'
  };

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-5 md:gap-20 text-[15px] sm:text-[17px] md:text-[30px] whitespace-nowrap font-sans py-1 px-2">
      
      {/* 📅 โซนวันที่ หน้าแจ้งซ่อม และ แผงควบคุม (ฟันธง: เปลี่ยนสีตามวัน + มีแสงเฟลอร์เบาๆ ด้านหลัง) */}
      <div className="relative flex items-center gap-2 md:gap-3 shrink-0">
        <div className={`absolute inset-0 ${flareColors[dayOfWeek]} blur-[15px] rounded-full pointer-events-none`}></div>
        <Calendar className={`w-[22px] h-[22px] md:w-[28px] md:h-[28px] relative z-10 ${dayColors[dayOfWeek]}`} />
        <span className={`font-black tracking-widest relative z-10 ${dayColors[dayOfWeek]}`}>
          {d.getDate()} {months[d.getMonth()]} {d.getFullYear() + 543}
        </span>
      </div>

      {/* ⏐ เส้นแบ่งคั่นกลาง */}
      <div className="w-[2px] h-8 md:h-10 bg-cyan-200/80 rounded-full shrink-0"></div>

      {/* ⏱️ โซนเวลา หน้าแจ้งซ่อม และ แผงควบคุม (ฟันธง: ล็อกสีส้มไว้ตามสั่ง ไม่ให้เปลี่ยนตามวัน พร้อมเฟลอร์สีส้ม) */}
      <div className="relative flex items-center gap-2 md:gap-3 shrink-0">
         <div className="absolute inset-0 bg-orange-500/10 blur-[15px] rounded-full pointer-events-none"></div>
        <Clock className="w-[22px] h-[22px] md:w-[28px] md:h-[28px] text-orange-500 animate-pulse relative z-10 drop-shadow-[0_0_5px_rgba(249,115,22,0.8)]" />
        <span className="font-mono font-black text-orange-300 tracking-[0.1em] drop-shadow-[0_0_5px_rgba(249,115,22,0.8)] relative z-10">
          {d.toLocaleTimeString('th-TH', { hour12: false })} น.
        </span>
      </div>

    </div>
  );
};

// 🌟 ฟันธง: ฟังก์ชันนี้คือตัวที่หายไปครับ เอากลับมาต่อชีวิตให้หน้าตั๋ว!
const formatDateTimeString = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const months = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${
    d.getFullYear() + 543
  } | ${d.toLocaleTimeString('th-TH', { hour12: false })} น.`;
};

const getNextReqId = (tickets) => {
  // 1. ดึงปีและเดือนปัจจุบัน
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2); // เอาแค่ 2 หลักท้าย เช่น "26"
  const mm = String(now.getMonth() + 1).padStart(2, '0'); // เดือน "05"
  
  // 2. สร้าง Prefix ของเดือนนี้ เช่น "GSE-2605-"
  const prefix = `GSE-${yy}${mm}-`; 

  // ถ้ายังไม่มีข้อมูลในระบบเลย ให้เริ่ม 0001
  if (!tickets || tickets.length === 0) return `${prefix}0001`;

  // 3. กรองหาเฉพาะงานของ "เดือนปัจจุบัน" เท่านั้น
  const currentMonthTickets = tickets.filter(t => String(t.id).startsWith(prefix));

  // ถ้าเดือนนี้ยังไม่มีงานเลย ให้เริ่ม 0001 ใหม่
  if (currentMonthTickets.length === 0) return `${prefix}0001`;

  // 4. หาเลข Running ล่าสุดของเดือนนี้ แล้วบวก 1
  const maxNum = currentMonthTickets.reduce((max, t) => {
    // ตัดเอาเฉพาะตัวเลขด้านหลังมาคำนวณ
    const numStr = String(t.id).replace(prefix, '');
    const num = parseInt(numStr, 10);
    return !isNaN(num) && num > max ? num : max;
  }, 0);

  // 5. ประกอบร่างและเติม 0 ด้านหน้าให้ครบ 4 หลัก
  return `${prefix}${String(maxNum + 1).padStart(4, '0')}`;
};

const formatDisplayPhone = (phone) => {
  if (!phone || phone === '-' || phone === 'N/A') return phone;
  const cleaned = String(phone).replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `${cleaned.substring(0, 2)}-${cleaned.substring(
      2,
      6
    )}-${cleaned.substring(6)}`;
  }
  return phone;
};

// เพิ่มฟังก์ชันคำนวณส่วนต่างเวลาเป็นนาที สำหรับงานวิกฤต
const getMinutesDiff = (start, end) => {
  if (!start || !end) return 0;
  const diffMs = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(0, Math.floor(diffMs / 60000));
};
const formatMinutesToText = (totalMins) => {
  if (totalMins < 60) return `${totalMins} นาที`;
  const d = Math.floor(totalMins / 1440);
  const h = Math.floor((totalMins % 1440) / 60);
  const m = totalMins % 60;
  if (d > 0) return `${d} วัน ${h} ชั่วโมง ${m} นาที`;
  return `${h} ชั่วโมง ${m} นาที`;
};
// ==========================================
// 🌟 4. UI Components
// ==========================================
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 bg-white text-emerald-700 min-h-screen flex flex-col justify-center items-center font-sans text-center border-t-[10px] border-rose-500 shadow-inner">
          <AlertCircle size={80} className="mb-6 animate-pulse text-rose-500" />
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">
            ระบบพบข้อผิดพลาด
          </h2>
          <p className="mt-2 text-slate-400 text-sm max-w-xs">
            {this.state.error?.message || 'กรุณารีเฟรชเพื่อลองใหม่อีกครั้ง'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-8 px-10 py-4 bg-orange-500 text-white font-black rounded-2xl shadow-xl active:scale-95 transition-all"
          >
            REBOOT SYSTEM
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

/* 🌟 ฟันธง: ขยายร่าง SearchableDropdown ให้ใหญ่เต็มตาบน PC บาลานซ์กับช่องกรอกอื่นๆ */
function SearchableDropdown({
  options,
  value,
  onChange,
  placeholder,
  label,
  icon,
  error,
  id,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target))
        setIsOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return options.filter((opt) =>
      String(opt).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  return (
    <div className="space-y-1.5 md:space-y-2 relative text-left" id={id} ref={containerRef}>
      
      {/* Label: ปกติมันถูกซ่อนไว้ใน Component นี้ แต่เพื่อความชัวร์ เผื่อมีการส่งเข้ามา เราดักไซส์ PC ไว้ด้วย */}
      <label className="text-[12px] md:text-[18px] font-bold text-slate-200 tracking-wide flex items-center gap-1.5 md:gap-2 ml-1">
        {label}
      </label>
      
      <div
        className={`w-full bg-white border-2 border-solid ${
          error
            ? 'border-rose-500 ring-1 ring-rose-500/50'
            : 'border-orange-500 hover:border-orange-600 focus-within:border-orange-600 focus-within:ring-2 focus-within:ring-orange-500/30'
        } rounded-2xl px-5 py-4 md:py-5 flex items-center justify-between cursor-pointer shadow-sm transition-all`}
        onClick={() => {
          setIsOpen(!isOpen);
          setSearchTerm('');
        }}
      >
        <div className="flex-1 min-w-0">
          {isOpen ? (
            <input
              autoFocus
              className="w-full bg-transparent outline-none text-sm md:text-[16px] font-bold text-slate-800"
              placeholder="พิมพ์ค้นหา..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span
              className={`text-sm md:text-[16px] font-bold truncate ${
                value ? 'text-slate-800' : 'text-slate-400'
              }`}
            >
              {value || placeholder}
            </span>
          )}
        </div>
        <ChevronDown
          size={18}
          className={`text-slate-400 md:w-6 md:h-6 transition-transform ${
            isOpen ? 'rotate-180 text-orange-500' : ''
          }`}
        />
      </div>
      
      {isOpen && (
        <div className="absolute z-[100] top-[100%] left-0 w-full bg-white border border-2 border-orange-400/70 mt-2 rounded-2xl md:rounded-[1.5rem] shadow-2xl max-h-60 md:max-h-80 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt, i) => (
              <div
                key={i}
                className="px-5 py-3.5 md:py-4 hover:bg-orange-50 hover:text-orange-600 text-sm md:text-[16px] font-bold text-slate-700 cursor-pointer border-b border-slate-50 last:border-0 transition-colors"
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
              >
                {opt}
              </div>
            ))
          ) : (
            <div className="px-5 py-4 md:py-6 text-xs md:text-[14px] text-slate-400 font-bold italic text-center uppercase tracking-widest">
              ไม่พบข้อมูล
            </div>
          )}
        </div>
      )}
      
      {error && (
        <div className="text-rose-500 text-[11px] md:text-[13px] font-bold mt-1.5 md:mt-2 ml-1 animate-in fade-in">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}

// 🌟 ฟันธง: ฟังก์ชันคำนวณความต่างของเวลา ออกมาเป็น วัน/ชม./นาที
const calculateDuration = (start, end, holdMs = 0) => {
  if (!start || !end) return "รอดำเนินการ...";
  
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  
  // ลบเวลารออะไหล่ (Hold Time) ออกจากเวลาทั้งหมด
  let durationMs = endTime - startTime - (holdMs || 0);
  if (durationMs < 0) durationMs = 0;

  const days = Math.floor(durationMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((durationMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

  let result = [];
  if (days > 0) result.push(`${days} วัน`);
  if (hours > 0) result.push(`${hours} ชม.`);
  if (minutes > 0) result.push(`${minutes} นาที`);
  
  return result.length > 0 ? result.join(' ') : "น้อยกว่า 1 นาที";
};


// ==========================================
// 🌟 ฟันธง: Component ใหม่ Sci-Fi Modal Dropdown (อัปเกรด เพิ่มแสงเรืองรองแยกจากช่องกรอกปกติ 1,000,000%)
// ==========================================
function SciFiSelectModal({ 
  id, label, icon, value, options, onChange, error, 
  placeholder, themeColor = 'orange' 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 🌟 ฟันธง: ปรับ Theme ให้มีแสง Glow สว่างเรืองๆ ออกมาจากเส้นขอบตั้งแต่แรก (ไม่ต้องรอ Hover)
  const theme = {
    emerald: { text: 'text-emerald-400', border: 'border-emerald-500', glow: 'shadow-[0_0_40px_rgba(16,185,129,0.5)]', flare: 'bg-emerald-500/20', btnBg: 'bg-emerald-900/40', outBorder: 'border-emerald-500/60', outHover: 'hover:border-emerald-400', outGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.3),inset_0_0_10px_rgba(16,185,129,0.1)]', outHoverGlow: 'hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]' },
    amber: { text: 'text-amber-400', border: 'border-amber-500', glow: 'shadow-[0_0_40px_rgba(245,158,11,0.5)]', flare: 'bg-amber-500/20', btnBg: 'bg-amber-900/40', outBorder: 'border-amber-500/60', outHover: 'hover:border-amber-400', outGlow: 'shadow-[0_0_15px_rgba(245,158,11,0.3),inset_0_0_10px_rgba(245,158,11,0.1)]', outHoverGlow: 'hover:shadow-[0_0_25px_rgba(245,158,11,0.5)]' },
    cyan: { text: 'text-cyan-400', border: 'border-cyan-500', glow: 'shadow-[0_0_40px_rgba(6,182,212,0.5)]', flare: 'bg-cyan-500/20', btnBg: 'bg-cyan-900/40', outBorder: 'border-cyan-500/60', outHover: 'hover:border-cyan-400', outGlow: 'shadow-[0_0_15px_rgba(6,182,212,0.3),inset_0_0_10px_rgba(6,182,212,0.1)]', outHoverGlow: 'hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]' },
    orange: { text: 'text-orange-400', border: 'border-orange-500', glow: 'shadow-[0_0_40px_rgba(249,115,22,0.5)]', flare: 'bg-orange-500/20', btnBg: 'bg-orange-900/40', outBorder: 'border-orange-500/60', outHover: 'hover:border-orange-400', outGlow: 'shadow-[0_0_15px_rgba(249,115,22,0.3),inset_0_0_10px_rgba(249,115,22,0.1)]', outHoverGlow: 'hover:shadow-[0_0_25px_rgba(249,115,22,0.5)]' },
  }[themeColor];

  const filteredOptions = options.filter(opt => String(opt).toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-1.5 md:space-y-2 relative text-left" id={id}>
      <label className={`text-[14px] md:text-[18px] font-black tracking-wide ml-1 flex items-center gap-1.5 md:gap-2 text-slate-200`}>
        {label}
      </label>
      
      {/* 🌟 ปุ่มกดเปิด Modal (หน้าฟอร์มหลัก) */}
      <div 
        onClick={() => { setIsOpen(true); setSearchTerm(''); }}
        className={`w-full bg-slate-900 rounded-2xl border-[2px] ${error ? 'border-rose-500 ring-1 ring-rose-500/50 shadow-none' : `${theme.outBorder} ${theme.outHover} ${theme.outGlow} ${theme.outHoverGlow}`} px-5 py-4 md:py-5 flex items-center justify-between cursor-pointer transition-all duration-300`}
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className={`text-[15px] md:text-[18px] font-bold truncate ${value ? 'text-slate-100' : 'text-slate-500'}`}>
            {value || placeholder}
          </span>
        </div>
        <ChevronDown size={18} className={`md:w-6 md:h-6 ${theme.text} animate-pulse`} />
      </div>

      {error && <div className="text-rose-500 text-[11px] md:text-[13px] font-bold mt-1.5 md:mt-2 ml-1 animate-in fade-in">⚠️ {error}</div>}

      {/* 🌟 ใช้ createPortal วาร์ปทะลุกรอบ 1,000,000% */}
      {isOpen && typeof document !== 'undefined' ? createPortal(
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200" onClick={() => setIsOpen(false)}>
          
          <div 
            className={`relative m-auto bg-slate-900 border-[3px] border-solid rounded-[2rem] w-[95%] sm:w-[85%] md:w-full max-w-sm md:max-w-md h-auto max-h-[75vh] md:max-h-[70vh] p-5 md:p-6 flex flex-col ${theme.border} ${theme.glow} shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* แสง Flare ด้านหลังให้ดูล้ำ */}
            <div className={`absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 ${theme.flare} blur-[40px] pointer-events-none rounded-full`}></div>

            {/* หัวข้อ Modal & ปุ่มปิด */}
            <div className={`flex justify-between items-center mb-4 md:mb-5 pb-3 md:pb-4 shrink-0 border-b border-slate-700/60 relative z-10`}>
              <h3 className={`text-[18px] md:text-[22px] font-black flex items-center gap-2 ${theme.text} drop-shadow-md`}>
                {icon} <span className="mt-0.5">{placeholder}</span>
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-rose-500 hover:text-white animate-pulse bg-slate-950 hover:bg-rose-600 p-1.5 md:p-2 rounded-full transition-all duration-300 border-[2px] border-rose-500 shadow-[0_0_20px_rgba(225,29,72,0.8)] cursor-pointer">
                <XCircle className="w-6 h-6 md:w-7 md:h-7 stroke-[3px]" />
              </button>
            </div>

            {/* ช่องค้นหา */}
            <div className="mb-4 relative shrink-0 z-10">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 md:w-6 md:h-6" />
              <input 
                type="text" 
                placeholder="พิมพ์ค้นหา..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border-[2px] border-slate-700 rounded-xl py-3 md:py-4 pl-10 pr-4 text-white outline-none focus:border-slate-500 transition-colors font-bold text-[15px] md:text-[18px]"
              />
            </div>

            {/* รายการตัวเลือก */}
            <div className="overflow-y-auto pr-2 space-y-2.5 md:space-y-3 pb-2 flex-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pt-1 relative z-10">
              {filteredOptions.length > 0 ? filteredOptions.map((opt, idx) => {
                const isSelected = value === opt;
                return (
                  <button 
                    key={idx}
                    onClick={() => { onChange(opt); setIsOpen(false); }}
                    className={`w-full text-left px-4 py-4 md:py-5 rounded-xl font-black border-[2px] transition-all duration-300 flex justify-between items-center active:scale-95
                      ${isSelected 
                        ? `${theme.btnBg} ${theme.text} ${theme.border} shadow-[0_0_20px_rgba(0,0,0,0.5),inset_0_0_15px_rgba(255,255,255,0.05)]` 
                        : `bg-slate-900/80 text-slate-300 border-slate-700/60 shadow-[0_0_10px_rgba(0,0,0,0.2)] hover:${theme.border} hover:${theme.text} hover:shadow-[0_0_15px_rgba(0,0,0,0.4)]`
                      }`}
                  >
                    <span className="text-[15px] md:text-[18px]">{opt}</span>
                    {isSelected && <CheckCircle2 className={`w-6 h-6 md:w-7 md:h-7 ${theme.text} drop-shadow-md`} />}
                  </button>
                );
              }) : (
                <div className="text-center py-6 text-slate-500 font-bold text-[15px] md:text-[18px]">ไม่พบข้อมูล</div>
              )}
            </div>
          </div>
        </div>,
        document.body
      ) : null}
    </div>
  );
}

// ==========================================
// 🌟 5. Main App Logic
// ==========================================

function MainApp({ onGoHome, initialRole }) {

  // =========================================================================
  // 🌟🌟 ฟันธงข้อ 3 สเต็ปที่ 1: วางสมองกลตรวจจับการเลื่อนจอตรงนี้เลยครับ! (บนสุด) 🌟🌟
  // =========================================================================
  const [isNavVisible, setIsNavVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const container = document.querySelector('.overflow-y-auto');
      if (!container) return;
      
      const currentScrollY = container.scrollTop;
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setIsNavVisible(false); // ไถลงล่าง -> ซ่อนเมนู
      } else {
        setIsNavVisible(true);  // ไถขึ้นบน -> โชว์เมนู
      }
      lastScrollY.current = currentScrollY;
    };

    const container = document.querySelector('.overflow-y-auto');
    if (container) container.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, []);
  // =========================================================================

  // 🌟 ฟันธงแก้: เปลี่ยนเป็น sessionStorage (จำเฉพาะตอนเปิดแอป ปิดแอปปุ๊บลืมทันที!)
  const [activeTab, setActiveTab] = useState(
    initialRole !== 'reporter' ? 'dashboard' : 'report'
  );

  useEffect(() => {
    sessionStorage.setItem('activeTab', activeTab);
  }, [activeTab]);


  // 🌟🌟🌟 จุดที่ 1: เติมบรรทัดนี้ลงไป! (สำคัญมาก ถ้าไม่มีระบบจะพัง) 🌟🌟🌟
  // ของเดิมอาจจะเป็น: const [dashTimeframe, setDashTimeframe] = useState('month');
  // ✅ แก้เป็นแบบนี้ครับ:
  const [dashTimeframe, setDashTimeframe] = useState('today');

  // ... (โค้ดด้านล่างของท่านปล่อยไว้เหมือนเดิมยาวๆ ได้เลยครับ ไม่ต้องไปแตะมัน)
  const [customMonth, setCustomMonth] = useState(''); // เก็บค่า YYYY-MM
  const [showMonthPicker, setShowMonthPicker] = useState(false); // ควบคุมการเปิด/ปิดป๊อปอัป
  const [pickerYear, setPickerYear] = useState(new Date().getFullYear()); // พ.ศ. ที่กำลังเลือกดู
  const [customDate, setCustomDate] = useState(''); // 🌟 เพิ่มตัวแปรเก็บค่าระบุวันที่
  const [showDatePicker, setShowDatePicker] = useState(false); // 🌟 ควบคุมป๊อปอัปปฏิทินรายวัน
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  
  // 🌟 ตัวแปรใหม่สำหรับหน้า "ติดตามสถานะ" (แยกสมองอิสระจากแผงควบคุม 100%)
  const [trackTimeframe, setTrackTimeframe] = useState('all'); 
  const [trackMonth, setTrackMonth] = useState('');
  const [trackDate, setTrackDate] = useState('');
  const [showTrackMonthPicker, setShowTrackMonthPicker] = useState(false);
  const [showTrackDatePicker, setShowTrackDatePicker] = useState(false);
  const [trackCalMonth, setTrackCalMonth] = useState(new Date().getMonth());
  const [trackCalYear, setTrackCalYear] = useState(new Date().getFullYear());

  const [hoveredTab, setHoveredTab] = useState(null);

  // ... โค้ดเดิมของท่าน ...
  const [sysTime, setSysTime] = useState(new Date());
  // ... โค้ดเดิมของท่าน ...

  //const sysTime = new Date('2026-05-23T20:00:00');
  
  // 🌟 ฟันธง: ล็อกโหมดตามที่กดมาจากหน้า Landing Page
  const [currentUserRole, setCurrentUserRole] = useState(
    initialRole || 'reporter'
  );

  const [user, setUser] = useState(null);

  // 🌟 ฟันธงจุดที่ 1: ให้ระบบดึงชื่อล่าสุดที่จำไว้ในเครื่องมาเป็นค่าเริ่มต้นทันที!
const [currentUserName, setCurrentUserName] = useState(() => localStorage.getItem('gse_remembered_name') || '');
  
  // =====================================================================
  // 🌟 ฟันธงจุดที่ 1: เพิ่มสมองกลตรวจจับ "การเข้าสู่ระบบครั้งแรก"
  // =====================================================================
  const [showWelcomePopup, setShowWelcomePopup] = useState(() => sessionStorage.getItem('gse_show_welcome') === 'true');
  
  useEffect(() => {
    // โชว์เสร็จปุ๊บ ลบทิ้งปั๊บ จะได้ไม่เด้งซ้ำเวลา Refresh หน้าจอ
    if (showWelcomePopup) sessionStorage.removeItem('gse_show_welcome');
  }, [showWelcomePopup]);


  // =====================================================================
  const [tickets, setTickets] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [authErrorMsg, setAuthErrorMsg] = useState('');

  // 🌟 ตัวควบคุมเปิด/ปิดหน้าจอ Admin Roster
  const [showAdminRoster, setShowAdminRoster] = useState(false);

  
// --- Auth Setup (อัปเกรดเฟส 2) ---
useEffect(() => {
  const initAuth = async () => {
    if (initialRole === 'reporter' && !auth.currentUser) {
      try { await signInAnonymously(auth); } catch (error) { setUser({ uid: 'public-bypass-user' }); }
    }
  };
  initAuth();

  const unsubscribeAuth = onAuthStateChanged(auth, async (u) => {
    if (u) {
      setUser(u);
      if (initialRole !== 'reporter') {
        try {
          const q = query(collection(db, 'staff_roles'), where('email', '==', u.email));
          const snap = await getDocs(q);
          if (!snap.empty) {
            const staffData = snap.docs[0].data();
            
            // =========================================================
            // 🌟 ฟันธงแก้บั๊ก (รอบ 2): บังคับดึงชื่อจากระบบที่มีคำนำหน้า (นาย/น.ส.) มาใช้เป็นหลัก!
            // เพื่อให้ชื่อตรงกับตั๋วแจ้งซ่อม 100% ช่างจะได้เห็นงานตัวเองไม่สูญหาย
            // =========================================================
            const dbPhone = String(staffData.phone || '').replace(/\D/g, '');
            const dbName = String(staffData.fullName || '').trim();
            
            let exactName = dbName; // ค่าเริ่มต้น

            // 1. ค้นหาเทียบใน technicianList ก่อน
            const matchedTech = technicianList.find(t => 
              (t.phone && String(t.phone).replace(/\D/g, '') === dbPhone) || 
              (t.name && t.name.includes(dbName))
            );

            // 2. ค้นหาเทียบใน techMapping (ที่ท่านเพิ่งอัปเดตภารกิจ)
            const mappedTech = Object.values(techMapping).find(t => 
              (t.phone && String(t.phone).replace(/\D/g, '') === dbPhone) ||
              (t.name && t.name.includes(dbName))
            );

            // 🌟 ลำดับความสำคัญ: เอาชื่อจากโค้ด (ที่มีคำนำหน้า) มาเขียนทับชื่อจาก Firebase
            if (matchedTech) {
              exactName = matchedTech.name;
            } else if (mappedTech) {
              exactName = mappedTech.name;
            }

            setCurrentUserName(exactName);
            localStorage.setItem('gse_remembered_name', exactName);
            localStorage.setItem('gse_remembered_phone', dbPhone);
          }
        } catch (err) { console.error("ดึงชื่อช่างไม่สำเร็จ", err); }
      }
    }
    else if (initialRole === 'reporter') setUser({ uid: 'public-bypass-user' });
  });

  return () => unsubscribeAuth();
}, [initialRole]);


  // --- Data Fetching ---
  useEffect(() => {
    if (!user) return;
    
    // 🌟 ฟันธง: สร้างคำสั่ง Query เพื่อเรียงตามวันที่ล่าสุด (desc) และจำกัดแค่ 500 รายการ
    const ticketsRef = query(
      collection(db, 'tickets'),
      orderBy('date', 'desc'),
      limit(500) // 🌟 เปลี่ยนเป็น 500 เพื่อเก็บประวัติให้ดูย้อนหลังผ่านปฏิทินได้สบายๆ
    );

    const unsubscribeData = onSnapshot(
      ticketsRef,

      (snapshot) => {
        try {
          const ticketsData = [];
          snapshot.forEach((doc) => {
            ticketsData.push({ dbId: doc.id, ...doc.data() });
          });
          ticketsData.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          setTickets(ticketsData);
          setIsDataLoading(false);
          setAuthErrorMsg('');
        } catch (e) {
          console.error('Data Parse Error:', e);
          setIsDataLoading(false);
        }
      },
      (error) => {
        console.error('Firebase Read Error:', error);
        setAuthErrorMsg('⚠️ โปรดตรวจสอบการตั้งค่า Firebase Rules');
        setIsDataLoading(false);
      }
    );
    return () => unsubscribeData();
  }, [user]);

  // ตัวนับเวลาหลัก
  useEffect(() => {
    const timer = setInterval(() => setSysTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 🌟 ฟันธง: สมองกลดึงรายชื่อเวรจากฐานข้อมูล rosters มาเก็บไว้เตรียมใช้งาน
  const [allRosters, setAllRosters] = useState([]);
  
  useEffect(() => {
    const q = collection(db, 'rosters');
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(doc => ({ ...doc.data(), date: doc.id }));
      setAllRosters(data);
    });
    return () => unsub();
  }, []);

  // --- Form States ---
  const [formData, setFormData] = useState({
    reporter: '',
    reporterContact: '',
    position: '',
    department: '',
    bureau: 'สำนักปฏิบัติการดาวเทียม',
    equipment: '',
    description: '',
    assetNumber: '',
    building: '',
    room: '',
    images: [],
    isSsc: false,
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [emailNotify, setEmailNotify] = useState(null);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [actionModal, setActionModal] = useState({
    isOpen: false,
    ticketId: null,
    type: null,
  });

  // =======================================================
  // 🎯 แทรกจุดที่ 1 ตรงนี้ครับ (ต่อจาก useState ตัวสุดท้าย)
  // =======================================================
  useEffect(() => {
    if (showImagePicker) {
      document.body.style.overflow = 'hidden'; // ล็อกไม่ให้ไถหน้าจอ
    } else {
      document.body.style.overflow = 'unset';  // ปลดล็อกเมื่อปิดป๊อบอัพ
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [showImagePicker]);
  // =======================================================

// 🌟 ฟันธง: ตัวแปรควบคุม Popup ประเมินความพึงพอใจ
const [ratingModal, setRatingModal] = useState({
  isOpen: false,
  ticketId: null,
  rating: 0,
  comment: '',
});

// 🌟 ฟันธง: ตัวแปรควบคุม Popup กราบขอบพระคุณ (หน้าต่างที่ 2 ต่อจากประเมิน)
const [showThanksModal, setShowThanksModal] = useState(false);
const [showNumpad, setShowNumpad] = useState(false); // 🌟 ควบคุม Numpad เบอร์โทร


// 🌟 ฟันธง: เก็บคำสำเร็จรูปที่ User เลือก
const [selectedTags, setSelectedTags] = useState([]);
  
// 🌟 ฟันธง: มาตรฐานคำสำเร็จรูปตามเกณฑ์ ISO/ITIL แยกตาม 1-5 ดาวแบบเจาะลึก
const tagsByRating = {
  5: ['💡 ซ่อมเสร็จก่อนกำหนด', '🛠️ แก้ปัญหาเด็ดขาด', '🤝 บริการดีเยี่ยม/สุภาพ', '🛡️ ให้คำแนะนำป้องกัน'],
  4: ['💡 เวลาซ่อมตามมาตรฐาน', '🛠️ ใช้งานได้ตามปกติ', '🤝 ตอบสนองรวดเร็ว', '🧹 พื้นที่ซ่อมเรียบร้อย'],
  3: ['⏱️ ซ่อมเสร็จแต่นานไปนิด', '🛠️ เป็นการแก้ไขชั่วคราว', '💬 ขาดการอัปเดตสถานะ', '🧹 งานยังไม่ค่อยเรียบร้อย'],
  2: ['⏱️ ซ่อมล่าช้ากว่ากำหนด SLA', '🛠️ ปัญหาเดิมเป็นซ้ำ', '📞 ติดต่อช่างยาก', '🛑 กระทบงานส่วนอื่น'],
  1: ['⛔ ทิ้งงาน/ล่าช้าขั้นวิกฤต', '🛠️ ซ่อมไม่สำเร็จ', '😡 บริการไม่สุภาพ', '💥 ทำให้ระบบอื่นพัง']
};
const toggleTag = (tag) => {
  let newTags;
  if (selectedTags.includes(tag)) {
    newTags = selectedTags.filter(t => t !== tag);
  } else {
    newTags = [...selectedTags, tag];
  }
  setSelectedTags(newTags);
  // ดึงคำไปยัดใส่กล่องข้อความอัตโนมัติ
  setRatingModal(prev => ({ ...prev, comment: newTags.join(' ') }));
};


  const [actionText, setActionText] = useState('');
  const [selectedTech, setSelectedTech] = useState('');
  const [lightboxImg, setLightboxImg] = useState(null);
  const [confirmSubmitModal, setConfirmSubmitModal] = useState(false);

  // --- KPI Timer Logic ---
  const getLiveStopwatch = (
    start,
    end,
    currentSysTime,
    totalPauseMs = 0,
    isCurrentlyOnHold = false,
    lastHoldAt = null
  ) => {
    if (!start) return '00:00:00';
    const startTime = new Date(start).getTime();
    let endTime = end ? new Date(end).getTime() : currentSysTime.getTime();

    if (isCurrentlyOnHold && lastHoldAt && !end) {
      endTime = new Date(lastHoldAt).getTime();
    }

    let diffMs = endTime - startTime - totalPauseMs;
    if (diffMs <= 0) return '00:00:00';

    // 🌟 ฟันธง: แยกจำนวนวันออกมา ถ้าเกิน 24 ชม. ให้โชว์คำว่า "วัน" นำหน้า
    const totalHrs = Math.floor(diffMs / 3600000);
    const days = Math.floor(totalHrs / 24);
    const hrs = totalHrs % 24;
    const mins = Math.floor((diffMs % 3600000) / 60000);
    const secs = Math.floor((diffMs % 60000) / 1000);
    
    const timeStr = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    return days > 0 ? `${days} วัน ${timeStr}` : timeStr;
  };


  const handleReporterChange = (name) => {
    const emp = employeeList.find((x) => x.name === name);
    const tech = technicianList.find((x) => x.name === name);

    let autofillPhone = formData.reporterContact;
    if (tech && tech.phone && tech.phone !== '-') {
      autofillPhone = tech.phone;
    }

    setFormData((prev) => ({
      ...prev,
      reporter: name,
      position: emp?.position || '',
      department: emp?.department || '',
      bureau: 'สำนักปฏิบัติการดาวเทียม',
      reporterContact: autofillPhone,
    }));
    
    // ====================================================================
    // 🌟 ฟันธง: ฝังชิปความจำให้แถบ Header ด้านบน เปลี่ยนชื่อตามทันทีแบบ Real-time!
    // ====================================================================
    localStorage.setItem('gse_remembered_name', name);
    setCurrentUserName(name);

    if (formErrors.reporter)
      setFormErrors((prev) => ({ ...prev, reporter: null }));
  };


  const handlePhoneChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 10) val = val.substring(0, 10);

    let formatted = val;
    if (val.length > 6) {
      formatted = `${val.substring(0, 2)}-${val.substring(
        2,
        6
      )}-${val.substring(6)}`;
    } else if (val.length > 2) {
      formatted = `${val.substring(0, 2)}-${val.substring(2)}`;
    }

    setFormData((prev) => ({ ...prev, reporterContact: formatted }));
    if (formErrors.reporterContact)
      setFormErrors((prev) => ({ ...prev, reporterContact: null }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const remainingSlots = 6 - formData.images.length;
    const filesToProcess = files.slice(0, remainingSlots);

    const promises = filesToProcess.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          // --- ระบบย่อขนาดรูปภาพ (Image Compression) ---
          const img = new Image();
          img.src = event.target.result;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 800; // กำหนดความกว้างสูงสุด
            const scaleSize = MAX_WIDTH / img.width;
            canvas.width = MAX_WIDTH;
            canvas.height = img.height * scaleSize;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // บีบอัดเป็น JPEG คุณภาพ 60% (ลดขนาดไฟล์ได้มหาศาล)
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
            resolve(compressedBase64);
          };
        };
      });
    });

    Promise.all(promises).then((imgs) => {
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...imgs] }));
      if (formErrors.images)
        setFormErrors((prev) => ({ ...prev, images: null }));
    });
    e.target.value = null;
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.reporter) errors.reporter = 'กรุณาระบุชื่อ-นามสกุลผู้แจ้ง';
    
    // 🌟 1. เกราะป้องกันเบอร์โทร (แก้บั๊กบรรทัด 410 เดิม)
    const phone = formData.reporterContact ? String(formData.reporterContact).replace(/\D/g, '') : '';
    if (phone.length !== 10) errors.reporterContact = 'กรุณาระบุเบอร์โทรศัพท์ 10 หลัก';
    
    if (!formData.equipmentCategory) errors.equipmentCategory = 'กรุณาระบุกลุ่มงาน/ภารกิจ';
    if (!formData.equipment) errors.equipment = 'กรุณาระบุอุปกรณ์/ระบบ';
    if (!formData.building) errors.building = 'กรุณาระบุอาคาร/ตึก';
    if (!formData.room) errors.room = 'กรุณาระบุสถานที่/ห้อง';
    if (!formData.description) errors.description = 'กรุณาระบุอาการเสีย';
    
    // 🌟 2. เกราะป้องกันรูปภาพ
    if (!formData.images || formData.images.length === 0) {
      errors.images = 'กรุณาแนบภาพอย่างน้อย 1 รูป';
    }
    
    return errors;
  };


// 🌟 ฟันธง: อัปเกรดระบบล้างฟอร์ม ให้ดึงข้อมูลผู้ใช้มาเติมอัตโนมัติเสมอ!
const handleResetForm = () => {
  let savedName = localStorage.getItem('gse_remembered_name') || currentUserName || '';
  const savedPhone = localStorage.getItem('gse_remembered_phone') || '';
  
  // จัดฟอร์แมตเบอร์โทรให้สวยงาม
  let formattedPhone = savedPhone;
  if (savedPhone.length === 10) {
    formattedPhone = `${savedPhone.substring(0, 2)}-${savedPhone.substring(2, 6)}-${savedPhone.substring(6)}`;
  }

  // ================================================================
  // 🌟 ฟันธงเกราะกู้ชีพ: ถ้าชื่อแหว่งหายไป ให้งัดชื่อจากฐานข้อมูลช่าง/พนักงานมาใส่แทนทันที!
  // ================================================================
  if (!savedName || savedName.trim() === '') {
    const rawPhone = savedPhone.replace(/\D/g, '');
    const matchedTech = technicianList.find(t => t.phone && t.phone.replace(/\D/g, '') === rawPhone);
    if (matchedTech) {
      savedName = matchedTech.name; // เจอเบอร์ตรงกัน ดึงชื่อมาใส่เลย!
      localStorage.setItem('gse_remembered_name', savedName);
    } else {
      savedName = 'ผู้ใช้งานระบบ'; // กันเหนียวสุดๆ ไม่ให้หน้าจอค้าง
    }
  }

  const emp = employeeList.find((x) => x.name === savedName) || technicianList.find((x) => x.name === savedName);

  setFormData({
    reporter: savedName,
    reporterContact: formattedPhone,
    position: emp?.position || '',
    department: emp?.department || '',
    bureau: 'สำนักปฏิบัติการดาวเทียม',
    equipment: '',
    description: '',
    assetNumber: '',
    building: '',
    room: '',
    equipmentCategory: '',
    images: [],
    isSsc: false,
  });
  setFormErrors({});
};

// 🌟 ฟันธง: สมองกลดึงข้อมูลใส่ฟอร์ม "ทันที" ที่เข้าหน้าแจ้งซ่อม (เกราะ 2 ชั้น)
useEffect(() => {
  if (activeTab === 'report') {
    handleResetForm();
  }
}, [activeTab]);

  

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validateForm();
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      const firstField = Object.keys(errs)[0];
      const el = document.getElementById(`field-${firstField}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setConfirmSubmitModal(true);
  };

  const executeSubmit = async () => {
    setConfirmSubmitModal(false); // ปิด Popup ยืนยัน

    // 🚨 ฟันธง: ลบ if (!user) return; ทิ้งไปเลยครับ! นี่คือตัวการที่ทำให้ระบบแกล้งตายเวลาเน็ตกระตุก
    
    setIsSubmitting(true);
    const newId = getNextReqId(tickets);

    // 🌟 1. ดึงช่างรับผิดชอบหลัก (จากกลุ่มภารกิจ)
    const selectedCategory = formData.equipmentCategory; 
    const autoAssignedTech = techMapping[selectedCategory];

    // 🌟 2. สมองกลดึงเวร SSC อัตโนมัติ
    let currentSscTechName = null;
    let currentSscTechPhone = null;
    let isHolidaySSC = false;

    try {
      const todayStr = new Date(sysTime).toISOString().split('T')[0];
      const sscRosterForDate = allRosters.find(r => r.date === todayStr);
      
      if (sscRosterForDate && sscRosterForDate.techName && sscRosterForDate.techName.trim() !== '') {
        isHolidaySSC = true;
        currentSscTechName = sscRosterForDate.techName;
        currentSscTechPhone = sscRosterForDate.techPhone;
      }
    } catch (error) {
      console.error("SSC Error:", error);
    }

    // 🌟 3. ประกอบร่างข้อมูล (ฟันธง: คลีนขยะ undefined ทิ้ง 100% ป้องกัน Firebase ช็อคตาย)
    const newTicket = {
      id: newId,
      reporter: formData.reporter || '',
      reporterContact: formData.reporterContact || '',
      position: formData.position || '',
      department: formData.department || '',
      bureau: formData.bureau || 'สำนักปฏิบัติการดาวเทียม',
      equipment: formData.equipment || '',
      description: formData.description || '',
      assetNumber: formData.assetNumber || '',
      building: formData.building || '',
      room: formData.room || '',
      equipmentCategory: formData.equipmentCategory || '',
      images: formData.images || [],
      isSsc: formData.isSsc || false,
      techName: autoAssignedTech ? autoAssignedTech.name : 'รอเจ้าหน้าที่รับงาน',
      techPhone: autoAssignedTech ? autoAssignedTech.phone : '-',
      sscTechName: currentSscTechName || null,
      sscTechPhone: currentSscTechPhone || null,
      status: 'pending',
      isOutOfHours: isHolidaySSC, 
      date: new Date().toISOString(),
    };

    try {
      // 🌟 ยิงข้อมูลขึ้น Database
      await addDoc(collection(db, 'tickets'), newTicket);

      // 🌟 ฟันธง 1: บันทึกเบอร์โทรลงเครื่องทันที! (แก้ปัญหาแจ้งซ่อมเสร็จแล้วงานหาย)
      if (newTicket.reporterContact) {
        localStorage.setItem('gse_remembered_phone', String(newTicket.reporterContact).replace(/\D/g, ''));
        localStorage.setItem('gse_remembered_name', newTicket.reporter);
      }

      setShowSuccess(true); // สั่งเปิดหน้าต่างเขียวๆ!
      // 🌟 ยิง LINE แจ้งเตือน
      const gasUrl = "https://script.google.com/macros/s/AKfycbxBoB_e637WkWMeSuX9NP3BSKcSiE8J3dSXmlzNV9aeiq6DRUvn81bSp6w-B0nzCVA5/exec"; 
      let primaryTech = "ทีมช่าง ฝวด."; 
      
      if (formData.equipmentCategory === 'ภารกิจด้านจานสายอากาศ') {
        primaryTech = "คุณทศพล ชินนิวัฒน์"; 
      } else if (formData.equipmentCategory === 'ภารกิจด้านคอมพิวเตอร์แม่ข่าย-THEOS') {
        primaryTech = "คุณชุติพงษ์ ลาวงศ์เกิด"; 
      } else if (formData.equipmentCategory === 'ภารกิจด้านคอมพิวเตอร์แม่ข่าย-THEOS-2') {
        primaryTech = "คุณธนกาญจน์ ไตรปิฎก"; 
      } else if (formData.equipmentCategory === 'ภารกิจด้านโครงสร้างพื้นฐานไฟฟ้า') {
        primaryTech = "คุณประมินทร์ พิชิตการค้า"; 
      } else if (formData.equipmentCategory === 'ภารกิจด้านการให้บริการโครงการ SSC') {
        primaryTech = "คุณนรัตว์ ศรีสวัสดิ์พงษ์"; 
      }

      fetch(gasUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' }, 
        body: JSON.stringify({
          ticketId: newId,
          equipment: formData.equipment,
          description: formData.description,
          reporter: formData.reporter,
          phone: formData.reporterContact,
          primaryTech: primaryTech,
          status: 'NEW',
          building: formData.building,
          room: formData.room
        })
      }).catch(err => console.error(err));

      // 🌟 สั่งรันหน้าต่างเขียว 5 วินาที แล้วเคลียร์ข้อมูลเก่าทิ้งทั้งหมด!
      setTimeout(() => {
        setShowSuccess(false);
        handleResetForm(); // 🌟 ฟันธง: เติมคำสั่งนี้! ล้างฟอร์มให้สะอาดกริ๊บ ไม่ค้างหน้าเดิม!
        setFilterStatus('all');
        setActiveTab('tracking');
      }, 5000);
      
    } catch (e) {
      console.error("Submit Error:", e);
      // 🚨 ฟันธง: ถ้าระบบพัง จะต้องโชว์ Alert ทันที! ห้ามแกล้งตายเงียบๆ เด็ดขาด!
      alert("❌ เกิดข้อผิดพลาดในการส่งข้อมูล: " + e.message + "\n\nกรุณาลองกดส่งใหม่อีกครั้ง หรือเช็คอินเทอร์เน็ตครับ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateTicketStatus = async (ticketId, updates) => {
    if (!user) return;
    const target = tickets.find((t) => t.id === ticketId);
    if (!target || !target.dbId) return;
    try {
      await updateDoc(doc(db, 'tickets', target.dbId), updates);
    } catch (e) {
      console.error(e);
    }
  };

  const executeActionModal = async () => {
    const { ticketId, type } = actionModal;
    let updates = {};
    
    // 🌟 1. ดึงข้อมูลประวัติเดิมมาเตรียมต่อคิว (Timeline)
    const target = tickets.find((t) => t.id === ticketId);
    const currentLog = target?.historyLog || [];
    
    if (type === 'accept') {
      if (!selectedTech) return;
      const tech = technicianList.find((t) => t.name === selectedTech);
      updates = {
        status: 'in_progress',
        acceptedAt: new Date().toISOString(),
        startedAt: new Date().toISOString(),
        techName: tech.name,
        techPhone: tech.phone || 'N/A',
      };
    } else if (type === 'hold') {
      updates = {
        status: 'on_hold',
        holdReason: actionText,
        lastHoldAt: new Date().toISOString(),
        historyLog: [...currentLog, { type: 'hold', reason: actionText, timestamp: new Date().toISOString() }]
      };
    } else if (type === 'finish') {
      updates = {
        status: 'completed',
        cause: actionText,
        completedAt: new Date().toISOString(),
      };
    } else if (type === 'cancel') {
      updates = {
        status: 'cancelled',
        cancelReason: actionText,
        cancelledAt: new Date().toISOString(),
      };
    } else if (type === 'ssc') { // 🌟 กลับมาแล้ว! ไม่ยัดลง HistoryLog เพื่อป้องกันบั๊ก!
      updates = { 
        sscNote: actionText,
        status: 'pending', 
      };
    } else if (type === 'resume') {
      let pauseDurationMs = 0;
      if (target && target.lastHoldAt) {
        pauseDurationMs = new Date().getTime() - new Date(target.lastHoldAt).getTime();
      }
      updates = {
        status: 'in_progress',
        resumeReason: actionText,
        totalPauseMs: ((target ? target.totalPauseMs : 0) || 0) + pauseDurationMs,
        lastHoldAt: null,
        historyLog: [...currentLog, { type: 'resume', reason: actionText, timestamp: new Date().toISOString(), pauseDurationMs: pauseDurationMs }]
      };
    }    

    // 🌟 2. อัปเดตขึ้นฐานข้อมูล
    await updateTicketStatus(ticketId, updates);

    // 🌟 3. โค้ดส่งแจ้งเตือน LINE ของท่าน (ปล่อยไว้เหมือนเดิม ไม่กระทบ)
    if (type === 'accept' || type === 'finish') {
      if (target) {
        try {
          fetch("https://script.google.com/macros/s/AKfycbxBoB_e637WkWMeSuX9NP3BSKcSiE8J3dSXmlzNV9aeiq6DRUvn81bSp6w-B0nzCVA5/exec", {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' }, 
            body: JSON.stringify({
              ticketId: target.id,
              equipment: target.equipment,
              description: target.description,
              reporter: target.reporter,
              phone: target.reporterContact || "N/A",
              primaryTech: selectedTech || target.techName || "ทีมช่าง ฝวด.",
              building: target.building,
              room: target.room,
              status: type === 'accept' ? 'ACCEPTED' : 'COMPLETED' 
            })
          });
        } catch (err) { console.error("Line Notify Error:", err); }
      }
    }
  
    // 🌟 4. ล้างค่าในป๊อปอัปให้สะอาด
    setActionModal({ isOpen: false, ticketId: null, type: null });
    setActionText('');
    setSelectedTech('');
  };

// 🌟 ฟันธง: ฟังก์ชันส่งผลประเมินและปิดงานสมบูรณ์
const executeRatingSubmit = async () => {
  if (ratingModal.rating === 0) return; 
  
  await updateTicketStatus(ratingModal.ticketId, {
    status: 'verified',
    rating: ratingModal.rating,
    ratingComment: ratingModal.comment,
    verifiedAt: new Date().toISOString(),
  });
  
  // 🌟 ฟันธงแก้บั๊กสีชมพูค้าง: ปิดแค่หน้าต่างประเมิน แต่ "ห้ามล้างค่าดาว" เพื่อให้หน้าขอบคุณเอาสีไปใช้ต่อ!
  setRatingModal(prev => ({ ...prev, isOpen: false }));
  setSelectedTags([]); 

  setShowThanksModal(true); 
  
  // ตั้งเวลาปิดหน้าต่างอัตโนมัติ (ท่านแก้ตัวเลข 8000 เป็นเวลาที่ต้องการได้เลยครับ 8000 = 8 วินาที)
  setTimeout(() => {
    setShowThanksModal(false);
    // ค่อยมาล้างค่าระบบจริงๆ หลังจากหน้าต่างขอบคุณปิดลงไปแล้ว
    setRatingModal({ isOpen: false, ticketId: null, rating: 0, comment: '', techName: '' });
  }, 8000); 
};
 
  // 🌟 ฟันธง: ตัวคำนวณสถิติที่รองรับปฏิทินย้อนหลังแบบ 100%
  const stats = useMemo(() => {
    try {
      const now = new Date();
      
      const filteredByTime = tickets.filter(t => {
        if (!t.date) return false;

        // 🌟 1. ด่านจำกัดสิทธิ์: ถ้าไม่ใช่หัวหน้า ให้นับสถิติเฉพาะงานตัวเองเท่านั้น!
        if (currentUserRole !== 'Commander' && currentUserRole !== 'reporter') {
          const isMyJob = t.techName === currentUserName || t.sscTechName === currentUserName;
          const isUnassigned = !t.techName || t.techName === 'รอเจ้าหน้าที่รับงาน';
          if (!isMyJob && !isUnassigned) return false; // ไม่ใช่งานตัวเอง เตะออกจากการคำนวณสถิติ
        }
        
        const tDate = new Date(t.date);

        // 📅 1. กรณีหัวหน้ากดเลือก "ระบุเดือน"
        if (dashTimeframe === 'custom' && customMonth) {
          const [year, month] = customMonth.split('-');
          return tDate.getFullYear() === parseInt(year) && (tDate.getMonth() + 1) === parseInt(month);
        }

        // 📅 2. กรณีหัวหน้ากดเลือก "ระบุวัน"
        if (dashTimeframe === 'custom_date' && customDate) {
          const selectedD = new Date(customDate);
          return tDate.getFullYear() === selectedD.getFullYear() && 
                 tDate.getMonth() === selectedD.getMonth() && 
                 tDate.getDate() === selectedD.getDate();
        }

        // 📅 3. กรณีอื่นๆ
        if (dashTimeframe === 'all') return true;
        if (dashTimeframe === 'today') return tDate.toDateString() === now.toDateString();
        if (dashTimeframe === 'week') {
          const firstDayOfWeek = new Date(now);
          const currentDay = now.getDay();
          const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay; // บังคับเริ่มวันจันทร์
          firstDayOfWeek.setDate(now.getDate() + diffToMonday);
          firstDayOfWeek.setHours(0, 0, 0, 0);
          return tDate >= firstDayOfWeek;
        }
        if (dashTimeframe === 'month') {
          return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
        }
        return true;
      });

      // ==================================================
      // 🌟 ฟันธงสมองกลใหม่: จำแนกยอดงานแยกตาม "ภารกิจ"
      // ==================================================
      const categoryBreakdown = {};
      filteredByTime.forEach(t => {
        const cat = t.equipmentCategory || 'ไม่ระบุภารกิจ';
        if (!categoryBreakdown[cat]) {
          categoryBreakdown[cat] = { count: 0, techs: new Set() };
        }
        categoryBreakdown[cat].count += 1;
        // เก็บรายชื่อช่างที่รับผิดชอบงานในกลุ่มนี้ (ไม่เอาคำว่า รอเจ้าหน้าที่)
        if (t.techName && t.techName !== 'รอเจ้าหน้าที่รับงาน') {
          categoryBreakdown[cat].techs.add(t.techName);
        }
      });
      
      // แปลง Set เป็น Array ให้ React เอาไปเรนเดอร์ได้ และเรียงลำดับจากงานเยอะสุดไปน้อยสุด
      const formattedBreakdown = Object.keys(categoryBreakdown).map(cat => ({
        category: cat,
        count: categoryBreakdown[cat].count,
        techs: Array.from(categoryBreakdown[cat].techs).join(', ') || 'รอผู้รับผิดชอบ'
      })).sort((a, b) => b.count - a.count);

      return {
        total: filteredByTime.length,
        pending: filteredByTime.filter((t) => t.status === 'pending').length,
        fixing: filteredByTime.filter((t) => ['acknowledged', 'in_progress', 'on_hold'].includes(t.status)).length,
        done: filteredByTime.filter((t) => ['completed', 'verified'].includes(t.status)).length,
        cancelled: filteredByTime.filter((t) => t.status === 'cancelled').length,
        ratedCount: filteredByTime.filter((t) => t.rating > 0).length,
        avgRating: filteredByTime.filter((t) => t.rating > 0).length > 0 
          ? (filteredByTime.filter((t) => t.rating > 0).reduce((sum, t) => sum + t.rating, 0) / filteredByTime.filter((t) => t.rating > 0).length).toFixed(1) 
          : 0,
        missionBreakdown: formattedBreakdown // 🌟 ส่งข้อมูลตารางภารกิจออกไปให้หน้าจอ
      };
    } catch (err) {
      console.error("Stats Error:", err);
      return { total: 0, pending: 0, fixing: 0, done: 0, cancelled: 0, ratedCount: 0, avgRating: 0, missionBreakdown: [] };
    }
  }, [tickets, dashTimeframe, customMonth, customDate, currentUserRole, currentUserName]);



  // 🌟 ลิสต์รายการงานสำหรับหน้า "ติดตามสถานะ/จัดการงาน" (ฉบับยืดหยุ่นสูงสุด งานไม่หาย จอไม่ดำ)
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      
     // =========================================================
          // 🌟 1. ด่านจำกัดสิทธิ์ (ยืดหยุ่นขึ้น ตรวจจับตัวตนได้แม่นยำ)
          // =========================================================
          if (currentUserRole !== 'Commander') {
            if (currentUserRole === 'reporter') {

              // ดึงข้อมูลชื่อ/เบอร์ จากทุกกระเป๋า กันเหนียวค่าว่าง
              const myName = String(currentUserName || sessionStorage.getItem('userName') || localStorage.getItem('gse_remembered_name') || '').trim();
              
              // 🌟 ฟันธง 2: สกัดเอาเฉพาะ "ตัวเลขล้วนๆ" ลบขีด (-) ทิ้งไปให้หมด!
              const rawMyPhone = String(sessionStorage.getItem('userPhone') || localStorage.getItem('gse_remembered_phone') || '').trim();
              const myPhone = rawMyPhone.replace(/\D/g, ''); 

              const tName = String(t.reporter || '').trim();
              
              // 🌟 ฟันธง 2: ลบขีด (-) ออกจากฐานข้อมูลด้วย เพื่อให้เทียบกันตรงเป๊ะ 1,000,000%
              const rawTPhone = String(t.reporterContact || t.contact || '').trim();
              const tPhone = rawTPhone.replace(/\D/g, ''); 

              // เทียบชื่อ หรือ เบอร์โทร (ขอแค่อย่างใดอย่างหนึ่งตรงกัน หรือคล้ายกัน ก็ให้ผ่าน!)
              const matchName = (myName !== '' && tName !== '') && (tName.includes(myName) || myName.includes(tName));
              const matchPhone = (myPhone !== '' && tPhone !== '') && (tPhone === myPhone);

              if (myName === '' && myPhone === '') {
                 // ถ้าระบบไม่มีข้อมูลล็อกอินเลย ให้ใช้ช่องค้นหา (Search) เท่านั้นถึงจะเห็นงาน
                 if (!searchTerm) return false;
              } else {
                 // ถ้าล็อกอินแล้ว แต่ชื่อและเบอร์ไม่ตรงกับตั๋วเลย ถึงจะซ่อน
                 if (!matchName && !matchPhone) return false;
              }

            } else {
              // 👨‍🔧 สำหรับช่าง
              const isMyJob = t.techName === currentUserName || t.sscTechName === currentUserName;
              const isUnassigned = !t.techName || t.techName === 'รอเจ้าหน้าที่รับงาน';
              if (!isMyJob && !isUnassigned) return false;
            }
          }

      // =========================================================
      // 🌟 2. ด่านกรองวันที่
      // =========================================================
      let timeMatch = true;
      if (t.date) {
        const tDate = new Date(t.date);
        if (trackTimeframe === 'custom_month' && trackMonth) {
          const parts = trackMonth.split('-');
          if (parts.length === 2) {
            timeMatch = tDate.getFullYear() === parseInt(parts[0]) && (tDate.getMonth() + 1) === parseInt(parts[1]);
          }
        } else if (trackTimeframe === 'custom_date' && trackDate) {
          const selectedD = new Date(trackDate);
          timeMatch = tDate.getFullYear() === selectedD.getFullYear() && 
                      tDate.getMonth() === selectedD.getMonth() && 
                      tDate.getDate() === selectedD.getDate();
        } else if (trackTimeframe === 'week') {
          const now = new Date();
          const firstDayOfWeek = new Date(now);
          const currentDay = now.getDay();
          const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;
          firstDayOfWeek.setDate(now.getDate() + diffToMonday);
          firstDayOfWeek.setHours(0, 0, 0, 0);
          timeMatch = tDate >= firstDayOfWeek;
        }
      }
      if (!timeMatch) return false;

      // =========================================================
      // 🌟 3. ด่านกรองค้นหา (Search) - ใส่ String() ครอบกันจอดำ 100%
      // =========================================================
      const searchStr = String(searchTerm || '').toLowerCase();
      if (searchStr) {
        const matchSearch =
          String(t.equipment || '').toLowerCase().includes(searchStr) ||
          String(t.id || '').toLowerCase().includes(searchStr) ||
          String(t.reporter || '').toLowerCase().includes(searchStr) ||
          String(t.techName || '').toLowerCase().includes(searchStr);
          
        if (!matchSearch) return false;
      }
      
      // =========================================================
      // 🌟 4. ด่านกรองสถานะ (Tab)
      // =========================================================
      if (filterStatus === 'all') return true;
      if (filterStatus === 'fixing') return ['acknowledged', 'in_progress', 'on_hold'].includes(t.status);
      if (filterStatus === 'completed') return t.status === 'verified';
      if (filterStatus === 'on_hold') return t.status === 'on_hold';
      if (filterStatus === 'verify') return t.status === 'completed';
        
      return t.status === filterStatus;
      
    });
  }, [tickets, searchTerm, filterStatus, trackTimeframe, trackMonth, trackDate, currentUserRole, currentUserName]);


  // 🌟 ฟันธง: สมองกลสะพานเชื่อม แปลงเวลาจากแผงควบคุม ส่งไปหน้า Tracking ให้ตรงเป๊ะ!
  const handleNavigateToTracking = (status) => {
    setActiveTab('tracking');
    setFilterStatus(status);
    setSearchTerm('');
    
    const d = new Date(sysTime); // ดึงเวลาปัจจุบันมาเตรียมไว้
    const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

    if (dashTimeframe === 'today') {
      setTrackTimeframe('custom_date');
      setTrackDate(todayStr); // แปลง "วันนี้" เป็นวันที่เป๊ะๆ
    } else if (dashTimeframe === 'month') {
      setTrackTimeframe('custom_month');
      setTrackMonth(monthStr); // แปลง "เดือนนี้" เป็นเดือนเป๊ะๆ
    } else if (dashTimeframe === 'custom') {
      setTrackTimeframe('custom_month');
      setTrackMonth(customMonth); // แปลงระบุเดือน ให้ชื่อตรงกัน
    } else if (dashTimeframe === 'custom_date') {
      setTrackTimeframe('custom_date');
      setTrackDate(customDate); // ระบุวัน ตรงกันอยู่แล้ว
    } else if (dashTimeframe === 'week') {
      setTrackTimeframe('week'); // ส่งค่าสัปดาห์นี้ไปประมวลผล
    } else {
      setTrackTimeframe('all');
    }
  };


  // ==========================================
  // 🎨 Views Rendering
  // ==========================================

  // 🌟🌟🌟 จุดที่ 3: วางทับ renderDashboard จนถึงก่อนบรรทัด grid grid-cols-2 🌟🌟🌟
  const renderDashboard = () => {
    const completionRate =
      stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

    // 🌟 1. ฟังก์ชันดึงงานรอนาน (อัปเกรด: ต้องรอเกิน 60 นาทีถึงจะโชว์)
    const longestPendingTicket = tickets
      .filter((t) => {
        if (t.status !== 'pending') return false;
        // คำนวณเวลาที่รอเป็นนาที
        const waitingMin = getMinutesDiff(t.date, sysTime);
        // 🌟 ฟันธง: บังคับว่าต้องรอเกิน 60 นาที (1 ชม.) ถึงจะขึ้นแท่น "รอนานที่สุด"
        return waitingMin > 60; 
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

    // 🌟 2. ฟังก์ชันดึงงานซ่อมมาราธอน (อัปเกรด: ต้องซ่อมเกิน 4 ชั่วโมงถึงจะโชว์)
    const longestFixingTicket = tickets
      .filter((t) => {
        if (t.status !== 'in_progress' && t.status !== 'on_hold') return false;
        // คำนวณเวลาที่กำลังซ่อมเป็นนาที
        const fixingMin = getMinutesDiff(t.startedAt || t.date, sysTime);
        // 🌟 ฟันธง: บังคับว่าต้องซ่อมเกิน 240 นาที (4 ชม. ตามเกณฑ์ SLA) ถึงจะขึ้นแท่น "ซ่อมมาราธอน"
        return fixingMin > 240; 
      })
      .sort((a, b) => {
        const timeA = new Date(a.startedAt || a.date).getTime();
        const timeB = new Date(b.startedAt || b.date).getTime();
        return timeA - timeB;
      })[0];

    // 🌟 ฟังก์ชันอัจฉริยะแปลงป้ายวันที่ (รองรับปฏิทินย้อนหลัง)
    const getTimeframeLabel = () => {
      const now = new Date(sysTime);
      const monthsFull = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
      const monthsShort = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

      // ถ้าเลือกระบุเดือน
      if (dashTimeframe === 'custom' && customMonth) {
        const [year, month] = customMonth.split('-');
        return `ผลงานเดือน ${monthsFull[parseInt(month) - 1]} ${parseInt(year) + 543}`;
      }
      
      // ถ้าเลือกระบุวัน
      if (dashTimeframe === 'custom_date' && customDate) {
        const d = new Date(customDate);
        return `ผลงานวันที่ ${d.getDate()} ${monthsFull[d.getMonth()]} ${d.getFullYear() + 543}`;
      }

      if (dashTimeframe === 'today') return `วันที่ ${now.getDate()} ${monthsFull[now.getMonth()]} ${now.getFullYear() + 543}`;
      if (dashTimeframe === 'week') {
        const day = now.getDay();
        const diffToMonday = day === 0 ? -6 : 1 - day;
        const first = new Date(now);
        first.setDate(now.getDate() + diffToMonday); // จันทร์
        const last = new Date(first);
        last.setDate(first.getDate() + 6); // อาทิตย์
        return `${first.getDate()} ${monthsShort[first.getMonth()]} - ${last.getDate()} ${monthsShort[last.getMonth()]} ${last.getFullYear() + 543}`;
      }
      if (dashTimeframe === 'month') return `เดือน ${monthsFull[now.getMonth()]} ${now.getFullYear() + 543}`;
      return 'ตั้งแต่เริ่มระบบ (All Time)';
    };

    return (
      <div className="px-5 pb-5 pt-2 space-y-5 animate-in fade-in duration-500 pb-32">
        

        {/* 📅 1. แถบวันที่แบบยาว (อัปเกรด: เพิ่มปุ่มฟันเฟืองทางลับสำหรับแอดมินด้านขวา) */}
        <div className="bg-slate-800/60 backdrop-blur-xl border-2 border-solid border-orange-500/80 rounded-[1rem] py-4 md:py-5 md:text-[18px] flex items-center justify-between px-4 shadow-[0_0_20px_rgba(249,115,22,0.4)] font-sans tracking-widest text-white font-bold relative">
          <div className="w-10"></div> {/* กล่องดัมมี่ เพื่อดันให้วันที่อยู่ตรงกลางเป๊ะๆ */}
          <div className="flex-1 text-center">{ThaiDateFormatter(sysTime)}</div>
          
          {/* 🌟 ฟันธง: ปุ่มทางลับแอดมิน */}
          <button 
            onClick={() => setShowAdminRoster(true)}
            className="w-10 h-10 flex items-center justify-center bg-slate-700/50 hover:bg-cyan-500/30 text-slate-400 hover:text-cyan-400 rounded-full border border-slate-600 hover:border-cyan-400 transition-all active:scale-90"
            title="ตั้งค่าเวร SSC ประจำวัน"
          >
            <Settings size={20} className="md:w-6 md:h-6" />
          </button>
        </div>

{/* ========================================================= */}
          {/* 🌟 ฟันธงจุดที่ 1: วิดเจ็ตเจ้าหน้าที่เวร SSC ประจำวัน (แสดงในหน้าแผงควบคุม) */}
          {(() => {
            const today = new Date(sysTime);
            const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
            const sscRosterForDate = allRosters.find(r => r.date === todayStr);
            
            let autoSscPhone = sscRosterForDate?.techPhone;
            if (sscRosterForDate?.techName) {
              const foundTech = technicianList.find(t => t.name === sscRosterForDate.techName);
              if (foundTech && foundTech.phone && foundTech.phone !== '-') autoSscPhone = foundTech.phone;
            }

            const dutyPerson = sscRosterForDate ? { techName: sscRosterForDate.techName, techPhone: autoSscPhone, isHoliday: sscRosterForDate.isHoliday, holidayName: sscRosterForDate.holidayName } : null;
            const dayOfWeek = today.getDay();
            const daysThai = ['วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'];

            if (dutyPerson?.techName) {
              let wTheme = { bg: 'bg-purple-500/20', border: 'border-purple-500/80', textHead: 'text-purple-400', textName: 'text-purple-400', glow: 'shadow-[0_0_30px_rgba(168,85,247,0.3)]', iconGlow: 'shadow-[0_0_10px_rgba(168,85,247,1)]', iconText: 'text-purple-400', dayLabel: daysThai[dayOfWeek] };
              if (dutyPerson?.isHoliday) wTheme = { bg: 'bg-orange-500/20', border: 'border-orange-500/80', textHead: 'text-orange-400', textName: 'text-orange-400', glow: 'shadow-[0_0_30px_rgba(249,115,22,0.3)]', iconGlow: 'shadow-[0_0_10px_rgba(249,115,22,1)]', iconText: 'text-orange-400', dayLabel: `วันหยุดนักขัตฤกษ์ (${dutyPerson.holidayName})` };
              else if (dayOfWeek === 0) wTheme = { bg: 'bg-rose-500/20', border: 'border-rose-500/80', textHead: 'text-rose-400', textName: 'text-rose-400', glow: 'shadow-[0_0_30px_rgba(225,29,72,0.3)]', iconGlow: 'shadow-[0_0_10px_rgba(225,29,72,1)]', iconText: 'text-rose-400', dayLabel: 'วันอาทิตย์' };
              else if (dayOfWeek === 6) wTheme = { bg: 'bg-sky-500/20', border: 'border-sky-500/80', textHead: 'text-sky-400', textName: 'text-sky-400', glow: 'shadow-[0_0_30px_rgba(14,165,233,0.3)]', iconGlow: 'shadow-[0_0_10px_rgba(14,165,233,1)]', iconText: 'text-sky-400', dayLabel: 'วันเสาร์' };

              return (
                <div className={`relative bg-slate-900/80 backdrop-blur-xl border-[2px] border-solid ${wTheme.border} rounded-[1.5rem] p-5 md:p-8 ${wTheme.glow} mt-4 mb-4 overflow-hidden`}>
                  <div className={`absolute -top-20 -left-20 w-40 h-40 ${wTheme.bg} blur-[60px] rounded-full pointer-events-none z-0`}></div>
                  <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8 pb-4 border-b-2 border-dashed border-slate-600/50 relative z-10">
                    <div className={`bg-slate-950 border-[2px] border-solid ${wTheme.border} p-2 md:p-3 rounded-xl shadow-sm relative`}>
                      <User className={`${wTheme.iconText} w-5 h-5 md:w-7 md:h-7`} strokeWidth={2.5} />
                      <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 md:w-3 md:h-3 bg-emerald-500 rounded-full animate-pulse border-2 border-slate-900 ${wTheme.iconGlow}`}></span>
                    </div>
                    <h2 className={`text-[16px] md:text-[22px] font-black ${wTheme.textHead} tracking-widest uppercase drop-shadow-sm`}>
                      เจ้าหน้าที่เวร SSC | {wTheme.dayLabel}
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5 relative z-10 animate-in fade-in zoom-in-95 duration-500">
                    <div className={`bg-slate-950/50 border ${wTheme.border.replace('80', '30')} rounded-2xl p-4 flex items-center gap-4 shadow-inner`}>
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${wTheme.bg} flex items-center justify-center border ${wTheme.border.replace('80', '50')} shrink-0`}>
                         <User className={`${wTheme.iconText} w-5 h-5 md:w-6 md:h-6`} />
                      </div>
                      <div className="overflow-hidden">
                        <p className={`text-[11px] md:text-[13px] font-bold ${wTheme.textHead} opacity-70 uppercase tracking-widest mb-0.5`}>ชื่อ-นามสกุล (เวรประจำวัน)</p>
                        <p className={`text-[16px] md:text-[20px] font-black ${wTheme.textName} drop-shadow-sm truncate`}>{dutyPerson.techName}</p>
                      </div>
                    </div>
                    <div className={`bg-slate-950/50 border ${wTheme.border.replace('80', '30')} rounded-2xl p-4 flex items-center gap-4 shadow-inner`}>
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${wTheme.bg} flex items-center justify-center border ${wTheme.border.replace('80', '50')} shrink-0`}>
                         <Phone className={`${wTheme.iconText} w-5 h-5 md:w-6 md:h-6`} />
                      </div>
                      <div className="overflow-hidden flex-1">
                        <p className={`text-[11px] md:text-[13px] font-bold ${wTheme.textHead} opacity-70 uppercase tracking-widest mb-0.5`}>เบอร์โทรศัพท์ (ติดต่อด่วน)</p>
                        {dutyPerson.techPhone && dutyPerson.techPhone !== '-' ? (
                           <a href={`tel:${dutyPerson.techPhone.replace(/\D/g, '')}`} className={`text-[16px] md:text-[20px] font-black font-mono tracking-wider ${wTheme.textName} drop-shadow-sm truncate hover:opacity-80 transition-opacity block`}>{formatDisplayPhone(dutyPerson.techPhone)}</a>
                        ) : ( <p className={`text-[16px] md:text-[20px] font-black font-mono tracking-wider text-slate-500 drop-shadow-sm truncate`}>ไม่มีข้อมูล</p> )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
            return null; // วันธรรมดาไม่ต้องโชว์
          })()}
          {/* ========================================================= */}


       {/* 🔘 2. สวิตช์เลือกกรอบเวลา (ปรับเป็น ธีม Sci-Fi Cyan & Orange พรีเมียม 1,000,000%) */}
       <div className="flex gap-2 bg-slate-800/80 p-2 rounded-2xl border-[2px] border-solid border-slate-700 shadow-inner mt-4 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-x">
          {[
            { id: 'today', label: 'วันนี้' },
            { id: 'week', label: 'สัปดาห์นี้' },
            { id: 'month', label: 'เดือนนี้' },
          ].map((tf) => (
            <button
              key={tf.id}
              onClick={() => setDashTimeframe(tf.id)}
              className={`flex-1 min-w-[75px] shrink-0 text-[16px] md:text-[20px] font-black py-2.5 md:py-3.5 rounded-xl transition-all duration-300 snap-center whitespace-nowrap ${
                dashTimeframe === tf.id
                  // 🟠 Active: สีส้มทอง GSE (ขยายตัวนิดๆ)
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-[2px] border-solid border-orange-300 shadow-[0_0_15px_rgba(249,115,22,0.8)] scale-[1.02] z-10' 
                  // 🔵 Inactive: สีฟ้าเรืองแสง Sci-Fi (เด้งรับเมาส์)
                  : 'bg-slate-950 text-cyan-300 border-[2px] border-solid border-cyan-400/30 shadow-[0_0_8px_rgba(34,211,238,0.3)] hover:bg-slate-900 hover:text-cyan-200 hover:border-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.6)] hover:-translate-y-0.5' 
              }`}
            >
              {tf.label}
            </button>
          ))}

          {/* 🌟 ปฏิทิน ระบุวัน (Centered + Orange Glow) */}
          <div className="relative flex-1 min-w-[95px] shrink-0 flex justify-center snap-center">
             <button 
               onClick={() => setShowDatePicker(true)}
               className={`w-full relative z-10 text-[16px] md:text-[20px] font-black py-2.5 md:py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 whitespace-nowrap ${
                 dashTimeframe === 'custom_date' 
                   ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-[2px] border-solid border-orange-300 shadow-[0_0_15px_rgba(249,115,22,0.8)] scale-[1.02] z-10' 
                   : 'bg-slate-950 text-cyan-300 border-[2px] border-solid border-cyan-400/30 shadow-[0_0_8px_rgba(34,211,238,0.3)] hover:bg-slate-900 hover:text-cyan-200 hover:border-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.6)] hover:-translate-y-0.5' 
               }`}>
               <Calendar className={`w-4 h-4 md:w-5 md:h-5 ${dashTimeframe === 'custom_date' ? 'text-white' : 'text-cyan-400'}`} /> 
               <span>ระบุวัน</span>
             </button>

             {showDatePicker && (
  <div className="fixed inset-0 z-[300] bg-slate-900/80 backdrop-blur-md flex p-4 animate-in fade-in items-center justify-center" onClick={() => setShowDatePicker(false)}>
    {/* 🌟 PC อัปเกรด: ล็อกตาย ห้ามไถเด็ดขาด (ลบ max-h และ overflow ออกหมด) */}
    <div className="relative m-auto bg-slate-900 border-[2px] border-solid border-white rounded-[2rem] shadow-[0_0_60px_rgba(255,255,255,0.2)] w-[90%] max-w-[320px] sm:max-w-[340px] md:max-w-[550px] p-4 sm:p-5 md:p-10 text-center animate-in zoom-in-95 flex flex-col h-auto overflow-hidden outline-none" onClick={(e) => e.stopPropagation()}>

      <div className="absolute -top-20 -left-20 w-40 h-40 md:w-60 md:h-60 bg-orange-500/80 rounded-full blur-[50px] pointer-events-none z-0"></div>
      <div className="absolute -bottom-20 -right-20 w-40 h-40 md:w-60 md:h-60 bg-amber-500/80 rounded-full blur-[50px] pointer-events-none z-0"></div>
      
      <div className="relative z-10 flex justify-between items-center mb-6 md:mb-8 pb-5 md:pb-6 border-b border-white/20">
        <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); }} className="p-2.5 md:p-4 bg-slate-800 text-white rounded-xl md:rounded-2xl hover:bg-orange-500 transition-colors border border-slate-600 active:scale-95 shadow-inner"><ChevronDown className="w-5 h-5 md:w-8 md:h-8 rotate-90" /></button>
        <div className="flex flex-col items-center">
          <span className="text-[12px] md:text-[18px] font-black text-white tracking-widest uppercase mb-0.5 md:mb-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">เลือกวันที่</span>
          <span className="text-xl md:text-3xl font-black text-orange-400 tracking-widest drop-shadow-[0_0_15px_rgba(249,115,22,0.9)]">
            {['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'][calMonth]} {calYear + 543}
          </span>
        </div>
        <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); }} className="p-2.5 md:p-4 bg-slate-800 text-white rounded-xl md:rounded-2xl hover:bg-orange-500 transition-colors border border-slate-600 active:scale-95 shadow-inner"><ChevronDown className="w-5 h-5 md:w-8 md:h-8 -rotate-90" /></button>
      </div>
      
      <div className="relative z-10">
        <div className="grid grid-cols-7 gap-1 md:gap-2 mb-3 md:mb-5">
          {['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'].map(day => (<div key={day} className={`text-[13px] md:text-[20px] font-black ${day === 'อา' ? 'text-rose-400' : day === 'ส' ? 'text-sky-400' : 'text-slate-300'}`}>{day}</div>))}
        </div>
        <div className="grid grid-cols-7 gap-1.5 md:gap-3">
          {Array.from({ length: new Date(calYear, calMonth, 1).getDay() }).map((_, i) => (<div key={`empty-${i}`} />))}
          {Array.from({ length: new Date(calYear, calMonth + 1, 0).getDate() }).map((_, i) => {
            const day = i + 1;
            const dateString = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isSelected = customDate === dateString;
            const todayLocal = new Date(sysTime); 
            const isToday = todayLocal.getFullYear() === calYear && todayLocal.getMonth() === calMonth && todayLocal.getDate() === day;
            const isSunday = new Date(dateString).getDay() === 0;
            const isSaturday = new Date(dateString).getDay() === 6;

            return (
              <button 
                key={day} 
                onClick={() => { setCustomDate(dateString); setDashTimeframe('custom_date'); setShowDatePicker(false); }}
                className={`aspect-square flex items-center justify-center rounded-xl md:rounded-2xl text-[15px] md:text-[22px] font-black transition-all duration-300 active:scale-95 ${
                  isSelected 
                    ? 'bg-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.9)] border-[2px] border-solid border-white scale-110 z-20' 
                    : isToday 
                    ? 'bg-orange-500/80 text-white shadow-[0_0_25px_rgba(249,115,22,1)] border-[2px] border-solid border-orange-300 z-10 animate-pulse' 
                    : 'bg-slate-800 ' + (isSunday ? 'text-rose-400 drop-shadow-[0_0_5px_rgba(251,113,133,0.8)]' : isSaturday ? 'text-sky-400 drop-shadow-[0_0_5px_rgba(56,189,248,0.8)]' : 'text-slate-200') + ' hover:bg-orange-500/50 hover:border-orange-400 border border-white/60 shadow-inner'
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
      <button onClick={() => setShowDatePicker(false)} className="relative z-10 mt-8 md:mt-10 w-full py-4 md:py-6 rounded-xl md:rounded-2xl font-black text-white bg-orange-500 hover:bg-rose-500 border-[2px] border-solid border-white shadow-[0_0_20px_rgba(249,115,22,0.7)] active:scale-95 tracking-widest uppercase md:text-[22px]">ยกเลิก</button>
    </div>
  </div>
 )}
             
          </div>

          {/* 🌟 ปฏิทิน ระบุเดือน (เปลี่ยน Hover เป็น Cyan) */}
          <div className="relative flex-1 min-w-[95px] shrink-0 flex justify-center snap-center">
            <button onClick={() =>
             setShowMonthPicker(true)}
              className={`w-full relative z-10 text-[16px] md:text-[20px] font-black py-2.5 md:py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 whitespace-nowrap ${
                dashTimeframe === 'custom' 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-[2px] border-solid border-orange-300 shadow-[0_0_15px_rgba(249,115,22,0.8)] scale-[1.02] z-10' 
                  : 'bg-slate-950 text-cyan-300 border-[2px] border-solid border-cyan-400/30 shadow-[0_0_8px_rgba(34,211,238,0.3)] hover:bg-slate-900 hover:text-cyan-200 hover:border-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.6)] hover:-translate-y-0.5'
              }`}>
              <Calendar className={`w-4 h-4 md:w-5 md:h-5 ${dashTimeframe === 'custom' ? 'text-white' : 'text-cyan-400'}`} /> 
              <span>ระบุเดือน</span>
            </button>
            
            {showMonthPicker && (
  <div className="fixed inset-0 z-[300] bg-slate-900/80 backdrop-blur-md flex p-4 animate-in fade-in items-center justify-center" onClick={() => setShowMonthPicker(false)}>
    {/* 🌟 PC อัปเกรด: ล็อกตาย ห้ามไถเด็ดขาด (ลบ max-h และ overflow ออกหมด) */}
    <div className="relative m-auto bg-slate-900 border-[2px] border-solid border-white rounded-[2rem] shadow-[0_0_60px_rgba(255,255,255,0.2)] w-[90%] max-w-[320px] sm:max-w-[340px] md:max-w-[550px] p-4 sm:p-5 md:p-10 text-center animate-in zoom-in-95 flex flex-col h-auto overflow-hidden outline-none" onClick={(e) => e.stopPropagation()}>

      <div className="absolute -top-20 -right-20 w-40 h-40 md:w-60 md:h-60 bg-orange-500/80 rounded-full blur-[50px] pointer-events-none z-0"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 md:w-60 md:h-60 bg-amber-500/80 rounded-full blur-[50px] pointer-events-none z-0"></div>
      
      <div className="relative z-10 flex justify-between items-center mb-6 md:mb-8 pb-5 md:pb-6 border-b border-white/20">
        <button onClick={() => setPickerYear(y => y - 1)} className="p-2.5 md:p-4 bg-slate-800 text-white rounded-xl md:rounded-2xl hover:bg-orange-500 transition-colors border border-slate-600 active:scale-95 shadow-inner"><ChevronDown className="w-5 h-5 md:w-8 md:h-8 rotate-90" /></button>
        <div className="flex flex-col items-center">
          <span className="text-[12px] md:text-[18px] font-black text-white tracking-widest uppercase mb-0.5 md:mb-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
            เลือกเดือน
          </span>
          <span className="text-2xl md:text-4xl font-black text-orange-400 tracking-widest drop-shadow-[0_0_15px_rgba(249,115,22,0.9)]">
            {pickerYear + 543}
          </span>
        </div>
        <button onClick={() => setPickerYear(y => y + 1)} className="p-2.5 md:p-4 bg-slate-800 text-white rounded-xl md:rounded-2xl hover:bg-orange-500 transition-colors border border-slate-600 active:scale-95 shadow-inner"><ChevronDown className="w-5 h-5 md:w-8 md:h-8 -rotate-90" /></button>
      </div>
      <div className="relative z-10 grid grid-cols-3 gap-3 md:gap-5">
        {['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'].map((m, i) => {
          const monthValue = `${pickerYear}-${String(i + 1).padStart(2, '0')}`;
          const isSelected = customMonth === monthValue;
          const todayLocal = new Date(sysTime);
          const isCurrentMonth = todayLocal.getFullYear() === pickerYear && todayLocal.getMonth() === i;
          return (
            <button 
              key={m} 
              onClick={() => { setCustomMonth(monthValue); setDashTimeframe('custom'); setShowMonthPicker(false); }}
              className={`py-3.5 md:py-6 rounded-xl md:rounded-2xl text-[15px] md:text-[24px] font-black transition-all duration-300 active:scale-95 ${
                isSelected 
                  ? 'bg-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.9)] border-[2px] border-solid border-white scale-110 z-10' 
                  : isCurrentMonth 
                  ? 'bg-orange-500/80 text-white shadow-[0_0_25px_rgba(249,115,22,1)] border-[2px] border-solid border-orange-300 z-10 animate-pulse' 
                  : 'bg-slate-800/80 text-slate-200 hover:bg-orange-500/40 hover:border-orange-400 border border-white/60 hover:shadow-[0_0_15px_rgba(249,115,22,0.4)] shadow-inner'
              }`}
            >
              {m}
            </button>
          )
        })}
      </div>
      <button onClick={() => setShowMonthPicker(false)} className="relative z-10 mt-8 md:mt-10 w-full py-4 md:py-6 rounded-xl md:rounded-2xl font-black text-white bg-orange-500 hover:bg-rose-500 border-[2px] border-solid border-white shadow-[0_0_20px_rgba(249,115,22,0.7)] active:scale-95 tracking-widest uppercase md:text-[22px]">ยกเลิก</button>
    </div>
  </div>
)}

          </div>
        </div>

       {/* 📊 3. กล่องแสดงตัวเลขรวม (🌟 ฟันธง: รวมร่างทุกอย่างไว้ในกรอบส้มเรืองแสงก้อนเดียวตามแบบเดิมเป๊ะ) */}
       <div className="bg-slate-900/80 backdrop-blur-xl border-[2px] border-solid border-orange-500/80 rounded-[1.5rem] p-5 md:p-8 shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:shadow-[0_0_40px_rgba(249,115,22,0.5)] transition-all relative overflow-hidden mt-6">
          
          {/* แสง Flare ด้านหลัง */}
          <div className="absolute top-0 right-0 w-40 h-40 md:w-60 md:h-60 bg-orange-500/10 rounded-full blur-[60px] pointer-events-none"></div>

          <div className="relative z-10 flex flex-col h-full gap-4">
            
            <div className="flex justify-between items-start w-full">
              {/* โซนหัวข้อและตัวเลข */}
              <div>
                <p className="text-slate-300 text-[16px] md:text-[20px] font-black uppercase tracking-widest mb-1 md:mb-2 drop-shadow-sm">
                  จำนวนงานทั้งหมด
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-7xl md:text-[6.5rem] font-black font-mono tracking-tighter leading-none text-orange-400 drop-shadow-[0_0_15px_rgba(249,115,22,0.6)]">
                    {String(stats.total).padStart(2, '0')}
                  </span>
                  <span className="text-slate-300 text-[16px] md:text-[22px] font-bold tracking-widest ml-1">
                    รายการ
                  </span>
                </div>
              </div>

              {/* 🌟 วงกลม % อัตราปิดงาน */}
              <div className="bg-slate-950/60 border-[2px] border-solid border-emerald-500/50 px-4 md:px-6 py-4 md:py-6 rounded-2xl flex flex-col items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)] shrink-0">
                <span className="text-[13px] md:text-[16px] font-black uppercase tracking-widest text-emerald-400 mb-1">
                  อัตราปิดงาน
                </span>
                <div className="flex items-center gap-1.5 md:gap-2 text-emerald-300">
                  <PieChart className="w-5 h-5 md:w-8 md:h-8 animate-pulse" />
                  <span className="text-[30px] md:text-[44px] font-black drop-shadow-[0_0_15px_rgba(16,185,129,0.5)] leading-none">
                    {completionRate}%
                  </span>
                </div>
              </div>
            </div>

            {/* 🌟 ป้ายบอกช่วงเวลา (อยู่ตำแหน่งเดิมที่ท่านต้องการ) */}
            <div className="w-full bg-slate-950 border-[2px] border-solid border-orange-500/50 text-orange-300 text-[16px] md:text-[20px] font-black px-4 py-3 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.8)]">
              {getTimeframeLabel()}
            </div>

          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-6">
          <div
            onClick={() => handleNavigateToTracking('pending')}
            className="bg-slate-800/40 backdrop-blur-xl p-5 md:p-8 rounded-[1.5rem] border-[2px] border-solid border-rose-500 hover:bg-slate-700/50 flex flex-col items-center shadow-lg active:scale-95 transition-all cursor-pointer relative overflow-hidden hover:shadow-[0_0_25px_rgba(244,63,94,0.5)] hover:-translate-y-1 hover:border-rose-400"
          >
            <div className="absolute top-0 w-full h-1 md:h-2 bg-rose-500"></div>
            <div className="bg-rose-50 p-3 md:p-4 rounded-2xl md:rounded-3xl mb-3 md:mb-5">
              <AlertCircle className="w-6 h-6 md:w-8 md:h-8 text-rose-500 animate-pulse" />
            </div>
            <div className="text-4xl md:text-[4rem] md:mb-2 font-black text-rose-400 font-mono tracking-tighter leading-none">
              {stats.pending}
            </div>
            <div className="text-[13px] md:text-[18px] font-bold text-rose-500 uppercase mt-2 tracking-widest">
              รอดำเนินการ
            </div>
          </div>
          
          <div
            onClick={() => handleNavigateToTracking('fixing')}
            className="bg-slate-800/40 backdrop-blur-xl p-5 md:p-8 rounded-[1.5rem] border-[2px] border-solid border-orange-500 hover:bg-slate-700/50 flex flex-col items-center shadow-lg active:scale-95 transition-all cursor-pointer relative overflow-hidden hover:shadow-[0_0_25px_rgba(249,115,22,0.5)] hover:-translate-y-1 hover:border-orange-400"
          >
            <div className="absolute top-0 w-full h-1 md:h-2 bg-orange-400"></div>
            <div className="bg-orange-50 p-3 md:p-4 rounded-2xl md:rounded-3xl mb-3 md:mb-5">
              <Wrench className="w-6 h-6 md:w-8 md:h-8 text-orange-500" />
            </div>
            <div className="text-4xl md:text-[4rem] md:mb-2 font-black text-orange-500 font-mono tracking-tighter leading-none">
              {stats.fixing}
            </div>
            <div className="text-[13px] md:text-[18px] font-bold text-orange-500 uppercase mt-2 tracking-widest">
              กำลังซ่อม
            </div>
          </div>

        {/* ========================================================================= */}
          {/* 🌟 ฟันธง: กล่องยกเลิก (สีเทา) ถูกยกมาไว้ข้างบนแล้ว! จะแสดงผลก่อน (หรืออยู่ซ้าย) */}
          {/* ========================================================================= */}
          <div
            onClick={() => handleNavigateToTracking('cancelled')}
            className="bg-slate-800/40 backdrop-blur-xl p-5 md:p-8 rounded-[1.5rem] border-[2px] border-solid border-slate-500 hover:bg-slate-700/50 flex flex-col items-center shadow-lg active:scale-95 transition-all cursor-pointer relative overflow-hidden hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:-translate-y-1 hover:border-slate-400"
          > {/* <--- 🌟 เครื่องหมาย > ตัวนี้แหละครับที่หายไป! */}
            <div className="absolute top-0 w-full h-1 md:h-2 bg-slate-400"></div>
            <div className="bg-slate-50 p-3 md:p-4 rounded-2xl md:rounded-3xl mb-3 md:mb-5">
              <XCircle className="w-6 h-6 md:w-8 md:h-8 text-slate-500" />
            </div>
            <div className="text-4xl md:text-[4rem] md:mb-2 font-black text-slate-300 font-mono tracking-tighter leading-none">
              {stats.cancelled}
            </div>
            <div className="text-[14px] md:text-[16px] font-bold text-slate-300 uppercase mt-2 tracking-widest">
              ยกเลิก
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 🌟 ฟันธง: กล่องเสร็จสิ้น (สีเขียว) ถูกยกมาไว้ข้างล่างแล้ว! จะแสดงผลทีหลัง (หรืออยู่ขวา) */}
          {/* ========================================================================= */}
          <div
            onClick={() => handleNavigateToTracking('completed')}
            className="bg-slate-800/40 backdrop-blur-xl p-5 md:p-8 rounded-[1.5rem] border-[2px] border-solid border-emerald-500 hover:bg-slate-700/50 flex flex-col items-center shadow-lg active:scale-95 transition-all cursor-pointer relative overflow-hidden hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:-translate-y-1 hover:border-emerald-400"
          > {/* <--- 🌟 และตัวนี้ก็ต้องมีห้ามหายครับ! */}
            <div className="absolute top-0 w-full h-1 md:h-2 bg-emerald-500"></div>
            <div className="bg-emerald-50 p-3 md:p-4 rounded-2xl md:rounded-3xl mb-3 md:mb-5">
              <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-emerald-500"/>
            </div>
            <div className="text-4xl md:text-[4rem] md:mb-2 font-black text-emerald-400 font-mono tracking-tighter leading-none">
              {stats.done}
            </div>
            <div className="text-[14px] md:text-[20px] font-bold text-emerald-500 uppercase mt-2 tracking-widest">
              เสร็จสิ้น
            </div>
          </div> 
        </div>
        
{/* ========================================================================= */}
        {/* 🌟 ฟันธง: กล่องสรุปยอดแยกตามภารกิจ (อัปเกรดแยก 4 สี + บาลานซ์เต็มจอ PC) */}
        {/* ========================================================================= */}
        {stats.missionBreakdown && stats.missionBreakdown.length > 0 && (
          <div className="w-full bg-slate-800/60 backdrop-blur-xl p-5 md:p-8 rounded-[1.5rem] border-2 border-solid border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.15)] mt-6 md:mt-8 hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all">
            <h3 className="text-[18px] md:text-[22px] font-black text-cyan-400 uppercase tracking-widest mb-4 md:mb-6 flex items-center gap-2 md:gap-3 drop-shadow-sm">
              <Activity className="w-5 h-5 md:w-7 md:h-7 text-cyan-400 animate-pulse" /> 
              สรุปจำนวนงานแยกตามภารกิจ
            </h3>
            
            {/* 🌟 ปรับเป็น w-full และใช้ lg:grid-cols-2 */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {stats.missionBreakdown.map((item, idx) => {
                
                // 🌟 สมองกลแยกสี: 4 ภารกิจ 4 สี (ส้ม ฟ้า แดง เขียว) ตามสั่ง!
                let theme = { bg: 'bg-slate-900/80', border: 'border-slate-500/40', hover: 'hover:border-slate-400', textHead: 'text-slate-200', textSub: 'text-slate-400', icon: 'text-slate-500', numBox: 'bg-slate-800 border-slate-600', numText: 'text-slate-300 drop-shadow-sm' };
                
                if (item.category.includes('จานสายอากาศ')) {
                  // 🟠 ภารกิจด้านจานสายอากาศ (สีส้ม)
                  theme = { bg: 'bg-orange-950/80', border: 'border-orange-500/50', hover: 'hover:border-orange-400 hover:shadow-[0_0_15px_rgba(249,115,22,0.4)]', textHead: 'text-orange-400', textSub: 'text-orange-500', icon: 'text-orange-500', numBox: 'bg-orange-900/50 border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.2)]', numText: 'text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]' };
                } else if (item.category.includes('คอมพิวเตอร์')) {
                  // 🔵 ภารกิจด้านคอมพิวเตอร์แม่ข่าย (สีฟ้า)
                  theme = { bg: 'bg-cyan-950/80', border: 'border-cyan-500/50', hover: 'hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]', textHead: 'text-cyan-400', textSub: 'text-cyan-500', icon: 'text-cyan-500', numBox: 'bg-cyan-900/50 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]', numText: 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]' };
                } else if (item.category.includes('โครงสร้างพื้นฐาน')) {
                  // 🔴 ภารกิจด้านโครงสร้างพื้นฐานไฟฟ้า (สีแดง/Rose)
                  theme = { bg: 'bg-rose-950/80', border: 'border-rose-500/50', hover: 'hover:border-rose-400 hover:shadow-[0_0_15px_rgba(244,63,94,0.4)]', textHead: 'text-rose-400', textSub: 'text-rose-500', icon: 'text-rose-500', numBox: 'bg-rose-900/50 border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.2)]', numText: 'text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]' };
                } else if (item.category.includes('SSC')) {
                  // 🟢 ภารกิจด้านการให้บริการ SSC (สีเขียว/Emerald)
                  theme = { bg: 'bg-emerald-950/80', border: 'border-emerald-500/50', hover: 'hover:border-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]', textHead: 'text-emerald-400', textSub: 'text-emerald-500', icon: 'text-emerald-500', numBox: 'bg-emerald-900/50 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]', numText: 'text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]' };
                }

                // 🌟 ฟันธง: ถ้าทั้งเดือนมีงานเข้าแค่ภารกิจเดียว ให้ยืดกล่องนี้กินพื้นที่เต็มจอไปเลย (lg:col-span-2)
                const isSingle = stats.missionBreakdown.length === 1;

                return (
                  <div key={idx} className={`${isSingle ? 'lg:col-span-2' : ''} ${theme.bg} border-l-[6px] border border-solid ${theme.border} rounded-2xl p-4 md:p-5 flex items-center justify-between shadow-inner transition-all duration-300 ${theme.hover} group cursor-default`}>
                    <div className="flex flex-col min-w-0 pr-4">
                      <span className={`text-[16px] md:text-[20px] font-black ${theme.textHead} truncate drop-shadow-sm`}>{item.category}</span>
                      <span className={`text-[13px] md:text-[16px] font-bold ${theme.textSub} mt-1.5 flex items-center gap-1.5 truncate`}>
                        <User className={`w-4 h-4 ${theme.icon} shrink-0`} /> 
                        <span className="truncate">{item.techs}</span>
                      </span>
                    </div>
                    <div className={`flex items-baseline gap-1.5 px-4 py-2.5 rounded-xl border border-solid shrink-0 ${theme.numBox}`}>
                      <span className={`text-[24px] md:text-[32px] font-black font-mono leading-none ${theme.numText}`}>
                        {String(item.count).padStart(2, '0')}
                      </span>
                      <span className={`text-[13px] md:text-[16px] font-bold ${theme.textSub}`}>งาน</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}


{/* 🌟 ฟันธง: กล่องสรุปคะแนนประเมิน SLA (CSAT KPI) จะโชว์ก็ต่อเมื่อมีงานที่ซ่อมเสร็จแล้ว */}
{stats.done > 0 && (
          <div className="bg-slate-800/60 backdrop-blur-xl p-5 md:p-8 rounded-[1.5rem] border-[2px] border-solid border-yellow-500/80 shadow-[0_0_20px_rgba(250,204,21,0.8)] mt-4 md:mt-8 relative overflow-hidden flex items-center justify-between hover:shadow-[0_0_30px_rgba(250,204,21,0.8)] transition-all">
            
            {/* แสงเฟลอร์หลังกล่อง สีทองอร่าม */}
            <div className="absolute -left-10 -top-10 w-32 h-32 md:w-48 md:h-48 bg-yellow-500/30 blur-[30px] rounded-full pointer-events-none animate-pulse"></div>
            
            <div className="relative z-10 flex flex-col">
              <span className="text-[14px] md:text-[20px] font-black text-yellow-400 uppercase tracking-widest drop-shadow-sm mb-1 md:mb-2">
                คะแนนความพึงพอใจเฉลี่ย
              </span>
              <div className="flex items-center gap-3 md:gap-5 mt-1">
                <span className="text-5xl md:text-[5rem] font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] tracking-tighter">
                  {stats.avgRating > 0 ? stats.avgRating : '-'}
                </span>
                <div className="flex flex-col md:mt-2">
                  <div className="flex gap-0.5 md:gap-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className={`w-6 h-6 md:w-8 md:h-8 ${Math.round(stats.avgRating) >= s ? "drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" : ""}`} fill={Math.round(stats.avgRating) >= s ? "#facc15" : "none"} stroke={Math.round(stats.avgRating) >= s ? "#facc15" : "#475569"} strokeWidth={2} />
                    ))}
                  </div>
                  <span className="text-[14px] md:text-[18px] font-bold text-slate-400 mt-1 md:mt-2">
                    จากผู้แจ้ง <span className="text-yellow-400 font-black">{stats.ratedCount}</span> รายการ
                  </span>
                </div>
              </div>
            </div>

            {/* โลโก้ขวา */}
            <div className="relative z-10 bg-slate-900 border-[2px] border-solid border-yellow-500/50 p-3.5 md:p-6 rounded-2xl md:rounded-3xl shadow-[0_0_15px_rgba(250,204,21,0.3)] flex flex-col items-center justify-center shrink-0">
               <Star className="w-8 h-8 md:w-12 md:h-12 text-yellow-400 mb-1 md:mb-2 animate-bounce" fill="currentColor" />
               <span className="text-[10px] md:text-[14px] font-black text-yellow-500 tracking-widest uppercase">CSAT KPI</span>
            </div>
          </div>
        )}
        {/* ================= เริ่มกล่อง: งานที่รอเกินกำหนด ================= */}
        {(longestPendingTicket || longestFixingTicket) && (
          <div className="bg-slate-800/60 backdrop-blur-xl p-5 md:p-8 rounded-[1rem] md:rounded-[1.5rem] border-2 border-solid border-orange-500/80 shadow-[0_0_20px_rgba(249,115,22,0.8)] mt-6 md:mt-8 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 md:w-56 md:h-56 bg-rose-500/10 rounded-full blur-2xl"></div>
            <h3 className="text-[18px] md:text-[22px] font-black text-white uppercase tracking-widest mb-4 md:mb-6 flex items-center gap-2 md:gap-3 relative z-10">
              <Flame className="w-5 h-5 md:w-7 md:h-7 text-white-500 animate-pulse" />{' '}
              งานที่รอเกินระยะเวลากำหนด
            </h3>
            <div className="flex flex-col gap-3 md:gap-5 relative z-10 w-full">
              
             {/* ================= กล่องที่ 1: รอนานที่สุด ================= */}
              {longestPendingTicket && (
                <div
                  onClick={() => {
                    setActiveTab('tracking');
                    setSearchTerm(longestPendingTicket.id);
                    setFilterStatus('all');
                    setTrackTimeframe('all'); 
                  }}
                  className="bg-white p-4 md:p-6 rounded-2xl border-2 border-solid border-orange-800 shadow-[0_4px_10px_rgba(225,29,72,0.1)] cursor-pointer hover:border-rose-500 hover:bg-rose-100 hover:shadow-[0_0_20px_rgba(249,115,22,0.5)] transition-all active:scale-[0.98]"
                >
                  {/* 🌟 ฟันธง: ส่วนหัว (แยก 2 บรรทัด ป้องกันจอเล็กตกขอบ) */}
                  <div className="flex flex-col gap-2.5 md:gap-3 mb-3 md:mb-5">
                    {/* 🔴 บรรทัด 1: เลขที่แจ้งซ่อม (สไตล์กรอบขาวขอบส้ม เหมือนรายการล่าสุด) */}
                    <div className="flex items-center">
                      <span className="text-[15px] md:text-[20px] font-mono font-bold text-slate-600 bg-white px-2 md:px-3 py-0.5 md:py-1 rounded-md md:rounded-lg border-2 border-solid border-orange-400/70 tracking-widest shadow-sm">
                        {longestPendingTicket.id}
                      </span>
                    </div>
                    {/* 🔴 บรรทัด 2: ป้ายกำกับ (ซ้ายสุด) + เวลา (ขวาสุด) */}
                    <div className="flex justify-between items-center w-full">
                      <span className="text-[15px] md:text-[20px] font-black text-rose-600 bg-rose-100 px-2 md:px-3 py-1 rounded-lg">
                        รอนานที่สุด
                      </span>
                      <span className="text-[15px] md:text-[20px] font-mono font-black text-rose-600">
                        {formatMinutesToText(getMinutesDiff(longestPendingTicket.date, sysTime))}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-[15px] md:text-[20px] font-black text-rose-800 truncate mb-1 md:mb-3">
                    {longestPendingTicket.equipment}
                  </h4>

                  {/* 🌟 ป้ายกำกับ ผู้แจ้งปัญหา */}
                  <div className="flex flex-col gap-0.5 md:gap-1 mt-2 md:mt-3">
                    <span className="text-[13px] md:text-[16px] font-bold text-slate-600 tracking-widest">ผู้แจ้งปัญหา:</span>
                    <p className="text-[13px] md:text-[16px] font-bold text-orange-600 flex items-center gap-1.5 md:gap-2">
                      <User className="w-3.5 h-3.5 md:w-5 md:h-5 text-orange-500" />
                      {longestPendingTicket.reporter}
                    </p>
                  </div>
                </div>
              )}
              
              {/* ================= กล่องที่ 2: ซ่อมมาราธอน ================= */}
              {longestFixingTicket && (
                <div
                  onClick={() => {
                    setActiveTab('tracking');
                    setSearchTerm(longestFixingTicket.id);
                    setFilterStatus('all');
                    setTrackTimeframe('all'); 
                  }}
                  className="bg-white p-4 md:p-6 rounded-2xl border-2 border-solid border-orange-400 shadow-[0_4px_10px_rgba(249,115,22,0.1)] cursor-pointer hover:border-orange-500 hover:bg-orange-50 hover:shadow-md transition-all active:scale-[0.98]"
                >
                  {/* 🌟 ฟันธง: ส่วนหัว (แยก 2 บรรทัด ป้องกันจอเล็กตกขอบ) */}
                  <div className="flex flex-col gap-2.5 md:gap-3 mb-3 md:mb-5">
                    {/* 🔴 บรรทัด 1: เลขที่แจ้งซ่อม (สไตล์กรอบขาวขอบส้ม เหมือนรายการล่าสุด) */}
                    <div className="flex items-center">
                      <span className="text-[15px] md:text-[20px] font-mono font-bold text-slate-600 bg-white px-2 md:px-3 py-0.5 md:py-1 rounded-md md:rounded-lg border-2 border-solid border-orange-400/70 tracking-widest shadow-sm">
                        {longestFixingTicket.id}
                      </span>
                    </div>
                    {/* 🔴 บรรทัด 2: ป้ายกำกับ (ซ้ายสุด) + เวลา (ขวาสุด) */}
                    <div className="flex justify-between items-center w-full">
                      <span className="text-[16px] md:text-[20px] font-black text-orange-600 bg-orange-100 px-2 md:px-3 py-1 rounded-lg">
                        ซ่อมมาราธอน
                      </span>
                      <span className="text-[16px] md:text-[20px] font-mono font-black text-orange-600">
                        {formatMinutesToText(getMinutesDiff(longestFixingTicket.startedAt || longestFixingTicket.date, sysTime))}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-[18px] md:text-[20px] font-black text-rose-800 truncate mb-1 md:mb-3">
                    {longestFixingTicket.equipment}
                  </h4>
                  {/* 🌟 ป้ายกำกับ ผู้รับผิดชอบ (ช่าง) */}
                  <div className="flex flex-col gap-0.5 md:gap-1 mt-2 md:mt-3">
                    <span className="text-[13px] md:text-[16px] font-bold text-slate-400 tracking-widest">ผู้รับผิดชอบ:</span>
                    <p className="text-[15px] md:text-[18px] font-bold text-emerald-600 flex items-center gap-1.5 md:gap-2">
                      <Wrench className="w-3.5 h-3.5 md:w-5 md:h-5 text-emerald-500" />
                      {longestFixingTicket.techName || 'กำลังดำเนินการ'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}


       {/* ========================================================================= */}
        {/* 🌟 กล่อง: รายการล่าสุด (ฉบับสมบูรณ์แก้ Error แดง วงเล็บครบ 1,000,000%) */}
        {/* ========================================================================= */}
        <div className="bg-slate-800/60 backdrop-blur-xl p-5 md:p-8 rounded-[1rem] md:rounded-[1.5rem] border-2 border-solid border-orange-500/80 shadow-[0_0_20px_rgba(249,115,22,0.15)] mt-6 md:mt-8 hover:shadow-[0_0_20px_rgba(249,115,22,0.8)]">
          <h3 className="text-[18px] md:text-[22px] font-black text-white uppercase tracking-widest mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
            <FileText className="w-5 h-5 md:w-7 md:h-7 text-white-800" />{' '}
            รายการล่าสุด
          </h3>
          <div className="space-y-3 md:space-y-5">
            
            {tickets.filter(t => {
              if (currentUserRole === 'Commander' || currentUserRole === 'reporter') return true;
              const isMyJob = t.techName === currentUserName || t.sscTechName === currentUserName;
              const isUnassigned = !t.techName || t.techName === 'รอเจ้าหน้าที่รับงาน';
              return isMyJob || isUnassigned;
            }).slice(0, 3).map((t) => (
              <div
                key={t.id}
                onClick={() => {
                  setActiveTab('tracking');
                  setSearchTerm(t.id);
                  setFilterStatus('all');
                  setTrackTimeframe('all'); 
                }}
                className={`flex flex-col p-4 md:p-6 bg-slate-50 rounded-2xl border-2 cursor-pointer active:scale-[0.98] transition-all shadow-sm ${
                  t.status === 'pending'
                    ? 'border-rose-400 hover:bg-rose-100 hover:border-rose-500'
                    : t.status === 'in_progress' || t.status === 'on_hold'
                    ? 'border-orange-400 hover:bg-orange-100 hover:border-orange-500'
                    : 'border-emerald-400 hover:bg-emerald-100 hover:border-emerald-500'
                } relative`}
              >
                <div className="flex items-center justify-between mb-2 md:mb-4 w-full gap-1 md:gap-2">
                  <div className="flex-1 flex justify-start items-center overflow-hidden">
                    <span className="text-[15px] md:text-[20px] font-mono font-bold text-slate-600 bg-white px-2 md:px-3 py-0.5 md:py-1 rounded-md md:rounded-lg border border-2 border-solid border-orange-400/70 tracking-widest shadow-sm truncate">
                      {t.id}
                    </span>
                  </div>
                  <div className="flex-shrink-0 flex justify-center items-center">
                    {t.isOutOfHours && (
                      <span className="text-[15px] md:text-[20px] font-black text-rose-600 bg-rose-100 border border-solid border-rose-200 px-1.5 md:px-2 py-0.5 md:py-1 rounded-md md:rounded-lg animate-pulse whitespace-nowrap">
                        เวร SSC
                      </span>
                    )}
                  </div>
                  <div className="flex-1 flex justify-end items-center">
                    <span
                      className={`text-[15px] md:text-[20px] font-black uppercase px-2 md:px-3 py-0.5 md:py-1 rounded-md md:rounded-lg whitespace-nowrap ${
                        t.status === 'pending'
                          ? 'bg-rose-100 text-rose-600'
                          : t.status === 'in_progress' || t.status === 'on_hold'
                          ? 'bg-orange-100 text-orange-600'
                          : t.status === 'verified'
                          ? 'bg-emerald-500 text-white shadow-sm' 
                          : 'bg-emerald-100 text-emerald-600'
                      }`}
                    >
                      {t.status === 'pending' ? 'รอดำเนินการ' : t.status === 'verified' ? 'เสร็จสิ้นสมบูรณ์' : t.status === 'completed' ? 'รอผู้แจ้งยืนยัน' : 'กำลังซ่อม'}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center pr-1 md:pr-2">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[16px] md:text-[20px] font-bold text-blue-800 truncate mb-4 md:mb-6">
                      {t.equipment}
                    </h4>
                    <p className="text-[15px] md:text-[20px] text-orange-500 truncate flex items-center gap-1.5 md:gap-2">
                      <AlertCircle className="w-[17px] h-[17px] md:w-7 md:h-7 text-orange-600 shrink-0" />{' '}
                      {t.description}
                    </p>

                    {t.sscTechName && (
                      <div className="bg-purple-50 border border-purple-200 p-3 rounded-lg mt-3">
                        <p className="text-rose-700 font-bold text-[14px] md:text-[20px] flex items-center gap-2">
                          <AlertTriangle size={18} /> เจ้าหน้าที่เวร SSC:
                        </p>
                        <p className="text-purple-900 font-bold text-[15px] md:text-[20px] mt-0.5">
                          {t.sscTechName}
                        </p>
                      </div>
                    )}
                  </div>
                  <ChevronRight className="w-[18px] h-[18px] md:w-6 md:h-6 text-slate-300 shrink-0 ml-2 md:ml-4" />
                </div>

                <div className="mt-3 md:mt-5 pt-3 md:pt-5 border-t border-2 border-orange-400/70 flex justify-between items-end">
                  <div className="flex flex-col gap-2.5 md:gap-4">
                    <div className="flex flex-col gap-0.5 md:gap-1">
                      <span className="text-[13px] md:text-[20px] font-bold text-slate-600 tracking-widest">ผู้แจ้งปัญหา:</span>
                      <span className="text-[15px] md:text-[20px] font-bold text-emerald-600 flex items-center gap-1.5 md:gap-2">
                        <User className="w-[14px] h-[14px] md:w-[20px] md:h-[20px] text-emerald-500 shrink-0" />
                        <span className="truncate max-w-[140px] md:max-w-[250px]">{t.reporter}</span>
                      </span>
                    </div>
                    {t.techName && (
                      <div className="flex flex-col gap-0.5 md:gap-1">
                        <span className="text-[13px] md:text-[20px] font-bold text-slate-600 tracking-widest">ผู้รับผิดชอบ:</span>
                        <span className="text-[15px] md:text-[20px] font-bold text-orange-600 flex items-center gap-1.5 md:gap-2">
                          <Wrench className="w-[14px] h-[14px] md:w-[20px] md:h-[20px] text-orange-500 shrink-0" />
                          <span className="truncate max-w-[140px] md:max-w-[250px]">{t.techName}</span>
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-[16px] md:text-[20px] font-bold font-mono text-orange-500 flex items-center gap-1 md:gap-2 shrink-0 mb-0.5 md:mb-1">
                    <Clock className="w-4 h-4 md:w-5 md:h-5 text-orange-500" /> 
                    {new Date(t.date).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.
                  </span>
                </div>
              </div>
            ))}
            
            {tickets.filter(t => {
              if (currentUserRole === 'Commander' || currentUserRole === 'reporter') return true;
              const isMyJob = t.techName === currentUserName || t.sscTechName === currentUserName;
              const isUnassigned = !t.techName || t.techName === 'รอเจ้าหน้าที่รับงาน';
              return isMyJob || isUnassigned;
            }).length === 0 && (
              <p className="text-center text-xs md:text-base font-bold text-slate-500 py-4 md:py-8">
                ไม่มีรายการซ่อมบำรุง
              </p>
           )}
           </div>
         </div>
       </div>
     );
   };

  const renderReport = () => (
    <div className="p-5 pb-32 animate-in slide-in-from-right-4 duration-500 space-y-6 relative">
      
      {/* 🌟 ฟันธง: เติมสวิตช์ตรงนี้! */}
      {showSuccess ? (
        /* 🌟 เปลี่ยนเป็น Popup Overlay ทับทุกสิ่งบนหน้าจอด้วย fixed inset-0 z-[300] */
        <div className="fixed inset-0 z-[300] bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in duration-500">
          
          {/* 💥 พลังแสงเฟลอร์สีเขียว-ส้ม วาบๆ อยู่ด้านหลัง */}
          <div className="absolute w-[300px] h-[300px] bg-emerald-500/40 rounded-full blur-[100px] animate-pulse pointer-events-none z-0"></div>
          <div className="absolute w-[200px] h-[200px] bg-orange-500/30 rounded-full blur-[80px] animate-pulse delay-150 pointer-events-none z-0 translate-x-10 translate-y-10"></div>

          <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-sm">
            
            {/* 🌟 1. โซนไอคอน: อลังการวงแหวน */}
            <div className="relative mb-8 mt-4">
              <div className="absolute inset-0 border-[6px] border-emerald-400 rounded-full animate-ping opacity-30"></div>
              <div className="absolute -inset-4 border-2 border-dashed border-emerald-400/70 rounded-full animate-[spin_8s_linear_infinite]"></div>
              
              <div className="relative w-28 h-28 md:w-32 md:h-32 bg-gradient-to-tr from-emerald-500 to-teal-400 text-white rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.8)] border-[3px] border-solid border-white/50">
                <CheckCircle size={60} className="md:w-20 md:h-20 drop-shadow-md" />
              </div>
            </div>

            {/* 🌟 2. โซนข้อความ: กรอบ Sci-Fi */}
            <div className="bg-slate-900 border-[3px] border-solid border-emerald-500/80 p-8 rounded-3xl shadow-[0_0_40px_rgba(16,185,129,0.4)] w-full text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
              <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-emerald-300 to-emerald-600 drop-shadow-lg mb-4 tracking-wide">
                ส่งข้อมูลสำเร็จ!
              </h2>
              <p className="text-[15px] md:text-lg font-bold text-slate-200 leading-relaxed">
                ระบบบันทึกข้อมูลและส่งแจ้งเตือนให้<br/>
                <span className="text-orange-500 font-black text-lg md:text-xl mt-2 mb-1 inline-block drop-shadow-[0_0_8px_rgba(249,115,22,0.8)] border-b-2 border-dashed border-orange-500">
                  ผู้เกี่ยวข้อง.
                </span><br/>
                รับทราบเรียบร้อยแล้ว!!
              </p>
            </div>

          </div>
        </div>
      ) : (

        <form onSubmit={handleSubmit} className="space-y-6 w-full">
        <div className="bg-slate-800/60 backdrop-blur-xl  border-2 border-solid border-white-600/50 rounded-[1rem] py-4 text-center shadow-[0_0_30px_rgba(0,0,0,0.3)] font-sans tracking-widest text-white font-bold md:text-[18px]">
          {ThaiDateFormatter(sysTime)}
        </div>


      {/* 🌟 วิดเจ็ตแสดงวิศวกรเวรประจำการ (แปะบนสุด) */}
      {(() => {
          const today = new Date(sysTime);
          const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
          const sscRosterForDate = allRosters.find(r => r.date === todayStr);
          
          // 🌟 ฟันธง: สมองกลค้นหาเบอร์โทรช่างเวร SSC จากฐานข้อมูล technicianList โดยอัตโนมัติ!
          let autoSscPhone = sscRosterForDate?.techPhone;
          if (sscRosterForDate?.techName) {
            const foundTech = technicianList.find(t => t.name === sscRosterForDate.techName);
            if (foundTech && foundTech.phone && foundTech.phone !== '-') {
              autoSscPhone = foundTech.phone;
            }
          }

          const dutyPerson = sscRosterForDate ? { 
            techName: sscRosterForDate.techName, 
            techPhone: autoSscPhone, 
            isHoliday: sscRosterForDate.isHoliday, 
            holidayName: sscRosterForDate.holidayName 
          } : null;

          const dayOfWeek = today.getDay();
          const daysThai = ['วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'];
          
          // 1. กำหนดสีประจำวันเกิดแบบเป๊ะๆ 1,000,000%
          const dayColors = {
            0: 'text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]',
            1: 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]',
            2: 'text-pink-400 drop-shadow-[0_0_8px_rgba(244,114,182,0.8)]',
            3: 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]',
            4: 'text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]',
            5: 'text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]',
            6: 'text-violet-400 drop-shadow-[0_0_8px_rgba(167,139,250,0.8)]'
          };

         // 🌟 2. ถ้ามีเวรจริงๆ (วันหยุด/วันพิเศษ) -> ใช้กรอบเรืองแสงแบบเดิม (อัปเกรดเป็น Smart Card)
         if (dutyPerson?.techName) {
          let wTheme = { bg: 'bg-purple-500/20', border: 'border-purple-500/80', textHead: 'text-purple-400', textName: 'text-purple-400', glow: 'shadow-[0_0_30px_rgba(168,85,247,0.3)]', iconGlow: 'shadow-[0_0_10px_rgba(168,85,247,1)]', iconText: 'text-purple-400', dayLabel: daysThai[dayOfWeek] };
          
          if (dutyPerson?.isHoliday) {
            wTheme = { bg: 'bg-orange-500/20', border: 'border-orange-500/80', textHead: 'text-orange-400', textName: 'text-orange-400', glow: 'shadow-[0_0_30px_rgba(249,115,22,0.3)]', iconGlow: 'shadow-[0_0_10px_rgba(249,115,22,1)]', iconText: 'text-orange-400', dayLabel: `วันหยุดนักขัตฤกษ์ (${dutyPerson.holidayName})` };
          } else if (dayOfWeek === 0) {
            wTheme = { bg: 'bg-rose-500/20', border: 'border-rose-500/80', textHead: 'text-rose-400', textName: 'text-rose-400', glow: 'shadow-[0_0_30px_rgba(225,29,72,0.3)]', iconGlow: 'shadow-[0_0_10px_rgba(225,29,72,1)]', iconText: 'text-rose-400', dayLabel: 'วันอาทิตย์' };
          } else if (dayOfWeek === 6) {
            wTheme = { bg: 'bg-sky-500/20', border: 'border-sky-500/80', textHead: 'text-sky-400', textName: 'text-sky-400', glow: 'shadow-[0_0_30px_rgba(14,165,233,0.3)]', iconGlow: 'shadow-[0_0_10px_rgba(14,165,233,1)]', iconText: 'text-sky-400', dayLabel: 'วันเสาร์' };
          }

          return (
            <div className={`relative bg-slate-900/80 backdrop-blur-xl border-[2px] border-solid ${wTheme.border} rounded-[1.5rem] p-5 md:p-8 ${wTheme.glow} mt-4 mb-2 overflow-hidden`}>
              
              {/* แสง Flare พื้นหลัง */}
              <div className={`absolute -top-20 -left-20 w-40 h-40 ${wTheme.bg} blur-[60px] rounded-full pointer-events-none z-0`}></div>

              {/* 🌟 Header กล่องเวร SSC ไร้รอยต่อ */}
              <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8 pb-4 border-b-2 border-dashed border-slate-600/50 relative z-10">
                <div className={`bg-slate-950 border-[2px] border-solid ${wTheme.border} p-2 md:p-3 rounded-xl shadow-sm relative`}>
                  <User className={`${wTheme.iconText} w-5 h-5 md:w-7 md:h-7`} strokeWidth={2.5} />
                  <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 md:w-3 md:h-3 bg-emerald-500 rounded-full animate-pulse border-2 border-slate-900 ${wTheme.iconGlow}`}></span>
                </div>
                <h2 className={`text-[16px] md:text-[22px] font-black ${wTheme.textHead} tracking-widest uppercase drop-shadow-sm`}>
                  เจ้าหน้าที่เวร SSC | {wTheme.dayLabel}
                </h2>
              </div>

              {/* 🌟 สมาร์ทการ์ด: ข้อมูลเวร SSC */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5 relative z-10 animate-in fade-in zoom-in-95 duration-500">
                
                {/* การ์ด: ชื่อ-นามสกุล */}
                <div className={`bg-slate-950/50 border ${wTheme.border.replace('80', '30')} rounded-2xl p-4 flex items-center gap-4 shadow-inner`}>
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${wTheme.bg} flex items-center justify-center border ${wTheme.border.replace('80', '50')} shrink-0`}>
                     <User className={`${wTheme.iconText} w-5 h-5 md:w-6 md:h-6`} />
                  </div>
                  <div className="overflow-hidden">
                    <p className={`text-[11px] md:text-[13px] font-bold ${wTheme.textHead} opacity-70 uppercase tracking-widest mb-0.5`}>ชื่อ-นามสกุล (เวรประจำวัน)</p>
                    <p className={`text-[16px] md:text-[20px] font-black ${wTheme.textName} drop-shadow-sm truncate`}>
                      {dutyPerson.techName}
                    </p>
                  </div>
                </div>

                {/* การ์ด: เบอร์โทรศัพท์ */}
                <div className={`bg-slate-950/50 border ${wTheme.border.replace('80', '30')} rounded-2xl p-4 flex items-center gap-4 shadow-inner`}>
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${wTheme.bg} flex items-center justify-center border ${wTheme.border.replace('80', '50')} shrink-0`}>
                     <Phone className={`${wTheme.iconText} w-5 h-5 md:w-6 md:h-6`} />
                  </div>
                  <div className="overflow-hidden flex-1">
                    <p className={`text-[11px] md:text-[13px] font-bold ${wTheme.textHead} opacity-70 uppercase tracking-widest mb-0.5`}>เบอร์โทรศัพท์ (ติดต่อด่วน)</p>
                    {dutyPerson.techPhone && dutyPerson.techPhone !== '-' ? (
                       <a href={`tel:${dutyPerson.techPhone.replace(/\D/g, '')}`} className={`text-[16px] md:text-[20px] font-black font-mono tracking-wider ${wTheme.textName} drop-shadow-sm truncate hover:opacity-80 transition-opacity block`}>
                         {formatDisplayPhone(dutyPerson.techPhone)}
                       </a>
                    ) : (
                       <p className={`text-[16px] md:text-[20px] font-black font-mono tracking-wider text-slate-500 drop-shadow-sm truncate`}>
                         ไม่มีข้อมูล
                       </p>
                    )}
                  </div>
                </div>

              </div>
            </div>
          );
        }


          // 🌟 3. โหมดวันธรรมดา (ไม่มีเวร)
          return (
            <div className="mb-2 mt-4 p-3.5 md:p-5 rounded-2xl border-[2px] border-dashed border-cyan-400/80 bg-slate-900/50 flex items-center gap-3.5 md:gap-5 transition-all shadow-inner">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-800 flex items-center justify-center border border-slate-600 shrink-0 shadow-sm">
                <AlertCircle className="w-6 h-6 md:w-12 md:h-12 text-orange-400" />
              </div>
              <div className="flex-1">
                <p className="text-[15px] md:text-[18px] font-bold text-slate-300 leading-tight">
                  วันนี้ <span className={`${dayColors[dayOfWeek]} font-black tracking-wide mx-0.5`}>{daysThai[dayOfWeek]}</span> ไม่มีเจ้าหน้าที่เวร SSC
                </p>
                <p className="text-[13px] md:text-[16px] text-slate-300 font-bold mt-1 leading-snug">
                  แต่มี <span className="text-orange-400 font-black tracking-wide"> ผู้รับผิดชอบหลัก</span> พร้อมให้บริการค่ะ!
                </p>
              </div>
            </div>
          );
        })()}

        {/* ================= กรอบที่ 1: ข้อมูลผู้แจ้งซ่อม (ธีม Emerald 🟢) ================= */}
        <div className="relative bg-slate-900/80 backdrop-blur-xl border-[2px] border-solid border-emerald-500/60 rounded-[1.5rem] p-5 md:p-8 shadow-[0_0_30px_rgba(16,185,129,0.5)] mt-6 overflow-hidden">
          
          {/* แสง Flare พื้นหลังเพิ่มความ Sci-Fi */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-emerald-500/20 blur-[60px] rounded-full pointer-events-none z-0"></div>

          {/* 🌟 Header รูปแบบใหม่ ฝังในกล่อง ไร้รอยต่อ ไร้การทับซ้อน */}
          <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8 pb-4 border-b-2 border-dashed border-emerald-500/30 relative z-10">
            <div className="bg-emerald-950 border-[2px] border-solid border-emerald-400 p-2 md:p-3 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              <User className="text-emerald-400 w-5 h-5 md:w-7 md:h-7" strokeWidth={2.5} />
            </div>
            <h2 className="text-[18px] md:text-[24px] font-black text-emerald-400 tracking-widest uppercase drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]">
              1. ข้อมูลผู้แจ้งซ่อม
            </h2>
          </div>

          {/* 🌟 ฟันธง: เปลี่ยนจากฟอร์มกรอกข้อมูล เป็นสมาร์ทการ์ดแสดงข้อมูลอัตโนมัติ 1,000,000% */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5 relative z-10 animate-in fade-in zoom-in-95 duration-500">
            
            {/* การ์ด: ชื่อ-นามสกุล */}
            <div className="bg-slate-950/50 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-4 shadow-inner">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-emerald-900/50 flex items-center justify-center border border-emerald-400/50 shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                 <User className="text-emerald-400 w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[11px] md:text-[13px] font-bold text-emerald-200/70 uppercase tracking-widest mb-0.5">ชื่อ-นามสกุล (อัตโนมัติ)</p>
                <p className="text-[16px] md:text-[20px] font-black text-emerald-300 drop-shadow-sm truncate">
                  {formData.reporter || 'กำลังโหลดข้อมูล...'}
                </p>
              </div>
            </div>

            {/* การ์ด: เบอร์โทรศัพท์ */}
            <div className="bg-slate-950/50 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-4 shadow-inner">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-emerald-900/50 flex items-center justify-center border border-emerald-400/50 shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                 <Phone className="text-emerald-400 w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[11px] md:text-[13px] font-bold text-emerald-200/70 uppercase tracking-widest mb-0.5">เบอร์โทรศัพท์ (อัตโนมัติ)</p>
                <p className="text-[16px] md:text-[20px] font-black font-mono tracking-wider text-emerald-300 drop-shadow-sm truncate">
                  {formData.reporterContact || 'กำลังโหลดข้อมูล...'}
                </p>
              </div>
            </div>

            {/* การ์ด: สังกัด/ฝ่าย (กินพื้นที่เต็ม 2 คอลัมน์ในโหมด PC) */}
            <div className="bg-slate-950/50 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-4 md:col-span-2 shadow-inner">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-emerald-900/50 flex items-center justify-center border border-emerald-400/50 shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                 <Briefcase className="text-emerald-400 w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[11px] md:text-[13px] font-bold text-emerald-200/70 uppercase tracking-widest mb-0.5">หน่วยงาน (อัตโนมัติ)</p>
                <p className="text-[14px] md:text-[18px] font-black text-emerald-300 drop-shadow-sm truncate">
                  {formData.position ? `${formData.position} | ` : ''} {formData.department || 'ไม่ระบุฝ่าย'} | {formData.bureau}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* ================= กรอบที่ 2: ข้อมูลการแจ้งซ่อม (ธีม Orange 🟠) ================= */}
        <div className="relative bg-slate-900/80 backdrop-blur-xl border-[2px] border-solid border-orange-500/60 rounded-[1.5rem] p-5 md:p-8 shadow-[0_0_30px_rgba(249,115,22,0.2)] mt-8 overflow-hidden">
          
          {/* แสง Flare พื้นหลังเพิ่มความ Sci-Fi */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-orange-500/20 blur-[60px] rounded-full pointer-events-none z-0"></div>

          {/* 🌟 Header รูปแบบใหม่ ฝังในกล่อง ไร้รอยต่อ */}
          <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8 pb-4 border-b-2 border-dashed border-orange-500/30 relative z-10">
            <div className="bg-orange-950 border-[2px] border-solid border-orange-400 p-2 md:p-3 rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.4)]">
              <Wrench className="text-orange-400 w-5 h-5 md:w-7 md:h-7" strokeWidth={2.5} />
            </div>
            <h2 className="text-[18px] md:text-[24px] font-black text-orange-400 tracking-widest uppercase drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]">
              2. ข้อมูลการแจ้งซ่อม
            </h2>
          </div>

          <div className="space-y-5 md:space-y-6 relative z-10">
            {/* 🌟 ดรอปดาวน์กลุ่มงาน */}
            <SciFiSelectModal
              id="field-equipmentCategory"
              themeColor="amber"
              label={
                <span className="text-[16px] md:text-[20px] font-black tracking-wide text-orange-300 flex items-center gap-1.5 md:gap-2">
                  <Activity size={18} className="md:w-5 md:h-5"/> กลุ่มงาน / ภารกิจรับผิดชอบ <span className="text-rose-500">*</span>
                </span>
              }
              placeholder="เลือกกลุ่มงาน/ภารกิจ"
              options={Object.keys(equipmentCategories)}
              value={formData.equipmentCategory}
              onChange={(val) => {
                setFormData({ ...formData, equipmentCategory: val, equipment: '' });
                if (formErrors.equipmentCategory) setFormErrors({ ...formErrors, equipmentCategory: null });
              }}
              error={formErrors.equipmentCategory}
            />

            {/* 🌟 ดรอปดาวน์รายการอุปกรณ์ */}
            <SciFiSelectModal
              id="field-equipment"
              themeColor="cyan"
              label={
                <span className="text-[16px] md:text-[20px] font-black tracking-wide text-orange-300 flex items-center gap-1.5 md:gap-2">
                  <Monitor size={18} className="md:w-5 md:h-5"/> รายการอุปกรณ์ / ระบบ <span className="text-rose-500">*</span>
                </span>
              }
              placeholder={formData.equipmentCategory ? "เลือกอุปกรณ์" : "กรุณาเลือกกลุ่มงานก่อน"}
              options={formData.equipmentCategory ? equipmentCategories[formData.equipmentCategory] : []}
              value={formData.equipment}
              onChange={(val) => {
                setFormData({ ...formData, equipment: val });
                if (formErrors.equipment) setFormErrors({ ...formErrors, equipment: null });
              }}
              error={formErrors.equipment}
            />

<div className="space-y-1.5 md:space-y-2" id="field-description">
              <label className="text-[16px] md:text-[20px] font-black text-orange-300 uppercase tracking-wide ml-1 flex items-center gap-1.5 md:gap-2">
                <AlertCircle size={18} className="md:w-5 md:h-5" /> อาการเสีย / รายละเอียดปัญหา <span className="text-rose-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className={`w-full bg-slate-900 border-[2px] border-solid ${
                  formErrors.description
                    ? 'border-rose-500 ring-1 ring-rose-500/30'
                    : 'border-orange-500/40 focus:border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.1)] focus:shadow-[0_0_25px_rgba(249,115,22,0.8)]'
                } rounded-2xl px-5 py-4 md:py-5 outline-none text-sm md:text-[16px] font-bold text-orange-100 placeholder:text-orange-200/40 resize-none transition-all duration-300`}
                placeholder="อธิบายรายละเอียดอาการเสีย"
                />

              {formErrors.description && (
                <div className="text-rose-500 text-[13px] md:text-[15px] font-bold mt-1.5 ml-1 animate-in fade-in">
                  ⚠️ {formErrors.description}
                </div>
              )}
            </div>

            <div className="space-y-1.5 md:space-y-2">
              <label className="text-[16px] md:text-[20px] font-black text-orange-300 uppercase tracking-wide ml-1 flex items-center gap-1.5 md:gap-2">
                <Hash size={18} className="md:w-5 md:h-5" /> หมายเลขครุภัณฑ์ (หากมี)
              </label>
              <input
                name="assetNumber"
                value={formData.assetNumber}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border-[2px] border-solid border-orange-500/40 focus:border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.2)] focus:shadow-[0_0_25px_rgba(249,115,22,0.5)] rounded-2xl px-5 py-4 md:py-5 text-sm md:text-[16px] font-bold text-orange-100 outline-none font-mono tracking-widest transition-all duration-300 placeholder:text-orange-200/40"
                placeholder="ระบุหมายเลขครุภัณฑ์"
              />
            </div>

            {/* 🌟 ดรอปดาวน์อาคาร */}
            <SciFiSelectModal
              id="field-building"
              themeColor="orange"
              label={
                <span className="text-[16px] md:text-[20px] font-black tracking-wide text-orange-300 flex items-center gap-1.5 md:gap-2">
                  <Building size={18} className="md:w-5 md:h-5"/> อาคาร / ตึก <span className="text-rose-500">*</span>
                </span>
              }
              placeholder="เลือกอาคาร"
              options={buildingList}
              value={formData.building}
              onChange={(val) => {
                setFormData({ ...formData, building: val });
                if (formErrors.building) setFormErrors({ ...formErrors, building: null });
              }}
              error={formErrors.building}
            />
            
            <div className="space-y-1.5 md:space-y-2" id="field-room">
                <label className="text-[16px] md:text-[20px] font-black text-orange-300 uppercase tracking-wide ml-1 flex items-center gap-1.5 md:gap-2">
                  <DoorOpen size={18} className="text-orange-400 md:w-5 md:h-5" /> สถานที่ / ห้อง <span className="text-rose-500">*</span>
                </label>

                <input
                  name="room"
                  value={formData.room}
                  onChange={handleInputChange}
                  autoComplete="off" 
                  className={`w-full bg-slate-900 border-[2px] border-solid ${
                    formErrors.room
                      ? 'border-rose-500 ring-1 ring-rose-500/30'
                      : 'border-orange-500/30 focus:border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.2)] focus:shadow-[0_0_25px_rgba(249,115,22,0.8)]'
                  } rounded-2xl px-5 py-4 md:py-5 text-sm md:text-[16px] font-bold text-orange-100 outline-none transition-all duration-300 placeholder:text-slate-500 [&:-webkit-autofill]:bg-slate-900 [&:-webkit-autofill]:text-orange-100 [&:-webkit-autofill]:shadow-[0_0_0_1000px_#0f172a_inset]`}
                  placeholder="ระบุสถานที่หรือห้อง"
                />
                
                {formErrors.room && (
                  <div className="text-rose-500 text-[11px] md:text-[13px] font-bold mt-1.5 ml-1 animate-in fade-in">
                    ⚠️ {formErrors.room}
                  </div>
                )}
              </div>

              {/* ❌ สไนเปอร์ลบก้อนป้ายเตือน SSC ออกให้หมดแล้วครับ! คลีนสุดๆ ประหยัดไปอีก 1 บรรทัด! */}

            {/* ================= โซนอัปโหลดภาพ (Sci-Fi เรืองแสง) ================= */}
            <div className="space-y-4 pt-6 border-t-[2px] border-dashed border-orange-500/30" id="field-images">
              <div className="flex justify-between items-center ml-1 mb-2">
                <label className="text-[16px] md:text-[20px] font-black text-orange-300 uppercase tracking-wide flex items-center gap-1.5 md:gap-2">
                  <Camera className="md:w-5 md:h-5" /> 
                  แนบรูปภาพประกอบ <span className="text-rose-500">*</span>
                </label>


                <div className="bg-orange-950 border border-orange-500/80 text-orange-400 text-[16px] md:text-[20px] font-black px-3 py-1 rounded-lg shadow-[0_0_10px_rgba(249,115,22,0.8)] backdrop-blur-sm">
                  {formData.images.length} / 6 รูป
                </div>
              </div>


              {/* 🌟 ฟันธง: ปรับลดขนาดรูปภาพให้เล็กลง ประหยัดพื้นที่ โดยใช้ grid-cols-5 md:grid-cols-7 */}
              <div className={formData.images.length === 0 ? "flex w-full" : "grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 gap-2 md:gap-3"}>
                
                {formData.images.map((img, i) => (
                  <div 
                    key={i} 
                    className="relative aspect-square rounded-xl overflow-hidden border-[2px] border-orange-400/80 shadow-[0_0_15px_rgba(249,115,22,0.3)] group cursor-pointer"
                    onClick={() => setLightboxImg(img)} 
                  >
                    <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="รูปประกอบ" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation(); 
                        setFormData({ ...formData, images: formData.images.filter((_, idx) => idx !== i) });
                      }}
                      className="absolute top-1 right-1 bg-rose-500/90 backdrop-blur-sm text-white p-1 rounded-full shadow-lg transition-all active:scale-75 hover:bg-rose-600 border border-rose-400 z-10"
                    >
                      <X size={12} className="w-3 h-3 md:w-3.5 md:h-3.5 stroke-[3px]" />
                    </button>
                  </div>
                ))}
                
              {/* 🎯 ปุ่มเรียกเมนูเลือกรูป (ปรับให้ขนาดเล็กลงเข้ากับตาราง) */}
              <div onClick={() => setShowImagePicker(true)} className={`border-2 border-dashed border-cyan-300/80 bg-cyan-950/20 hover:bg-orange-900/40 hover:border-orange-400 rounded-xl flex flex-col items-center justify-center transition-all duration-300 cursor-pointer shadow-[inset_0_0_20px_rgba(6,182,212,0.8)] hover:shadow-[0_0_25px_rgba(249,115,22,0.5)] group ${formData.images.length === 0 ? 'w-full h-24 md:h-32' : 'aspect-square'}`}>
                <Camera size={formData.images.length === 0 ? 32 : 20} className="text-white-300/70 group-hover:text-orange-400 mb-1 transition-all" />
                <span className="font-black tracking-widest text-cyan-300/80 group-hover:text-cyan-300 text-[9px] md:text-[12px]">
                  {formData.images.length === 0 ? 'คลิกแนบรูปภาพ' : 'เพิ่มรูป'}
                </span>
              </div>
            </div> {/* ปิด div ของตารางรูปภาพ */}


      {/* ======================================================= */}
      {/* 🌟 จุดเริ่มต้น: หน้าต่างป๊อบอัพเลือกรูปภาพ (Hybrid: Mobile เรืองแสง + PC วูบวาบ 1,000,000%) */}
      {/* ======================================================= */}
      {showImagePicker && typeof document !== 'undefined' ? createPortal(
        <div 
          className="fixed inset-0 w-screen h-screen z-[999999] flex items-center justify-center bg-slate-950/90 backdrop-blur-md overscroll-none touch-none" 
          onClick={() => setShowImagePicker(false)}
  >
    {/* 🔥 เอฟเฟกต์ดวงไฟพลาสม่า สว่างวาบอยู่ด้านหลังกล่อง */}
    <div className="absolute w-[250px] h-[250px] md:w-[350px] md:h-[350px] bg-cyan-500/50 rounded-full blur-[80px] animate-pulse pointer-events-none z-0"></div>

    {/* 🎯 กล่องหลัก: ขอบหนา แสง Cyan พื้นฐาน และจะสว่างขึ้นอีกถ้าเอาเมาส์ไปชี้ใน PC */}
    <div 
      className="bg-slate-900 border-[3px] border-cyan-400 rounded-[2.5rem] p-6 sm:p-8 w-11/12 max-w-sm text-center shadow-[0_0_40px_rgba(34,211,238,0.6),inset_0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_60px_rgba(34,211,238,0.9),inset_0_0_25px_rgba(34,211,238,0.5)] transition-all duration-500 animate-in zoom-in-95 relative z-10"
      onClick={(e) => e.stopPropagation()} 
    >
      <h3 className="text-[18px] md:text-2xl font-black text-cyan-200 mb-6 tracking-widest drop-shadow-[0_0_15px_rgba(34,211,238,1)] flex items-center justify-center gap-2">
        <Monitor size={22} className="text-cyan-400 animate-pulse" /> เลือกรูปภาพ
      </h3>
      
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* 📸 ปุ่มถ่ายรูป (สีส้ม): เรืองแสงในมือถือ และระเบิดแสง+เด้งขึ้น เมื่อชี้เมาส์ใน PC */}
        <label className="flex flex-col items-center justify-center bg-gradient-to-b from-orange-500 to-orange-700 p-5 rounded-2xl cursor-pointer transition-all duration-300 border-[2px] border-orange-300 shadow-[0_0_20px_rgba(249,115,22,0.6),inset_0_0_10px_rgba(255,255,255,0.2)] md:hover:scale-105 md:hover:shadow-[0_0_45px_rgba(249,115,22,1),inset_0_0_20px_rgba(255,255,255,0.4)] md:hover:brightness-125 active:scale-90 group">
          <input 
            type="file" accept="image/*" capture="environment" multiple 
            onChange={(e) => { handleImageUpload(e); setShowImagePicker(false); }} className="hidden" 
          />
          <Camera size={42} className="text-white mb-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] group-hover:animate-pulse group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,1)]" />
          <span className="text-white font-black tracking-widest drop-shadow-md text-[15px] sm:text-[16px]">ถ่ายรูป</span>
        </label>

        {/* 🖼️ ปุ่มคลังรูปภาพ (สีเขียว): เรืองแสงในมือถือ และระเบิดแสง+เด้งขึ้น เมื่อชี้เมาส์ใน PC */}
        <label className="flex flex-col items-center justify-center bg-gradient-to-b from-emerald-500 to-emerald-700 p-5 rounded-2xl cursor-pointer transition-all duration-300 border-[2px] border-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.6),inset_0_0_10px_rgba(255,255,255,0.2)] md:hover:scale-105 md:hover:shadow-[0_0_45px_rgba(16,185,129,1),inset_0_0_20px_rgba(255,255,255,0.4)] md:hover:brightness-125 active:scale-90 group">
          <input 
            type="file" accept="image/*" multiple 
            onChange={(e) => { handleImageUpload(e); setShowImagePicker(false); }} className="hidden" 
          />
          <Monitor size={42} className="text-white mb-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] group-hover:animate-pulse group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,1)]" />
          <span className="text-white font-black tracking-widest drop-shadow-md text-[15px] sm:text-[16px]">คลังภาพ</span>
        </label>
      </div>

      {/* ❌ ปุ่มยกเลิก: สีแดง Sci-Fi เอาเมาส์ชี้แล้วไฟลุก */}
      <button 
        type="button"
        onClick={() => setShowImagePicker(false)} 
        className="w-full mt-6 py-3.5 sm:py-4 rounded-xl font-black text-rose-100 bg-rose-900/60 border-[2px] border-rose-500 shadow-[0_0_15px_rgba(225,29,72,0.4),inset_0_0_10px_rgba(225,29,72,0.2)] active:scale-90 transition-all duration-300 tracking-widest uppercase text-[15px] sm:text-[16px] md:hover:bg-rose-600 md:hover:text-white md:hover:shadow-[0_0_35px_rgba(225,29,72,0.9),inset_0_0_15px_rgba(225,29,72,0.5)] md:hover:-translate-y-1"
      >
        ยกเลิก
      </button>
    </div>
  </div>,
  document.body
  ) : null}
</div>
</div>
</div>

{/* ======================================================= */}
{/* 🌟 จุดสิ้นสุด: หน้าต่างป๊อบอัพเลือกรูปภาพ (Hybrid: Mobile เรืองแสง + PC วูบวาบ) */}
{/* ======================================================= */}
          
          <div className="pt-6 px-2 md:px-0 flex flex-col md:flex-row items-center gap-4 text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="group w-full md:flex-[2] bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-yellow-400 hover:shadow-[0_0_25px_rgba(249,115,22,0.8)] hover:-translate-y-1 text-white font-black text-[20px] md:text-[30px] py-4 md:py-5 rounded-[1rem] md:rounded-2xl shadow-xl shadow-orange-500/30 active:scale-95 transition-all duration-300 flex justify-center items-center gap-3 disabled:grayscale disabled:opacity-50 border-2 border-solid border-white/80"
            >
              <Send size={26} className="md:w-7 md:h-7" />{' '}
              <span className="tracking-wide">ยืนยันแจ้งซ่อม</span>
            </button>

            <button
              type="button"
              onClick={handleResetForm}
              className="w-full md:flex-[1] bg-emerald-600 text-white hover:bg-rose-500 hover:text-white hover:shadow-[0_0_15px_rgba(244,63,94,0.8)] hover:-translate-y-1 font-bold text-[18px] md:text-[22px] py-3.5 md:py-5 rounded-2xl flex items-center justify-center gap-2 border-2 border-solid border-white/80 active:scale-95 shadow-sm transition-all"
            >
              <RotateCcw size={18} className="md:w-6 md:h-6" /> ล้างข้อมูล
            </button>

          </div>

{/* 🌟 หน้าต่าง Numpad ไซไฟอวกาศ (เวอร์ชันอัปเกรด UI แสงเฟลอร์ 1,000,000%) */}
{showNumpad && (
  <div 
    className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 animate-in fade-in duration-300 outline-none" 
    onClick={() => setShowNumpad(false)}
    tabIndex={0}
    ref={(el) => el && el.focus()}
    onKeyDown={(e) => {
      if (/^[0-9]$/.test(e.key)) {
        let current = formData.reporterContact ? formData.reporterContact.replace(/\D/g, '') : '';
        if (current.length < 10) current += e.key;
        let formatted = current;
        if (current.length > 6) formatted = `${current.substring(0, 2)}-${current.substring(2, 6)}-${current.substring(6)}`;
        else if (current.length > 2) formatted = `${current.substring(0, 2)}-${current.substring(2)}`;
        setFormData(prev => ({ ...prev, reporterContact: formatted }));
        if (formErrors.reporterContact) setFormErrors(prev => ({ ...prev, reporterContact: null }));
      }
      
      if (e.key === 'Backspace' || e.key === 'Delete') {
        let current = formData.reporterContact ? formData.reporterContact.replace(/\D/g, '') : '';
        current = current.slice(0, -1);
        let formatted = current;
        if (current.length > 6) formatted = `${current.substring(0, 2)}-${current.substring(2, 6)}-${current.substring(6)}`;
        else if (current.length > 2) formatted = `${current.substring(0, 2)}-${current.substring(2)}`;
        setFormData(prev => ({ ...prev, reporterContact: formatted }));
      }

      if (e.key.toLowerCase() === 'c' || e.key === 'Escape') {
        setFormData(prev => ({ ...prev, reporterContact: '' }));
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        const digits = formData.reporterContact ? formData.reporterContact.replace(/\D/g, '') : '';
        if (digits.length > 0 && digits.length < 10) {
          setFormErrors(prev => ({ ...prev, reporterContact: 'กรุณาระบุเบอร์โทรศัพท์ให้ครบ 10 หลัก' }));
        } else {
          setFormErrors(prev => ({ ...prev, reporterContact: null }));
        }
        setShowNumpad(false);
      }
    }}
  >
    
    {/* แสง Flare พื้นหลัง */}
    <div className="absolute w-[350px] md:w-[500px] h-[350px] md:h-[500px] bg-emerald-500/30 rounded-full blur-[100px] md:blur-[150px] pointer-events-none z-0 animate-pulse"></div>

    {/* 🌟 ปรับขนาดกล่องให้กว้างเท่า Login Popup (max-w-sm) และขอบเรืองแสงสีฟ้า */}
    <div className="relative m-auto z-10 w-full max-w-sm bg-slate-900 border-[3px] border-solid border-cyan-500/80 rounded-[2.5rem] p-6 shadow-[0_0_40px_rgba(34,211,238,0.3)] flex flex-col gap-4 sm:gap-5 transition-all duration-300 overflow-hidden outline-none" onClick={(e) => e.stopPropagation()}>
       
       {/* ปุ่มปิด X มุมขวาบน */}
       <button 
         type="button"
         onClick={() => setShowNumpad(false)} 
         className="absolute right-5 top-5 text-slate-400 hover:text-rose-400 transition-colors z-20"
       >
         <X size={28} className="stroke-[2.5px]" />
       </button>

       {/* 🌟 ไอคอนโทรศัพท์สีเขียวเรืองแสง */}
       <div className="relative mt-2 mx-auto">
          <div className="absolute inset-0 bg-emerald-500 blur-[20px] opacity-40 rounded-full"></div>
          <div className="relative w-16 h-16 bg-slate-950 border-[2px] border-emerald-400 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.6)] mx-auto">
            <Phone className="w-8 h-8 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          </div>
       </div>

       <h3 className="font-black tracking-widest text-[18px] md:text-[20px] text-center text-orange-400 drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]">
         ระบุเบอร์โทรศัพท์
       </h3>
       
       {/* 🌟 กล่องแสดงเบอร์โทร เรืองแสงสีฟ้า */}
       <div className="bg-slate-950 border-[2px] border-solid border-cyan-400 rounded-2xl py-4 px-4 text-center shadow-[0_0_15px_rgba(34,211,238,0.4),inset_0_0_10px_rgba(34,211,238,0.2)] flex items-center justify-center min-h-[70px] shrink-0 transition-all">
         <span className={`text-[24px] sm:text-[28px] md:text-[32px] font-mono font-black tracking-widest ${formData.reporterContact ? 'text-cyan-300 drop-shadow-[0_0_12px_rgba(34,211,238,0.9)]' : 'text-slate-500'}`}>
           {formData.reporterContact || '0X-XXXX-XXXX'}
         </span>
       </div>

       {/* 🌟 แป้นพิมพ์ 3 มิติ โฮเวอร์เรืองแสง */}
       <div className="grid grid-cols-3 gap-3 shrink-0 px-1">
         {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
           <button 
             key={num} type="button" 
             onClick={() => {
               let current = formData.reporterContact ? formData.reporterContact.replace(/\D/g, '') : '';
               if (current.length < 10) current += num;
               let formatted = current;
               if (current.length > 6) formatted = `${current.substring(0, 2)}-${current.substring(2, 6)}-${current.substring(6)}`;
               else if (current.length > 2) formatted = `${current.substring(0, 2)}-${current.substring(2)}`;
               setFormData(prev => ({ ...prev, reporterContact: formatted }));
               if (formErrors.reporterContact) setFormErrors(prev => ({ ...prev, reporterContact: null }));
             }} 
             className="h-14 bg-slate-800 border-[2px] border-b-[4px] border-slate-600 hover:border-cyan-400 hover:text-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] active:border-b-[2px] active:translate-y-[2px] rounded-2xl text-2xl font-black text-white transition-all"
           >
             {num}
           </button>
         ))}
         
         {/* ปุ่ม C สีส้ม/เหลืองเรืองแสง */}
         <button 
           type="button" 
           onClick={() => setFormData(prev => ({ ...prev, reporterContact: '' }))} 
           className="h-14 bg-slate-800 border-[2px] border-b-[4px] border-amber-600/70 text-amber-500 hover:border-amber-400 hover:text-amber-300 hover:shadow-[0_0_15px_rgba(251,191,36,0.5)] active:border-b-[2px] active:translate-y-[2px] rounded-2xl text-2xl font-black transition-all flex items-center justify-center"
         >
           C
         </button>
         
         <button 
           type="button" 
           onClick={() => {
             let current = formData.reporterContact ? formData.reporterContact.replace(/\D/g, '') : '';
             if (current.length < 10) current += '0';
             let formatted = current;
             if (current.length > 6) formatted = `${current.substring(0, 2)}-${current.substring(2, 6)}-${current.substring(6)}`;
             else if (current.length > 2) formatted = `${current.substring(0, 2)}-${current.substring(2)}`;
             setFormData(prev => ({ ...prev, reporterContact: formatted }));
             if (formErrors.reporterContact) setFormErrors(prev => ({ ...prev, reporterContact: null }));
           }} 
           className="h-14 bg-slate-800 border-[2px] border-b-[4px] border-slate-600 hover:border-cyan-400 hover:text-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] active:border-b-[2px] active:translate-y-[2px] rounded-2xl text-2xl font-black text-white transition-all"
         >
           0
         </button>
         
         {/* ปุ่ม X สีแดงเรืองแสง */}
         <button 
           type="button" 
           onClick={() => {
             let current = formData.reporterContact ? formData.reporterContact.replace(/\D/g, '') : '';
             current = current.slice(0, -1);
             let formatted = current;
             if (current.length > 6) formatted = `${current.substring(0, 2)}-${current.substring(2, 6)}-${current.substring(6)}`;
             else if (current.length > 2) formatted = `${current.substring(0, 2)}-${current.substring(2)}`;
             setFormData(prev => ({ ...prev, reporterContact: formatted }));
           }} 
           className="h-14 bg-slate-800 border-[2px] border-b-[4px] border-rose-700/70 text-rose-500 hover:border-rose-400 hover:text-rose-300 hover:shadow-[0_0_15px_rgba(244,63,94,0.5)] active:border-b-[2px] active:translate-y-[2px] rounded-2xl flex items-center justify-center transition-all"
         >
           <X size={28} className="drop-shadow-md stroke-[3px]" />
         </button>
       </div>

       {/* 🌟 ปุ่มยืนยัน (ส้ม โฮเวอร์เป็น ฟ้า-เขียว) */}
       <button 
         type="button" 
         onClick={() => {
           const digits = formData.reporterContact ? formData.reporterContact.replace(/\D/g, '') : '';
           if (digits.length > 0 && digits.length < 10) {
             setFormErrors(prev => ({ ...prev, reporterContact: 'กรุณาระบุเบอร์โทรศัพท์ให้ครบ 10 หลัก' }));
           } else {
             setFormErrors(prev => ({ ...prev, reporterContact: null }));
           }
           setShowNumpad(false);
         }} 
         className="w-full mt-2 h-14 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-lg rounded-2xl border-[2px] border-solid border-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.5)] hover:from-cyan-500 hover:to-emerald-500 hover:border-cyan-300 hover:shadow-[0_0_25px_rgba(34,211,238,0.7)] active:scale-95 transition-all duration-300 tracking-widest shrink-0"
       >
         ยืนยัน
       </button>
    </div>
  </div>
)}
        
      </form>

      )}

     {/* 🌟 หน้าต่าง Popup ยืนยันข้อมูล (เวอร์ชันแก้ Error หน้าจอแดงถาวร - ผูกคีย์บอร์ด PC คลีน 100% ตามกฎ React) */}
{/* 🌟 หน้าต่าง Popup ยืนยันข้อมูล (อัปเกรด: กลางวัน/กลางคืน แบบโค้ดเซฟ 100%) */}
{confirmSubmitModal && (
        <div 
          className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-6 animate-in fade-in outline-none"
          onClick={() => setConfirmSubmitModal(false)}
          tabIndex={0}
          ref={(el) => el && el.focus()}
          onKeyDown={(e) => {
            if (e.key === 'Escape') { e.preventDefault(); setConfirmSubmitModal(false); }
            if (e.key === 'Enter') { e.preventDefault(); executeSubmit(); }
          }}
        >
          {/* แสง Flare พื้นหลัง */}
          <div className={`absolute w-[300px] h-[300px] rounded-full blur-[80px] animate-pulse pointer-events-none z-0 ${(sysTime.getHours() >= 21 || sysTime.getHours() < 8 || (sysTime.getHours() === 8 && sysTime.getMinutes() < 30)) ? 'bg-indigo-500/40' : 'bg-orange-500/40'}`}></div>

          <div className={`relative z-10 bg-slate-800 border-[2px] border-solid rounded-[2rem] w-full max-w-sm overflow-hidden p-8 text-center space-y-6 transition-all duration-500 ${(sysTime.getHours() >= 21 || sysTime.getHours() < 8 || (sysTime.getHours() === 8 && sysTime.getMinutes() < 30)) ? 'border-indigo-500 shadow-[0_0_40px_rgba(99,102,241,1)]' : 'border-orange-500 shadow-[0_0_40px_rgba(249,115,22,1)]'}`} onClick={(e) => e.stopPropagation()}>
            
            {/* วงแหวนไอคอน */}
            <div className={`w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mx-auto border-2 relative ${(sysTime.getHours() >= 21 || sysTime.getHours() < 8 || (sysTime.getHours() === 8 && sysTime.getMinutes() < 30)) ? 'text-indigo-400 border-indigo-400/50 shadow-[0_0_20px_rgba(99,102,241,0.8)]' : 'text-orange-500 border-orange-400/50 shadow-[0_0_20px_rgba(249,115,22,0.8)]'}`}>
              <div className={`absolute inset-0 border-4 rounded-full border-t-transparent animate-spin opacity-50 ${(sysTime.getHours() >= 21 || sysTime.getHours() < 8 || (sysTime.getHours() === 8 && sysTime.getMinutes() < 30)) ? 'border-indigo-500' : 'border-orange-500'}`}></div>
              {(sysTime.getHours() >= 21 || sysTime.getHours() < 8 || (sysTime.getHours() === 8 && sysTime.getMinutes() < 30)) ? <Moon size={45} className="animate-pulse" /> : <CheckSquare size={50} className="animate-pulse" />}
            </div>

            {/* ข้อความ */}
            <div>
              <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight drop-shadow-md mb-2">
                {(sysTime.getHours() >= 21 || sysTime.getHours() < 8 || (sysTime.getHours() === 8 && sysTime.getMinutes() < 30)) ? 'เวลานอกทำการ 🌙' : 'ยืนยันข้อมูล?'}
              </h3>
              
              {(sysTime.getHours() >= 21 || sysTime.getHours() < 8 || (sysTime.getHours() === 8 && sysTime.getMinutes() < 30)) ? (
                <div className="text-[13px] md:text-[15px] text-indigo-200 font-bold leading-relaxed bg-indigo-950/50 p-4 rounded-xl border border-indigo-500/30 shadow-inner">
                  ขณะนี้ไม่มีเจ้าหน้าที่ ฝวด. และเวร SSC ประจำการ <br/>
                  <span className="text-rose-400">ระบบจะทำการบันทึกข้อมูลของท่านไว้</span> <br/>
                  และทีมช่างจะเร่งดำเนินการตรวจสอบให้<br/>
                  <span className="text-emerald-400 font-black text-[16px]">ทันทีในเวลาทำการถัดไป</span>
                  <div className="mt-4 pt-3 border-t border-indigo-500/30 text-white font-black">ยืนยันฝากเรื่องแจ้งซ่อมหรือไม่?</div>
                </div>
              ) : (
                <p className="text-[18px] text-slate-300 font-bold leading-relaxed">
                  โปรดตรวจสอบข้อมูลให้ถูกต้อง<br />ก่อนส่งเข้าระบบ
                </p>
              )}
            </div>

            {/* ปุ่มกด */}
            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={() => setConfirmSubmitModal(false)}
                className="flex-1 py-3.5 rounded-xl font-bold text-white bg-slate-700 border-2 border-solid border-slate-500 shadow-lg active:scale-95 transition-all duration-300 hover:bg-rose-600 hover:border-rose-400 hover:shadow-[0_0_25px_rgba(225,29,72,0.8)] hover:-translate-y-1"
              >
                ยกเลิก
              </button>

              <button
                type="button"
                onClick={executeSubmit}
                className={`flex-[1.5] py-3.5 rounded-xl font-black text-white border-2 border-solid border-white scale-105 active:scale-95 transition-all duration-300 bg-gradient-to-r ring-4 ${(sysTime.getHours() >= 21 || sysTime.getHours() < 8 || (sysTime.getHours() === 8 && sysTime.getMinutes() < 30)) ? 'from-indigo-500 to-purple-600 ring-indigo-400/50 shadow-[0_0_30px_rgba(99,102,241,0.9)]' : 'from-orange-400 to-amber-400 ring-orange-400/50 shadow-[0_0_30px_rgba(249,115,22,0.9)]'} hover:brightness-110`}
              >
                {(sysTime.getHours() >= 21 || sysTime.getHours() < 8 || (sysTime.getHours() === 8 && sysTime.getMinutes() < 30)) ? 'ยืนยันฝากเรื่อง' : 'ยืนยันส่งข้อมูล'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

//เพิ่มปุ่ม แจ้งเหตุขัดข้อง รอยืนยัน
const renderTracking = () => (
  <div className="p-4 md:p-8 space-y-6 md:space-y-10 pb-32 md:pb-40 animate-in slide-in-from-left-4 duration-500 text-left">
    
    {/* 🌟 ฟันธงข้อ 3 & 4: มัดรวมทุกเมนูควบคุม (ปรับไซส์พอดีคำ + เอฟเฟกต์เมาส์ชี้ฟ้าเรืองแสง) */}
    <div className="relative pt-1 pb-4 md:pb-6 space-y-3 md:space-y-4 mb-2 md:mb-6 border-b-2 border-slate-700/50 animate-in fade-in duration-500">
      
      {/* 1. ช่องค้นหา (อัปเกรดให้พอดีคำ และเรืองแสงเมื่อเมาส์ชี้) */}
      <div className="flex-grow flex items-center bg-slate-900 border-2 border-solid border-cyan-800/80 rounded-xl md:rounded-2xl p-3 md:p-4 shadow-inner shadow-[0_0_8px_rgba(34,211,238,1)] hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,1)] transition-all duration-300 cursor-text group">
                <Search size={22} className="md:w-6 md:h-6 text-cyan-300 shrink-0 group-hover:text-cyan-100 group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,1)] transition-all" />
                <input
                  type="text"
                  placeholder="ค้นหา รหัส หรือ อุปกรณ์..."
                  className="bg-transparent flex-grow outline-none text-white px-3 md:px-4 font-bold md:text-[20px] placeholder:text-slate-500 placeholder:font-normal placeholder:md:text-[20px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* 2. สวิตช์กรองสถานะงาน (🌟 ฟันธง: เพิ่ม px-1 เพื่อกันเงาโดนตัด และเอา scale-[1.05] ออกไม่ให้ปุ่มล้นขอบ) */}
              <div className="flex gap-2 md:gap-4 overflow-x-auto py-2 md:py-3 px-1 snap-x w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                 {[
                   { id: 'all', label: 'ทั้งหมด' },
                   { id: 'pending', label: 'รอดำเนินการ' },
                   { id: 'fixing', label: 'กำลังซ่อม' },
                   { id: 'on_hold', label: 'แจ้งขัดข้อง' },
                   { id: 'verify', label: 'รอยืนยัน' },
                   { id: 'cancelled', label: 'ยกเลิก' },
                   { id: 'completed', label: 'เสร็จสิ้น' },
                 ].map((f) => (
                   <button
                     key={f.id}
                     onClick={() => {
                       setFilterStatus(f.id);
                       setSearchTerm('');
                     }}
                     className={`flex-none md:flex-1 px-4 md:px-0 py-2 md:py-3.5 text-[14px] md:text-[20px] font-black rounded-lg md:rounded-xl transition-all duration-300 snap-center whitespace-nowrap flex items-center justify-center ${filterStatus === f.id ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-[2px] border-solid border-orange-300 shadow-[0_0_15px_rgba(249,115,22,0.8)] z-10' : 'bg-slate-900 text-cyan-300 border-[2px] border-solid border-cyan-400/30 shadow-[0_0_8px_rgba(34,211,238,0.4)] hover:bg-cyan-900/60 hover:text-white hover:border-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,1)] hover:-translate-y-1'}`}
                   >
                     {f.label}
                   </button>
                 ))}
              </div>


      {/* 3. ปุ่มกรองเวลา (ฟันธง: จัดเรียงให้ขอบซ้าย-ขวา ตรงเป๊ะกับปุ่มสถานะด้านบน 100%) */}
      <div className="flex gap-2 md:gap-4 md:mt-2 w-full">
          
          <button onClick={() => setTrackTimeframe('all')} className={`flex-1 py-2 md:py-3.5 rounded-lg md:rounded-xl font-black text-[14px] md:text-[18px] transition-all duration-300 whitespace-nowrap flex items-center justify-center ${
            trackTimeframe === 'all' 
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.8)] border-[2px] border-solid border-cyan-300 scale-[1.02] z-10' 
              : 'bg-slate-950 text-cyan-300 border-[2px] border-solid border-cyan-400/30 shadow-[0_0_8px_rgba(34,211,238,0.4)] hover:bg-cyan-900/60 hover:text-white hover:border-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,1)] hover:-translate-y-1'
          }`}>ทุกวัน</button>

          {/* ระบุวัน */}
          <div className="relative flex-1">
            <button onClick={() => 
            setShowTrackDatePicker(true)} className={`w-full h-full py-2 md:py-3.5 rounded-lg md:rounded-xl font-black text-[14px] md:text-[18px] flex items-center justify-center gap-1.5 md:gap-2 transition-all duration-300 whitespace-nowrap ${
              trackTimeframe === 'custom_date' 
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.8)] border-[2px] border-solid border-cyan-300 scale-[1.02] z-10' 
                : 'bg-slate-950 text-cyan-300 border-[2px] border-solid border-cyan-400/30 shadow-[0_0_8px_rgba(34,211,238,0.4)] hover:bg-cyan-900/60 hover:text-white hover:border-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,1)] hover:-translate-y-1'
            }`}>
              <Calendar size={14} className={`md:w-5 md:h-5 ${trackTimeframe === 'custom_date' ? 'text-white animate-pulse' : 'text-cyan-400'}`}/> ระบุวัน
            </button>

            {showTrackDatePicker && (
                <div className="fixed inset-0 z-[300] bg-slate-900/80 backdrop-blur-md flex p-4 animate-in fade-in items-center justify-center" onClick={() => setShowTrackDatePicker(false)}>
                  {/* 🌟 ฟันธง: ล็อกตายหน้าเลือกวันของฝั่ง Track ห้ามไถ 1,000,000% */}
                  <div className="relative z-10 m-auto bg-slate-900 border-[2px] border-solid border-white rounded-[2rem] shadow-[0_0_60px_rgba(6,182,212,0.8)] w-[90%] max-w-[320px] sm:max-w-[340px] md:max-w-[550px] p-4 sm:p-5 md:p-10 text-center animate-in zoom-in-95 flex flex-col h-auto overflow-hidden outline-none" onClick={(e) => e.stopPropagation()}>
                    
                    <div className="absolute -top-20 -left-20 w-40 h-40 md:w-60 md:h-60 bg-cyan-500/60 rounded-full blur-[50px] pointer-events-none z-0"></div>
                    <div className="absolute -bottom-20 -right-20 w-40 h-40 md:w-60 md:h-60 bg-blue-500/60 rounded-full blur-[50px] pointer-events-none z-0"></div>
                    
                    <div className="relative z-10 flex justify-between items-center mb-6 md:mb-8 pb-5 md:pb-6 border-b border-white/20">
                      <button onClick={() => { if (trackCalMonth === 0) { setTrackCalMonth(11); setTrackCalYear(y => y - 1); } else setTrackCalMonth(m => m - 1); }} className="p-2.5 md:p-4 bg-slate-800 text-white rounded-xl md:rounded-2xl hover:bg-cyan-500 transition-colors border border-slate-600 active:scale-95 shadow-inner"><ChevronDown className="w-5 h-5 md:w-8 md:h-8 rotate-90" /></button>
                      <div className="flex flex-col items-center">
                        <span className="text-[14px] md:text-[18px] font-black text-white tracking-widest uppercase mb-0.5 md:mb-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">เลือกวันที่</span>
                        <span className="text-xl md:text-3xl font-black text-cyan-400 tracking-widest drop-shadow-[0_0_15px_rgba(6,182,212,0.9)]">{['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'][trackCalMonth]} {trackCalYear + 543}</span>
                      </div>
                      <button onClick={() => { if (trackCalMonth === 11) { setTrackCalMonth(0); setTrackCalYear(y => y + 1); } else setTrackCalMonth(m => m + 1); }} className="p-2.5 md:p-4 bg-slate-800 text-white rounded-xl md:rounded-2xl hover:bg-cyan-500 transition-colors border border-slate-600 active:scale-95 shadow-inner"><ChevronDown className="w-5 h-5 md:w-8 md:h-8 -rotate-90" /></button>
                    </div>
                    <div className="relative z-10">
                      <div className="grid grid-cols-7 gap-1 md:gap-2 mb-3 md:mb-5">
                        {['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'].map(day => (<div key={day} className={`text-[13px] md:text-[20px] font-black ${day === 'อา' ? 'text-rose-400' : day === 'ส' ? 'text-sky-400' : 'text-slate-300'}`}>{day}</div>))}
                      </div>

                      <div className="grid grid-cols-7 gap-1.5 md:gap-3">
                        {Array.from({ length: new Date(trackCalYear, trackCalMonth, 1).getDay() }).map((_, i) => (<div key={`empty-${i}`} />))}
                        {Array.from({ length: new Date(trackCalYear, trackCalMonth + 1, 0).getDate() }).map((_, i) => {
                          const day = i + 1;
                          const dateString = `${trackCalYear}-${String(trackCalMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                          const isSelected = trackDate === dateString;
                          const todayLocal = new Date(sysTime);
                          const isToday = todayLocal.getFullYear() === trackCalYear && todayLocal.getMonth() === trackCalMonth && todayLocal.getDate() === day;
                          const isSunday = new Date(dateString).getDay() === 0;
                          const isSaturday = new Date(dateString).getDay() === 6;

                          return (
                            <button 
                              key={day} 
                              onClick={() => { setTrackDate(dateString); setTrackTimeframe('custom_date'); setShowTrackDatePicker(false); }}
                              className={`aspect-square flex items-center justify-center rounded-xl md:rounded-2xl text-[15px] md:text-[22px] font-black transition-all duration-300 active:scale-95 ${
                                isSelected 
                                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.9)] border-[2px] border-solid border-cyan-300 scale-110 z-20' 
                                  : isToday 
                                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-[0_0_25px_rgba(249,115,22,1)] border-[2px] border-solid border-orange-300 z-10 animate-pulse' 
                                  : 'bg-slate-800 ' + (isSunday ? 'text-rose-400 drop-shadow-[0_0_5px_rgba(251,113,133,0.8)]' : isSaturday ? 'text-sky-400 drop-shadow-[0_0_5px_rgba(56,189,248,0.8)]' : 'text-slate-200') + ' hover:bg-cyan-500/50 hover:border-cyan-400 border border-white/60 shadow-inner'
                              }`}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <button onClick={() => setShowTrackDatePicker(false)} className="relative z-10 mt-8 md:mt-10 w-full py-4 md:py-6 rounded-xl md:rounded-2xl font-black text-white bg-cyan-600 hover:bg-rose-500 border-[2px] border-solid border-white shadow-[0_0_20px_rgba(6,182,212,0.7)] transition-all duration-300 active:scale-95 tracking-widest uppercase md:text-[22px]">ยกเลิก</button>
                  </div>
                </div>
              )}

          </div>

          {/* ระบุเดือน */}
          <div className="relative flex-1">
            <button onClick={() => setShowTrackMonthPicker(true)} className={`w-full h-full py-2 md:py-3.5 rounded-lg md:rounded-xl font-black text-[14px] md:text-[18px] flex items-center justify-center gap-1.5 md:gap-2 transition-all duration-300 whitespace-nowrap ${
              trackTimeframe === 'custom_month' 
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.8)] border-[2px] border-solid border-cyan-300 scale-[1.02] z-10' 
                : 'bg-slate-950 text-cyan-300 border-[2px] border-solid border-cyan-400/30 shadow-[0_0_8px_rgba(34,211,238,0.4)] hover:bg-cyan-900/60 hover:text-white hover:border-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,1)] hover:-translate-y-1'
            }`}>
              <Calendar size={14} className={`md:w-5 md:h-5 ${trackTimeframe === 'custom_month' ? 'text-white animate-pulse' : 'text-cyan-400'}`}/> ระบุเดือน
            </button>
            
            {showTrackMonthPicker && (
                <div className="fixed inset-0 z-[300] bg-slate-900/80 backdrop-blur-md flex p-4 animate-in fade-in items-center justify-center" onClick={() => setShowTrackMonthPicker(false)}>
                  
                  <div className="absolute w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-cyan-500/40 rounded-full blur-[80px] pointer-events-none z-0"></div>
                  
                  {/* 🌟 ฟันธง: ล็อกตายหน้าเลือกเดือนของฝั่ง Track ห้ามไถ 1,000,000% */}
                  <div className="relative z-10 m-auto bg-slate-900 border-[2px] border-solid border-white rounded-[2rem] shadow-[0_0_60px_rgba(6,182,212,0.8)] w-[90%] max-w-[320px] sm:max-w-[340px] md:max-w-[550px] p-4 sm:p-5 md:p-10 text-center animate-in zoom-in-95 flex flex-col h-auto overflow-hidden outline-none" onClick={(e) => e.stopPropagation()}>
                    
                    <div className="relative z-10 flex justify-between items-center mb-6 md:mb-8 pb-5 md:pb-6 border-b border-white/20">
                      <button onClick={() => setTrackCalYear(y => y - 1)} className="p-2.5 md:p-4 bg-slate-800 text-white rounded-xl md:rounded-2xl hover:bg-cyan-500 transition-colors active:scale-95 shadow-inner border border-slate-600"><ChevronDown className="w-5 h-5 md:w-8 md:h-8 rotate-90" /></button>
                      <div className="flex flex-col items-center">
                        <span className="text-[14px] md:text-[18px] font-black text-white tracking-widest uppercase mb-0.5 md:mb-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">เลือกเดือน</span>
                        <span className="text-2xl md:text-4xl font-black text-cyan-400 tracking-widest drop-shadow-[0_0_15px_rgba(6,182,212,0.9)]">{trackCalYear + 543}</span>
                      </div>
                      <button onClick={() => setTrackCalYear(y => y + 1)} className="p-2.5 md:p-4 bg-slate-800 text-white rounded-xl md:rounded-2xl hover:bg-cyan-500 transition-colors active:scale-95 shadow-inner border border-slate-600"><ChevronDown className="w-5 h-5 md:w-8 md:h-8 -rotate-90" /></button>
                    </div>

                    <div className="relative z-10 grid grid-cols-3 gap-3 md:gap-5">
                      {['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'].map((m, i) => {
                        const monthValue = `${trackCalYear}-${String(i + 1).padStart(2, '0')}`;
                        const isSelected = trackMonth === monthValue;
                        const todayLocal = new Date(sysTime);
                        const isCurrentMonth = todayLocal.getFullYear() === trackCalYear && todayLocal.getMonth() === i;
                        return (
                          <button 
                            key={m} 
                            onClick={() => { setTrackMonth(monthValue); setTrackTimeframe('custom_month'); setShowTrackMonthPicker(false); }}
                            className={`py-3.5 md:py-6 rounded-xl md:rounded-2xl text-[15px] md:text-[24px] font-black transition-all duration-300 active:scale-95 ${
                              isSelected 
                                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.9)] border-[2px] border-solid border-cyan-300 scale-110 z-10' 
                                : isCurrentMonth 
                                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-[0_0_25px_rgba(249,115,22,1)] border-[2px] border-solid border-orange-300 z-10 animate-pulse' 
                                : 'bg-slate-800/80 text-slate-200 hover:bg-cyan-500/40 hover:border-cyan-400 border border-white/60 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] shadow-inner'
                            }`}
                          >
                            {m}
                          </button>
                        )
                      })}
                    </div>
                    <button onClick={() => setShowTrackMonthPicker(false)} className="relative z-10 mt-8 md:mt-10 w-full py-4 md:py-6 rounded-xl md:rounded-2xl font-black text-white bg-cyan-600 hover:bg-rose-500 border-[2px] border-solid border-white shadow-[0_0_20px_rgba(6,182,212,0.7)] transition-all duration-300 active:scale-95 tracking-widest uppercase md:text-[22px]">ยกเลิก</button>
                  </div>
                </div>
              )}
              
          </div>
      </div>

      {/* 4. ป้ายบอกวันที่ (ย่อขนาดลง ไม่กินที่) */}
      <div className="flex items-center gap-1.5 px-1 pt-0.5 animate-in fade-in">
        <Clock size={20} className="text-orange-500" />
        <span className="text-[14px] md:text-[18px] font-bold text-emerald-400 tracking-widest drop-shadow-sm">
          {trackTimeframe === 'custom_date' && trackDate 
            ? `แสดงข้อมูลวันที่: ${parseInt(trackDate.split('-')[2])} ${['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'][parseInt(trackDate.split('-')[1])-1]} ${parseInt(trackDate.split('-')[0]) + 543}` 
          : trackTimeframe === 'custom_month' && trackMonth 
            ? `แสดงข้อมูลเดือน: ${['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'][parseInt(trackMonth.split('-')[1])-1]} ${parseInt(trackMonth.split('-')[0]) + 543}` 
          : trackTimeframe === 'week'
            ? 'แสดงข้อมูล: สัปดาห์นี้'
          : 'แสดงข้อมูล: ทั้งหมด (ทุกวัน)'}
        </span>
      </div>

    </div> {/* สิ้นสุดกล่อง Sticky Header สุดอลังการ */}


    <div className="flex flex-col gap-6 lg:gap-10 font-sans">
        {isDataLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 opacity-80">
            <Loader2 size={40} className="animate-spin mb-4" />
            <p className="font-bold text-xs uppercase tracking-widest">
              Loading...
            </p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="text-center py-16 text-orange-500 flex flex-col items-center">
            <CheckCircle size={60} className="mx-auto mb-4 opacity-50" />
            <p className="font-bold text-[26px] text-lg">ไม่มีรายการ</p>
            <p className="text-[22px] text-white-500 mt-1">ที่คุณเลือก</p>
          </div>
        ) : (


          
          filteredTickets.map((t) => {
            // 🌟 ฟันธง: แทรกสมองกล 3 บรรทัดนี้ลงไป เพื่อค้นหาชื่อเวรจากวันที่! 🌟
            // 🌟 ฟันธง: เพิ่มสมองกลจับคู่ชื่อเวรและเบอร์โทรจากฐานข้อมูล rosters ตามวันที่ของตั๋ว
            const ticketDate = new Date(t.date).toISOString().split('T')[0];
            const sscRosterForDate = allRosters.find(r => r.date === ticketDate);
            const sscName = sscRosterForDate ? sscRosterForDate.techName : null;
            const sscPhone = sscRosterForDate ? sscRosterForDate.techPhone : null; // 🌟 เติมบรรทัดนี้!
            
            // ... (โค้ด const isPending ... ที่เหลือของท่าน) ...
              const isPending = t.status === 'pending';
              const isFixing = [
                'acknowledged',
                'in_progress',
                'on_hold',
              ].includes(t.status);
              const isDone = t.status === 'completed' || t.status === 'verified';
              const isCancelled = t.status === 'cancelled';
              const fixingMin = getMinutesDiff(t.startedAt || t.date, sysTime);
              const waitingMin = getMinutesDiff(t.date, sysTime);
              const styleColor = isPending
                ? 'border-rose-500 text-rose-600 bg-rose-50'
                : isDone
                ? 'border-emerald-500 text-emerald-600 bg-emerald-50'
                : isCancelled
                ? 'border-slate-400 text-slate-500 bg-slate-50'
                : t.status === 'on_hold'
                ? 'border-purple-500 text-purple-600 bg-purple-50'
                : 'border-orange-500 text-orange-600 bg-orange-50';
                const statusLabel = isPending
                ? 'รอดำเนินการ'
                : t.status === 'acknowledged'
                ? 'รับทราบแล้ว'
                : t.status === 'in_progress'
                ? 'กำลังซ่อม'
                : t.status === 'on_hold'
                ? 'แจ้งขัดข้อง'
                : isCancelled
                ? 'ยกเลิกแล้ว'
                : t.status === 'verified'
                ? '✅ เสร็จสิ้นสมบูรณ์'
                : '⏳ รอผู้แจ้งยืนยัน';

              return (
                <div
                  key={t.dbId || t.id}
                  className={`bg-white rounded-[1rem] md:rounded-[2rem] border-l-[6px] md:border-l-[12px] ${
                    styleColor.split(' ')[0]
                  } overflow-hidden shadow-sm border-t border-r border-b border-2 border-orange-400/70 transition-all ${
                    isCancelled ? 'opacity-70' : ''
                  }`}
                >
                  <div className="p-5 md:p-8 md:px-10 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex justify-between items-start mb-4 md:mb-6">
                      <div className="flex items-center">
                        <span className="text-[12px] md:text-[24px] font-mono text-emerald-600 bg-emerald-100 px-3 py-1 md:px-5 md:py-2 rounded-lg md:rounded-xl font-black tracking-widest border border-emerald-200 shadow-sm">
                          {String(t.id)}
                        </span>
                        {t.isOutOfHours && (
                          <span className="ml-2 md:ml-4 text-[10px] md:text-[24px] font-black text-rose-600 bg-rose-100 border border-rose-200 px-2 py-0.5 md:px-4 md:py-1.5 rounded-md md:rounded-xl animate-pulse">
                            วันหยุด
                          </span>
                        )}
                      </div>
                      <div
                        className={`px-3 py-1 md:px-6 md:py-3 rounded-lg md:rounded-2xl text-[13px] md:text-[26px] font-bold border border-2 border-solid shadow-sm flex items-center gap-1.5 md:gap-3 ${styleColor}`}
                      >
                        {isPending && (
                          <div className="w-1.5 h-1.5 md:w-3 md:h-3 rounded-full bg-rose-500 animate-pulse"></div>
                        )}
                        {statusLabel}
                      </div>
                    </div>


                    {/* 🌟 โซนดาวประเมิน (อัปเกรด: บรรทัดเดียว ชิดขวา ขนาดใหญ่ขึ้น + ตราประทับ ฝวด.) */}
                    {/* 🌟 โซนดาวประเมิน (อัปเกรด: Responsive Glow จัดเต็ม 1,000,000%) */}
                    {/* 🌟 โซนดาวประเมิน (อัปเกรด: เรียงบน-ล่าง เสมอกันทั้ง PC และ Mobile + ปรับแต่งแสงสีได้ 100%) */}
                   {/* 🌟 โซนดาวประเมิน (อัปเกรด: ยืดกรอบเต็ม 100% เสมอกับข้อมูลด้านล่างเป๊ะ!) */}
                  {/* 🌟 โซนดาวประเมิน (🌟 ฟันธง: อัปเกรดระบบแสงสีธีมตามคะแนนดาว 100%) */}
                 {/* 🌟 โซนดาวประเมิน (🌟 ฟันธง: อัปเกรดระบบแสงสีธีมตามคะแนนดาว 100%) */}
                    {/* 🌟 โซนดาวประเมิน (🌟 ฟันธง: โคลนนิ่ง UI ธีมสี/แสง มาจาก Pop-up ให้คะแนนดาว 100%) */}
                    {t.status === 'verified' && t.rating && (() => {
                      // 🎨 ถอดแบบธีมสีมาจากตัวแปรของหน้าต่างประเมิน (Modal) เป๊ะๆ
                      const rColor = t.rating === 5 ? { 
                          text: 'text-emerald-400', 
                          border: 'border-emerald-500', 
                          glow: 'shadow-[0_0_25px_rgba(16,185,129,0.4)]', 
                          flare: 'bg-emerald-500', 
                          starFill: '#34d399' 
                        } : t.rating === 4 ? { 
                          text: 'text-cyan-400', 
                          border: 'border-cyan-500',
                          glow: 'shadow-[0_0_25px_rgba(34,211,238,0.4)]',
                          flare: 'bg-cyan-500',
                          starFill: '#22d3ee' 
                        } : t.rating === 3 ? { 
                          text: 'text-yellow-400', 
                          border: 'border-yellow-500',
                          glow: 'shadow-[0_0_25px_rgba(250,204,21,0.4)]',
                          flare: 'bg-yellow-500',
                          starFill: '#facc15' 
                        } : t.rating === 2 ? { 
                          text: 'text-orange-400', 
                          border: 'border-orange-500',
                          glow: 'shadow-[0_0_25px_rgba(249,115,22,0.4)]',
                          flare: 'bg-orange-500',
                          starFill: '#fb923c' 
                        } : { 
                          text: 'text-rose-400', 
                          border: 'border-rose-500',
                          glow: 'shadow-[0_0_25px_rgba(225,29,72,0.4)]',
                          flare: 'bg-rose-500',
                          starFill: '#fb7185' 
                        };

                      return (
                        <div className="mt-3 mb-5 md:mt-6 md:mb-8 animate-in slide-in-from-top-2 duration-500 relative z-10 w-full flex flex-col items-center gap-4 md:gap-5">
                          
                          {/* 1. กล่องโชว์ดาว (bg-slate-900 พื้นหลังดำแบบ Pop-up + กรอบแสง + รัศมี rounded-xl md:rounded-[1rem]) */}
                          <div className={`relative bg-slate-900 border-[3px] border-solid ${rColor.border} rounded-xl md:rounded-[1rem] p-4 md:p-6 ${rColor.glow} overflow-hidden flex flex-row items-center justify-between w-full`}>
                            
                            {/* แสง Flare ฟุ้งๆ ด้านใน (เลียนแบบฉากหลัง Pop-up) */}
                            <div className={`absolute inset-0 m-auto w-[150%] h-[150%] rounded-full blur-[50px] md:blur-[70px] opacity-20 pointer-events-none z-0 ${rColor.flare}`}></div>
                            
                            <span className={`text-[15px] sm:text-[16px] md:text-[22px] font-black ${rColor.text} uppercase tracking-widest ml-1 relative z-10 drop-shadow-md shrink-0`}>
                              คุณให้คะแนนงานนี้:
                            </span>
                            <div className="flex gap-1.5 md:gap-3 relative z-10 shrink-0">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star 
                                  key={s} 
                                  className={`w-[18px] h-[18px] sm:w-5 sm:h-5 md:w-8 md:h-8 transition-all duration-300 ${t.rating >= s ? `${rColor.text} drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] scale-110` : 'text-slate-700/50'}`} 
                                  fill={t.rating >= s ? rColor.starFill : "none"} 
                                  stroke={t.rating >= s ? "none" : "#475569"} 
                                  strokeWidth={t.rating >= s ? 0 : 2} 
                                />
                              ))}
                            </div>
                          </div>

                          {/* 2. ตราประทับขอบคุณจาก ฝวด. (ใช้ธีมเดียวกับกล่องดาวเป๊ะๆ) */}
                          <div className={`relative bg-slate-900 border-[3px] border-solid ${rColor.border} rounded-xl md:rounded-[1rem] p-5 md:p-6 ${rColor.glow} overflow-hidden flex flex-col items-center justify-center text-center w-full`}>
                            
                            {/* แสง Flare ฟุ้งๆ ด้านใน */}
                            <div className={`absolute inset-0 m-auto w-[150%] h-[150%] rounded-full blur-[60px] md:blur-[80px] opacity-20 pointer-events-none z-0 ${rColor.flare}`}></div>
                            
                            <ShieldCheck className={`w-10 h-10 md:w-14 md:h-14 ${rColor.text} shrink-0 drop-shadow-[0_0_12px_rgba(255,255,255,0.3)] mb-3 relative z-10`} />
                            
                            <div className="space-y-1 md:space-y-2 relative z-10">
                              <h4 className={`${rColor.text} font-black text-[16px] md:text-[20px] drop-shadow-sm`}>
                                ฝ่ายวิศวกรรมระบบปฏิบัติการดาวเทียม (ฝวด.)
                              </h4>
                              <p className="text-white text-[12px] md:text-[15px] font-bold leading-relaxed px-2 md:px-6">
                                ขอบพระคุณสำหรับทุกคะแนนประเมินและเสียงสะท้อน เราจะนำไปพัฒนาและยกระดับมาตรฐานการบริการให้ดียิ่งขึ้นต่อไป
                               </p>
                            </div>
                          </div>

                        </div>
                      );
                    })()}


                    <h3
                      className={`text-lg md:text-[34px] font-black mb-1.5 md:mb-4 leading-tight ${
                        isCancelled
                          ? 'text-slate-400 line-through'
                          : 'text-slate-800'
                      }`}
                    >
                      {String(t.equipment)}
                    </h3>

                    <div className="flex flex-col gap-1 md:gap-3 mt-4 bg-indigo-50/50 p-3 px-4 md:p-6 md:px-8 rounded-xl md:rounded-2xl border-2 border-solid border-indigo-500">
                      <div className="flex items-start gap-1.5 md:gap-3 text-orange-600/90">
                        <Building className="w-[18px] h-[18px] md:w-8 md:h-8 shrink-0 mt-0.5 md:mt-0" />
                        <span className="text-[18px] md:text-[28px] font-bold leading-snug">
                          {t.building || 'ไม่ระบุอาคาร'}
                        </span>
                      </div>
                      <div className="flex items-start gap-1.5 md:gap-3 text-indigo-500/90">
                        <MapPin className="w-[18px] h-[18px] md:w-8 md:h-8 shrink-0 mt-0.5 md:mt-0" />
                        <span className="text-[15px] md:text-[24px] font-bold leading-snug">
                          ห้อง: {t.room || 'ไม่ระบุห้อง'}
                        </span>
                      </div>
                    </div>

                    {/* 🌟 โซนรอเวลาดำเนินการ-เวลาปฏิบัติงาน เวลาเหตุขัดข้อง เวลารวมทั้หมด และโซนนาฬิกาจับเวลา (ฟันธง: โฉมใหม่กรอบโค้งมน + ไอคอนนาฬิกาด้านใน) */}
                  {!isCancelled && (
                    <div className="w-full mt-2 md:mt-4 border-[1.5px] border-2 border-solid border-orange-600 rounded-2xl md:rounded-[1rem] p-5 md:p-8 bg-orange-200/30 shadow-sm flex flex-col gap-4 md:gap-6 relative">
                      
                      {/* 1. เวลารอดำเนินการ */}
                      <div className="flex justify-between items-center pl-1 md:pl-4">
                        <div className="flex items-center gap-3 md:gap-4">
                          <Clock className={`w-5 h-5 md:w-6 md:h-6 ${isPending ? 'text-rose-500 animate-pulse' : 'text-slate-500'}`} />
                          <span className={`text-[13px] md:text-[22px] font-black ${isPending ? 'text-rose-600' : 'text-slate-400'}`}>
                            เวลารอดำเนินการ
                          </span>
                        </div>
                        <span className={`text-[13px] md:text-[24px] font-bold font-mono tracking-tighter ${isPending ? 'text-rose-600' : 'text-slate-400'}`}>
                          {getLiveStopwatch(t.date, t.acceptedAt, sysTime)}
                        </span>
                      </div>

                      {/* 2. เวลาปฏิบัติงาน */}
                      <div className="flex justify-between items-center pl-1 md:pl-4">
                        <div className="flex items-center gap-3 md:gap-4">
                          <Clock className={`w-5 h-5 md:w-6 md:h-6 ${isFixing && t.status !== 'on_hold' ? 'text-orange-600 animate-pulse' : 'text-slate-500'}`} />
                          <span className={`text-[13px] md:text-[22px] font-black ${isFixing && t.status !== 'on_hold' ? 'text-orange-500' : 'text-slate-400'}`}>
                            เวลาปฏิบัติงาน
                          </span>
                        </div>
                        <span className={`text-[13px] md:text-[24px] font-bold font-mono tracking-tighter ${isFixing && t.status !== 'on_hold' ? 'text-orange-600' : 'text-slate-400'}`}>
                          {t.startedAt
                            ? getLiveStopwatch(
                                t.startedAt,
                                t.completedAt,
                                sysTime,
                                t.totalPauseMs || 0,
                                t.status === 'on_hold',
                                t.lastHoldAt
                              )
                            : '00:00:00'}
                        </span>
                      </div>

                      {/* 3. เวลาเหตุขัดข้อง (แสดงก็ต่อเมื่อมีการหยุดเวลา) */}
                      {(() => {
                        const currentHoldMs = t.status === 'on_hold' && t.lastHoldAt
                          ? sysTime.getTime() - new Date(t.lastHoldAt).getTime()
                          : 0;
                        const totalHoldMs = (t.totalPauseMs || 0) + currentHoldMs;
                        
                        if (totalHoldMs > 0) {
                          const isHolding = t.status === 'on_hold';
                          const hrs = Math.floor(totalHoldMs / 3600000);
                          const days = Math.floor(hrs / 24);
                          const remainHrs = hrs % 24;
                          const mins = Math.floor((totalHoldMs % 3600000) / 60000);
                          const secs = Math.floor((totalHoldMs % 60000) / 1000);
                          const timeStr = `${String(remainHrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
                          const displayTime = days > 0 ? `${days} วัน ${timeStr}` : timeStr;

                          return (
                            <div className="flex justify-between items-center pl-1 md:pl-4">
                              <div className="flex items-center gap-3 md:gap-4">
                                <Clock className={`w-5 h-5 md:w-6 md:h-6 ${isHolding ? 'text-purple-600 animate-pulse' : 'text-slate-500'}`} />
                                <span className={`text-[13px] md:text-[22px] font-black ${isHolding ? 'text-purple-600' : 'text-slate-400'}`}>
                                  เวลาเหตุขัดข้อง
                                </span>
                              </div>
                              <span className={`text-[13px] md:text-[24px] font-bold font-mono tracking-tighter ${isHolding ? 'text-purple-600' : 'text-slate-400'}`}>
                                {displayTime}
                              </span>
                            </div>
                          );
                        }
                        return null;
                      })()}

                      {/* 4. เวลารวมทั้งหมด */}
                      <div className="flex justify-between items-center pl-1 md:pl-4">
                        <div className="flex items-center gap-3 md:gap-4">
                          <Clock className={`w-5 h-5 md:w-6 md:h-6 ${isDone ? 'text-emerald-600' : 'text-slate-500'}`} />
                          <span className={`text-[13px] md:text-[22px] font-black ${isDone ? 'text-emerald-500' : 'text-slate-400'}`}>
                            เวลารวมทั้งหมด
                          </span>
                        </div>
                        <span className={`text-[13px] md:text-[24px] font-bold font-mono tracking-tighter ${isDone ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {getLiveStopwatch(
                            t.date,
                            t.completedAt,
                            sysTime,
                            t.totalPauseMs || 0,
                            t.status === 'on_hold',
                            t.lastHoldAt
                          )}
                        </span>
                      </div>

                    </div>
                  )}
                  </div>



                  {/* 🌟 โซนกล่องสรุป SLA */}
                  {/* 🌟 ฟันธง: เพิ่มเงื่อนไข currentUserRole !== 'reporter' พ่วงเข้าไปข้างหน้าสุด */}
                  {currentUserRole !== 'reporter' && (t.status === 'completed' || t.status === 'verified') ? (
                          <div className="bg-emerald-50 border-2 border-solid border-emerald-500/40 rounded-2xl md:rounded-[1rem] p-4 md:p-8 mt-2 md:mt-4 mb-4 md:mb-8 w-auto mx-5 md:mx-10 shadow-sm">
                            {(() => {
                              const startMs = new Date(t.date).getTime();
                              const endMs = new Date(t.completedAt).getTime();
                              const holdMs = t.totalPauseMs || 0; 
                              let netDurationMs = endMs - startMs - holdMs;
                              if (netDurationMs < 0) netDurationMs = 0;
                              
                              const slaLimitHours = 4; 
                              const slaLimitMs = slaLimitHours * 60 * 60 * 1000; 
                              const isSLAPassed = netDurationMs <= slaLimitMs;

                              const msToText = (ms) => {
                                if(ms === 0) return "-";
                                const d = Math.floor(ms / (1000 * 60 * 60 * 24));
                                const h = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                                const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
                                let res = [];
                                if(d>0) res.push(`${d} วัน`);
                                if(h>0) res.push(`${h} ชม.`);
                                if(m>0) res.push(`${m} นาที`);
                                return res.length > 0 ? res.join(' ') : "น้อยกว่า 1 นาที";
                              };

                              return (
                                <>
                                  <div className="flex items-start justify-between mb-3 md:mb-6 border-b border-emerald-500/20 pb-4 md:pb-6">
                                    <div className="flex items-center gap-2 md:gap-3 mt-1">
                                      <Clock className="w-[18px] h-[18px] md:w-8 md:h-8 text-emerald-600" />
                                      <span className="text-[14px] md:text-[24px] font-black text-orange-500 uppercase tracking-widest">สรุป SLA</span>
                                    </div>
                                    
                                    <div className={`px-3 py-1.5 md:px-6 md:py-3 rounded-2xl text-[12px] md:text-[20px] font-black tracking-widest flex items-center gap-1.5 md:gap-3 border-2 shadow-lg -mt-1 ${
                                      isSLAPassed 
                                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-300 shadow-emerald-500/40' 
                                        : 'bg-gradient-to-r from-rose-500 to-red-500 text-white border-rose-300 shadow-rose-500/40'
                                    }`}>
                                      {isSLAPassed ? (
                                        <>
                                          <CheckCircle className="w-4 h-4 md:w-6 md:h-6 text-white drop-shadow-md" strokeWidth={3} />
                                          <span className="drop-shadow-sm mt-0.5">ผ่านเกณฑ์</span>
                                        </>
                                      ) : (
                                        <>
                                          <XCircle className="w-4 h-4 md:w-6 md:h-6 text-white animate-pulse drop-shadow-md" strokeWidth={3} />
                                          <span className="drop-shadow-sm mt-0.5">เกินเวลา SLA</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-2.5 md:space-y-5 text-[13px] md:text-[22px]">
                                    <div className="flex justify-between items-center">
                                      <span className="text-slate-600 font-bold">วันที่แจ้งซ่อม:</span>
                                      <span className="text-slate-800 font-black">{new Date(t.date).toLocaleString('th-TH')}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="text-slate-600 font-bold">วันที่ซ่อมเสร็จ:</span>
                                      <span className="text-slate-800 font-black">
                                          {t.completedAt ? new Date(t.completedAt).toLocaleString('th-TH') : '-'}
                                      </span>
                                    </div>
                                    
                                    {holdMs > 0 && (
                                      <div className="flex justify-between items-center bg-purple-100/60 p-2 md:p-4 rounded-lg md:rounded-2xl border border-purple-200 mt-1 md:mt-3">
                                        <span className="text-purple-700 font-bold flex items-center gap-1.5 md:gap-3">
                                          <PauseCircle className="w-[14px] h-[14px] md:w-6 md:h-6 animate-pulse"/> หักเวลารออะไหล่/ขัดข้อง:
                                        </span>
                                        <span className="text-purple-800 font-black">{msToText(holdMs)}</span>
                                      </div>
                                    )}
                                    
                                    <div className="flex justify-between items-baseline pt-2 md:pt-6 mt-2 md:mt-6 border-t border-emerald-500/20">
                                      <span className="text-emerald-900 font-black">ใช้เวลาซ่อมสุทธิ:</span>
                                      <span className={`text-[18px] md:text-[34px] font-black drop-shadow-sm ${isSLAPassed ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {msToText(netDurationMs)}
                                      </span>
                                    </div>
                                    
                                    <div className="text-right text-[11px] md:text-[16px] text-rose-800/80 font-bold mt-1 md:mt-3">
                                      * ประเมินจากเกณฑ์ชั่วคราว: ภายใน {slaLimitHours} ชั่วโมง
                                    </div>
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                        ) : null}



                {/* 🌟 โซนรายละเอียดข้อความและการติดต่อ (ปลดล็อกความกว้าง 100%) */}
          <div className="px-5 md:px-10 pb-5 md:pb-10 pt-2 flex flex-col w-full relative z-10">
          {/* 🌟 ฟันธงสเต็ป 1: จัดการช่องไฟภายในด้วย Margin แทน Gap */}
          <div className="flex flex-col w-full relative z-10">
    
    {/* 🚨 เหตุผลยกเลิกงาน */}
    {t.status === 'cancelled' && t.cancelReason && (
          <div className="bg-rose-100/70 border-l-[4px] border-2 border-solid border-rose-600 rounded-xl md:rounded-2xl p-3 md:p-5 flex gap-3 md:gap-4 w-full mt-4 md:mt-6">
        <XCircle className="w-5 h-5 md:w-8 md:h-8 shrink-0 mt-0.5 text-rose-600" />
        <div className="w-full">
          <span className="block mb-1 text-rose-600/80 text-[16px] md:text-[22px] font-bold uppercase">เหตุผลที่ยกเลิก:</span>
          <span className="text-[16px] md:text-[26px] text-rose-900 font-bold">{String(t.cancelReason)}</span>
        </div>
      </div>
    )}



          {/* 🌟 ฟันธง: Timeline ประวัติการซ่อม (อัปเกรดฟอนต์ PC ให้ใหญ่โตชัดเจน) */}
          {t.historyLog && t.historyLog.length > 0 && (
            <div className="flex flex-col w-full gap-4 md:gap-6 mt-6">
              {t.historyLog.map((log, index) => {
                const isHold = log.type === 'hold';
                
                // คำนวณเวลา
                const currentTime = index < t.historyLog.length - 1 
                  ? new Date(t.historyLog[index + 1].timestamp).getTime() 
                  : new Date().getTime();
                const startTime = new Date(log.timestamp).getTime();
                const durationMs = Math.max(0, currentTime - startTime);
                
                const pad = (num) => String(num).padStart(2, '0');
                const hours = Math.floor(durationMs / 3600000);
                const minutes = Math.floor((durationMs % 3600000) / 60000);
                const seconds = Math.floor((durationMs % 60000) / 1000);
                const formattedTime = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

                return (
                  <div key={index} className={`w-full rounded-2xl md:rounded-[2rem] border-[2px] border-solid overflow-hidden ${isHold ? 'bg-purple-50 border-purple-400' : 'bg-orange-50 border-orange-400'}`}>
                    {/* ส่วนหัวเหตุการณ์ */}
                    <div className="p-4 md:p-6 flex items-center gap-3">
                      {isHold ? <PauseCircle className="w-6 h-6 md:w-8 md:h-8 text-purple-600" /> : <Wrench className="w-6 h-6 md:w-8 md:h-8 text-orange-600" />}
                      <span className={`font-black text-[15px] md:text-[22px] uppercase tracking-wider ${isHold ? 'text-purple-800' : 'text-orange-800'}`}>
                        {isHold ? 'แจ้งเหตุขัดข้อง' : 'ดำเนินการต่อ'}
                      </span>
                    </div>
                    {/* ส่วนเนื้อหา */}
                    <div className="px-4 md:px-6 pb-4 md:pb-6">
                      <p className="font-bold text-[16px] md:text-[24px] text-emerald-600 leading-snug">
                        {String(log.reason)}
                      </p>
                    </div>
                    {/* ส่วนท้าย: เส้นประ + เวลา (จัดให้ขวาล่างสวยๆ) */}
                    <div className={`px-4 md:px-6 py-3 md:py-4 border-t-[1.5px] border-dashed ${isHold ? 'border-purple-400' : 'border-orange-400'} flex justify-between items-center bg-white/50`}>
                       <span className={`text-[14px] md:text-[22px] font-bold opacity-90 uppercase tracking-widest ${isHold ? 'text-purple-700' : 'text-orange-700'}`}>
                          {isHold ? `ระยะเวลาที่หยุด (ครั้งที่ ${index + 1})` : `ระยะเวลาที่ซ่อม (ครั้งที่ ${index + 1})`}
                       </span>
                       
                       {/* 🌟 ฟันธงตรงนี้: เปลียนสี bg และ text ตามกรอบ (ม่วงเป็นม่วง, ส้มเป็นส้ม) ลบ border-slate-300 ทิ้ง */}
                       <span className={`font-mono font-black text-[15px] md:text-[20px] px-4 py-1.5 md:py-2 rounded-xl border-2 border-solid shadow-sm tracking-widest ${
                         isHold ? 'bg-purple-600 text-white border-purple-400' : 'bg-orange-600 text-white border-orange-400'
                       }`}>
                          {formattedTime}
                       </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}



    {/* 📋 สรุปผลและข้อแนะนำ (ฟันธง: เติม rounded-xl md:rounded-2xl ลบเหลี่ยมแข็งโป๊ก) */}
    {t.cause && (
      <div className="bg-emerald-100/70 border-l-[4px] border-2 border-solid border-emerald-600 rounded-xl md:rounded-2xl p-3 md:p-5 flex gap-3 md:gap-4 w-full mt-4 md:mt-6">

        <CheckSquare className="w-5 h-5 md:w-8 md:h-8 shrink-0 mt-0.5 text-emerald-600" />
        <div className="w-full">
          <span className="block mb-1 text-emerald-800/80 text-[16px] md:text-[20px] font-bold">สรุปผลและข้อแนะนำ:</span>
          <span className="text-[18px] md:text-[22px] text-indigo-900 font-bold">
            "{String(t.cause)}"
            </span>
        </div>
      </div>
    )}


    
        {/* ==================== โซนภาพประกอบ (แบบมีกรอบ Card แยกชัดเจน) ==================== */}
        {t.images && t.images.length > 0 && (
          <div className="bg-slate-100 border-2 border-solid border-emerald-500 p-4 md:p-6 rounded-2xl md:rounded-[1.5rem] shadow-sm w-full mt-4 md:mt-6">
            <span className="text-[14px] md:text-[22px] font-black text-rose-700 mb-3 md:mb-4 flex items-center gap-2">
                📸 ภาพประกอบการแจ้งซ่อม:
            </span>
            {/* 🌟 ฟันธง: ย่อขนาดรูปภาพโดยปรับ Grid เป็น 4-6 คอลัมน์ ประหยัดพื้นที่แบบ 1,000,000% */}
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 md:gap-3 mt-2">
              {t.images.map((img, i) => (
                <img 
                  key={i} 
                  src={img} 
                  alt={`ภาพประกอบ ${i+1}`} 
                  className="rounded-lg md:rounded-xl w-full aspect-square object-cover border border-slate-300 shadow-sm hover:scale-110 transition-transform cursor-pointer" 
                  onClick={() => setLightboxImg(img)} 
                />
              ))}
            </div>
          </div>
        )}

        {/* ============================================================================== */}
                        
                       {/* 🌟 ฟันธง: สร้างกล่องแม่ครอบโซนอาการเสียและ Asset No ทั้งหมด พร้อมหดความกว้างให้เท่ากรอบส้มด้านบน */}
                       <div className="bg-orange-100/70 border-l-[4px] border-2 border-solid border-indigo-600 rounded-xl md:rounded-2xl p-3 md:p-5 flex gap-3 md:gap-4 w-full mt-4 md:mt-6">
                          
                          {/* บรรทัดหัวเรื่อง */}
                          <div className="mb-2 md:mb-4">
                            <span className="text-[13px] md:text-[22px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1.5 md:gap-3">
                              <AlertCircle className="w-3 h-3 md:w-6 md:h-6 text-rose-600" /> รายละเอียดอาการเสีย:
                            </span>
                            {/* ตัวหนังสือรายละเอียด - ปรับ mt ลดลงนิดนึงให้อยู่ในกรอบสวยๆ */}
                            <p className={`text-[14px] md:text-[26px] font-black mt-1.5 md:mt-3 leading-relaxed pl-1 md:pl-2 ${
                              isCancelled ? 'text-slate-400 line-through' : 'text-rose-600 drop-shadow-sm'
                            }`}>
                              "{String(t.description)}"
                            </p>

                          </div>
                          
                          {/* ส่วน Asset No (แสดงเมื่อมีข้อมูล) */}
                          {t.assetNumber && (
                            // 🌟 เติมเส้นคั่นภายในกรอบ เพื่อแยก Asset No ออกจากรายละเอียด
                            <div className="mt-3 md:mt-5 pt-3 md:pt-5 border-t border-slate-200">
                              <p className="text-[12px] md:text-[20px] text-slate-500 font-mono mt-0 mb-0">
                                <span className="font-bold text-slate-400">
                                  Asset No:
                                </span>{' '}
                                {t.assetNumber}
                              </p>
                            </div>
                          )}

                        </div>


          {/* ==================== โซนบุคคล & SSC (จัดระเบียบระยะห่างใหม่) ==================== */}
                  <div className="flex flex-col gap-4 md:gap-6 mt-6 w-full">
                      
                      {/* 👤 การ์ด 1: ผู้แจ้งปัญหา */}
                      <div className="bg-emerald-50/40 border-2 border-solid border-emerald-400 p-4 md:p-6 rounded-2xl md:rounded-[1.5rem] shadow-sm flex flex-col w-full transition-all hover:shadow-md">
                        {/* หัวข้อ */}
                        <span className="text-[16px] md:text-[20px] font-black text-emerald-700 mb-2 md:mb-4 flex items-center gap-1.5 md:gap-2 uppercase tracking-wider">
                          <User className="w-4 h-4 md:w-5 md:h-5" /> ผู้แจ้งปัญหา
                        </span>
                        
                        {/* ชื่อ */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-black text-emerald-950 flex items-center gap-2 text-[16px] md:text-[28px]">
                            {String(t.reporter)}
                          </span>
                        </div>
          
                        {/* รายละเอียด */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between mt-auto pt-3 border-t-[1.5px] border-dashed border-emerald-400/50 gap-3">
                          <span className="text-[16px] md:text-[22px] font-bold text-blue-600 flex items-center gap-1.5">
                            <Clock className="w-3 h-3 md:w-4 md:h-4 text-emerald-600" />
                            {formatDateTimeString(t.date)}
                          </span>
                          <a href={`tel:${String(t.reporterContact).replace(/\D/g, '')}`} className="font-mono text-[16px] md:text-[22px] font-bold bg-emerald-100 px-3 py-1.5 rounded-lg text-emerald-800 border border-emerald-300 shadow-sm hover:bg-emerald-200 transition-colors flex items-center gap-1.5 active:scale-95 w-fit md:w-auto">
                            <Phone className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                            {formatDisplayPhone(t.reporterContact)}
                          </a>
                        </div>
                      </div>
          
                      {/* 🛠️ การ์ด 2: ผู้รับผิดชอบหลัก (อัปเกรดมาตรฐาน Helpdesk ระดับโลก) */}
                      <div className="bg-orange-50/40 border-2 border-solid border-orange-400 p-4 md:p-6 rounded-2xl md:rounded-[1.5rem] shadow-sm flex flex-col w-full transition-all hover:shadow-md">
                        <span className="text-[16px] md:text-[20px] font-black text-orange-600 mb-2 md:mb-4 flex items-center gap-1.5 md:gap-2 uppercase tracking-wider">
                          <Wrench className="w-5 h-5 md:w-6 md:h-6" /> ผู้รับผิดชอบหลัก
                        </span>
                        
                        <div className="flex flex-col mb-3">
                          <span className="font-black text-orange-950 flex items-center gap-2 text-[16px] md:text-[28px]">
                            {/* 🌟 ฟันธง: โชว์ชื่อช่างเสมอ ถ้าไม่มีให้ขึ้นว่า ทีมช่าง ฝวด. แทนคำว่ารอเจ้าหน้าที่ */}
                            {t.techName && t.techName !== 'รอเจ้าหน้าที่รับงาน' ? String(t.techName) : "ทีมช่าง ฝวด."}
                          </span>
                          {t.equipmentCategory && (
                            <span className="text-[12px] md:text-[18px] font-bold text-orange-700/80 mt-1 md:mt-2">
                              รับผิดชอบ: {t.equipmentCategory}
                            </span>
                          )}
                        </div>
          
                        {/* รายละเอียด (เบอร์โทร) */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between mt-auto pt-3 border-t-[1.5px] border-dashed border-orange-400/50 gap-3">
                          {t.techPhone && t.techPhone !== '-' && t.techPhone !== 'N/A' ? (
                            <a href={`tel:${String(t.techPhone).replace(/\D/g, '')}`} className="font-mono text-[16px] md:text-[22px] font-bold bg-orange-100 px-3 py-1.5 rounded-lg text-orange-800 border border-orange-300 shadow-sm hover:bg-orange-200 transition-colors flex items-center gap-1.5 active:scale-95 w-fit md:w-auto self-start md:self-auto">
                              <Phone className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
                              {formatDisplayPhone(t.techPhone)}
                            </a>
                          ) : (
                            <span className="font-mono text-[16px] md:text-[20px] text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 w-fit md:w-auto self-start md:self-auto">
                              {String(t.techPhone || 'ไม่มีข้อมูลเบอร์โทร')}
                            </span>
                          )}
                        </div>

                        {/* 🌟 ฟันธงจุดที่ 2: ป้ายกำกับสถานะการรับงาน พร้อม Timestamp เวลาที่กดรับงาน (มาตรฐานสากล) */}
                        <div className="mt-4 pt-3 border-t-[1.5px] border-solid border-orange-200/80">
                          {t.status === 'pending' && (
                            <div className="bg-rose-100/80 border border-rose-300 text-rose-600 font-bold text-[13px] md:text-[16px] px-3 py-2 rounded-lg flex items-center gap-2 w-fit animate-pulse shadow-sm">
                              <Clock className="w-4 h-4 md:w-5 md:h-5" /> ⏳ รอการกดรับงาน (จากผู้รับผิดชอบหลัก หรือ เวร SSC)
                            </div>
                          )}
                          {['in_progress', 'on_hold', 'acknowledged'].includes(t.status) && (
                            <div className="flex flex-col gap-1.5">
                              <div className="bg-emerald-100/80 border border-emerald-300 text-emerald-700 font-bold text-[13px] md:text-[16px] px-3 py-2 rounded-lg flex items-center gap-2 w-fit shadow-sm">
                                <Wrench className="w-4 h-4 md:w-5 md:h-5" /> 🛠️ มีผู้รับผิดชอบกดรับงานและกำลังดำเนินการซ่อมแล้ว
                              </div>
                              {t.acceptedAt && (
                                <div className="text-[12px] md:text-[14px] font-bold text-slate-500 ml-1 flex items-center gap-1.5">
                                   <Clock className="w-3.5 h-3.5" /> เวลากดรับงาน: {ThaiDateFormatter(t.acceptedAt)}
                                </div>
                              )}
                            </div>
                          )}
                          {['completed', 'verified'].includes(t.status) && (
                            <div className="flex flex-col gap-1.5">
                              <div className="bg-blue-100/80 border border-blue-300 text-blue-700 font-bold text-[13px] md:text-[16px] px-3 py-2 rounded-lg flex items-center gap-2 w-fit shadow-sm">
                                <CheckCircle className="w-4 h-4 md:w-5 md:h-5" /> ✅ ดำเนินการแก้ไขเสร็จสิ้นเรียบร้อย
                              </div>
                              {t.completedAt && (
                                <div className="text-[12px] md:text-[14px] font-bold text-slate-500 ml-1 flex items-center gap-1.5">
                                   <Clock className="w-3.5 h-3.5" /> เวลาปิดงาน: {ThaiDateFormatter(t.completedAt)}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      
                      {/* ==================== 🚨 การ์ด 3: โซนเจ้าหน้าที่เวร SSC ==================== */}
                      {t.isOutOfHours && (() => {
                        const tDateObj = new Date(t.date);
                        const dayOfWeek = tDateObj.getDay();
                        const dateStr = tDateObj.toISOString().split('T')[0];
                        const rosterInfo = allRosters.find(r => r.date === dateStr);
                        const isSpecialHoliday = rosterInfo && rosterInfo.isHoliday;
          
                        let theme = { bg: 'bg-purple-50/80', border: 'border-purple-400', textHead: 'text-purple-700', textName: 'text-purple-950', icon: 'text-purple-500', btnBg: 'bg-purple-100', btnBorder: 'border-purple-300', btnText: 'text-purple-800' };
          
                        if (isSpecialHoliday) {
                          theme = { bg: 'bg-orange-50/80', border: 'border-orange-400', textHead: 'text-orange-700', textName: 'text-orange-950', icon: 'text-orange-500', btnBg: 'bg-orange-100', btnBorder: 'border-orange-300', btnText: 'text-orange-800' };
                        } else if (dayOfWeek === 0) { 
                          theme = { bg: 'bg-rose-50/80', border: 'border-rose-400', textHead: 'text-rose-700', textName: 'text-rose-950', icon: 'text-rose-500', btnBg: 'bg-rose-100', btnBorder: 'border-rose-300', btnText: 'text-rose-800' };
                        } else if (dayOfWeek === 6) { 
                          theme = { bg: 'bg-blue-50/80', border: 'border-blue-400', textHead: 'text-blue-700', textName: 'text-blue-950', icon: 'text-blue-500', btnBg: 'bg-blue-100', btnBorder: 'border-blue-300', btnText: 'text-blue-800' };
                        }
          
                        return (
                          <div className={`${theme.bg} border-2 border-solid ${theme.border} p-4 md:p-6 rounded-2xl md:rounded-[1.5rem] shadow-sm w-full transition-all hover:shadow-md`}>
                            <div className="flex flex-col">
                              {/* หัวข้อเวร SSC */}
                              <span className={`text-[15px] md:text-[20px] font-black ${theme.textHead} mb-2 md:mb-4 flex items-center gap-1.5 md:gap-2 uppercase tracking-wider`}>
                                <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 animate-pulse" /> เจ้าหน้าที่เวร SSC ประจำวันหยุด
                              </span>
                              
                              {/* ชื่อเวร SSC */}
                              <div className="flex items-center justify-between mb-3">
                                <span className={`font-black ${theme.textName} flex items-center gap-2 text-[16px] md:text-[26px]`}>
                                  <User className={`w-5 h-5 md:w-6 md:h-6 ${theme.icon}`} />
                                  {sscName || t.sscTechName || "ยังไม่ระบุเวร"}
                                </span>
                              </div>
          
                              {/* 🌟 ฟันธง: เส้นประ (Dashed Line) + มือถือแยกบรรทัด / PC ซ้ายขวา! */}
                              <div className={`flex flex-col md:flex-row md:items-center justify-between mt-auto pt-3 border-t-[1.5px] border-dashed ${theme.border.replace('border-', 'border-').replace('400', '300')} gap-3`}>
                                
                                <span className={`text-[15px] md:text-[20px] font-bold ${theme.btnText} flex items-center gap-1.5`}>
                                  <Clock className={`w-5 h-5 md:w-6 md:h-6 ${theme.icon}`} />
                                  วันที่: {new Date(t.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </span>
                                
                                {(sscPhone || t.sscTechPhone) && (sscPhone || t.sscTechPhone) !== '-' && (
                                  <a href={`tel:${String(sscPhone || t.sscTechPhone).replace(/\D/g, '')}`} className={`font-mono text-[15px] md:text-[20px] font-bold ${theme.btnBg} px-3 py-1.5 rounded-lg ${theme.btnText} border ${theme.btnBorder} shadow-sm transition-colors flex items-center gap-1.5 active:scale-95 w-fit md:w-auto`}>
                                    <Phone className={`w-5 h-5 md:w-6 md:h-6 ${theme.icon}`} />
                                    {formatDisplayPhone(sscPhone || t.sscTechPhone)}
                                  </a>
                                )}
                              </div>
          
                              {/* 🌟 บันทึกของเวร SSC */}
                              {t.sscNote && (
                                <div className={`mt-3 pt-3 border-t-[1.5px] border-dashed ${theme.border.replace('border-', 'border-').replace('400', '300')}`}>
                                  <div className="flex flex-col w-full">
                                    <span className={`block mb-1 text-[11px] md:text-[14px] font-bold uppercase ${theme.textHead} opacity-80`}>
                                      บันทึกการแก้ไขเบื้องต้น (เวร SSC):
                                    </span>
                                    <span className={`text-[13px] md:text-[18px] font-bold ${theme.textName}`}>
                                      {String(t.sscNote)}
                                    </span>
                                  </div>
                                </div>
                              )}
          
                            </div>
                          </div>
                        );
                      })()}
                    </div>
          
        {/* ============================================ */}
                      </div>

                     {/* 🌟 โซนปุ่มกด Action (ขนาดบิ๊กเบิ้ม สำหรับช่าง) */}
                     {(currentUserRole !== 'reporter') && !isCancelled && (
                        <div className="flex flex-col gap-2.5 md:gap-6 mt-4 md:mt-8">
                          
                          {/* 🌟 ฟันธงจุดที่ 3: สมองกลซ่อน/โชว์ปุ่มรับงาน ตามสิทธิ์การทำงาน */}
                          {isPending && (
                            <div className="flex flex-col gap-3 w-full animate-in slide-in-from-bottom-2 fade-in">
                              {(() => {
                                const isCommander = currentUserRole === 'Commander';
                                const isPrimary = currentUserName === t.techName;
                                const tDate = new Date(t.date || Date.now());
                                const tDateStr = `${tDate.getFullYear()}-${String(tDate.getMonth() + 1).padStart(2, '0')}-${String(tDate.getDate()).padStart(2, '0')}`;
                                const sscDuty = allRosters.find(r => r.date === tDateStr);
                                const isSSCToday = sscDuty && sscDuty.techName === currentUserName;

                                return (
                                  <>
                                    {(isCommander || isPrimary) && (
                                      <button onClick={() => setActionModal({ isOpen: true, ticketId: t.id, type: 'accept' })} className="w-full bg-emerald-600/90 hover:bg-emerald-500 text-white font-black text-[16px] md:text-[20px] py-3.5 md:py-4 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all active:scale-95 flex items-center justify-center gap-2">
                                        <Wrench className="w-5 h-5 md:w-6 md:h-6" /> รับงานซ่อม (ในฐานะผู้รับผิดชอบหลัก)
                                      </button>
                                    )}
                                    
                                    {(isCommander || isSSCToday) && (
                                      <button onClick={() => setActionModal({ isOpen: true, ticketId: t.id, type: 'ssc' })} className="w-full bg-orange-500/90 hover:bg-orange-400 text-white font-black text-[16px] md:text-[20px] py-3.5 md:py-4 rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.4)] transition-all active:scale-95 flex items-center justify-center gap-2">
                                        <ShieldAlert className="w-5 h-5 md:w-6 md:h-6" /> รับงานและแก้ไขเบื้องต้น (ในฐานะเวร SSC)
                                      </button>
                                    )}

                                    {(!isCommander && !isPrimary && !isSSCToday) && (
                                      <div className="w-full bg-slate-800/80 text-slate-400 font-bold text-[14px] md:text-[16px] text-center py-3.5 rounded-xl border border-dashed border-slate-600 shadow-inner">
                                        🔒 คุณไม่มีสิทธิ์กดรับงานนี้ (เฉพาะผู้รับผิดชอบหลัก หรือ เวร SSC)
                                      </div>
                                    )}
                                  </>
                                );
                              })()}
                            </div>
                          )}

                          {t.status === 'acknowledged' && (
                            <button
                              onClick={() =>
                                updateTicketStatus(t.id, {
                                  status: 'in_progress',
                                  startedAt: new Date().toISOString(),
                                })
                              }
                              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border border-emerald-400 font-bold py-3.5 md:py-6 rounded-xl md:rounded-3xl shadow-[0_0_15px_rgba(16,185,129,0.4)] active:scale-95 transition-all text-[15px] md:text-[28px] hover:shadow-[0_0_25px_rgba(16,185,129,0.8)] hover:brightness-110 hover:-translate-y-1"
                            >
                              เริ่มดำเนินการซ่อม
                            </button>
                          )}

                          {(t.status === 'in_progress' || t.status === 'on_hold') && (
                            <div className="flex gap-2.5 md:gap-6">
                              <button
                                onClick={() => {
                                  if (t.status === 'on_hold') {
                                    setActionModal({ isOpen: true, ticketId: t.id, type: 'resume' });
                                  } else {
                                    setActionModal({ isOpen: true, ticketId: t.id, type: 'hold' });
                                  }
                                }}
                                className="flex-1 bg-gradient-to-r from-orange-400 to-orange-500 text-white border border-orange-300 font-bold py-3.5 md:py-6 rounded-xl md:rounded-3xl shadow-[0_0_15px_rgba(249,115,22,0.4)] active:scale-95 transition-all text-[18px] md:text-[30px] hover:shadow-[0_0_25px_rgba(249,115,22,0.8)] hover:brightness-110 hover:-translate-y-1"
                              >
                                {t.status === 'on_hold' ? 'ดำเนินการต่อ' : 'แจ้งขัดข้อง'}
                              </button>
                              
                              {t.status !== 'on_hold' && (
                                <button
                                  onClick={() => setActionModal({ isOpen: true, ticketId: t.id, type: 'finish' })}
                                  className="flex-[1.5] bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border border-emerald-400 font-bold py-3.5 md:py-6 rounded-xl md:rounded-3xl shadow-[0_0_15px_rgba(16,185,129,0.4)] active:scale-95 transition-all text-[15px] md:text-[26px] hover:shadow-[0_0_25px_rgba(16,185,129,0.8)] hover:brightness-110 hover:-translate-y-1"
                                >
                                  ปิดงานซ่อม
                                </button>
                              )}
                            </div>
                          )}

                          {t.status === 'completed' && (
                            <button
                              onClick={() => updateTicketStatus(t.id, { 
                                status: 'in_progress', 
                                completedAt: null, 
                                cause: null 
                              })}
                              className="w-full bg-orange-100 text-orange-800 border-2 border-orange-400 font-bold py-3.5 md:py-6 rounded-xl md:rounded-3xl hover:bg-orange-200 hover:text-orange-900 active:scale-95 transition-all text-[15px] md:text-[24px] shadow-sm flex justify-center items-center gap-2 md:gap-4 mt-3 md:mt-6 hover:shadow-[0_0_15px_rgba(249,115,22,0.4)]"
                            >
                              <RotateCcw className="w-[18px] h-[18px] md:w-8 md:h-8 animate-spin-slow" /> ดึงงานกลับมาแก้ไขผลการซ่อม
                            </button>
                          )}
                        </div>
                      )}

                      {/* 🌟 โซนปุ่มกด Action (ขนาดบิ๊กเบิ้ม สำหรับผู้แจ้งปัญหา) */}
                      {currentUserRole === 'reporter' && !isCancelled && (
                        <div className="flex flex-col gap-2.5 md:gap-6 mt-4 md:mt-8">
                          {isPending && (
                            <div className="flex flex-col gap-2.5 md:gap-6">
                              {waitingMin > 60 && (
                                <div className="bg-green-600/20 border-2 border-solid border-rose-500 text-rose-600 text-[14px] md:text-[22px] font-bold px-4 py-2.5 md:py-5 rounded-xl md:rounded-2xl flex items-center gap-2 md:gap-4 mb-1 md:mb-3">
                                  <AlertTriangle className="w-[15px] h-[15px] md:w-8 md:h-8 animate-pulse shrink-0" />
                                  รอดำเนินการเกิน 1 ชั่วโมง (SLA Breach)
                                </div>
                              )}
                              <div className="flex gap-2 md:gap-5">
                                <button
                                  onClick={() =>
                                    setActionModal({
                                      isOpen: true,
                                      ticketId: t.id,
                                      type: 'cancel',
                                    })
                                  }
                                  className="flex-[1] bg-orange text-rose-500 border-2 border-solid border-orange-500 font-bold py-3.5 md:py-6 rounded-xl md:rounded-3xl flex justify-center items-center gap-1.5 md:gap-3 active:scale-95 text-[18px] md:text-[28px] transition-colors shadow-sm hover:bg-rose-50"
                                >
                                  <XCircle className="w-[22px] h-[22px] md:w-9 md:h-9" /> ยกเลิก
                                </button>
                                <a
                                  href="tel:0835293836" 
                                  className="flex-[1.5] bg-gradient-to-r from-orange-500 to-amber-500 text-white border-2 border-solid border-white/50 font-black py-4 md:py-6 rounded-2xl md:rounded-[2rem] flex justify-center items-center gap-1.5 sm:gap-2 md:gap-4 shadow-[0_0_15px_rgba(249,115,22,0.4)] active:scale-95 transition-all text-[16px] sm:text-[18px] md:text-[28px] tracking-wide whitespace-nowrap hover:shadow-[0_0_25px_rgba(249,115,22,0.8)]"
                                >
                                  <PhoneCall className="w-6 h-6 md:w-10 md:h-10 animate-pulse shrink-0" />
                                  สายด่วน หน.ฝวด.
                                </a>
                              </div>
                            </div>
                          )}

                          {t.status === 'in_progress' && fixingMin > 5 * 24 * 60 && (
                            <div className="flex flex-col gap-2 md:gap-6 mt-1 md:mt-3">
                              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[13px] md:text-[22px] font-bold px-4 py-2.5 md:py-5 rounded-xl md:rounded-2xl flex items-center gap-2 md:gap-4">
                                <AlertTriangle className="w-[14px] h-[14px] md:w-8 md:h-8 animate-pulse shrink-0" />
                                ดำเนินการซ่อมเกินกำหนด 5 วัน (SLA Breach)
                              </div>
                              <a
                                href="tel:0835293836"
                                className="flex-[1.5] bg-gradient-to-r from-rose-600 to-red-700 text-white border-2 border-solid border-white/50 font-black py-4 md:py-8 rounded-2xl md:rounded-[2rem] flex justify-center items-center gap-1.5 sm:gap-2 md:gap-4 shadow-[0_0_15px_rgba(225,29,72,0.4)] active:scale-95 transition-all text-[13px] sm:text-[15px] md:text-[30px] tracking-wide whitespace-nowrap hover:shadow-[0_0_25px_rgba(225,29,72,0.8)]"
                              >
                                <PhoneCall className="w-6 h-6 md:w-10 md:h-10 animate-pulse shrink-0" />
                                สายด่วน หน.ฝวด. (กรณีล่าช้า)
                              </a>
                            </div>
                          )}

                          {t.status === 'completed' && (
                            <button
                              onClick={() => {
                                const techData = technicianList.find(x => x.name === t.techName);
                                setRatingModal({ 
                                  isOpen: true, 
                                  ticketId: t.id, 
                                  rating: 0, 
                                  comment: '', 
                                  techName: t.techName,
                                  techPhotoUrl: techData ? techData.photo : '' 
                                });
                              }}
                              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border border-emerald-400 font-bold py-4 md:py-8 rounded-xl md:rounded-[2rem] flex justify-center items-center gap-2 md:gap-4 shadow-[0_0_15px_rgba(16,185,129,0.4)] active:scale-95 transition-all text-[16px] md:text-[32px] hover:shadow-[0_0_25px_rgba(16,185,129,0.6)]"
                            >
                              <Star className="w-5 h-5 md:w-10 md:h-10 animate-pulse text-yellow-300" fill="currentColor" /> ยืนยันผลและให้คะแนนช่าง
                            </button>
                          )}
                          
                          {t.status === 'verified' && (
                            <div className="w-full bg-emerald-100 border-2 border-solid border-emerald-400 py-3.5 md:py-6 rounded-xl md:rounded-3xl flex justify-center items-center gap-2 md:gap-4 text-emerald-600 font-bold text-[16px] md:text-[30px] shadow-inner">
                              <CheckCircle className="w-6 h-6 md:w-10 md:h-10" /> เสร็จสิ้นสมบูรณ์
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  </div>
                );
            })
            )}
          </div>
          

      {/* 🛠️ Action Modals (ฟันธง: เพิ่มรูปแบบที่ 6 ดำเนินการซ่อมต่อ 'resume' สีส้มหล่อเท่ ไม่เอ๋อเป็น SSC แน่นอน 1,000,000%) */}
      {actionModal.isOpen && (
        <div className="fixed inset-0 z-[150] flex p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in" onClick={() => setActionModal({ isOpen: false, ticketId: null, type: null })}>
        <div className={`absolute w-[300px] h-[300px] rounded-full blur-[80px] animate-pulse pointer-events-none z-0 ${actionModal.type === 'finish' ? 'bg-emerald-500/40' : actionModal.type === 'hold' || actionModal.type === 'cancel' ? 'bg-rose-500/40' : 'bg-orange-500/40'}`}></div>
        <div className={`relative m-auto z-10 bg-slate-900 border-[2px] border-solid rounded-[2rem] w-[95%] max-w-[320px] sm:max-w-sm md:max-w-md h-auto max-h-[calc(100dvh-130px)] overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] p-5 sm:p-8 md:p-10 text-center space-y-4 sm:space-y-7 ${actionModal.type === 'finish' ? 'border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.5)]' : actionModal.type === 'hold' || actionModal.type === 'cancel' ? 'border-rose-500 shadow-[0_0_50px_rgba(225,29,72,0.5)]' : 'border-orange-500 shadow-[0_0_50px_rgba(249,115,22,0.6)]'}`} onClick={(e) => e.stopPropagation()}>
            
            {/* 🌟 จุดที่ 3: ไอคอนเรืองแสงด้านบน */}
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto border-[3px] border-solid bg-slate-950 transition-all duration-300 ${
              actionModal.type === 'finish' ? 'text-emerald-500 border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.8)]' :
              actionModal.type === 'hold' || actionModal.type === 'cancel' ? 'text-rose-500 border-rose-500 shadow-[0_0_25px_rgba(225,29,72,0.8)]' : 
              'text-orange-500 border-orange-500 shadow-[0_0_25px_rgba(249,115,22,0.8)]'
            }`}>
              {actionModal.type === 'accept' && <Wrench size={44} className="animate-pulse" />}
              {actionModal.type === 'hold' && <PauseCircle size={44} className="animate-pulse" />}
              {actionModal.type === 'finish' && <ClipboardCheck size={44} className="animate-pulse" />}
              {actionModal.type === 'cancel' && <XCircle size={44} className="animate-pulse" />}
              {actionModal.type === 'ssc' && <AlertTriangle size={44} className="animate-pulse" />}
              {actionModal.type === 'resume' && <Wrench size={44} className="animate-pulse" />}
            </div>

            {/* 🌟 ข้อความหัวข้อ (ฟันธงแทรกเงื่อนไข resume แยกจาก SSC เด็ดขาด) */}
            <div>
               <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight drop-shadow-lg mb-2.5">
                 {actionModal.type === 'accept' ? 'รับงานซ่อมระบบ?' :
                  actionModal.type === 'cancel' ? 'ยกเลิกงานแจ้งซ่อม?' :
                  actionModal.type === 'finish' ? 'บันทึกปิดงานซ่อม' :
                  actionModal.type === 'hold' ? 'แจ้งเหตุขัดข้อง?' :
                  actionModal.type === 'resume' ? 'ดำเนินการซ่อมต่อ' :
                  'บันทึกเวร SSC'}
               </h3>
               <p className="text-[14px] md:text-[15px] text-slate-300 font-bold leading-relaxed px-2 md:px-4">
                 {actionModal.type === 'accept' ? <>คุณกำลังจะกดยอมรับงานซ่อมรหัส<br/><span className="text-orange-400 font-extrabold">{actionModal.ticketId}</span></> :
                  actionModal.type === 'cancel' ? <>คุณแน่ใจหรือไม่ว่าต้องการยกเลิกงาน<br/><span className="text-rose-400 font-extrabold">{actionModal.ticketId}</span><br/><span className="text-[11px] md:text-[12px] text-rose-300 opacity-80">(การกระทำนี้ไม่สามารถย้อนกลับได้)</span></> :
                  actionModal.type === 'finish' ? <>โปรดตรวจสอบข้อมูลให้ถูกต้อง ก่อนส่งผล<br/><span className="text-orange-400 font-extrabold">{actionModal.ticketId}</span></> :
                  actionModal.type === 'hold' ? <>โปรดระบุเหตุผลที่ทำให้การซ่อมล่าช้า<br/>งานรหัส <span className="text-orange-400 font-extrabold">{actionModal.ticketId}</span></> :
                  actionModal.type === 'resume' ? <>โปรดระบุรายละเอียดสำหรับรหัสงาน<br/><span className="text-orange-400 font-extrabold">{actionModal.ticketId}</span></> :
                  <>โปรดระบุการแก้ไขเบื้องต้นสำหรับงาน<br/><span className="text-orange-400 font-extrabold">{actionModal.ticketId}</span></>}
               </p>
            </div>

            {/* 🌟 ช่องกรอกข้อมูล */}
            {/* 🌟 ช่องกรอกข้อมูล (อัปเกรด UI: กรอบขาว Inactive -> ฟ้า Cyan Active) */}
            {/* 🌟 ช่องกรอกข้อมูล (อัปเกรด UI: กรอบขาว Inactive -> ฟ้า Cyan Active) */}
            <div className="text-left space-y-5">
              {actionModal.type === 'accept' ? (
                 <div className="space-y-2">
                   <label className="text-sm font-black text-orange-400 tracking-wider">👨‍🔧 เลือกผู้รับผิดชอบหลัก</label>
                   <select
                     value={selectedTech}
                     onChange={(e) => setSelectedTech(e.target.value)}
                     className="w-full bg-slate-800 border-[2px] border-solid border-white/50 text-white rounded-xl px-4 py-3 outline-none transition-all duration-300 appearance-none cursor-pointer hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.6)]"
                   >
                     <option value="" disabled>-- โปรดเลือก --</option>
                     {technicianList.map((tech) => (
                       <option key={tech.name} value={tech.name}>{tech.name}</option>
                     ))}
                   </select>
                 </div>
              ) : (
                 <div className="space-y-2">
                   <label className={`text-sm font-black tracking-wider flex items-center gap-1.5 ${
                     actionModal.type === 'finish' ? 'text-emerald-400' : 
                     actionModal.type === 'hold' || actionModal.type === 'cancel' ? 'text-rose-400' : 'text-orange-400'
                   }`}>
                     <FileText size={16} /> 
                     {actionModal.type === 'hold' ? 'เหตุผลที่ทำให้เกิดความล่าช้า' :
                      actionModal.type === 'cancel' ? 'ระบุเหตุผลการยกเลิก' :
                      actionModal.type === 'finish' ? 'สรุปผลการซ่อม/ข้อแนะนำ' :
                      'บันทึกเหตุผลที่ต้องดำเนินการต่อ'}
                   </label>
                   <textarea
                     value={actionText}
                     onChange={(e) => setActionText(e.target.value)}
                     placeholder="ระบุรายละเอียดลงที่นี่..."
                     rows={4}
                     className="w-full bg-slate-800 border-[2px] border-solid border-white/50 rounded-xl px-5 py-3.5 text-white font-bold text-sm outline-none transition-all duration-300 resize-none shadow-inner hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.6)]"
                   />
                 </div>
              )}
            </div>

           {/* 🌟 🔘 โซนปุ่มกด (อัปเกรด UI: กรอบขาวทั้งหมด + แยกสี Hover ตาม Semantic) */}
           <div className="flex gap-4 pt-4">
              
              {/* ⚪ ปุ่มซ้าย: ยกเลิก (Safe Action) - ฟันธง: กรอบขาว -> Hover แดงเรืองแสง */}
              <button
                 onClick={() => setActionModal({ isOpen: false, ticketId: null, type: null })}
                 className="flex-1 py-3.5 md:py-4 rounded-xl font-bold text-white bg-slate-800 border-[2px] border-solid border-white/50 shadow-inner active:scale-95 transition-all duration-300 hover:bg-rose-600 hover:border-rose-400 hover:shadow-[0_0_20px_rgba(225,29,72,0.8)] hover:-translate-y-1"
              >
                 {actionModal.type === 'cancel' ? 'ไม่ยกเลิก' : 'ยกเลิก'}
              </button>

              {/* 🔴/🟠/🟢 ปุ่มขวา: ยืนยันทำรายการ - ฟันธง: กรอบขาว -> แยกสี Hover สีส้ม/แดง/เขียว ให้ตรงกับแสงด้านหลัง! */}
              <button
                 onClick={executeActionModal}
                 disabled={actionModal.type === 'accept' ? !selectedTech : !actionText.trim()}
                 className={`flex-[1.5] py-3.5 md:py-4 rounded-xl font-black text-white border-[2px] border-solid border-white/50 active:scale-95 transition-all duration-300 hover:-translate-y-1 hover:border-white disabled:opacity-50 disabled:grayscale ${
                   actionModal.type === 'cancel' || actionModal.type === 'hold'
                     ? 'bg-rose-600 shadow-[0_5px_15px_rgba(225,29,72,0.4)] hover:bg-rose-500 hover:shadow-[0_0_35px_rgba(225,29,72,1)]' 
                     : actionModal.type === 'finish'
                     ? 'bg-emerald-600 shadow-[0_5px_15px_rgba(16,185,129,0.4)] hover:bg-emerald-500 hover:shadow-[0_0_35px_rgba(16,185,129,1)]' 
                     : 'bg-gradient-to-r from-orange-500 to-amber-500 shadow-[0_5px_15px_rgba(249,115,22,0.4)] hover:from-orange-400 hover:to-amber-400 hover:shadow-[0_0_35px_rgba(249,115,22,1)]'
                 }`}
              >
                 {actionModal.type === 'accept' ? 'ยืนยันรับงานซ่อม' :
                  actionModal.type === 'cancel' ? 'ยืนยันลบงานซ่อม' :
                  actionModal.type === 'finish' ? 'ยืนยันบันทึกปิดงาน' :
                  actionModal.type === 'hold' ? 'ยืนยันแจ้งขัดข้อง' :
                  'ยืนยันบันทึก'}
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );

  return (
    <div className="fixed inset-0 w-full h-[100dvh] bg-slate-900 flex justify-center overflow-hidden">
      
      {/* 🌍 ภาพพื้นหลังลูกโลก */}
      <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 pointer-events-none" style={{ backgroundImage: "url('/bg-earth-new.webp')" }}></div>


     {/* 📱 2. กรอบเนื้อหาหลักของแอป (ฟันธง: เก็บความกว้าง 6xl ไว้เพื่อความอลังการบน PC) */}
     <div className={`relative z-10 flex flex-col h-[100dvh] w-full max-w-md md:max-w-6xl backdrop-blur-md overflow-hidden text-slate-100 font-sans select-none bg-slate-900/40 border-x border-solid transition-all duration-1000 ${
        activeTab === 'dashboard' ? 'shadow-[0_0_60px_-5px_rgba(249,115,22,1)] border-orange-500/50' :
        activeTab === 'report' ? 'shadow-[0_0_60px_-5px_rgba(16,185,129,1)] border-emerald-500/50' :
        (activeTab === 'tracking' && currentUserRole !== 'reporter' ? 'shadow-[0_0_60px_-5px_rgba(6,182,212,1)] border-cyan-500/50' :
        'shadow-[0_0_60px_-5px_rgba(244,63,94,1)] border-rose-500/50')
      }`}>

      {lightboxImg && (
        <div className="fixed inset-0 z-[200] bg-slate-900/90 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in" onClick={() => setLightboxImg(null)}>
          <button className="absolute top-6 right-6 text-white bg-white/10 p-2 rounded-full active:bg-white/20"><X size={24} /></button>
          <img src={lightboxImg} alt="Zoomed" className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl border-2 border-white/20" />
        </div>
      )}

      {emailNotify && (
        <div className="absolute top-24 left-4 right-4 z-[100] bg-emerald-50 text-emerald-700 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-top-4 border border-emerald-200">
          <Mail size={18} className="text-emerald-500 shrink-0" />
          <span className="text-[10px] font-bold leading-tight">{emailNotify}</span>
        </div>
      )}


      {/* 🚀 Dynamic Header (ฟันธง: รีดไขมันแนวตั้ง ปรับ md:py-4 ลดเหลือ md:py-2.5 คืนพื้นที่จอ) */}
      <div className="bg-slate-900/50 backdrop-blur-xl pl-5 md:pl-8 pr-4 py-3 md:py-2.5 flex items-center justify-between sticky top-4 z-50 border-2 border-solid border-orange-500 rounded-2xl md:rounded-xl mt-4 md:mt-3 transition-all duration-500 shadow-[0_0_15px_rgba(249,115,22,0.5)] mx-4 md:mx-6">
        <div className="flex items-center gap-3.5 md:gap-4 z-10">
          
          <div className="bg-white w-14 h-14 md:w-12 md:h-12 rounded-2xl md:rounded-xl shadow-md text-orange-500 border-2 border-solid border-orange-300 flex items-center justify-center shrink-0">
            {activeTab === 'dashboard' ? <LayoutDashboard className="w-8 h-8 md:w-6 md:h-6" strokeWidth={2.5} /> : activeTab === 'report' ? <PlusCircle className="w-8 h-8 md:w-6 md:h-6" strokeWidth={2.5} /> : currentUserRole !== 'reporter' ? <Wrench className="w-8 h-8 md:w-6 md:h-6" strokeWidth={2.5} /> : <ClipboardCheck className="w-8 h-8 md:w-6 md:h-6" strokeWidth={2.5} />}
          </div>
          
          <div>



          {/* ========================================================= */}
            {/* 🌟 ฟันธง: สมองกลคำทักทายอัจฉริยะฉบับไซไฟอวกาศ (รู้ใจ แยกบริบทตามหน้าจอ 100%) */}
            {(() => {
              const hour = sysTime.getHours();
              let rawName = String(currentUserName || localStorage.getItem('gse_remembered_name') || '').trim();
              let shortName = rawName.split(' ')[0].replace(/^(นาย|นางสาว|น\.ส\.|นาง|ว่าที่ ร\.ต\.)/g, '').trim();
              const displayName = shortName ? `คุณ${shortName}` : '';
              
              const myRawPhone = String(sessionStorage.getItem('userPhone') || localStorage.getItem('gse_remembered_phone') || '').trim().replace(/\D/g, '');
              const hasActiveTicket = tickets.some(t => {
                const tPhone = String(t.reporterContact || t.contact || '').trim().replace(/\D/g, '');
                return tPhone === myRawPhone && ['pending', 'acknowledged', 'in_progress', 'on_hold'].includes(t.status);
              });

              let greeting = ``;
              
              // 🌟 1. สำหรับ หน.ฝวด. (Commander)
              if (currentUserRole === 'Commander') {
                if (hour >= 5 && hour < 12) greeting = `☀️ อรุณสวัสดิ์ครับท่านหัวหน้า ศูนย์ปฏิบัติการ GSE พร้อมรายงานสถานะเช้านี้ครับ`;
                else if (hour >= 12 && hour < 17) greeting = `🌤️ สวัสดีตอนบ่ายครับท่านหัวหน้า ระบบแดชบอร์ดพร้อมติดตามงานครับ`;
                else if (hour >= 17 && hour < 21) greeting = `🌇 สวัสดีตอนเย็นครับท่านหัวหน้า ตรวจสอบภาพรวมงานประจำวันได้เลยครับ`;
                else {
                  // 🌙 นอกเวลาทำการ (หลัง 21:00 น.) แยกตามหน้าต่างที่เปิด
                  if (activeTab === 'dashboard') greeting = `🌙 นอกเวลาทำการ ระบบแผงควบคุมสแตนด์บายสรุปข้อมูลครับท่านหัวหน้า`;
                  else greeting = `🌙 นอกเวลาทำการ ระบบจัดการงานซ่อมสแตนด์บายอัตโนมัติครับท่านหัวหน้า`;
                }
              } 
              // 🌟 2. สำหรับวิศวกร ฝวด. และ ผู้ใช้งานทั่วไป (Technician & Reporter)
              else {
                // 🔧 กรณีมีงานค้าง (แสดงเฉพาะก่อน 3 ทุ่ม เพื่อไม่ไปทับข้อความแจ้งนอกเวลา)
                if (hasActiveTicket && hour >= 5 && hour < 21) greeting = `🔧 สวัสดีครับ ${displayName} 👋 มีงานซ่อมของท่านกำลังดำเนินการอยู่ ตรวจสอบสถานะได้เลยครับ`;
                else if (hour >= 5 && hour < 12) greeting = `☀️ สวัสดีตอนเช้าครับ ${displayName} ทีม ฝวด. พร้อมสนับสนุนการปฏิบัติงานภาคพื้นดินวันนี้ครับ`;
                else if (hour >= 12 && hour < 17) greeting = `🌤️ สวัสดีตอนบ่ายครับ ${displayName} ให้ ฝวด. ช่วยดูแลระบบหรืออุปกรณ์ไหน แจ้งได้เลยครับ`;
                else if (hour >= 17 && hour < 21) greeting = `🌇 สวัสดีตอนเย็นครับ ${displayName} นอกเวลาทำการ วิศวกรเวร ฝวด. ก็พร้อมดูแลระบบให้ท่านครับ`;
                else {
                  // 🌙 นอกเวลาทำการ (หลัง 21:00 น.) แยกตามหน้าต่างที่เปิด
                  if (activeTab === 'report') {
                    greeting = `🌙 ขณะนี้นอกเวลาทำการ (หลัง 21:00 น.) ท่านสามารถฝากเรื่องแจ้งซ่อมไว้ในระบบได้เลยครับ`;
                  } else if (activeTab === 'tracking') {
                    greeting = `🌙 ขณะนี้นอกเวลาทำการ ระบบรับเรื่องไว้แล้ว วิศวกร ฝวด. จะเร่งตรวจสอบให้ในวันทำการถัดไปครับ`;
                  } else {
                    greeting = `🌙 ขณะนี้นอกเวลาทำการ (หลัง 21:00 น.) ระบบสแตนด์บายอัตโนมัติครับ`;
                  }
                }
              }

              return (
                <div className="text-orange-300 font-bold text-[16px] md:text-22px] tracking-widest mb-0.5 md:mb-1 animate-in slide-in-from-top-2 flex items-center gap-1.5 opacity-90 drop-shadow-sm">
                   {greeting}
                </div>
              );
            })()}
            {/* ========================================================= */}
         

            <h1 className="font-black text-white text-3xl md:text-5xl tracking-widest leading-none drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] md:py-1 whitespace-nowrap">
              {activeTab === 'dashboard' ? 'แผงควบคุม' : activeTab === 'report' ? 'แจ้งซ่อม' : currentUserRole !== 'reporter' ? 'จัดการงานซ่อม' : 'ติดตามสถานะ'}
            </h1>
          </div>
        </div>



       {/* 🌟 ฟันธง: โซนขวามือ (ลบปุ่ม Logout ทิ้ง เหลือแค่น้องมาสคอตน่ารักๆ คลีนๆ) */}
       <div className="flex items-center gap-4 z-50">
          <div className="relative w-12 md:w-28 h-14 md:h-16 shrink-0 pointer-events-none overflow-visible">
            <img 
              src={activeTab === 'dashboard' ? "/mascot-dashboard.webp" : activeTab === 'report' ? "/mascot-report.webp" : (activeTab === 'tracking' && currentUserRole !== 'reporter') ? "/mascot-tech.webp" : "/mascot-track.webp"}
              key={activeTab + currentUserRole}
              alt="GSE Mascot" 
              className="absolute bottom-[-10px] right-[-10px] md:bottom-[-35px] md:right-[-5px] w-[65px] md:w-[85px] max-w-none h-auto object-contain drop-shadow-[0_5px_5px_rgba(0,0,0,0.4)] animate-in slide-in-from-right-4 fade-in duration-500 overflow-visible"
            />
          </div>
        </div>
      </div>



      {/* 🎯 พื้นที่แสดงผลเนื้อหาภายในแอป */}
      <div 
        className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-28 md:px-6"
        style={{ overscrollBehavior: 'none', touchAction: 'pan-y' }}
      >
       {activeTab === 'dashboard' && (currentUserRole !== 'reporter') && renderDashboard()}
        {activeTab === 'report' && renderReport()}
        {activeTab === 'tracking' && renderTracking()}
      </div>

      </div>

      {/* 🌟 ปิดกรอบเนื้อหาหลักของแอป */}


{/* ======================================================================= */}
      {/* 🌟 ฟันธงจุดที่ 2: Popup ต้อนรับผู้ใช้งานใหม่ (ฉลองการสมัครสำเร็จครั้งแรก) */}
      {/* ======================================================================= */}
      {showWelcomePopup && typeof document !== 'undefined' ? createPortal(
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in zoom-in duration-500" onClick={() => setShowWelcomePopup(false)}>
          
          {/* พลุแสงสีส้มด้านหลัง */}
          <div className="absolute w-[300px] h-[300px] bg-orange-500/40 rounded-full blur-[100px] animate-pulse pointer-events-none z-0"></div>
          
          <div className="relative z-10 w-full max-w-sm bg-slate-900 border-[3px] border-solid border-orange-500 rounded-[2.5rem] p-8 shadow-[0_0_50px_rgba(249,115,22,0.6)] flex flex-col items-center text-center transform transition-all" onClick={e => e.stopPropagation()}>
            
            <div className="w-24 h-24 bg-gradient-to-tr from-orange-400 to-amber-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.8)] border-[3px] border-solid border-white mb-6 animate-bounce">
              <span className="text-5xl drop-shadow-md pb-2">🎉</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-orange-300 to-orange-600 drop-shadow-lg mb-2">
              ยินดีต้อนรับ!
            </h2>
            <h3 className="text-[18px] md:text-2xl font-black text-white mb-4 drop-shadow-sm">
              คุณ{String(currentUserName || localStorage.getItem('gse_remembered_name') || 'ผู้ใช้งานใหม่').split(' ')[0]}
            </h3>

            <p className="text-[13px] md:text-[15px] font-bold text-slate-300 leading-relaxed mb-6 bg-slate-800/50 p-4 rounded-2xl border border-orange-500/30 shadow-inner">
              การลงทะเบียนเสร็จสมบูรณ์!<br/>
              ทีมวิศวกร ฝวด. ยินดีให้บริการครับ<br/>
              <span className="text-orange-400 mt-2 block font-black tracking-wide">หากระบบหรืออุปกรณ์มีปัญหา<br/>กดที่ปุ่ม "แจ้งซ่อม" ได้ตลอด 24 ชม.</span>
            </p>

            <button 
              onClick={() => setShowWelcomePopup(false)}
              className="w-full h-14 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-[18px] md:text-xl rounded-2xl border-[2px] border-solid border-orange-300 shadow-[0_0_20px_rgba(249,115,22,0.5)] hover:shadow-[0_0_30px_rgba(249,115,22,0.8)] active:scale-95 hover:-translate-y-1 transition-all"
            >
              เริ่มต้นใช้งานเลย 🚀
            </button>

          </div>
        </div>,
        document.body
      ) : null}

{/* 🌟 หน้าต่าง Popup ประเมินความพึงพอใจ (CSAT) - คงไว้สมบูรณ์แบบปลอดภัย 100% */}
{ratingModal.isOpen && (() => {
        const rating = ratingModal.rating;
        const rColor = rating === 5 ? { text: 'text-emerald-400', fill: '#34d399', drop: 'drop-shadow-[0_0_15px_rgba(52,211,153,1)]', border: 'border-emerald-500', shadow: 'shadow-[0_0_60px_rgba(52,211,153,0.4)]', flare: 'bg-emerald-500/80', btnFrom: 'from-emerald-500', btnTo: 'to-emerald-600', btnGlow: 'shadow-[0_0_20px_rgba(16,185,129,0.8)]', btnHover: 'hover:shadow-[0_0_30px_rgba(16,185,129,1)]', ring: 'focus:border-emerald-500 focus:ring-emerald-500/50', iconGlow: 'shadow-[0_0_25px_rgba(52,211,153,0.9)]' } :
                       rating === 4 ? { text: 'text-cyan-400', fill: '#22d3ee', drop: 'drop-shadow-[0_0_15px_rgba(34,211,238,1)]', border: 'border-cyan-500', shadow: 'shadow-[0_0_60px_rgba(34,211,238,0.4)]', flare: 'bg-cyan-500/80', btnFrom: 'from-cyan-500', btnTo: 'to-cyan-600', btnGlow: 'shadow-[0_0_20px_rgba(6,182,212,0.8)]', btnHover: 'hover:shadow-[0_0_30px_rgba(6,182,212,1)]', ring: 'focus:border-cyan-500 focus:ring-cyan-500/50', iconGlow: 'shadow-[0_0_25px_rgba(34,211,238,0.9)]' } :
                       rating === 3 ? { text: 'text-yellow-400', fill: '#facc15', drop: 'drop-shadow-[0_0_15px_rgba(250,204,21,1)]', border: 'border-yellow-500', shadow: 'shadow-[0_0_60px_rgba(250,204,21,0.4)]', flare: 'bg-yellow-500/90', btnFrom: 'from-yellow-500', btnTo: 'to-yellow-600', btnGlow: 'shadow-[0_0_20px_rgba(234,179,8,0.8)]', btnHover: 'hover:shadow-[0_0_30px_rgba(234,179,8,1)]', ring: 'focus:border-yellow-500 focus:ring-yellow-500/50', iconGlow: 'shadow-[0_0_25px_rgba(250,204,21,0.9)]' } :
                       rating === 2 ? { text: 'text-orange-400', fill: '#fb923c', drop: 'drop-shadow-[0_0_15px_rgba(251,146,60,1)]', border: 'border-orange-500', shadow: 'shadow-[0_0_60px_rgba(251,146,60,0.4)]', flare: 'bg-orange-500/90', btnFrom: 'from-orange-500', btnTo: 'to-orange-600', btnGlow: 'shadow-[0_0_20px_rgba(249,115,22,0.8)]', btnHover: 'hover:shadow-[0_0_30px_rgba(249,115,22,1)]', ring: 'focus:border-orange-500 focus:ring-orange-500/50', iconGlow: 'shadow-[0_0_25px_rgba(251,146,60,0.9)]' } :
                       rating === 1 ? { text: 'text-rose-400', fill: '#fb7185', drop: 'drop-shadow-[0_0_15px_rgba(244,63,94,1)]', border: 'border-rose-500', shadow: 'shadow-[0_0_60px_rgba(244,63,94,0.4)]', flare: 'bg-rose-500/80', btnFrom: 'from-rose-500', btnTo: 'to-rose-600', btnGlow: 'shadow-[0_0_20px_rgba(225,29,72,0.8)]', btnHover: 'hover:shadow-[0_0_30px_rgba(225,29,72,1)]', ring: 'focus:border-rose-500 focus:ring-rose-500/50', iconGlow: 'shadow-[0_0_25px_rgba(244,63,94,0.9)]' } :
                                      { text: 'text-slate-500', fill: 'none', drop: '', border: 'border-slate-700', shadow: 'shadow-[0_0_40px_rgba(0,0,0,0.5)]', flare: 'bg-blue-500/10', btnFrom: 'from-slate-700', btnTo: 'to-slate-800', btnGlow: '', btnHover: '', ring: 'focus:border-slate-400 focus:ring-slate-400/50', iconGlow: 'shadow-[0_0_15px_rgba(255,255,255,0.1)]' };

                                      return (
                                        /* 🎯 ฟันธง: แก้ไขระยะ pb-[110px] md:pb-32 เพื่อดันกล่องขึ้นให้พ้นแถบเมนูด้านล่างเวลาซูมบน PC */
                                        <div className="fixed inset-0 z-[160] flex items-center justify-center pb-[110px] md:pb-32 bg-slate-950/90 backdrop-blur-md p-4 animate-in fade-in" onClick={() => setRatingModal({ isOpen: false, ticketId: null, rating: 0, comment: '', techName: '' })}>
                                          <div className={`absolute w-[450px] md:w-[600px] h-[450px] md:h-[600px] rounded-full blur-[100px] md:blur-[150px] pointer-events-none z-0 transition-colors duration-700 ${rColor.flare}`}></div>
                                          
                                          {/* 🎯 ฟันธง: ขยายร่างกล่องบน PC จากเดิม sm:max-w-sm เพิ่มความกว้างเป็น md:max-w-xl เพื่อให้พื้นที่แนวตั้งเหลือเฟือ ปุ่มไม่โดนบัง และเปลี่ยนระยะเว้น md:p-8 */}
                                          <div className={`relative m-auto z-10 bg-slate-900 border-[3px] border-solid rounded-[2.5rem] w-[95%] max-w-[320px] sm:max-w-sm md:max-w-xl h-auto max-h-[calc(100dvh-140px)] overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-4 pt-5 pb-5 sm:px-6 sm:pt-8 sm:pb-8 md:p-8 text-center transition-all duration-300 transform-gpu ${rColor.border} ${rColor.shadow}`} onClick={(e) => e.stopPropagation()}>
                                          
                                          <div className="flex flex-col items-center mb-6 animate-in slide-in-from-top-4">
                                            <div className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mx-auto border-[3px] border-white bg-slate-800 transition-all duration-500 shadow-[0_0_20px_rgba(255,255,255,0.15)] mb-3 overflow-hidden ${rColor.iconGlow}`}>
                                              {ratingModal.techPhotoUrl ? (
                                                 <img src={ratingModal.techPhotoUrl} className="w-full h-full object-cover" alt="ช่าง ฝวด." />
                                              ) : (
                                                 <User size={45} className={`mt-3 md:w-16 md:h-16 transition-colors duration-500 ${rating > 0 ? rColor.text : 'text-slate-400'}`} fill="currentColor" />
                                              )}
                                            </div>
                                            
                                            {/* 🎯 ฟันธง: ขยายชื่อช่างผู้รับผิดชอบบน PC ให้ใหญ่ชัดเจน (md:text-3xl) */}
                                            <h3 className="text-xl md:text-3xl font-black text-white tracking-tight drop-shadow-md">
                                              {ratingModal.techName || 'ทีมช่าง ฝวด.'}
                                            </h3>
                                            
                                            {/* 🎯 ฟันธงแก้ไขจุดสำคัญ: ปรับเปลี่ยนข้อความนำหน้าเป็น "ผู้รับผิดชอบรหัสงาน" และขยายฟอนต์ PC เป็น md:text-[16px] */}
                                            <p className="text-[12px] md:text-[16px] text-slate-400 font-bold mt-1.5 flex items-center gap-1.5 justify-center w-full">
                                              ผู้รับผิดชอบรหัสงาน 
                                              <span className={`text-[16px] md:text-[22px] font-black font-mono tracking-wider transition-colors duration-300 drop-shadow-sm ${rating > 0 ? rColor.text : 'text-orange-400'}`}>
                                                {ratingModal.ticketId}
                                              </span>
                                            </p>
                                          </div>
                              
                                          {/* 🎯 ฟันธง: ขยายตัวหนังสือพาดหัวคำถามบน PC ให้ใหญ่เต็มตาเป็น md:text-xl */}
                                          <div className="mb-4">
                                            <h3 className={`text-[15px] md:text-xl font-black tracking-widest transition-colors duration-300 ${rating > 0 ? rColor.text : 'text-slate-200'}`}>
                                              คุณพึงพอใจการซ่อมระดับไหน?
                                            </h3>
                                          </div>
                              
                                          {/* ส่วนระบบดวงดาวคงความสวยงามเดิมไว้เป๊ะๆ ปรับขยายขนาดดาวบน PC เล็กน้อยให้สมดุล */}
                                          <div className={`inline-flex items-center justify-center gap-1.5 py-4 px-6 md:py-5 md:px-8 rounded-3xl border-[2px] border-solid bg-slate-900/50 mb-6 transition-colors duration-500 ${rColor.border}`}>
                                            {[1, 2, 3, 4, 5].map((star) => (
                                              <button
                                                key={star}
                                                type="button"
                                                onClick={() => {
                                                  setRatingModal({ ...ratingModal, rating: star, comment: '' });
                                                  setSelectedTags([]); 
                                                }}
                                                className={`transition-all duration-300 transform hover:scale-125 active:scale-90 ${
                                                  rating >= star 
                                                    ? `${rColor.text} ${rColor.drop}` 
                                                    : 'text-slate-600 hover:text-slate-400'
                                                }`}
                                              >
                                                <Star className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12" fill={rating >= star ? rColor.fill : 'none'} strokeWidth={rating >= star ? 0 : 1.5} />
                                              </button>
                                            ))}
                                          </div>
                                          
                                          {/* คำอธิบายคะแนนดาว ขยายฟอนต์บน PC เป็น md:text-2xl */}
                                          <div className="h-7 mb-6">
                                            <span className={`text-[17px] md:text-22px font-black tracking-widest animate-in fade-in zoom-in duration-300 ${rColor.text}`}>
                                              {rating === 5 ? 'ยอดเยี่ยม 😍' : 
                                               rating === 4 ? 'ดีมาก 😁' : 
                                               rating === 3 ? 'ดี 😊' : 
                                               rating === 2 ? 'พอใช้ 😐' : 
                                               rating === 1 ? 'ปรับปรุง 😞' : 'โปรดแตะเลือกจำนวนดาว'}
                                            </span>
                                          </div>
                              
                                          {rating > 0 && (
                                            <div className="mb-6 animate-in slide-in-from-top-3 duration-500 text-left">
                                              {/* ขยายป้ายคำแนะนำป้ายแท็กบน PC เป็น md:text-[15px] */}
                                              <p className={`text-[13px] md:text-[15px] font-bold mb-3 text-center ${rColor.text}`}>
                                                ท่านประทับใจส่วนไหนเป็นพิเศษ? (เลือกได้หลายข้อ)
                                              </p>
                                              <div className="flex flex-wrap justify-center gap-2 px-2">
                                              {(tagsByRating[rating] || []).map((tag, index) => (
                                                  <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => toggleTag(tag)}
                                                    /* ปรับแต่งขนาดแท็กให้อวบอิ่มขึ้นเมื่อแสดงผลบน PC (md:text-[14px] md:px-4 md:py-2) */
                                                    className={`px-3 py-1.5 rounded-full text-[12px] md:text-[14px] font-black whitespace-nowrap border-[2px] border-solid transition-all active:scale-95 duration-300 ${
                                                      selectedTags.includes(tag)
                                                        ? `bg-gradient-to-r ${rColor.btnFrom} ${rColor.btnTo} text-white ${rColor.border} shadow-md drop-shadow-md` 
                                                        : `bg-slate-800 text-slate-300 border-slate-600 hover:${rColor.text} hover:border-slate-400`
                                                    }`}
                                                  >
                                                    {tag}
                                                  </button>
                                                ))}
                                              </div>
                                            </div>
                                          )}
                              
                                          <div className="text-left mb-6">
                                          <textarea
                                              name="ratingComment"
                                              value={ratingModal.comment}
                                              onChange={(e) => setRatingModal({ ...ratingModal, comment: e.target.value })}
                                              placeholder="พิมพ์ข้อเสนอแนะเพิ่มเติม..."
                                              rows={3}
                                              /* ขยายขนาดช่องพิมพ์ข้อความของ PC ให้ตัวใหญ่ขึ้นพิมพ์ถนัดสายตามากขึ้น (md:text-base) */
                                              className={`w-full bg-slate-800 border-[2px] border-solid border-slate-600 rounded-2xl px-4 py-3 text-white font-bold text-sm md:text-base outline-none transition-all shadow-inner ${rating > 0 ? rColor.ring : 'focus:border-slate-400 focus:ring-slate-400/50'}`}
                                            />
                                          </div>
                              
                                          {/* 🎯 ฟันธง: ขยายความสูงปุ่ม และอัปขนาดตัวหนังสือปุ่มให้เต็มหน้าจอคอมพิวเตอร์ (md:py-4 md:text-xl) */}
                                          <div className="flex gap-3">
                                            <button
                                              type="button"
                                              onClick={() => setRatingModal({ isOpen: false, ticketId: null, rating: 0, comment: '', techName: '' })}
                                              className="flex-[0.8] py-4 md:py-4 rounded-xl font-bold text-rose-200 bg-rose-900/40 border-[2px] border-solid border-rose-500/50 hover:bg-rose-600 hover:border-rose-400 hover:text-white hover:shadow-[0_0_20px_rgba(225,29,72,0.8)] hover:-translate-y-1 active:scale-95 transition-all duration-300 md:text-xl"
                                            >
                                              ยกเลิก
                                            </button>
                                            
                                            <button
                                              type="button"
                                              onClick={executeRatingSubmit}
                                              disabled={rating === 0}
                                              className={`flex-[1.2] py-4 md:py-4 rounded-xl font-black text-white border-[2px] border-solid active:scale-95 transition-all duration-300 md:text-xl ${
                                                rating === 0 
                                                  ? 'bg-slate-800 border-slate-600 text-slate-500 opacity-50 cursor-not-allowed' 
                                                  : `bg-gradient-to-r ${rColor.btnFrom} ${rColor.btnTo} ${rColor.border} ${rColor.btnGlow} ${rColor.btnHover} hover:-translate-y-1`
                                              }`}
                                            >
                                              ยืนยันการประเมิน
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                      );
                                    })()}

{/* 🌟 หน้าต่าง Popup กราบขอบพระคุณ (Thank You Modal) - คงไว้สมบูรณ์แบบปลอดภัย 100% */}
{/* 🌟 หน้าต่าง Popup กราบขอบพระคุณ (Thank You Modal) - คงไว้สมบูรณ์แบบปลอดภัย 100% */}
{showThanksModal && (() => {
        const rating = ratingModal.rating;
        const tColor = rating === 5 ? { 
            border: 'border-emerald-500', text: 'text-emerald-400', flare: 'bg-emerald-500', 
            glow: 'shadow-[0_0_40px_rgba(16,185,129,0.3)]', boxBg: 'bg-emerald-950/40',
            boxGlow: 'shadow-[0_0_25px_rgba(16,185,129,0.4)]',
            btnHover: 'hover:bg-emerald-600 hover:border-emerald-400 hover:text-white hover:shadow-[0_0_25px_rgba(16,185,129,0.8)]'
          } : rating === 4 ? { 
            border: 'border-cyan-500', text: 'text-cyan-400', flare: 'bg-cyan-500', 
            glow: 'shadow-[0_0_40px_rgba(34,211,238,0.3)]', boxBg: 'bg-cyan-950/40',
            boxGlow: 'shadow-[0_0_25px_rgba(34,211,238,0.4)]',
            btnHover: 'hover:bg-cyan-600 hover:border-cyan-400 hover:text-white hover:shadow-[0_0_25px_rgba(34,211,238,0.8)]'
          } : rating === 3 ? { 
            border: 'border-yellow-500', text: 'text-yellow-400', flare: 'bg-yellow-500', 
            glow: 'shadow-[0_0_40px_rgba(250,204,21,0.3)]', boxBg: 'bg-yellow-950/40',
            boxGlow: 'shadow-[0_0_25px_rgba(250,204,21,0.4)]',
            btnHover: 'hover:bg-yellow-600 hover:border-yellow-400 hover:text-white hover:shadow-[0_0_25px_rgba(250,204,21,0.8)]'
          } : rating === 2 ? { 
            border: 'border-orange-500', text: 'text-orange-400', flare: 'bg-orange-500', 
            glow: 'shadow-[0_0_40px_rgba(249,115,22,0.3)]', boxBg: 'bg-orange-950/40',
            boxGlow: 'shadow-[0_0_25px_rgba(249,115,22,0.4)]',
            btnHover: 'hover:bg-orange-600 hover:border-orange-400 hover:text-white hover:shadow-[0_0_25px_rgba(249,115,22,0.8)]'
          } : { 
            border: 'border-rose-500', text: 'text-rose-400', flare: 'bg-rose-500', 
            glow: 'shadow-[0_0_40px_rgba(225,29,72,0.3)]', boxBg: 'bg-rose-950/40',
            boxGlow: 'shadow-[0_0_25px_rgba(225,29,72,0.4)]',
            btnHover: 'hover:bg-rose-600 hover:border-rose-400 hover:text-white hover:shadow-[0_0_25px_rgba(225,29,72,0.8)]'
          };

          return (
            <div className="fixed inset-0 z-[200] flex items-center justify-center pb-[110px] md:pb-4 bg-slate-950/90 backdrop-blur-md p-4 animate-in fade-in" onClick={() => setShowThanksModal(false)}>
              
              <div className={`absolute w-[400px] h-[400px] rounded-full blur-[100px] opacity-60 pointer-events-none z-0 transition-colors duration-700 ${tColor.flare}`}></div>

              <div className={`relative m-auto z-10 bg-slate-900 border-[3px] border-solid ${tColor.border} rounded-[2.5rem] w-[95%] max-w-[350px] sm:max-w-sm h-auto max-h-[calc(100dvh-130px)] overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] p-5 sm:p-8 text-center space-y-3 sm:space-y-4 animate-in zoom-in-95 duration-300 ${tColor.glow}`} onClick={(e) => e.stopPropagation()}>
              
              <div className="relative mx-auto w-24 h-24 mt-2 mb-2">
                <div className={`absolute -inset-2 blur-[20px] rounded-full opacity-70 animate-pulse ${tColor.flare}`}></div>
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-[3px] border-solid border-white shadow-lg bg-slate-800 flex items-center justify-center z-10">
                  {ratingModal.techPhotoUrl ? (
                    <img src={ratingModal.techPhotoUrl} className="w-full h-full object-cover" alt="ช่าง" />
                  ) : (
                    <User size={50} className="text-slate-300" />
                  )}
                </div>
              </div>

              <div className="space-y-1 relative z-10">
                <h3 className="text-[20px] md:text-[22px] font-black text-white leading-tight drop-shadow-md">
                  กระผม {ratingModal.techName || 'ทีมช่าง ฝวด.'}
                </h3>
                <p className="text-[12px] font-bold text-slate-400 tracking-widest uppercase">
                  ผู้รับผิดชอบหลักรหัส <span className={`font-black ${tColor.text} drop-shadow-sm`}>{ratingModal.ticketId}</span>
                </p>
              </div>

              <div className="flex justify-center items-center gap-1.5 mt-2 mb-1 relative z-10">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    size={28} 
                    className={`transition-all duration-500 ${rating >= star ? `${tColor.text} drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] scale-110` : 'text-slate-700/50'}`} 
                    fill={rating >= star ? "currentColor" : "none"} 
                    strokeWidth={rating >= star ? 0 : 1.5}
                  />
                ))}
              </div>

              <div className="w-full flex justify-center py-1 relative z-10">
                <img src="/mascot.webp" alt="GSE Mascot" className="h-20 sm:h-28 object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] hover:scale-105 transition-transform" />
              </div>

              <div className={`p-4 rounded-2xl border-[2px] border-solid ${tColor.border} ${tColor.boxBg} ${tColor.boxGlow} relative z-10 transition-all duration-300`}>
                <p className={`text-[13px] md:text-[14px] font-bold leading-relaxed px-1 ${tColor.text}`}>
                  {rating >= 4 ? 'กราบขอบพระคุณอย่างสูงครับ! ผมจะรักษามาตรฐานนี้เพื่อบริการท่านให้ดีที่สุดต่อไปครับ' :
                   rating === 3 ? 'ขอบพระคุณสำหรับผลการประเมินครับ ผมจะนำข้อเสนอแนะของท่านไปพัฒนาการทำงานให้ดียิ่งขึ้นครับ' :
                   'กราบขออภัยอย่างสูงครับ ผมน้อมรับทุกคำติชมและจะรีบนำไปปรับปรุงงานบริการให้ดีขึ้นอย่างเร่งด่วนครับ'}
                </p>
              </div>

              {/* 🌟 ฟันธง: แบนเนอร์ขอบคุณจากฝ่าย ฝวด. (แทรกตรงนี้ สวยงาม ลงตัวที่สุด) */}
              <div className="mt-4 p-4 rounded-xl bg-slate-900/60 border border-cyan-500/30 flex items-start gap-3 text-left shadow-[inset_0_0_15px_rgba(6,182,212,0.1)] relative z-10">
                <ShieldCheck className="w-8 h-8 text-cyan-400 shrink-0 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                <div>
                  <h4 className="text-cyan-300 font-black text-[14px] md:text-[16px]">
                    ฝ่ายวิศวกรรมระบบปฏิบัติการดาวเทียม (ฝวด.)
                  </h4>
                  <p className="text-slate-300 text-[12px] md:text-[14px] font-bold mt-1 leading-relaxed">
                    ขอบพระคุณสำหรับทุกคะแนนประเมินและเสียงสะท้อน เราจะนำไปพัฒนาและยกระดับมาตรฐานการบริการให้ดียิ่งขึ้นต่อไป
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setShowThanksModal(false)}
                className={`relative z-10 w-full py-4 mt-2 rounded-xl font-black text-slate-200 bg-slate-800 border-[2px] border-solid border-slate-400 active:scale-95 transition-all duration-300 tracking-widest shadow-md ${tColor.btnHover}`}
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        );
      })()}

    {/* 🌟 ฟันธง: ย้ายหน้าต่างจัดเวรมาไว้ตรงนี้ เพื่อให้กางบังมิดทั้งจอ 100% ทะลุเมนู */}
    {showAdminRoster && (
          <div className="fixed inset-0 z-[99999] bg-slate-950 overflow-y-auto pb-20">
            {/* ปุ่มปิดหน้าแอดมิน */}
            <div className="sticky top-0 right-0 p-4 md:p-6 flex justify-end z-[100] bg-gradient-to-b from-slate-950/90 to-transparent pointer-events-none">
            </div>
            {/* ดึงหน้าจอแอดมินมาแสดง */}
            <div className="-mt-16 md:-mt-20">
               {/* 🌟 ฟันธงแก้ไขจุดนี้: ส่งสัญญาณ onClose ไปสั่งให้ปิดหน้าต่าง (เปลี่ยนค่าเป็น false) */}
               <AdminRosterSettings onClose={() => setShowAdminRoster(false)} />
            </div>
          </div>
        )}

   {/* 🌟 ฟันธง: เรียกใช้ฟอนต์ Sarabun เรียบร้อย สะอาดตา */}
   <SarabunFontEmbed />

{/* 🧭 Navigation Bar (ฟันธง: คืนค่าความกว้างเดิมให้ขนานกับกรอบบนสุด 100%) */}
<div className={`fixed left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] md:w-[calc(100%-3rem)] max-w-md md:max-w-[calc(72rem-3rem)] py-2 md:py-4 bg-slate-900/95 backdrop-blur-xl border-2 md:border-[3px] border-solid border-orange-500 rounded-2xl md:rounded-[2rem] z-[9999] shadow-[0_10px_30px_rgba(249,115,22,0.4)] md:shadow-[0_15px_40px_rgba(249,115,22,0.6)] transform-gpu transition-all duration-500 ease-in-out ${
  isNavVisible ? 'bottom-4 md:bottom-8 opacity-100 translate-y-0' : '-bottom-32 opacity-0 translate-y-full pointer-events-none'
}`}>
  
  <div className="w-full flex justify-evenly items-center px-1 md:px-8">
          
      {/* 🚪 ปุ่มออกจากระบบ (แทนปุ่มหน้าแรก) */}
      <button 
            onClick={async () => {
              try {
                await signOut(auth); // สั่งเตะบัญชีออกจาก Firebase
                onGoHome(); // วาร์ปกลับหน้า Landing Page
              } catch (error) {
                console.error("Logout Error:", error);
              }
            }} 
            className="flex flex-col items-center justify-center gap-1.5 md:gap-3 active:scale-95 transition-all shrink-0 group"
          >
            <div className="p-2.5 md:p-4 rounded-full bg-transparent text-slate-400 group-hover:text-rose-400 transition-colors">
              <LogOut className="w-6 h-6 md:w-12 md:h-12" />
            </div>
            <span className="block text-[14px] md:text-[22px] font-black text-slate-400 group-hover:text-rose-400 tracking-widest whitespace-nowrap shrink-0 transition-colors">ออกจากระบบ</span>
          </button>

      {/* ================= โหมดแผงแจ้งซ่อม ติดตามสถานะ หน้าผู้แจ้ง (Reporter) ================= */}
      {currentUserRole === 'reporter' && (
        <>
          {/* 🟠 ปุ่มแจ้งซ่อม */}
          <button onClick={() => setActiveTab('report')} className="flex flex-col items-center justify-center gap-1.5 md:gap-3 transition-all shrink-0 active:scale-95 group">
            <div className={`p-2.5 md:p-4 rounded-full transition-all ${activeTab === 'report' ? 'bg-gradient-to-b from-orange-400 to-orange-600 text-white shadow-[0_0_15px_rgba(249,115,22,0.8)] border-[2px] border-white scale-110' : 'bg-transparent text-slate-400 group-hover:text-orange-300'}`}>
              <PlusCircle className={`w-6 h-6 md:w-12 md:h-12 ${activeTab === 'report' ? 'stroke-[3px]' : ''}`} />
            </div>
            <span className={`block text-[14px] md:text-[22px] font-black tracking-widest whitespace-nowrap shrink-0 transition-all ${activeTab === 'report' ? 'text-orange-400 drop-shadow-md md:mt-1' : 'text-slate-400 group-hover:text-orange-300'}`}>แจ้งซ่อม</span>
          </button>

          {/* 🟠 ปุ่มติดตามสถานะ */}
          <button onClick={() => { setActiveTab('tracking'); setSearchTerm(''); }} className="flex flex-col items-center justify-center gap-1.5 md:gap-3 transition-all shrink-0 active:scale-95 group">
            <div className={`p-2.5 md:p-4 rounded-full transition-all ${activeTab === 'tracking' ? 'bg-gradient-to-b from-orange-400 to-orange-600 text-white shadow-[0_0_15px_rgba(249,115,22,0.8)] border-[2px] border-white scale-110' : 'bg-transparent text-slate-400 group-hover:text-orange-300'}`}>
              <ClipboardCheck className={`w-6 h-6 md:w-12 md:h-12 ${activeTab === 'tracking' ? 'stroke-[3px]' : ''}`} />
            </div>
            <span className={`block text-[14px] md:text-[22px] font-black tracking-widest whitespace-nowrap shrink-0 transition-all ${activeTab === 'tracking' ? 'text-orange-400 drop-shadow-md md:mt-1' : 'text-slate-400 group-hover:text-orange-300'}`}>ติดตามสถานะ</span>
          </button>
        </>
      )}


      {/* ======= โหมดแผงควบคุมด้านล่างช่าง (Technician) ======*/}
      {currentUserRole !== 'reporter' && (
        <>
          {/* 🟠 ปุ่มแผงควบคุม */}
          <button onClick={() => setActiveTab('dashboard')} className="flex flex-col items-center justify-center gap-1.5 md:gap-3 transition-all shrink-0 active:scale-95 group">
            <div className={`p-2.5 md:p-4 rounded-full transition-all ${activeTab === 'dashboard' ? 'bg-gradient-to-b from-orange-400 to-orange-600 text-white shadow-[0_0_15px_rgba(249,115,22,0.8)] border-[2px] border-white scale-110' : 'bg-transparent text-slate-400 group-hover:text-orange-300'}`}>
              <LayoutDashboard className={`w-6 h-6 md:w-12 md:h-12 ${activeTab === 'dashboard' ? 'stroke-[3px]' : ''}`} />
            </div>
            <span className={`block text-[14px] md:text-[22px] font-black tracking-widest whitespace-nowrap shrink-0 transition-all ${activeTab === 'dashboard' ? 'text-orange-400 drop-shadow-md md:mt-1' : 'text-slate-400 group-hover:text-orange-300'}`}>แผงควบคุม</span>
          </button>

           {/* 🟠 ปุ่มจัดการงานซ่อม */}
          <button onClick={() => setActiveTab('tracking')} className="flex flex-col items-center justify-center gap-1.5 md:gap-3 transition-all shrink-0 active:scale-95 group">
            <div className={`p-2.5 md:p-4 rounded-full transition-all ${activeTab === 'tracking' ? 'bg-gradient-to-b from-orange-400 to-orange-600 text-white shadow-[0_0_15px_rgba(249,115,22,0.8)] border-[2px] border-white scale-110' : 'bg-transparent text-slate-400 group-hover:text-orange-300'}`}>
              <Wrench className={`w-6 h-6 md:w-12 md:h-12 ${activeTab === 'tracking' ? 'stroke-[3px]' : ''}`} />
            </div>
            <span className={`block text-[14px] md:text-[22px] font-black tracking-widest whitespace-nowrap shrink-0 transition-all ${activeTab === 'tracking' ? 'text-orange-400 drop-shadow-md md:mt-1' : 'text-slate-400 group-hover:text-orange-300'}`}>จัดการงาน</span>
          </button>
        </>
      )}
    </div>
  </div>
</div>
  );
}


// =========================================================================
// 🌟 ฟันธง: หน้าต่างลงทะเบียนผู้แจ้งซ่อม (อัปเกรดจำอุปกรณ์ + ฟอร์แมตเบอร์ + ตาดู PIN)
// =========================================================================
function ReporterLoginPopup({ onClose, onLoginSuccess }) {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isConfirmingPin, setIsConfirmingPin] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  
  const [showPhoneConfirm, setShowPhoneConfirm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 🌟 ฟันธง: เพิ่ม State สำหรับเปิด/ปิดตา (ดูรหัสผ่าน PIN)
  const [showPin, setShowPin] = useState(false);

  // 🌟 สมองกลดักจับแป้นพิมพ์คีย์บอร์ด (ทำงานเฉพาะฝั่งผู้แจ้งซ่อม)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || isLoading || showPhoneConfirm) return;
      
      if (/^[0-9]$/.test(e.key)) {
        handleNumpad(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Enter' && step === 1 && phone.length === 10) {
        setShowPhoneConfirm(true);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const handleNumpad = (num) => {
    if (step === 1 && phone.length < 10) setPhone(phone + num);
    else if (step === 2 && pin.length < 6 && !isConfirmingPin) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 6) {
        if (isNewUser) setIsConfirmingPin(true);
        else submitLogin(phone, newPin); 
      }
    } else if (step === 2 && confirmPin.length < 6 && isConfirmingPin) {
      const newConfirmPin = confirmPin + num;
      setConfirmPin(newConfirmPin);
      if (newConfirmPin.length === 6) {
        if (newConfirmPin === pin) setStep(3); 
        else {
          setLoginError('รหัส PIN ไม่ตรงกัน กรุณาตั้งใหม่');
          setPin(''); setConfirmPin(''); setIsConfirmingPin(false);
        }
      }
    }
  };

  const handleDelete = () => {
    if (step === 1) setPhone(phone.slice(0, -1));
    else if (step === 2 && isConfirmingPin) setConfirmPin(confirmPin.slice(0, -1));
    else if (step === 2 && !isConfirmingPin) setPin(pin.slice(0, -1));
  };

  const handleClear = () => {
    if (step === 1) setPhone('');
    else if (step === 2 && isConfirmingPin) setConfirmPin('');
    else if (step === 2 && !isConfirmingPin) setPin('');
  };

  // 🌟 ฟันธง: ฟอร์แมตเบอร์โทร 3-3-4 เรียลไทม์ (086-554-5665)
  const formatPhone = (p) => {
    if (!p) return '___-___-____';
    const str = p.padEnd(10, '_');
    return `${str.slice(0, 3)}-${str.slice(3, 6)}-${str.slice(6)}`;
  };

  // 🌟 ฟันธง: ฟอร์แมต PIN ให้เป็นดอกจัน (*****) และเปิด/ปิดได้
  const formatPinDisplay = (p) => {
    if (showPin) return p.padEnd(6, '-');
    return '*'.repeat(p.length).padEnd(6, '-');
  };

  const confirmPhoneNext = async () => {
    setShowPhoneConfirm(false);
    setIsLoading(true);
    setLoginError('');
    try {
      const isOldUser = phone.endsWith('9'); 
      if (isOldUser) {
        setIsNewUser(false);
        setStep(2); 
      } else {
        setIsNewUser(true);
        setStep(2); 
      }
    } catch (error) {
      setLoginError('เกิดข้อผิดพลาด กรุณาลองใหม่');
    }
    setIsLoading(false);
  };

  const handleFinalSubmit = async () => {
    if (!name || !email) {
      setLoginError('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    setIsLoading(true);
    try {
      localStorage.setItem('gse_reporter_phone', phone); 
      onLoginSuccess();
    } catch (error) {
      setLoginError('บันทึกข้อมูลไม่สำเร็จ');
    }
    setIsLoading(false);
  };

  const submitLogin = async (loginPhone, loginPin) => {
    setIsLoading(true);
    localStorage.setItem('gse_reporter_phone', loginPhone); 
    onLoginSuccess();
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[300] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={onClose}>
      <div className="absolute w-[300px] h-[300px] bg-orange-500/30 rounded-full blur-[100px] animate-pulse pointer-events-none z-0"></div>
      
      <div className="relative z-10 w-full max-w-sm bg-slate-900 border-[3px] border-solid border-cyan-500/50 rounded-[2.5rem] p-6 shadow-[0_0_50px_rgba(249,115,22,0.3)] flex flex-col items-center gap-4 transform transition-all" onClick={e => e.stopPropagation()}>
        
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-rose-400 transition-colors z-20">
          <X size={28} />
        </button>

        {showPhoneConfirm && (
          <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 animate-in zoom-in-95 duration-200 rounded-[2.5rem]">
            <div className="bg-slate-900 border-[2px] border-orange-500 rounded-2xl p-6 shadow-[0_0_30px_rgba(249,115,22,0.5)] text-center w-full">
              <h3 className="text-xl font-black text-white mb-2">ตรวจสอบหมายเลข</h3>
              <p className="text-slate-300 text-sm mb-4">นี่คือหมายเลขโทรศัพท์ของท่านใช่หรือไม่?</p>
              <div className="text-3xl font-black text-orange-400 tracking-widest mb-6 py-3 bg-slate-950 rounded-xl border border-orange-500/30">
                {formatPhone(phone)}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowPhoneConfirm(false)} className="flex-1 py-3 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700 transition-colors">แก้ไขเบอร์</button>
                <button onClick={confirmPhoneNext} className="flex-1 py-3 bg-orange-600 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.5)] hover:bg-orange-500 transition-colors">ยืนยันตามนี้</button>
              </div>
            </div>
          </div>
        )}

        {step < 3 && (
          <>
            <div className="relative mt-2">
              <div className="absolute inset-0 bg-orange-500 blur-[20px] opacity-40 rounded-full"></div>
              <div className="relative w-16 h-16 bg-slate-950 border-[2px] border-orange-400 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.6)]">
                <Phone className="w-8 h-8 text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
              </div>
            </div>
            
            <h2 className="text-xl font-black text-white tracking-wide text-center">
              {step === 1 ? 'เบอร์โทรศัพท์ผู้แจ้ง' : (isNewUser ? (isConfirmingPin ? '✅ ยืนยันรหัส PIN อีกครั้ง' : '✨ ตั้งรหัส PIN 6 หลัก') : '🔒 ใส่รหัส PIN เข้าสู่ระบบ')}
            </h2>

            {loginError && <p className="text-sm font-bold text-center p-2 rounded-lg w-full border animate-in shake bg-rose-500/10 text-rose-400 border-rose-500/30">{loginError}</p>}

            {/* 🌟 ฟันธง: แผงแสดงตัวเลข และ ปุ่มดวงตาตา */}
            <div className="relative w-full mb-2">
              <div className="w-full bg-slate-950 border-[2px] border-slate-700 rounded-2xl h-16 flex items-center justify-center text-3xl font-black text-white tracking-[0.1em] shadow-inner transition-all">
                {step === 1 ? formatPhone(phone) : formatPinDisplay(isConfirmingPin ? confirmPin : pin)}
              </div>
              {step === 2 && (
                <button type="button" onClick={() => setShowPin(!showPin)} className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-600 hover:text-orange-400 transition-colors drop-shadow-md z-20">
                  {showPin ? <EyeOff size={24} /> : <Eye size={24} />}
                </button>
              )}
            </div>

            <div className={`grid grid-cols-3 gap-3 w-full px-1 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button key={num} onClick={() => handleNumpad(num.toString())} className="h-14 md:h-16 flex items-center justify-center bg-slate-900/60 border border-slate-600/50 rounded-2xl text-2xl md:text-3xl font-black text-slate-200 hover:bg-orange-500/20 hover:border-orange-400 transition-all active:scale-95">{num}</button>
              ))}
              <button onClick={handleClear} className="h-14 md:h-16 flex items-center justify-center bg-slate-900/60 border border-slate-600/50 rounded-2xl text-2xl md:text-3xl font-black text-amber-500 hover:bg-amber-500/20 hover:border-amber-400 transition-all active:scale-95">C</button>
              <button onClick={() => handleNumpad('0')} className="h-14 md:h-16 flex items-center justify-center bg-slate-900/60 border border-slate-600/50 rounded-2xl text-2xl md:text-3xl font-black text-slate-200 hover:bg-orange-500/20 hover:border-orange-400 transition-all active:scale-95">0</button>
              <button onClick={handleDelete} className="h-14 md:h-16 flex items-center justify-center bg-slate-900/60 border border-slate-600/50 rounded-2xl text-rose-500 hover:bg-rose-500/20 hover:border-rose-500 transition-all active:scale-95">
                <X size={32} className="drop-shadow-md stroke-[3px]" />
              </button>
            </div>

            {step === 1 && (
              <button
                onClick={() => { if (phone.length === 10) setShowPhoneConfirm(true); }}
                disabled={phone.length !== 10}
                className={`w-full mt-4 py-3 md:py-4 rounded-xl font-black text-[16px] md:text-[18px] transition-all duration-300 ${phone.length === 10 ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.6)] hover:scale-[1.02]' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
              >
                ถัดไป (ตรวจสอบหมายเลข)
              </button>
            )}
          </>
        )}

        {step === 3 && (
          <div className="w-full flex flex-col items-center animate-in slide-in-from-right duration-300 mt-4">
            <h2 className="text-xl font-black text-white tracking-wide text-center mb-4 flex items-center gap-2">
              📝 ข้อมูลแจ้งเตือน
            </h2>
            <div className="w-full bg-slate-800/80 border border-amber-500/30 rounded-lg p-3 mb-6 text-center shadow-inner">
              <p className="text-amber-400 font-bold text-sm">ยินดีต้อนรับ! กรอกอีเมลจริงหน่วยงานเพื่อเปิดระบบกู้คืนรหัสผ่านอัตโนมัติ</p>
            </div>

            <div className="w-full space-y-5">
               <div>
                 <label className="text-slate-300 text-sm font-bold mb-2 block">ชื่อ - นามสกุล</label>
                 <input type="text" value={name} onChange={e=>setName(e.target.value)} className="w-full bg-slate-950 border-[2px] border-slate-700 rounded-lg p-3 text-white font-bold focus:border-orange-500 outline-none transition-colors" />
               </div>
               <div>
                 <label className="text-slate-300 text-sm font-bold mb-2 block">อีเมลจริง (สำหรับรับลิงก์รีเซ็ตรหัสผ่าน)</label>
                 <input type="email" placeholder="username@gistda.or.th" value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-slate-950 border-[2px] border-slate-700 rounded-lg p-3 text-white font-bold focus:border-orange-500 outline-none transition-colors" />
               </div>
            </div>

            <div className="w-full flex gap-3 mt-8">
               <button onClick={() => setStep(2)} className="flex-1 bg-slate-800 text-white font-bold py-3 md:py-4 rounded-xl border border-slate-600 hover:bg-slate-700 transition-colors">ย้อนกลับ</button>
               <button onClick={handleFinalSubmit} className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-3 md:py-4 rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.5)] hover:scale-[1.02] transition-transform">เสร็จสิ้นการสมัคร</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}


// ==========================================
// 🌟 Landing Page - ฉบับสมบูรณ์ ไร้ Error 100% (อัปเกรด Login)
// ==========================================
function LandingPage({ onStart }) {
  const [showManual, setShowManual] = useState(false); 
  const [showLogin, setShowLogin] = useState(false);
  const [showReporterLogin, setShowReporterLogin] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // 🌟 ตัวแปรสำหรับระบบ PIN ของเจ้าหน้าที่ ฝวด.
  const [staffPhone, setStaffPhone] = useState('');
  const [staffPin, setStaffPin] = useState('');
  const [staffStep, setStaffStep] = useState(1);
  const [staffEmail, setStaffEmail] = useState('');
  const [staffRole, setStaffRole] = useState('');
  const [showStaffPin, setShowStaffPin] = useState(false)
  const [attemptCount, setAttemptCount] = useState(0); // <--- เพิ่มบรรทัดนี้
  const [confirmStaffPin, setConfirmStaffPin] = useState(''); 
  const [isConfirmingStaffPin, setIsConfirmingStaffPin] = useState(false);
  const [isNewStaff, setIsNewStaff] = useState(false);

// 🌟 ฟันธง: สมองกลแอปธนาคาร (ฝั่งเจ้าหน้าที่)
useEffect(() => {
  if (showLogin) {
    const savedPhone = localStorage.getItem('gse_staff_phone');
    if (savedPhone) {
      setStaffPhone(savedPhone);
      setStaffStep(2); // มีเบอร์แล้ว ข้ามไปหน้า PIN เลย
    } else {
      setStaffStep(1); // ไม่มีเบอร์ ให้เริ่มที่หน้า 1
      setStaffPhone('');
    }
    setStaffPin('');
    setLoginError('');
  }
}, [showLogin]);

  const closeStaffLogin = () => {
    setShowLogin(false);
    setStaffPhone('');
    setStaffPin('');
    setStaffStep(1);
    setStaffEmail('');
    setStaffRole('');
    setLoginError('');
    setAttemptCount(0); // <--- รีเซ็ตค่าเมื่อปิดหน้าต่าง
  };

  const handleStaffPhoneNext = async () => {
    if (staffPhone.length !== 10) {
      setLoginError('กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลักค่ะ');
      return;
    }
    setIsLoggingIn(true);
    setLoginError('');
    try {
      // 1. เช็คว่าเป็นเจ้าหน้าที่ ฝวด. หรือไม่
      const q = query(collection(db, 'staff_roles'), where('phone', '==', staffPhone));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const data = snap.docs[0].data();
        setStaffEmail(data.email);
        setStaffRole(data.role);
        
        // 🌟 2. สมองกลใหม่: เช็คว่าช่างคนนี้เคยตั้ง PIN (ลงทะเบียน) ไปหรือยัง
        // โดยเช็คจากตาราง users ทะลวงขีดจำกัด Firebase ทันที!
        const qCheck = query(collection(db, 'users'), where('email', '==', data.email));
        const snapCheck = await getDocs(qCheck);
        
        if (snapCheck.empty) {
          setIsNewStaff(true); // หาไม่เจอ = เป็นช่างใหม่ -> เปิดโหมด "ตั้งรหัส PIN 2 ครั้ง"
        } else {
          setIsNewStaff(false); // หาเจอ = เคยตั้งแล้ว -> เปิดโหมด "ใส่รหัส PIN ล็อกอิน"
        }
        setStaffStep(2);
      } else {
        setLoginError('เฉพาะเจ้าหน้าที่ ฝวด. เท่านั้น'); // ฟ้อง Error ตรงจุด
      }
    } catch (err) {
      setLoginError('เกิดข้อผิดพลาดในการตรวจสอบข้อมูล');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleStaffPinSubmit = async () => {
    if (isNewStaff) {
      if (!isConfirmingStaffPin) {
        if (staffPin.length !== 6) { setLoginError('กรุณาตั้งรหัส PIN ให้ครบ 6 หลักค่ะ'); return; }
        setIsConfirmingStaffPin(true);
        setLoginError('');
      } else {
        if (confirmStaffPin.length !== 6) { setLoginError('กรุณายืนยันรหัส PIN ให้ครบ 6 หลักค่ะ'); return; }
        if (staffPin !== confirmStaffPin) { 
          setLoginError('รหัส PIN ไม่ตรงกัน กรุณาลองใหม่อีกครั้งค่ะ'); 
          setConfirmStaffPin(''); 
          return; 
        }
        setIsLoggingIn(true); setLoginError('');
        try {
          await createUserWithEmailAndPassword(auth, staffEmail, staffPin);
          await addDoc(collection(db, 'users'), { 
            phone: staffPhone, email: staffEmail, role: staffRole, isStaff: true, createdAt: new Date().toISOString() 
          });
          localStorage.setItem('gse_staff_phone', staffPhone); // 🌟 ฟันธง: ฝังชิปจำเบอร์ให้ช่าง
          setAttemptCount(0);
          closeStaffLogin();
          onStart(staffRole);
        } catch (err) {
          setLoginError('เกิดข้อผิดพลาดในการลงทะเบียน: ' + err.message);
          setStaffPin(''); setConfirmStaffPin(''); setIsConfirmingStaffPin(false);
        } finally { setIsLoggingIn(false); }
      }
      return;
    }

    if (staffPin.length !== 6) { setLoginError('กรุณากรอกรหัส PIN ให้ครบ 6 หลักค่ะ'); return; }
    setIsLoggingIn(true); setLoginError('');
    try {
      await signInWithEmailAndPassword(auth, staffEmail, staffPin);
      localStorage.setItem('gse_staff_phone', staffPhone); // 🌟 ฟันธง: ฝังชิปจำเบอร์ให้ช่าง
      setAttemptCount(0);
      closeStaffLogin();
      onStart(staffRole);
    } catch (err) {
      const newCount = attemptCount + 1;
      setAttemptCount(newCount);
      setLoginError(`รหัส PIN ไม่ถูกต้อง (ครั้งที่ ${newCount}/5)`);
      setStaffPin('');
    } finally { setIsLoggingIn(false); }
  };

// =========================================================
  // 🌟 ฟันธงจุดที่ 3: ระบบ Auto-Login & Auto-Submit ทันทีที่ช่างพิมพ์ PIN ครบ 6 หลัก!
  // =========================================================
  useEffect(() => {
    if (showLogin && staffStep === 2 && !isLoggingIn) {
      if (isNewStaff && isConfirmingStaffPin && confirmStaffPin.length === 6) {
        handleStaffPinSubmit();
      } else if (!isNewStaff && staffPin.length === 6) {
        handleStaffPinSubmit();
      }
    }
  }, [staffPin, confirmStaffPin, staffStep, isLoggingIn, isConfirmingStaffPin, isNewStaff, showLogin]);


  const handleStaffNumpad = (num) => {
    setLoginError('');
    if (staffStep === 1 && staffPhone.length < 10) setStaffPhone(prev => prev + num);
    if (staffStep === 2) {
      if (isConfirmingStaffPin && confirmStaffPin.length < 6) setConfirmStaffPin(prev => prev + num);
      else if (!isConfirmingStaffPin && staffPin.length < 6) setStaffPin(prev => prev + num);
    }
  };

  const handleStaffDelete = () => {
    if (staffStep === 1) setStaffPhone(prev => prev.slice(0, -1));
    if (staffStep === 2) {
      if (isConfirmingStaffPin) setConfirmStaffPin(prev => prev.slice(0, -1));
      else setStaffPin(prev => prev.slice(0, -1));
    }
  };

  const handleStaffClear = () => {
    if (staffStep === 1) setStaffPhone('');
    if (staffStep === 2) {
      if (isConfirmingStaffPin) setConfirmStaffPin('');
      else setStaffPin('');
    }
  };

  useEffect(() => {
    const handleStaffKeyDown = (e) => {
      if (!showLogin) return;
      if (/^[0-9]$/.test(e.key)) handleStaffNumpad(e.key);
      else if (e.key === 'Backspace') handleStaffDelete();
      else if (e.key.toLowerCase() === 'c' || e.key === 'Escape') handleStaffClear();
      else if (e.key === 'Enter') {
        e.preventDefault();
        if (staffStep === 1) handleStaffPhoneNext();
        else if (staffStep === 2) handleStaffPinSubmit();
      }
    };
    window.addEventListener('keydown', handleStaffKeyDown);
    return () => window.removeEventListener('keydown', handleStaffKeyDown);
    
    // 🌟 ฟันธง: บรรทัดนี้แหละครับที่เป็นพระเอก! เติมตัวแปร 2 ตัวหลังสุดเข้าไปให้มันจำค่าได้!
  }, [showLogin, staffStep, staffPhone, staffPin, staffEmail, staffRole, isConfirmingStaffPin, confirmStaffPin]);

 // 🌟 ฟันธง: ฟอร์แมตเบอร์โทร 3-3-4 เรียลไทม์ (ฝั่งเจ้าหน้าที่ ฝวด.)
  const formatPhone = (p) => {
    if (!p) return '___-___-____';
    const str = p.padEnd(10, '_');
    return `${str.slice(0, 3)}-${str.slice(3, 6)}-${str.slice(6)}`;
  };

  const formatPinDisplay = (p) => {
    const padded = p.padEnd(6, '-');
    if (showStaffPin) return padded.split('').join(' ');
    return padded.split('').map(c => c === '-' ? '-' : '•').join(' ');
  };

  return (
    /* 🌟 ฟันธง: เปลี่ยนจาก h-[100dvh] เป็น min-h-[100dvh] และเปิดให้ไถจอได้ (overflow-y-auto) บนมือถือ จะได้ไม่บีบแบน */
    <div className="relative min-h-[100dvh] md:min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-12 overflow-y-auto overflow-x-hidden overscroll-none md:overscroll-auto bg-[#020617] font-sans">
      
      {/* 🌟 Background & Radar Scan */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 blur-[100px] rounded-full animate-pulse pointer-events-none"></div>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-screen pointer-events-none"
          style={{ backgroundImage: "url('/bg-earth-new.webp')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020617]/50 to-[#020617] pointer-events-none"></div>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        .animate-scan::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 8px;
          background: linear-gradient(to bottom, transparent, rgba(34,211,238,0.8), rgba(255,255,255,0.9));
          box-shadow: 0 0 20px rgba(34,211,238,0.8);
          animation: scan 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .bg-cyber-grid {
          background-image: 
            linear-gradient(rgba(34, 211, 238, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 211, 238, 0.05) 1px, transparent 1px);
          background-size: 30px 30px;
        }
      `}</style>
      <div className="absolute inset-0 z-0 bg-cyber-grid pointer-events-none fixed"></div>
      <div className="animate-scan absolute inset-0 z-0 pointer-events-none overflow-hidden fixed"></div>

      {/* 🌟 Main Content Box */}
      <div className="relative z-10 w-full h-full md:h-auto max-w-md md:max-w-xl lg:max-w-2xl flex flex-col items-center animate-in slide-in-from-bottom-8 fade-in duration-1000 my-auto py-6 md:py-0">
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-orange-500/20 blur-[120px] rounded-full pointer-events-none z-0 animate-pulse"></div>

        {/* 🌟 ฟันธง: เปลี่ยน h-full เป็น min-h-fit เพื่อให้กล่องขยายตามเนื้อหาในมือถือ */}
        <div
          className="pt-8 pb-6 px-4 md:pt-14 md:pb-6 md:px-10 rounded-[1.5rem] md:rounded-[3rem] flex flex-col items-center text-center w-full min-h-fit md:h-auto relative backdrop-blur-xl transition-all duration-500 z-10"
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            border: '3px solid #FF4500',
            boxShadow: '0 0 50px rgba(255, 69, 0, 0.6), inset 0 0 30px rgba(255, 69, 0, 0.2)'
          }}
        >
          {/* Logo */}
          <div className="shrink-0 w-24 h-24 sm:w-28 sm:h-28 md:w-44 md:h-44 -mt-10 md:-mt-12 mb-6 md:mb-4 flex items-center justify-center transition-all duration-500 relative">
            <div className="absolute inset-0 bg-orange-500/40 blur-[25px] rounded-full animate-pulse z-0"></div>
            <img src="/GSE-logo.webp" alt="Logo" className="w-full h-full object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)] hover:scale-105 transition-transform duration-500 relative z-10" />
          </div>

          {/* Mascot Text */}
          <div className="relative w-full flex flex-col items-center shrink-0 md:flex-none transition-all duration-500">            
            <div className="shrink-0 relative z-20 bg-slate-900/90 backdrop-blur-md rounded-2xl md:rounded-[2rem] p-3 md:p-6 shadow-[0_15px_40px_rgba(249,115,22,0.8)] text-center border-[2px] border-solid border-orange-500 mb-3 md:mb-4 animate-bounce">
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-[11px] w-5 h-5 bg-slate-900 border-b-[2px] border-r-[2px] border-solid border-orange-500 transform rotate-45 rounded-sm"></div>
              <p className="text-[15px] sm:text-[18px] md:text-[22px] font-bold text-slate-100 leading-relaxed relative z-20 shadow-none">
                ระบบ/อุปกรณ์มีปัญหาใช่มั้ยคะ?
                <br />
                <span className="text-orange-400 font-black text-[14px] sm:text-[15px] md:text-[22px] mt-1 md:mt-2 inline-flex items-center justify-center gap-1.5 md:gap-2 drop-shadow-[0_0_12px_rgba(249,115,22,1)] whitespace-nowrap">
                  กดแจ้งซ่อมได้เลยค่ะ!
                  <span className="text-[24px] md:text-[45px] leading-[0] block transform translate-y-1 md:translate-y-2 drop-shadow-md">👇</span>
                </span>
              </p>
            </div>

            {/* Mascot Image - 🌟 ฟันธง: ล็อกความสูงขั้นต่ำให้น้องมาสคอต ไม่ให้โดนบีบแบนบนมือถือ */}
            <div 
              className="shrink-0 flex items-center justify-center w-full md:w-[50%] relative z-30 mx-auto mb-3 md:mb-4 pointer-events-none drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)] transition-all duration-500" 
              style={{ maxWidth: '280px' }}
            >
              <img src="/mascot.webp" alt="Mascot" className="h-[130px] sm:h-[150px] md:h-auto w-auto md:w-full object-contain object-bottom hover:scale-105 transition-transform duration-500" />
            </div>
          </div>

          {/* 🌟 The 3 Sci-Fi Buttons - ฟันธง: ปรับขนาดปุ่ม, ระยะห่าง (gap), และ padding ให้เพรียวบางบนมือถือ */}
          <div className="shrink-0 w-full flex flex-col gap-2.5 md:gap-5 relative z-10 transition-all duration-500 mt-1 md:mt-4">
            
            <button onClick={() => setShowReporterLogin(true)} className="group relative w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-[15px] sm:text-[16px] md:text-[26px] py-3.5 md:py-5 rounded-2xl md:rounded-[1.5rem] border-[2px] border-solid border-white/40 shadow-[0_0_20px_rgba(249,115,22,0.8)] md:shadow-[0_0_30px_rgba(249,115,22,0.8)] hover:from-orange-400 hover:to-amber-400 hover:border-white hover:shadow-[0_0_60px_rgba(249,115,22,1),inset_0_0_20px_rgba(255,255,255,0.4)] hover:scale-[1.03] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 md:gap-4 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-orange-300/0 via-white/40 to-orange-300/0 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300"></div>
              <div className="bg-orange-900/60 p-1.5 md:p-3 rounded-xl md:rounded-2xl border border-orange-300 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] group-hover:bg-orange-800 group-hover:border-white group-hover:shadow-[0_0_20px_rgba(255,255,255,0.9)] transition-all z-10">
                <Wrench className="w-5 h-5 md:w-8 md:h-8 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              </div>
              <span className="tracking-widest drop-shadow-[0_2px_5px_rgba(0,0,0,0.6)] z-10 group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,1)]">แจ้งซ่อมระบบ/อุปกรณ์</span>
            </button>

            <button onClick={() => setShowLogin(true)} className="group relative w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-[15px] sm:text-[16px] md:text-[26px] py-3.5 md:py-5 rounded-2xl md:rounded-[1.5rem] border-[2px] border-solid border-white/40 shadow-[0_0_20px_rgba(16,185,129,0.8)] md:shadow-[0_0_30px_rgba(16,185,129,0.8)] hover:from-emerald-400 hover:to-teal-400 hover:border-white hover:shadow-[0_0_60px_rgba(16,185,129,1),inset_0_0_20px_rgba(255,255,255,0.4)] hover:scale-[1.03] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 md:gap-4 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-300/0 via-white/40 to-emerald-300/0 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300"></div>
              <div className="bg-emerald-900/60 p-1.5 md:p-3 rounded-xl md:rounded-2xl border border-emerald-300 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] group-hover:bg-emerald-800 group-hover:border-white group-hover:shadow-[0_0_20px_rgba(255,255,255,0.9)] transition-all z-10">
                <ShieldCheck className="w-5 h-5 md:w-8 md:h-8 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              </div>
              <span className="tracking-widest drop-shadow-[0_2px_5px_rgba(0,0,0,0.6)] z-10 group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,1)]">สำหรับเจ้าหน้าที่ ฝวด.</span>
            </button>

            <button onClick={() => setShowManual(true)} className="group relative w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-black text-[15px] sm:text-[16px] md:text-[26px] py-3.5 md:py-5 rounded-2xl md:rounded-[1.5rem] border-[2px] border-solid border-white/40 shadow-[0_0_20px_rgba(99,102,241,0.8)] md:shadow-[0_0_30px_rgba(99,102,241,0.8)] hover:from-indigo-400 hover:to-purple-400 hover:border-white hover:shadow-[0_0_60px_rgba(99,102,241,1),inset_0_0_20px_rgba(255,255,255,0.4)] hover:scale-[1.03] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 md:gap-4 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-300/0 via-white/40 to-indigo-300/0 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300"></div>
              <div className="bg-indigo-900/60 p-1.5 md:p-3 rounded-xl md:rounded-2xl border border-indigo-300 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] group-hover:bg-indigo-800 group-hover:border-white group-hover:shadow-[0_0_20px_rgba(255,255,255,0.9)] transition-all z-10">
                <FileText className="w-5 h-5 md:w-8 md:h-8 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              </div>
              <span className="tracking-widest drop-shadow-[0_2px_5px_rgba(0,0,0,0.6)] z-10 group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,1)]">คู่มือการใช้งานเบื้องต้น</span>
            </button>

          </div>

          <h2 className="text-[14px] md:text-[28px] font-black text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.9)] uppercase mt-5 md:mt-8 mb-1 transition-all duration-500 tracking-wide">
            ฝ่ายวิศวกรรมระบบปฏิบัติการดาวเทียม
          </h2>
          <h3 className="text-[12px] md:text-[18px] font-bold text-slate-300 tracking-[0.2em] mt-0.5 md:mt-1 transition-all duration-500">
            สำนักปฏิบัติการดาวเทียม
          </h3>

          <h3 className="font-mono text-slate-400 tracking-widest font-bold mt-4 md:mt-10 opacity-95 flex items-baseline justify-center flex-wrap gap-x-1.5 gap-y-1">
            <span className="text-[10px] md:text-[14px]">©2026</span>
            <span><span className="text-[14px] md:text-[22px] text-orange-500 font-black drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]">G</span><span className="text-[10px] md:text-[14px]">round</span></span>
            <span><span className="text-[14px] md:text-[22px] text-orange-500 font-black drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]">S</span><span className="text-[10px] md:text-[14px]">ystem</span></span>
            <span><span className="text-[14px] md:text-[22px] text-orange-500 font-black drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]">E</span><span className="text-[10px] md:text-[14px]">ngineering:</span></span>
            <span className="text-[13px] md:text-[20px] text-orange-400 font-black drop-shadow-[0_0_15px_rgba(249,115,22,1)] ml-1">GSE</span>
          </h3>
        </div>
      </div>

      {/* 🌟 Modals */}
      {showManual && (
        <div className="fixed inset-0 z-[200] bg-slate-950/90 flex flex-col items-center justify-center p-2 md:p-4 backdrop-blur-md animate-in fade-in" onClick={() => setShowManual(false)}> 
          <div className="absolute w-[300px] h-[300px] bg-orange-500/40 rounded-full blur-[100px] animate-pulse pointer-events-none z-0"></div>
          <div className="w-full max-w-lg md:max-w-4xl bg-slate-900 border-[3px] md:border-[4px] border-solid border-orange-500 rounded-2xl md:rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(249,115,22,0.6)] flex flex-col max-h-[96vh] md:max-h-[90vh] relative z-10 transition-all" onClick={(e) => e.stopPropagation()}>
            <div className="relative py-4 px-4 md:px-8 bg-slate-950 flex items-center justify-between border-b-4 border-orange-500 shrink-0 min-h-[70px] md:min-h-[90px]">
              <div className="absolute inset-0 bg-orange-500/20 blur-[40px] pointer-events-none animate-pulse z-0"></div>
              <div className="relative z-10 p-2 md:p-3 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl md:rounded-2xl shadow-[0_0_20px_rgba(249,115,22,0.6)] animate-pulse shrink-0">
                <FileText size={24} className="md:w-8 md:h-8 text-white drop-shadow-md" />
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 z-10 flex justify-center items-center pointer-events-none w-full px-16 md:px-0">
                <div className="relative pointer-events-auto">
                  <div className="absolute -inset-1 bg-orange-500/30 blur-[10px] rounded-full animate-pulse z-0"></div>
                  <div className="relative z-10 bg-slate-800 border-[2px] md:border-[3px] border-solid border-orange-400 rounded-lg md:rounded-xl px-3 md:px-8 py-2 md:py-2.5 shadow-[0_0_10px_rgba(249,115,22,0.8)]">
                    <h3 className="text-white font-black tracking-widest text-[14px] sm:text-[15px] md:text-2xl drop-shadow-[0_0_5px_rgba(255,255,255,0.8)] whitespace-nowrap">
                      คู่มือการใช้งานเบื้องต้น
                    </h3>
                  </div>
                </div>
              </div>
              <button onClick={() => setShowManual(false)} className="relative z-20 bg-slate-900 border-2 border-solid border-orange-400 p-2 md:p-3 rounded-full transition-all shadow-[0_0_15px_rgba(249,115,22,0.6)] hover:shadow-[0_0_25px_rgba(225,29,72,1)] hover:-translate-y-1 active:scale-95 animate-pulse hover:bg-rose-600 hover:border-rose-400 group shrink-0">
                <X size={20} className="md:w-6 md:h-6 text-rose-500 group-hover:text-white drop-shadow-[0_0_8px_rgba(225,29,72,0.8)] stroke-[3px] transition-colors" />
              </button>
            </div>
            <div className="p-4 md:p-8 overflow-y-auto space-y-6 md:space-y-10 bg-slate-800 flex-1">
           {[
                { src: '/manual-1-1.png', alt: 'คู่มือเข้าโปรแกรมหน้าแรก' },
                { src: '/manual-2-1.png', alt: 'คู่มือผู้แจ้งซ่อม-1' },
                { src: '/manual-2-2.png', alt: 'คู่มือผู้แจ้งซ่อม-2' },
                { src: '/manual-3-1.png', alt: 'คู่มือเจ้าหน้าที่ ฝวด.-1' },
                { src: '/manual-3-2.png', alt: 'คู่มือเจ้าหน้าที่ ฝวด.-2' },
                { src: '/manual-iPhone.png', alt: 'คู่มือตั้งค่าโทรศัพท์-iOS' },
                { src: '/manual-Android.png', alt: 'คู่มือการตั้งค่าโทรศัพท์-Android' },
                { src: '/manual-PC.png', alt: 'คู่มือตั้งค่าการแสดงผลบน-PC' }
              ].map((manual, index) => (
                <div key={index} className="flex flex-col items-center gap-3 md:gap-4">
                  <img src={manual.src} alt={manual.alt} className="w-full rounded-xl md:rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.6)] border-[2px] border-solid border-slate-600 transition-opacity" />
                  <a href={manual.src} target="_blank" rel="noopener noreferrer" 
                     className="w-[85%] sm:w-[60%] md:w-[40%] bg-slate-900 border-[2px] border-solid border-orange-500/80 text-orange-400 p-3 md:p-4 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.4)] backdrop-blur-sm transition-all active:scale-95 flex items-center justify-center gap-2 z-20 hover:bg-orange-500 hover:text-white hover:border-white hover:scale-105 group">
                    <Maximize2 size={18} className="md:w-6 md:h-6 drop-shadow-md group-hover:scale-125 transition-transform" strokeWidth={2.5}/>
                    <span className="text-[13px] md:text-[16px] font-black tracking-widest uppercase drop-shadow-md">แตะเพื่อขยายซูมเต็มจอ</span>
                  </a>
                </div>
              ))}
              <div className="text-center pt-6 pb-4 mt-8 border-t-2 border-dashed border-orange-500/30">
                <p className="text-slate-200 font-black text-[12px] md:text-[24px] tracking-widest flex items-center justify-center gap-2 md:gap-3 drop-shadow-[0_0_10px_rgba(249,115,22,1)]">
                  <CheckCircle className="w-6 h-7 md:w-7 md:h-7 text-emerald-600 drop-shadow-[0_0_8px_rgba(16,185,129,1)]" /> 
                  สิ้นสุดคู่มือการใช้งาน
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showReporterLogin && (
        <ReporterLoginPopup onClose={() => setShowReporterLogin(false)} onLoginSuccess={onStart} />
      )}

      {showLogin && (
        <div className="fixed inset-0 z-[300] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={closeStaffLogin}>
          <div className="absolute w-[300px] h-[300px] bg-cyan-500/30 rounded-full blur-[100px] animate-pulse pointer-events-none z-0"></div>
          
          <div className="relative z-10 w-full max-w-sm bg-slate-900 border-[3px] border-solid border-cyan-500 rounded-[2.5rem] p-6 shadow-[0_0_50px_rgba(34,211,238,0.5)] flex flex-col items-center gap-4 transform transition-all" onClick={e => e.stopPropagation()}>
            
            <button onClick={closeStaffLogin} className="absolute top-5 right-5 text-slate-400 hover:text-rose-400 transition-colors z-20">
              <X size={28} />
            </button>

            <div className="relative mt-2">
              <div className="absolute inset-0 bg-cyan-500 blur-[20px] opacity-40 rounded-full"></div>
              <div className="relative w-16 h-16 bg-slate-950 border-[2px] border-cyan-400 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.6)]">
                <Phone className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              </div>
            </div>
            
            <h2 className="text-xl font-black text-white tracking-wide text-center">
              {staffStep === 1 ? 'เบอร์โทรศัพท์เจ้าหน้าที่' : (isNewStaff ? (isConfirmingStaffPin ? '✅ ยืนยันรหัส PIN อีกครั้ง' : '✨ ตั้งรหัส PIN 6 หลัก') : '🔒 ใส่รหัส PIN เข้าสู่ระบบ')}
            </h2>

            {loginError && <p className="text-sm font-bold text-center p-2 rounded-lg w-full border animate-in shake bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.2)]">{loginError}</p>}

            <div className="relative w-full mb-2">
              <div className="w-full bg-slate-950 border-[2px] border-cyan-400 rounded-2xl h-16 flex items-center justify-center text-3xl font-black text-cyan-300 tracking-[0.1em] shadow-[0_0_15px_rgba(34,211,238,0.4),inset_0_0_10px_rgba(34,211,238,0.2)] transition-all">
              {staffStep === 1 ? formatPhone(staffPhone) : formatPinDisplay(isConfirmingStaffPin ? confirmStaffPin : staffPin)}
              </div>
              {staffStep === 2 && (
                <button type="button" onClick={() => setShowStaffPin(!showStaffPin)} className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-600 hover:text-cyan-300 transition-colors drop-shadow-md">
                  {showStaffPin ? <EyeOff size={24} /> : <Eye size={24} />}
                </button>
              )}
            </div>

            {staffStep === 2 && (
              <div className="w-full flex justify-between items-center px-1 -mt-1 mb-1">
                {attemptCount >= 3 && (
                  <button type="button" onClick={async () => {
                    if (!staffEmail) return;
                    setIsLoggingIn(true);
                    try {
                      await sendPasswordResetEmail(auth, staffEmail);
                      setLoginError('ระบบได้ส่งลิงก์รีเซ็ต PIN ไปที่อีเมลหน่วยงานของท่านแล้วค่ะ');
                    } catch (err) {
                      setLoginError('ไม่สามารถส่งอีเมลรีเซ็ตได้');
                    } finally {
                      setIsLoggingIn(false);
                    }
                  }} disabled={isLoggingIn} className="text-xs font-bold text-rose-400 hover:text-rose-300 underline transition-colors animate-pulse z-10">
                    ลืมรหัส PIN ใช่หรือไม่?
                  </button>
                )}
                <button type="button" onClick={() => { setStaffStep(1); setStaffPhone(''); setStaffPin(''); setLoginError(''); setAttemptCount(0); }} className="text-xs font-bold text-slate-400 hover:text-cyan-400 underline transition-colors ml-auto z-10">ไม่ใช่คุณใช่ไหม?</button>
              </div>
            )}

            <div className={`grid grid-cols-3 gap-3 w-full px-1 transition-all duration-500 ${isLoggingIn ? 'opacity-0 scale-90 pointer-events-none absolute' : 'opacity-100 scale-100 relative'}`}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button key={num} type="button" onClick={() => handleStaffNumpad(num.toString())} className="h-16 flex items-center justify-center bg-slate-900/60 backdrop-blur-md border border-slate-600/50 rounded-2xl text-3xl font-black text-slate-200 transition-all duration-300 hover:bg-cyan-500/10 hover:border-cyan-400 hover:text-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.6),inset_0_0_10px_rgba(34,211,238,0.2)] active:scale-90 active:bg-cyan-500 active:text-white">
                  {num}
                </button>
              ))}
              <button type="button" onClick={handleStaffClear} className="h-16 flex items-center justify-center bg-slate-900/60 backdrop-blur-md border border-slate-600/50 rounded-2xl text-3xl font-black text-amber-500 transition-all duration-300 hover:bg-amber-500/10 hover:border-amber-400 hover:text-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.6),inset_0_0_10px_rgba(245,158,11,0.2)] active:scale-90 active:bg-amber-500 active:text-white">
                C
              </button>
              <button type="button" onClick={() => handleStaffNumpad('0')} className="h-16 flex items-center justify-center bg-slate-900/60 backdrop-blur-md border border-slate-600/50 rounded-2xl text-3xl font-black text-slate-200 transition-all duration-300 hover:bg-cyan-500/10 hover:border-cyan-400 hover:text-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.6),inset_0_0_10px_rgba(34,211,238,0.2)] active:scale-90 active:bg-cyan-500 active:text-white">
                0
              </button>
              <button type="button" onClick={handleStaffDelete} className="h-16 flex items-center justify-center bg-slate-900/60 backdrop-blur-md border border-slate-600/50 rounded-2xl transition-all duration-300 hover:bg-rose-500/10 hover:border-rose-500 hover:text-rose-400 hover:shadow-[0_0_20px_rgba(225,29,72,0.6),inset_0_0_10px_rgba(225,29,72,0.2)] active:scale-90 active:bg-rose-600 active:text-white text-rose-500">
                <X size={32} className="drop-shadow-md stroke-[3px]" />
              </button>

              {staffStep === 1 && (
                <button
                  type="button"
                  onClick={() => {
                    if (staffPhone.length === 10) {
                      if (typeof handleStaffPhoneNext === 'function') {
                        handleStaffPhoneNext();
                      } else {
                        console.log("ตรวจสอบสิทธิ์เบอร์:", staffPhone);
                      }
                    }
                  }}
                  disabled={staffPhone.length !== 10}
                  className={`col-span-3 mt-2 py-3 md:py-4 rounded-xl font-black text-[16px] md:text-[18px] tracking-widest transition-all duration-300 ${staffPhone.length === 10 ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.6)] hover:scale-[1.02]' : 'bg-slate-800 text-slate-500 cursor-not-allowed border-[2px] border-slate-700'}`}
                >
                  ตรวจสอบสิทธิ์ (ฝวด.)
                </button>
              )}
            </div>

            {isLoggingIn && (
              <div className="w-full h-[256px] flex flex-col items-center justify-center animate-in zoom-in duration-300">
                <div className="relative w-20 h-20 mb-5">
                  <div className="absolute inset-0 border-[4px] border-cyan-500/20 rounded-full"></div>
                  <div className="absolute inset-0 border-[4px] border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                  <ShieldCheck className="absolute inset-0 m-auto text-cyan-400 animate-pulse w-8 h-8" />
                </div>
                <span className="text-cyan-400 font-black tracking-widest text-[18px] drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-pulse">
                  ตรวจสอบสิทธิ์...
                </span>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}



/* 🌟 ฟันธง: นำเข้าฟอนต์ Sarabun และจัดระเบียบความเพรียวบางให้อ่านง่ายที่สุด */
const SarabunFontEmbed = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@200;300;400;500;600;700;800&display=swap');
    
    /* บังคับใช้ฟอนต์ Sarabun กับทุกตัวอักษรในแอป */
    body, html, *, h1, h2, h3, p, button, input {
      font-family: 'Sarabun', sans-serif !important;
      letter-spacing: 0.02em !important; 
      line-height: 1.5 !important;
    }
    
    /* ควบคุมความหนาของตัวอักษร Sarabun ไม่ให้บวมหนาเตอะ */
    .font-black { font-weight: 700 !important; }
    .font-bold { font-weight: 600 !important; }
    .font-normal { font-weight: 400 !important; }
    
    /* ยกเว้นสำหรับ รหัสงาน หรือตัวเลขเวลา */
    .font-mono {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
      letter-spacing: 0.02em !important;
      font-weight: 600 !important;
    }
  `}</style>
);

// ==========================================
// 🚀 ส่วนควบคุมระบบ (App Component)
// ==========================================
export default function App() {
  const [hasStarted, setHasStarted] = useState(() => sessionStorage.getItem('hasStarted') === 'true');
  const [role, setRole] = useState(() => sessionStorage.getItem('role') || 'reporter');

  const handleStart = (selectedRole) => {
    setRole(selectedRole);
    setHasStarted(true);
    sessionStorage.setItem('role', selectedRole);
    sessionStorage.setItem('hasStarted', 'true');
  };

  const handleGoHome = async () => {
    try { await signOut(auth); } catch (error) { console.error("SignOut Error", error); }
    setHasStarted(false);
    sessionStorage.removeItem('hasStarted');
    sessionStorage.removeItem('activeTab');
    sessionStorage.removeItem('role'); 
    // 🌟 ฟันธง: ปลดล็อก! ไม่ต้องลบ localStorage แล้ว เพื่อให้แอปจำเบอร์ไว้ตลอดกาลเหมือนแอปธนาคาร
  };

  return (
    <ErrorBoundary>
      {hasStarted ? (
        <MainApp onGoHome={handleGoHome} initialRole={role} />
      ) : (
        <LandingPage onStart={handleStart} />
      )}
    </ErrorBoundary>
  );
}