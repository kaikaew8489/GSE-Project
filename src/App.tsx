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
} from 'lucide-react';


// ==========================================
// 🔥 1. เชื่อมต่อ Firebase
// ==========================================
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  query,   // <--- เพิ่มตัวนี้
  orderBy, // <--- เพิ่มตัวนี้
  limit,    // <--- เพิ่มตัวนี้
  writeBatch, // 🌟 เพิ่มตัวนี้
  getDocs,    // 🌟 เพิ่มตัวนี้
  where,       // 🌟 เพิ่มตัวนี้
  getDoc      // 🌟 ฟันธง: พิมพ์เพิ่มคำนี้เข้าไปครับ!
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAwhkNwz3GB83Sr1hlCrm6t4N7CTbrBTlw',
  authDomain: 'gistda-gse-maintenance-3f83a.firebaseapp.com',
  projectId: 'gistda-gse-maintenance-3f83a',
  storageBucket: 'gistda-gse-maintenance-3f83a.firebasestorage.app',
  messagingSenderId: '234467850316',
  appId: '1:234467850316:web:9509ab93ccb150477e9ce9',
  measurementId: 'G-8RN127D4KD',
};

const appInstance =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(appInstance);
const db = getFirestore(appInstance);

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
  // 🌟 ฟันธง: เพิ่มตัวแปรควบคุม Pop-up สรุปเวร
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);

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
      daysArray.push({ dateStr, dayNum: i, dayOfWeek, isWeekend });
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
    const matchedTech = technicianList.find(t => t.name === techName);
    setRosterData(prev => ({
      ...prev,
      [dateStr]: {
        ...prev[dateStr],
        techName,
        techPhone: matchedTech ? matchedTech.phone : '-',
      }
    }));
  };

  const handleHolidayNameChange = (dateStr, name) => {
    setRosterData(prev => ({
      ...prev,
      [dateStr]: {
        ...prev[dateStr],
        holidayName: name,
        isHoliday: name.trim().length > 0 
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
      Object.keys(rosterData).forEach((dateKey) => {
        const docRef = doc(db, 'rosters', dateKey);
        if (rosterData[dateKey].techName || rosterData[dateKey].isHoliday) {
          batch.set(docRef, rosterData[dateKey], { merge: true });
        }
      });
      await batch.commit();
      setModalConfig({ isOpen: false, type: null });
      if(onClose) onClose(); 
    } catch (err) {
      alert("เกิดข้อผิดพลาด: " + err.message);
    }
    setLoading(false);
  };

  // 🌟 ฟันธง: อัปเกรดแสงปุ่มวันที่ให้สว่างวูบวาบ พุ่งทะลุจอ

  // 🌟 ฟันธง: ปุ่มวันที่
  // 🌟 ฟันธง 1: ฟังก์ชันคุมสี "ปุ่มวันที่" (เปลี่ยนบรรทัดสุดท้ายจาก เขียว เป็น ส้มเรืองแสง!)
  const getDateBadgeClass = (dayOfWeek, isHoliday, hasTech) => {
    if (!hasTech) return 'border-cyan-400 text-cyan-300 bg-cyan-900/40 shadow-[0_0_20px_rgba(6,182,212,0.8),inset_0_0_10px_rgba(6,182,212,0.4)] animate-pulse'; 
    if (isHoliday) return 'bg-orange-500/30 text-orange-300 border-orange-400 shadow-[0_0_25px_rgba(249,115,22,0.8),inset_0_0_15px_rgba(249,115,22,0.5)] font-black'; 
    if (dayOfWeek === 0) return 'bg-rose-500/30 text-rose-300 border-rose-400 shadow-[0_0_25px_rgba(225,29,72,0.8),inset_0_0_15px_rgba(225,29,72,0.5)] font-black'; 
    if (dayOfWeek === 6) return 'bg-blue-500/30 text-blue-300 border-blue-400 shadow-[0_0_25px_rgba(59,130,246,0.8),inset_0_0_15px_rgba(59,130,246,0.5)] font-black'; 
    
    // 👇 แก้ตรงนี้ครับ: วันธรรมดาทั่วไป เปลี่ยนเป็นส้มเรืองแสงทั้งหมด
    return 'bg-orange-500/30 text-orange-300 border-orange-400 shadow-[0_0_25px_rgba(249,115,22,0.8),inset_0_0_15px_rgba(249,115,22,0.5)] font-black'; 
  };

  // 🌟 ฟันธง 2: ฟังก์ชันคุมสี "กรอบชื่อช่าง" (เปลี่ยนบรรทัดสุดท้ายจาก เขียว เป็น ส้มเรืองแสง!)
  const getSelectColorClass = (dayOfWeek, isHoliday, hasTech) => {
    if (!hasTech) return 'text-cyan-300 border-cyan-500/50 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] bg-slate-900/80';
    if (isHoliday) return 'text-orange-400 border-orange-500/80 shadow-[0_0_15px_rgba(249,115,22,0.4)] bg-slate-900/80'; 
    if (dayOfWeek === 0) return 'text-rose-400 border-rose-500/80 shadow-[0_0_15px_rgba(225,29,72,0.4)] bg-slate-900/80'; 
    if (dayOfWeek === 6) return 'text-blue-400 border-blue-500/80 shadow-[0_0_15px_rgba(59,130,246,0.4)] bg-slate-900/80'; 
    
    // 👇 แก้ตรงนี้ครับ: วันธรรมดาทั่วไป เปลี่ยนเป็นส้มเรืองแสงทั้งหมด
    return 'text-orange-400 border-orange-500/80 shadow-[0_0_15px_rgba(249,115,22,0.4)] bg-slate-900/80'; 
  };

  const activeRecordsCount = Object.values(rosterData).filter(info => (info.techName && info.techName.trim() !== '') || info.isHoliday).length;

  return (

    <div className="min-h-[100dvh] bg-slate-950 text-slate-100 p-3 pb-24 md:p-8 font-sans flex flex-col justify-start md:justify-center relative overflow-y-auto overscroll-none">
      
      <div className="max-w-4xl mx-auto bg-slate-900/80 backdrop-blur-xl rounded-2xl md:rounded-[2rem] border-[3px] border-solid border-orange-500 p-4 pb-6 md:p-8 shadow-[0_0_90px_rgba(249,115,22,0.5)] relative w-full mt-10 md:mt-0 mb-10 md:mb-0 my-auto">
        
        <button
          onClick={() => { if(onClose) onClose(); }}
          className="absolute top-4 right-4 md:top-6 md:right-6 text-orange-500 hover:text-white animate-pulse bg-slate-900 hover:bg-orange-600 p-1.5 md:p-2 rounded-full transition-all duration-300 border border-orange-500 shadow-[0_0_25px_rgba(249,115,22,1)] hover:shadow-[0_0_35px_rgba(249,115,22,1)] z-20 cursor-pointer"
        >
          <XCircle className="w-6 h-6 md:w-8 md:h-8" />
        </button>

        {/* 🌟 ฟันธง 3: ลบเส้นแบ่ง border-b สีส้มออก ประหยัดพื้นที่! */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pr-10 md:pr-14 md:items-center mb-3">
          <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-start">
            <div className="bg-gradient-to-br from-orange-500 to-red-600 p-2.5 md:p-3 rounded-xl md:rounded-2xl shadow-[0_0_20px_rgba(249,115,22,0.4)]">
              <Calendar className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400 drop-shadow-sm">จัดตารางเวรปฏิบัติงาน SSC</h1>
              <p className="text-[11px] md:text-sm font-bold text-slate-400 mt-0.5 hidden md:block">ระบบจัดการและบันทึกเวรวันหยุดประจำ ฝวด.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:flex md:justify-center gap-2 w-full md:w-auto mt-2 md:mt-0">
            {/* 🌟 ฟันธง 2: ขยายฟอนต์เดือนให้เบิ้มๆ text-[16px] md:text-[18px] */}
            <button 
              onClick={() => setIsMonthModalOpen(true)}
              className="w-full md:w-44 bg-slate-800 text-orange-400 font-black px-3 py-3 md:py-3.5 rounded-xl border-[2px] border-solid border-orange-500/50 text-[16px] md:text-[18px] flex justify-between items-center hover:bg-slate-700 hover:border-orange-400 transition-all shadow-[0_0_15px_rgba(249,115,22,0.2)] outline-none"
            >
              <span className="flex-1 text-center">{monthsThai[selectedMonth - 1]}</span>
              <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            
            {/* 🌟 ฟันธง 2: ขยายฟอนต์ปีให้เบิ้มๆ text-[16px] md:text-[18px] */}
            <button 
              onClick={() => setIsYearModalOpen(true)}
              className="w-full md:w-36 bg-slate-800 text-orange-400 font-black px-3 py-3 md:py-3.5 rounded-xl border-[2px] border-solid border-orange-500/50 text-[16px] md:text-[18px] flex justify-between items-center hover:bg-slate-700 hover:border-orange-400 transition-all shadow-[0_0_15px_rgba(249,115,22,0.2)] outline-none"
            >
              <span className="flex-1 text-center">พ.ศ. {selectedYear + 543}</span>
              <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
            </button>
          </div>
        </div>

        {/* 🌟 ฟันธง 4: อัดแสง Flare สีฟ้าให้ขอบตาราง shadow-[0_0_40px_rgba(6,182,212,0.4)] */}
        <div className="overflow-hidden rounded-2xl border-[2px] border-solid border-cyan-400 mb-3 bg-slate-950/60 shadow-[0_0_40px_rgba(6,182,212,0.4)]">
          <div className="max-h-[55vh] overflow-y-auto overflow-x-hidden pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-cyan-900/20 hover:[&::-webkit-scrollbar-thumb]:bg-cyan-500/60 [&::-webkit-scrollbar-thumb]:rounded-full transition-all duration-300 overscroll-contain">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/90 backdrop-blur-md text-cyan-400 text-[14px] md:text-[16px] font-black uppercase tracking-wider sticky top-0 z-10 border-b-[2px] border-solid border-cyan-400 shadow-[0_5px_15px_rgba(6,182,212,0.2)]">
                  {/* 🌟 ฟันธง 2: ขยายฟอนต์หัวตารางให้ใหญ่ขึ้น */}
                  <th className="py-4 pl-2 pr-1 md:px-4 text-center w-12 md:w-20">วันที่</th>
                  <th className="py-4 px-2 md:px-4 w-[75%] md:w-[40%]">เจ้าหน้าที่อยู่เวร (SSC)</th>
                  <th className="hidden md:table-cell py-4 px-4">ระบุชื่อวันหยุดพิเศษ (ถ้ามี)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-solid divide-cyan-900/40 text-[14px]">
                {daysInMonth.map((d) => {
                  const currentInfo = rosterData[d.dateStr] || {};
                  const dateBadgeClass = getDateBadgeClass(d.dayOfWeek, currentInfo.isHoliday, currentInfo.techName);
                  const selectColorClass = getSelectColorClass(d.dayOfWeek, currentInfo.isHoliday, currentInfo.techName);

                  return (
                    <tr key={d.dateStr} className="transition-all duration-300 hover:bg-cyan-950/30">
                      <td className="py-3 pl-1 pr-1 md:px-4 text-center font-mono align-top md:align-middle pt-4 md:pt-3 w-14 md:w-24">
                        <span className={`inline-flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-xl border-[2px] transition-all duration-300 text-[16px] md:text-[20px] font-black ${dateBadgeClass}`}>
                         {d.dayNum}
                        </span>
                      </td>
                      
                      <td className="py-3 pr-2 pl-2 md:px-4 flex flex-col md:table-cell gap-2">
                        <button
                          onClick={() => setSelectingTechForDate(d.dateStr)}
                          className={`w-full font-bold px-4 py-3 md:py-3.5 rounded-xl border border-solid transition-all text-left flex justify-between items-center outline-none text-[13px] md:text-[15px] ${selectColorClass}`}
                        >
                          <span className="truncate">
                            {currentInfo.techName || '-- โปรดเลือกผู้ปฏิบัติงาน --'}
                          </span>
                          <svg className="w-4 h-4 ml-2 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>

                        {/* 🌟 ฟันธง 1: ซ่อนช่องวันหยุดในมือถือ ถ้าเป็นเสาร์-อาทิตย์ เพื่อประหยัดพื้นที่! */}
                        {!d.isWeekend && (
                          <input 
                            type="text"
                            value={currentInfo.holidayName || ''}
                            onChange={(e) => handleHolidayNameChange(d.dateStr, e.target.value)}
                            placeholder="ระบุวันหยุด (เช่น สงกรานต์)"
                            className="md:hidden w-full bg-slate-900/80 text-cyan-100 px-3 py-2.5 rounded-xl border border-solid border-cyan-500/30 focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.3)] text-[12px] font-bold outline-none transition-all mt-2"
                          />
                        )}
                      </td>

                      <td className="hidden md:table-cell py-3 px-4">
                        {/* 🌟 ฟันธง 1: ใน PC เปลี่ยนข้อความเป็น วันเสาร์(น้ำเงิน) วันอาทิตย์(แดง) */}
                        <input 
                          type="text"
                          disabled={d.isWeekend}
                          value={d.isWeekend ? (d.dayOfWeek === 0 ? 'วันอาทิตย์' : 'วันเสาร์') : currentInfo.holidayName || ''}
                          onChange={(e) => handleHolidayNameChange(d.dateStr, e.target.value)}
                          placeholder="เช่น วันสงกรานต์, มติ ครม."
                          className={`w-full px-4 py-3 rounded-xl border border-solid border-cyan-500/30 focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(6,182,212,0.3)] text-[14px] font-bold outline-none transition-all 
                            ${d.isWeekend 
                              ? (d.dayOfWeek === 0 ? 'text-rose-400/60 bg-rose-950/20 border-rose-500/20' : 'text-blue-400/60 bg-blue-950/20 border-blue-500/20') 
                              : 'text-cyan-100 bg-slate-900/80'
                            }`}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 🌟 ฟันธง 3: ลบเส้นแบ่ง border-t สีส้มออก ประหยัดพื้นที่! */}
       {/* 🌟 ฟันธง: อัปเกรดแผงปุ่มควบคุม เรียงแนวนอน 3 ปุ่ม จัดกึ่งกลางพอดีเป๊ะทั้ง Mobile และ PC */}
       <div className="flex flex-row justify-between items-stretch gap-2 md:gap-4 pt-3 mt-2 w-full">
          
          {/* 1. ปุ่มดูสรุปเวร (สีฟ้าเรืองแสง) */}
          <button
            onClick={() => setIsSummaryModalOpen(true)}
            className="flex-1 bg-slate-900 text-cyan-400 hover:text-white hover:bg-cyan-900/60 font-black py-2.5 md:py-3.5 rounded-xl border-[2px] border-solid border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] active:scale-95 transition-all duration-300 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2"
          >
            <ClipboardList className="w-5 h-5 md:w-5 md:h-5" />
            <span className="text-[11px] md:text-[14px] leading-none md:leading-normal">ดูสรุปเวร</span>
          </button>

          {/* 2. ปุ่มบันทึกตารางเวร (สีส้มเรืองแสง - ให้พื้นที่กว้างกว่าเพื่อนนิดนึง flex-[1.2]) */}
          <button
            onClick={() => setModalConfig({ isOpen: true, type: 'save' })}
            disabled={activeRecordsCount === 0} 
            className={`flex-[1.2] font-black py-2.5 md:py-3.5 rounded-xl transition-all duration-300 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2
              ${activeRecordsCount === 0 
                ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed grayscale' 
                : 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.5)] hover:shadow-[0_0_40px_rgba(249,115,22,0.8)] active:scale-95' 
              }`}
          >
            <Save className="w-5 h-5 md:w-5 md:h-5" />
            <span className="text-[11px] md:text-[15px] leading-none md:leading-normal text-center">
              {activeRecordsCount === 0 ? 'ไม่มีข้อมูล' : 'บันทึกเวร'}
            </span>
          </button>

          {/* 3. ปุ่มล้างข้อมูลทั้งหมด (สีแดงเรืองแสง) */}
          <button
            onClick={() => setModalConfig({ isOpen: true, type: 'clear' })}
            className="flex-1 bg-slate-900 text-rose-500 hover:text-white hover:bg-rose-600 font-black py-2.5 md:py-3.5 rounded-xl border-[2px] border-solid border-rose-500/50 shadow-[0_0_15px_rgba(225,29,72,0.3)] hover:shadow-[0_0_25px_rgba(225,29,72,0.6)] active:scale-95 transition-all duration-300 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2"
          >
            <RotateCcw className="w-5 h-5 md:w-5 md:h-5" />
            <span className="text-[11px] md:text-[14px] leading-none md:leading-normal">ล้างข้อมูล</span>
          </button>

        </div>
      </div>

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
                ? `ระบบจะทำการบันทึกตารางเวร (จำนวน ${activeRecordsCount} รายการ) ประจำเดือนนี้ และอัปเดตข้อมูลทั้งหมดทันที` 
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

      {/* 4. Pop-up Sci-Fi สำหรับเลือกชื่อช่าง */}
      {selectingTechForDate && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overscroll-none">
          
          {/* 🌟 ฟันธง 2: ขอบนอกสุดสีฟ้าสว่างวาบ อัดแสง Flare ทวีคูณ (Outer + Inner Glow) */}
          <div className="relative bg-slate-900 border-[3px] border-solid border-cyan-400 rounded-3xl w-full max-w-sm p-6 shadow-[0_0_60px_rgba(34,211,238,0.7),inset_0_0_20px_rgba(34,211,238,0.3)] flex flex-col max-h-[85vh]">
            
            {/* 🌟 ฟันธง 3: หัวข้อและกากบาท ปล่อยโล่ง ไม่มีกรอบล้อม เน้นเส้นใต้บางๆ เรืองแสง ดู Sci-Fi สุดๆ */}
            <div className="flex justify-between items-center mb-5 border-b-[2px] border-cyan-500/40 pb-4">
              <h3 className="text-[16px] md:text-lg font-black text-cyan-300 flex items-center gap-2 drop-shadow-[0_0_15px_rgba(34,211,238,0.9)]">
                <User className="w-5 h-5" /> 
                เลือกผู้ปฏิบัติงาน
              </h3>
              
              <button 
                onClick={() => setSelectingTechForDate(null)} 
                className="text-rose-500 hover:text-white animate-pulse bg-slate-900 hover:bg-rose-600 p-1.5 md:p-2 rounded-full transition-all duration-300 border-[2px] border-rose-500 shadow-[0_0_20px_rgba(225,29,72,0.8)] hover:shadow-[0_0_35px_rgba(225,29,72,1)] cursor-pointer"
              >
                <XCircle className="w-6 h-6 md:w-7 md:h-7" />
              </button>
            </div>

            <div className="overflow-y-auto pr-1 space-y-3 pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pt-1">
              
              {/* 🌟 ฟันธง 1: เอาคำสั่งเด้งขึ้น (-translate-y-1) ออกไปแล้ว ปุ่มจะไม่กระโดดบังจอ! */}
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
                        /* 🌟 ฟันธง 1: เอาคำสั่งเด้งขึ้น (-translate-y-1) ออกเช่นกัน ให้อยู่กับที่แต่แสงระเบิดออก */
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

     {/* ========================================================= */}
      {/* 🌟 5. Pop-up Sci-Fi สรุปตารางเวร (ตีมส้ม + สีตามวันเป๊ะๆ 1,000,000%) */}
      {/* ========================================================= */}
      {isSummaryModalOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overscroll-none">
          
          <div className="relative bg-slate-900 border-[3px] border-orange-500 rounded-3xl w-full max-w-md p-6 shadow-[0_0_80px_rgba(249,115,22,0.5),inset_0_0_20px_rgba(249,115,22,0.2)] flex flex-col max-h-[85vh]">
            
            {/* หัวข้อ */}
            <div className="flex justify-between items-center mb-5 border-b-[2px] border-orange-500/40 pb-4">
              <h3 className="text-[16px] md:text-lg font-black text-orange-400 flex items-center gap-2 drop-shadow-[0_0_15px_rgba(249,115,22,0.9)]">
                <ClipboardList className="w-5 h-5 md:w-6 md:h-6" /> 
                สรุปเวร: {monthsThai[selectedMonth - 1]} พ.ศ. {selectedYear + 543}
              </h3>
              <button 
                onClick={() => setIsSummaryModalOpen(false)} 
                className="text-rose-500 hover:text-white animate-pulse bg-slate-900 hover:bg-rose-600 p-1.5 md:p-2 rounded-full transition-all duration-300 border-[2px] border-rose-500 shadow-[0_0_20px_rgba(225,29,72,0.8)] hover:shadow-[0_0_35px_rgba(225,29,72,1)] cursor-pointer"
              >
                <XCircle className="w-6 h-6 md:w-7 md:h-7" />
              </button>
            </div>

            {/* รายชื่อ (แก้ไขพื้นที่ให้แสงไม่แหว่งแล้ว) */}
            <div className="overflow-y-auto px-4 -mx-4 space-y-4 pb-4 pt-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {(() => {
                const activeRosters = Object.values(rosterData)
                  .filter(info => info.techName && info.techName.trim() !== '')
                  .sort((a, b) => a.dateStr.localeCompare(b.dateStr));

                if (activeRosters.length === 0) {
                  return (
                    <div className="text-center py-10 bg-rose-950/20 border-[2px] border-rose-500/50 rounded-2xl shadow-[0_0_30px_rgba(225,29,72,0.3)] animate-pulse mt-4">
                      <AlertTriangle className="w-14 h-14 text-rose-500 mx-auto mb-3 drop-shadow-[0_0_15px_rgba(225,29,72,0.8)]" />
                      <h4 className="text-rose-400 font-black text-[18px]">ยังไม่มีข้อมูลการจัดเวรในเดือนนี้</h4>
                      <p className="text-rose-500/80 font-bold text-[13px] mt-2">โปรดเลือกผู้ปฏิบัติงานในตารางเพื่อจัดเวร</p>
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
                    rowClass = "border-blue-500/80 shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.6)]";
                    nameColor = "text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]";
                    subText = "วันเสาร์";
                    subTextColor = "text-blue-400 drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]";
                    dotColor = "bg-blue-500";
                  } else { 
                    rowClass = "border-orange-500/80 shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:shadow-[0_0_25px_rgba(249,115,22,0.6)]";
                    nameColor = "text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]";
                    subText = ""; 
                  }

                  return (
                    <div key={idx} className={`flex items-center justify-between p-4 rounded-xl border-[2px] bg-slate-900/80 transition-all ${rowClass}`}>
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

          </div>
        </div>
      )}

    </div>
  );
}
// ==========================================
// 🌟 ฟันธง: สิ้นสุดโค้ดส่วนหน้าจอจัดตารางเวร SSC 
// (โค้ดของท่านหัวหน้าเช่น export default function App() หรือ MainApp จะอยู่ต่อจากบรรทัดนี้ไปครับ)
// ==========================================

// ==========================================
// 🌟 2. ข้อมูลระบบ (System Data)
// ==========================================
const employeeList = [
  { name: 'นายนวัตกรณ์ ไก่แก้ว', position: 'หัวหน้าฝ่าย', department: 'ฝวด.' },
  {
    name: 'นายชุติพงษ์ ลาวงศ์เกิด',
    position: 'นักเทคโนโลยีอวกาศ',
    department: 'ฝวด.',
  },
  {
    name: 'นายธนกาญจน์ ไตรปิฎก',
    position: 'นักเทคโนโลยีอวกาศ',
    department: 'ฝวด.',
  },
  { name: 'นายนรัตว์ ศรีสวัสดิ์พงษ์', position: 'วิศวกร', department: 'ฝวด.' },
  { name: 'น.ส.จินวะรา สุรัตนกุล', position: 'วิศวกร', department: 'ฝวด.' },
  { name: 'นายประมินทร์ พิชิตการค้า', position: 'วิศวกร', department: 'ฝวด.' },
  {
    name: 'นายทศพล ชินนิวัฒน์',
    position: 'วิศวกรชำนาญการ',
    department: 'ฝวด.',
  },
  {
    name: 'นายวิชญ์ภาส ดรบัณฑิต',
    position: 'นักเทคโนโลยีอวกาศ',
    department: 'ฝปด.',
  },
  { name: 'นายบุญชุบ บุ้งทอง', position: 'ผู้อำนวยการ', department: 'สปท.' },
  {
    name: 'ว่าที่ ร.ต. วรธันย์ วิชาคุณ',
    position: 'หัวหน้าฝ่าย',
    department: 'ฝปด.',
  },
  { name: 'นายเสกสรร จัตุรัส', position: 'หัวหน้าฝ่าย', department: 'ฝปค.' },
  {
    name: 'นายอัฐราวุฒิ เดชผล',
    position: 'วิศวกรชำนาญการ',
    department: 'ฝปค.',
  },
  {
    name: 'น.ส.จารุณี ขุนจันทร์',
    position: 'วิศวกรชำนาญการ',
    department: 'ฝปค.',
  },
  { name: 'น.ส.พันทิพย์ภา บุญสมพงษ์', position: 'วิศวกร', department: 'ฝปค.' },
  {
    name: 'นายอาทิตย์ ศิริขันธ์',
    position: 'นักเทคโนโลยีอวกาศ',
    department: 'ฝปค.',
  },
  { name: 'น.ส.บุษยมาศ เพชรทอง', position: 'หัวหน้าฝ่าย', department: 'ฝบท.' },
  { name: 'นายจิโรจ ทองตา', position: 'วิศวกร', department: 'ฝบท.' },
  { name: 'นายศรัณย์ นันทะชมภู', position: 'วิศวกร', department: 'ฝบท.' },
  { name: 'นายปิยภัทร เขียวเจริญ', position: 'วิศวกร', department: 'ฝบท.' },
  {
    name: 'นายประสิทธิ์ มากสิน',
    position: 'นักเทคโนโลยีอวกาศชำนาญการ',
    department: 'ฝปด.',
  },
  {
    name: 'น.ส.เข็มทราย ปีกสันเทียะ',
    position: 'นักเทคโนโลยีอวกาศ',
    department: 'ฝปด.',
  },
  {
    name: 'น.ส.กนกวรรณ กัณหะกิติ',
    position: 'นักเทคโนโลยีอวกาศ',
    department: 'ฝปด.',
  },
  {
    name: 'น.ส.ศิรินทรา อินทร์ถนอม',
    position: 'นักเทคโนโลยีอวกาศ',
    department: 'ฝปด.',
  },
  {
    name: 'นายประโยชน์ ปวงจักร์ทา',
    position: 'นักเทคโนโลยีอวกาศชำนาญการ',
    department: 'ฝปด.',
  },
  {
    name: 'น.ส.ภาวรินทร์ คูหา',
    position: 'นักเทคโนโลยีอวกาศ',
    department: 'ฝปด.',
  },
  { name: 'นายประกาศิต อุดมธนะธีระ', position: 'วิศวกร', department: 'สปท.' },
  { name: 'นายโกวิทย์ พุ่มกิ่ง', position: 'วิศวกร', department: 'สปท.' },
  {
    name: 'น.ส.รพิรัตน์ ฤทธิ์รณศักดิ์',
    position: 'วิศวกร',
    department: 'ฝปค.',
  },
  {
    name: 'น.ส.อโณทัย นิ่มน้อย',
    position: 'นักพัฒนานวัตกรรม',
    department: 'สปท.',
  },
  {
    name: 'น.ส.ฐิตาภรณ์ ทองคำภา',
    position: 'เจ้าหน้าที่พัฒนาธุรกิจ',
    department: 'ฝวด.',
  },
  { name: 'นายประวุฒิ ดิษาภิรมย์', position: 'วิศวกร', department: 'ฝปด.' },
];

// 🌟 ฟันธง: ฐานข้อมูลสมองกล จับคู่อุปกรณ์ -> ช่างรับผิดชอบ
const techMapping = {
  "ภารกิจด้านจานสายอากาศ": { name: "นายทศพล ชินนิวัฒน์", phone: "08-1513-7854" },
  "ภารกิจด้านคอมพิวเตอร์แม่ข่ายและไอที": { name: "นายธนกาญจน์ ไตรปิฎก", phone: "06-2463-5544" },
  "ภารกิจด้านโครงสร้างพื้นฐานไฟฟ้า": { name: "นายประมินทร์ พิชิตการค้า", phone: "08-1135-1599" },
  "ภารกิจด้านการให้บริการโครงการ SSC": { name: "นายนรัตว์ ศรีสวัสดิ์พงษ์", phone: "08-6361-4399" },
  // ... เพิ่มรายการอื่นๆ ตามฐานข้อมูลที่ท่านหัวหน้ามีได้เลยครับ
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
  'ภารกิจด้านคอมพิวเตอร์แม่ข่ายและไอที': [
    'THEOS-DPF',
    'THEOS-STORNEXT',
    'THEOS-CGS',
    'THEOS-FDS',
    'THEOS-MPC',
    'THEOS2-IGS',
    'THEOS2-MGS',
    'THEOS2-CGS',
    'THEOS2-FDS',
    'THEOS2-GIPS',
    'RS2-AMS/PGS/CUDOS',
    'RS2-DAS/NSART/FTD',
    'JPSS/MODIS',
    'Cosmo-SkyMED'
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
    "Antenna-7.3m System",
    "Antenna-S3EE System (SKP)",
    "QZSS System"
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
  { name: 'นายวิชญ์ภาส ดรบัณฑิต', phone: '09-1415-5194', photo: '/top.webp' },
  { name: 'น.ส.จินวะรา สุรัตนกุล', phone: '08-2480-2280', photo: '/jun.webp' },
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
    <div className="flex items-center justify-center gap-3 sm:gap-5 md:gap-8 text-[15px] sm:text-[17px] md:text-[22px] whitespace-nowrap font-sans py-1 px-2">
      
      {/* 📅 โซนวันที่ (ฟันธง: เปลี่ยนสีตามวัน + มีแสงเฟลอร์เบาๆ ด้านหลัง) */}
      <div className="relative flex items-center gap-2 md:gap-3 shrink-0">
        <div className={`absolute inset-0 ${flareColors[dayOfWeek]} blur-[15px] rounded-full pointer-events-none`}></div>
        <Calendar className={`w-[22px] h-[22px] md:w-[28px] md:h-[28px] relative z-10 ${dayColors[dayOfWeek]}`} />
        <span className={`font-black tracking-widest relative z-10 ${dayColors[dayOfWeek]}`}>
          {d.getDate()} {months[d.getMonth()]} {d.getFullYear() + 543}
        </span>
      </div>

      {/* ⏐ เส้นแบ่งคั่นกลาง */}
      <div className="w-[2px] h-6 md:h-8 bg-slate-500/50 rounded-full shrink-0"></div>

      {/* ⏱️ โซนเวลา (ฟันธง: ล็อกสีส้มไว้ตามสั่ง ไม่ให้เปลี่ยนตามวัน พร้อมเฟลอร์สีส้ม) */}
      <div className="relative flex items-center gap-2 md:gap-3 shrink-0">
         <div className="absolute inset-0 bg-orange-500/10 blur-[15px] rounded-full pointer-events-none"></div>
        <Clock className="w-[22px] h-[22px] md:w-[28px] md:h-[28px] text-orange-500 animate-pulse relative z-10 drop-shadow-[0_0_5px_rgba(249,115,22,0.8)]" />
        <span className="font-mono font-black text-orange-300 tracking-[0.1em] drop-shadow-[0_0_5px_rgba(249,115,22,0.6)] relative z-10">
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


// 🌟 ฟันธง: Component ใหม่ Sci-Fi Modal Dropdown (อัปเกรด ใช้ Portal วาร์ปทะลุกรอบ 1,000,000% โดยไม่กระทบสีและขนาดเดิม)
// ==========================================
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

// 👇 🌟🌟 ฟันธง: บรรทัดนี้ของท่านหายไปครับ! เติมกลับเข้าไปด่วน ไม่งั้นแอปพังทั้งระบบ!
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
    () => sessionStorage.getItem('activeTab') || (initialRole === 'technician' ? 'dashboard' : 'report')
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
  const [tickets, setTickets] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [authErrorMsg, setAuthErrorMsg] = useState('');

  // 🌟 ตัวควบคุมเปิด/ปิดหน้าจอ Admin Roster
  const [showAdminRoster, setShowAdminRoster] = useState(false);

  // --- Auth Setup ---
  useEffect(() => {
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (error) {
        console.warn('Auth error, using bypass user...', error);
        setUser({ uid: 'public-bypass-user' });
      }
    };
    initAuth();

    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      if (u) setUser(u);
      else setUser({ uid: 'public-bypass-user' });
    });

    return () => unsubscribeAuth();
  }, []);

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
// ...
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

  const handleResetForm = () => {
    setFormData({
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
      equipmentCategory: '',
      images: [],
      isSsc: false,
    });
    setFormErrors({});
  };

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
    setConfirmSubmitModal(false);
    if (!user) return;
    setIsSubmitting(true);
    const newId = getNextReqId(tickets);

    // 🌟 1. ดึงช่างรับผิดชอบหลัก (จากกลุ่มภารกิจ)
    const selectedCategory = formData.equipmentCategory; 
    const autoAssignedTech = techMapping[selectedCategory];

    // 🌟 2. สมองกลดึงเวร SSC อัตโนมัติ (ตรวจสอบแบบเซฟสุดๆ ป้องกันแอปพัง)
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
      console.error("ดึงข้อมูลเวร SSC ไม่สำเร็จ:", error);
    }

    // 🌟 3. ประกอบร่างตั๋วแจ้งซ่อม
    const newTicket = {
      id: newId,
      ...formData,
      techName: autoAssignedTech ? autoAssignedTech.name : 'รอเจ้าหน้าที่รับงาน',
      techPhone: autoAssignedTech ? autoAssignedTech.phone : '-',
      sscTechName: currentSscTechName,
      sscTechPhone: currentSscTechPhone,
      status: 'pending',
      isOutOfHours: isHolidaySSC, // ใช้ค่าที่สมองกลเช็คมา
      date: new Date().toISOString(),
    };

    try {
      await addDoc(collection(db, 'tickets'), newTicket);
      setShowSuccess(true);

      // 🌟 โค้ดยิงแจ้งเตือนเข้า LINE ผ่าน GAS
      const gasUrl = "https://script.google.com/macros/s/AKfycbxBoB_e637WkWMeSuX9NP3BSKcSiE8J3dSXmlzNV9aeiq6DRUvn81bSp6w-B0nzCVA5/exec"; 
      let primaryTech = "ทีมช่าง ฝวด."; 
      
      if (formData.equipmentCategory === 'ภารกิจด้านจานสายอากาศ') {
        primaryTech = "คุณทศพล/นรัตว์"; 
      } else if (formData.equipmentCategory === 'ภารกิจด้านคอมพิวเตอร์แม่ข่ายและไอที') {
        primaryTech = "คุณธนกาญจน์/คุณชุติพงษ์"; 
      } else if (formData.equipmentCategory === 'ภารกิจด้านโครงสร้างพื้นฐานไฟฟ้า') {
        primaryTech = "คุณประมินทร์/คุณนรัตว์"; 
      } else if (formData.equipmentCategory === 'ภารกิจด้านการให้บริการโครงการ SSC') {
        primaryTech = "คุณนรัตว์/คุณทศพล"; 
      }

      try {
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
        });
      } catch (err) {
        console.error("Line Notify Error:", err);
      }

      setTimeout(() => {
        setShowSuccess(false);
        setFilterStatus('all');
        setActiveTab('tracking');
      }, 5000);
      
    } catch (e) {
      console.error("Submit Error:", e);
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

      return {
        total: filteredByTime.length,
        pending: filteredByTime.filter((t) => t.status === 'pending').length,
        fixing: filteredByTime.filter((t) => ['acknowledged', 'in_progress', 'on_hold'].includes(t.status)).length,
        done: filteredByTime.filter((t) => ['completed', 'verified'].includes(t.status)).length,
        cancelled: filteredByTime.filter((t) => t.status === 'cancelled').length,
        // 🌟 ฟันธง: เพิ่มสมองกลคำนวณคะแนนดาวเฉลี่ย (CSAT)
        ratedCount: filteredByTime.filter((t) => t.rating > 0).length,
        avgRating: filteredByTime.filter((t) => t.rating > 0).length > 0 
          ? (filteredByTime.filter((t) => t.rating > 0).reduce((sum, t) => sum + t.rating, 0) / filteredByTime.filter((t) => t.rating > 0).length).toFixed(1) 
          : 0,
      };
    } catch (err) {
      console.error("Stats Error:", err);
      return { total: 0, pending: 0, fixing: 0, done: 0, cancelled: 0 };
    }
  }, [tickets, dashTimeframe, customMonth, customDate]); // 🌟 อัปเดตทันทีที่เลือกปฏิทินและวัน


  
  // 🌟 ลิสต์รายการงานสำหรับหน้า "ติดตามสถานะ/จัดการงาน" (แยกสมองอิสระ ไม่เกี่ยวกับเวลาในแผงควบคุม)
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      // 🌟 1. กรองวันที่เฉพาะหน้า "ติดตามสถานะ"
      let timeMatch = true;
      if (t.date) {
        const tDate = new Date(t.date);
        if (trackTimeframe === 'custom_month' && trackMonth) {
          const [year, month] = trackMonth.split('-');
          timeMatch = tDate.getFullYear() === parseInt(year) && (tDate.getMonth() + 1) === parseInt(month);
        } else if (trackTimeframe === 'custom_date' && trackDate) {
          const selectedD = new Date(trackDate);
          timeMatch = tDate.getFullYear() === selectedD.getFullYear() && 
                      tDate.getMonth() === selectedD.getMonth() && 
                      tDate.getDate() === selectedD.getDate();
        } else if (trackTimeframe === 'week') {
          // รองรับการกดมาจาก "สัปดาห์นี้" ในแผงควบคุม
          const now = new Date();
          const firstDayOfWeek = new Date(now);
          const currentDay = now.getDay();
          const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;
          firstDayOfWeek.setDate(now.getDate() + diffToMonday);
          firstDayOfWeek.setHours(0, 0, 0, 0);
          timeMatch = tDate >= firstDayOfWeek;
        } else if (trackTimeframe === 'all') {
          timeMatch = true;
        }
      }
      if (!timeMatch) return false; // 🚫 ถ้าวันที่ไม่ตรง เตะออกเลย!

      // 🌟 2. กรองตาม "คำค้นหา (Search)"
      const searchStr = searchTerm.toLowerCase();
      const matchSearch =
        !searchTerm ||
        String(t.equipment).toLowerCase().includes(searchStr) ||
        String(t.id).toLowerCase().includes(searchStr) ||
        String(t.reporter).toLowerCase().includes(searchStr) ||
        (t.techName && String(t.techName).toLowerCase().includes(searchStr));
      if (!matchSearch) return false;
      
      // 🌟 3. กรองตาม "สถานะ (Tab)"
      if (filterStatus === 'all') return true;
      if (filterStatus === 'fixing') return ['acknowledged', 'in_progress', 'on_hold'].includes(t.status);
      if (filterStatus === 'completed') return t.status === 'verified';
      if (filterStatus === 'on_hold') return t.status === 'on_hold';
      if (filterStatus === 'verify') return t.status === 'completed';
        
      return t.status === filterStatus;
      
    }); // 🌟🌟🌟 ฟันธง: บรรทัดนี้แหละครับตัวการ! ต้องเป็น }); เพื่อปิดการ filter นะครับ!
  }, [tickets, searchTerm, filterStatus, trackTimeframe, trackMonth, trackDate]);


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
              className={`flex-1 min-w-[75px] shrink-0 text-[13px] md:text-[16px] font-black py-2.5 md:py-3.5 rounded-xl transition-all duration-300 snap-center whitespace-nowrap ${
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
               className={`w-full relative z-10 text-[13px] md:text-[16px] font-black py-2.5 md:py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 whitespace-nowrap ${
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
              className={`w-full relative z-10 text-[13px] md:text-[16px] font-black py-2.5 md:py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 whitespace-nowrap ${
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
            <div className="text-[13px] md:text-[18px] font-bold text-slate-300 uppercase mt-2 tracking-widest">
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
            <div className="text-[13px] md:text-[18px] font-bold text-emerald-500 uppercase mt-2 tracking-widest">
              เสร็จสิ้น
            </div>
          </div> {/* <--- อันนี้คือบรรทัดปิดของกล่องเสร็จสิ้นเดิม */}
          
          {/* 🌟 ฟันธง: ให้พิมพ์เติม </div> ตัวนี้เข้าไป 1 ตัวครับ! (นี่คือตัวที่เผลอโดนทับหายไป) */}
        </div>
        
{/* 🌟 ฟันธง: กล่องสรุปคะแนนประเมิน SLA (CSAT KPI) จะโชว์ก็ต่อเมื่อมีงานที่ซ่อมเสร็จแล้ว */}
{stats.done > 0 && (
          <div className="bg-slate-800/60 backdrop-blur-xl p-5 md:p-8 rounded-[1.5rem] border-[2px] border-solid border-yellow-500/80 shadow-[0_0_20px_rgba(250,204,21,0.2)] mt-4 md:mt-8 relative overflow-hidden flex items-center justify-between hover:shadow-[0_0_30px_rgba(250,204,21,0.4)] transition-all">
            
            {/* แสงเฟลอร์หลังกล่อง สีทองอร่าม */}
            <div className="absolute -left-10 -top-10 w-32 h-32 md:w-48 md:h-48 bg-yellow-500/30 blur-[30px] rounded-full pointer-events-none animate-pulse"></div>
            
            <div className="relative z-10 flex flex-col">
              <span className="text-[13px] md:text-[16px] font-black text-yellow-400 uppercase tracking-widest drop-shadow-sm mb-1 md:mb-2">
                คะแนนความพึงพอใจเฉลี่ย
              </span>
              <div className="flex items-center gap-3 md:gap-5 mt-1">
                <span className="text-5xl md:text-[5rem] font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] tracking-tighter">
                  {stats.avgRating > 0 ? stats.avgRating : '-'}
                </span>
                <div className="flex flex-col md:mt-2">
                  <div className="flex gap-0.5 md:gap-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className={`w-4 h-4 md:w-6 md:h-6 ${Math.round(stats.avgRating) >= s ? "drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" : ""}`} fill={Math.round(stats.avgRating) >= s ? "#facc15" : "none"} stroke={Math.round(stats.avgRating) >= s ? "#facc15" : "#475569"} strokeWidth={2} />
                    ))}
                  </div>
                  <span className="text-[11px] md:text-[14px] font-bold text-slate-400 mt-1 md:mt-2">
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
          <div className="bg-slate-800/60 backdrop-blur-xl p-5 md:p-8 rounded-[1rem] md:rounded-[1.5rem] border-2 border-solid border-orange-500/80 shadow-[0_0_20px_rgba(249,115,22,0.15)] mt-6 md:mt-8 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 md:w-56 md:h-56 bg-rose-500/10 rounded-full blur-2xl"></div>
            <h3 className="text-[15px] md:text-[20px] font-black text-white uppercase tracking-widest mb-4 md:mb-6 flex items-center gap-2 md:gap-3 relative z-10">
              <Flame className="w-5 h-5 md:w-7 md:h-7 text-white-500 animate-pulse" />{' '}
              งานที่รอเกินระยะเวลากำหนด
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5 relative z-10">
              
              {longestPendingTicket && (
                <div
                  onClick={() => {
                    setActiveTab('tracking');
                    setSearchTerm(longestPendingTicket.id);
                    setFilterStatus('all');
                    setTrackTimeframe('all'); // 🌟 ฟันธง: ล้างตัวกรองเวลาเป็น 'ทุกวัน' เสมอ!
                  }}
                  className="bg-white p-4 md:p-6 rounded-2xl border-2 border-solid border-orange-800 shadow-[0_4px_10px_rgba(225,29,72,0.1)] cursor-pointer hover:border-rose-500 hover:bg-rose-100 hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all active:scale-[0.98]"
                >
                  <div className="flex justify-between items-start mb-2 md:mb-4">
                    <div className="flex items-center gap-2 md:gap-3">
                      <span className="text-[12px] md:text-[14px] font-black text-rose-600 border-2 border-solid bg-rose-100 px-2 md:px-3 py-0.5 md:py-1 rounded-md md:rounded-lg border border-rose-200 shadow-sm">
                        รอนานที่สุด
                      </span>
                      <span className="text-[12px] md:text-[16px] font-mono font-bold text-slate-500">
                        {longestPendingTicket.id}
                      </span>
                    </div>
                    <span className="text-xs md:text-[15px] font-mono font-black text-rose-600 bg-rose-50 px-2 md:px-3 py-0.5 md:py-1 rounded-md md:rounded-lg border border-rose-100">
                    {formatMinutesToText(getMinutesDiff(longestPendingTicket.date, sysTime))}
                    </span>
                  </div>
                  <h4 className="text-sm md:text-[18px] font-black text-rose-800 truncate mb-1 md:mb-3">
                    {longestPendingTicket.equipment}
                  </h4>
                  {/* 🌟 ป้ายกำกับ ผู้แจ้งปัญหา */}
                  <div className="flex flex-col gap-0.5 md:gap-1 mt-2 md:mt-3">
                    <span className="text-[10px] md:text-[13px] font-bold text-slate-400 tracking-widest">ผู้แจ้งปัญหา:</span>
                    <p className="text-[12px] md:text-[16px] font-bold text-orange-600 flex items-center gap-1.5 md:gap-2">
                      <User className="w-3.5 h-3.5 md:w-5 md:h-5 text-orange-500" />
                      {longestPendingTicket.reporter}
                    </p>
                  </div>
                </div>
              )}
              
              {longestFixingTicket && (
                <div
                  onClick={() => {
                    setActiveTab('tracking');
                    setSearchTerm(longestFixingTicket.id);
                    setFilterStatus('all');
                    setTrackTimeframe('all'); // 🌟 ฟันธง: ล้างตัวกรองเวลาเป็น 'ดูทุกวัน' เสมอ!
                  }}
                  className="bg-white p-4 md:p-6 rounded-2xl border-2 border-solid border-orange-400 shadow-[0_4px_10px_rgba(249,115,22,0.1)] cursor-pointer hover:border-orange-500 hover:bg-orange-50 hover:shadow-md transition-all active:scale-[0.98]"
                >
                  <div className="flex justify-between items-start mb-2 md:mb-4">
                    <div className="flex items-center gap-2 md:gap-3">
                      <span className="text-[12px] md:text-[14px] font-black text-orange-600 bg-orange-100 px-2 md:px-3 py-0.5 md:py-1 rounded-md md:rounded-lg border border-orange-200 shadow-sm">
                        ซ่อมมาราธอน
                      </span>
                      <span className="text-[12px] md:text-[16px] font-mono font-bold text-slate-500">
                        {longestFixingTicket.id}
                      </span>
                    </div>
                    <span className="text-xs md:text-[15px] font-mono font-black text-orange-600 bg-orange-50 px-2 md:px-3 py-0.5 md:py-1 rounded-md md:rounded-lg border border-orange-100">
                    {formatMinutesToText(getMinutesDiff(longestFixingTicket.startedAt || longestFixingTicket.date, sysTime))}
                    </span>
                  </div>
                  <h4 className="text-sm md:text-[18px] font-black text-rose-800 truncate mb-1 md:mb-3">
                    {longestFixingTicket.equipment}
                  </h4>
                  {/* 🌟 ป้ายกำกับ ผู้รับผิดชอบ (ช่าง) */}
                  <div className="flex flex-col gap-0.5 md:gap-1 mt-2 md:mt-3">
                    <span className="text-[10px] md:text-[13px] font-bold text-slate-400 tracking-widest">ผู้รับผิดชอบ:</span>
                    <p className="text-[12px] md:text-[16px] font-bold text-emerald-600 flex items-center gap-1.5 md:gap-2">
                      <Wrench className="w-3.5 h-3.5 md:w-5 md:h-5 text-emerald-500" />
                      {longestFixingTicket.techName || 'กำลังดำเนินการ'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>



        )}
        {/* ================= จบกล่อง: งานที่รอเกินระยะเวลากำหนด ================= */}

        <div className="bg-slate-800/60 backdrop-blur-xl p-5 md:p-8 rounded-[1rem] md:rounded-[1.5rem] border-2 border-solid border-orange-500/80 shadow-[0_0_20px_rgba(249,115,22,0.15)] mt-6 md:mt-8 hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]">
          <h3 className="text-[15px] md:text-[20px] font-black text-white uppercase  tracking-widest mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
            <FileText className="w-5 h-5 md:w-7 md:h-7 text-white-800" />{' '}
            รายการล่าสุด
          </h3>
          <div className="space-y-3 md:space-y-5">
            {tickets.slice(0, 3).map((t) => (
              <div
                key={t.id}
                onClick={() => {
                  setActiveTab('tracking');
                  setSearchTerm(t.id);
                  setFilterStatus('all');
                  setTrackTimeframe('all'); // 🌟 ฟันธง: ล้างตัวกรองเวลาเป็น 'ทุกวัน' เสมอ!
                }}
                className={`flex flex-col p-4 md:p-6 bg-slate-50 rounded-2xl border-2 cursor-pointer active:scale-[0.98] transition-all shadow-sm ${
                  t.status === 'pending'
                    ? 'border-rose-400 hover:bg-rose-100 hover:border-rose-500'
                    : t.status === 'in_progress' || t.status === 'on_hold'
                    ? 'border-orange-400 hover:bg-orange-100 hover:border-orange-500'
                    : 'border-emerald-400 hover:bg-emerald-100 hover:border-emerald-500'
                } relative`}
              >
                <div className="flex items-center justify-between mb-2 md:mb-4">
                  <div className="flex items-center gap-2 md:gap-3">
                    <span className="text-[13px] md:text-[16px] font-mono font-bold text-slate-600 bg-white px-2 md:px-3 py-0.5 md:py-1 rounded-md md:rounded-lg border border-2 border-solid border-orange-400/70 tracking-widest shadow-sm">
                      {t.id}
                    </span>
                    {t.isOutOfHours && (
                      <span className="text-[13px] md:text-[15px] font-black text-rose-600 bg-rose-100 border border-solid border-rose-200 px-1.5 md:px-2 py-0.5 md:py-1 rounded-md md:rounded-lg animate-pulse">
                        SSC
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[13px] md:text-[15px] font-black uppercase px-2 md:px-3 py-0.5 md:py-1 rounded-md md:rounded-lg ${
                      t.status === 'pending'
                        ? 'bg-rose-100 text-rose-600'
                        : t.status === 'in_progress' || t.status === 'on_hold'
                        ? 'bg-orange-100 text-orange-600'
                        : t.status === 'verified'
                        ? 'bg-emerald-500 text-white shadow-sm' 
                        : 'bg-emerald-100 text-emerald-600'
                    }`}
                  >
                    {t.status === 'pending'
                      ? 'รอดำเนินการ'
                      : t.status === 'verified'
                      ? 'เสร็จสิ้นสมบูรณ์'
                      : t.status === 'completed'
                      ? 'รอผู้แจ้งยืนยัน'
                      : 'กำลังซ่อม'}
                  </span>
                </div>

                <div className="flex justify-between items-center pr-1 md:pr-2">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[13px] md:text-[18px] font-bold text-blue-800 truncate mb-4 md:mb-6">
                      {t.equipment}
                    </h4>
                    <p className="text-[13px] md:text-[16px] text-orange-500 truncate flex items-center gap-1.5 md:gap-2">
                      <AlertCircle className="w-[15px] h-[15px] md:w-5 md:h-5 text-orange-500 shrink-0" />{' '}
                      {t.description}
                    </p>

                    {/* 🌟 ฟันธง: แทรกชื่อเจ้าหน้าที่เวร SSC ตรงนี้! */}
                    {t.sscTechName && (
                      <div className="bg-purple-50 border border-purple-200 p-3 rounded-lg mt-3">
                        <p className="text-purple-700 font-bold text-[12px] flex items-center gap-2">
                          <AlertTriangle size={14} /> เจ้าหน้าที่เวร SSC:
                        </p>
                        <p className="text-purple-900 font-bold text-[14px] mt-0.5">
                          {t.sscTechName}
                        </p>
                      </div>
                    )}
                  </div>

                  <ChevronRight className="w-[18px] h-[18px] md:w-6 md:h-6 text-slate-300 shrink-0 ml-2 md:ml-4" />
                </div>

                {/* 🌟 อัปเกรด: โซนระบุชื่อผู้แจ้งและช่างแบบชัดเจน (แยกบรรทัดตามมาตรฐาน) */}
                <div className="mt-3 md:mt-5 pt-3 md:pt-5 border-t border-2 border-orange-400/70 flex justify-between items-end">
                  <div className="flex flex-col gap-2.5 md:gap-4">
                    
                    {/* 👤 ข้อมูลผู้แจ้ง (มีเสมอ) */}
                    <div className="flex flex-col gap-0.5 md:gap-1">
                      <span className="text-[10px] md:text-[13px] font-bold text-slate-400 tracking-widest">ผู้แจ้งปัญหา:</span>
                      <span className="text-[11px] md:text-[15px] font-bold text-emerald-600 flex items-center gap-1.5 md:gap-2">
                        <User className="w-[13px] h-[13px] md:w-[18px] md:h-[18px] text-emerald-500 shrink-0" />
                        <span className="truncate max-w-[140px] md:max-w-[250px]">{t.reporter}</span>
                      </span>
                    </div>
                    
                    {/* 🔧 ข้อมูลช่าง (โชว์เฉพาะเมื่องานถูกรับไปแล้ว) */}
                    {t.techName && (
                      <div className="flex flex-col gap-0.5 md:gap-1">
                        <span className="text-[10px] md:text-[13px] font-bold text-slate-400 tracking-widest">ผู้รับผิดชอบ:</span>
                        <span className="text-[11px] md:text-[15px] font-bold text-orange-600 flex items-center gap-1.5 md:gap-2">
                          <Wrench className="w-[13px] h-[13px] md:w-[18px] md:h-[18px] text-orange-500 shrink-0" />
                          <span className="truncate max-w-[140px] md:max-w-[250px]">{t.techName}</span>
                        </span>
                      </div>
                    )}

                  </div>
                  
                  {/* เวลาที่แจ้ง */}
                  <span className="text-[11px] md:text-[15px] font-bold font-mono text-blue-500 flex items-center gap-1 md:gap-2 shrink-0 mb-0.5 md:mb-1">
                    <Clock className="w-3 h-3 md:w-4 md:h-4 text-blue-500" /> 
                    {new Date(t.date).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.
                  </span>
                </div>
              </div>
            ))}
            {tickets.length === 0 && (
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
          const dutyPerson = sscRosterForDate ? { techName: sscRosterForDate.techName, techPhone: sscRosterForDate.techPhone, isHoliday: sscRosterForDate.isHoliday, holidayName: sscRosterForDate.holidayName } : null;

          const dayOfWeek = today.getDay();
          const daysThai = ['วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'];
          
          // 1. กำหนดสีประจำวันเกิดแบบเป๊ะๆ 1,000,000%
          const dayColors = {
            0: 'text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]',    // อาทิตย์ (แดง)
            1: 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]', // จันทร์ (เหลือง)
            2: 'text-pink-400 drop-shadow-[0_0_8px_rgba(244,114,182,0.8)]',  // อังคาร (ชมพู)
            3: 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]',// พุธ (เขียว)
            4: 'text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]', // พฤหัส (ส้ม)
            5: 'text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]',    // ศุกร์ (ฟ้า)
            6: 'text-violet-400 drop-shadow-[0_0_8px_rgba(167,139,250,0.8)]' // เสาร์ (ม่วง)
          };

          // 🌟 2. ถ้ามีเวรจริงๆ (วันหยุด/วันพิเศษ) -> ใช้กรอบเรืองแสงแบบเดิม
          if (dutyPerson?.techName) {
            let wTheme = { bg: 'bg-purple-500/20', border: 'border-purple-500/80', textHead: 'text-purple-400', textName: 'text-purple-400', glow: 'shadow-[0_0_30px_rgba(168,85,247,0.3)]', iconGlow: 'shadow-[0_0_10px_rgba(168,85,247,1)]', iconText: 'text-purple-400', dayLabel: daysThai[dayOfWeek] };
            
            if (dutyPerson?.isHoliday) {
              wTheme = { bg: 'bg-orange-500/20', border: 'border-orange-500/80', textHead: 'text-orange-400', textName: 'text-orange-400', glow: 'shadow-[0_0_30px_rgba(249,115,22,0.3)]', iconGlow: 'shadow-[0_0_10px_rgba(249,115,22,1)]', iconText: 'text-orange-400', dayLabel: `วันหยุดนักขัตฤกษ์ (${dutyPerson.holidayName})` };
            } else if (dayOfWeek === 0) { // วันอาทิตย์ (สีแดง)
              wTheme = { bg: 'bg-rose-500/20', border: 'border-rose-500/80', textHead: 'text-rose-400', textName: 'text-rose-400', glow: 'shadow-[0_0_30px_rgba(225,29,72,0.3)]', iconGlow: 'shadow-[0_0_10px_rgba(225,29,72,1)]', iconText: 'text-rose-400', dayLabel: 'วันอาทิตย์' };
            } else if (dayOfWeek === 6) { // วันเสาร์ (สีฟ้า/น้ำเงิน)
              wTheme = { bg: 'bg-sky-500/20', border: 'border-sky-500/80', textHead: 'text-sky-400', textName: 'text-sky-400', glow: 'shadow-[0_0_30px_rgba(14,165,233,0.3)]', iconGlow: 'shadow-[0_0_10px_rgba(14,165,233,1)]', iconText: 'text-sky-400', dayLabel: 'วันเสาร์' };
            }

            return (
              <div className={`mb-2 mt-4 p-4 md:p-6 rounded-2xl border-[2px] border-solid ${wTheme.border} bg-slate-900/90 ${wTheme.glow} flex items-center justify-between transition-all hover:brightness-110`}>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl ${wTheme.bg} flex items-center justify-center border ${wTheme.border}`}>
                      <User className={`w-6 h-6 md:w-8 md:h-8 ${wTheme.iconText}`} />
                    </div>
                    <span className={`absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-emerald-500 rounded-full animate-pulse border-2 border-slate-900 ${wTheme.iconGlow}`}></span>
                  </div>
                  <div>
                    <p className={`text-[12px] md:text-[14px] font-bold uppercase tracking-widest text-slate-400`}>
                      เจ้าหน้าที่เวร SSC | <span className={`${wTheme.textHead}`}>{wTheme.dayLabel}</span>
                    </p>
                    <p className={`text-[17px] md:text-[22px] font-black ${wTheme.textName} drop-shadow-md mt-0.5`}>
                      {dutyPerson.techName}
                    </p>
                  </div>
                </div>
                {dutyPerson.techPhone && dutyPerson.techPhone !== '-' && (
                  <a href={`tel:${dutyPerson.techPhone.replace(/\D/g, '')}`} className="bg-blue-600 hover:bg-blue-500 text-white p-3 md:p-4 rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.5)] transition-all hover:scale-105 active:scale-95">
                    <Phone className="w-6 h-6 md:w-8 md:h-8" />
                  </a>
                )}
              </div>
            );
          }

          // 🌟 3. โหมดวันธรรมดา (ไม่มีเวร) -> ฟันธง: ออกแบบใหม่เป็นป้ายประกาศ (Info Alert) สวยงาม คลีนตา!
          return (
            <div className="mb-2 mt-4 p-3.5 md:p-5 rounded-2xl border-[2px] border-dashed border-slate-600/80 bg-slate-900/50 flex items-center gap-3.5 md:gap-5 transition-all shadow-inner">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-800 flex items-center justify-center border border-slate-600 shrink-0 shadow-sm">
                <AlertCircle className="w-6 h-6 md:w-10 md:h-10 text-orange-300" />
              </div>
              <div className="flex-1">
                <p className="text-[13px] md:text-[16px] font-bold text-slate-300 leading-tight">
                  วันนี้ <span className={`${dayColors[dayOfWeek]} font-black tracking-wide mx-0.5`}>{daysThai[dayOfWeek]}</span> ไม่มีเจ้าหน้าที่เวร SSC
                </p>
                <p className="text-[11px] md:text-[14px] text-slate-400 font-bold mt-1 leading-snug">
                  สามารถแจ้งซ่อม<span className="text-orange-400 font-black tracking-wide">ผู้รับผิดชอบหลัก</span>ตามปกติได้เลย
                </p>
              </div>
            </div>
          );
        })()}

        {/* ================= กรอบที่ 1: ข้อมูลผู้แจ้งซ่อม (ธีม Emerald 🟢) ================= */}
        <div className="relative bg-slate-900/80 backdrop-blur-xl border-[2px] border-solid border-emerald-500/60 rounded-[1.5rem] p-5 md:p-8 shadow-[0_0_30px_rgba(16,185,129,0.15)] mt-6 overflow-hidden">
          
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

          <div className="space-y-4 md:space-y-6 relative z-10">
            {/* 🌟 ดรอปดาวน์ชื่อผู้แจ้ง */}
            <SciFiSelectModal
              id="field-reporter"
              themeColor="emerald"
              label={
                <span className="text-[14px] md:text-[18px] font-black tracking-wide text-emerald-300 flex items-center gap-1.5 md:gap-2">
                  <User size={18} className="md:w-5 md:h-5"/> ชื่อ-นามสกุล <span className="text-rose-500">*</span>
                </span>
              }
              icon={<User size={16} className="text-emerald-400 md:w-5 md:h-5"/>}
              placeholder="เลือกผู้แจ้งซ่อม"
              options={employeeList.map((e) => String(e.name))}
              value={formData.reporter}
              onChange={handleReporterChange}
              error={formErrors.reporter}
            />

            <div className="space-y-1.5 md:space-y-2">
              <label className="text-[14px] md:text-[18px] font-black text-emerald-300 uppercase tracking-wide ml-1 flex items-center gap-1.5 md:gap-2">
                <Briefcase size={18} className="md:w-5 md:h-5" /> ตำแหน่ง
              </label>
              <input
                value={formData.position}
                readOnly
                className="w-full bg-slate-950/50 border-[2px] border-solid border-emerald-500/30 rounded-2xl px-5 py-4 md:py-5 text-sm md:text-[16px] font-bold text-emerald-100 outline-none cursor-not-allowed shadow-[inset_0_0_15px_rgba(16,185,129,0.05)] transition-all placeholder:text-emerald-200/40"
                placeholder="-"
              />

            </div>

            <div className="space-y-1.5 md:space-y-2">
              <label className="text-[14px] md:text-[18px] font-black text-emerald-300 uppercase tracking-wide ml-1 flex items-center gap-1.5 md:gap-2">
                <Users size={18} className="md:w-5 md:h-5" /> ฝ่าย
              </label>
              <input
                value={formData.department}
                readOnly
                className="w-full bg-slate-950/50 border-[2px] border-solid border-emerald-500/30 rounded-2xl px-5 py-4 md:py-5 text-sm md:text-[16px] font-bold text-emerald-100 outline-none cursor-not-allowed shadow-[inset_0_0_15px_rgba(16,185,129,0.05)] transition-all placeholder:text-emerald-200/40"
                placeholder="-"
              />
            </div>

            <div className="space-y-1.5 md:space-y-2">
              <label className="text-[14px] md:text-[18px] font-black text-emerald-300 uppercase tracking-wide ml-1 flex items-center gap-1.5 md:gap-2">
                <Landmark size={18} className="md:w-5 md:h-5" /> สำนัก
              </label>
              <input
                value={formData.bureau}
                readOnly
                className="w-full bg-slate-950/50 border-[2px] border-solid border-emerald-500/30 rounded-2xl px-5 py-4 md:py-5 text-sm md:text-[16px] font-bold text-emerald-100 outline-none cursor-not-allowed shadow-[inset_0_0_15px_rgba(16,185,129,0.05)] transition-all placeholder:text-emerald-200/40"
                placeholder="สำนักปฏิบัติการดาวเทียม"
              />
            </div>

            <div className="space-y-1.5 md:space-y-2" id="field-reporterContact">
              <label className="text-[14px] md:text-[18px] font-black text-emerald-300 uppercase tracking-wide ml-1 flex items-center gap-1.5 md:gap-2">
                <Phone size={18} className="md:w-5 md:h-5" /> เบอร์โทรศัพท์ <span className="text-rose-500">*</span>
              </label>
              <div 
                onClick={() => setShowNumpad(true)}
                className={`w-full bg-slate-900 border-[2px] border-solid ${
                  formErrors.reporterContact ? 'border-rose-500 ring-1 ring-rose-500/30' : 'border-emerald-500/40 hover:border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:shadow-[0_0_25px_rgba(16,185,129,0.3)]'
                } rounded-2xl px-5 py-4 md:py-5 cursor-pointer transition-all duration-300`}
              >
                <span className={`text-[15px] md:text-[18px] font-bold font-mono tracking-widest ${formData.reporterContact ? 'text-emerald-300 drop-shadow-sm' : 'text-emerald-900/50'}`}>
                  {formData.reporterContact || '0X-XXXX-XXXX'}
                </span>
              </div>
              {formErrors.reporterContact && (
                <div className="text-rose-500 text-[11px] md:text-[13px] font-bold mt-1 px-1">⚠️ {formErrors.reporterContact}</div>
              )}
            </div>
          </div>
        </div>

        {/* ================= กรอบที่ 2: ข้อมูลการแจ้งซ่อม (ธีม Orange 🟠) ================= */}
        <div className="relative bg-slate-900/80 backdrop-blur-xl border-[2px] border-solid border-orange-500/60 rounded-[1.5rem] p-5 md:p-8 shadow-[0_0_30px_rgba(249,115,22,0.15)] mt-8 overflow-hidden">
          
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
                <span className="text-[14px] md:text-[18px] font-black tracking-wide text-orange-300 flex items-center gap-1.5 md:gap-2">
                  <Activity size={18} className="md:w-5 md:h-5"/> กลุ่มงาน / ภารกิจรับผิดชอบ <span className="text-rose-500">*</span>
                </span>
              }
              icon={<Activity size={16} className="text-amber-400 md:w-5 md:h-5" />}
              placeholder="เลือกกลุ่มภารกิจของ ฝวด."
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
                <span className="text-[14px] md:text-[18px] font-black tracking-wide text-orange-300 flex items-center gap-1.5 md:gap-2">
                  <Monitor size={18} className="md:w-5 md:h-5"/> รายการอุปกรณ์ / ระบบ <span className="text-rose-500">*</span>
                </span>
              }
              icon={<Monitor size={16} className="text-cyan-400 md:w-5 md:h-5" />}
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
              <label className="text-[14px] md:text-[18px] font-black text-orange-300 uppercase tracking-wide ml-1 flex items-center gap-1.5 md:gap-2">
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
                    : 'border-orange-500/40 focus:border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.1)] focus:shadow-[0_0_25px_rgba(249,115,22,0.3)]'
                } rounded-2xl px-5 py-4 md:py-5 outline-none text-sm md:text-[16px] font-bold text-orange-100 placeholder:text-orange-200/40 resize-none transition-all duration-300`}
                placeholder="อธิบายรายละเอียดอาการเสีย..."
                />

              {formErrors.description && (
                <div className="text-rose-500 text-[11px] md:text-[13px] font-bold mt-1.5 ml-1 animate-in fade-in">
                  ⚠️ {formErrors.description}
                </div>
              )}
            </div>

            <div className="space-y-1.5 md:space-y-2">
              <label className="text-[14px] md:text-[18px] font-black text-orange-300 uppercase tracking-wide ml-1 flex items-center gap-1.5 md:gap-2">
                <Hash size={18} className="md:w-5 md:h-5" /> หมายเลขครุภัณฑ์ (หากมี)
              </label>
              <input
                name="assetNumber"
                value={formData.assetNumber}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border-[2px] border-solid border-orange-500/40 focus:border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.1)] focus:shadow-[0_0_25px_rgba(249,115,22,0.3)] rounded-2xl px-5 py-4 md:py-5 text-sm md:text-[16px] font-bold text-orange-100 outline-none font-mono tracking-widest transition-all duration-300 placeholder:text-orange-200/40"
                placeholder="ระบุหมายเลข..."
              />
            </div>

            {/* 🌟 ดรอปดาวน์อาคาร */}
            <SciFiSelectModal
              id="field-building"
              themeColor="orange"
              label={
                <span className="text-[14px] md:text-[18px] font-black tracking-wide text-orange-300 flex items-center gap-1.5 md:gap-2">
                  <Building size={18} className="md:w-5 md:h-5"/> อาคาร / ตึก <span className="text-rose-500">*</span>
                </span>
              }
              icon={<Building size={16} className="text-orange-400 md:w-5 md:h-5" />}
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
                <label className="text-[14px] md:text-[18px] font-black text-slate-200 uppercase tracking-wide ml-1 flex items-center gap-1.5 md:gap-2">
                  <DoorOpen size={18} className="text-orange-400 md:w-5 md:h-5" /> สถานที่ / ห้อง <span className="text-rose-500">*</span>
                </label>
                <input
                  name="room"
                  value={formData.room}
                  onChange={handleInputChange}
                  className={`w-full bg-slate-900 border-[2px] border-solid ${
                    formErrors.room
                      ? 'border-rose-500 ring-1 ring-rose-500/30'
                      : 'border-orange-500/30 focus:border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.15)] focus:shadow-[0_0_25px_rgba(249,115,22,0.4)]'
                  } rounded-2xl px-5 py-4 md:py-5 text-sm md:text-[16px] font-bold text-orange-100 outline-none transition-all duration-300 placeholder:text-slate-600`}
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
                <label className="text-[14px] md:text-[18px] font-black text-orange-300 uppercase tracking-wide flex items-center gap-1.5 md:gap-2">
                  <Camera className="md:w-5 md:h-5" /> 
                  แนบรูปภาพประกอบ <span className="text-rose-500">*</span>
                </label>
                <div className="bg-orange-950 border border-orange-500/80 text-orange-400 text-[12px] md:text-[14px] font-black px-3 py-1 rounded-lg shadow-[0_0_10px_rgba(249,115,22,0.4)] backdrop-blur-sm">
                  {formData.images.length} / 6 รูป
                </div>
              </div>

              <div className={formData.images.length === 0 ? "flex w-full" : "grid grid-cols-3 gap-3 md:gap-4"}>
                
                {formData.images.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-2xl md:rounded-3xl overflow-hidden border-[2px] border-orange-400/80 shadow-[0_0_15px_rgba(249,115,22,0.3)] group">
                    <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, images: formData.images.filter((_, idx) => idx !== i) })}
                      className="absolute top-1 right-1 md:top-2 md:right-2 bg-rose-500/90 backdrop-blur-sm text-white p-1.5 md:p-2 rounded-full shadow-lg transition-all active:scale-75 hover:bg-rose-600 border border-rose-400"
                    >
                      <X size={14} className="md:w-4 md:h-4 stroke-[3px]" />
                    </button>
                  </div>
                ))}

               {/* 🎯 ปุ่มเรียกเมนูเลือกรูป (คลิกปุ๊บ เมนูเด้งปั๊บ) */}
<div onClick={() => setShowImagePicker(true)} className={`border-2 border-dashed border-orange-500/50 bg-orange-950/20 hover:bg-orange-900/40 hover:border-orange-400 rounded-2xl md:rounded-3xl flex flex-col items-center justify-center transition-all duration-300 cursor-pointer shadow-[inset_0_0_20px_rgba(249,115,22,0.05)] hover:shadow-[0_0_25px_rgba(249,115,22,0.3)] group ${formData.images.length === 0 ? 'w-full h-36 md:h-48' : 'aspect-square'}`}>
  <Camera size={formData.images.length === 0 ? 50 : 38} className="text-orange-500/70 group-hover:text-orange-400 mb-2 transition-all" />
  <span className="font-black tracking-widest text-orange-200/70 group-hover:text-orange-200">
    {formData.images.length === 0 ? 'คลิกเพื่อแนบรูปภาพ' : 'เพิ่มรูปภาพ'}
  </span>
</div>

{/* ======================================================= */}
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
        </div>
{/* ======================================================= */}
{/* 🌟 จุดสิ้นสุด: หน้าต่างป๊อบอัพเลือกรูปภาพ (Hybrid: Mobile เรืองแสง + PC วูบวาบ) */}
{/* ======================================================= */}
          
          <div className="pt-6 px-2 md:px-0 flex flex-col md:flex-row items-center gap-4 text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="group w-full md:flex-[2] bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-yellow-400 hover:shadow-[0_0_25px_rgba(249,115,22,0.8)] hover:-translate-y-1 text-white font-black text-xl md:text-2xl py-4 md:py-5 rounded-[1rem] md:rounded-2xl shadow-xl shadow-orange-500/30 active:scale-95 transition-all duration-300 flex justify-center items-center gap-3 disabled:grayscale disabled:opacity-50 border-2 border-solid border-white/50"
            >
              <Send size={24} className="md:w-7 md:h-7" />{' '}
              <span className="tracking-wide">ยืนยันแจ้งซ่อม</span>
            </button>

            <button
              type="button"
              onClick={handleResetForm}
              className="w-full md:flex-[1] bg-emerald-600 text-white hover:bg-rose-500 hover:text-white hover:shadow-[0_0_15px_rgba(244,63,94,0.6)] hover:-translate-y-1 font-bold text-[15px] md:text-[18px] py-3.5 md:py-5 rounded-2xl flex items-center justify-center gap-2 border-2 border-solid border-white/50 active:scale-95 shadow-sm transition-all"
            >
              <RotateCcw size={16} className="md:w-5 md:h-5" /> ล้างข้อมูล
            </button>

          </div>

{/* 🌟 หน้าต่าง Numpad ไซไฟอวกาศ (เวอร์ชันทุบสกรอลล์บาร์ทิ้ง + ผูกคีย์บอร์ด PC ถูกต้องตามกฎ React 1,000,000%) */}
{showNumpad && (
  <div 
    className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 animate-in fade-in duration-300" 
    onClick={() => setShowNumpad(false)}
    // ⌨️ วิชามารขั้นสูง: ดักจับคีย์บอร์ดผ่าน Event ของตัว Container โดยตรง ไม่ใช้ Hook เพื่อป้องกันหน้าจอขาวระเบิด 100%
    tabIndex={0}
    ref={(el) => el && el.focus()}
    onKeyDown={(e) => {
      // 1. กดเลข 0-9 บนคีย์บอร์ดปกติ หรือ แป้น Numpad ขวามือ
      if (/^[0-9]$/.test(e.key)) {
        let current = formData.reporterContact ? formData.reporterContact.replace(/\D/g, '') : '';
        if (current.length < 10) current += e.key;
        let formatted = current;
        if (current.length > 6) formatted = `${current.substring(0, 2)}-${current.substring(2, 6)}-${current.substring(6)}`;
        else if (current.length > 2) formatted = `${current.substring(0, 2)}-${current.substring(2)}`;
        setFormData(prev => ({ ...prev, reporterContact: formatted }));
        if (formErrors.reporterContact) setFormErrors(prev => ({ ...prev, reporterContact: null }));
      }
      
      // 2. กดปุ่ม Backspace หรือ Delete เพื่อลบตัวเลขทีละหลัก
      if (e.key === 'Backspace' || e.key === 'Delete') {
        let current = formData.reporterContact ? formData.reporterContact.replace(/\D/g, '') : '';
        current = current.slice(0, -1);
        let formatted = current;
        if (current.length > 6) formatted = `${current.substring(0, 2)}-${current.substring(2, 6)}-${current.substring(6)}`;
        else if (current.length > 2) formatted = `${current.substring(0, 2)}-${current.substring(2)}`;
        setFormData(prev => ({ ...prev, reporterContact: formatted }));
      }

      // 3. กดปุ่ม Enter เพื่อตรวจสอบและยืนยันปิดหน้าต่าง
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
    
    <div className="absolute w-[350px] md:w-[500px] h-[350px] md:h-[500px] bg-cyan-500/40 rounded-full blur-[100px] md:blur-[150px] pointer-events-none z-0 animate-pulse"></div>

    {/* 🌟 ฟันธง: รักษารูปทรงเดิม p-4 md:p-10 แต่ทุบสกรอลล์บาร์ทิ้งถาวรด้วยการเอา max-h-[80dvh] และ overflow-y-auto ออก แล้วแทนที่ด้วย overflow-hidden */}
    <div className="relative m-auto z-10 w-[90%] max-w-[320px] sm:max-w-[340px] md:max-w-[450px] bg-slate-900 border-[2px] border-solid border-white rounded-[2rem] md:rounded-[2.5rem] p-4 sm:p-6 md:p-10 shadow-[0_0_60px_rgba(6,182,212,0.6)] flex flex-col gap-4 sm:gap-5 md:gap-8 transition-all duration-300 overflow-hidden outline-none" onClick={(e) => e.stopPropagation()}>
       
      {/* 🌟 ฟันธง: เพิ่ม relative เข้าไปใน div นี้ เพื่อให้ปุ่มปิดไปอยู่ที่มุมขวาได้เป๊ะๆ */}
      <div className="text-center mb-1 pb-3 md:pb-5 border-b border-white/20 relative">
         <h3 className="font-black tracking-widest text-[16px] sm:text-[18px] md:text-[24px] flex items-center justify-center gap-2 text-orange-400 drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]">
           <Phone size={18} className="text-emerald-400 drop-shadow-sm md:w-6 md:h-6" />
           ระบุเบอร์โทรศัพท์
         </h3>

         {/* 🌟 ปุ่มกากบาท Sci-Fi เรืองแสง (ตรงจุดนี้เลยครับ) */}
         <button 
           type="button"
           onClick={() => setShowNumpad(false)} 
           className="absolute right-0 top-1/2 -translate-y-1/2 text-rose-500 hover:text-white bg-slate-900 hover:bg-rose-600 p-1.5 md:p-2 rounded-full transition-all border-2 border-rose-500 shadow-[0_0_15px_rgba(225,29,72,0.6)] animate-pulse hover:shadow-[0_0_25px_rgba(225,29,72,1)] cursor-pointer"
         >
           <X size={18} className="md:w-6 md:h-6 stroke-[3px]" />
         </button>
       </div>
       
       <div className="bg-slate-950 border-[2px] border-solid border-cyan-400 rounded-2xl md:rounded-3xl py-4 px-4 md:py-6 text-center shadow-[0_0_15px_rgba(34,211,238,0.4)] flex items-center justify-center min-h-[70px] md:min-h-[100px] shrink-0">
         <span className={`text-[24px] sm:text-[28px] md:text-[36px] font-mono font-black tracking-widest ${formData.reporterContact ? 'text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.9)]' : 'text-slate-500'}`}>
           {formData.reporterContact || '0X-XXXX-XXXX'}
         </span>
       </div>

       <div className="grid grid-cols-3 gap-2.5 sm:gap-3 md:gap-4 shrink-0">
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
             className="bg-slate-800 border-[2px] border-solid border-white/80 text-slate-200 text-2xl md:text-3xl font-black py-3 sm:py-3.5 md:py-5 rounded-xl md:rounded-2xl active:scale-95 transition-all shadow-[0_0_10px_rgba(255,255,255,0.3)] hover:bg-cyan-600/90 hover:border-cyan-400 hover:text-white hover:shadow-[0_0_20px_rgba(34,211,238,0.7)]"
           >
             {num}
           </button>
         ))}
         
         <button 
           type="button" 
           onClick={() => setFormData(prev => ({ ...prev, reporterContact: '' }))} 
           className="bg-slate-800 border-[2px] border-solid border-white/80 text-orange-400 text-2xl md:text-3xl font-black py-3 sm:py-3.5 md:py-5 rounded-xl md:rounded-2xl active:scale-95 transition-all shadow-[0_0_10px_rgba(255,255,255,0.3)] hover:bg-orange-600 hover:border-orange-400 hover:text-white hover:shadow-[0_0_20px_rgba(249,115,22,0.7)] flex items-center justify-center"
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
           className="bg-slate-800 border-[2px] border-solid border-white/80 text-slate-200 text-2xl md:text-3xl font-black py-3 sm:py-3.5 md:py-5 rounded-xl md:rounded-2xl active:scale-95 transition-all shadow-[0_0_10px_rgba(255,255,255,0.3)] hover:bg-cyan-600/90 hover:border-cyan-400 hover:text-white hover:shadow-[0_0_20px_rgba(34,211,238,0.7)]"
         >
           0
         </button>
         
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
           className="bg-slate-800 border-[2px] border-solid border-white/80 text-rose-500 flex items-center justify-center py-3 sm:py-3.5 md:py-5 rounded-xl md:rounded-2xl active:scale-95 transition-all shadow-[0_0_10px_rgba(255,255,255,0.3)] hover:bg-rose-600 hover:border-rose-400 hover:text-white hover:shadow-[0_0_20px_rgba(225,29,72,0.7)]"
         >
           <X size={28} strokeWidth={3.5} className="md:w-8 md:h-8"/>
         </button>
       </div>

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
         className="w-full mt-2 md:mt-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black py-3.5 sm:py-4 md:py-6 rounded-xl md:rounded-2xl border-[2px] border-solid border-orange-300 shadow-[0_0_15px_rgba(249,115,22,0.5)] active:scale-95 transition-all duration-300 text-[15px] sm:text-[16px] md:text-[22px] tracking-widest uppercase hover:from-emerald-500 hover:to-emerald-600 hover:border-emerald-300 hover:shadow-[0_0_25px_rgba(16,185,129,0.8)] shrink-0"
       >
         ยืนยัน
       </button>
    </div>
  </div>
)}
        
      </form>

      )}

     {/* 🌟 หน้าต่าง Popup ยืนยันข้อมูล (เวอร์ชันแก้ Error หน้าจอแดงถาวร - ผูกคีย์บอร์ด PC คลีน 100% ตามกฎ React) */}
{confirmSubmitModal && (
  <div 
    className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-6 animate-in fade-in outline-none"
    onClick={() => setConfirmSubmitModal(false)}
    // ⌨️ วิชามารดักจับคีย์บอร์ด: ดักฟังผ่านแอตทริบิวต์ HTML โดยตรง ไม่ใช้ useState หรือ useEffect ในนี้ ปลอดภัยจากอาการ Hook แกว่ง 1,000,000%
    tabIndex={0}
    ref={(el) => el && el.focus()}
    onKeyDown={(e) => {
      // ข้อที่ 2: กดปุ่ม Esc เพื่อยกเลิกและปิดหน้าต่างทันที
      if (e.key === 'Escape') {
        e.preventDefault();
        setConfirmSubmitModal(false);
      }
      
      // ข้อที่ 1: กดปุ่ม Enter บน PC ปุ๊บ สั่งยิงข้อมูลส่งซ่อมเข้ากลุ่มไลน์ ฝวด. ทันที (เพราะเป็นปุ่ม Default หลัก)
      if (e.key === 'Enter') {
        e.preventDefault();
        executeSubmit();
      }
    }}
  >
    
    <div className="absolute w-[300px] h-[300px] bg-orange-500/40 rounded-full blur-[80px] animate-pulse pointer-events-none z-0"></div>

    <div className="relative z-10 bg-slate-800 border-[2px] border-solid border-orange-500 rounded-[2rem] w-full max-w-sm overflow-hidden shadow-[0_0_40px_rgba(249,115,22,1)] p-8 text-center space-y-6" onClick={(e) => e.stopPropagation()}>
      
      <div className="w-24 h-24 bg-slate-900 text-orange-500 rounded-full flex items-center justify-center mx-auto border-2 border-orange-400/50 shadow-[0_0_20px_rgba(249,115,22,0.8)] relative">
        <div className="absolute inset-0 border-4 border-orange-500 rounded-full border-t-transparent animate-spin opacity-50"></div>
        <CheckSquare size={50} className="animate-pulse" />
      </div>

      <div>
        <h3 className="text-3xl font-black text-white tracking-tight drop-shadow-md mb-2">
          ยืนยันข้อมูล?
        </h3>
        <p className="text-[18px] text-slate-300 font-bold leading-relaxed">
          โปรดตรวจสอบข้อมูลให้ถูกต้อง<br />
          ก่อนส่งเข้าระบบ
        </p>
      </div>

      <div className="flex gap-4 pt-2">
        {/* ปุ่มยกเลิก */}
        <button
          type="button"
          onClick={() => setConfirmSubmitModal(false)}
          className="flex-1 py-3.5 rounded-xl font-bold text-white bg-emerald-700 border-2 border-solid border-emerald-500 shadow-lg active:scale-95 transition-all duration-300 hover:bg-emerald-500 hover:shadow-[0_0_25px_rgba(16,185,129,0.8)] hover:-translate-y-1"
        >
          ยกเลิก
        </button>

        {/* ปุ่มยืนยันส่งข้อมูล (ตั้งค่าให้เรืองแสงพร้อมรับแรงกระแทกจากปุ่ม Enter บนคีย์บอร์ด PC ทันที) */}
        <button
          type="button"
          onClick={executeSubmit}
          className="flex-[1.5] py-3.5 rounded-xl font-black text-white bg-gradient-to-r from-orange-400 to-amber-400 border-2 border-solid border-white scale-105 ring-4 ring-orange-400/50 shadow-[0_0_30px_rgba(249,115,22,0.9)] active:scale-95 transition-all duration-300 hover:from-orange-400 hover:to-amber-400"
        >
          ยืนยันส่งข้อมูล
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

     {/* 2. สวิตช์กรองสถานะงาน (ฟันธง: เอากรอบนอกออก ปล่อยปุ่มลอย และยืดขยายเต็มหน้าจออัตโนมัติ) */}
     <div className="flex gap-2 md:gap-4 overflow-x-auto py-1 md:py-2 snap-x w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
             className={`flex-none md:flex-1 px-4 md:px-0 py-2 md:py-3.5 text-[12px] md:text-[16px] font-black rounded-lg md:rounded-xl transition-all duration-300 snap-center whitespace-nowrap flex items-center justify-center ${
                filterStatus === f.id
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-[2px] border-solid border-orange-300 shadow-[0_0_15px_rgba(249,115,22,0.8)] scale-[1.05] z-10' 
                  : 'bg-slate-900 text-cyan-300 border-[2px] border-solid border-cyan-400/30 shadow-[0_0_8px_rgba(34,211,238,0.4)] hover:bg-cyan-900/60 hover:text-white hover:border-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,1)] hover:-translate-y-1' 
              }`}
            >
              {f.label}
            </button>
          ))}
      </div>

      {/* 3. ปุ่มกรองเวลา (ฟันธง: จัดเรียงให้ขอบซ้าย-ขวา ตรงเป๊ะกับปุ่มสถานะด้านบน 100%) */}
      <div className="flex gap-2 md:gap-4 md:mt-2 w-full">
          
          <button onClick={() => setTrackTimeframe('all')} className={`flex-1 py-2 md:py-3.5 rounded-lg md:rounded-xl font-black text-[12px] md:text-[18px] transition-all duration-300 whitespace-nowrap flex items-center justify-center ${
            trackTimeframe === 'all' 
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.8)] border-[2px] border-solid border-cyan-300 scale-[1.02] z-10' 
              : 'bg-slate-950 text-cyan-300 border-[2px] border-solid border-cyan-400/30 shadow-[0_0_8px_rgba(34,211,238,0.4)] hover:bg-cyan-900/60 hover:text-white hover:border-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,1)] hover:-translate-y-1'
          }`}>ดูทุกวัน</button>

          {/* ระบุวัน */}
          <div className="relative flex-1">
            <button onClick={() => 
            setShowTrackDatePicker(true)} className={`w-full h-full py-2 md:py-3.5 rounded-lg md:rounded-xl font-black text-[12px] md:text-[18px] flex items-center justify-center gap-1.5 md:gap-2 transition-all duration-300 whitespace-nowrap ${
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
                        <span className="text-[12px] md:text-[18px] font-black text-white tracking-widest uppercase mb-0.5 md:mb-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">เลือกวันที่</span>
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
            <button onClick={() => setShowTrackMonthPicker(true)} className={`w-full h-full py-2 md:py-3.5 rounded-lg md:rounded-xl font-black text-[12px] md:text-[18px] flex items-center justify-center gap-1.5 md:gap-2 transition-all duration-300 whitespace-nowrap ${
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
                        <span className="text-[12px] md:text-[18px] font-black text-white tracking-widest uppercase mb-0.5 md:mb-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">เลือกเดือน</span>
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
        <Clock size={14} className="text-orange-500" />
        <span className="text-[12px] font-bold text-emerald-400 tracking-widest drop-shadow-sm">
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
            <CheckCircle size={50} className="mx-auto mb-4 opacity-50" />
            <p className="font-bold text-[25px] text-lg">ไม่มีรายการ</p>
            <p className="text-[20px] text-white-500 mt-1">ในสถานะที่คุณเลือก</p>
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
                        <span className="text-[13px] md:text-[24px] font-mono text-emerald-600 bg-emerald-100 px-3 py-1 md:px-5 md:py-2 rounded-lg md:rounded-xl font-black tracking-widest border border-emerald-200 shadow-sm">
                          {String(t.id)}
                        </span>
                        {t.isOutOfHours && (
                          <span className="ml-2 md:ml-4 text-[11px] md:text-[24px] font-black text-rose-600 bg-rose-100 border border-rose-200 px-2 py-0.5 md:px-4 md:py-1.5 rounded-md md:rounded-xl animate-pulse">
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

                    {/* 🌟 โซนดาวประเมิน (อัปเกรด: บรรทัดเดียว ชิดขวา ขนาดใหญ่ขึ้น) */}
                    {t.status === 'verified' && t.rating && (() => {
                      const rColor = t.rating === 5 ? { text: 'text-emerald-400', fill: '#34d399', drop: 'drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]', border: 'border-emerald-500', glow: 'shadow-[0_0_15px_rgba(52,211,153,0.3)]', flare: 'bg-emerald-500/20' } :
                                    t.rating === 4 ? { text: 'text-teal-400', fill: '#2dd4bf', drop: 'drop-shadow-[0_0_10px_rgba(45,212,191,0.8)]', border: 'border-teal-500', glow: 'shadow-[0_0_15px_rgba(45,212,191,0.3)]', flare: 'bg-teal-500/20' } :
                                    t.rating === 3 ? { text: 'text-amber-400', fill: '#fbbf24', drop: 'drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]', border: 'border-amber-500', glow: 'shadow-[0_0_15px_rgba(251,191,36,0.3)]', flare: 'bg-amber-500/20' } :
                                    t.rating === 2 ? { text: 'text-orange-400', fill: '#fb923c', drop: 'drop-shadow-[0_0_10px_rgba(251,146,60,0.8)]', border: 'border-orange-500', glow: 'shadow-[0_0_15px_rgba(251,146,60,0.3)]', flare: 'bg-orange-500/20' } :
                                                      { text: 'text-rose-400', fill: '#fb7185', drop: 'drop-shadow-[0_0_10px_rgba(251,113,133,0.8)]', border: 'border-rose-500', glow: 'shadow-[0_0_15px_rgba(225,29,72,0.3)]', flare: 'bg-rose-500/20' };

                      return (
                        <div className="mt-3 mb-5 md:mt-6 md:mb-10 animate-in slide-in-from-top-2 duration-500">
                          {currentUserRole === 'technician' ? (
                            <div className={`bg-slate-900 border-[2px] border-solid ${rColor.border} rounded-xl md:rounded-[2rem] p-4 md:p-8 ${rColor.glow} relative overflow-hidden`}>
                              <div className={`absolute -right-10 -top-10 w-32 h-32 md:w-64 md:h-64 ${rColor.flare} blur-[25px] md:blur-[50px] rounded-full pointer-events-none`}></div>
                              <div className="relative z-10">
                                <div className="flex justify-between items-center mb-3 md:mb-6 border-b border-slate-700/50 pb-3 md:pb-6">
                                  <span className={`text-[13px] md:text-[24px] font-black ${rColor.text} uppercase tracking-widest flex items-center gap-1.5 md:gap-3 drop-shadow-sm`}>
                                    <Star className={`w-4 h-4 md:w-8 md:h-8 ${rColor.text}`} fill="currentColor"/> ผลการประเมิน
                                  </span>
                                  <div className="flex gap-1 md:gap-3">
                                      {[1, 2, 3, 4, 5].map((s) => (
                                        <Star key={s} className={`w-[18px] h-[18px] md:w-[32px] md:h-[32px] ${t.rating >= s ? rColor.drop : ""}`} fill={t.rating >= s ? rColor.fill : "none"} stroke={t.rating >= s ? rColor.fill : "#475569"} strokeWidth={2} />
                                      ))}
                                  </div>
                                </div>
                                
                                {t.ratingComment ? (
                                  <div className={`bg-slate-950 p-4 md:p-8 rounded-xl md:rounded-3xl border border-solid ${rColor.border} shadow-inner relative overflow-hidden`}>
                                    <div className={`absolute top-0 left-0 w-1.5 md:w-3 h-full ${rColor.text.replace('text-', 'bg-')}`}></div>
                                    <p className={`text-[13px] sm:text-[14px] md:text-[22px] font-bold ${rColor.text} leading-relaxed italic pl-1 md:pl-4`}>
                                      <span className="text-xl md:text-4xl leading-none opacity-50 mr-1 md:mr-3">"</span>
                                      {t.ratingComment}
                                      <span className="text-xl md:text-4xl leading-none opacity-50 ml-1 md:ml-3">"</span>
                                    </p>
                                  </div>
                                ) : (
                                  <div className="bg-slate-950/50 p-3 md:p-6 rounded-xl md:rounded-2xl border border-slate-800 flex justify-center">
                                    <p className="text-[12px] md:text-[20px] font-bold text-slate-500 italic">- ไม่มีข้อเสนอแนะเพิ่มเติม -</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className={`flex flex-row items-center justify-between bg-slate-900/80 p-3.5 md:p-6 rounded-xl md:rounded-2xl border-[2px] border-solid ${rColor.border} ${rColor.glow} relative overflow-hidden`}>
                              <div className={`absolute -left-10 -bottom-10 w-24 h-24 md:w-48 md:h-48 ${rColor.flare} blur-[20px] md:blur-[40px] rounded-full pointer-events-none`}></div>
                              <span className={`text-[11.5px] sm:text-[14px] md:text-[24px] font-black ${rColor.text} uppercase tracking-widest ml-1 relative z-10 drop-shadow-sm shrink-0`}>
                                คุณให้คะแนนงานนี้:
                              </span>
                              <div className="flex gap-1 md:gap-3 relative z-10 shrink-0">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star key={s} className={`w-[14px] h-[14px] sm:w-4 sm:h-4 md:w-8 md:h-8 ${t.rating >= s ? rColor.drop : ""}`} fill={t.rating >= s ? rColor.fill : "none"} stroke={t.rating >= s ? rColor.fill : "#475569"} strokeWidth={2} />
                                ))}
                              </div>
                            </div>
                          )}
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
                    
                    <div className="flex flex-col gap-1 md:gap-3 mt-1.5 md:mt-4 mb-3 md:mb-6 bg-indigo-50/50 p-2 md:p-6 rounded-lg md:rounded-2xl border-2 border-solid border-indigo-500">
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

                    {/* 🌟 โซนนาฬิกาจับเวลา (ฟันธง: โฉมใหม่กรอบโค้งมน + ไอคอนนาฬิกาด้านใน) */}
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
          <div className="px-5 md:px-10 pb-5 md:pb-10 pt-4 md:pt-6 flex flex-col w-full">
          {/* 🌟 ฟันธงสเต็ป 1: ทุบกรอบสีน้ำเงินและพื้นหลังทิ้ง! ปล่อยให้เนื้อหากว้างเท่ากรอบด้านบน 1,000,000% */}
          <div className="flex flex-col w-full relative z-10 mb-2 md:mb-4">
    
    {/* 🚨 เหตุผลยกเลิกงาน */}
    {t.status === 'cancelled' && t.cancelReason && (
          <div className="bg-rose-100/70 border-l-[4px] border-2 border-solid border-rose-600 rounded-xl md:rounded-2xl p-3 md:p-5 flex gap-3 md:gap-4 w-full mb-4 mt-2">
        <XCircle className="w-5 h-5 md:w-8 md:h-8 shrink-0 mt-0.5 text-rose-600" />
        <div className="w-full">
          <span className="block mb-1 text-rose-600/80 text-[16px] md:text-[22px] font-bold uppercase">เหตุผลที่ยกเลิก:</span>
          <span className="text-[16px] md:text-[26px] text-rose-900 font-bold">{String(t.cancelReason)}</span>
        </div>
      </div>
    )}

  {/* 🌟 ฟันธง: Timeline รักษาสีของท่านหัวหน้า + อัปเกรดเป็นการ์ดโค้งมน (Card UI) */}
    {t.historyLog && t.historyLog.length > 0 ? (
      // 🎯 เพิ่ม gap-3 และ mt-2 เพื่อให้การ์ดแต่ละใบมีระยะห่างกัน จะได้เห็นขอบโค้งชัดเจน
      <div className="flex flex-col w-full mb-2 gap-3 md:gap-4 mt-2">
        {(() => {
          let holdCounter = 0;
          let resumeCounter = 0;

          return t.historyLog.map((log, index) => {
            const isLast = index === t.historyLog.length - 1;
            const isHold = log.type === 'hold';
            
            // นับครั้งที่อัตโนมัติ
            if (isHold) holdCounter++;
            else resumeCounter++;

            // 🌟 สมองกลคำนวณระยะเวลา (ระดับ Milliseconds)
            let durationMs = 0;
            let isOngoing = false;

            if (isHold) {
              const nextLog = t.historyLog[index + 1];
              if (nextLog) {
                durationMs = new Date(nextLog.timestamp).getTime() - new Date(log.timestamp).getTime();
              } else {
                isOngoing = true;
              }
            } else {
              const nextLog = t.historyLog[index + 1];
              if (nextLog) {
                durationMs = new Date(nextLog.timestamp).getTime() - new Date(log.timestamp).getTime();
              } else if (t.status === 'completed' || t.status === 'verified') {
                durationMs = t.completedAt ? new Date(t.completedAt).getTime() - new Date(log.timestamp).getTime() : 0;
              } else {
                isOngoing = true;
              }
            }

            // 🌟 ฟังก์ชันแปลงเวลาเป็น HH:MM:SS
            const pad = (num) => String(num).padStart(2, '0');
            const hours = Math.floor(durationMs / 3600000);
            const minutes = Math.floor((durationMs % 3600000) / 60000);
            const seconds = Math.floor((durationMs % 60000) / 1000);
            const formattedTime = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

            return (
              // 🌟 ฟันธงจุดที่ 1 (กล่องแม่): เปลี่ยนเป็น flex-col md:flex-row เพื่อให้มือถือเรียงบนล่าง แต่คอมยังเรียงซ้ายขวา
              <div key={index} className={`flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-0 p-4 md:px-6 -mx-2 md:-mx-4 rounded-2xl md:rounded-[1rem] shadow-sm hover:shadow-md transition-shadow border-2 border-solid border-slate-800 ${isHold ? 'bg-purple-100 border-l-[6px] border-l-purple-500' : 'bg-orange-100 border-l-[6px] border-l-orange-500'}`}>
                
                {/* 🎯 ด้านซ้าย: ชื่อเหตุการณ์ */}
                <div className="flex gap-3 md:gap-4 w-full">
                  {isHold ? <PauseCircle className="w-5 h-5 md:w-6 md:h-6 shrink-0 text-purple-600 drop-shadow-sm" /> : <Wrench className="w-5 h-5 md:w-6 md:h-6 shrink-0 text-orange-600 drop-shadow-sm" />}
                  <div>
                    <p className="font-black text-[12px] md:text-[16px] text-slate-800">{isHold ? 'แจ้งเหตุขัดข้อง' : 'ดำเนินการต่อ'}</p>
                    <p className="text-[13px] md:text-[18px] text-slate-600 font-bold mt-0.5">{String(log.reason)}</p>
                  </div>
                </div>
                
                {/* 🌟 ฟันธงจุดที่ 2 (กล่องเวลาด้านขวา): เติม self-end เพื่อให้มันผลักตัวเองไปชิดขวาเสมอเวลากลายเป็นจอมือถือ */}
                {/* 🌟 ฟันธงจุดเสริมความเนียน (กล่องเวลาด้านขวา) */}
                <div className="flex flex-col items-end self-end md:self-auto shrink-0 ml-0 md:ml-2 mt-1 md:mt-0">
                   {isLast && isOngoing ? (
                     <>
                       {/* 🎯 ปรับ text-[13px] เป็น text-[11px] เฉพาะจอมือถือ และหรี่สีเป็น slate-500 */}
                       <span className="text-[11px] md:text-[16px] font-bold mb-0.5 md:mb-1 text-slate-500 md:text-slate-800">สถานะปัจจุบัน</span>
                       <span className={`px-2 md:px-3 py-0.5 md:py-1 rounded-md text-[12px] md:text-[16px] font-bold animate-pulse whitespace-nowrap shadow-sm border md:border-2 border-solid ${isHold ? 'bg-purple-100 text-purple-700 border-purple-500' : 'bg-orange-100 text-orange-700 border-orange-500'}`}>
                         {isHold ? 'รออะไหล่' : 'กำลังซ่อม'}
                       </span>
                     </>
                   ) : (
                     <>
                       {/* 🎯 ปรับ text-[13px] เป็น text-[11px] เฉพาะจอมือถือ */}
                       <span className={`text-[11px] md:text-[16px] font-bold mb-0.5 md:mb-1 opacity-80 md:opacity-100 ${isHold ? 'text-purple-600' : 'text-orange-600'}`}>
                         {isHold ? `ระยะเวลาที่หยุด (ครั้งที่ ${holdCounter})` : `ระยะเวลาที่ซ่อม (ครั้งที่ ${resumeCounter})`}
                       </span>
                       <span className="text-[12px] md:text-[16px] font-mono font-black text-slate-700 bg-white px-2 md:px-3 py-0.5 rounded border md:border-2 border-solid border-indigo-800 whitespace-nowrap shadow-sm tracking-wider">
                         {formattedTime}
                       </span>
                     </>
                   )}
                </div>

              </div>
            );
          });
        })()}
      </div>
    ) : (
      
      /* โค้ดสำรองกรณีข้อมูลยังเป็นแบบเก่า (เพื่อไม่ให้ Error) */
      <>
        {t.holdReason && (
          <div className="bg-purple-50/70 border-l-[4px] border-solid border-purple-500 p-3 md:p-5 flex gap-3 md:gap-4 w-full mb-4">
            <PauseCircle className="w-4 h-4 md:w-6 md:h-6 shrink-0 mt-0.5 text-purple-600" />
            <div className="w-full">
              <span className="block mb-0.5 text-purple-600/80 text-[10px] md:text-[14px] font-bold">แจ้งเหตุขัดข้อง:</span>
              <span className="text-[13px] md:text-[18px] text-purple-900 font-bold">{String(t.holdReason)}</span>
            </div>
          </div>
        )}
        {t.resumeReason && (
          <div className="bg-orange-50/70 border-l-[4px] border-solid border-orange-500 p-3 md:p-5 flex gap-3 md:gap-4 w-full mb-4">
            <Wrench className="w-4 h-4 md:w-6 md:h-6 shrink-0 mt-0.5 text-orange-600" />
            <div className="w-full">
              <span className="block mb-0.5 text-orange-600/80 text-[10px] md:text-[14px] font-bold">ดำเนินการต่อ:</span>
              <span className="text-[13px] md:text-[18px] text-orange-900 font-bold">{String(t.resumeReason)}</span>
            </div>
          </div>
        )}
      </>
    )}

    {/* 📋 สรุปผลและข้อแนะนำ (ฟันธง: เติม rounded-xl md:rounded-2xl ลบเหลี่ยมแข็งโป๊ก) */}
    {t.cause && (
      <div className="bg-emerald-100/70 border-l-[4px] border-2 border-solid border-emerald-600 rounded-xl md:rounded-2xl p-3 md:p-5 flex gap-3 md:gap-4 w-full mb-4 mt-2">
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
          <div className="bg-slate-100 border-2 border-solid border-emerald-500 p-4 md:p-6 rounded-2xl md:rounded-[1.5rem] mt-2 shadow-sm w-full">
            <span className="text-[14px] md:text-[22px] font-black text-rose-700 mb-3 md:mb-4 flex items-center gap-2">
               📸 ภาพประกอบการแจ้งซ่อม:
            </span>
            <div className="grid grid-cols-3 gap-2 md:gap-4 mt-2">
              {t.images.map((img, i) => (
                <img 
                  key={i} 
                  src={img} 
                  alt={`ภาพประกอบ ${i+1}`} 
                  className="rounded-lg w-full aspect-square object-cover border border-slate-200 shadow-sm hover:scale-105 transition-transform cursor-pointer" 
                />
              ))}
            </div>
          </div>
        )}

        {/* ============================================================================== */}
                        
                       {/* 🌟 ฟันธง: สร้างกล่องแม่ครอบโซนอาการเสียและ Asset No ทั้งหมด พร้อมหดความกว้างให้เท่ากรอบส้มด้านบน */}
                       <div className="bg-orange-100/70 border-l-[4px] border-2 border-solid border-indigo-600 rounded-xl md:rounded-2xl p-3 md:p-5 flex gap-3 md:gap-4 w-full mb-4 mt-4">
                          
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
{/* ==================== โซนบุคคล (ผู้แจ้ง, ผู้รับผิดชอบหลัก) 🌟 ฟันธง: แยกกรอบชัดเจน ==================== */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 w-full">
            
            {/* 👤 การ์ด 1: ผู้แจ้งปัญหา */}
            <div className="bg-emerald-50/40 border-2 border-solid border-emerald-400 p-4 md:p-6 rounded-2xl md:rounded-[1.5rem] shadow-sm flex flex-col w-full transition-all hover:shadow-md">
              {/* หัวข้อ */}
              <span className="text-[13px] md:text-[16px] font-black text-emerald-700 mb-2 md:mb-4 flex items-center gap-1.5 md:gap-2 uppercase tracking-wider">
                <User className="w-4 h-4 md:w-5 md:h-5" /> ผู้แจ้งปัญหา
              </span>
              
              {/* ชื่อ */}
              <div className="flex items-center justify-between mb-3">
                <span className="font-black text-emerald-950 flex items-center gap-2 text-[16px] md:text-[22px]">
                  {String(t.reporter)}
                </span>
              </div>

              {/* 🌟 ฟันธง: เส้นประคั่น + มือถือแยกบรรทัด (flex-col) / PC ให้อยู่ซ้าย-ขวา (md:flex-row) */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mt-auto pt-3 border-t-[1.5px] border-dashed border-emerald-400/50 gap-3">
                <span className="text-[12px] md:text-[15px] font-bold text-blue-600 flex items-center gap-1.5">
                  <Clock className="w-3 h-3 md:w-4 md:h-4 text-emerald-600" />
                  {formatDateTimeString(t.date)}
                </span>
                {/* 🌟 ดันเบอร์โทรชิดขวา และบนมือถือให้หดพอดีตัว (w-fit) */}
                <a href={`tel:${String(t.reporterContact).replace(/\D/g, '')}`} className="font-mono text-[12px] md:text-[15px] font-bold bg-emerald-100 px-3 py-1.5 rounded-lg text-emerald-800 border border-emerald-300 shadow-sm hover:bg-emerald-200 transition-colors flex items-center gap-1.5 active:scale-95 w-fit md:w-auto">
                  <Phone className="w-3 h-3 md:w-4 md:h-4 text-emerald-600" />
                  {formatDisplayPhone(t.reporterContact)}
                </a>
              </div>
            </div>

            {/* 🛠️ การ์ด 2: ผู้รับผิดชอบหลัก */}
            <div className="bg-orange-50/40 border-2 border-solid border-orange-400 p-4 md:p-6 rounded-2xl md:rounded-[1.5rem] shadow-sm flex flex-col w-full transition-all hover:shadow-md">
              <span className="text-[13px] md:text-[16px] font-black text-orange-600 mb-2 md:mb-4 flex items-center gap-1.5 md:gap-2 uppercase tracking-wider">
                <Wrench className="w-4 h-4 md:w-5 md:h-5" /> ผู้รับผิดชอบหลัก
              </span>
              
              <div className="flex items-center justify-between mb-3">
                <span className="font-black text-orange-950 flex items-center gap-2 text-[16px] md:text-[22px]">
                  {t.techName ? String(t.techName) : "รอดำเนินการ"}
                </span>
              </div>

              {/* 🌟 ฟันธง: เส้นประคั่น + ดันเบอร์โทรไปขวาสุด (justify-end) */}
              <div className="flex flex-col md:flex-row md:items-center justify-end mt-auto pt-3 border-t-[1.5px] border-dashed border-orange-400/50 gap-3">
                {t.techPhone && t.techPhone !== '-' && t.techPhone !== 'N/A' ? (
                  <a href={`tel:${String(t.techPhone).replace(/\D/g, '')}`} className="font-mono text-[12px] md:text-[15px] font-bold bg-orange-100 px-3 py-1.5 rounded-lg text-orange-800 border border-orange-300 shadow-sm hover:bg-orange-200 transition-colors flex items-center gap-1.5 active:scale-95 w-fit md:w-auto self-start md:self-auto">
                    <Phone className="w-3 h-3 md:w-4 md:h-4 text-orange-600" />
                    {formatDisplayPhone(t.techPhone)}
                  </a>
                ) : (
                  <span className="font-mono text-[12px] md:text-[15px] text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 w-fit md:w-auto self-start md:self-auto">
                    {String(t.techPhone || 'N/A')}
                  </span>
                )}
              </div>
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
              theme = { bg: 'bg-sky-50/80', border: 'border-sky-400', textHead: 'text-sky-700', textName: 'text-sky-950', icon: 'text-sky-500', btnBg: 'bg-sky-100', btnBorder: 'border-sky-300', btnText: 'text-sky-800' };
            }

            return (
              <div className={`${theme.bg} border-2 border-solid ${theme.border} p-4 md:p-6 rounded-2xl md:rounded-[1.5rem] mt-4 shadow-sm w-full transition-all hover:shadow-md`}>
                <div className="flex flex-col">
                  {/* หัวข้อเวร SSC */}
                  <span className={`text-[13px] md:text-[16px] font-black ${theme.textHead} mb-2 md:mb-4 flex items-center gap-1.5 md:gap-2 uppercase tracking-wider`}>
                    <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 animate-pulse" /> เจ้าหน้าที่เวร SSC ประจำวันหยุด
                  </span>
                  
                  {/* ชื่อเวร SSC */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`font-black ${theme.textName} flex items-center gap-2 text-[16px] md:text-[22px]`}>
                      <User className={`w-4 h-4 md:w-5 md:h-5 ${theme.icon}`} />
                      {sscName || t.sscTechName || "ยังไม่ระบุเวร"}
                    </span>
                  </div>

                  {/* วันที่ และ เบอร์โทร */}
                  <div className={`flex flex-col md:flex-row md:items-center justify-between mt-auto pt-3 border-t-[1.5px] border-dashed ${theme.border.replace('border-', 'border-').replace('400', '300')} gap-3`}>
                    <span className={`text-[12px] md:text-[15px] font-bold ${theme.btnText} flex items-center gap-1.5`}>
                      <Clock className={`w-3 h-3 md:w-4 md:h-4 ${theme.icon}`} />
                      วันที่: {new Date(t.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    {(sscPhone || t.sscTechPhone) && (sscPhone || t.sscTechPhone) !== '-' && (
                      <a href={`tel:${String(sscPhone || t.sscTechPhone).replace(/\D/g, '')}`} className={`font-mono text-[12px] md:text-[15px] font-bold ${theme.btnBg} px-3 py-1.5 rounded-lg ${theme.btnText} border ${theme.btnBorder} shadow-sm transition-colors flex items-center gap-1.5 active:scale-95 w-fit md:w-auto`}>
                        <Phone className={`w-3 h-3 md:w-4 md:h-4 ${theme.icon}`} />
                        {formatDisplayPhone(sscPhone || t.sscTechPhone)}
                      </a>
                    )}
                  </div>

                  {/* 🌟 ฟันธง: เพิ่มข้อความเวร SSC ในกล่องนี้แหละ! สวยงาม คลีน! */}
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

        {/* ============================================ */}
                      </div>

                     {/* 🌟 โซนปุ่มกด Action (ขนาดบิ๊กเบิ้ม สำหรับช่าง) */}
                     {currentUserRole === 'technician' && !isCancelled && (
                        <div className="flex flex-col gap-2.5 md:gap-6 mt-4 md:mt-8">
                          {isPending && (
                            <button
                              onClick={() =>
                                setActionModal({
                                  isOpen: true,
                                  ticketId: t.id,
                                  type: 'accept',
                                })
                              }
                              className="w-full bg-gradient-to-r from-emerald-400 to-emerald-800 text-white border-2 border-solid border-orange-500 font-bold py-4 md:py-8 rounded-xl md:rounded-[2rem] shadow-[0_0_15px_rgba(16,185,129,0.4)] active:scale-95 transition-all text-[26px] md:text-[40px] hover:shadow-[0_0_25px_rgba(16,185,129,0.8)] hover:brightness-110 hover:-translate-y-1"
                            >
                              รับงานซ่อม
                            </button>
                          )}

                          {(t.status === 'pending' || t.status === 'acknowledged') &&
                            t.isOutOfHours &&
                            !t.sscNote && (
                              <button
                                onClick={() =>
                                  setActionModal({
                                    isOpen: true,
                                    ticketId: t.id,
                                    type: 'ssc',
                                  })
                                }
                                className="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white border border-orange-300 font-bold py-3.5 md:py-6 rounded-xl md:rounded-3xl shadow-[0_0_15px_rgba(249,115,22,0.4)] hover:shadow-[0_0_25px_rgba(249,115,22,0.6)] active:scale-95 transition-all text-[15px] md:text-[26px]"
                            >
                              เจ้าหน้าที่เวร SSC แก้ไขเบื้องต้น
                            </button>
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

                         {/* 🌟 โซนปุ่มดำเนินการต่อ / แจ้งขัดข้อง / ปิดงานซ่อม */}
                         {(t.status === 'in_progress' || t.status === 'on_hold') && (
                            <div className="flex gap-2.5 md:gap-6">
                              <button
                                onClick={() => {
                                  if (t.status === 'on_hold') {
                                    setActionModal({
                                      isOpen: true,
                                      ticketId: t.id,
                                      type: 'resume', 
                                    });
                                  } else {
                                    setActionModal({
                                      isOpen: true,
                                      ticketId: t.id,
                                      type: 'hold',
                                    });
                                  }
                                }}
                                className="flex-1 bg-gradient-to-r from-orange-400 to-orange-500 text-white border border-orange-300 font-bold py-3.5 md:py-6 rounded-xl md:rounded-3xl shadow-[0_0_15px_rgba(249,115,22,0.4)] active:scale-95 transition-all text-[18px] md:text-[30px] hover:shadow-[0_0_25px_rgba(249,115,22,0.8)] hover:brightness-110 hover:-translate-y-1"
                              >
                                {t.status === 'on_hold' ? 'ดำเนินการต่อ' : 'แจ้งขัดข้อง'}
                              </button>
                              
                              {/* 🌟 ฟันธง: ซ่อนปุ่มปิดงาน ถ้าสถานะคือ on_hold */}
                              {t.status !== 'on_hold' && (
                                <button
                                  onClick={() =>
                                    setActionModal({
                                      isOpen: true,
                                      ticketId: t.id,
                                      type: 'finish',
                                    })
                                  }
                                  className="flex-[1.5] bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border border-emerald-400 font-bold py-3.5 md:py-6 rounded-xl md:rounded-3xl shadow-[0_0_15px_rgba(16,185,129,0.4)] active:scale-95 transition-all text-[15px] md:text-[26px] hover:shadow-[0_0_25px_rgba(16,185,129,0.8)] hover:brightness-110 hover:-translate-y-1"
                                >
                                  ปิดงานซ่อม
                                </button>
                              )}
                            </div>
                          )} {/* <--- 🌟 ฟันธง! บรรทัด 3348 ต้องเป็นตัวนี้ครับ ถึงจะสมบูรณ์ 100% */}

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
                                <div className="bg-green-600/20 border-2 border-solid border-orange-800 text-rose-600 text-[14px] md:text-[22px] font-bold px-4 py-2.5 md:py-5 rounded-xl md:rounded-2xl flex items-center gap-2 md:gap-4 mb-1 md:mb-3">
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
                                  className="flex-[1] bg-orange text-rose-500 border border-orange-500 font-bold py-3.5 md:py-6 rounded-xl md:rounded-3xl flex justify-center items-center gap-1.5 md:gap-3 active:scale-95 text-[18px] md:text-[28px] transition-colors shadow-sm hover:bg-rose-50"
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
                            <div className="w-full bg-emerald-100 border-2 border-solid border-emerald-400 py-3.5 md:py-6 rounded-xl md:rounded-3xl flex justify-center items-center gap-2 md:gap-4 text-emerald-600 font-bold text-xs md:text-[30px] shadow-inner">
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
          {/* ================= สิ้นสุดการวางทับ ================= */}

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
              {/* 🛠️ เพิ่มไอคอนสำหรับโหมดดำเนินการซ่อมต่อ */}
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
        (activeTab === 'tracking' && currentUserRole === 'technician' ? 'shadow-[0_0_60px_-5px_rgba(6,182,212,1)] border-cyan-500/50' :
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
      <div className="bg-slate-900/50 backdrop-blur-xl pl-5 md:pl-8 pr-4 py-3 md:py-2.5 flex items-center justify-between sticky top-4 z-50 border-2 border-solid border-orange-500 rounded-2xl md:rounded-xl mt-4 md:mt-3 transition-all duration-500 shadow-[0_0_15px_rgba(249,115,22,0.4)] mx-4 md:mx-6">
        <div className="flex items-center gap-3.5 md:gap-4 z-10">
          
          {/* กล่องไอคอนซ้าย ปรับให้กระชับขึ้นบน PC จาก w-16 h-16 เป็น w-12 h-12 */}
          <div className="bg-white w-14 h-14 md:w-12 md:h-12 rounded-2xl md:rounded-xl shadow-md text-orange-500 border-2 border-solid border-orange-300 flex items-center justify-center shrink-0">
            {activeTab === 'dashboard' ? <LayoutDashboard className="w-8 h-8 md:w-6 md:h-6" strokeWidth={2.5} /> : activeTab === 'report' ? <PlusCircle className="w-8 h-8 md:w-6 md:h-6" strokeWidth={2.5} /> : currentUserRole === 'technician' ? <Wrench className="w-8 h-8 md:w-6 md:h-6" strokeWidth={2.5} /> : <ClipboardCheck className="w-8 h-8 md:w-6 md:h-6" strokeWidth={2.5} />}
          </div>
          
          <div>
            {/* ปรับขนาดตัวหนังสือหัวข้อบน PC จาก 4xl เป็น 2xl (md:text-2xl) ให้ดูเรียบหรู ไม่หนาเทอะทะ */}
          {/* จากเดิมที่ท่านใช้อยู่ ให้แก้เป็นก้อนนี้ครับ */}
            <h1 className="font-black text-white text-3xl md:text-5xl tracking-widest leading-none drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] py-2 whitespace-nowrap">
              {activeTab === 'dashboard' ? 'แผงควบคุม' : activeTab === 'report' ? 'แจ้งซ่อม' : currentUserRole === 'technician' ? 'จัดการงานซ่อม' : 'ติดตามสถานะ'}
          </h1>
          </div>
        </div>

       {/* 🌟 ฟันธงแก้ไขมาสคอต: คืนค่าพิกดและความกว้างฉบับสมบูรณ์ หัวไม่แหว่ง ตัวใหญ่สวยงามบน PC 1,000,000% */}
       <div className="relative w-12 md:w-28 h-14 md:h-16 shrink-0 z-50 pointer-events-none overflow-visible">
           <img 
             src={activeTab === 'dashboard' ? "/mascot-dashboard.webp" : activeTab === 'report' ? "/mascot-report.webp" : (activeTab === 'tracking' && currentUserRole === 'technician') ? "/mascot-tech.webp" : "/mascot-track.webp"}
             key={activeTab + currentUserRole}
             alt="GSE Mascot" 
             /* 💡 ทริคท่านหัวหน้า: ปรับความกว้างที่ md:w-[92px] และดึงน้องลงมาที่ md:bottom-[-35px] เพื่อไม่ให้หัวแหว่งครับ */
             className="absolute bottom-[-10px] right-[-10px] md:bottom-[-35px] md:right-[-5px] w-[65px] md:w-[85px] max-w-none h-auto object-contain drop-shadow-[0_5px_5px_rgba(0,0,0,0.4)] animate-in slide-in-from-right-4 fade-in duration-500 overflow-visible"
           />
        </div>
      </div>

      {/* 🎯 พื้นที่แสดงผลเนื้อหาภายในแอป */}
      <div 
        className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-28 md:px-6"
        style={{ overscrollBehavior: 'none', touchAction: 'pan-y' }}
      >
        {activeTab === 'dashboard' && currentUserRole === 'technician' && renderDashboard()}
        {activeTab === 'report' && renderReport()}
        {activeTab === 'tracking' && renderTracking()}
      </div>

      </div>

      {/* 🌟 ปิดกรอบเนื้อหาหลักของแอป */}

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

              <div className={`relative m-auto z-10 bg-slate-900 border-[3px] border-solid ${tColor.border} rounded-[2.5rem] w-[95%] max-w-[320px] sm:max-w-sm h-auto max-h-[calc(100dvh-130px)] overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] p-5 sm:p-8 text-center space-y-3 sm:space-y-4 animate-in zoom-in-95 duration-300 ${tColor.glow}`} onClick={(e) => e.stopPropagation()}>
              
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

{/* 🧭 Navigation Bar (ฟันธงข้อ 3 สเต็ปที่ 2: ฝังเอฟเฟกต์สไลด์หลบลงใต้จออัตโนมัติเมื่อไถจอลง) */}
{/* 🧭 Navigation Bar (ฟันธง: ขยายร่างเป็นจอ PC เต็มรูปแบบ) */}
{/* 🧭 Navigation Bar (ฟันธง: คืนค่าความกว้างเดิมให้ขนานกับกรอบบนสุด 100%) */}
<div className={`fixed left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] md:w-[calc(100%-3rem)] max-w-md md:max-w-[calc(72rem-3rem)] py-2 md:py-4 bg-slate-900/95 backdrop-blur-xl border-2 md:border-[3px] border-solid border-orange-500 rounded-2xl md:rounded-[2rem] z-[9999] shadow-[0_10px_30px_rgba(249,115,22,0.4)] md:shadow-[0_15px_40px_rgba(249,115,22,0.6)] transform-gpu transition-all duration-500 ease-in-out ${
  isNavVisible ? 'bottom-4 md:bottom-8 opacity-100 translate-y-0' : '-bottom-32 opacity-0 translate-y-full pointer-events-none'
}`}>
  
  <div className="w-full flex justify-evenly items-center px-1 md:px-8">
          
      {/* 🏠 ปุ่ม HOME */}
      <button onClick={onGoHome} className="flex flex-col items-center justify-center gap-1.5 md:gap-3 active:scale-95 transition-all shrink-0 group">
        <div className="p-2.5 md:p-4 rounded-full bg-transparent text-slate-400 group-hover:text-white transition-colors">
          <Home className="w-6 h-6 md:w-12 md:h-12" />
        </div>
        <span className="block text-[11px] md:text-[20px] font-black text-slate-400 group-hover:text-white tracking-widest whitespace-nowrap shrink-0 transition-colors">หน้าแรก</span>
      </button>

      {/* ================= โหมดผู้แจ้ง (Reporter) ================= */}
      {currentUserRole === 'reporter' && (
        <>
          {/* 🟠 ปุ่มแจ้งซ่อม */}
          <button onClick={() => setActiveTab('report')} className="flex flex-col items-center justify-center gap-1.5 md:gap-3 transition-all shrink-0 active:scale-95 group">
            <div className={`p-2.5 md:p-4 rounded-full transition-all ${activeTab === 'report' ? 'bg-gradient-to-b from-orange-400 to-orange-600 text-white shadow-[0_0_15px_rgba(249,115,22,0.8)] border-[2px] border-white scale-110' : 'bg-transparent text-slate-400 group-hover:text-orange-300'}`}>
              <PlusCircle className={`w-6 h-6 md:w-12 md:h-12 ${activeTab === 'report' ? 'stroke-[3px]' : ''}`} />
            </div>
            <span className={`block text-[11px] md:text-[20px] font-black tracking-widest whitespace-nowrap shrink-0 transition-all ${activeTab === 'report' ? 'text-orange-400 drop-shadow-md md:mt-1' : 'text-slate-400 group-hover:text-orange-300'}`}>แจ้งซ่อม</span>
          </button>

          {/* 🟠 ปุ่มติดตามสถานะ */}
          <button onClick={() => { setActiveTab('tracking'); setSearchTerm(''); }} className="flex flex-col items-center justify-center gap-1.5 md:gap-3 transition-all shrink-0 active:scale-95 group">
            <div className={`p-2.5 md:p-4 rounded-full transition-all ${activeTab === 'tracking' ? 'bg-gradient-to-b from-orange-400 to-orange-600 text-white shadow-[0_0_15px_rgba(249,115,22,0.8)] border-[2px] border-white scale-110' : 'bg-transparent text-slate-400 group-hover:text-orange-300'}`}>
              <ClipboardCheck className={`w-6 h-6 md:w-12 md:h-12 ${activeTab === 'tracking' ? 'stroke-[3px]' : ''}`} />
            </div>
            <span className={`block text-[11px] md:text-[20px] font-black tracking-widest whitespace-nowrap shrink-0 transition-all ${activeTab === 'tracking' ? 'text-orange-400 drop-shadow-md md:mt-1' : 'text-slate-400 group-hover:text-orange-300'}`}>ติดตามสถานะ</span>
          </button>
        </>
      )}

      {/* ================= โหมดช่าง (Technician) ================= */}
      {currentUserRole === 'technician' && (
        <>
          {/* 🟠 ปุ่มแผงควบคุม */}
          <button onClick={() => setActiveTab('dashboard')} className="flex flex-col items-center justify-center gap-1.5 md:gap-3 transition-all shrink-0 active:scale-95 group">
            <div className={`p-2.5 md:p-4 rounded-full transition-all ${activeTab === 'dashboard' ? 'bg-gradient-to-b from-orange-400 to-orange-600 text-white shadow-[0_0_15px_rgba(249,115,22,0.8)] border-[2px] border-white scale-110' : 'bg-transparent text-slate-400 group-hover:text-orange-300'}`}>
              <LayoutDashboard className={`w-6 h-6 md:w-12 md:h-12 ${activeTab === 'dashboard' ? 'stroke-[3px]' : ''}`} />
            </div>
            <span className={`block text-[11px] md:text-[20px] font-black tracking-widest whitespace-nowrap shrink-0 transition-all ${activeTab === 'dashboard' ? 'text-orange-400 drop-shadow-md md:mt-1' : 'text-slate-400 group-hover:text-orange-300'}`}>แผงควบคุม</span>
          </button>

           {/* 🟠 ปุ่มจัดการงานซ่อม */}
          <button onClick={() => setActiveTab('tracking')} className="flex flex-col items-center justify-center gap-1.5 md:gap-3 transition-all shrink-0 active:scale-95 group">
            <div className={`p-2.5 md:p-4 rounded-full transition-all ${activeTab === 'tracking' ? 'bg-gradient-to-b from-orange-400 to-orange-600 text-white shadow-[0_0_15px_rgba(249,115,22,0.8)] border-[2px] border-white scale-110' : 'bg-transparent text-slate-400 group-hover:text-orange-300'}`}>
              <Wrench className={`w-6 h-6 md:w-12 md:h-12 ${activeTab === 'tracking' ? 'stroke-[3px]' : ''}`} />
            </div>
            <span className={`block text-[11px] md:text-[20px] font-black tracking-widest whitespace-nowrap shrink-0 transition-all ${activeTab === 'tracking' ? 'text-orange-400 drop-shadow-md md:mt-1' : 'text-slate-400 group-hover:text-orange-300'}`}>จัดการงาน</span>
          </button>
        </>
      )}
    </div>
  </div>

      </div>
  );
}

// ==========================================
// 🌟 Landing Page - ฉบับสมบูรณ์ ไร้ Error 100%
// ==========================================
function LandingPage({ onStart }) {
  const [showManual, setShowManual] = useState(false); 
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden bg-slate-900 font-sans">
      {/* 1. ภาพพื้นหลังลูกโลก */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-45 pointer-events-none"
        style={{ backgroundImage: "url('/bg-earth-new.webp')" }}
      ></div>

      <div className="relative z-10 w-full max-w-md md:max-w-xl lg:max-w-2xl flex flex-col items-center animate-in slide-in-from-bottom-8 fade-in duration-1000">
        
      <div
          className="pt-8 pb-4 px-4 md:pt-14 md:pb-6 md:px-10 rounded-[1.5rem] md:rounded-[3rem] shadow-[0_0_80px_rgba(249,115,22,1)] flex flex-col items-center text-center w-full relative backdrop-blur-[2px] transition-all duration-500"
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.35)',
            border: '4px solid #FF4500',
          }}
        >
          {/* โลโก้ (ฟันธง: ใช้ md:-mt-6 ดึงโลโก้ขึ้นไปชิดขอบบน แต่ไม่ติดขอบ 100%) */}
          <div className="w-28 h-28 md:w-44 md:h-44 -mt-8 md:-mt-12 mb-10 md:mb-4 flex items-center justify-center transition-all duration-500">
            <img
              src="/GSE-logo.webp"
              alt="Logo"
              className="w-full h-full object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)] hover:scale-105 transition-transform duration-500" 
            />
          </div>

          {/* ชื่อระบบ 
          <h1 className="text-2xl md:text-5xl font-black text-white -mb-4 md:mb-4 drop-shadow-md transition-all duration-500">
            ระบบแจ้งซ่อม
          </h1> */}

          {/* 🌟 3. โซนน้องมาสคอต + กล่องคำพูด */}
          <div className="relative w-full -mt-6 md:mt-4 flex flex-col items-center min-h-[220px] md:min-h-[300px] transition-all duration-500">            
            
            {/* 💬 กล่องคำพูด (โปร่งแสงแบบกระจก + ติ่งสามเหลี่ยมโค้งมน) */}
            <div className="relative z-20 bg-slate-900/80 backdrop-blur-md rounded-3xl md:rounded-[2rem] p-2 md:p-6 shadow-[0_15px_40px_rgba(249,115,22,0.8)] text-center border-[2px] border-solid border-orange-500 mb-1 md:mb-4 animate-bounce">
              
              {/* 🌟 ฟันธง: ติ่งสามเหลี่ยมใช้เทคนิค CSS หมุนกล่องให้โค้งมน เนียนกริบ 100% */}
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-[11px] w-5 h-5 bg-slate-900 border-b-[2px] border-r-[2px] border-solid border-orange-500 transform rotate-45 rounded-sm"></div>

              <p className="text-[20px] md:text-[22px] font-bold text-slate-100 leading-relaxed relative z-20 shadow-none">
                ระบบ/อุปกรณ์มีปัญหาใช่มั้ยคะ?
                <br />
                <span className="text-orange-500 font-black text-[16px] md:text-[22px] mt-1 md:mt-2 inline-flex items-center justify-center gap-2 drop-shadow-sm whitespace-nowrap">
                  กดแจ้งซ่อมได้เลยค่ะ!
                  <span className="text-[30px] md:text-[45px] leading-[0] block transform translate-y-1 md:translate-y-2 drop-shadow-md">👇</span>
                </span>
              </p>
            </div>

            {/* 👩‍🔧 น้องมาสคอต (ฟันธงวิชามาร: ล็อกกุญแจมือด้วย style= ยัดลง HTML ตรงๆ Chrome แหกไม่ได้ 100%) */}
            <div 
              className="relative z-30 mx-auto mb-2 md:mb-4 pointer-events-none drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)] transition-all duration-500"
              style={{ width: '50%', maxWidth: '280px', minHeight: '150px' }} 
            >
              <img
                src="/mascot.webp"
                alt="Mascot"
                className="w-full h-auto object-contain object-bottom hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

         {/* 4. กลุ่มปุ่มกด (ฟันธง: ลด gap-4 เหลือ gap-2.5 สำหรับมือถือ และลด md:gap-6 เหลือ md:gap-3.5 สำหรับ PC เพื่อดึงปุ่มให้กระชับเข้าหากันตามหลัก Law of Proximity) */}
         <div className="w-full flex flex-col gap-2.5 md:gap-3.5 relative z-10 transition-all duration-500">
            
            {/* ปุ่ม 1: ส้ม-ทอง (Primary Action) */}
            <button
              onClick={() => onStart('reporter')}
              className="w-full pt-4 md:py-6 pb-5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-[19px] md:text-[28px] rounded-2xl md:rounded-[1.5rem] flex items-center justify-center gap-5 md:gap-3 border-[2px] border-solid border-white/80 shadow-[0_15px_30px_rgba(249,115,22,0.5)] hover:shadow-[0_15px_35px_rgba(249,115,22,0.8)] active:scale-95 transition-all"
            >
              <Wrench size={28} className="drop-shadow-md md:w-9 md:h-9" />{' '}
              แจ้งซ่อมระบบ/อุปกรณ์
            </button>

            {/* ปุ่ม 2: เขียวมรกต (Admin Action) */}
            <button
              onClick={() => onStart('technician')}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-lg md:text-[22px] py-3 md:py-6 rounded-2xl md:rounded-[1.5rem] border-[2px] border-solid border-white/50 flex items-center justify-center gap-5 md:gap-3 shadow-[0_10px_20px_rgba(16,185,129,0.5)] hover:shadow-[0_15px_25px_rgba(16,185,129,0.8)] active:scale-95 transition-all"
            >
              <Settings size={25} className="md:w-8 md:h-8 drop-shadow-sm" />{' '}
              สำหรับเจ้าหน้าที่ ฝวด.
            </button>

            {/* ปุ่ม 3: ม่วง-ชมพู (Secondary Action) */}
            <button
              onClick={() => setShowManual(true)} 
              className="w-full bg-gradient-to-r from-rose-700 to-purple-800 text-white text-[18px] md:text-[20px] font-bold py-3 md:py-5 rounded-2xl md:rounded-[1.5rem] border-[2px] border-solid border-white/40 flex items-center justify-center gap-5 md:gap-3 shadow-[0_10px_20px_rgba(225,29,72,0.5)] hover:shadow-[0_15px_25px_rgba(225,29,72,0.8)] active:scale-95 transition-all"
            >
              <FileText size={20} className="md:w-7 md:h-7 drop-shadow-sm" /> คู่มือการใช้งานเบื้องต้น
            </button>
          </div>

          {/* 🌟 1. ฟันธง: เปลี่ยนเป็นสีฟ้าสว่าง (Cyan) พร้อมเอฟเฟกต์เรืองแสงทะลุอวกาศ */}
          <h2 className="text-[16px] md:text-[28px] font-black text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.8)] uppercase mt-4 md:mt-8 mb-1.5 md:mb-2 transition-all duration-500 tracking-wide">
            ฝ่ายวิศวกรรมระบบปฏิบัติการดาวเทียม
          </h2>

          {/* 🌟 ฟันธง: เปลี่ยนเป็นสีขาวมุกเรืองแสง (Pearl White Glow) หรูหรา เป็นจุดพักสายตา */}
          <h3 className="text-[14px] md:text-[18px] font-bold text-white tracking-widest mt-1 transition-all duration-500 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
            สำนักปฏิบัติการดาวเทียม
          </h3>

          {/* 🌟 2. ฟันธง: ลูกเล่นตัวนำ G S E D ใหญ่พิเศษสีส้มทอง ตัดกับสีฟ้าด้านบน */}
          <h3 className="font-mono text-slate-300 tracking-widest font-bold mt-5 md:mt-10 opacity-95 flex items-baseline justify-center flex-wrap gap-x-1.5 gap-y-1">
            <span className="text-[10px] md:text-[14px]">©2026</span>
            <span>
              <span className="text-[16px] md:text-[22px] text-orange-500 font-black drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]">G</span>
              <span className="text-[10px] md:text-[14px]">round</span>
            </span>
            <span>
              <span className="text-[16px] md:text-[22px] text-orange-500 font-black drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]">S</span>
              <span className="text-[10px] md:text-[14px]">ystem</span>
            </span>
            <span>
              <span className="text-[16px] md:text-[22px] text-orange-500 font-black drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]">E</span>
              <span className="text-[10px] md:text-[14px]">ngineering:</span>
            </span>
            <span className="text-[15px] md:text-[20px] text-orange-400 font-black drop-shadow-[0_0_10px_rgba(249,115,22,1)] ml-1">
              GSE
            </span>
          </h3>
        </div>
      </div>


    {/* 🌟 หน้าต่าง Popup คู่มือ (อัปเกรดขยายกรอบบน-ล่างให้เต็มจอมือถือ) */}
      {/* 🌟 หน้าต่าง Popup คู่มือ (อัปเกรดขยายกรอบบน-ล่างให้เต็มจอมือถือ + ซูมได้ 100%) */}
      {showManual && (
        <div className="fixed inset-0 z-[200] bg-slate-950/90 flex flex-col items-center justify-center p-2 md:p-4 backdrop-blur-md animate-in fade-in" onClick={() => setShowManual(false)}>
          
          <div className="absolute w-[300px] h-[300px] bg-orange-500/40 rounded-full blur-[100px] animate-pulse pointer-events-none z-0"></div>

          <div className="w-full max-w-lg md:max-w-4xl bg-slate-900 border-[3px] md:border-[4px] border-solid border-orange-500 rounded-2xl md:rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(249,115,22,0.6)] flex flex-col max-h-[96vh] md:max-h-[90vh] relative z-10 transition-all" onClick={(e) => e.stopPropagation()}>
            
            {/* 🌟 1. ส่วนหัว (Header) แยก ซ้าย-กลาง-ขวา ชัดเจน */}
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

            {/* 🌟 2. โซนแสดงรูปภาพคู่มือ (อัปเกรด: กดรูปเพื่อซูมขยาย) */}
            <div className="p-4 md:p-8 overflow-y-auto space-y-6 md:space-y-10 bg-slate-800 flex-1">
              
           {/* อาเรย์รูปภาพคู่มือ (ลูปเพื่อสร้างปุ่มขยายทีละรูปอัตโนมัติ) */}
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
                  
                  {/* 🖼️ รูปภาพคู่มือ (ไม่มีปุ่มไปบังทับแล้ว) */}
                  <img src={manual.src} alt={manual.alt} className="w-full rounded-xl md:rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.6)] border-[2px] border-solid border-slate-600 transition-opacity" />
                  
                  {/* 🌟 ปุ่ม "คลิกเพื่อถ่างซูม" (อัปเกรด: ย้ายมาจัดเรียงใต้รูปภาพ ทรงแคปซูลสวยหรู) */}
                  <a href={manual.src} target="_blank" rel="noopener noreferrer" 
                     className="w-[85%] sm:w-[60%] md:w-[40%] bg-slate-900 border-[2px] border-solid border-orange-500/80 text-orange-400 p-3 md:p-4 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.4)] backdrop-blur-sm transition-all active:scale-95 flex items-center justify-center gap-2 z-20 hover:bg-orange-500 hover:text-white hover:border-white hover:scale-105 group">
                    <Maximize2 size={18} className="md:w-6 md:h-6 drop-shadow-md group-hover:scale-125 transition-transform" strokeWidth={2.5}/>
                    <span className="text-[13px] md:text-[16px] font-black tracking-widest uppercase drop-shadow-md">แตะเพื่อขยายซูมเต็มจอ</span>
                  </a>
                  
                </div>
              ))}
              
              {/* ติ่งข้อความปิดท้ายคู่มือ */}
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
      letter-spacing: 0.02em !important; /* จัดช่องไฟของ Sarabun ให้ละมุนสายตา */
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

  const handleGoHome = () => {
    setHasStarted(false);
    sessionStorage.removeItem('hasStarted');
    sessionStorage.removeItem('activeTab');
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