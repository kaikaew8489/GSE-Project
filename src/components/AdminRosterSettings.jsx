import React, { useState, useEffect } from 'react';
import { XCircle, ClipboardList, AlertTriangle, Calendar, CheckCircle2, Save, ChevronRight, RotateCcw, Wrench, User, Phone } from 'lucide-react';
import { collection, doc, writeBatch, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebaseConfig';
import { technicianList, fixedHolidays, dynamicHolidays } from '../lib/systemData';
import { formatDisplayPhone } from '../lib/utils';

// 🌟 ย้ายสมองกลคำนวณวันหยุดมาไว้ที่นี่โดยตรง
const getHolidayName = (year, month, day) => {
  const mmdd = `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  if (fixedHolidays[mmdd]) return fixedHolidays[mmdd];
  if (dynamicHolidays[year] && dynamicHolidays[year][mmdd]) return dynamicHolidays[year][mmdd];
  return ""; 
};

export default function AdminRosterSettings({ onClose }) {
  const [selectedYear, setSelectedYear] = useState(() => new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().getMonth() + 1);
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [rosterData, setRosterData] = useState({}); 
  const [loading, setLoading] = useState(false);

  const [isMonthModalOpen, setIsMonthModalOpen] = useState(false);
  const [isYearModalOpen, setIsYearModalOpen] = useState(false);
  const [selectingTechForDate, setSelectingTechForDate] = useState(null);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: null });
  
  const [isEditMode, setIsEditMode] = useState(false);

  const monthsThai = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
  const yearsList = [2026, 2027, 2028, 2029, 2030];

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
        } else {
          batch.delete(docRef); 
        }
      });
      await batch.commit(); 
      setModalConfig({ isOpen: false, type: null });
      fetchCurrentMonthRoster(); 
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
              <ChevronRight className="w-5 h-5 opacity-70 rotate-90" />
            </button>
            <button onClick={() => setIsYearModalOpen(true)} className="w-full md:w-36 bg-slate-800 text-orange-400 font-black px-3 py-3 md:py-3.5 rounded-xl border-[2px] border-solid border-orange-500/50 text-[16px] md:text-[18px] flex justify-between items-center hover:bg-slate-700 hover:border-orange-400 transition-all shadow-[0_0_15px_rgba(249,115,22,0.5)] outline-none">
              <span className="flex-1 text-center">พ.ศ. {selectedYear + 543}</span>
              <ChevronRight className="w-5 h-5 opacity-70 rotate-90" />
            </button>
          </div>
          <div className="overflow-y-auto px-1 space-y-4 pb-4 pt-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex-1 border-y-2 border-orange-500/20 my-2">
            {(() => {
              const activeRosters = Object.values(rosterData).filter(info => info.techName && info.techName.trim() !== '').sort((a, b) => a.dateStr.localeCompare(b.dateStr));
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
                  rowClass = "border-orange-500/80 shadow-[0_0_15px_rgba(249,115,22,0.3)]";
                  nameColor = "text-orange-400";
                  subText = info.holidayName || "วันหยุดพิเศษ";
                  subTextColor = "text-orange-400";
                  dotColor = "bg-orange-500";
                } else if (dayOfWeek === 0) { 
                  rowClass = "border-rose-500/80 shadow-[0_0_15px_rgba(225,29,72,0.3)]";
                  nameColor = "text-rose-400";
                  subText = "วันอาทิตย์";
                  subTextColor = "text-rose-400";
                  dotColor = "bg-rose-500";
                } else if (dayOfWeek === 6) { 
                  rowClass = "border-sky-500/80 shadow-[0_0_15px_rgba(14,165,233,0.3)]";
                  nameColor = "text-sky-400";
                  subText = "วันเสาร์";
                  subTextColor = "text-sky-400";
                  dotColor = "bg-sky-500";
                } else { 
                  rowClass = "border-cyan-500/80 shadow-[0_0_15px_rgba(6,182,212,0.3)]";
                  nameColor = "text-cyan-400";
                  subText = ""; 
                }
                return (
                  <div key={idx} className={`flex items-center justify-between p-4 rounded-xl border-[2px] bg-slate-800 transition-all ${rowClass}`}>
                    <div className="flex items-center gap-4">
                      <span className={`flex items-center justify-center w-12 h-12 rounded-xl border-[2px] font-black text-[18px] transition-all duration-300 ${getDateBadgeClass(dayOfWeek, info.isHoliday, true)}`}>
                        {dayNum}
                      </span>
                      <div className="flex flex-col justify-center">
                        <p className={`font-black text-[15px] md:text-[17px] ${nameColor}`}>{info.techName}</p>
                        {subText && (
                          <p className={`text-[12px] md:text-[13px] font-bold mt-0.5 flex items-center gap-1.5 ${subTextColor}`}>
                            <span className={`w-2 h-2 rounded-full animate-pulse ${dotColor}`}></span>{subText}
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
            <button onClick={() => { if(onClose) onClose(); }} className="flex-1 py-3.5 rounded-xl font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 transition-all border border-slate-600 shadow-sm">
              ยกเลิก
            </button>
            <button onClick={() => setIsEditMode(true)} className="flex-[1.5] py-3.5 rounded-xl font-black text-white bg-gradient-to-r from-orange-400 to-amber-400 border-2 border-solid border-white scale-105 shadow-[0_0_20px_rgba(249,115,22,0.6)] active:scale-95 transition-all duration-300 hover:from-orange-500 hover:to-orange-600">
              จัดตารางเวร ✏️
            </button>
          </div>
        </div>
      ) : (
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
              <button onClick={() => setIsMonthModalOpen(true)} className="w-full md:w-44 bg-slate-800 text-orange-400 font-black px-3 py-3 md:py-3.5 rounded-xl border-[2px] border-solid border-orange-500/50 text-[16px] md:text-[18px] flex justify-between items-center hover:bg-slate-700 hover:border-orange-400 transition-all shadow-[0_0_15px_rgba(249,115,22,0.2)] outline-none">
                <span className="flex-1 text-center">{monthsThai[selectedMonth - 1]}</span>
                <ChevronRight className="w-5 h-5 opacity-70 rotate-90" />
              </button>
              <button onClick={() => setIsYearModalOpen(true)} className="w-full md:w-36 bg-slate-800 text-orange-400 font-black px-3 py-3 md:py-3.5 rounded-xl border-[2px] border-solid border-orange-500/50 text-[16px] md:text-[18px] flex justify-between items-center hover:bg-slate-700 hover:border-orange-400 transition-all shadow-[0_0_15px_rgba(249,115,22,0.2)] outline-none">
                <span className="flex-1 text-center">พ.ศ. {selectedYear + 543}</span>
                <ChevronRight className="w-5 h-5 opacity-70 rotate-90" />
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
                          <span className={`inline-flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-xl border-[2px] transition-all duration-300 text-[16px] md:text-[20px] font-black ${dateBadgeClass}`}>{d.dayNum}</span>
                        </td>
                        <td className="py-3 pr-2 pl-2 md:px-4 flex flex-col md:table-cell gap-2">
                          <button onClick={() => setSelectingTechForDate(d.dateStr)} className={`w-full font-bold px-4 py-3 md:py-3.5 rounded-xl border border-solid transition-all text-left flex justify-between items-center outline-none text-[13px] md:text-[15px] ${selectColorClass}`}>
                            <span className="truncate">{currentInfo.techName || '-- โปรดเลือกผู้ปฏิบัติงาน --'}</span>
                            <ChevronRight className="w-4 h-4 ml-2 opacity-70 rotate-90" />
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

          <div className="flex flex-row justify-between items-stretch gap-2 md:gap-4 pt-3 mt-2 w-full">
            <button onClick={() => setIsEditMode(false)} className="flex-[0.8] md:flex-[1] bg-slate-900 text-cyan-400 hover:text-white hover:bg-cyan-900/60 font-black py-2.5 md:py-3.5 rounded-xl border-[2px] border-solid border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] active:scale-95 transition-all duration-300 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
              <ChevronRight className="w-5 h-5 md:w-5 md:h-5 rotate-180" /> <span className="text-[11px] md:text-[14px] leading-none md:leading-normal">ย้อนกลับ</span>
            </button>
            <button onClick={() => setModalConfig({ isOpen: true, type: 'clear' })} className="flex-[0.8] md:flex-[1] bg-slate-900 text-rose-500 hover:text-white hover:bg-rose-600 font-black py-2.5 md:py-3.5 rounded-xl border-[2px] border-solid border-rose-500/50 shadow-[0_0_15px_rgba(225,29,72,0.3)] hover:shadow-[0_0_25px_rgba(225,29,72,0.6)] active:scale-95 transition-all duration-300 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
              <RotateCcw className="w-5 h-5 md:w-5 md:h-5" /> <span className="text-[11px] md:text-[14px] leading-none md:leading-normal">ล้างข้อมูล</span>
            </button>
            <button onClick={() => setModalConfig({ isOpen: true, type: 'save' })} disabled={activeRecordsCount === 0} className={`flex-[1.5] font-black py-2.5 md:py-3.5 rounded-xl transition-all duration-300 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 ${activeRecordsCount === 0 ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed grayscale' : 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.5)] hover:shadow-[0_0_40px_rgba(249,115,22,0.8)] active:scale-95 border-2 border-white'}`}>
              <Save className="w-5 h-5 md:w-5 md:h-5" /> <span className="text-[11px] md:text-[15px] leading-none md:leading-normal text-center">{activeRecordsCount === 0 ? 'ไม่มีข้อมูล' : 'บันทึกเวร'}</span>
            </button>
          </div>
        </div>
      )}

      {isMonthModalOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overscroll-none">
          <div className="relative bg-slate-900 border-[3px] border-orange-500 rounded-3xl w-full max-w-sm p-6 shadow-[0_0_90px_rgba(249,115,22,0.6)] flex flex-col">
            <div className="flex justify-between items-center mb-5 border-b border-orange-500/30 pb-3">
              <h3 className="text-lg font-black text-orange-400 flex items-center gap-2"><Calendar className="w-5 h-5" /> เลือกเดือน</h3>
              <button onClick={() => setIsMonthModalOpen(false)} className="text-orange-500 hover:text-white bg-slate-900 animate-pulse p-1.5 md:p-2 rounded-full transition-all border border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.7)] hover:shadow-[0_0_20px_rgba(249,115,22,1)] cursor-pointer"><XCircle className="w-6 h-6" /></button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {monthsThai.map((m, idx) => (
                <button key={idx} onClick={() => { setSelectedMonth(idx + 1); setIsMonthModalOpen(false); }} className={`py-3.5 rounded-2xl font-black border-[2px] transition-all duration-200 text-[13px] md:text-[14px] active:scale-95 ${selectedMonth === idx + 1 ? 'bg-gradient-to-br from-orange-500 to-red-600 text-white border-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.5)]' : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-orange-500/60 hover:bg-slate-700 hover:text-orange-400'}`}>{m}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {isYearModalOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overscroll-none">
          <div className="relative bg-slate-900 border-[3px] border-orange-500 rounded-3xl w-full max-w-xs p-6 shadow-[0_0_90px_rgba(249,115,22,0.6)] flex flex-col">
            <div className="flex justify-between items-center mb-5 border-b border-orange-500/30 pb-3">
              <h3 className="text-lg font-black text-orange-400 flex items-center gap-2"><Calendar className="w-5 h-5" /> เลือกปี พ.ศ.</h3>
              <button onClick={() => setIsYearModalOpen(false)} className="text-orange-500 hover:text-white bg-slate-900 animate-pulse p-1.5 md:p-2 rounded-full transition-all border border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.7)] hover:shadow-[0_0_20px_rgba(249,115,22,1)] cursor-pointer"><XCircle className="w-6 h-6" /></button>
            </div>
            <div className="flex flex-col gap-3">
              {yearsList.map((y) => (
                <button key={y} onClick={() => { setSelectedYear(y); setIsYearModalOpen(false); }} className={`w-full relative py-4 rounded-2xl font-black border-[2px] transition-all duration-200 text-[15px] active:scale-95 ${selectedYear === y ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white border-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.5)]' : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-orange-500/60 hover:bg-slate-700 hover:text-orange-400'}`}>
                  <span className="flex-1 text-center">พ.ศ. {y + 543}</span>
                  {selectedYear === y && <CheckCircle2 className="w-5 h-5 text-white absolute right-5 top-1/2 -translate-y-1/2" />}
                </button>
              ))}
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
            <h3 className="text-2xl font-black text-white mb-2">{modalConfig.type === 'save' ? 'ยืนยันการบันทึก?' : 'ยืนยันการล้างข้อมูล?'}</h3>
            <p className="text-slate-400 text-[14px] font-bold mb-6">{modalConfig.type === 'save' ? 'ระบบจะทำการบันทึกตารางเวร ประจำเดือนนี้ และอัปเดตข้อมูลทั้งหมดทันที' : 'ข้อมูลบนหน้าจอนี้จะถูกล้างออก เพื่อให้คุณเริ่มต้นจัดเวรใหม่ (ข้อมูลในระบบจะยังไม่หายไปจนกว่าจะกดบันทึก)'}</p>
            <div className="flex gap-3">
              <button onClick={() => setModalConfig({ isOpen: false, type: null })} className="flex-1 py-3 rounded-xl font-black text-slate-300 bg-slate-800 hover:bg-slate-700 transition-all border border-slate-600">ยกเลิก</button>
              <button onClick={modalConfig.type === 'save' ? executeSave : executeClear} disabled={loading} className={`flex-1 py-3 rounded-xl font-black text-white transition-all shadow-lg active:scale-95 ${modalConfig.type === 'save' ? 'bg-orange-600 hover:bg-orange-500 shadow-orange-500/40' : 'bg-rose-600 hover:bg-rose-500 shadow-rose-500/40'}`}>
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
              <h3 className="text-[16px] md:text-lg font-black text-cyan-300 flex items-center gap-2 drop-shadow-[0_0_15px_rgba(34,211,238,0.9)]"><User className="w-5 h-5" /> เลือกผู้ปฏิบัติงาน</h3>
              <button onClick={() => setSelectingTechForDate(null)} className="text-rose-500 hover:text-white animate-pulse bg-slate-900 hover:bg-rose-600 p-1.5 md:p-2 rounded-full transition-all duration-300 border-[2px] border-rose-500 shadow-[0_0_20px_rgba(225,29,72,0.8)] hover:shadow-[0_0_35px_rgba(225,29,72,1)] cursor-pointer"><XCircle className="w-6 h-6 md:w-7 md:h-7" /></button>
            </div>
            <div className="overflow-y-auto pr-1 space-y-3 pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pt-1">
              <button onClick={() => { handleTechChange(selectingTechForDate, ''); setSelectingTechForDate(null); }} className="w-full text-center px-4 py-3.5 rounded-xl font-black border-[2px] transition-all duration-300 bg-slate-900/50 text-rose-400 border-rose-500/60 shadow-[0_0_15px_rgba(225,29,72,0.3)] hover:border-rose-400 hover:text-white hover:bg-rose-900/60 hover:shadow-[0_0_35px_rgba(225,29,72,0.9)]">
                -- ยกเลิกเวร / ไม่ระบุ --
              </button>
              {technicianList.map((t, idx) => {
                const isSelected = rosterData[selectingTechForDate]?.techName === t.name;
                return (
                  <button key={idx} onClick={() => { handleTechChange(selectingTechForDate, t.name); setSelectingTechForDate(null); }} className={`w-full text-left px-4 py-4 rounded-xl font-black border-[2px] transition-all duration-300 flex justify-between items-center active:scale-95 ${isSelected ? 'bg-orange-900/40 text-orange-400 border-orange-400 shadow-[0_0_30px_rgba(249,115,22,0.8),inset_0_0_15px_rgba(249,115,22,0.4)]' : 'bg-slate-900/80 text-cyan-100 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:bg-emerald-500/20 hover:border-emerald-400 hover:text-white hover:shadow-[0_0_35px_rgba(16,185,129,1)]'}`}>
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